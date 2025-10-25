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

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cx = vw / 2;
    const cy = vh / 2;

    // Tight ring close to the center
    const R_MIN = 90;   // px
    const R_MAX = 140;  // px
    const MIN_GAP = 110; // px between labels
    const jitter = Math.PI / 15; // ~±12°

    // Evenly spaced angles around top (-90°, 150°, 390°==30°)
    const baseAngles = [
      -Math.PI / 2,
      -Math.PI / 2 + (2 * Math.PI) / 3,
      -Math.PI / 2 + (4 * Math.PI) / 3,
    ];

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const placed: Position[] = [];
    const farEnough = (p: Position) =>
      placed.every((q) => Math.hypot(p.x - q.x, p.y - q.y) >= MIN_GAP);

    const results: Positions = {
      about: { x: cx, y: cy },
      audits: { x: cx, y: cy },
      analysis: { x: cx, y: cy },
    };

    LINKS.forEach((link, idx) => {
      let ok = false;
      for (let tries = 0; tries < 40; tries++) {
        const angle = baseAngles[idx] + rand(-jitter, jitter);
        const r = rand(R_MIN, R_MAX);
        const p = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
        if (farEnough(p)) {
          placed.push(p);
          results[link.id] = p;
          ok = true;
          break;
        }
      }
      if (!ok) {
        // Fallback: exact base angle, mid radius
        const angle = baseAngles[idx];
        const r = (R_MIN + R_MAX) / 2;
        results[link.id] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
      }
    });

    setPositions(results);
  }, []);

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white">
      {/* Center title */}
      <Link href="/" className="select-none no-underline">
        <h1 className="pointer-events-auto text-6xl font-bold tracking-tight text-black">
          Auspidiam
        </h1>
      </Link>

      {/* The three pages around it */}
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
