import { CakeIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export type NavItem = {
  name: string;
  href: string;
  icon: any;
};

export const CONSTS = {
  TITLE: "Duncon",
  DESCRIPTION:
    '"At the intersection of sense and nonsense." Lighthaven campus in Berkeley, CA, 3/28-3/30, 2025',
  MULTIPLE_EVENTS: false,
  // If you have multiple events, add your events to the nav bar below
  // If you only have one event, you can leave the array empty
  // Find available icons at https://heroicons.com/
  NAV_ITEMS: [
  ] as NavItem[],
};
