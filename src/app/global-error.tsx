"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-zinc-50/50 text-zinc-900 antialiased p-6">
        <div className="w-full max-w-md border border-zinc-200 rounded-lg bg-white p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
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
            Critical System Error
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-xs text-zinc-500 mb-6">
            A critical error occurred while rendering the application. You can try recovering the session or returning to the homepage.
          </p>

          {error?.digest && (
            <div className="mb-6 p-2.5 bg-zinc-50 border border-zinc-200 rounded text-left">
              <span className="block text-[10px] font-semibold uppercase text-zinc-400">
                Error Reference
              </span>
              <code className="text-[11px] text-zinc-600 font-mono break-all">
                {error.digest}
              </code>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="w-full sm:w-auto px-4 py-2 border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-xs font-medium rounded transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
