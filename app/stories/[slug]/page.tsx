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
  const relatedHadiths = getStoryHadiths(person.slug, locale);
  const readingMinutes = Math.max(4, Math.round(person.narrative.flatMap((stage) => stage.references).length * .42 + person.narrative.length * .45));
  return <main><SiteHeader /><article className="story-reader">
    <nav className="breadcrumbs"><Link href="/">{tr ? 'Ana sayfa' : 'Home'}</Link><span>›</span><Link href="/stories">{tr ? 'Kıssalar' : 'Stories'}</Link><span>›</span>{getPersonName(person, locale)}</nav>
    <header className="story-reader-header"><span className="reader-overline">{getPersonKind(person, locale)} · {readingMinutes} {tr ? 'dakikalık okuma' : 'minute read'}</span><h1>{getPersonName(person, locale)}</h1><p lang="ar" dir="rtl">{person.arabic}</p><div>{tr ? `${getPersonName(person, locale)} kıssası, farklı surelerdeki pasajlar anlatı sırasına getirilerek kesintisiz bir okuma hâline getirildi. Ayetler QuranEnc Türkçe Rowwad ${translation.version} kaynağından aynen aktarılır.` : `${getPersonName(person, locale)}’s account is presented as one continuous narrative assembled from passages across the surahs. Verses are reproduced verbatim from QuranEnc English Rowwad ${translation.version}.`}</div></header>
    <p className="story-opening">{tr ? `${getPersonName(person, locale)} hakkında Kur’an’ın anlattıkları tek bir surede başlayıp bitmez. Aşağıdaki anlatı, olayları sure sırasına göre değil kıssanın kendi akışına göre bir araya getirir; anlatının her dönüm noktası hemen altındaki ayetlerle görülebilir.` : `${person.introduction} The Quran does not always tell this account in one uninterrupted passage. The reading below follows the events themselves rather than surah order, while keeping every turning point beside the verses on which it rests.`}</p>
    <div className="story-prose">
      {person.narrative.map((stage, index) => {
        const passages = stage.references.map((reference) => {
          const surah = getSurahByNumber(reference.surah);
          const verse = getVerse(reference.surah, reference.ayah);
          const meaning = getTranslation(reference.surah, reference.ayah, locale);
          if (!surah || !verse || !meaning) throw new Error(`Missing story source ${reference.surah}:${reference.ayah}`);
          return { reference, surah, verse, meaning, source: getQuranPdfSource(surah.startOffset + reference.ayah - 1) };
        });
        const first = passages[0]; const last = passages.at(-1);
        const artwork = getStoryArtwork(person.slug, stage.id, stage.references, index);
        const artworkSurah = artwork ? getSurahByNumber(artwork.sourceReference.surah) : undefined;
        const artworkVerse = artwork ? getVerse(artwork.sourceReference.surah, artwork.sourceReference.ayah) : undefined;
        const artworkMeaning = artwork ? getTranslation(artwork.sourceReference.surah, artwork.sourceReference.ayah, locale) : undefined;
        return <section id={stage.id} key={stage.id}>
          <header><small>{String(index + 1).padStart(2, '0')}</small><h2>{tr ? `${getPersonName(person, locale)} · ${index + 1}. bölüm` : stage.title}</h2></header>
          <div className="story-narrative-copy">
            <p>{tr ? `Kıssanın bu bölümünde anlatı ${first.surah.nameTransliterated} suresindeki ${first.reference.surah}:${first.reference.ayah} ayetiyle açılır. Burada olay yalnızca bir bilgi olarak verilmez; ${getPersonName(person, locale)}’in önündeki yeni safhayı hazırlayan bir dönüm noktası kurulur.` : stage.summary}</p>
            <p>{tr ? `Pasajlar birlikte okunduğunda sahne adım adım ilerler. İlk ayetin kurduğu durum, aynı bölümde seçilen diğer ayetlerle tamamlanır; böylece farklı surelerdeki ifadeler tek bir olayın parçaları olarak okunabilir.` : `Read together, these passages turn that statement into a scene: the opening verse establishes the moment, and the following references carry it toward its consequence. The order here is narrative, not the order of revelation.`}</p>
            {last && last.reference !== first.reference ? <p>{tr ? `Bölüm ${last.surah.nameTransliterated} ${last.reference.surah}:${last.reference.ayah} ile kapanırken kıssa bir sonraki aşamaya geçer. Aşağıdaki ayet kartları anlatının dayandığı Arapça metni ve Türkçe kaynak mealini eksiksiz gösterir.` : `By ${last.surah.nameTransliterated} ${last.reference.surah}:${last.reference.ayah}, the episode has reached its next turning point. The source passages below preserve the Arabic text and the independent English source translation in full.`}</p> : null}
          </div>
          {artwork && artworkSurah && artworkVerse && artworkMeaning ? <StoryArtwork image={artwork.image} title={stage.title} source={`${artworkSurah.nameTransliterated} ${artwork.sourceReference.surah}:${artwork.sourceReference.ayah}`} arabic={artworkVerse.text} translation={artworkMeaning.text} locale={locale} /> : null}
          <div className="story-source-passages">
            {passages.map(({ reference, surah, verse, meaning, source }) => <div className="story-paragraph" key={`${reference.surah}:${reference.ayah}`}><p lang="ar" dir="rtl">{verse.text}</p><p>{meaning.text}</p><footer><Link href={`${getSurahHref(surah)}#verse-${reference.ayah}`}>{surah.nameTransliterated} {reference.surah}:{reference.ayah}</Link><SourceDrawer label={tr ? 'Kaynak' : 'Source'} title={`${surah.nameTransliterated} ${reference.surah}:${reference.ayah}`} pdfUrl={source?.pdfUrl} page={source?.page} sourceUrl={tr ? 'https://quranenc.com/tr/browse/turkish_rwwad' : 'https://quranenc.com/en/browse/english_rwwad'} sourceLabel={`QuranEnc Rowwad ${translation.version}`} /></footer></div>)}
          </div>
        </section>;
      })}
    </div>
    {relatedHadiths.length ? <section className="story-hadith-layer" aria-labelledby="story-hadith-title">
      <span className="reader-overline">{tr ? 'Sahih hadis katmanı' : 'Authenticated hadith layer'}</span>
      <h2 id="story-hadith-title">{tr ? 'Kıssayla ilgili sahih rivayetler' : 'Authenticated reports related to the story'}</h2>
      <p>{tr ? 'Bu rivayetler Kur’an’daki kronolojiye eklenmez; HadeethEnc’in bağımsız Türkçe kaydından, kıssayla ilgili tamamlayıcı bir kaynak katmanı olarak gösterilir.' : 'These reports are not inserted into the Quranic chronology. They are shown as a supplemental source layer from HadeethEnc’s independent English record.'}</p>
      {relatedHadiths.map(({ record, image }) => <div className="story-hadith-record" key={record.id}>
        <StoryArtwork image={image} title={record.title} source={`HadeethEnc #${record.id}`} arabic={record.hadeeth_ar} translation={record.hadeeth} locale={locale} />
        <p>{record.explanation}</p>
        <Link href={`/hadith/${record.id}`}>{tr ? 'Hadis kaydını aç →' : 'Open the hadith record →'}</Link>
      </div>)}
    </section> : null}
    <footer className="story-closing">{tr ? 'Anlatı, Kur’an’ın açıkça bildirdiği olay ve tasvirlerin sınırında tutulmuştur; kaynakta bulunmayan biyografik ayrıntılar eklenmemiştir.' : person.closingNote}</footer>
  </article></main>;
}
