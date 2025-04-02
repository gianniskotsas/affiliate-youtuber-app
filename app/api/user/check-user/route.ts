import { NextResponse } from "next/server";
import { db } from "@/db"; 
import { users } from "@/db/schema"; 
import { eq } from "drizzle-orm";

// POST /api/check-user
export async function POST(request: Request) {
  const { userId, email, username } = await request.json();

  // See if user already exists in DB
  const existingUser = await db
    .select({ userId: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  // Drizzle returns an array, so let's unpack it
  if (!existingUser || existingUser.length === 0) {
    // Insert the new user
    await db.insert(users).values({
      id: userId,
      email: email,
      username: username,
    });
  }

  // Return an OK
  return NextResponse.json(existingUser[0] || { status: "ok" });
}
