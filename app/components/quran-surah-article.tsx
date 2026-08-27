import Link from 'next/link';
import type { TranslationRecord, SurahRecord, VerseRecord } from '@/lib/quran';
import {
  getSurahHref,
  quranLicense,
  englishTranslationMetadata,
  englishTranslationTerms,
} from '@/lib/quran';
import { SiteHeader } from './site-header';
import { VerseTafsirs } from './verse-tafsirs';
import { getConceptHref, getConceptsForVerse } from '@/lib/concepts';

interface QuranSurahArticleProps {
  surah: SurahRecord;
  verses: VerseRecord[];
  translation: TranslationRecord[];
  previous?: SurahRecord;
  next?: SurahRecord;
}

export function QuranSurahArticle({ surah, verses, translation, previous, next }: QuranSurahArticleProps) {
  const revelationLabel = surah.revelationType;

  return (
    <main>
      <SiteHeader />
      <div className="wiki-layout quran-article-layout">
        <aside className="wiki-toc" aria-label="Page contents">
          <span>Contents</span>
          <a className="active" href="#overview">Overview</a>
          <a href="#verses">Verses</a>
          <a href="#verses">Classical tafsirs</a>
          <a href="#translation">Translation</a>
          <a href="#source">Text sources</a>
        </aside>

        <article className="wiki-article">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Main page</Link><span>›</span><Link href="/surahs">Surahs</Link><span>›</span>{surah.nameTransliterated}
          </nav>

          <header className="article-header" id="overview">
            <span className="section-kicker">Surah {surah.number}</span>
            <h1>{surah.nameTransliterated}</h1>
            <p className="article-arabic-title" lang="ar" dir="rtl" translate="no">{surah.nameArabic}</p>
            <p className="article-lead">The {surah.number}th surah of the Quran. The Arabic text is shown verbatim from Tanzil Uthmani 1.1 and the English translation from QuranEnc Rowwad {englishTranslationMetadata.version}.</p>
            <div className="article-facts">
              <span>{revelationLabel}</span>
              <span>{surah.ayahCount} verses</span>
              <span>{surah.rukuCount} rukus</span>
              <span>Revelation order: {surah.revelationOrder}</span>
            </div>
          </header>

          <section className="notice-card verified-source-notice" id="translation">
            <strong>English translation source verified</strong>
            <p>{englishTranslationMetadata.title}, version {englishTranslationMetadata.version}. Translation and footnotes are published verbatim from QuranEnc.</p>
            <a href={englishTranslationTerms.url} rel="noreferrer" target="_blank">Open reuse terms ↗</a>
          </section>

          <section className="verse-list" id="verses" aria-labelledby="verses-title">
            <div className="section-title">
              <div><span className="section-kicker">Verified Uthmani text</span><h2 id="verses-title">Verses</h2></div>
              <span className="verified-badge">✓ {verses.length} verses verified</span>
            </div>

            {verses.map((verse, index) => {
              const meaning = translation[index];
              const concepts = getConceptsForVerse(verse.surah, verse.ayah);
              if (!meaning || meaning.surah !== verse.surah || meaning.ayah !== verse.ayah) {
                throw new Error(`English translation record mismatch at ${verse.surah}:${verse.ayah}`);
              }

              return <article className="verse-row corpus-verse" id={`verse-${verse.ayah}`} key={verse.ayah}>
                <a className="round-number" href={`#verse-${verse.ayah}`} aria-label={`Surah ${surah.number}, verse ${verse.ayah}`}>{verse.ayah}</a>
                <div>
                  <p className="verse-arabic" lang="ar" dir="rtl" translate="no">{verse.text}</p>
                  <div className="verse-meaning">
                    <span>English translation</span>
                    <p>{meaning.text}</p>
                  </div>
                  {meaning.footnotes && <aside className="meal-footnote"><strong>Translation footnote</strong><p>{meaning.footnotes}</p></aside>}
                  {concepts.length > 0 ? (
                    <div className="verse-concepts" aria-label={`Concepts related to ${surah.nameTransliterated} ${verse.ayah}`}>
                      <span>Related concepts:</span>
                      {concepts.map((concept) => <Link href={getConceptHref(concept)} key={concept.slug}>{concept.title}</Link>)}
                    </div>
                  ) : null}
                  <VerseTafsirs surah={verse.surah} ayah={verse.ayah} />
                  <div className="corpus-verse-meta">
                    <span>{surah.number}:{verse.ayah}</span>
                    <span>Tanzil Uthmani 1.1</span>
                    <span>QuranEnc Rowwad {englishTranslationMetadata.version}</span>
                    <span>3 classical Arabic tafsirs</span>
                    <span>Hadith links await editorial review</span>
                  </div>
                </div>
              </article>;
            })}
          </section>

          <nav className="surah-pagination" aria-label="Navigate between surahs">
            {previous ? <Link href={getSurahHref(previous)}><small>← Previous surah</small><strong>{previous.nameTransliterated}</strong></Link> : <span />}
            {next ? <Link href={getSurahHref(next)}><small>Next surah →</small><strong>{next.nameTransliterated}</strong></Link> : <span />}
          </nav>
        </article>

        <aside className="wiki-infobox" aria-label={`${surah.nameTransliterated} infobox`}>
          <div className="infobox-symbol">{surah.number}</div>
          <h2>{surah.nameTransliterated}</h2>
          <p lang="ar" dir="rtl" translate="no">{surah.nameArabic}</p>
          <dl>
            <div><dt>Surah no.</dt><dd>{surah.number}</dd></div>
            <div><dt>Verses</dt><dd>{surah.ayahCount}</dd></div>
            <div><dt>Revelation</dt><dd>{revelationLabel}</dd></div>
            <div><dt>Rukus</dt><dd>{surah.rukuCount}</dd></div>
          </dl>
          <div className="infobox-source" id="source">
            <strong>Quran text · Tanzil Project</strong>
            <p>{quranLicense.name}</p>
            <a href="https://tanzil.net" rel="noreferrer" target="_blank">Open source ↗</a>
            <strong className="secondary-source">English translation · QuranEnc</strong>
            <p>Rowwad Translation Center · {englishTranslationMetadata.version}</p>
            <a href="https://quranenc.com/en" rel="noreferrer" target="_blank">Open translation source ↗</a>
          </div>
        </aside>
      </div>
    </main>
  );
}
