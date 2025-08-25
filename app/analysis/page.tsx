// file: app/analysis/page.tsx
import Link from 'next/link';

export default function AnalysisPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 text-center gap-12">
      <div className="z-10 w-full max-w-5xl flex flex-col items-center text-sm lg:flex-col text-center">
        <Link href="/" className="cursor-pointer no-underline">
          <h1 className="text-6xl font-bold">Auspidiam</h1>
        </Link>
        <div>
          <Link href="/about" className="hover:underline">about</Link>
          <span> | </span>
          <Link href="/audits" className="hover:underline">audits</Link>
          <span> | </span>
          <Link href="/analysis" className="font-bold hover:underline" style={{ color: 'var(--text-neon-red)' }}>analysis</Link>
        </div>
      </div>

      <div className="z-10 w-full max-w-2xl text-left mx-auto">
        <p>
          This page will be dedicated to your scientific papers and technical writing.
          This is just placeholder content for now.
        </p>
      </div>
    </main>
  );
}