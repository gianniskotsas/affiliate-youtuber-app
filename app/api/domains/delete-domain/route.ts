import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  
    const { userId, customDomain } = await req.json();
  
    try {
  
    // Fetch user by custom domain
     // 🔹 Register domain in Vercel and update database in parallel
     const [response] = await Promise.all([
        fetch(
          `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${customDomain}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${process.env.VERCEL_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        ),
        db
          .update(users)
          .set({ domain: "", domainVerified: false })
          .where(eq(users.id, userId))
      ]);

      console.log(response);
      
      return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
