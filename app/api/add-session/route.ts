import { Day } from "@/db/days";
import { Location } from "@/db/locations";
import { Guest } from "@/db/guests";
import { Session, getSessions } from "@/db/sessions";
import { DateTime } from "luxon";
import { CONSTS } from "@/utils/constants";
import { base } from "@/db/db";

type SessionParams = {
  title: string;
  description: string;
  hosts: Guest[];
  location: Location;
  day: Day;
  startTimeString: string;
  duration: number;
};
type SessionInsert = {
  Title: string;
  Description: string;
  "Start time": string;
  "End time": string;
  Hosts: string[];
  Location: string[];
  Event?: string[];
  "Attendee scheduled": boolean;
};

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(req: Request) {
  const {
    title,
    description,
    hosts,
    location,
    day,
    startTimeString,
    duration,
  } = (await req.json()) as SessionParams;

  // Parse the day start date with Luxon in 'America/Los_Angeles' timezone
  const dayStartDT = DateTime.fromISO(day.Start, { zone: 'America/Los_Angeles' });

  // Combine the date and time strings
  const dateStr = dayStartDT.toFormat('yyyy-MM-dd');
  const dateTimeStr = `${dateStr} ${startTimeString}`; // e.g., '2023-12-25 8:30 AM'

  // Parse the combined date and time with Luxon
  const startDateTime = DateTime.fromFormat(dateTimeStr, 'yyyy-MM-dd h:mm a', { zone: 'America/Los_Angeles' });

  // Check if parsing was successful
  if (!startDateTime.isValid) {
    // Handle invalid date error
    console.error('Invalid start date and time');
    return Response.error();
  }

  // Calculate the end time using Luxon
  const endDateTime = startDateTime.plus({ minutes: duration });

  const session: SessionInsert = {
    Title: title,
    Description: description,
    Hosts: hosts.map((host) => host.ID),
    Location: [location.ID],
    "Start time": startDateTime.toISO(),
    "End time": endDateTime.toISO(),
    "Attendee scheduled": true,
  };

  if (CONSTS.MULTIPLE_EVENTS && day["Event"]) {
    session.Event = [day["Event"][0]];
  }

  console.log(session);
  const existingSessions = await getSessions();
  const sessionValid = validateSession(session, existingSessions);

  if (sessionValid) {
    await base("Sessions").create(
      [
        {
          fields: session,
        },
      ],
      function (err: string, records: any) {
        if (err) {
          console.error(err);
          return Response.error();
        }
        records.forEach(function (record: any) {
          console.log(record.getId());
        });
      }
    );
    return Response.json({ success: true });
  } else {
    return Response.error();
  }
}

const validateSession = (
  session: SessionInsert,
  existingSessions: Session[]
) => {
  const sessionStart = new Date(session["Start time"]);
  const sessionEnd = new Date(session["End time"]);
  const sessionStartsBeforeEnds = sessionStart < sessionEnd;
  const sessionStartsAfterNow = sessionStart > new Date();
  const sessionsHere = existingSessions.filter((s) => {
    return s["Location"][0] === session["Location"][0];
  });
  const concurrentSessions = sessionsHere.filter((s) => {
    const sStart = new Date(s["Start time"]);
    const sEnd = new Date(s["End time"]);
    return (
      (sStart < sessionStart && sEnd > sessionStart) ||
      (sStart < sessionEnd && sEnd > sessionEnd) ||
      (sStart > sessionStart && sEnd < sessionEnd)
    );
  });
  const sessionValid =
    sessionStartsBeforeEnds &&
    sessionStartsAfterNow &&
    concurrentSessions.length === 0 &&
    session["Title"] &&
    session["Location"][0] &&
    session["Hosts"][0];
  return sessionValid;
};
