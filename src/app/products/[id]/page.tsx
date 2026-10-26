"use client";

import { use } from "react";
import Link from "next/link";
import { useGetProductByIdQuery } from "@/store/api";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { data: response, isLoading, isError } = useGetProductByIdQuery(id);
  const product = response?.data;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center text-xs text-zinc-400">
        Loading product details...
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 border border-zinc-200 rounded-lg bg-white text-center">
        <h1 className="text-base font-bold text-zinc-900 mb-2">Product Not Found</h1>
        <p className="text-xs text-zinc-500 mb-4">The requested item does not exist or was removed.</p>
        <Link
          href="/"
          className="text-xs px-3.5 py-2 bg-zinc-900 text-white rounded font-medium hover:bg-zinc-800"
        >
          Return to Showcase
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors inline-flex items-center gap-1 font-medium"
        >
          &larr; Back to Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border border-zinc-200 rounded-lg p-6 bg-white">
        <div className="bg-zinc-100 rounded overflow-hidden aspect-square">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              {product.category}
            </div>
            <h1 className="text-xl font-bold text-zinc-900 mb-2">
              {product.title}
            </h1>
            <div className="text-2xl font-bold text-zinc-900 mb-4">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOutOfStock
                    ? "bg-rose-500"
                    : isLowStock
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
              />
              <span className="text-xs font-medium text-zinc-600">
                {isOutOfStock
                  ? "Out of stock"
                  : isLowStock
                  ? `Only ${product.stock} units remaining`
                  : `In stock (${product.stock} units)`}
              </span>
            </div>

            <div className="border-t border-zinc-100 pt-4">
              <h2 className="text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-2">
                Overview
              </h2>
              <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center gap-3">
            <Link
              href="/"
              className="flex-1 py-2 px-4 text-center rounded text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
            >
              Back to Catalog
            </Link>
            <Link
              href="/admin/products"
              className="py-2 px-4 text-center rounded text-xs font-medium border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Admin Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
