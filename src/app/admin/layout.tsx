import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-6 border-b border-zinc-200 gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 mb-1">
            RBAC Portal
          </div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Inventory Management
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="text-xs px-3 py-1.5 border border-zinc-200 text-zinc-700 rounded hover:bg-zinc-50 transition-colors font-medium"
          >
            All Products
          </Link>
          <Link
            href="/admin/products/new"
            className="text-xs px-3 py-1.5 bg-zinc-900 text-white rounded hover:bg-zinc-800 transition-colors font-medium"
          >
            + New Product
          </Link>
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-900 ml-2 transition-colors font-medium"
          >
            Public Catalog &rarr;
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
