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
    // Compute once on mount so it changes per refresh, not during hydration
    if (typeof window === "undefined") return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Center of viewport
    const cx = vw / 2;
    const cy = vh / 2;

    // Place each link in a ring around the center with gentle randomness
    // Keep them away from edges and from each other
    const MIN_R = Math.min(vw, vh) * 0.18; // inner radius
    const MAX_R = Math.min(vw, vh) * 0.30; // outer radius
    const MIN_GAP = Math.min(vw, vh) * 0.15; // min distance between labels

    // Start with evenly spaced base angles, then jitter
    const baseAngles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];

    function rand(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    // Shuffle baseAngles for variety
    for (let i = baseAngles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [baseAngles[i], baseAngles[j]] = [baseAngles[j], baseAngles[i]];
    }

    const placed: Position[] = [];

    function farEnough(p: Position) {
      return placed.every((q) => {
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        return Math.hypot(dx, dy) >= MIN_GAP;
      });
    }

    const results: Positions = { about: { x: cx, y: cy }, audits: { x: cx, y: cy }, analysis: { x: cx, y: cy } };

    LINKS.forEach((link, idx) => {
      let tries = 0;
      while (tries < 40) {
        const angle = baseAngles[idx] + rand(-Math.PI / 9, Math.PI / 9); // ~±20° jitter
        const r = rand(MIN_R, MAX_R);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);

        const p = { x, y };
        if (farEnough(p)) {
          placed.push(p);
          results[link.id] = p;
          break;
        }
        tries++;
      }
      // Fallback: if we somehow didn't place due to constraints, just stick it on base angle
      if (!results[link.id]) {
        const angle = baseAngles[idx];
        const r = (MIN_R + MAX_R) / 2;
        results[link.id] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
      }
    });

    setPositions(results);
  }, []);

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white">
      {/* Center title */}
      <Link href="/" className="select-none no-underline">
        <h1 className="pointer-events-auto text-6xl font-bold tracking-tight text-black">Auspidiam</h1>
      </Link>

      {/* Peripheral links */}
      {positions && (
        <div className="pointer-events-none absolute inset-0">
          {LINKS.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 text-xl lowercase tracking-wide text-black transition-opacity hover:opacity-70"
              style={{ left: positions[l.id].x, top: positions[l.id].y }}>
              {l.text}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
