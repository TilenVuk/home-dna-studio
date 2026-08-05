import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { buildBookingSchedule } from "./bookingSlots";
import type { ReservationData } from "./booking.functions";

function isUniqueViolation(error: { code?: string; message?: string }): boolean {
  return error.code === "23505" || error.message?.toLowerCase().includes("duplicate key") === true;
}

export async function getAvailableConsultationSchedule() {
  const schedule = buildBookingSchedule();
  const firstSlot = schedule.slots.at(0)?.start;
  const lastSlot = schedule.slots.at(-1)?.start;

  if (!firstSlot || !lastSlot) return schedule;

  const { data, error } = await supabaseAdmin
    .from("consultation_bookings")
    .select("slot_start")
    .eq("status", "booked")
    .gte("slot_start", firstSlot)
    .lte("slot_start", lastSlot);

  if (error) {
    console.error("Booking: availability query failed", error.message);
    throw new Error("BOOKING_AVAILABILITY_UNAVAILABLE");
  }

  const reserved = new Set(
    (data ?? []).map((booking) => new Date(booking.slot_start).toISOString()),
  );

  return {
    ...schedule,
    slots: schedule.slots.filter((slot) => !reserved.has(slot.start)),
  };
}

export async function reserveConsultation(input: ReservationData) {
  const requestedStart = new Date(input.slotStart).toISOString();
  const schedule = buildBookingSchedule();
  const validSlot = schedule.slots.find((slot) => slot.start === requestedStart);

  if (!validSlot) throw new Error("BOOKING_INVALID_SLOT");

  const { data, error } = await supabaseAdmin
    .from("consultation_bookings")
    .insert({
      slot_start: validSlot.start,
      slot_end: validSlot.end,
      consultation_type: input.consultationType,
      source: input.source,
      customer_name: input.contact.name,
      customer_email: input.contact.email.toLowerCase(),
      customer_phone: input.contact.phone,
      project_type: input.contact.projectType,
      message: input.contact.message,
    })
    .select("id, slot_start, slot_end, consultation_type")
    .single();

  if (error) {
    if (isUniqueViolation(error)) throw new Error("BOOKING_SLOT_TAKEN");
    console.error("Booking: reservation insert failed", error.message);
    throw new Error("BOOKING_RESERVATION_FAILED");
  }

  return {
    bookingId: data.id,
    slotStart: data.slot_start,
    slotEnd: data.slot_end,
    consultationType: data.consultation_type,
  };
}
