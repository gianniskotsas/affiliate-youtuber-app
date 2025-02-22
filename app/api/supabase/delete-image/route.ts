import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(req: Request) {
  try {
    const { path } = await req.json(); // Get image path from request body

    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    console.log(path);
    const response = await supabase.storage
      .from("thumbnails")
      .remove([path]);

   
    return NextResponse.json({ message: `Deleted image: ${path}` }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
  }
}
