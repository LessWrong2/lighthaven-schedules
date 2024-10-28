import { CONSTS } from "@/utils/constants";
import { base } from "./db";

export type Guest = {
  Name: string;
  Email: string;
  ID: string;
};
export async function getGuests() {
  const guests: Guest[] = [];
  await base("Guests")
    .select({
      fields: ["Name", "Email"],
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        guests.push({ ...record.fields, ID: record.id });
      });
      fetchNextPage();
    });
  return guests;
}

export async function getGuestsByEvent(eventName: string) {
  const guests: Guest[] = [];
  const filterFormula = CONSTS.MULTIPLE_EVENTS
    ? `SEARCH("${eventName}", {Events}) != 0`
    : "1";
  await base("Guests")
    .select({
      fields: ["Name", "Email"],
      filterByFormula: filterFormula,
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        const fields = Object.fromEntries(
          Object.entries(record.fields).map(([key, value]) => [key, value ?? ""])
        ) as Omit<Guest, "ID">;
        guests.push({ ...fields, ID: record.id });
      });
      fetchNextPage();
    });
  return guests;
}
