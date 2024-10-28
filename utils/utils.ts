import { Day } from "@/db/days";
import { DateTime } from "luxon";

export const getPercentThroughDay = (now: Date, start: Date, end: Date) =>
  ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;

export const getNumHalfHours = (start: Date, end: Date) => {
  const lengthOfDay = end.getTime() - start.getTime();
  return lengthOfDay / 1000 / 60 / 30;
};

export const arraysEqual = (a: any[], b: any[]) =>
  a.length === b.length && a.every((value) => b.includes(value));

export function convertParamDateTime(dayParam: string, timeParam: string) {
  return DateTime.fromFormat(
    `${dayParam} ${timeParam}`,
    'MM-dd HH:mm',
    { zone: 'America/Los_Angeles' }
  ).toJSDate();
}

export const dateOnDay = (date: Date, day: Day) => {
  return (
    date.getTime() >= new Date(day.Start).getTime() &&
    date.getTime() <= new Date(day.End).getTime()
  );
};
