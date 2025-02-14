import { NextResponse } from "next/server";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { Dub } from "dub";

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

    const { videoTitle, videoSlug, videoThumbnail } = await req.json();

    if (!videoTitle || !videoSlug || !videoThumbnail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const videoUrl = `${process.env.APP_URL}/${userId}/${videoSlug}`;

    // Generate Dub.co short link with error handling
    let shortLink;
    try {
      const shortLinkResult = await dub.links.create({ url: videoUrl });
      shortLink = shortLinkResult?.shortLink;

      if (!shortLink) {
        throw new Error("Failed to retrieve short link from Dub.co");
      }
    } catch (err) {
      console.error("Dub.co short link error:", err);
      return NextResponse.json(
        { error: "Failed to generate short link" },
        { status: 500 }
      );
    }

    console.log({
      userId,
      videoTitle,
      videoSlug,
      videoThumbnail,
      videoShortLink: shortLink,
    })

    // Insert new video record into database
    const newVideo = await db
      .insert(videos)
      .values({
        userId,
        videoTitle,
        videoSlug,
        videoThumbnail,
        videoShortLink: shortLink,
      })
      .execute();

    return NextResponse.json(newVideo, { status: 201 });
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
