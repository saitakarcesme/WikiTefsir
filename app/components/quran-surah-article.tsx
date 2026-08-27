import Link from 'next/link';
import type { MealRecord, SurahRecord, VerseRecord } from '@/lib/quran';
import {
  getSurahHref,
  quranLicense,
  turkishMealMetadata,
  turkishMealTerms,
} from '@/lib/quran';
import { SiteHeader } from './site-header';
import { VerseTafsirs } from './verse-tafsirs';

interface QuranSurahArticleProps {
  surah: SurahRecord;
  verses: VerseRecord[];
  meal: MealRecord[];
  previous?: SurahRecord;
  next?: SurahRecord;
}

export function QuranSurahArticle({ surah, verses, meal, previous, next }: QuranSurahArticleProps) {
  const revelationLabel = surah.revelationType === 'Meccan' ? 'Mekkî' : 'Medenî';

  return (
    <main>
      <SiteHeader />
      <div className="wiki-layout quran-article-layout">
        <aside className="wiki-toc" aria-label="Sayfa içeriği">
          <span>Bu sayfada</span>
          <a className="active" href="#genel">Genel bakış</a>
          <a href="#ayetler">Ayetler</a>
          <a href="#ayetler">Klasik tefsirler</a>
          <a href="#meal">Meal durumu</a>
          <a href="#kaynak">Metin kaynağı</a>
        </aside>

        <article className="wiki-article">
          <nav className="breadcrumbs" aria-label="İçerik yolu">
            <Link href="/">Ana sayfa</Link><span>›</span><Link href="/sureler">Sureler</Link><span>›</span>{surah.nameTransliterated}
          </nav>

          <header className="article-header" id="genel">
            <span className="section-kicker">{surah.number}. Sure</span>
            <h1>{surah.nameTransliterated}</h1>
            <p className="article-arabic-title" lang="ar" dir="rtl" translate="no">{surah.nameArabic}</p>
            <p className="article-lead">Kur’an-ı Kerîm’in {surah.number}. suresi. Arapça metin Tanzil Uthmani 1.1, Türkçe meal QuranEnc Rowwad {turkishMealMetadata.version} kaynağından değiştirilmeden gösterilir.</p>
            <div className="article-facts">
              <span>{revelationLabel}</span>
              <span>{surah.ayahCount} ayet</span>
              <span>{surah.rukuCount} rükû</span>
              <span>Nüzul sırası: {surah.revelationOrder}</span>
            </div>
          </header>

          <section className="notice-card verified-source-notice" id="meal">
            <strong>Türkçe meal kaynağı doğrulandı</strong>
            <p>{turkishMealMetadata.title}, sürüm {turkishMealMetadata.version}. Meal ve dipnotlar QuranEnc kaynağındaki içerik değiştirilmeden yayımlanır.</p>
            <a href={turkishMealTerms.url} rel="noreferrer" target="_blank">Yeniden yayımlama şartlarını aç ↗</a>
          </section>

          <section className="verse-list" id="ayetler" aria-labelledby="verses-title">
            <div className="section-title">
              <div><span className="section-kicker">Doğrulanmış Uthmani metin</span><h2 id="verses-title">Ayetler</h2></div>
              <span className="verified-badge">✓ {verses.length} ayet doğrulandı</span>
            </div>

            {verses.map((verse, index) => {
              const meaning = meal[index];
              if (!meaning || meaning.surah !== verse.surah || meaning.ayah !== verse.ayah) {
                throw new Error(`Turkish meal record mismatch at ${verse.surah}:${verse.ayah}`);
              }

              return <article className="verse-row corpus-verse" id={`ayet-${verse.ayah}`} key={verse.ayah}>
                <a className="round-number" href={`#ayet-${verse.ayah}`} aria-label={`${surah.number}. sure ${verse.ayah}. ayet`}>{verse.ayah}</a>
                <div>
                  <p className="verse-arabic" lang="ar" dir="rtl" translate="no">{verse.text}</p>
                  <div className="verse-meaning">
                    <span>Türkçe meal</span>
                    <p>{meaning.text}</p>
                  </div>
                  {meaning.footnotes && <aside className="meal-footnote"><strong>Meal dipnotu</strong><p>{meaning.footnotes}</p></aside>}
                  <VerseTafsirs surah={verse.surah} ayah={verse.ayah} />
                  <div className="corpus-verse-meta">
                    <span>{surah.number}:{verse.ayah}</span>
                    <span>Tanzil Uthmani 1.1</span>
                    <span>QuranEnc Rowwad {turkishMealMetadata.version}</span>
                    <span>3 klasik Arapça tefsir</span>
                    <span>Hadis bağlantıları editör kuyruğunda</span>
                  </div>
                </div>
              </article>;
            })}
          </section>

          <nav className="surah-pagination" aria-label="Sureler arasında gezinme">
            {previous ? <Link href={getSurahHref(previous)}><small>← Önceki sure</small><strong>{previous.nameTransliterated}</strong></Link> : <span />}
            {next ? <Link href={getSurahHref(next)}><small>Sonraki sure →</small><strong>{next.nameTransliterated}</strong></Link> : <span />}
          </nav>
        </article>

        <aside className="wiki-infobox" aria-label={`${surah.nameTransliterated} bilgi kutusu`}>
          <div className="infobox-symbol">{surah.number}</div>
          <h2>{surah.nameTransliterated}</h2>
          <p lang="ar" dir="rtl" translate="no">{surah.nameArabic}</p>
          <dl>
            <div><dt>Sure no.</dt><dd>{surah.number}</dd></div>
            <div><dt>Ayet sayısı</dt><dd>{surah.ayahCount}</dd></div>
            <div><dt>Nüzul türü</dt><dd>{revelationLabel}</dd></div>
            <div><dt>Rükû</dt><dd>{surah.rukuCount}</dd></div>
          </dl>
          <div className="infobox-source" id="kaynak">
            <strong>Kur’an metni · Tanzil Project</strong>
            <p>{quranLicense.name}</p>
            <a href="https://tanzil.net" rel="noreferrer" target="_blank">Kaynağı aç ↗</a>
            <strong className="secondary-source">Türkçe meal · QuranEnc</strong>
            <p>Rowwad Tercüme Merkezi · {turkishMealMetadata.version}</p>
            <a href="https://quranenc.com/tr" rel="noreferrer" target="_blank">Meal kaynağını aç ↗</a>
          </div>
        </aside>
      </div>
    </main>
  );
}
