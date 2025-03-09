import { NextResponse } from "next/server";
import { Dub } from "dub";

const dub = new Dub({
  token: process.env.DUB_API_KEY,
});

export async function POST(req: Request) {
  const { userId, interval, device, linkId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Run both analytics requests simultaneously
    const [result, resultCount] = await Promise.all([
      dub.analytics.retrieve({
        groupBy: "timeseries",
        interval: interval || "24h",
        device: device || "",
        tenantId: userId,
        linkId: linkId || "",
      }),
      dub.analytics.retrieve({
        groupBy: "count",
        interval: interval || "24h",
        device: device || "",
        tenantId: userId,
        linkId: linkId || "",
      }),
     
    ]);

   

    // Handle the result
    return NextResponse.json({ result, resultCount }, { status: 200 });
  } catch (error) {
    console.error("Error fetching click analytics:", error);
    return NextResponse.json(
      { error: "Error fetching click analytics" },
      { status: 500 }
    );
  }
}
