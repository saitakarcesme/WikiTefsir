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
    default: 'WikiTefsir — Kur’an, Hadis ve Tefsir Bilgi Ağı',
    template: '%s | WikiTefsir',
  },
  description:
    'Kur’an ayetlerini sahih hadisler ve Ehl-i Sünnet tefsirleriyle kaynaklı, bağlantılı ve anlaşılır biçimde keşfedin.',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'WikiTefsir',
    title: 'WikiTefsir — Kur’an, Hadis ve Tefsir Bilgi Ağı',
    description: 'Kur’an ayetlerini sahih hadisler ve klasik tefsirlerle kaynaklı bir bilgi ağında keşfedin.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'WikiTefsir — Kur’an, Hadis ve Tefsir Bilgi Ağı' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WikiTefsir — Kur’an, Hadis ve Tefsir Bilgi Ağı',
    description: 'Kur’an ayetlerini sahih hadisler ve klasik tefsirlerle kaynaklı bir bilgi ağında keşfedin.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
