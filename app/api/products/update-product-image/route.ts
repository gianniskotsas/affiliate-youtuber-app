import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { productId, imageUrl } = await request.json();
    console.log("productId", productId);
    console.log("imageUrl", imageUrl);

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // ✅ Update the product in the database
    await db
      .update(products)
      .set({ imageUrl })
      .where(eq(products.id, productId))
      .execute();

    return NextResponse.json(
      { message: "Product image updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product image:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
