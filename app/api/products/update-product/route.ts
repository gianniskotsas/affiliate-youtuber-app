import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { Dub } from "dub";
import { eq } from "drizzle-orm";
const dub = new Dub({
  token: process.env.DUB_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { videoId, productName, shortLink, originalLink, productDescription, imageUrl } = await req.json();

    const domain = new URL(shortLink).hostname; // Extracts the domain from the shortLink
    const key = shortLink.split('/').pop(); // Extracts the key from the shortLink
    console.log(domain, key);
    const link = await dub.links.get({ domain, key });
    // Shorten URL using Dub.co
    
    if (link.url !== originalLink) {
      const shortLinkResult = await dub.links.update(link.id, { url: originalLink });
      console.log(shortLinkResult);
    }

    // Insert new product record
    const newProduct = await db.update(products).set({
      videoId,
      productName,
      originalLink,
      shortLink,
      imageUrl,
      productDescription,
    }).where(eq(products.id, videoId)).execute();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
