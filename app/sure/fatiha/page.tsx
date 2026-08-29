import type { Metadata } from 'next';
import { QuranSurahArticle } from '../../components/quran-surah-article';
import {
  getAdjacentSurahs,
  getSurahByNumber,
  getTranslationForSurah,
  getVersesForSurah,
} from '@/lib/quran';
import { getLocale } from '@/lib/server-locale';

export const metadata: Metadata = {
  title: 'Surah Al-Fatihah',
  description: 'The verified Uthmani Arabic text, sourced English translation and source details for Surah Al-Fatihah.',
  openGraph: { images: [] },
  twitter: { images: [] },
};

export default async function FatihaPage() {
  const locale = await getLocale();
  const surah = getSurahByNumber(1);
  if (!surah) throw new Error('Al-Fatihah metadata is missing from the Quran corpus');

  const verses = getVersesForSurah(surah.number);
  const translation = getTranslationForSurah(surah.number, locale);
  const adjacent = getAdjacentSurahs(surah.number);

  return <QuranSurahArticle surah={surah} verses={verses} translation={translation} locale={locale} {...adjacent} />;
}
