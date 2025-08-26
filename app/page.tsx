"use client";

import { useEffect, useState, useRef, useCallback, useLayoutEffect } from 'react';
import Link from 'next/link';
import type { MouseEvent, TouchEvent, RefObject } from 'react';

// Define the types for the link IDs and positions
type LinkId = 'about' | 'audits' | 'analysis';

type Position = {
  x: number;
  y: number;
};

type Positions = {
  [key in LinkId]: Position;
};

// Define the shape and content of each interactive link
const links: { id: LinkId; text: string; href: string }[] = [
  { id: 'about', text: 'about', href: '/about' },
  { id: 'audits', text: 'audits', href: '/audits' },
  { id: 'analysis', text: 'analysis', href: '/analysis' },
];

export default function Home() {
  // State to hold the final, saved position of each element
  const [positions, setPositions] = useState<Positions>({
    about: { x: 0, y: 0 },
    audits: { x: 0, y: 0 },
    analysis: { x: 0, y: 0 },
  });

  // Ref to track which element is being dragged, for performance
  const isDraggingRef = useRef<LinkId | null>(null);
  // Ref to store the last known mouse/touch position for smooth dragging
  const lastPositionRef = useRef({ x: 0, y: 0 });
  // Ref to track if a drag has occurred (to differentiate from a click)
  const isDragEventRef = useRef(false);

  // Refs to measure the container and each draggable element
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs: { [key in LinkId]: RefObject<HTMLAnchorElement | null> } = {
    about: useRef(null),
    audits: useRef(null),
    analysis: useRef(null),
  };
  // New state to control visibility after positions are calculated
  const [isLoaded, setIsLoaded] = useState(false);

  // Function to handle the start of a drag event (for both mouse and touch)
  const handleDragStart = (e: MouseEvent | TouchEvent, id: LinkId) => {
    // We only prevent default if we determine it's a drag later
    isDragEventRef.current = false;
    isDraggingRef.current = id;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    lastPositionRef.current = { x: clientX, y: clientY };
  };

  // Function to handle the drag movement wrapped in useCallback
  const handleDragMove = useCallback((e: globalThis.MouseEvent | globalThis.TouchEvent) => {
    const isDragging = isDraggingRef.current;
    if (!isDragging) return;

    // Prevent default on move to stop scrolling and text selection
    e.preventDefault();
    isDragEventRef.current = true; // Set flag to indicate a drag is in progress

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - lastPositionRef.current.x;
    const deltaY = clientY - lastPositionRef.current.y;

    const itemRef = itemRefs[isDragging].current;
    if (itemRef) {
      const currentTransform = itemRef.style.transform;
      const matrixMatch = currentTransform.match(/matrix.*\((.+)\)/);
      let currentX = 0;
      let currentY = 0;
      if (matrixMatch) {
        const matrixValues = matrixMatch[1].split(',').map(Number);
        currentX = matrixValues[4];
        currentY = matrixValues[5];
      }

      itemRef.style.transform = `translate(${currentX + deltaX}px, ${currentY + deltaY}px)`;
    }

    lastPositionRef.current = { x: clientX, y: clientY };
  }, [itemRefs]);

  // Function to handle the end of a drag event
  const handleDragEnd = () => {
    if (isDraggingRef.current) {
      const itemRef = itemRefs[isDraggingRef.current].current;
      if (itemRef) {
        const currentTransform = itemRef.style.transform;
        const matrixMatch = currentTransform.match(/matrix.*\((.+)\)/);
        let finalX = 0;
        let finalY = 0;
        if (matrixMatch) {
          const matrixValues = matrixMatch[1].split(',').map(Number);
          finalX = matrixValues[4];
          finalY = matrixValues[5];
        }
        
        // Save the final position to state
        setPositions(prev => ({
          ...prev,
          [isDraggingRef.current as LinkId]: { x: finalX, y: finalY }
        }));
      }
    }

    isDraggingRef.current = null;
    isDragEventRef.current = false;
  };

  // Effect to set up event listeners for dragging
  useEffect(() => {
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleDragMove, { passive: false });
    window.addEventListener('touchend', handleDragEnd);

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [handleDragMove]);

  // Use useLayoutEffect to handle initial random positioning on component mount
  // This runs synchronously after DOM updates, ensuring element dimensions are available
  useLayoutEffect(() => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const initialPositions: Partial<Positions> = {};
      const placedRects: { x: number; y: number; width: number; height: number }[] = [];
      const safePadding = 50;

      links.forEach(link => {
        const itemRef = itemRefs[link.id].current;
        if (!itemRef) return;

        let randomX: number;
        let randomY: number;
        let isOverlapping: boolean;
        let attempts = 0;

        do {
          const containerPadding = 350;
          const itemWidth = itemRef.offsetWidth;
          const itemHeight = itemRef.offsetHeight;

          randomX = containerPadding + Math.random() * (containerRect.width - itemWidth - containerPadding * 2);
          randomY = containerPadding + Math.random() * (containerRect.height - itemHeight - containerPadding * 2);

          isOverlapping = placedRects.some(pr => {
            const horizontalOverlap = (randomX < pr.x + pr.width + safePadding) && (randomX + itemWidth + safePadding > pr.x);
            const verticalOverlap = (randomY < pr.y + pr.height + safePadding) && (randomY + itemHeight + safePadding > pr.y);
            return horizontalOverlap && verticalOverlap;
          });
          attempts++;
        } while (isOverlapping && attempts < 100);

        initialPositions[link.id] = { x: randomX, y: randomY };

        placedRects.push({
          x: randomX,
          y: randomY,
          width: itemRef.offsetWidth,
          height: itemRef.offsetHeight,
        });
      });

      setPositions(initialPositions as Positions);
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
            cursor-pointer select-none
            ${isDraggingRef.current === link.id ? 'opacity-80 scale-105 z-30' : 'z-10'}
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            transform: `translate(${positions[link.id].x}px, ${positions[link.id].y}px)`,
          }}
          onMouseDown={(e) => handleDragStart(e, link.id)}
          onTouchStart={(e) => handleDragStart(e, link.id)}
          onClick={(e) => {
            if (isDragEventRef.current) {
              e.preventDefault();
            }
          }}
        >
          {link.text}
        </Link>
      ))}
    </main>
  );
}
