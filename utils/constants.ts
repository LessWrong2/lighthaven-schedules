import { CakeIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export type NavItem = {
  name: string;
  href: string;
  icon: any;
};

export const CONSTS = {
  TITLE: "Progress Conference 2024 - Hosted by the Roots of Progress Institute",
  DESCRIPTION:
    "A two-day event to connect people & ideas in the progress movement • October 18-19, 2024  •  Berkeley, California",
  MULTIPLE_EVENTS: false,
  // If you have multiple events, add your events to the nav bar below
  // If you only have one event, you can leave the array empty
  // Find available icons at https://heroicons.com/
  NAV_ITEMS: [
  ] as NavItem[],
};
