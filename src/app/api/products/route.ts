export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { productQueryValidationSchema } from "@/lib/validations/yupProduct";
import logger from "@/lib/logger";

function escapeRegex(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const { searchParams } = new URL(request.url);

    let parsedQuery;
    try {
      parsedQuery = await productQueryValidationSchema.validate({
        search: searchParams.get("search") || "",
        category: searchParams.get("category") || "",
        sort: searchParams.get("sort") || "newest",
      });
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const { search, category, sort } = parsedQuery;

    await connectToDatabase();

    const query: Record<string, any> = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (search && search.trim()) {
      const safeSearch = escapeRegex(search.trim());
      query.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
      ];
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "price_asc") {
      sortOption = { price: 1 };
    } else if (sort === "price_desc") {
      sortOption = { price: -1 };
    } else if (sort === "name_asc") {
      sortOption = { title: 1 };
    } else if (sort === "name_desc") {
      sortOption = { title: -1 };
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const products = await Product.find(query).sort(sortOption).lean();

    const categories = await Product.distinct("category");

    const duration = Date.now() - startTime;
    logger.info("Public products catalog retrieved", {
      count: products.length,
      category: category || "all",
      searchQuery: search || null,
      appliedBackendSort: sort,
      durationMs: duration,
    });

    return NextResponse.json({
      success: true,
      data: products,
      categories: ["All", ...categories],
      total: products.length,
      activeSort: sort,
    });
  } catch (error: any) {
    logger.error("Error retrieving public product showcase", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
