import type { Metadata } from 'next';
import { QuranSurahArticle } from '../../components/quran-surah-article';
import { getAdjacentSurahs, getSurahByNumber, getVersesForSurah } from '@/lib/quran';

export const metadata: Metadata = {
  title: 'Fâtiha Suresi',
  description: 'Fâtiha Suresi’nin doğrulanmış Uthmani Arapça metni ve kaynak bilgileri.',
  openGraph: { images: [] },
  twitter: { images: [] },
};

export default function FatihaPage() {
  const surah = getSurahByNumber(1);
  if (!surah) throw new Error('Fâtiha metadata is missing from the Quran corpus');

  const verses = getVersesForSurah(surah.number);
  const adjacent = getAdjacentSurahs(surah.number);

  return <QuranSurahArticle surah={surah} verses={verses} {...adjacent} />;
}
