import { SearchExplorer } from './components/search-explorer';
import { KnowledgeGraph } from './components/knowledge-graph';
import { SiteHeader } from './components/site-header';

const collections = [
  { name: 'Kur’an-ı Kerîm', detail: '114 sure · 6.236 ayet', tone: 'green' },
  { name: 'Kütüb-i Sitte', detail: '6 temel hadis külliyatı', tone: 'amber' },
  { name: 'Klasik Tefsirler', detail: 'Kaynaklı açıklamalar', tone: 'blue' },
];

const scholars = [
  { initials: 'T', name: 'İmam Taberî', work: 'Câmiu’l-Beyân' },
  { initials: 'İK', name: 'İbn Kesîr', work: 'Tefsîru’l-Kur’âni’l-Azîm' },
  { initials: 'K', name: 'İmam Kurtubî', work: 'el-Câmiʿ li-Ahkâmi’l-Kur’ân' },
];

export default function Home() {
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
          <span>Popüler:</span>
          <a href="#fatiha">Fâtiha Suresi</a>
          <a href="#sabir">Sabır</a>
          <a href="#ayet-el-kursi">Âyetü’l-Kürsî</a>
          <a href="#ebu-hureyre">Ebû Hüreyre</a>
        </div>
      </section>

      <section className="content-shell" aria-label="WikiTefsir içeriği">
        <div className="collection-grid" id="sureler">
          {collections.map((collection) => (
            <a className={`collection-card ${collection.tone}`} href={`#${collection.name}`} key={collection.name}>
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
              <p className="arabic" lang="ar" dir="rtl">إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ</p>
              <span className="verse-number" aria-label="5. ayet">٥</span>
              <p className="translation">“Yalnız sana ibadet eder ve yalnız senden yardım dileriz.”</p>
              <p className="translation-note">Anlam odaklı örnek Türkçe karşılık · Yayın öncesi ilmî kontrol gerekir</p>
            </div>

            <div className="relation-summary">
              <div><strong>3</strong><span>Tefsir kaydı</span></div>
              <div><strong>8</strong><span>İlişkili hadis</span></div>
              <div><strong>5</strong><span>Kavram</span></div>
              <a href="#ayet-detayi">Ayet sayfasını aç <span>→</span></a>
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
                <a className="scholar" href={`#${scholar.name}`} key={scholar.name}>
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
