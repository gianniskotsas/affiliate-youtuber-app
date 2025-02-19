import { NextResponse } from "next/server";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { url, videoId } = await request.json();

    if (!url || !videoId) {
      return NextResponse.json(
        { error: "URL and videoId are required" },
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

    // 🔹 Define file name and path
    const filePath = `qr-${videoId}-${Date.now()}.png`;

    // 🔹 Upload the image to Supabase Storage
    const { data, error } = await supabase.storage
      .from("qr-codes")
      .upload(filePath, buffer, {
        contentType: "image/png",
      });

    if (error) {
      console.error("Error uploading QR code to Supabase:", error);
      return NextResponse.json(
        { error: "Failed to upload QR code to storage" },
        { status: 500 }
      );
    }

    // 🔹 Generate the public URL
    const { data: publicUrlData } = supabase.storage
      .from("qr-codes")
      .getPublicUrl(filePath);

    if (!publicUrlData) {
      return NextResponse.json(
        { error: "Failed to retrieve public URL" },
        { status: 500 }
      );
    }

    const qrCodeUrl = publicUrlData.publicUrl;

    // 🔹 Update the video entry with the new QR code URL using Drizzle ORM
    try {
      await db
        .update(videos)
        .set({ videoQrCodeUrl: qrCodeUrl })
        .where(eq(videos.id, videoId))
        .execute();
    } catch (updateError) {
      console.error("Error updating video QR code URL:", updateError);
      return NextResponse.json(
        { error: "Failed to update video QR code URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ qrCodeUrl }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
