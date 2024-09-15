import  { CakeIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export type NavItem = {
  name: string;
  href: string;
  icon: any;
};

export const CONSTS = {
  TITLE: "Eternal September",
  DESCRIPTION: `Hang out with us for four weeks of inquiry, revelry and rationality.
  
  We are opening up the campus to individuals, and teams booking rooms or common areas for Eternal September.

  The Eternal September is like a combination of a rationalist community coworking space, an inn, a large hamlet, a very small city, and a month-long unconference.

  You have found yourself on the collaborative schedule for the Eternal September.

  You can also add your own events and activities to the schedule.

  The most substantial events that are currently scheduled are: 
  – Sequences Reading Group (probably every week on Tuesday)
  – Petrov Day party on the 26th of September
  – Some kind of weekly authentic-relating game thingy
  – A weekly music jam session

  But we expect many more to be added in the coming days!
  `,
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
