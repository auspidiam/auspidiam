"use client";

import React from 'react';

export default function AnalysisPage() {
  return (
    <main className="flex min-h-screen flex-col items-start justify-start p-12 gap-12">
      {/* Header */}
      <div className="z-10 w-full max-w-5xl flex flex-col items-start text-sm lg:flex-col">
        {/* Main title link to homepage */}
        <a href="/" className="cursor-pointer no-underline">
          <h1 className="text-6xl font-bold">AUSPIDIAM<span className="font-normal text-4xl">.analysis</span></h1>
        </a>
      </div>

      {/* Main content section */}
      <div className="z-10 w-full max-w-2xl text-left mx-auto">
        <p>
          This is a placeholder for the analysis page. This content will be updated to include more details about our data analysis methods and findings.
        </p>
        <p className="mt-4">
          This content is nonsensical for now, but will be updated later.
        </p>
      </div>
    </main>
  );
}
