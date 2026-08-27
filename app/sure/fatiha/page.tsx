import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: 'Fâtiha Suresi',
  description: 'Fâtiha Suresi ayetleri, ilişkili hadisler ve klasik tefsir kayıtları.',
};

const verses = [
  { number: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', meaning: 'Rahmân ve Rahîm olan Allah’ın adıyla.' },
  { number: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', meaning: 'Hamd, âlemlerin Rabbi Allah’a mahsustur.' },
  { number: 3, arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', meaning: 'O, Rahmân’dır, Rahîm’dir.' },
  { number: 4, arabic: 'مَالِكِ يَوْمِ الدِّينِ', meaning: 'Hesap gününün sahibidir.' },
  { number: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', meaning: 'Yalnız sana ibadet eder ve yalnız senden yardım dileriz.' },
  { number: 6, arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', meaning: 'Bizi dosdoğru yola ilet.' },
  { number: 7, arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', meaning: 'Kendilerine nimet verdiklerinin yoluna; gazaba uğrayanların ve sapmışların yoluna değil.' },
];

export default function FatihaPage() {
  return (
    <main>
      <SiteHeader />
      <div className="wiki-layout">
        <aside className="wiki-toc" aria-label="Sayfa içeriği">
          <span>Bu sayfada</span>
          <a className="active" href="#genel">Genel bakış</a>
          <a href="#ayetler">Ayetler</a>
          <a href="#tefsir">Tefsir kayıtları</a>
          <a href="#hadis">İlişkili hadisler</a>
          <a href="#kaynaklar">Kaynaklar</a>
        </aside>

        <article className="wiki-article">
          <nav className="breadcrumbs" aria-label="İçerik yolu"><Link href="/">Ana sayfa</Link><span>›</span><Link href="/#sureler">Sureler</Link><span>›</span>Fâtiha</nav>
          <header className="article-header" id="genel">
            <span className="section-kicker">1. Sure</span>
            <h1>Fâtiha Suresi</h1>
            <p className="article-lead">Kur’an’ın açılış suresi; hamd, kulluk, yardım talebi ve hidayet duasını merkezine alır.</p>
            <div className="article-facts"><span>Mekkî · yaygın kabul</span><span>7 ayet</span><span>Kur’an’ın 1. suresi</span></div>
          </header>

          <section className="notice-card">
            <strong>İlmî yayın notu</strong>
            <p>Bu alfa sürümündeki Türkçe karşılıklar arayüzü göstermek içindir. Nihai yayında her meal ve tefsir kaydı baskı künyesiyle ilmî kontrolden geçecektir.</p>
          </section>

          <section className="verse-list" id="ayetler" aria-labelledby="verses-title">
            <div className="section-title"><div><span className="section-kicker">Sure metni</span><h2 id="verses-title">Ayetler</h2></div><button>Karşılaştırmalı meal</button></div>
            {verses.map((verse) => (
              <article className={verse.number === 5 ? 'verse-row selected' : 'verse-row'} key={verse.number}>
                <span className="round-number">{verse.number}</span>
                <div>
                  <p className="verse-arabic" lang="ar" dir="rtl">{verse.arabic}</p>
                  <p className="verse-meaning">{verse.meaning}</p>
                  {verse.number === 5 && <div className="verse-tags"><a href="#tefsir">3 tefsir</a><a href="#hadis">8 hadis</a><Link href="/#iliskiler">Bilgi haritası</Link></div>}
                </div>
              </article>
            ))}
          </section>

          <section className="source-section" id="tefsir">
            <div className="section-title"><div><span className="section-kicker">Klasik kaynaklar</span><h2>Tefsir kayıtları</h2></div><span className="review-status">Editör incelemesinde</span></div>
            <div className="source-cards">
              <article><span>Tefsir</span><h3>İmam Taberî</h3><p>İbadetin yalnız Allah’a tahsisi ve yardım talebinin kullukla ilişkisine dair kayıt alanı.</p><small>Câmiu’l-Beyân · Kesin baskı künyesi bekliyor</small></article>
              <article><span>Tefsir</span><h3>İbn Kesîr</h3><p>Tevhid, tevekkül ve kulun Rabbine yönelişini birlikte ele alan kayıt alanı.</p><small>Tefsîru’l-Kur’âni’l-Azîm · Kesin baskı künyesi bekliyor</small></article>
            </div>
          </section>
        </article>

        <aside className="wiki-infobox" aria-label="Fâtiha Suresi bilgi kutusu">
          <div className="infobox-symbol">١</div>
          <h2>Fâtiha</h2>
          <p>الفاتحة</p>
          <dl><div><dt>Diğer adı</dt><dd>Ümmü’l-Kitâb</dd></div><div><dt>Sure no.</dt><dd>1</dd></div><div><dt>Ayet sayısı</dt><dd>7</dd></div><div><dt>Nüzul</dt><dd>Mekke · yaygın kabul</dd></div></dl>
          <Link href="/#iliskiler">İlişki haritasını aç →</Link>
        </aside>
      </div>
    </main>
  );
}
