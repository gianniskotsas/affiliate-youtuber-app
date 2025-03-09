import { NextResponse } from "next/server";
import { Dub } from "dub";

const dub = new Dub({
  token: process.env.DUB_API_KEY,
});

export async function POST(req: Request) {

  const { userId, interval, device } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    
    // Fetch the click analytics
    const result = await dub.analytics.retrieve({
      groupBy: "timeseries",
      interval: interval || "24h",
      device: device || "",
      tenantId: userId
    });

    // Handle the result
    console.log(result);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching click analytics:", error);
    return NextResponse.json(
      { error: "Error fetching click analytics" },
      { status: 500 }
    );
  }
}
