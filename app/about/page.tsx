"use client";

import React from 'react';
import Link from 'next/link'; // Import the Link component

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-start justify-start p-12 gap-12">
      {/* Header */}
      <div className="z-10 w-full max-w-5xl flex flex-col items-start text-sm lg:flex-col">
        {/* Main title link to homepage */}
        <Link href="/" className="cursor-pointer no-underline">
          <h1 className="text-6xl font-bold">AUSPIDIAM<span className="font-normal text-4xl">.about</span></h1>
        </Link>
      </div>

      {/* Main content section */}
      <div className="z-10 w-full max-w-2xl text-left mx-auto">
        <p>
          Auspidiam is a portmanteau of auspidicous and diamond, which is the english translation of my name. Pronounced oss-pid-ee-um.
        </p>
        <p className="mt-4">
          A lot of the content here will be nonsensical, but that is okay.
        </p>
      </div>
    </main>
  );
}
