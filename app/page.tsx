"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type LinkId = "about" | "audits" | "analysis";

type Offset = { dx: number; dy: number };

type Offsets = Record<LinkId, Offset>;

const LINKS: { id: LinkId; text: string; href: string }[] = [
  { id: "analysis", text: "analysis", href: "/analysis" },
  { id: "about", text: "about", href: "/about" },
  { id: "audits", text: "audits", href: "/audits" },
];

// Helper for small randomness
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export default function Home() {
  const [offsets, setOffsets] = useState<Offsets | null>(null);

  useEffect(() => {
    // Compute small offsets RELATIVE TO THE CENTER WRAPPER, not the viewport
    // This avoids any bottom-right drift from absolute positioning contexts.
    const J = 6; // jitter in px

    // Three anchor offsets around center: directly above, above-left, above-right
    const anchors: Offset[] = [
      { dx: 0, dy: -84 },
      { dx: -90, dy: -36 },
      { dx: 90, dy: -36 },
    ];

    // Rotate assignment each refresh for variety
    const order = Math.floor(Math.random() * anchors.length);
    const ids: LinkId[] = ["analysis", "about", "audits"]; // stable order

    const res: Offsets = {
      about: { dx: 0, dy: 0 },
      audits: { dx: 0, dy: 0 },
      analysis: { dx: 0, dy: 0 },
    };

    for (let i = 0; i < 3; i++) {
      const a = anchors[(i + order) % 3];
      res[ids[i]] = { dx: a.dx + rand(-J, J), dy: a.dy + rand(-J, J) };
    }

    setOffsets(res);
  }, []);

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white">
      {/* Center wrapper becomes the positioning context for nearby links */}
      <div className="relative">
        <Link href="/" className="select-none no-underline">
          <h1 className="pointer-events-auto text-6xl font-bold tracking-tight text-black">
            Auspidiam
          </h1>
        </Link>

        {/* Nearby links, positioned RELATIVE to this wrapper's center */}
        {offsets && (
          <>
            {LINKS.map((l) => (
              <Link
                key={l.id}
                href={l.href}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl lowercase tracking-wide text-black transition-opacity hover:opacity-70"
                style={{
                  transform: `translate(calc(-50% + ${offsets[l.id].dx}px), calc(-50% + ${offsets[l.id].dy}px))`,
                  zIndex: 10,
                }}
              >
                {l.text}
              </Link>
            ))}
          </>
        )}
      </div>
    </main>
  );
}
