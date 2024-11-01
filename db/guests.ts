import { CONSTS } from "@/utils/constants";
import { base } from "./db";

export type Guest = {
  Name: string;
  Email: string;
  ID: string;
};

async function getGuestsHelper(eventName?: string) {
  const guests: Guest[] = [];
  const filterByFormulaRecord = eventName !== undefined ?
    {
      filterByFormula: CONSTS.MULTIPLE_EVENTS
        ? `SEARCH("${eventName}", {Events}) != 0`
        : "1",
    }
    : {};
  await base("Guests")
    .select({
      fields: ["Name", "Email"],
      ...filterByFormulaRecord,
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      const baseGuest = { Name: "", Email: "" };
      records.forEach(function (record: any) {
        guests.push({ ...baseGuest, ...record.fields, ID: record.id });
      });
      fetchNextPage();
    });
  return guests;
}



export const getGuests: () => Promise<Guest[]> = getGuestsHelper;

export const getGuestsByEvent: (eventName: string) => Promise<Guest[]> = getGuestsHelper;
