import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const host = req.nextUrl.searchParams.get("host");

    if (!host) {
      return NextResponse.json({ error: "Missing host parameter" }, { status: 400 });
    }

    // Fetch user by custom domain
    const user = await db
      .select({
        username: users.username,
        domain: users.domain,
      })
      .from(users)
      .where(eq(users.domain, host))
      .limit(1);

    if (user.length > 0) {
      return NextResponse.json({ username: user[0].username });
    } else {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
