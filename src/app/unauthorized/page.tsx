import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="max-w-md mx-auto my-16 p-6 border border-zinc-200 rounded-lg bg-white shadow-sm text-center">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose-600 mb-1">
        403 Forbidden
      </div>
      <h1 className="text-lg font-bold text-zinc-900 mb-2">Access Restricted</h1>
      <p className="text-xs text-zinc-500 mb-6">
        Administrator permissions are required to access this resource. Your account role does not have authorization.
      </p>
      <div className="flex justify-center gap-3">
        <Link
          href="/"
          className="text-xs px-4 py-2 bg-zinc-900 text-white rounded font-medium hover:bg-zinc-800 transition-colors"
        >
          Return to Catalog
        </Link>
        <Link
          href="/login"
          className="text-xs px-4 py-2 border border-zinc-300 rounded font-medium hover:bg-zinc-50 text-zinc-700 transition-colors"
        >
          Sign In as Admin
        </Link>
      </div>
    </div>
  );
}
