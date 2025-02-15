import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Store ongoing requests to prevent duplicates
const processingRequests = new WeakSet<NextRequest>();

export async function POST(req: NextRequest) {
  try {
    // Prevent duplicate requests by checking WeakSet
    if (processingRequests.has(req)) {
      return NextResponse.json(
        { error: "Duplicate request detected" },
        { status: 429 }
      );
    }
    processingRequests.add(req);

    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const existingImage = formData.get("existingImage") as string | null;
    const file = formData.get("file") as File;

    if (!userId || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;

    // Check if the same file already exists to avoid duplicate uploads
    const { data: existingFiles } = await supabase.storage
      .from("avatars")
      .list();
    const fileExists = existingFiles?.find((f) => f.name === fileName);

    if (!fileExists) {
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
          { error: "Failed to upload file" },
          { status: 500 }
        );
      }
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);
    const newImageUrl = publicUrlData.publicUrl;

    // Delete the old image if it exists
    if (existingImage) {
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const storagePrefix = `${supabaseUrl}/storage/v1/object/public/avatars/`;
      
          if (existingImage.startsWith(storagePrefix)) {
            // Extract only the file path from the URL
            const oldPath = existingImage.replace(storagePrefix, "");
      
            // Delete the old image from Supabase Storage
            const { error: deleteError } = await supabase.storage.from("avatars").remove([oldPath]);
      
            if (deleteError) {
              console.error("Error deleting old profile image:", deleteError.message);
            } else {
              console.log(`Successfully deleted old profile image: ${oldPath}`);
            }
          }
        } catch (error) {
          console.error("Failed to delete old profile image:", error);
        }
      }
      

    // Update user profile in the database using Drizzle
    await db
      .update(users)
      .set({ profilePicture: newImageUrl })
      .where(eq(users.id, userId));

    // Remove request from tracking set
    processingRequests.delete(req);

    return NextResponse.json(
      { success: true, imageUrl: newImageUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
