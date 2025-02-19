import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
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

    const { product } = await req.json();
    if (!product || !product.id || !product.shortLink) {
      return NextResponse.json({ error: "Product ID and shortLink are required" }, { status: 400 });
    }

    // Extract domain and key from shortLink
    const lastSlashIndex = product.shortLink.lastIndexOf("/");
    if (lastSlashIndex === -1) {
      return NextResponse.json({ error: "Invalid shortLink format" }, { status: 400 });
    }

    const domain = product.shortLink.substring(8, lastSlashIndex);
    const key = product.shortLink.substring(lastSlashIndex + 1);

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

    // Delete the product from the database
    await db.delete(products).where(eq(products.id, product.id)).execute();

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
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
