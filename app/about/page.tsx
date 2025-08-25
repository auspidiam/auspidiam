// file: app/about/page.tsx
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 text-center gap-12">
      <div className="z-10 w-full max-w-5xl flex flex-col items-center text-sm lg:flex-col text-center">
        <Link href="/" className="cursor-pointer no-underline">
          <h1 className="text-6xl font-bold">Auspidiam</h1>
        </Link>
        <div>
          <Link href="/about" className="font-bold hover:underline" style={{ color: 'var(--text-neon-red)' }}>about</Link>
          <span> | </span>
          <Link href="/audits" className="hover:underline">audits</Link>
          <span> | </span>
          <Link href="/analysis" className="hover:underline">analysis</Link>
        </div>
      </div>

      <div className="z-10 w-full max-w-2xl text-left mx-auto">
        <p>
          It's a portmanteau of "auspicious" and "diamond", which is the english translation of my name. Pronounced oss-pid-ee-um.
        </p>
        <p className="mt-4">
          A lot of the content here will be nonsensical, but that is okay.
        </p>
      </div>
    </main>
  );
}