import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Define the expected profile update values
interface ProfileFormValues {
  username?: string;
  bio?: string;
  profilePicture?: string;
  socialAccounts?: { name: string; url: string }[];
}

export async function POST(req: NextRequest) {
  try {
    const body: { userId: string; data: ProfileFormValues } = await req.json();
    const { userId, data } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Ensure at least one field is being updated
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No update data provided" }, { status: 400 });
    }

    // Update user in the database
    await db.update(users).set(data).where(eq(users.id, userId));

    return NextResponse.json({ success: true, message: "Profile updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
