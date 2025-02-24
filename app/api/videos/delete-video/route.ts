import { NextResponse } from "next/server";
import { db } from "@/db";
import { videos, products } from "@/db/schema"; // Import products schema
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { Dub } from "dub";
import { deleteImage } from "@/lib/utils";

const dub = new Dub({
  token: process.env.DUB_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { video } = await req.json();
    if (!video || !video.id || !video.shortLink) {
      return NextResponse.json({ error: "Video ID and shortLink are required" }, { status: 400 });
    }

    // Extract domain and key from shortLink
    const lastSlashIndex = video.shortLink.lastIndexOf("/");
    if (lastSlashIndex === -1) {
      return NextResponse.json({ error: "Invalid shortLink format" }, { status: 400 });
    }

    const domain = video.shortLink.substring(8, lastSlashIndex);
    const key = video.shortLink.substring(lastSlashIndex + 1);

    console.log("domain", domain);
    console.log("key", key);

    // Fetch link info to retrieve link ID from Dub.co
    const linkInfoResponse = await dub.links.get({
      domain,
      key,
    });

    if (!linkInfoResponse.id) {
      return NextResponse.json({ error: "Link ID not found" }, { status: 404 });
    }

    // Delete the Dub.co link
    try {
      await dub.links.delete(linkInfoResponse.id);
    } catch (error) {
      console.error("Failed to delete Dub.co link:", error);
    }

    deleteImage(`videos/${video.imageUrl}`);

    // Delete the products linked to the video
    await db.delete(products).where(eq(products.videoId, video.id)).execute();

    // Delete the video from the database
    await db.delete(videos).where(eq(videos.id, video.id)).execute();

    return NextResponse.json({ message: "Video and linked products deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
