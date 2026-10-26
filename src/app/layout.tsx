import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoreProvider from "@/store/StoreProvider";

export const metadata: Metadata = {
  title: "Graphitage Demo",
  description: "Graphitage Demo eCommerce store with Turbopack, MongoDB, Winston, and RBAC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-zinc-50/50 text-zinc-900 antialiased">
        <StoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
