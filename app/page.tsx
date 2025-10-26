"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex flex-1 w-full items-center justify-center overflow-hidden bg-white">
      <div className="relative z-20">
        {/* Center title */}
        <Link href="/" className="select-none no-underline">
          <h1 className="pointer-events-auto text-6xl font-bold tracking-tight text-black text-center">
            Auspidiam.
          </h1>
        </Link>

        {/* Static positioned links around the title */}
        <Link
          href="/about"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full text-xl lowercase tracking-wide text-black hover:opacity-70"
          style={{ marginTop: "-110px" }}
        >
          about.
        </Link>

        <Link
          href="/arguments"
          className="absolute left-1/2 top-1/2 -translate-x-full -translate-y-1/2 text-xl lowercase tracking-wide text-black hover:opacity-70"
          style={{ marginLeft: "-150px" }}
        >
          arguments.
        </Link>

        <Link
          href="/analysis"
          className="absolute left-1/2 top-1/2 translate-x-0 -translate-y-1/2 text-xl lowercase tracking-wide text-black hover:opacity-70"
          style={{ marginLeft: "150px" }}
        >
          analysis.
        </Link>

        <Link
          href="/audio"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-full text-xl lowercase tracking-wide text-black hover:opacity-70"
          style={{ marginTop: "110px" }}
        >
          audio.
        </Link>
      </div>
    </main>
  );
}
