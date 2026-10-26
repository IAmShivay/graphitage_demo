"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto my-16 p-8 border border-zinc-200 rounded-lg bg-white shadow-sm text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.75"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>

      <div className="text-[11px] font-bold uppercase tracking-wider text-red-600 mb-1">
        Application Error
      </div>
      <h1 className="text-xl font-bold tracking-tight text-zinc-900 mb-2">
        An unexpected error occurred
      </h1>
      <p className="text-xs text-zinc-500 mb-6">
        We encountered a problem loading this section. You can retry the operation or return to the showcase.
      </p>

      {error?.digest && (
        <div className="mb-6 p-2.5 bg-zinc-50 border border-zinc-200 rounded text-left">
          <span className="block text-[10px] font-semibold uppercase text-zinc-400">
            Digest Code
          </span>
          <code className="text-[11px] text-zinc-600 font-mono break-all">
            {error.digest}
          </code>
        </div>
      )}

      <div className="flex justify-center gap-3">
        <button
          onClick={() => reset()}
          className="text-xs px-4 py-2 bg-zinc-900 text-white rounded font-medium hover:bg-zinc-800 transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="text-xs px-4 py-2 border border-zinc-300 rounded font-medium hover:bg-zinc-50 text-zinc-700 transition-colors"
        >
          Return to Showcase
        </Link>
      </div>
    </div>
  );
}
