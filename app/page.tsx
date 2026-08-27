import Link from 'next/link';
import { KnowledgeGraph } from './components/knowledge-graph';
import { SearchExplorer } from './components/search-explorer';
import { SiteHeader } from './components/site-header';
import { getTurkishMeal, getVerse, turkishMealMetadata } from '@/lib/quran';

const collections = [
  { name: 'Kur’an-ı Kerîm', detail: '114 sure, 6.236 ayet ve kaynaklı Türkçe meal', href: '/sureler' },
  { name: 'Sahih hadisler', detail: '1.993 doğrulanmış Arapça–Türkçe kayıt', href: '/hadis' },
  { name: 'İmam Taberî', detail: 'Câmiu’l-Beyân · 6.236 ayet kaydı', href: '/alim/taberi' },
  { name: 'İbn Kesîr', detail: 'Tefsîru’l-Kur’âni’l-Azîm · 6.236 ayet kaydı', href: '/alim/ibn-kesir' },
  { name: 'İmam Kurtubî', detail: 'el-Câmiʿ li-Ahkâmi’l-Kur’ân · 6.234 yorum', href: '/alim/kurtubi' },
];

export default function Home() {
  const featuredVerse = getVerse(1, 5);
  const featuredMeaning = getTurkishMeal(1, 5);
  if (!featuredVerse || !featuredMeaning) throw new Error('Featured Quran record is missing');

  return (
    <main>
      <SiteHeader />
      <div className="wiki-home-layout">
        <aside className="portal-sidebar" aria-label="WikiTefsir bölümleri">
          <strong>İçindekiler</strong>
          <Link className="active" href="/">Ana sayfa</Link>
          <Link href="/sureler">Kur’an sureleri</Link>
          <Link href="/hadis">Sahih hadisler</Link>
          <Link href="/alim/taberi">Müfessirler</Link>
          <a href="#bilgi-agi">Bilgi ağı</a>
          <a href="#metodoloji">Kaynak politikası</a>
          <span>Katkı ve kapsam</span>
          <a href="#kapsam">Mevcut veri</a>
          <a href="#metodoloji">Doğrulama yöntemi</a>
        </aside>

        <div className="wiki-home-main">
          <nav className="page-tabs" aria-label="Sayfa araçları">
            <span className="active">Ana sayfa</span>
            <a href="#kapsam">İçerik</a>
            <a href="#metodoloji">Kaynaklar</a>
          </nav>

          <header className="wiki-welcome" id="kesfet">
            <div>
              <h1>WikiTefsir’e hoş geldiniz</h1>
              <p>Kur’an, sahih hadis ve klasik Ehl-i Sünnet tefsirlerini kaynaklarıyla buluşturan açık bilgi ansiklopedisi.</p>
            </div>
            <dl aria-label="WikiTefsir kapsamı">
              <div><dt>Sure</dt><dd>114</dd></div>
              <div><dt>Ayet</dt><dd>6.236</dd></div>
              <div><dt>Sahih hadis</dt><dd>1.993</dd></div>
              <div><dt>Tefsir satırı</dt><dd>18.708</dd></div>
            </dl>
          </header>

          <section className="wiki-search-section" id="arama" aria-labelledby="search-title">
            <h2 id="search-title">Ansiklopedide ara</h2>
            <SearchExplorer />
            <p>Örnek: <Link href="/sure/fatiha">Fâtiha</Link>, <Link href="/sure/al-baqara#ayet-255">2:255</Link>, <Link href="/hadis/1751">h:1751</Link></p>
          </section>

          <div className="wiki-home-columns" id="kapsam">
            <section className="portal-panel portal-featured" aria-labelledby="featured-title">
              <h2 id="featured-title">Seçkin madde</h2>
              <div className="portal-panel-body">
                <p className="portal-arabic" lang="ar" dir="rtl" translate="no">{featuredVerse.text}</p>
                <p className="portal-translation">“{featuredMeaning.text}”</p>
                <p>
                  <Link href="/sure/fatiha"><strong>Fâtiha Suresi</strong></Link>, Kur’an-ı Kerîm’in ilk suresidir.
                  Bu kayıt <Link href="/sure/fatiha#ayet-5">1:5 ayetini</Link>, Rowwad Türkçe mealini ve
                  İbn Kesîr, Taberî ve Kurtubî’nin kaynaklı Arapça tefsirlerini birlikte sunar.
                </p>
                <p className="portal-source">Meal: QuranEnc Rowwad {turkishMealMetadata.version}</p>
                <Link className="wiki-more-link" href="/sure/fatiha#ayet-5">Maddenin devamını okuyun →</Link>
              </div>
            </section>

            <section className="portal-panel portal-corpus" aria-labelledby="corpus-title">
              <h2 id="corpus-title">Külliyatlar ve eserler</h2>
              <div className="portal-list">
                {collections.map((collection) => (
                  <Link href={collection.href} key={collection.name}>
                    <strong>{collection.name}</strong>
                    <span>{collection.detail}</span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="portal-panel portal-about" id="metodoloji" aria-labelledby="method-title">
              <h2 id="method-title">WikiTefsir hakkında</h2>
              <div className="portal-panel-body">
                <p>WikiTefsir’de dinî metin ile editoryal açıklama birbirinden ayrılır. Her kayıt kaynak, sürüm ve mümkün olduğunda eser içi konum bilgisiyle gösterilir.</p>
                <ul>
                  <li>Kur’an metni: Tanzil Uthmani 1.1</li>
                  <li>Türkçe meal: QuranEnc Rowwad {turkishMealMetadata.version}</li>
                  <li>Hadis başlangıç külliyatı: HadeethEnc 1.67.0</li>
                  <li>Klasik tefsirler: Quran Lab 1.40.0</li>
                </ul>
                <p>Kütüb-i Sitte’nin tam aktarımı henüz kaynak doğrulamasındadır; mevcut kapsam olduğundan geniş gösterilmez.</p>
              </div>
            </section>

            <section className="portal-panel portal-navigation" aria-labelledby="navigation-title">
              <h2 id="navigation-title">Ansiklopedide gezinme</h2>
              <div className="portal-panel-body">
                <ul>
                  <li><Link href="/sureler">114 sure dizini</Link></li>
                  <li><Link href="/hadis">Sahih hadis dizini</Link></li>
                  <li><Link href="/alim/taberi">İmam Taberî maddesi</Link></li>
                  <li><Link href="/alim/ibn-kesir">İbn Kesîr maddesi</Link></li>
                  <li><Link href="/alim/kurtubi">İmam Kurtubî maddesi</Link></li>
                </ul>
              </div>
            </section>
          </div>

          <div id="bilgi-agi"><KnowledgeGraph /></div>

          <footer className="wiki-footer">
            <p>WikiTefsir, kaynak bütünlüğünü önceleyen bağımsız bir bilgi projesidir. Metinler kendi kaynak ve kullanım şartlarıyla yayımlanır.</p>
            <nav><a href="#metodoloji">Kaynak politikası</a><a href="#kapsam">Kapsam</a><Link href="/sureler">Sureler</Link><Link href="/hadis">Hadisler</Link></nav>
          </footer>
        </div>
      </div>
    </main>
  );
}
