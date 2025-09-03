import { CakeIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export type NavItem = {
  name: string;
  href: string;
  icon: any;
};

export const CONSTS = {
  TITLE: "Progress Conference 2025 - Hosted by the Roots of Progress Institute",
  DESCRIPTION:
    "A two-day event to connect people & ideas in the progress movement • Berkeley, California",
  MULTIPLE_EVENTS: false,
  // Per-day period length overrides (by weekday or ISO date)
  // Example: Friday and Saturday use 15-minute increments
  PER_DAY_PERIOD_MINUTES: {
    Friday: 15,
    Saturday: 15,
  } as Record<string, number>,
  // Booking windows overrides: explicit windows enable only these booking ranges
  // Keys can be weekday names (e.g., "Friday") or ISO date (yyyy-MM-dd)
  // If not set, defaults to full Start bookings..End bookings minus blackouts
  BOOKING_WINDOWS_OVERRIDES: {
    // Example if you want to only allow specific windows
    // "2025-09-05": [ { start: "09:00", end: "16:00" } ]
  } as Record<string, { start: string; end: string }[]>,
  // Booking blackouts: disallow booking during these windows; used when explicit windows not provided
  BOOKING_BLACKOUTS_OVERRIDES: {
    Friday: [ { start: "16:00", end: "17:30" } ],
    Saturday: [ { start: "16:30", end: "18:00" } ],
  } as Record<string, { start: string; end: string }[]>,
  // Per-day location order overrides: earlier entries appear earlier
  LOCATION_ORDER_OVERRIDES: {
    // Example usage (names must match Location.Name):
    // Thursday: ["Room A", "Room B", "Factory Tour"]
    // Friday:   ["Room A", "Room B", /* Factory Tour last by omission */]
  } as Record<string, string[]>,
  // Pin locations by substring to a position for specific days
  // Example below: place any location containing "factory" 6th on Thursday and Sunday, last on Friday and Saturday
  LOCATION_PIN_OVERRIDES: {
    Thursday: [ { match: "Off-site", position: 6 } ],
    Sunday:   [ { match: "Off-site", position: 6 } ],
    Friday:   [ { match: "Off-site", position: "last" } ],
    Saturday: [ { match: "Off-site", position: "last" } ],
  } as Record<string, { match: string; position: number | "last" }[]>,
  // If you have multiple events, add your events to the nav bar below
  // If you only have one event, you can leave the array empty
  // Find available icons at https://heroicons.com/
  NAV_ITEMS: [
  ] as NavItem[],
};
