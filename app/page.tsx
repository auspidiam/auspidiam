"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type LinkId = "about" | "audits" | "analysis";

type Position = { x: number; y: number };

type Positions = Record<LinkId, Position>;

const LINKS: { id: LinkId; text: string; href: string }[] = [
  { id: "analysis", text: "analysis", href: "/analysis" },
  { id: "about", text: "about", href: "/about" },
  { id: "audits", text: "audits", href: "/audits" },
];

export default function Home() {
  const [positions, setPositions] = useState<Positions | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cx = vw / 2;
      const cy = vh / 2;

      // Very tight cluster around the exact screen center
      // Fixed offsets that bias ABOVE the title, with tiny random jitter
      const J = 8; // px jitter
      const anchors = [
        { x: cx, y: cy - 84 }, // straight above
        { x: cx - 90, y: cy - 36 }, // above-left
        { x: cx + 90, y: cy - 36 }, // above-right
      ];

      const jitter = (v: number) => v + (Math.random() * 2 - 1) * J;

      const results: Positions = {
        about: { x: 0, y: 0 },
        audits: { x: 0, y: 0 },
        analysis: { x: 0, y: 0 },
      };

      // Assign in a rotated order each refresh for simple variety
      const order = Math.floor(Math.random() * 3); // 0,1,2
      const ids: LinkId[] = ["analysis", "about", "audits"]; // consistent order

      for (let i = 0; i < 3; i++) {
        const id = ids[i];
        const a = anchors[(i + order) % 3];
        results[id] = { x: jitter(a.x), y: jitter(a.y) };
      }

      setPositions(results);
    };

    // Compute after first paint and on resize
    const raf = requestAnimationFrame(compute);
    window.addEventListener("resize", compute);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white">
      {/* Center title */}
      <Link href="/" className="select-none no-underline">
        <h1 className="pointer-events-auto text-6xl font-bold tracking-tight text-black">
          Auspidiam
        </h1>
      </Link>

      {/* Three nearby links */}
      {positions && (
        <div className="pointer-events-none absolute inset-0">
          {LINKS.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 text-xl lowercase tracking-wide text-black transition-opacity hover:opacity-70"
              style={{ left: positions[l.id].x, top: positions[l.id].y, zIndex: 10 }}
            >
              {l.text}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
