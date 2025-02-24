import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { Dub } from "dub";

const dub = new Dub({
  token: process.env.DUB_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { videoId, productName, originalLink, productDescription, imageUrl } = await req.json();
   
   
    console.log(videoId, productName, originalLink, productDescription, imageUrl);
    // Shorten URL using Dub.co

    let userIdTag;
    const tags = await dub.tags.list({ search: userId });
    userIdTag = tags.find((tag) => tag.name === userId);
    if (!userIdTag) {
      userIdTag = await dub.tags.create({ name: userId });
    }

    let videoIdTag;
    const videoIdTags = await dub.tags.list({ search: videoId });
    videoIdTag = videoIdTags.find((tag) => tag.name === videoId);
    if (!videoIdTag) {
      videoIdTag = await dub.tags.create({ name: videoId });
    }
    
    const shortLinkResult = await dub.links.create({ url: originalLink, domain: process.env.DUB_DOMAIN, tenantId: userId, tagIds: [videoIdTag.id, userIdTag.id], title: productName, description: productDescription, image: imageUrl, proxy: true });
    const shortLink = shortLinkResult.shortLink;

    // Insert new product record
    const newProduct = await db.insert(products).values({
      videoId,
      productName,
      originalLink,
      shortLink,
      imageUrl,
      productDescription,
    }).execute();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
