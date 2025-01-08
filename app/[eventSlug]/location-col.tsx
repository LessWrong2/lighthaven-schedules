import { Session } from "@/db/sessions";
import { Day } from "@/db/days";
import { Location } from "@/db/locations";
import { Guest } from "@/db/guests";
import { RSVP } from "@/db/rsvps";
import { SessionBlock } from "./session-block";
import { getNumHalfHours, getNumTimePeriods } from "@/utils/utils";
import clsx from "clsx";

export function LocationCol(props: {
  eventName: string;
  sessions: Session[];
  location: Location;
  day: Day;
  guests: Guest[];
  rsvps: RSVP[];
}) {
  const { eventName, sessions, location, day, guests, rsvps } = props;
  const periodLengthMinutes = 10;
  const sessionsWithBlanks = insertBlankSessions(
    sessions,
    new Date(day.Start),
    new Date(day.End),
    periodLengthMinutes
  );
  const numTimePeriods = getNumTimePeriods(new Date(day.Start), new Date(day.End), periodLengthMinutes);
  return (
    <div className={"px-0.5"}>
      <div
        className={clsx(
          "grid h-full",
          `grid-rows-[repeat(${numTimePeriods},28px)]`
        )}
      >
        {sessionsWithBlanks.map((session) => {
          const filteredRSVPs = rsvps.filter(
            (rsvp) => rsvp.Session?.[0] === session.ID
          );
          return (
            <SessionBlock
              eventName={eventName}
              day={day}
              key={session["Start time"]}
              session={session}
              location={location}
              guests={guests}
              rsvpsForEvent={filteredRSVPs}
            />
          );
        })}
      </div>
    </div>
  );
}

function insertBlankSessions(
  sessions: Session[],
  dayStart: Date,
  dayEnd: Date,
  periodLengthMinutes: number = 30
) {
  const sessionsWithBlanks: Session[] = [];
  const periodLengthMilliseconds = periodLengthMinutes * 60 * 1000;
  for (
    let currentTime = dayStart.getTime();
    currentTime < dayEnd.getTime();
    currentTime += periodLengthMilliseconds
  ) {
    const sessionNow = sessions.find((session) => {
      const startTime = new Date(session["Start time"]).getTime();
      const endTime = new Date(session["End time"]).getTime();
      return startTime <= currentTime && endTime > currentTime;
    });
    if (!!sessionNow) {
      if (new Date(sessionNow["Start time"]).getTime() === currentTime) {
        sessionsWithBlanks.push(sessionNow);
      } else {
        continue;
      }
    } else {
      sessionsWithBlanks.push({
        "Start time": new Date(currentTime).toISOString(),
        "End time": new Date(currentTime + periodLengthMilliseconds).toISOString(),
        Title: "",
        Description: "",
        Hosts: [],
        "Host name": [],
        "Host email": "",
        Location: [],
        "Location name": [""],
        Capacity: 0,
        "Num RSVPs": 0,
        ID: "",
      });
    }
  }
  return sessionsWithBlanks;
}
