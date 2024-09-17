import  { CakeIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export type NavItem = {
  name: string;
  href: string;
  icon: any;
};

export const CONSTS = {
  TITLE: "Eternal September",
  DESCRIPTION: `<p>Hang out with us for four weeks of inquiry, revelry and rationality.</p>
  
  <p>We are opening up the campus to individuals, and teams booking rooms or common areas for Eternal September.</p>

  <p>The Eternal September is like a combination of a rationalist community coworking space, an inn, a large hamlet, a very small city, and a month-long unconference.</p>

  <p>You have found yourself on the collaborative schedule for the Eternal September.</p>

  <p>You can also add your own events and activities to the schedule.</p>

  <p>The most substantial events that are currently scheduled are:</p>
  <ul>
    <li>Sequences Reading Group (probably every week on Tuesday)</li>
    <li>Petrov Day party on the 26th of September</li>
    <li>Some kind of weekly authentic-relating game thingy</li>
    <li>A weekly music jam session</li>
  </ul>
  <p>But we expect many more to be added in the coming days!</p>
  `,
  MULTIPLE_EVENTS: true,
  // If you have multiple events, add your events to the nav bar below
  // If you only have one event, you can leave the array empty
  // Find available icons at https://heroicons.com/
  NAV_ITEMS: [
    { name: "Finite September", href: "/Finite September", icon: UserGroupIcon },
    { name: "Night Haven", href: "/Night-Haven", icon: UserGroupIcon },
    { name: "Thank Haven", href: "/Thank-Haven", icon: UserGroupIcon },
    { name: "Cold Haven", href: "/Cold-Haven", icon: UserGroupIcon }
  ] as NavItem[],
};
