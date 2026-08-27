import type { Metadata } from 'next';
import { QuranSurahArticle } from '../../components/quran-surah-article';
import {
  getAdjacentSurahs,
  getSurahByNumber,
  getEnglishTranslationForSurah,
  getVersesForSurah,
} from '@/lib/quran';

export const metadata: Metadata = {
  title: 'Surah Al-Fatihah',
  description: 'The verified Uthmani Arabic text, sourced English translation and source details for Surah Al-Fatihah.',
  openGraph: { images: [] },
  twitter: { images: [] },
};

export default function FatihaPage() {
  const surah = getSurahByNumber(1);
  if (!surah) throw new Error('Al-Fatihah metadata is missing from the Quran corpus');

  const verses = getVersesForSurah(surah.number);
  const translation = getEnglishTranslationForSurah(surah.number);
  const adjacent = getAdjacentSurahs(surah.number);

  return <QuranSurahArticle surah={surah} verses={verses} translation={translation} {...adjacent} />;
}
