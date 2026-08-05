import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { BookingSchedule } from "./bookingSlots";

const ContactInput = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().default(""),
  projectType: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().max(1500).optional().default(""),
});

const ReservationInput = z.object({
  slotStart: z.string().datetime({ offset: true }),
  consultationType: z.enum(["online", "home-visit"]),
  source: z.enum(["contact", "home-dna"]),
  contact: ContactInput,
});

export type ConsultationType = z.infer<typeof ReservationInput>["consultationType"];
export type BookingSource = z.infer<typeof ReservationInput>["source"];
export type ReservationData = z.infer<typeof ReservationInput>;
export type ConsultationSchedule = BookingSchedule;

export const getConsultationSchedule = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({}).parse(input))
  .handler(async (): Promise<ConsultationSchedule> => {
    const { getAvailableConsultationSchedule } = await import("./booking.server");
    return getAvailableConsultationSchedule();
  });

export const reserveConsultationSlot = createServerFn({ method: "POST" })
  .validator((input: unknown) => ReservationInput.parse(input))
  .handler(async ({ data }) => {
    const { reserveConsultation } = await import("./booking.server");
    return reserveConsultation(data);
  });
