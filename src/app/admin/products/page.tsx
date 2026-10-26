"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetAdminProductsQuery, useDeleteProductMutation } from "@/store/api";

export default function AdminProductsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const { data: response, isLoading, isError } = useGetAdminProductsQuery({
    search: activeSearch,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = response?.data || [];
  const metrics = response?.metrics;

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await deleteProduct(id).unwrap();
    } catch (err: any) {
      alert(err?.data?.error || "Delete failed");
    }
  };

  return (
    <div>
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 border border-zinc-200 rounded-lg bg-white">
            <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
              Total Items
            </div>
            <div className="text-xl font-bold text-zinc-900 mt-0.5">
              {metrics.totalProducts}
            </div>
          </div>
          <div className="p-4 border border-zinc-200 rounded-lg bg-white">
            <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
              Inventory Value (INR)
            </div>
            <div className="text-xl font-bold text-zinc-900 mt-0.5">
              ₹{Number(metrics.totalInventoryValue).toLocaleString("en-IN")}
            </div>
          </div>
          <div className="p-4 border border-zinc-200 rounded-lg bg-white">
            <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
              Low Stock Alert
            </div>
            <div className="text-xl font-bold text-zinc-900 mt-0.5">
              {metrics.lowStockCount} items
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setActiveSearch(searchInput.trim());
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title or category..."
            className="text-xs border border-zinc-300 rounded px-3 py-1.5 w-64 focus:outline-none focus:border-zinc-900"
          />
          <button
            type="submit"
            className="text-xs px-3 py-1.5 bg-zinc-900 text-white rounded hover:bg-zinc-800 font-medium"
          >
            Filter
          </button>
        </form>

        <Link
          href="/admin/products/new"
          className="text-xs px-3 py-1.5 bg-zinc-900 text-white rounded hover:bg-zinc-800 font-medium text-center"
        >
          + Add New Product
        </Link>
      </div>

      {isLoading ? (
        <div className="text-xs text-zinc-400 py-16 text-center">Loading catalog...</div>
      ) : isError ? (
        <div className="p-4 bg-red-50 text-red-700 text-xs border border-red-200 rounded">
          Failed to load admin products from server
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-300 rounded-lg bg-white">
          <p className="text-xs text-zinc-500 mb-3">No products found in inventory.</p>
          <Link
            href="/admin/products/new"
            className="text-xs px-3 py-1.5 bg-zinc-900 text-white rounded hover:bg-zinc-800 font-medium"
          >
            Create Product
          </Link>
        </div>
      ) : (
        <div className="border border-zinc-200 rounded-lg bg-white overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price (INR)</th>
                <th className="p-3">Stock</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imageUrl}
                        alt=""
                        className="w-10 h-10 rounded object-cover bg-zinc-100 border border-zinc-200"
                      />
                      <div>
                        <div className="font-semibold text-zinc-900">{p.title}</div>
                        <div className="text-zinc-400 text-[11px] line-clamp-1 max-w-xs">
                          {p.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-zinc-600 font-medium">{p.category}</td>
                  <td className="p-3 font-bold text-zinc-900">
                    ₹{Number(p.price).toLocaleString("en-IN")}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        p.stock <= 0
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : p.stock < 10
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-3">
                    <Link
                      href={`/admin/products/${p._id}/edit`}
                      className="text-zinc-700 hover:text-zinc-950 font-medium underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id, p.title)}
                      disabled={isDeleting}
                      className="text-rose-600 hover:text-rose-800 font-medium underline disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
