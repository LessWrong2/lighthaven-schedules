import { Day } from "@/db/days";
import { Event } from "@/db/events";
import { Session } from "@/db/sessions";
import { DateTime } from "luxon";
import { Location } from "@/db/locations";

export function MonthGrid(props: {
  event: Event;
  days: Day[];
  onDayClick: (day: DateTime) => void;
  locations: Location[];  
}) {
  const { event, days, onDayClick, locations } = props;

  // Determine the month and year
  const eventStartDate = DateTime.fromISO(event.Start, { zone: "America/Los_Angeles" });
  const startOfMonth = eventStartDate.startOf("month");
  const endOfMonth = eventStartDate.endOf("month");

  // Create an array representing all days in the month
  const daysInMonth = [];
  let currentDate = startOfMonth;
  while (currentDate <= endOfMonth) {
    daysInMonth.push(currentDate);
    currentDate = currentDate.plus({ days: 1 });
  }

  // Map events to their respective dates
  const eventsByDate = days.reduce((acc, day) => {
    const dateKey = DateTime.fromISO(day.Start, { zone: "America/Los_Angeles" }).toISODate();
    acc[dateKey!] = day;
    return acc;
  }, {} as Record<string, Day>);

  // Get the first location for each event from the "Location Names"
  

  return (
    <div className="grid grid-cols-7 gap-0">
      {/* Render headers for the days of the week */}
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
        <div key={dayName} className="text-center font-bold text-xs sm:text-sm">
          {dayName}
        </div>
      ))}

      {/* Render day cells */}
      {daysInMonth.map((date) => {
        const isoDate = date.toISODate();
        const dayEvents = eventsByDate[isoDate!]?.Sessions || [];
        return (
          <div
            key={isoDate}
            className="p-1 sm:p-2 h-24 sm:h-32 flex flex-col overflow-hidden cursor-pointer"
            onClick={() => onDayClick(date)}
          >
            <div className="text-right text-xs sm:text-sm">{date.day}</div>
            <div className="flex-grow overflow-y-auto">
              {dayEvents.map((session: Session) => (
                <div 
                  key={session.ID} 
                  className={`text-[8px] sm:text-xs bg-${locations.find(location => session["Location name"].includes(location.Name))?.Color ?? "green"}-100 rounded px-0.5 sm:px-1 sm:px-1 mb-0.5 sm:mb-1 truncate`}
                  title={session.Title}
                >
                  {session.Title}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}