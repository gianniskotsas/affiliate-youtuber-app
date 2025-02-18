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

    const { videoId, productName, productLink, imageUrl } = await req.json();

    // Shorten URL using Dub.co
    const shortLinkResult = await dub.links.create({ url: productLink });
    const shortLink = shortLinkResult.url;

    // Insert new product record
    const newProduct = await db.insert(products).values({
      videoId,
      productName,
      originalLink: productLink,
      shortLink,
      imageUrl,
    }).execute();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
