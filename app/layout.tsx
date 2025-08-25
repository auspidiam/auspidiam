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
        <footer className="z-10 w-full text-center text-xs">
          designed by ཀུན་བཟང་ | 2000 - present
        </footer>
      </body>
    </html>
  );
}