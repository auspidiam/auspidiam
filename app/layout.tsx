// file: app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { K2D } from 'next/font/google';

const k2d = K2D({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Auspidiam',
  description: 'ennui renaissance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={k2d.className}>
      <body>
        {children}
        <footer className="z-10 w-full text-xs px-12 flex justify-between">
          <span>designed by ཀུན་བཟང་རྡོ་རྗེ་</span>
          <span>2000 - present</span>
        </footer>
      </body>
    </html>
  );
}
