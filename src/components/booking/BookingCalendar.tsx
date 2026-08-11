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
import type { Locale } from "@/lib/i18n";

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
  locale?: Locale;
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

const localeCodes = {
  sl: "sl-SI",
  hr: "hr-HR",
  en: "en-GB",
} as const;

const copy = {
  sl: {
    heading: "Izberite termin za uvodni posvet",
    description:
      "Vsak teden je na voljo 10–14 enournih terminov. Izberite način srečanja, datum in uro.",
    loadError: "Prostih terminov trenutno ni bilo mogoče naložiti.",
    reserveError:
      "Termina ni bilo mogoče potrditi. Morda ga je pravkar rezerviral drug obiskovalec; seznam je osvežen.",
    reserved: "Termin je rezerviran",
    seeYou: "Se vidimo na uvodnem posvetu.",
    online: "Spletni posvet",
    homeVisit: "Obisk na domu",
    onlineNote: "Spletni posvet — povezavo in podrobnosti vam posredujemo naknadno.",
    homeVisitNote: "Obisk na domu — naslov in podrobnosti uskladimo naknadno.",
    sentBoth: (email: string) =>
      `Potrditev smo poslali na ${email}, o rezervaciji pa je obveščen tudi studio.`,
    sentCustomer: (email: string) =>
      `Potrditev smo poslali na ${email}. Obvestila studiu ni bilo mogoče dostaviti, zato vas bomo kontaktirali tudi neposredno. Vaš termin ostaja potrjen.`,
    sentNone:
      "Termin je potrjen in shranjen, potrditvenega e-sporočila pa trenutno ni bilo mogoče dostaviti. Kontaktirali vas bomo neposredno.",
    booking: "Rezervacija",
    meetingType: "Način srečanja",
    loading: "Nalagamo proste termine ...",
    previousWeek: "Prejšnji teden",
    nextWeek: "Naslednji teden",
    noSlots: "Ni več prostih terminov.",
    selected: (value: string) => `Izbrano: ${value}`,
    chooseSlot: "Izberite enega od prostih terminov.",
    confirming: "Potrjujemo ...",
    confirm: "Potrdi termin",
    retry: "Poskusi znova",
  },
  hr: {
    heading: "Odaberite termin za uvodne konzultacije",
    description:
      "Svakog je tjedna dostupno 10–14 jednosatnih termina. Odaberite način sastanka, datum i vrijeme.",
    loadError: "Slobodne termine trenutačno nije moguće učitati.",
    reserveError:
      "Termin nije bilo moguće potvrditi. Možda ga je upravo rezervirao drugi posjetitelj; popis je osvježen.",
    reserved: "Termin je rezerviran",
    seeYou: "Vidimo se na uvodnim konzultacijama.",
    online: "Online konzultacije",
    homeVisit: "Posjet domu",
    onlineNote: "Online konzultacije — poveznicu i detalje poslat ćemo naknadno.",
    homeVisitNote: "Posjet domu — adresu i detalje uskladit ćemo naknadno.",
    sentBoth: (email: string) =>
      `Potvrdu smo poslali na ${email}, a studio je također obaviješten o rezervaciji.`,
    sentCustomer: (email: string) =>
      `Potvrdu smo poslali na ${email}. Obavijest studiju nije bilo moguće dostaviti pa ćemo vas kontaktirati i izravno. Vaš termin ostaje potvrđen.`,
    sentNone:
      "Termin je potvrđen i spremljen, ali potvrdni e-mail trenutačno nije bilo moguće dostaviti. Kontaktirat ćemo vas izravno.",
    booking: "Rezervacija",
    meetingType: "Način sastanka",
    loading: "Učitavamo slobodne termine ...",
    previousWeek: "Prethodni tjedan",
    nextWeek: "Sljedeći tjedan",
    noSlots: "Nema više slobodnih termina.",
    selected: (value: string) => `Odabrano: ${value}`,
    chooseSlot: "Odaberite jedan od slobodnih termina.",
    confirming: "Potvrđujemo ...",
    confirm: "Potvrdi termin",
    retry: "Pokušaj ponovno",
  },
  en: {
    heading: "Choose a time for your introductory consultation",
    description:
      "There are 10–14 one-hour appointments available each week. Choose the meeting type, date and time.",
    loadError: "Available appointments could not be loaded right now.",
    reserveError:
      "The appointment could not be confirmed. Another visitor may have just booked it; the list has been refreshed.",
    reserved: "Appointment reserved",
    seeYou: "We look forward to your introductory consultation.",
    online: "Online consultation",
    homeVisit: "Home visit",
    onlineNote: "Online consultation — we will send the link and details afterwards.",
    homeVisitNote: "Home visit — we will confirm the address and details afterwards.",
    sentBoth: (email: string) =>
      `We sent the confirmation to ${email}, and the studio has also been notified of your booking.`,
    sentCustomer: (email: string) =>
      `We sent the confirmation to ${email}. The studio notification could not be delivered, so we will also contact you directly. Your appointment remains confirmed.`,
    sentNone:
      "Your appointment is confirmed and saved, but the confirmation email could not be delivered right now. We will contact you directly.",
    booking: "Booking",
    meetingType: "Meeting type",
    loading: "Loading available appointments ...",
    previousWeek: "Previous week",
    nextWeek: "Next week",
    noSlots: "No more appointments available.",
    selected: (value: string) => `Selected: ${value}`,
    chooseSlot: "Choose one of the available appointments.",
    confirming: "Confirming ...",
    confirm: "Confirm appointment",
    retry: "Try again",
  },
} as const;

