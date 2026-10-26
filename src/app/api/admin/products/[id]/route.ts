import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { getAuthUser } from "@/lib/auth";
import { productValidationSchema } from "@/lib/validations/yupProduct";
import logger from "@/lib/logger";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid product ID format" }, { status: 400 });
    }

    await connectToDatabase();

    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    logger.error("Admin failed to fetch product", { error: error.message });
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid product ID format" }, { status: 400 });
    }

    const body = await request.json();

    let validData;
    try {
      validData = await productValidationSchema.validate(body, { abortEarly: false, stripUnknown: true });
    } catch (err: any) {
      const errors = err.inner?.reduce((acc: Record<string, string>, curr: any) => {
        if (curr.path) acc[curr.path] = curr.message;
        return acc;
      }, {}) || {};

      logger.warn("Admin product update validation failed", { errors });
      return NextResponse.json(
        { success: false, error: err.errors?.[0] || "Validation failed", details: errors },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updated = await Product.findByIdAndUpdate(
      id,
      validData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      logger.warn("Admin attempted update on non-existent product", { productId: id });
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    logger.info("Product updated by admin", {
      adminEmail: user.email,
      productId: id,
      newPrice: updated.price,
      newStock: updated.stock,
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error: any) {
    logger.error("Admin product update failed", { error: error.message });
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid product ID format" }, { status: 400 });
    }

    await connectToDatabase();

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      logger.warn("Admin tried deleting non-existent product", { productId: id });
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    logger.info("Product deleted by admin", {
      adminEmail: user.email,
      productId: id,
      deletedTitle: deleted.title,
    });

    return NextResponse.json({
      success: true,
      message: `Product "${deleted.title}" deleted successfully`,
    });
  } catch (error: any) {
    logger.error("Admin product deletion failed", { error: error.message });
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
