import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './reader.css';
import { getLocale } from '@/lib/server-locale';
import { LocaleProvider } from '@/app/components/locale-provider';
import { SplashScreen } from '@/app/components/splash-screen';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://islamwiki.site'),
  title: {
    default: 'IslamWiki — Quran, Hadith and Tafsir Knowledge Network',
    template: '%s | IslamWiki',
  },
  description:
    'Explore Quran verses, authentic hadiths and Sunni tafsir works through a sourced, connected knowledge network.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'IslamWiki',
    title: 'IslamWiki — Quran, Hadith and Tafsir Knowledge Network',
    description: 'Explore Quran verses, authentic hadiths and classical tafsir works in a sourced knowledge network.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'IslamWiki — Quran, Hadith and Tafsir Knowledge Network' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IslamWiki — Quran, Hadith and Tafsir Knowledge Network',
    description: 'Explore Quran verses, authentic hadiths and classical tafsir works in a sourced knowledge network.',
    images: ['/og.png'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "(()=>{try{const saved=localStorage.getItem('islamwiki-theme');const theme=saved==='light'||saved==='dark'?saved:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=theme;const language=localStorage.getItem('islamwiki-language');if(language==='en'||language==='tr')document.documentElement.lang=language}catch{document.documentElement.dataset.theme='light'}})()",
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocaleProvider locale={locale}><SplashScreen />{children}</LocaleProvider>
      </body>
    </html>
  );
}
