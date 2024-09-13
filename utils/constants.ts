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
    { name: "Week 1", href: "/Week-1", icon: UserGroupIcon },
    { name: "Week 2", href: "/Week-2", icon: UserGroupIcon },
    { name: "Week 3", href: "/Week-3", icon: UserGroupIcon },
    { name: "Week 4", href: "/Week-4", icon: UserGroupIcon }
  ] as NavItem[],
};
