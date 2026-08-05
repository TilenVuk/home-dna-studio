export const BOOKING_TIME_ZONE = "Europe/Ljubljana";
export const BOOKING_WEEKS_AHEAD = 6;

const WORK_DAYS = 5;
const DAILY_HOURS = [9, 10, 11, 13, 14, 15, 16] as const;
const SCHEDULE_SALT = "nuveli-studio-consultations-v1";

export interface BookingSlot {
  start: string;
  end: string;
  weekStart: string;
  localDate: string;
}

export interface BookingSchedule {
  weekStarts: string[];
  slots: BookingSlot[];
}

function hashString(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], seed: number): T[] {
  const result = [...items];
  const random = seededRandom(seed);

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = result[index];
    const replacement = result[swapIndex];

    if (current === undefined || replacement === undefined) continue;
    result[index] = replacement;
    result[swapIndex] = current;
  }

  return result;
}

function dateKeyFromUtcDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addCalendarDays(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1));
  date.setUTCDate(date.getUTCDate() + days);
  return dateKeyFromUtcDate(date);
}

function ljubljanaDateParts(date: Date): { year: number; month: number; day: number } {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  return { year: read("year"), month: read("month"), day: read("day") };
}

function startOfNextLjubljanaWeek(now: Date): string {
  const { year, month, day } = ljubljanaDateParts(now);
  const localDate = new Date(Date.UTC(year, month - 1, day));
  const daysSinceMonday = (localDate.getUTCDay() + 6) % 7;
  localDate.setUTCDate(localDate.getUTCDate() - daysSinceMonday + 7);
  return dateKeyFromUtcDate(localDate);
}

function zonedDateTimeToUtc(dateKey: string, hour: number): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  const desiredAsUtc = Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1, hour);
  let guess = desiredAsUtc;
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  // Two passes correctly resolve the Ljubljana UTC offset, including daylight saving time.
  for (let pass = 0; pass < 2; pass += 1) {
    const parts = formatter.formatToParts(new Date(guess));
    const read = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((part) => part.type === type)?.value ?? 0);
    const representedAsUtc = Date.UTC(
      read("year"),
      read("month") - 1,
      read("day"),
      read("hour"),
      read("minute"),
      read("second"),
    );
    guess -= representedAsUtc - desiredAsUtc;
  }

  return new Date(guess);
}

function buildWeekSlots(weekStart: string): BookingSlot[] {
  const weekSeed = hashString(`${SCHEDULE_SALT}:${weekStart}`);
  const extraSlotCount = weekSeed % 5;
  const extraDays = new Set(
    shuffle([0, 1, 2, 3, 4], weekSeed ^ 0x9e3779b9).slice(0, extraSlotCount),
  );
  const slots: BookingSlot[] = [];

  for (let dayIndex = 0; dayIndex < WORK_DAYS; dayIndex += 1) {
    const localDate = addCalendarDays(weekStart, dayIndex);
    const hours = shuffle(DAILY_HOURS, hashString(`${SCHEDULE_SALT}:${localDate}`));
    const hoursForDay = hours.slice(0, extraDays.has(dayIndex) ? 3 : 2).sort((a, b) => a - b);

    for (const hour of hoursForDay) {
      const start = zonedDateTimeToUtc(localDate, hour);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      slots.push({
        start: start.toISOString(),
        end: end.toISOString(),
        weekStart,
        localDate,
      });
    }
  }

  return slots.sort((left, right) => left.start.localeCompare(right.start));
}

export function buildBookingSchedule(
  now = new Date(),
  weekCount = BOOKING_WEEKS_AHEAD,
): BookingSchedule {
  const count = Math.min(Math.max(Math.trunc(weekCount), 1), BOOKING_WEEKS_AHEAD);
  const firstWeek = startOfNextLjubljanaWeek(now);
  const weekStarts = Array.from({ length: count }, (_, index) =>
    addCalendarDays(firstWeek, index * 7),
  );
  const slots = weekStarts.flatMap(buildWeekSlots);

  return { weekStarts, slots };
}
