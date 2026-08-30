import Link from 'next/link';
import type { TranslationRecord, SurahRecord, VerseRecord } from '@/lib/quran';
import {
  getSurahHref,
  quranLicense,
  englishTranslationMetadata,
  getTranslationMetadata,
} from '@/lib/quran';
import { SiteHeader } from './site-header';
import { VerseTafsirs } from './verse-tafsirs';
import { getConceptHref, getConceptsForVerse, getConceptTitle, getKeywordsForVerse } from '@/lib/concepts';
import { getQuranPdfSource } from '@/lib/sources';
import { SourceDrawer } from './source-drawer';
import type { Locale } from '@/lib/locale';

interface QuranSurahArticleProps {
  surah: SurahRecord;
  verses: VerseRecord[];
  translation: TranslationRecord[];
  previous?: SurahRecord;
  next?: SurahRecord;
  locale: Locale;
}

export function QuranSurahArticle({ surah, verses, translation, previous, next, locale }: QuranSurahArticleProps) {
  const revelationLabel = surah.revelationType;
  const translationMetadata = getTranslationMetadata(locale);
  const tr = locale === 'tr';

  return (
    <main>
      <SiteHeader />
      <div className="wiki-layout quran-article-layout">
        <aside className="wiki-toc" aria-label="Page contents">
          <span>{tr ? 'İçindekiler' : 'Contents'}</span>
          <a className="active" href="#overview">{tr ? 'Genel bakış' : 'Overview'}</a>
          <a href="#verses">{tr ? 'Ayetler' : 'Verses'}</a>
          <a href="#verses">{tr ? 'Meal ve tefsir' : 'Translation and tafsir'}</a>
          <a href="#source">{tr ? 'Metin kaynakları' : 'Text sources'}</a>
        </aside>

        <article className="wiki-article">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">{tr ? 'Ana sayfa' : 'Main page'}</Link><span>›</span><Link href="/surahs">{tr ? 'Sureler' : 'Surahs'}</Link><span>›</span>{surah.nameTransliterated}
          </nav>

          <header className="article-header" id="overview">
            <span className="section-kicker">{tr ? `${surah.number}. sure` : `Surah ${surah.number}`}</span>
            <h1>{surah.nameTransliterated}</h1>
            <p className="article-arabic-title" lang="ar" dir="rtl" translate="no">{surah.nameArabic}</p>
            <p className="article-lead">{tr ? `Kur’an’ın ${surah.number}. suresi. Arapça metin Tanzil Uthmani 1.1’den, Türkçe meal QuranEnc Rowwad ${translationMetadata.version} kaynağından aynen gösterilir.` : `The ${surah.number}th surah of the Quran. The Arabic text is shown verbatim from Tanzil Uthmani 1.1 and the English translation from QuranEnc Rowwad ${englishTranslationMetadata.version}.`}</p>
            <div className="article-facts">
              <span>{tr ? (revelationLabel === 'Meccan' ? 'Mekki' : 'Medeni') : revelationLabel}</span>
              <span>{surah.ayahCount} {tr ? 'ayet' : 'verses'}</span>
              <span>{surah.rukuCount} {tr ? 'rükû' : 'rukus'}</span>
              <span>{tr ? `Nüzul sırası: ${surah.revelationOrder}` : `Revelation order: ${surah.revelationOrder}`}</span>
            </div>
          </header>

          <section className="verse-list" id="verses" aria-labelledby="verses-title">
            <div className="section-title">
              <div><span className="section-kicker">{tr ? 'Arapça · Türkçe meal · İngilizce ve Arapça tefsir' : 'Arabic · English translation · English and Arabic tafsir'}</span><h2 id="verses-title">{tr ? 'Ayetler' : (verses.length === 1 ? 'Verse' : 'Verses')}</h2></div>
              <span className="verse-count-label">{verses.length} {tr ? 'ayet' : (verses.length === 1 ? 'verse' : 'verses')}</span>
            </div>

            {verses.map((verse, index) => {
              const meaning = translation[index];
              const concepts = getConceptsForVerse(verse.surah, verse.ayah);
              const keywords = getKeywordsForVerse(verse.surah, verse.ayah, locale, 6);
              const pdfSource = getQuranPdfSource(surah.startOffset + index);
              if (!meaning || meaning.surah !== verse.surah || meaning.ayah !== verse.ayah) {
                throw new Error(`${locale} translation record mismatch at ${verse.surah}:${verse.ayah}`);
              }

              return <article className="verse-row corpus-verse" id={`verse-${verse.ayah}`} key={verse.ayah}>
                <a className="round-number" href={`#verse-${verse.ayah}`} aria-label={`Surah ${surah.number}, verse ${verse.ayah}`}>{verse.ayah}</a>
                <div>
                  <p className="verse-arabic" lang="ar" dir="rtl" translate="no">{verse.text}</p>
                  <div className="verse-meaning">
                    <span>{tr ? 'Türkçe meal' : 'English translation'}</span>
                    <p>{meaning.text}</p>
                  </div>
                  {meaning.footnotes && <aside className="meal-footnote"><strong>{tr ? 'Meal dipnotu' : 'Translation footnote'}</strong><p>{meaning.footnotes}</p></aside>}
                  <details className="verse-resources">
                    <summary>{tr ? 'Bağlantılar, tefsir ve kaynak' : 'Connections, tafsir and source'}</summary>
                    <div>
                      {concepts.length > 0 ? <div className="verse-concepts" aria-label={`Concepts related to ${surah.nameTransliterated} ${verse.ayah}`}>
                        <span>{tr ? 'Kavramlar' : 'Concepts'}</span>
                        {concepts.map((concept) => <Link href={getConceptHref(concept)} key={concept.slug}>{getConceptTitle(concept, locale)}</Link>)}
                        {keywords.map((concept) => <Link className="keyword-tag" href={getConceptHref(concept)} key={concept.slug}>{concept.title}</Link>)}
                      </div> : null}
                      <VerseTafsirs surah={verse.surah} ayah={verse.ayah} locale={locale} />
                      <div className="corpus-verse-actions">
                        <SourceDrawer title={`${surah.nameTransliterated} ${verse.surah}:${verse.ayah}`} description={tr ? `Rowwad Türkçe meal ${translationMetadata.version}; QuranEnc’in resmi kaydıyla bağlantılıdır.` : `Rowwad English translation ${translationMetadata.version}, aligned to the exact page in QuranEnc's official mushaf PDF.`} pdfUrl={pdfSource?.pdfUrl} page={pdfSource?.page} sourceUrl={tr ? 'https://quranenc.com/tr/browse/turkish_rwwad' : 'https://quranenc.com/en/browse/english_rwwad'} sourceLabel="QuranEnc" />
                        <a href={`#verse-${verse.ayah}`}>{surah.number}:{verse.ayah}</a>
                        <span>QuranEnc Rowwad {translationMetadata.version}</span>
                      </div>
                    </div>
                  </details>
                </div>
              </article>;
            })}
          </section>

          <nav className="surah-pagination" aria-label="Navigate between surahs">
            {previous ? <Link href={getSurahHref(previous)}><small>← {tr ? 'Önceki sure' : 'Previous surah'}</small><strong>{previous.nameTransliterated}</strong></Link> : <span />}
            {next ? <Link href={getSurahHref(next)}><small>{tr ? 'Sonraki sure' : 'Next surah'} →</small><strong>{next.nameTransliterated}</strong></Link> : <span />}
          </nav>
        </article>

        <aside className="wiki-infobox" aria-label={`${surah.nameTransliterated} infobox`}>
          <div className="infobox-symbol">{surah.number}</div>
          <h2>{surah.nameTransliterated}</h2>
          <p lang="ar" dir="rtl" translate="no">{surah.nameArabic}</p>
          <dl>
            <div><dt>{tr ? 'Sure no.' : 'Surah no.'}</dt><dd>{surah.number}</dd></div>
            <div><dt>{tr ? 'Ayetler' : 'Verses'}</dt><dd>{surah.ayahCount}</dd></div>
            <div><dt>{tr ? 'Nüzul yeri' : 'Revelation'}</dt><dd>{tr ? (revelationLabel === 'Meccan' ? 'Mekki' : 'Medeni') : revelationLabel}</dd></div>
            <div><dt>{tr ? 'Rükûlar' : 'Rukus'}</dt><dd>{surah.rukuCount}</dd></div>
          </dl>
          <div className="infobox-source" id="source">
            <strong>{tr ? 'Kur’an metni · Tanzil Project' : 'Quran text · Tanzil Project'}</strong>
            <p>{quranLicense.name}</p>
            <a href="https://tanzil.net" rel="noreferrer" target="_blank">{tr ? 'Kaynağı aç ↗' : 'Open source ↗'}</a>
            <strong className="secondary-source">{tr ? 'Türkçe meal · QuranEnc' : 'English translation · QuranEnc'}</strong>
            <p>Rowwad Translation Center · {translationMetadata.version}</p>
            <a href="https://quranenc.com" rel="noreferrer" target="_blank">{tr ? 'Meal kaynağını aç ↗' : 'Open translation source ↗'}</a>
          </div>
        </aside>
      </div>
    </main>
  );
}
