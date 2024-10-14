import { base } from "@/db/db";

type RSVPParams = {
  sessionId: string;
  guestId: string;
  remove?: boolean;
};

export const dynamic = "force-dynamic"; // defaults to auto

async function getRSVPsByUser(guestId: string, sessionId: string) {
  return await base("RSVPs")
    .select({
      filterByFormula: `AND({Guest ID} = "${guestId}", {Session ID} = "${sessionId}")`,
    })
    .all();
}

export async function POST(req: Request) {
  const { sessionId, guestId, remove } = (await req.json()) as RSVPParams;

  if (!remove) {
    await base("RSVPs").create(
      [
        {
          fields: { Session: [sessionId], Guest: [guestId] },
        },
      ],
      function (err: string, records: any) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function (record: any) {
          console.log(record.getId());
        });
      }
    );
    // Check whether we now have multiple RSVPs for this session and guest
    const rsvps = await getRSVPsByUser(guestId, sessionId);
    console.log("RSVPs", { rsvps });
    if (rsvps.length > 1) {
      console.log("DUPLICATE RSVPs", { rsvps });
      // We do, so we need to delete all but one
      rsvps.slice(1).forEach(async (rsvp: any) => {
        await base("RSVPs").destroy([rsvp.getId()]);
      });
    }
  } else {
    console.log("REMOVING RSVP", { sessionId, guestId });
    const rsvps = await getRSVPsByUser(guestId, sessionId);
    rsvps.forEach(async (rsvp: any) => {
      await base("RSVPs").destroy([rsvp.getId()]);
    });
  }

  return Response.json({ success: true });
}
