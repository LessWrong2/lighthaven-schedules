import { Day } from "@/db/days";
import { Location } from "@/db/locations";
import { DateTime } from "luxon";
import { CONSTS } from "./constants";

export const getPercentThroughDay = (now: Date, start: Date, end: Date) =>
  ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;

export const getNumTimePeriods = (start: Date, end: Date, periodLengthMinutes: number) => {
  const lengthOfDay = end.getTime() - start.getTime();
  return lengthOfDay / 1000 / 60 / periodLengthMinutes;
};

export const getNumHalfHours = (start: Date, end: Date) => {
  const lengthOfDay = end.getTime() - start.getTime();
  return lengthOfDay / 1000 / 60 / 30;
};

export const arraysEqual = (a: any[], b: any[]) =>
  a.length === b.length && a.every((value) => b.includes(value));

export function convertParamDateTime(dayParam: string, timeParam: string) {
  return DateTime.fromFormat(
    `${dayParam} ${timeParam}`,
    'MM-dd HH:mm',
    { zone: 'America/Los_Angeles' }
  ).toJSDate();
}

export const dateOnDay = (date: Date, day: Day) => {
  return (
    date.getTime() >= new Date(day.Start).getTime() &&
    date.getTime() <= new Date(day.End).getTime()
  );
};

// Determine the period length in minutes for a given day.
// Default is 30, but allow overrides (e.g., 15 minutes on Fri/Sat).
export function getPeriodLengthMinutesForDay(day: Day): number {
  try {
    const weekday = DateTime.fromISO(day.Start, { zone: "America/Los_Angeles" }).toFormat("cccc");
    const overrides = CONSTS?.PER_DAY_PERIOD_MINUTES ?? {} as Record<string, number>;
    if (weekday in overrides) return overrides[weekday]!;
  } catch {}
  return 30;
}

// Booking windows helpers
// Allows multiple windows per day and blackout windows via overrides.
// Windows are returned as [startMs, endMs] tuples in local time.
export function getBookingWindowsForDay(day: Day): Array<[number, number]> {
  const defaultWindow: [number, number] = [
    new Date(day["Start bookings"]).getTime(),
    new Date(day["End bookings"]).getTime(),
  ];

  // Overrides can be specified by weekday name (e.g., "Friday") or ISO date (yyyy-MM-dd)
  const weekday = DateTime.fromISO(day.Start, { zone: "America/Los_Angeles" }).toFormat("cccc");
  const isoDate = DateTime.fromISO(day.Start, { zone: "America/Los_Angeles" }).toFormat("yyyy-MM-dd");

  // 1) If explicit windows are provided, use them
  const windowOverrides = CONSTS?.BOOKING_WINDOWS_OVERRIDES as
    | Record<string, { start: string; end: string }[]>
    | undefined;
  let windows: Array<{ start: string; end: string }> | undefined = undefined;
  if (windowOverrides) {
    windows = windowOverrides[isoDate] ?? windowOverrides[weekday];
  }
  const dayStartLocal = DateTime.fromISO(day.Start, { zone: "America/Los_Angeles" }).startOf("day");
  if (windows && windows.length > 0) {
    return windows.map((w) => {
      const start = DateTime.fromFormat(
        `${dayStartLocal.toFormat("yyyy-LL-dd")} ${w.start}`,
        "yyyy-LL-dd HH:mm",
        { zone: "America/Los_Angeles" }
      );
      const end = DateTime.fromFormat(
        `${dayStartLocal.toFormat("yyyy-LL-dd")} ${w.end}`,
        "yyyy-LL-dd HH:mm",
        { zone: "America/Los_Angeles" }
      );
      return [start.toMillis(), end.toMillis()];
    });
  }

  // 2) Otherwise, start with the default window and subtract blackouts, if any
  const blackouts = CONSTS?.BOOKING_BLACKOUTS_OVERRIDES as
    | Record<string, { start: string; end: string }[]>
    | undefined;
  let blackoutWindows: Array<{ start: string; end: string }> = [];
  if (blackouts) {
    blackoutWindows = blackouts[isoDate] ?? blackouts[weekday] ?? [];
  }
  // Convert blackout windows
  const blackoutIntervals: Array<[number, number]> = blackoutWindows.map((b) => {
    const start = DateTime.fromFormat(
      `${dayStartLocal.toFormat("yyyy-LL-dd")} ${b.start}`,
      "yyyy-LL-dd HH:mm",
      { zone: "America/Los_Angeles" }
    );
    const end = DateTime.fromFormat(
      `${dayStartLocal.toFormat("yyyy-LL-dd")} ${b.end}`,
      "yyyy-LL-dd HH:mm",
      { zone: "America/Los_Angeles" }
    );
    return [start.toMillis(), end.toMillis()];
  });

  // Subtract blackout intervals from default window
  let result: Array<[number, number]> = [defaultWindow];
  for (const [bStart, bEnd] of blackoutIntervals) {
    const next: Array<[number, number]> = [];
    for (const [wStart, wEnd] of result) {
      // No overlap
      if (bEnd <= wStart || bStart >= wEnd) {
        next.push([wStart, wEnd]);
        continue;
      }
      // Overlap: split into parts that remain
      if (bStart > wStart) {
        next.push([wStart, Math.max(wStart, Math.min(bStart, wEnd))]);
      }
      if (bEnd < wEnd) {
        next.push([Math.min(Math.max(bEnd, wStart), wEnd), wEnd]);
      }
    }
    // Filter invalid or zero-length windows
    result = next.filter(([s, e]) => e - s > 0);
  }
  return result;
}

