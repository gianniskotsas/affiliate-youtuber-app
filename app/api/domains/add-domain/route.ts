import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_API_KEY = process.env.VERCEL_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { userId, customDomain } = await req.json();

    if (!userId || !customDomain) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // 🔹 Register domain in Vercel and update database in parallel
    const [response] = await Promise.all([
      fetch(
        `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${VERCEL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: customDomain }),
        }
      ),
      db
        .update(users)
        .set({ domain: customDomain })
        .where(eq(users.id, userId))
    ]);

    const result = await response.json();

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Domain added to Vercel. Please verify it in your DNS settings.",
    });
  } catch (error) {
    console.error("Error adding domain:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
