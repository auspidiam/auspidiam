"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="relative flex flex-1 w-full items-center justify-center overflow-hidden bg-white">
      {/* Back home link (fixed in upper-left corner) */}
      <Link
        href="/"
        aria-label="Back home"
        className="fixed top-8 left-8 flex items-center gap-2 text-sm text-black hover:opacity-70"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <path d="M12 19l-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        <span>back home</span>
      </Link>

      {/* Centered title */}
      <h1 className="text-6xl font-bold tracking-tight text-black text-center">
        About.
      </h1>
    </main>
  );
}
