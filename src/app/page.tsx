"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useGetProductsQuery, useSeedDbMutation } from "@/store/api";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const {
    data: productsResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetProductsQuery({
    search: activeSearch,
    category: selectedCategory,
    sort,
  });

  const [seedDb, { isLoading: isSeeding }] = useSeedDbMutation();

  const products = productsResponse?.data || [];
  const categories = productsResponse?.categories || ["All"];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchInput.trim());
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Store Showcase
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Browse our catalog with live inventory tracking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search items..."
              className="w-56 text-xs border border-zinc-300 rounded px-3 py-1.5 focus:outline-none focus:border-zinc-900 transition-colors"
            />
            <button
              type="submit"
              className="text-xs px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded font-medium transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-1.5 pl-2 border-l border-zinc-200">
            <label className="text-xs text-zinc-500 font-medium">Sort:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs border border-zinc-300 rounded px-2.5 py-1.5 bg-white text-zinc-800 focus:outline-none focus:border-zinc-900"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              selectedCategory === c
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading || isFetching ? (
        <div className="py-20 text-center text-xs text-zinc-400">
          Loading catalog items...
        </div>
      ) : isError ? (
        <div className="p-4 bg-red-50 text-red-700 text-xs border border-red-200 rounded">
          Failed to load catalog from server
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-300 rounded-lg">
          <p className="text-xs text-zinc-500 mb-3">No products match your criteria.</p>
          <button
            onClick={() => seedDb()}
            disabled={isSeeding}
            className="text-xs px-3 py-1.5 bg-zinc-900 text-white rounded hover:bg-zinc-800 font-medium disabled:opacity-50"
          >
            {isSeeding ? "Seeding..." : "Seed Sample Inventory"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
