const Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.SEPTEMBER_SEASON_AIRTABLE_API_KEY,
});
export const base = Airtable.base(process.env.SEPTEMBER_SEASON_AIRTABLE_BASE_ID);
