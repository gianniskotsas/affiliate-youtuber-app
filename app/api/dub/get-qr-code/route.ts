import { NextResponse } from "next/server";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // 🔹 Fetch the QR code directly from Dub.co
    const apiUrl = `https://api.dub.co/qr?url=${url}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.DUB_API_KEY}`,
        Accept: "image/png",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch QR code from Dub.co" },
        { status: 500 }
      );
    }

    // 🔹 Convert response into a binary Buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return NextResponse.json({ buffer }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
