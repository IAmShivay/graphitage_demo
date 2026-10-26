import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto my-16 p-8 border border-zinc-200 rounded-lg bg-white shadow-sm text-center">
      <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
        404 Not Found
      </div>
      <h1 className="text-xl font-bold tracking-tight text-zinc-900 mb-2">
        Page does not exist
      </h1>
      <p className="text-xs text-zinc-500 mb-6">
        The page you are looking for may have been moved, deleted, or does not exist.
      </p>
      <div className="flex justify-center gap-3">
        <Link
          href="/"
          className="text-xs px-4 py-2 bg-zinc-900 text-white rounded font-medium hover:bg-zinc-800 transition-colors"
        >
          Return to Showcase
        </Link>
        <Link
          href="/login"
          className="text-xs px-4 py-2 border border-zinc-300 rounded font-medium hover:bg-zinc-50 text-zinc-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
