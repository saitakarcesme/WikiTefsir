import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'WikiTefsir — Kur’an, Hadis ve Tefsir Bilgi Ağı',
    template: '%s | WikiTefsir',
  },
  description:
    'Kur’an ayetlerini sahih hadisler ve Ehl-i Sünnet tefsirleriyle kaynaklı, bağlantılı ve anlaşılır biçimde keşfedin.',
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
