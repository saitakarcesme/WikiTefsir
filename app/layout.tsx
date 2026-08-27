import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './wikipedia.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://wikitafsir.vercel.app'),
  title: {
    default: 'WikiTefsir — Quran, Hadith and Tafsir Knowledge Network',
    template: '%s | WikiTefsir',
  },
  description:
    'Explore Quran verses, authentic hadiths and Sunni tafsir works through a sourced, connected knowledge network.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'WikiTefsir',
    title: 'WikiTefsir — Quran, Hadith and Tafsir Knowledge Network',
    description: 'Explore Quran verses, authentic hadiths and classical tafsir works in a sourced knowledge network.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'WikiTefsir — Quran, Hadith and Tafsir Knowledge Network' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WikiTefsir — Quran, Hadith and Tafsir Knowledge Network',
    description: 'Explore Quran verses, authentic hadiths and classical tafsir works in a sourced knowledge network.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
