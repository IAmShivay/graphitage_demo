import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import logger from "@/lib/logger";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid product identifier format" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const product = await Product.findById(id).lean();
    if (!product) {
      logger.warn("Product showcase requested for non-existent ID", { productId: id });
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    logger.error("Failed to fetch product detail", { error: error.message });
    return NextResponse.json(
      { success: false, error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}
