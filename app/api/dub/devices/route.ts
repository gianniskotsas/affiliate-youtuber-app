import { NextResponse } from "next/server";
import { Dub } from "dub";

const dub = new Dub({
  token: process.env.DUB_API_KEY,
});

export async function POST(req: Request) {
  const { userId, interval, linkId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Run both analytics requests simultaneously
    const devices = await dub.analytics.retrieve({
      groupBy: "devices",
      interval: interval || "24h",
      tenantId: userId,
      linkId: linkId
    });

    console.log(devices);

    // Handle the result
    return NextResponse.json({ devices }, { status: 200 });
  } catch (error) {
    console.error("Error fetching click analytics:", error);
    return NextResponse.json(
      { error: "Error fetching click analytics" },
      { status: 500 }
    );
  }
}
