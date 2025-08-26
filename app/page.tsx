"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import type { MouseEvent, TouchEvent } from 'react';

// Define the shape and content of each interactive link
const links = [
  { id: 'about', text: 'about', href: '/about' },
  { id: 'audits', text: 'audits', href: '/audits' },
  { id: 'analysis', text: 'analysis', href: '/analysis' },
];

export default function Home() {
  // State to hold the position of each element
  const [positions, setPositions] = useState({
    about: { x: 0, y: 0 },
    audits: { x: 0, y: 0 },
    analysis: { x: 0, y: 0 },
  });

  // State to track which element is being dragged
  // The type is explicitly defined as string | null
  const [isDragging, setIsDragging] = useState<string | null>(null);
  // Ref to store the last known mouse/touch position for smooth dragging
  const lastPositionRef = useRef({ x: 0, y: 0 });
  // Ref to measure the container and each draggable element
  const containerRef = useRef(null);
  const itemRefs = {
    about: useRef(null),
    audits: useRef(null),
    analysis: useRef(null),
  };
  // New state to control visibility after positions are calculated
  const [isLoaded, setIsLoaded] = useState(false);

  // Function to handle the start of a drag event (for both mouse and touch)
  const handleDragStart = (e: MouseEvent | TouchEvent, id: string) => {
    e.preventDefault();
    setIsDragging(id);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    lastPositionRef.current = { x: clientX, y: clientY };
  };

  // Function to handle the drag movement wrapped in useCallback
  const handleDragMove = useCallback((e: globalThis.MouseEvent | globalThis.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    // Calculate the change in position (delta)
    const deltaX = clientX - lastPositionRef.current.x;
    const deltaY = clientY - lastPositionRef.current.y;

    // Update positions based on the delta
    setPositions(prevPositions => ({
      ...prevPositions,
      [isDragging]: {
        x: prevPositions[isDragging].x + deltaX,
        y: prevPositions[isDragging].y + deltaY,
      },
    }));

    // Update the last position for the next movement calculation
    lastPositionRef.current = { x: clientX, y: clientY };
  }, [isDragging]);

  // Function to handle the end of a drag event
  const handleDragEnd = () => {
    setIsDragging(null);
  };

  // Effect to set up event listeners for dragging
  useEffect(() => {
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleDragMove, { passive: false });
    window.addEventListener('touchend', handleDragEnd);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove]);

  // Effect to handle initial random positioning on component mount
  useEffect(() => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const initialPositions = {};
      const placedRects = [];
      const safePadding = 50; // Extra spacing between elements

      links.forEach(link => {
        const itemRef = itemRefs[link.id].current;
        if (!itemRef) return; // Safeguard against refs not being available yet

        let randomX, randomY;
        let isOverlapping;
        let attempts = 0;

        do {
          // Calculate a random position within a viewable central area, accounting for element size
          const containerPadding = 350; // Increased padding for more conservative placement
          const itemWidth = itemRef.offsetWidth;
          const itemHeight = itemRef.offsetHeight;

          randomX = containerPadding + Math.random() * (containerRect.width - itemWidth - containerPadding * 2);
          randomY = containerPadding + Math.random() * (containerRect.height - itemHeight - containerPadding * 2);

          // Check for overlap with previously placed items
          isOverlapping = placedRects.some(pr => {
            // Updated overlap check to be more robust and include safePadding
            const horizontalOverlap = (randomX < pr.x + pr.width + safePadding) && (randomX + itemWidth + safePadding > pr.x);
            const verticalOverlap = (randomY < pr.y + pr.height + safePadding) && (randomY + itemHeight + safePadding > pr.y);
            return horizontalOverlap && verticalOverlap;
          });
          attempts++;
        } while (isOverlapping && attempts < 100); // Increased attempts for better results

        initialPositions[link.id] = { x: randomX, y: randomY };

        placedRects.push({
          x: randomX,
          y: randomY,
          width: itemRef.offsetWidth,
          height: itemRef.offsetHeight,
        });
      });

      setPositions(initialPositions);
      // Set loaded to true after positions are calculated
      setIsLoaded(true);
    }
  }, [itemRefs]);

  return (
    <main
      ref={containerRef}
      className="flex min-h-screen w-full flex-col relative overflow-hidden"
    >
      <div className="fixed top-12 left-12 z-20">
        <Link href="/" className="cursor-pointer no-underline">
          <h1 className="text-6xl font-bold text-black">AUSPIDIAM</h1>
        </Link>
      </div>

      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          ref={itemRefs[link.id]}
          className={`
            absolute transition-all duration-200 ease-in-out
            cursor-pointer
            ${isDragging === link.id ? 'opacity-80 scale-105 z-30' : 'z-10'}
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            transform: `translate(${positions[link.id].x}px, ${positions[link.id].y}px)`,
          }}
          onMouseDown={(e) => handleDragStart(e, link.id)}
          onTouchStart={(e) => handleDragStart(e, link.id)}
        >
          {link.text}
        </Link>
      ))}
    </main>
  );
}
