"use client";

import Link from "next/link";

export default function AudioPage() {
  return (
    <main className="relative min-h-screen w-full bg-white">
      {/* Back home link pinned to the viewport's upper-left */}
      <div className="absolute top-8 left-8 z-30">
        <Link
          href="/"
          aria-label="Back home"
          className="flex items-center gap-2 text-sm text-black hover:opacity-70"
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
      </div>

      {/* Centered title */}
      <div className="flex h-full w-full items-center justify-center">
        <h1 className="text-6xl font-bold tracking-tight text-black text-center">
          Audio.
        </h1>
      </div>
    </main>
  );
}
