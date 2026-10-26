import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { getAuthUser } from "@/lib/auth";
import { productValidationSchema } from "@/lib/validations/yupProduct";
import logger from "@/lib/logger";

function escapeRegex(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") {
      logger.warn("Unauthorized attempt to access admin products API", {
        userId: user?.userId || "anonymous",
      });
      return NextResponse.json(
        { success: false, error: "Admin privilege required" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || "").trim();

    const filter: Record<string, any> = {};
    if (search) {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { category: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();

    const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
    const lowStockCount = products.filter((p) => p.stock < 10).length;

    logger.info("Admin products list retrieved", {
      adminEmail: user.email,
      totalCount: products.length,
      lowStockCount,
    });

    return NextResponse.json({
      success: true,
      data: products,
      metrics: {
        totalProducts: products.length,
        totalInventoryValue,
        lowStockCount,
      },
    });
  } catch (error: any) {
    logger.error("Admin products fetch error", { error: error.message, stack: error.stack });
    return NextResponse.json(
      { success: false, error: "Failed to load products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin privilege required" },
        { status: 403 }
      );
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

      logger.warn("Product creation rejected by Yup schema", { errors });
      return NextResponse.json(
        {
          success: false,
          error: err.errors?.[0] || "Validation failed",
          details: errors,
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newProduct = await Product.create(validData);

    logger.info("Product created by admin", {
      adminId: user.userId,
      adminEmail: user.email,
      productId: newProduct._id,
      title: newProduct.title,
      price: newProduct.price,
      stock: newProduct.stock,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    logger.error("Failed to create product", { error: error.message, stack: error.stack });
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
