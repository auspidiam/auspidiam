// file: app/page.tsx
'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Draggable Component
const Draggable = ({ children }: { children: React.ReactNode }) => {
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (elementRef.current) {
      setIsDragging(true);
      offsetRef.current = {
        x: e.clientX - elementRef.current.offsetLeft,
        y: e.clientY - elementRef.current.offsetTop,
      };
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !elementRef.current) return;
    const newX = e.clientX - offsetRef.current.x;
    const newY = e.clientY - offsetRef.current.y;

    elementRef.current.style.left = `${newX}px`;
    elementRef.current.style.top = `${newY}px`;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`absolute ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {children}
    </div>
  );
};

export default function HomePage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-24"
    >
      {/* 1. TOP HEADER SECTION */}
      <div className="z-10 w-full max-w-5xl flex flex-col items-center text-sm lg:flex-col text-center">
        <Link href="/" className="cursor-pointer no-underline">
          <h1 className="text-6xl font-bold">Auspidiam</h1>
        </Link>
        <div className="mt-2">
          <Link href="/about" className="hover:underline">about</Link>
          <span> | </span>
          <Link href="/audits" className="hover:underline">audits</Link>
          <span> | </span>
          <Link href="/analysis" className="hover:underline">analysis</Link>
        </div>
      </div>

      {/* 2. DRAGGABLE IMAGE & TEXT SECTION */}
      <div className="flex-grow w-full relative flex items-center justify-center">
        <div className="absolute text-2xl text-neon-green z-0">:)</div>
        <Draggable>
          <Image
            src="/theyarepooping.jpeg"
            alt="A descriptive name for the image"
            width={400}
            height={400}
          />
        </Draggable>
      </div>

      {/* 3. "ennui renaissance" SECTION */}
      <div className="z-10 w-full text-center text-xs mt-8">
        <h2 className="text-xl italic">ennui renaissance</h2>
      </div>
    </main>
  );
}