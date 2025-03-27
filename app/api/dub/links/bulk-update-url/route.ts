import { NextRequest, NextResponse } from "next/server";
import { dubTagMap } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { tenantId, domain } = await request.json();

    const tagId = dubTagMap.find((tag) => tag.name === "videopage")?.id ?? "";

    // Retrieve the list of links based on tenantId and tagId
    const linksResponse = await fetch(
      `https://api.dub.co/links?tenantId=${tenantId}&tagId=${tagId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DUB_API_KEY}`,
        },
      }
    );

    if (!linksResponse.ok) {
      return NextResponse.json(
        { error: "Failed to retrieve links" },
        { status: linksResponse.status }
      );
    }

    const links = await linksResponse.json();

    // Prepare the bulk update payload
    const updatePayload = links.map((link: any) => {
      // Extract the key (path) from the original URL
      const url = new URL(link.url);
      const pathKey = url.pathname;

      // Create new URL with the custom domain and the same path
      return {
        ...link,
        url: `https://${domain}${pathKey}`,
      };
    });

    console.log(updatePayload);

    // Update all links in parallel using Promise.all
    const updatePromises = updatePayload.map((link: any) => {
      return fetch(`https://api.dub.co/links/${link.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DUB_API_KEY}`,
        },
        body: JSON.stringify({ url: link.url }),
      });
    });

    // Wait for all update requests to complete
    const updateResponses = await Promise.all(updatePromises);

    // Check if any of the updates failed
    const failedUpdates = updateResponses.filter((response) => !response.ok);

    if (failedUpdates.length > 0) {
      return NextResponse.json(
        {
          error: `Failed to update ${failedUpdates.length} links out of ${updatePayload.length}`,
        },
        { status: 400 }
      );
    }

    // Get all response data
    const updateResults = await Promise.all(
      updateResponses.map((res) => res.json())
    );

    const updateResult = await updateResults;

    return NextResponse.json(updateResult, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