function calendarDate(dateKey: string): Date {
  return new Date(`${dateKey}T12:00:00.000Z`);
}

function formatWeekRange(weekStart: string, locale: Locale): string {
  const weekEnd = addCalendarDays(weekStart, 4);
  const start = new Intl.DateTimeFormat(localeCodes[locale], {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(calendarDate(weekStart));
  const end = new Intl.DateTimeFormat(localeCodes[locale], {
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
  locale = "sl",
  initialConsultationType = "online",
  heading,
  description,
  className = "",
}: BookingCalendarProps) {
  const t = copy[locale];
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(localeCodes[locale], {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }),
    [locale],
  );
  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(localeCodes[locale], {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: BOOKING_TIME_ZONE,
      }),
    [locale],
  );
  const confirmationFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(localeCodes[locale], {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: BOOKING_TIME_ZONE,
      }),
    [locale],
  );

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
      setError(t.loadError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getSchedule, t.loadError]);

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
          locale,
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
      if (refreshed) setError(t.reserveError);
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
        <p className="eyebrow mt-8">{t.reserved}</p>
        <h3 className="mt-3 max-w-[24ch] font-display text-3xl">{t.seeYou}</h3>
        <p className="mt-5 text-base">
          {confirmationFormatter.format(new Date(confirmation.slotStart))}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {confirmation.consultationType === "online" ? t.onlineNote : t.homeVisitNote}
        </p>
        <p className="mt-6 max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
          {confirmation.customerEmailStatus === "sent" &&
          confirmation.internalEmailStatus === "sent"
            ? t.sentBoth(contact.email)
            : confirmation.customerEmailStatus === "sent"
              ? t.sentCustomer(contact.email)
              : t.sentNone}
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
        <p className="eyebrow">{t.booking}</p>
        <h3 id="booking-title" className="mt-4 font-display text-3xl sm:text-4xl">
          {heading ?? t.heading}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description ?? t.description}
        </p>
      </div>

      <div
        className="mt-8 grid gap-3 sm:max-w-xl sm:grid-cols-2"
        role="group"
        aria-label={t.meetingType}
      >
        <TypeButton
          active={consultationType === "online"}
          icon={<Monitor size={18} />}
          label={t.online}
          onClick={() => setConsultationType("online")}
        />
        <TypeButton
          active={consultationType === "home-visit"}
          icon={<MapPin size={18} />}
          label={t.homeVisit}
          onClick={() => setConsultationType("home-visit")}
        />
      </div>

      {loading ? (
        <div className="mt-10 flex min-h-56 items-center justify-center gap-3 text-sm text-muted-foreground">
          <Loader2 size={18} className="animate-spin" />
          {t.loading}
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
              aria-label={t.previousWeek}
            >
              <ChevronLeft size={18} />
            </button>
            <p className="text-center font-display text-base sm:text-lg">
              {formatWeekRange(activeWeek, locale)}
            </p>
            <button
              type="button"
              onClick={() => {
                setWeekIndex((current) => Math.min(current + 1, schedule.weekStarts.length - 1));
                setSelectedStart(null);
              }}
              disabled={weekIndex >= schedule.weekStarts.length - 1}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-background disabled:cursor-not-allowed disabled:opacity-35"
              aria-label={t.nextWeek}
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
                        {t.noSlots}
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
                ? t.selected(confirmationFormatter.format(new Date(selectedStart)))
                : t.chooseSlot}
            </p>
            <button
              type="button"
              disabled={!selectedStart || submitting}
              onClick={handleReserve}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm text-primary-foreground disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> {t.confirming}
                </>
              ) : (
                t.confirm
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
              <RefreshCw size={14} /> {t.retry}
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
