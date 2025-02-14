import { NextResponse } from "next/server";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
export async function GET() {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all videos belonging to the authenticated user
    const userVideos = await db.select().from(videos).where(eq(videos.userId, userId)).execute();

    return NextResponse.json(userVideos, { status: 200 });
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
