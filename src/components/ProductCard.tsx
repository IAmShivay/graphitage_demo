import Link from "next/link";

export interface ProductData {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
}

export default function ProductCard({ product }: { product: ProductData }) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <div className="border border-zinc-200 rounded-lg bg-white overflow-hidden flex flex-col justify-between hover:border-zinc-300 transition-all">
      <div>
        <div className="aspect-[4/3] w-full bg-zinc-100 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1">
            {product.category}
          </div>
          <h2 className="text-sm font-semibold text-zinc-900 mb-1 line-clamp-1">
            {product.title}
          </h2>
          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-zinc-900">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOutOfStock
                  ? "bg-rose-500"
                  : isLowStock
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
            />
            <span className="text-[11px] text-zinc-500">
              {isOutOfStock
                ? "Out of stock"
                : isLowStock
                ? `${product.stock} left`
                : "In stock"}
            </span>
          </div>
        </div>

        <Link
          href={`/products/${product._id}`}
          className="text-xs font-medium px-3 py-1.5 rounded bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-100 transition-colors"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
