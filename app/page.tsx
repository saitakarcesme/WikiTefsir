import Link from 'next/link';
import { SearchExplorer } from './components/search-explorer';
import { KnowledgeGraph } from './components/knowledge-graph';
import { SiteHeader } from './components/site-header';
import { getTurkishMeal, getVerse, turkishMealMetadata } from '@/lib/quran';

const collections = [
  { name: 'Kur’an-ı Kerîm', detail: '114 sure · 6.236 ayet ve Türkçe meal', tone: 'green', href: '/sureler' },
  { name: 'Sahih Hadisler', detail: '1.993 doğrulanmış kayıt', tone: 'amber', href: '/hadis' },
  { name: 'Klasik Tefsirler', detail: 'Kaynaklı açıklamalar', tone: 'blue', href: '/alim/taberi' },
];

const scholars = [
  { initials: 'T', name: 'İmam Taberî', work: 'Câmiu’l-Beyân', href: '/alim/taberi' },
  { initials: 'İK', name: 'İbn Kesîr', work: 'Tefsîru’l-Kur’âni’l-Azîm', href: '/alim/ibn-kesir' },
  { initials: 'K', name: 'İmam Kurtubî', work: 'el-Câmiʿ li-Ahkâmi’l-Kur’ân', href: '/alim/kurtubi' },
];

export default function Home() {
  const featuredVerse = getVerse(1, 5);
  const featuredMeaning = getTurkishMeal(1, 5);
  if (!featuredVerse || !featuredMeaning) throw new Error('Featured Quran record is missing');

  return (
    <main>
      <SiteHeader />

      <section className="hero" id="kesfet">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="eyebrow"><span /> Güvenilir kaynaklar, tek bir bilgi ağı</div>
        <h1>Kur’an’ı kaynaklarıyla<br /><em>birlikte keşfedin.</em></h1>
        <p className="hero-copy">
          Ayetleri, sahih hadisleri ve Ehl-i Sünnet müfessirlerinin açıklamalarını
          bağlantılı, izlenebilir ve sade bir deneyimde okuyun.
        </p>

        <SearchExplorer />

        <div className="quick-searches" aria-label="Örnek aramalar">
          <span>Örnek:</span>
          <Link href="/sure/fatiha">Fâtiha</Link>
          <Link href="/sure/al-baqara#ayet-255">2:255</Link>
          <Link href="/sure/yasin">Yâsîn</Link>
          <Link href="/sure/ar-rahman">er-Rahmân</Link>
        </div>
      </section>

      <section className="content-shell" aria-label="WikiTefsir içeriği">
        <div className="collection-grid" id="sureler">
          {collections.map((collection) => (
            <a className={`collection-card ${collection.tone}`} href={collection.href} key={collection.name}>
              <span className="collection-icon" aria-hidden="true">
                {collection.tone === 'green' ? '۞' : collection.tone === 'amber' ? '≡' : '⌘'}
              </span>
              <span>
                <strong>{collection.name}</strong>
                <small>{collection.detail}</small>
              </span>
              <span className="arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </div>

        <div className="workspace-grid">
          <article className="featured-card" id="fatiha">
            <div className="card-heading">
              <div>
                <span className="section-kicker">Günün ayeti</span>
                <h2>Fâtiha Suresi, 5. Ayet</h2>
              </div>
              <span className="verified-badge">✓ Kaynaklı kayıt</span>
            </div>

            <div className="verse-panel">
              <p className="arabic" lang="ar" dir="rtl" translate="no">{featuredVerse.text}</p>
              <span className="verse-number" aria-label="5. ayet">٥</span>
              <p className="translation">“{featuredMeaning.text}”</p>
              <p className="translation-note">QuranEnc · Rowwad Tercüme Merkezi · sürüm {turkishMealMetadata.version}</p>
            </div>

            <div className="relation-summary">
              <div><strong>1:5</strong><span>Sure:ayet</span></div>
              <div><strong>2</strong><span>Doğrulanmış kaynak</span></div>
              <div><strong>{turkishMealMetadata.version}</strong><span>Meal sürümü</span></div>
              <Link href="/sure/fatiha#ayetler">Ayet sayfasını aç <span>→</span></Link>
            </div>
          </article>

          <aside className="scholars-card" id="alimler">
            <div className="card-heading compact">
              <div>
                <span className="section-kicker">Kaynak kütüphanesi</span>
                <h2>Öne çıkan müfessirler</h2>
              </div>
              <a href="#tum-alimler" aria-label="Tüm müfessirleri gör">Tümü</a>
            </div>

            <div className="scholar-list">
              {scholars.map((scholar) => (
                <a className="scholar" href={scholar.href} key={scholar.name}>
                  <span className="avatar">{scholar.initials}</span>
                  <span><strong>{scholar.name}</strong><small>{scholar.work}</small></span>
                  <span className="arrow">›</span>
                </a>
              ))}
            </div>
          </aside>
        </div>

        <KnowledgeGraph />

        <div className="trust-strip" id="metodoloji">
          <span className="trust-mark" aria-hidden="true">✓</span>
          <div><strong>Kaynak olmadan hüküm yok.</strong><p>Her bilgi, eser ve konum künyesiyle izlenebilir; örnek veriler açıkça işaretlenir.</p></div>
          <a href="#metodoloji">Yayın metodolojisi <span>→</span></a>
        </div>
      </section>
    </main>
  );
}
