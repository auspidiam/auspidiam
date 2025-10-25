"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 16; // keep inside viewport
      const jitter = 6; // small random wobble in px

      const rect = titleRef.current?.getBoundingClientRect();
      if (!rect) return;

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const pad = 24; // distance from title box

      // Candidate anchors tight around the title
      const anchors: Position[] = [
        // directly above
        { x: cx, y: rect.top - pad },
        // above-left
        { x: rect.left - (rect.width * 0.25 + 50), y: cy - rect.height * 0.25 },
        // above-right
        { x: rect.right + (rect.width * 0.25 + 50), y: cy - rect.height * 0.25 },
      ];

      // Shuffle anchors for variety per refresh
      for (let i = anchors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [anchors[i], anchors[j]] = [anchors[j], anchors[i]];
      }

      // Assign anchors to links with small jitter and clamp to viewport
      const results: Positions = {
        about: { x: 0, y: 0 },
        audits: { x: 0, y: 0 },
        analysis: { x: 0, y: 0 },
      };

      LINKS.forEach((link, idx) => {
        const a = anchors[idx];
        const x = Math.max(margin, Math.min(vw - margin, a.x + (Math.random() * 2 - 1) * jitter));
        const y = Math.max(margin, Math.min(vh - margin, a.y + (Math.random() * 2 - 1) * jitter));
        results[link.id] = { x, y };
      });

      setPositions(results);
    };

    // Compute after layout
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
        <h1 ref={titleRef} className="pointer-events-auto text-6xl font-bold tracking-tight text-black">
          Auspidiam
        </h1>
      </Link>

      {/* Nearby links, tightly clustered around the title */}
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