export function isTimestampWithinAnyWindow(t: number, windows: Array<[number, number]>): boolean {
  return windows.some(([start, end]) => t >= start && t < end);
}

export function getLocationOrderOverrideForDay(day: Day): string[] | undefined {
  const weekday = DateTime.fromISO(day.Start, { zone: "America/Los_Angeles" }).toFormat("cccc");
  const isoDate = DateTime.fromISO(day.Start, { zone: "America/Los_Angeles" }).toFormat("yyyy-LL-dd");
  const overrides = CONSTS?.LOCATION_ORDER_OVERRIDES as
    | Record<string, string[]>
    | undefined;
  return overrides ? (overrides[isoDate] ?? overrides[weekday]) : undefined;
}

type LocationPin = { match: string; position: number | "last" };
export function getLocationPinOverridesForDay(day: Day): LocationPin[] | undefined {
  const weekday = DateTime.fromISO(day.Start, { zone: "America/Los_Angeles" }).toFormat("cccc");
  const isoDate = DateTime.fromISO(day.Start, { zone: "America/Los_Angeles" }).toFormat("yyyy-LL-dd");
  const overrides = CONSTS?.LOCATION_PIN_OVERRIDES as
    | Record<string, LocationPin[]>
    | undefined;
  return overrides ? (overrides[isoDate] ?? overrides[weekday]) : undefined;
}

export function sortLocationsForDay(locations: Location[], day: Day): Location[] {
  // 1) If a full order is specified, use it
  const fullOrder = getLocationOrderOverrideForDay(day);
  if (fullOrder && fullOrder.length > 0) {
    return [...locations].sort((a, b) => {
      const posA = fullOrder.indexOf(a.Name);
      const posB = fullOrder.indexOf(b.Name);
      const aPos = posA === -1 ? Number.POSITIVE_INFINITY : posA;
      const bPos = posB === -1 ? Number.POSITIVE_INFINITY : posB;
      if (aPos !== bPos) return aPos - bPos;
      return (a.Index ?? 0) - (b.Index ?? 0);
    });
  }

  // 2) Otherwise, apply pin overrides (by substring match, case-insensitive)
  const pins = getLocationPinOverridesForDay(day) ?? [];
  if (pins.length === 0) {
    return [...locations];
  }
  // Stable baseline by Index then Name
  let list = [...locations].sort(
    (a, b) => (a.Index ?? 0) - (b.Index ?? 0) || a.Name.localeCompare(b.Name)
  );
  // Apply each pin in order: remove matches, then insert at absolute position within the current list
  for (const pin of pins) {
    const matchLower = pin.match.toLowerCase();
    const matches = list.filter((loc) => loc.Name.toLowerCase().includes(matchLower));
    if (matches.length === 0) continue;
    const without = list.filter((loc) => !loc.Name.toLowerCase().includes(matchLower));
    if (pin.position === "last") {
      list = [...without, ...matches];
    } else {
      const insertIndex = Math.max(0, Math.min(pin.position - 1, without.length));
      list = [
        ...without.slice(0, insertIndex),
        ...matches,
        ...without.slice(insertIndex),
      ];
    }
  }
  return list;
}

