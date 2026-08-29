import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { QuranSurahArticle } from '../../components/quran-surah-article';
import {
  getAdjacentSurahs,
  getAllSurahs,
  getSurahBySlug,
  getSurahSlug,
  getTranslationForSurah,
  getVersesForSurah,
} from '@/lib/quran';
import { getLocale } from '@/lib/server-locale';

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
    title: `Surah ${surah.nameTransliterated}`,
    description: `The verified Uthmani Arabic text, sourced English translation and source details for the ${surah.ayahCount} verses of Surah ${surah.nameTransliterated}.`,
    openGraph: { images: [] },
    twitter: { images: [] },
  };
}

export default async function SurahPage({ params }: SurahPageProps) {
  const locale = await getLocale();
  const { slug } = await params;
  const surah = getSurahBySlug(slug);
  if (!surah) notFound();

  const verses = getVersesForSurah(surah.number);
  const translation = getTranslationForSurah(surah.number, locale);
  const adjacent = getAdjacentSurahs(surah.number);

  return <QuranSurahArticle surah={surah} verses={verses} translation={translation} locale={locale} {...adjacent} />;
}
