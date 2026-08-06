import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  Monitor,
  RefreshCw,
} from "lucide-react";
import {
  getConsultationSchedule,
  reserveConsultationSlot,
  type BookingSource,
  type ConsultationSchedule,
  type ConsultationType,
} from "@/lib/booking.functions";
import { addCalendarDays, BOOKING_TIME_ZONE } from "@/lib/bookingSlots";

export interface BookingContact {
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  message?: string;
}

interface BookingCalendarProps {
  contact: BookingContact;
  source: BookingSource;
  initialConsultationType?: ConsultationType;
  heading?: string;
  description?: string;
  className?: string;
}

interface Confirmation {
  slotStart: string;
  consultationType: ConsultationType;
  customerEmailStatus: "pending" | "sent" | "failed";
  internalEmailStatus: "pending" | "sent" | "failed";
}


const dateFormatter = new Intl.DateTimeFormat("sl-SI", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const timeFormatter = new Intl.DateTimeFormat("sl-SI", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: BOOKING_TIME_ZONE,
});

const confirmationFormatter = new Intl.DateTimeFormat("sl-SI", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: BOOKING_TIME_ZONE,
});

function calendarDate(dateKey: string): Date {
  return new Date(`${dateKey}T12:00:00.000Z`);
}

function formatWeekRange(weekStart: string): string {
  const weekEnd = addCalendarDays(weekStart, 4);
  const start = new Intl.DateTimeFormat("sl-SI", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(calendarDate(weekStart));
  const end = new Intl.DateTimeFormat("sl-SI", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(calendarDate(weekEnd));
  return `${start}–${end}`;
}

export function BookingCalendar({
  contact,
  source,
  initialConsultationType = "online",
  heading = "Izberite termin za uvodni posvet",
  description = "Vsak teden je na voljo 10–14 enournih terminov. Izberite način srečanja, datum in uro.",
  className = "",
}: BookingCalendarProps) {
  const getSchedule = useServerFn(getConsultationSchedule);
  const reserveSlot = useServerFn(reserveConsultationSlot);
  const [schedule, setSchedule] = useState<ConsultationSchedule | null>(null);
  const [weekIndex, setWeekIndex] = useState(0);
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [consultationType, setConsultationType] =
    useState<ConsultationType>(initialConsultationType);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const started = useRef(false);

  const loadSchedule = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await getSchedule({ data: {} });
      setSchedule(result);
      setWeekIndex((current) => Math.min(current, Math.max(result.weekStarts.length - 1, 0)));
      return true;
    } catch (loadError) {
      console.error(loadError);
      setError("Prostih terminov trenutno ni bilo mogoče naložiti.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [getSchedule]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void loadSchedule();
  }, [loadSchedule]);

  const activeWeek = schedule?.weekStarts[weekIndex];
  const activeDays = useMemo(
    () =>
      activeWeek ? Array.from({ length: 5 }, (_, index) => addCalendarDays(activeWeek, index)) : [],
    [activeWeek],
  );

  const slotsByDay = useMemo(() => {
    const result = new Map<string, ConsultationSchedule["slots"]>();
    for (const day of activeDays) result.set(day, []);

    for (const slot of schedule?.slots ?? []) {
      if (slot.weekStart !== activeWeek) continue;
      result.get(slot.localDate)?.push(slot);
    }

    return result;
  }, [activeDays, activeWeek, schedule]);

  const handleReserve = async () => {
    if (!selectedStart || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const result = await reserveSlot({
        data: {
          slotStart: selectedStart,
          consultationType,
          source,
          contact: {
            name: contact.name,
            email: contact.email,
            phone: contact.phone ?? "",
            projectType: contact.projectType ?? "",
            message: contact.message ?? "",
          },
        },
      });
      setConfirmation({
        slotStart: result.slotStart,
        consultationType: result.consultationType as ConsultationType,
        customerEmailStatus: result.customerEmailStatus,
        internalEmailStatus: result.internalEmailStatus,
      });

    } catch (reservationError) {
      console.error(reservationError);
      setSelectedStart(null);
      const refreshed = await loadSchedule();
      if (refreshed) {
        setError(
          "Termina ni bilo mogoče potrditi. Morda ga je pravkar rezerviral drug obiskovalec; seznam je osvežen.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <section
        className={`border border-border bg-sand p-7 sm:p-10 ${className}`}
        aria-live="polite"
      >
        <div className="flex size-11 items-center justify-center rounded-full bg-forest text-white">
          <Check size={20} />
        </div>
        <p className="eyebrow mt-8">Termin je rezerviran</p>
        <h3 className="mt-3 max-w-[24ch] font-display text-3xl">Se vidimo na uvodnem posvetu.</h3>
        <p className="mt-5 text-base">
          {confirmationFormatter.format(new Date(confirmation.slotStart))}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {confirmation.consultationType === "online"
            ? "Spletni posvet — povezavo in podrobnosti vam posredujemo naknadno."
            : "Obisk na domu — naslov in podrobnosti uskladimo naknadno."}
        </p>
        <p className="mt-6 max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
          {confirmation.customerEmailStatus === "sent" &&
          confirmation.internalEmailStatus === "sent"
            ? `Potrditev smo poslali na ${contact.email}, o rezervaciji pa je obveščen tudi studio.`
            : confirmation.customerEmailStatus === "sent"
              ? `Potrditev smo poslali na ${contact.email}. Obvestila studiu ni bilo mogoče dostaviti, zato vas bomo kontaktirali tudi neposredno. Vaš termin ostaja potrjen.`
              : "Termin je potrjen in shranjen, potrditvenega e-sporočila pa trenutno ni bilo mogoče dostaviti. Kontaktirali vas bomo neposredno."}
        </p>

      </section>
    );
  }

  return (
    <section
      className={`border border-border bg-sand p-5 sm:p-8 lg:p-10 ${className}`}
      aria-labelledby="booking-title"
    >
      <div className="max-w-2xl">
        <p className="eyebrow">Rezervacija</p>
        <h3 id="booking-title" className="mt-4 font-display text-3xl sm:text-4xl">
          {heading}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>

      <div
        className="mt-8 grid gap-3 sm:max-w-xl sm:grid-cols-2"
        role="group"
        aria-label="Način srečanja"
      >
        <TypeButton
          active={consultationType === "online"}
          icon={<Monitor size={18} />}
          label="Spletni posvet"
          onClick={() => setConsultationType("online")}
        />
        <TypeButton
          active={consultationType === "home-visit"}
          icon={<MapPin size={18} />}
          label="Obisk na domu"
          onClick={() => setConsultationType("home-visit")}
        />
      </div>

      {loading ? (
        <div className="mt-10 flex min-h-56 items-center justify-center gap-3 text-sm text-muted-foreground">
          <Loader2 size={18} className="animate-spin" />
          Nalagamo proste termine ...
        </div>
      ) : schedule && activeWeek ? (
        <>
          <div className="mt-10 flex items-center justify-between gap-4 border-y border-border py-4">
            <button
              type="button"
              onClick={() => {
                setWeekIndex((current) => Math.max(current - 1, 0));
                setSelectedStart(null);
              }}
              disabled={weekIndex === 0}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-background disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Prejšnji teden"
            >
              <ChevronLeft size={18} />
            </button>
            <p className="text-center font-display text-base sm:text-lg">
              {formatWeekRange(activeWeek)}
            </p>
            <button
              type="button"
              onClick={() => {
                setWeekIndex((current) => Math.min(current + 1, schedule.weekStarts.length - 1));
                setSelectedStart(null);
              }}
              disabled={weekIndex >= schedule.weekStarts.length - 1}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-background disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Naslednji teden"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {activeDays.map((day) => {
              const slots = slotsByDay.get(day) ?? [];
              return (
                <div key={day} className="border border-border bg-background p-4">
                  <p className="border-b border-border pb-3 text-sm font-medium capitalize">
                    {dateFormatter.format(calendarDate(day))}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-1">
                    {slots.length > 0 ? (
                      slots.map((slot) => {
                        const selected = selectedStart === slot.start;
                        return (
                          <button
                            key={slot.start}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setSelectedStart(slot.start)}
                            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors ${
                              selected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background hover:border-forest"
                            }`}
                          >
                            <Clock size={14} />
                            {timeFormatter.format(new Date(slot.start))}
                          </button>
                        );
                      })
                    ) : (
                      <p className="col-span-2 py-3 text-xs text-muted-foreground sm:col-span-1">
                        Ni več prostih terminov.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-start gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedStart
                ? `Izbrano: ${confirmationFormatter.format(new Date(selectedStart))}`
                : "Izberite enega od prostih terminov."}
            </p>
            <button
              type="button"
              disabled={!selectedStart || submitting}
              onClick={handleReserve}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm text-primary-foreground disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Potrjujemo ...
                </>
              ) : (
                "Potrdi termin"
              )}
            </button>
          </div>
        </>
      ) : null}

      {error && (
        <div className="mt-6 flex flex-col items-start gap-3" role="alert">
          <p className="text-sm text-destructive">{error}</p>
          {!schedule && (
            <button
              type="button"
              onClick={() => void loadSchedule()}
              className="inline-flex items-center gap-2 text-sm underline"
            >
              <RefreshCw size={14} /> Poskusi znova
            </button>
          )}
        </div>
      )}
    </section>
  );
}

function TypeButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex min-h-14 items-center gap-3 border px-5 py-4 text-left text-sm transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background hover:border-forest"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
