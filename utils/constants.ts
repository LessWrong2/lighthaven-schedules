import { CakeIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export type NavItem = {
  name: string;
  href: string;
  icon: any;
};

export const CONSTS = {
  TITLE: "Eternal September",
  DESCRIPTION:
    "Because we need money.",
  MULTIPLE_EVENTS: true,
  // If you have multiple events, add your events to the nav bar below
  // If you only have one event, you can leave the array empty
  // Find available icons at https://heroicons.com/
  NAV_ITEMS: [
    { name: "Week 1", href: "/week-1", icon: CakeIcon },
    { name: "Week 2", href: "/week-2", icon: CakeIcon },
    { name: "Week 3", href: "/week-3", icon: CakeIcon },
    { name: "Week 4", href: "/week-4", icon: CakeIcon }
  ] as NavItem[],
};
