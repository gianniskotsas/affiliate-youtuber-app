import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, videos } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { Dub } from "dub";
import { eq } from "drizzle-orm";
import { dubTagMap } from "@/lib/utils";
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

    // Retrieve username based on userId
    const user = await db
      .select({ username: users.username, domain: users.domain })
      .from(users)
      .where(eq(users.id, userId))
      .execute();
    const username = user[0]?.username;
    const domain = user[0]?.domain;

    if (!username) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { videoTitle, videoSlug, videoThumbnail } = await req.json();

    if (!videoTitle || !videoSlug || !videoThumbnail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate Dub.co short link with error handling
      let shortLink;
    let url;
    try {

      if (domain) {
        url = `${domain}/${videoSlug}`;
      } else {
        url = `${process.env.APP_URL}/vv/${username}/${videoSlug}`;
      }

      const shortLinkResult = await dub.links.create({
        url: url,
        domain: process.env.DUB_DOMAIN,
        tenantId: userId,
        title: videoTitle,
        image: videoThumbnail,
        proxy: true,
        tagIds: [dubTagMap.find((tag) => tag.name === "videopage")?.id ?? ""],
      });

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
    });

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

    const videoId = await db
      .select({ id: videos.id })
      .from(videos)
      .where(eq(videos.videoShortLink, shortLink))
      .execute();

    return NextResponse.json({ id: videoId[0].id }, { status: 201 });
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
