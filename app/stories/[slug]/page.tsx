import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/app/components/site-header';
import { SourceDrawer } from '@/app/components/source-drawer';
import { StoryArtwork } from '@/app/components/story-artwork';
import { getAllPeople, getPersonBySlug } from '@/lib/people';
import { getPersonKind, getPersonName } from '@/lib/person-locale';
import { getSurahByNumber, getSurahHref, getTranslation, getTranslationMetadata, getVerse } from '@/lib/quran';
import { getLocale } from '@/lib/server-locale';
import { getQuranPdfSource } from '@/lib/sources';
import { getStoryArtwork } from '@/lib/story-art';
import { getStoryHadiths } from '@/lib/story-hadith';
import storyProse from '@/lib/story-prose.json';

export const dynamicParams = false;
export function generateStaticParams() { return getAllPeople().filter((person) => person.narrative.length > 1).map((person) => ({ slug: person.slug })); }
type StoryPageProps = { params: Promise<{ slug: string }> };
type LocalizedStory = {
  intro: { tr: string; en: string };
  stages: Record<string, { tr: string[]; en: string[]; hadithSources: string[] }>;
  closing: { tr: string; en: string };
};

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
  const relatedHadiths = getStoryHadiths(person.slug, locale);
  const authoredStory = (storyProse as Record<string, LocalizedStory>)[person.slug];
  const readingMinutes = Math.max(4, Math.round(person.narrative.flatMap((stage) => stage.references).length * .42 + person.narrative.length * .45));
  return <main><SiteHeader /><article className="story-reader">
    <nav className="breadcrumbs"><Link href="/">{tr ? 'Ana sayfa' : 'Home'}</Link><span>›</span><Link href="/stories">{tr ? 'Kıssalar' : 'Stories'}</Link><span>›</span>{getPersonName(person, locale)}</nav>
    <header className="story-reader-header"><span className="reader-overline">{getPersonKind(person, locale)} · {readingMinutes}{tr ? ' dakikalık okuma' : '-minute read'}</span><h1>{getPersonName(person, locale)}</h1><p lang="ar" dir="rtl">{person.arabic}</p><div>{authoredStory?.intro[locale] ?? (tr ? `${getPersonName(person, locale)} hakkındaki anlatı, Kur’an’da açıkça bildirilen olay ve tasvirlerle sınırlıdır.` : person.introduction)}</div></header>
    <div className="story-prose">
      {person.narrative.map((stage, index) => {
        const passages = stage.references.map((reference) => {
          const surah = getSurahByNumber(reference.surah);
          const verse = getVerse(reference.surah, reference.ayah);
          const meaning = getTranslation(reference.surah, reference.ayah, locale);
          if (!surah || !verse || !meaning) throw new Error(`Missing story source ${reference.surah}:${reference.ayah}`);
          return { reference, surah, verse, meaning, source: getQuranPdfSource(surah.startOffset + reference.ayah - 1) };
        });
        const artwork = getStoryArtwork(person.slug, stage.id, stage.references, index);
        const artworkSurah = artwork ? getSurahByNumber(artwork.sourceReference.surah) : undefined;
        const artworkVerse = artwork ? getVerse(artwork.sourceReference.surah, artwork.sourceReference.ayah) : undefined;
        const artworkMeaning = artwork ? getTranslation(artwork.sourceReference.surah, artwork.sourceReference.ayah, locale) : undefined;
        const authoredStage = authoredStory?.stages[stage.id]?.[locale];
        const sourceNarrative = passages.map(({ meaning }) => meaning.text);
        const narrativeParagraphs = authoredStage?.length
          ? authoredStage
          : tr
            ? sourceNarrative
            : [stage.summary, ...sourceNarrative];
        return <section id={stage.id} key={stage.id}>
          <header><small>{String(index + 1).padStart(2, '0')}</small><h2>{tr ? `${getPersonName(person, locale)} · ${index + 1}. bölüm` : stage.title}</h2></header>
          <div className="story-narrative-copy">
            {narrativeParagraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
          </div>
          {artwork && artworkSurah && artworkVerse && artworkMeaning ? <StoryArtwork image={artwork.image} title={stage.title} source={`${artworkSurah.nameTransliterated} ${artwork.sourceReference.surah}:${artwork.sourceReference.ayah}`} arabic={artworkVerse.text} translation={artworkMeaning.text} locale={locale} priority={index === 0} /> : null}
          <div className="story-source-passages">
            {passages.map(({ reference, surah, verse, meaning, source }) => <div className="story-paragraph" key={`${reference.surah}:${reference.ayah}`}><p lang="ar" dir="rtl">{verse.text}</p><p>{meaning.text}</p><footer><Link href={`${getSurahHref(surah)}#verse-${reference.ayah}`}>{surah.nameTransliterated} {reference.surah}:{reference.ayah}</Link><SourceDrawer label={tr ? 'Kaynak' : 'Source'} title={`${surah.nameTransliterated} ${reference.surah}:${reference.ayah}`} pdfUrl={source?.pdfUrl} page={source?.page} sourceUrl={tr ? 'https://quranenc.com/tr/browse/turkish_rwwad' : 'https://quranenc.com/en/browse/english_rwwad'} sourceLabel={`QuranEnc Rowwad ${translation.version}`} /></footer></div>)}
          </div>
        </section>;
      })}
    </div>
    {relatedHadiths.length ? <section className="story-hadith-layer" aria-labelledby="story-hadith-title">
      <span className="reader-overline">{tr ? 'Sahih hadis katmanı' : 'Authentic hadith layer'}</span>
      <h2 id="story-hadith-title">{tr ? 'Kıssayla ilgili sahih rivayetler' : 'Authentic reports related to the story'}</h2>
      <p>{tr ? 'Bu rivayetler Kur’an’daki kronolojiye eklenmez; HadeethEnc’in bağımsız Türkçe kaydından, kıssayla ilgili tamamlayıcı bir kaynak katmanı olarak gösterilir.' : 'These reports are not inserted into the Quranic chronology. They are shown as a supplemental source layer from HadeethEnc’s independent English record.'}</p>
      {relatedHadiths.map(({ record, image }) => <div className="story-hadith-record" key={record.id}>
        <StoryArtwork image={image} title={record.title} source={`HadeethEnc #${record.id}`} arabic={record.hadeeth_ar} translation={record.hadeeth} locale={locale} />
        <p>{record.explanation}</p>
        <Link href={`/hadith/${record.id}`}>{tr ? 'Hadis kaydını aç →' : 'Open the hadith record →'}</Link>
      </div>)}
    </section> : null}
    <p className="story-closing">{tr ? 'Bu anlatı Kur’an ayetleri ve ayrıca belirtilen sahih hadis kayıtlarıyla sınırlı tutulmuştur.' : 'This narrative is limited to the cited Quran verses and separately identified authentic hadith records.'}</p>
    <section className="story-lesson" aria-labelledby="story-lesson-title">
      <span className="reader-overline">{tr ? 'Kıssadan hisse' : 'Lesson from the story'}</span>
      <h2 id="story-lesson-title">{tr ? 'Hatırda kalan' : 'What remains'}</h2>
      <p>{authoredStory?.closing[locale] ?? (tr ? 'Kur’an’ın açıkça bildirmediği biyografik ayrıntılar bu anlatıya eklenmemiştir.' : person.closingNote)}</p>
    </section>
  </article></main>;
}
