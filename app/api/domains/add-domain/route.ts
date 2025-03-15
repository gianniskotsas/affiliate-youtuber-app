import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_API_KEY = process.env.VERCEL_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { user_id, custom_domain } = await req.json(); // Using `custom_domain` for clarity

    if (!user_id || !custom_domain) {   
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // 🔹 Register domain in Vercel
    const response = await fetch(`https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: custom_domain }),
    });

    const result = await response.json();

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    // 🔹 Store domain in `users` table
    await db
      .update(users)
      .set({ domain: custom_domain })
      .where(eq(users.id, user_id));

    return NextResponse.json({
      success: true,
      message: "Domain added to Vercel. Please verify it in your DNS settings.",
    });
  } catch (error) {
    console.error("Error adding domain:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
