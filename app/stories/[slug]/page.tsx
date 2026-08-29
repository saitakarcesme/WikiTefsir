import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/app/components/site-header';
import { SourceDrawer } from '@/app/components/source-drawer';
import { getAllPeople, getPersonBySlug } from '@/lib/people';
import { getPersonKind, getPersonName } from '@/lib/person-locale';
import { getSurahByNumber, getSurahHref, getTranslation, getTranslationMetadata, getVerse } from '@/lib/quran';
import { getLocale } from '@/lib/server-locale';
import { getQuranPdfSource } from '@/lib/sources';

export const dynamicParams = false;
export function generateStaticParams() { return getAllPeople().filter((person) => person.narrative.length > 1).map((person) => ({ slug: person.slug })); }
type StoryPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const person = getPersonBySlug((await params).slug);
  return person ? { title: `${person.name} — Story`, description: `A chronological source path through the Quranic account of ${person.name}.`, openGraph: { images: [] }, twitter: { images: [] } } : {};
}

export default async function StoryPage({ params }: StoryPageProps) {
  const locale = await getLocale();
  const tr = locale === 'tr';
  const person = getPersonBySlug((await params).slug);
  if (!person || person.narrative.length < 2) notFound();
  const translation = getTranslationMetadata(locale);
  return <main><SiteHeader /><article className="story-reader">
    <nav className="breadcrumbs"><Link href="/">{tr ? 'Ana sayfa' : 'Home'}</Link><span>›</span><Link href="/stories">{tr ? 'Kıssalar' : 'Stories'}</Link><span>›</span>{getPersonName(person, locale)}</nav>
    <header className="story-reader-header"><span className="reader-overline">{getPersonKind(person, locale)} · {person.narrative.length} {tr ? 'bölüm' : 'chapters'}</span><h1>{getPersonName(person, locale)}</h1><p lang="ar" dir="rtl">{person.arabic}</p><div>{tr ? `Aşağıdaki metinler QuranEnc Türkçe Rowwad ${translation.version} kaynağından aynen aktarılır; WikiTefsir bir dilden diğerine çeviri yapmaz.` : `The passages below are reproduced verbatim from QuranEnc English Rowwad ${translation.version}; WikiTefsir does not translate them between languages.`}</div></header>
    <div className="story-prose">
      {person.narrative.map((stage, index) => <section id={stage.id} key={stage.id}>
        <header><small>{String(index + 1).padStart(2, '0')}</small><h2>{tr ? `${index + 1}. bölüm` : stage.title}</h2></header>
        {stage.references.map((reference) => {
          const surah = getSurahByNumber(reference.surah);
          const verse = getVerse(reference.surah, reference.ayah);
          const meaning = getTranslation(reference.surah, reference.ayah, locale);
          if (!surah || !verse || !meaning) throw new Error(`Missing story source ${reference.surah}:${reference.ayah}`);
          const source = getQuranPdfSource(surah.startOffset + reference.ayah - 1);
          return <div className="story-paragraph" key={`${reference.surah}:${reference.ayah}`}><p lang="ar" dir="rtl">{verse.text}</p><p>{meaning.text}</p><footer><Link href={`${getSurahHref(surah)}#verse-${reference.ayah}`}>{surah.nameTransliterated} {reference.surah}:{reference.ayah}</Link><SourceDrawer label={tr ? 'Kaynak' : 'Source'} title={`${surah.nameTransliterated} ${reference.surah}:${reference.ayah}`} pdfUrl={source?.pdfUrl} page={source?.page} sourceUrl="https://quranenc.com" sourceLabel={`QuranEnc Rowwad ${translation.version}`} /></footer></div>;
        })}
      </section>)}
    </div>
  </article></main>;
}
