const Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.ALEX_VAEL_AIRTABLE_API_KEY, //You'll need to add a prefix to this key for every schedule you want to make
});
export const base = Airtable.base(process.env.ALEX_VAEL_AIRTABLE_BASE_ID); //You'll need to add a prefix to the base id key for every schedule you want to make
//fake comment