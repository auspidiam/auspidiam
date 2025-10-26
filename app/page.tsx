"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type LinkId = "about" | "audits" | "analysis";

type Offset = { dx: number; dy: number };

type Offsets = Record<LinkId, Offset>;

const LINKS: { id: LinkId; text: string; href: string }[] = [
  { id: "analysis", text: "analysis.", href: "/analysis" },
  { id: "about", text: "about.", href: "/about" },
  { id: "audits", text: "audits.", href: "/audits" },
];

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export default function Home() {
  const [offsets, setOffsets] = useState<Offsets | null>(null);

  useEffect(() => {
    const J = 6; // jitter in px

    // Four anchor positions around center (above, below, left, right)
    // Slightly farther than before, per request
    const ANCHORS: Offset[] = [
      { dx: 0, dy: -96 },  // above
      { dx: 0, dy: 96 },   // below
      { dx: -120, dy: 0 }, // left
      { dx: 120, dy: 0 },  // right
    ];

    // Shuffle and select any three anchors so the trio appears around the title
    const anchors = [...ANCHORS];
    for (let i = anchors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [anchors[i], anchors[j]] = [anchors[j], anchors[i]];
    }
    const chosen = anchors.slice(0, 3);

    const ids: LinkId[] = ["analysis", "about", "audits"]; // stable order

    const res: Offsets = {
      about: { dx: 0, dy: 0 },
      audits: { dx: 0, dy: 0 },
      analysis: { dx: 0, dy: 0 },
    };

    for (let i = 0; i < 3; i++) {
      const a = chosen[i];
      res[ids[i]] = { dx: a.dx + rand(-J, J), dy: a.dy + rand(-J, J) };
    }

    setOffsets(res);
  }, []);

  return (
    <main className="relative flex flex-1 w-full items-center justify-center overflow-hidden bg-white">
      <div className="relative z-20">
        <Link href="/" className="select-none no-underline">
          <h1 className="pointer-events-auto text-6xl font-bold tracking-tight text-black">
            Auspidiam.
          </h1>
        </Link>

        {/* Nearby links, positioned relative to this wrapper's center */}
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
