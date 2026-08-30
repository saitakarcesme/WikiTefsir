import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/app/components/site-header';
import { SourceDrawer } from '@/app/components/source-drawer';
import { getAllPeople, getPersonBySlug, type PersonRecord } from '@/lib/people';
import { getPersonKind, getPersonName } from '@/lib/person-locale';
import { getSurahByNumber, getSurahHref, getTranslation, getTranslationMetadata, getVerse } from '@/lib/quran';
import { getLocale } from '@/lib/server-locale';
import { getQuranPdfSource } from '@/lib/sources';

export const dynamicParams = false;
export function generateStaticParams() { return getAllPeople().filter((person) => person.narrative.length > 1).map((person) => ({ slug: person.slug })); }
type StoryPageProps = { params: Promise<{ slug: string }> };

function buildEnglishStory(person: PersonRecord) {
  const transitions = ['First,', 'As the story continues,', 'Later,', 'Then,', 'At the next decisive moment,', 'Afterward,', 'In the events that follow,', 'Finally,'];
  const sentences = person.narrative.map((stage, index) => {
    const summary = `${stage.summary.charAt(0).toLocaleLowerCase('en-US')}${stage.summary.slice(1)}`;
    return `${transitions[Math.min(index, transitions.length - 1)]} ${summary}`;
  });
  const paragraphs: string[] = [];
  for (let index = 0; index < sentences.length; index += 2) paragraphs.push(sentences.slice(index, index + 2).join(' '));
  return [person.introduction, ...paragraphs, person.closingNote];
}

function buildTurkishStory(person: PersonRecord, name: string) {
  const chapterCount = person.narrative.length;
  return [
    `${name} kıssası, Kur’an’ın farklı surelerde anlattığı ${chapterCount} safha bir araya getirilerek kronolojik bir okuma hâline getirilmiştir.`,
    `Anlatı, Kur’an’ın açıkça bildirdiği olayların dışına çıkmaz. Her geçişin altında ilgili Türkçe kaynak ayetleri bulunur; böylece hikâye kesintisiz okunurken dayandığı metin de doğrudan görülebilir.`,
    `Kur’an’ın ayrıntı vermediği hayat dönemleri tamamlanmış gibi gösterilmez; kıssa, vahyin bıraktığı yerde sona erer.`,
  ];
}

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
  const personName = getPersonName(person, locale);
  const storyParagraphs = tr ? buildTurkishStory(person, personName) : buildEnglishStory(person);
  return <main><SiteHeader /><article className="story-reader">
    <nav className="breadcrumbs"><Link href="/">{tr ? 'Ana sayfa' : 'Home'}</Link><span>›</span><Link href="/stories">{tr ? 'Kıssalar' : 'Stories'}</Link><span>›</span>{personName}</nav>
    <header className="story-reader-header"><span className="reader-overline">{getPersonKind(person, locale)} · {person.narrative.length} {tr ? 'bölüm' : 'chapters'}</span><h1>{personName}</h1><p lang="ar" dir="rtl">{person.arabic}</p><div>{tr ? `Kaynak ayetler QuranEnc Türkçe Rowwad ${translation.version} neşrinden değiştirilmeden gösterilir.` : `Source verses are preserved verbatim from QuranEnc English Rowwad ${translation.version}.`}</div></header>
    <section className="story-continuous" aria-labelledby="story-reading-title">
      <span className="reader-overline">{tr ? 'KESİNTİSİZ ANLATI' : 'CONTINUOUS NARRATIVE'}</span>
      <h2 id="story-reading-title">{tr ? 'Hikâyenin tamamı' : 'The story in one reading'}</h2>
      {storyParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    </section>
    <div className="story-source-heading"><span className="reader-overline">{tr ? 'KAYNAK METİNLER' : 'SOURCE TEXTS'}</span><h2>{tr ? 'Bölümlere göre ayetler' : 'Verses by chapter'}</h2></div>
    <div className="story-prose">
      {person.narrative.map((stage, index) => <section id={stage.id} key={stage.id}>
        <header><small>{String(index + 1).padStart(2, '0')}</small><h2>{tr ? `${index + 1}. bölüm` : stage.title}</h2></header>
        <p className="story-narrative">{tr ? `${stage.references.length} ayetlik kaynak dizisi.` : stage.summary}</p>
        <details className="story-sources">
          <summary>{tr ? `${stage.references.length} kaynak ayeti oku` : `Read ${stage.references.length} source ${stage.references.length === 1 ? 'verse' : 'verses'}`} <span aria-hidden="true">↓</span></summary>
          <div>{stage.references.map((reference) => {
          const surah = getSurahByNumber(reference.surah);
          const verse = getVerse(reference.surah, reference.ayah);
          const meaning = getTranslation(reference.surah, reference.ayah, locale);
          if (!surah || !verse || !meaning) throw new Error(`Missing story source ${reference.surah}:${reference.ayah}`);
          const source = getQuranPdfSource(surah.startOffset + reference.ayah - 1);
          return <div className="story-paragraph" key={`${reference.surah}:${reference.ayah}`}><p lang="ar" dir="rtl">{verse.text}</p><p>{meaning.text}</p><footer><Link href={`${getSurahHref(surah)}#verse-${reference.ayah}`}>{surah.nameTransliterated} {reference.surah}:{reference.ayah}</Link><SourceDrawer label={tr ? 'Kaynak' : 'Source'} title={`${surah.nameTransliterated} ${reference.surah}:${reference.ayah}`} pdfUrl={source?.pdfUrl} page={source?.page} sourceUrl="https://quranenc.com" sourceLabel={`QuranEnc Rowwad ${translation.version}`} /></footer></div>;
        })}</div></details>
      </section>)}
    </div>
  </article></main>;
}
