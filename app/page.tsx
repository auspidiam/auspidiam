"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  // State to hold the final, saved position of each element
  const [positions, setPositions] = useState<Positions>({
    about: { x: 0, y: 0 },
    audits: { x: 0, y: 0 },
    analysis: { x: 0, y: 0 },
  });

  // Ref to track which element is being dragged
  const isDraggingRef = useRef<LinkId | null>(null);
  // Ref to store the last known mouse/touch position for smooth dragging
  const lastPositionRef = useRef({ x: 0, y: 0 });
  // Ref to track the element's current position during a drag
  const currentPositionRef = useRef<Position>({ x: 0, y: 0 });
  // Ref to store the initial position of a link when a drag starts
  const initialPositionRef = useRef<Position | null>(null);

  // Refs for DOM elements
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dropzoneRef = useRef<HTMLDivElement | null>(null);
  // FIX: Updated the ref type back to HTMLAnchorElement
  const itemRefs: { [key in LinkId]: RefObject<HTMLAnchorElement | null> } = {
    about: useRef(null),
    audits: useRef(null),
    analysis: useRef(null),
  };

  // State to control visibility after initial positioning
  const [isLoaded, setIsLoaded] = useState(false);

  // Function to handle the start of a drag event
  const handleDragStart = (e: MouseEvent | TouchEvent, id: LinkId) => {
    e.preventDefault();
    isDraggingRef.current = id;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    lastPositionRef.current = { x: clientX, y: clientY };

    // Store the initial position of the element for the drag
    currentPositionRef.current = { ...positions[id] };
    initialPositionRef.current = { ...positions[id] };
    
    // Disable CSS transitions during drag for immediate feedback
    const itemRef = itemRefs[id].current;
    if (itemRef) {
      itemRef.style.transition = 'none';
    }
  };

  // Function to handle the drag movement
  const handleDragMove = useCallback((e: globalThis.MouseEvent | globalThis.TouchEvent) => {
    const isDragging = isDraggingRef.current;
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - lastPositionRef.current.x;
    const deltaY = clientY - lastPositionRef.current.y;

    currentPositionRef.current.x += deltaX;
    currentPositionRef.current.y += deltaY;

    const itemRef = itemRefs[isDragging].current;
    if (itemRef) {
      // Apply the position via transform to avoid conflicts
      itemRef.style.transform = `translate(${currentPositionRef.current.x}px, ${currentPositionRef.current.y}px)`;
    }

    lastPositionRef.current = { x: clientX, y: clientY };
  }, [itemRefs]);

  // Function to handle the end of a drag event
  const handleDragEnd = () => {
    const isDragging = isDraggingRef.current;
    if (isDragging && initialPositionRef.current) {
      const itemRef = itemRefs[isDragging].current;
      const dropzoneRefCurrent = dropzoneRef.current;

      let droppedInDropzone = false;
      if (itemRef && dropzoneRefCurrent) {
        // Re-enable CSS transitions
        itemRef.style.transition = 'all 200ms ease-in-out';

        const itemRect = itemRef.getBoundingClientRect();
        const dropzoneRect = dropzoneRefCurrent.getBoundingClientRect();

        // Check for collision using a simple bounding box check
        if (
          itemRect.left >= dropzoneRect.left &&
          itemRect.right <= dropzoneRect.right &&
          itemRect.top >= dropzoneRect.top &&
          itemRect.bottom <= dropzoneRect.bottom
        ) {
          droppedInDropzone = true;
          const linkHref = links.find(link => link.id === isDragging)?.href;
          if (linkHref) {
            router.push(linkHref);
          }
        }
      }
      
      // If dropped outside the drop zone, snap it back to its original position
      if (!droppedInDropzone) {
        setPositions(prev => ({
          ...prev,
          [isDragging as LinkId]: initialPositionRef.current as Position,
        }));
      }
    }

    isDraggingRef.current = null;
    initialPositionRef.current = null;
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

  // Initial positioning logic
  useEffect(() => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newPositions: Positions = {
        about: { x: 0, y: 0 },
        audits: { x: 0, y: 0 },
        analysis: { x: 0, y: 0 },
      };

      // Define an orbit radius around the center drop zone
      const orbitRadius = 300; 

      // Calculate center coordinates
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;

      // Position links around the drop zone
      const angleStep = (2 * Math.PI) / links.length;
      links.forEach((link, index) => {
        const angle = angleStep * index;
        newPositions[link.id] = {
          x: centerX + orbitRadius * Math.cos(angle),
          y: centerY + orbitRadius * Math.sin(angle),
        };
      });

      setPositions(newPositions);
      setIsLoaded(true);
    }
  }, []);

  return (
    <main
      ref={containerRef}
      className="flex min-h-screen w-full flex-col relative overflow-hidden"
    >
      <div className="fixed top-12 left-1/2 -translate-x-1/2 z-20">
        <Link href="/" className="cursor-pointer no-underline">
          <h1 className="text-6xl font-bold text-black">AUSPIDIAM</h1>
        </Link>
      </div>
      
      {/* Container for the central drop zone square */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div 
          ref={dropzoneRef}
          className="
            w-64 h-64 rounded-none
            border-2 border-black
            bg-gray-200/50
          "
        ></div>
      </div>

      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          ref={itemRefs[link.id]}
          className={`
            absolute
            cursor-pointer select-none
            -translate-x-1/2 -translate-y-1/2
            ${isDraggingRef.current === link.id ? 'opacity-80 scale-105 z-30' : 'z-10'}
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            transform: `translate(${positions[link.id].x}px, ${positions[link.id].y}px)`,
          }}
          onMouseDown={(e) => handleDragStart(e, link.id)}
          onTouchStart={(e) => handleDragStart(e, link.id)}
          onClick={(e) => {
            // Prevent navigation if the user is dragging
            if (isDraggingRef.current) {
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
