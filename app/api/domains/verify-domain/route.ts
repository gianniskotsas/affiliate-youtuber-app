import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_API_KEY = process.env.VERCEL_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { customDomain, userId } = await req.json();

    if (!customDomain) {
      return NextResponse.json({ error: "Missing domain parameter" }, { status: 400 });
    }

    // 🔹 Check verification status in Vercel
    const response = await fetch(`https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${customDomain}/verify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_API_KEY}`,
        "Content-Type": "application/json",
      },
    });


    const result = await response.json();

    console.log(result);


    if (result.verified) {

      // 🔹 Update database to mark domain as verified
      await db
        .update(users)
        .set({ domainVerified: true })
        .where(eq(users.id, userId));

      // 🔹 Mark domain as verified (optional)
      return NextResponse.json({ success: true, message: "Domain verified successfully!" });
    } else {
      return NextResponse.json({ error: "Verification failed. Please check your DNS settings." }, { status: 400 });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
