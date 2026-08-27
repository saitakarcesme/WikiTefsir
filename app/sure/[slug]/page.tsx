import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { QuranSurahArticle } from '../../components/quran-surah-article';
import {
  getAdjacentSurahs,
  getAllSurahs,
  getSurahBySlug,
  getSurahSlug,
  getTurkishMealForSurah,
  getVersesForSurah,
} from '@/lib/quran';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSurahs()
    .filter((surah) => surah.number !== 1)
    .map((surah) => ({ slug: getSurahSlug(surah) }));
}

type SurahPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: SurahPageProps): Promise<Metadata> {
  const { slug } = await params;
  const surah = getSurahBySlug(slug);
  if (!surah) return {};

  return {
    title: `${surah.nameTransliterated} Suresi`,
    description: `${surah.nameTransliterated} Suresi’nin ${surah.ayahCount} ayetlik doğrulanmış Uthmani Arapça metni, kaynaklı Türkçe meali ve kaynak bilgileri.`,
    openGraph: { images: [] },
    twitter: { images: [] },
  };
}

export default async function SurahPage({ params }: SurahPageProps) {
  const { slug } = await params;
  const surah = getSurahBySlug(slug);
  if (!surah) notFound();

  const verses = getVersesForSurah(surah.number);
  const meal = getTurkishMealForSurah(surah.number);
  const adjacent = getAdjacentSurahs(surah.number);

  return <QuranSurahArticle surah={surah} verses={verses} meal={meal} {...adjacent} />;
}
