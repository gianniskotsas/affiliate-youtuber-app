import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useUserDb } from "@/context/UserDbContext";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    // Retrieve user authentication from context
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoId } = await req.json();
    if (!videoId) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    // Fetch all products associated with the given videoId
    const videoProducts = await db.select().from(products).where(eq(products.videoId, videoId)).execute();

    return NextResponse.json(videoProducts, { status: 200 });
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
