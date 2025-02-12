import { NextResponse } from "next/server";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { Dub } from "dub";

const dub = new Dub({
  token: process.env.DUB_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { videoTitle, videoSlug, videoDescription, videoThumbnail } = await req.json();
    const videoUrl = `${process.env.APP_URL}/video/${videoSlug}`;

    // Generate Dub.co short link
    const shortLinkResult = await dub.links.create({ url: videoUrl });
    const shortLink = shortLinkResult.url;

    // Generate QR Code
    const qrCodeUrl = await dub.qrCodes.get({ url: videoUrl });

    // Insert new video record
    const newVideo = await db.insert(videos).values({
      userId,
      videoTitle,
      videoSlug,
      videoDescription,
      videoThumbnail,
      videoShortLink: shortLink,
      videoQRCode: qrCodeUrl,
    }).execute();

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
