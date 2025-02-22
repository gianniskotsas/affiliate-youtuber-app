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

    const { videoId, productName, shortLink, originalLink, productDescription, imageUrl } = await req.json();

    const domain = shortLink.slice(0, shortLink.indexOf('/', shortLink.indexOf('/', shortLink.indexOf('/') + 1) + 1))
    const path = shortLink.slice(shortLink.indexOf('/', shortLink.indexOf('/', shortLink.indexOf('/') + 1) + 1))

    console.log(domain, path);

    const link = await dub.links.get({ domain, key: path });
    // Shorten URL using Dub.co
    
    if (link.url !== originalLink) {
      const shortLinkResult = await dub.links.update(link.id, { url: originalLink });
      console.log(shortLinkResult);
    }

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
