import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShortsCheck — Fact-check any YouTube Short",
  description:
    "Paste a YouTube Shorts link and ShortsCheck extracts its claims, searches the web, and reports whether the content is true, false, misleading, or unverified.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a12] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
