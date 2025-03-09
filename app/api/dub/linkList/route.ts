import { NextResponse } from "next/server";
import { Dub } from "dub";

const dub = new Dub({
  token: process.env.DUB_API_KEY,
});

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {

    // Fetch the links
    const linksList = await dub.links.list({
      tenantId: userId,
      page: 1,
    });

    
    // Filter the JSON
    const resultLinks = linksList.result.map((link: any) => ({
      id: link.id,
      shortLink: link.shortLink,
      orginalLink: link.url,
    }));


    // Handle the result
    return NextResponse.json({ resultLinks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching click analytics:", error);
    return NextResponse.json(
      { error: "Error fetching click analytics" },
      { status: 500 }
    );
  }
}
