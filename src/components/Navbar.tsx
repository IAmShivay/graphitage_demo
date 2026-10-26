"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetMeQuery, useLogoutMutation, useSeedDbMutation } from "@/store/api";

export default function Navbar() {
  const router = useRouter();
  const { data: meData, isLoading, isError } = useGetMeQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [seedDb, { isLoading: isSeeding }] = useSeedDbMutation();

  const user = !isError && meData?.success ? meData.user : null;

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleSeed = async () => {
    try {
      await seedDb().unwrap();
      router.refresh();
    } catch (err) {
      console.error("Seed failed:", err);
    }
  };

  return (
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-6 h-6 bg-zinc-950 text-white rounded flex items-center justify-center text-xs font-bold">
              G
            </span>
            <span className="font-semibold text-sm tracking-tight text-zinc-900">
              Graphitage Demo
            </span>
          </Link>
          <nav className="flex items-center gap-5 text-xs font-medium text-zinc-600">
            <Link href="/" className="hover:text-zinc-950 transition-colors">
              Showcase
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/admin/products"
                className="text-zinc-950 hover:text-black font-semibold"
              >
                Admin CRUD
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="px-2.5 py-1 text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded hover:bg-zinc-50 transition-colors disabled:opacity-50"
          >
            {isSeeding ? "Seeding..." : "Seed DB"}
          </button>

          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-3 pl-2 border-l border-zinc-200">
                  <div className="flex items-center gap-1.5 text-zinc-700">
                    <span className="font-medium text-zinc-900">{user.name}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold ${
                        user.role === "admin"
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-zinc-500 hover:text-zinc-900 transition-colors disabled:opacity-50"
                  >
                    {isLoggingOut ? "Logging out..." : "Log out"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3 py-1.5 text-zinc-700 hover:text-zinc-950 transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded font-medium transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
