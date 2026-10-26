"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import { productValidationSchema } from "@/lib/validations/yupProduct";
import { useGetProductByIdQuery, useUpdateProductMutation } from "@/store/api";

const DEFAULT_CATEGORIES = [
  "Audio",
  "Accessories",
  "Wearables",
  "Bags",
  "Smart Home",
  "General",
];

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);

  const { data: response, isLoading: isFetchingProduct } = useGetProductByIdQuery(id);
  const [updateProduct] = useUpdateProductMutation();

  const product = response?.data;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price !== undefined ? String(product.price) : "",
      category: product?.category || "Audio",
      stock: product?.stock !== undefined ? String(product.stock) : "",
      imageUrl: product?.imageUrl || "",
    },
    validationSchema: productValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);
      try {
        await updateProduct({
          id,
          ...values,
          price: Number(values.price),
          stock: Number(values.stock),
        }).unwrap();

        router.push("/admin/products");
      } catch (err: any) {
        setServerError(err?.data?.error || "Failed to update product");
        setSubmitting(false);
      }
    },
  });

  const categoryOptions = Array.from(
    new Set([formik.values.category, ...DEFAULT_CATEGORIES].filter(Boolean))
  );

  if (isFetchingProduct) {
    return <div className="text-center py-16 text-xs text-zinc-400">Loading product...</div>;
  }

  return (
    <div className="max-w-xl mx-auto border border-zinc-200 rounded-lg p-6 bg-white shadow-sm">
      <div className="mb-6 flex items-center justify-between pb-4 border-b border-zinc-100">
        <div>
          <h2 className="text-base font-bold text-zinc-900">Edit Product</h2>
          <p className="text-xs text-zinc-500">Update item details in catalog</p>
        </div>
        <Link href="/admin/products" className="text-xs text-zinc-500 hover:text-zinc-900">
          Cancel
        </Link>
      </div>

      {serverError && (
        <div className="p-3 mb-4 text-xs bg-red-50 text-red-700 border border-red-200 rounded">
          {serverError}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4 text-xs" noValidate>
        <div>
          <label className="block font-medium text-zinc-700 mb-1">Product Title</label>
          <input
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full border rounded px-3 py-2 text-xs focus:outline-none transition-colors ${
              formik.touched.title && formik.errors.title
                ? "border-red-500 focus:border-red-500"
                : "border-zinc-300 focus:border-zinc-900"
            }`}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-[11px] text-red-600 mt-1">{formik.errors.title}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">Category</label>
            <select
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border rounded px-3 py-2 text-xs bg-white focus:outline-none transition-colors ${
                formik.touched.category && formik.errors.category
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-300 focus:border-zinc-900"
              }`}
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category && (
              <p className="text-[11px] text-red-600 mt-1">{formik.errors.category}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Price in INR (₹)</label>
            <input
              type="text"
              inputMode="decimal"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border rounded px-3 py-2 text-xs focus:outline-none transition-colors ${
                formik.touched.price && formik.errors.price
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-300 focus:border-zinc-900"
              }`}
            />
            {formik.touched.price && formik.errors.price && (
              <p className="text-[11px] text-red-600 mt-1 font-medium">{formik.errors.price}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">Stock Quantity</label>
            <input
              type="text"
              inputMode="numeric"
              name="stock"
              value={formik.values.stock}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border rounded px-3 py-2 text-xs focus:outline-none transition-colors ${
                formik.touched.stock && formik.errors.stock
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-300 focus:border-zinc-900"
              }`}
            />
            {formik.touched.stock && formik.errors.stock && (
              <p className="text-[11px] text-red-600 mt-1 font-medium">{formik.errors.stock}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formik.values.imageUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border rounded px-3 py-2 text-xs focus:outline-none transition-colors ${
                formik.touched.imageUrl && formik.errors.imageUrl
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-300 focus:border-zinc-900"
              }`}
            />
            {formik.touched.imageUrl && formik.errors.imageUrl && (
              <p className="text-[11px] text-red-600 mt-1">{formik.errors.imageUrl}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block font-medium text-zinc-700 mb-1">Description</label>
          <textarea
            rows={4}
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full border rounded px-3 py-2 text-xs focus:outline-none transition-colors ${
              formik.touched.description && formik.errors.description
                ? "border-red-500 focus:border-red-500"
                : "border-zinc-300 focus:border-zinc-900"
            }`}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-[11px] text-red-600 mt-1">{formik.errors.description}</p>
          )}
        </div>

        <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
          <Link
            href="/admin/products"
            className="px-3.5 py-2 border border-zinc-300 rounded text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="px-4 py-2 bg-zinc-900 text-white rounded hover:bg-zinc-800 disabled:opacity-50 font-medium"
          >
            {formik.isSubmitting ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
