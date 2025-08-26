"use client";

import React from 'react';
import Link from 'next/link'; // Import the Link component

export default function AuditsPage() {
  return (
    <main className="flex min-h-screen flex-col items-start justify-start p-12 gap-12">
      {/* Header and navigation */}
      <div className="z-10 w-full max-w-5xl flex flex-col items-start text-sm lg:flex-col">
        {/* Main title link to homepage */}
        <Link href="/" className="cursor-pointer no-underline">
          <h1 className="text-6xl font-bold">AUSPIDIAM<span className="font-normal text-4xl">.audits</span></h1>
        </Link>
      </div>

      {/* Main content section */}
      <div className="z-10 w-full max-w-2xl text-left mx-auto">
        <p>
          This is a placeholder for the audits page. This content will feature information on our past and current audit processes.
        </p>
        <p className="mt-4">
          Similar to the other pages, the content here will be updated later.
        </p>
      </div>
    </main>
  );
}
