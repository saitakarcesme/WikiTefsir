import type { Metadata } from 'next';
import { SiteHeader } from '../components/site-header';

export const metadata: Metadata = {
  title: 'Kütüb-i Sitte Hadis Kütüphanesi',
  description: 'Kütüb-i Sitte eserleri, kitap ve bab yapıları ile ayet bağlantıları.',
};

const collections = [
  { author: 'İmam Buhârî', title: 'el-Câmiu’s-Sahîh', short: 'B', status: 'Şema hazır' },
  { author: 'İmam Müslim', title: 'el-Câmiu’s-Sahîh', short: 'M', status: 'Şema hazır' },
  { author: 'Ebû Dâvûd', title: 'es-Sünen', short: 'ED', status: 'Veri bekliyor' },
  { author: 'İmam Tirmizî', title: 'el-Câmiʿ', short: 'T', status: 'Veri bekliyor' },
  { author: 'İmam Nesâî', title: 'es-Sünen', short: 'N', status: 'Veri bekliyor' },
  { author: 'İbn Mâce', title: 'es-Sünen', short: 'İM', status: 'Veri bekliyor' },
];

export default function HadithPage() {
  return (
    <main>
      <SiteHeader />
      <div className="library-page">
        <nav className="breadcrumbs" aria-label="İçerik yolu"><a href="/">Ana sayfa</a><span>›</span>Hadisler</nav>
        <header className="library-hero">
          <span className="section-kicker">Hadis kütüphanesi</span>
          <h1>Kütüb-i Sitte</h1>
          <p>Yaygın kullanımdaki altı temel hadis külliyatını kitap, bab, rivayet ve râvi düzeyinde ayetlerle buluşturan araştırma alanı.</p>
          <div className="library-search"><span aria-hidden="true">⌕</span><input aria-label="Hadislerde ara" placeholder="Hadis metni, râvi, kitap veya bab ara…" /><button>Ara</button></div>
        </header>

        <section className="notice-card library-notice">
          <strong>Veri bütünlüğü taahhüdü</strong>
          <p>Hadis metinleri yalnız doğrulanmış neşirlerden, hadis numaralandırma sistemi açıkça belirtilerek yayımlanacaktır. Aşağıdaki kartlar mevcut alfa veri kapsamını dürüstçe gösterir.</p>
        </section>

        <section aria-labelledby="collections-title">
          <div className="section-title"><div><span className="section-kicker">Altı eser</span><h2 id="collections-title">Koleksiyonlar</h2></div><span className="review-status">Alfa kapsamı</span></div>
          <div className="hadith-collections">
            {collections.map((collection) => (
              <article key={collection.author}>
                <span className="book-monogram">{collection.short}</span>
                <div><small>{collection.author}</small><h3>{collection.title}</h3></div>
                <span className={collection.status === 'Şema hazır' ? 'status ready' : 'status'}>{collection.status}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="hadith-model" id="hadis-modeli">
          <div><span className="section-kicker">İzlenebilir kayıt</span><h2>Her rivayetin yolu görünür.</h2><p>Koleksiyondan kitaba, babdan hadis numarasına ve râvi zincirinden ilişkili ayete kadar her seviye ayrı kayıt olarak saklanır.</p></div>
          <ol aria-label="Hadis veri yapısı"><li>Külliyat</li><li>Kitap</li><li>Bab</li><li>Hadis</li><li>Râvi zinciri</li><li>İlgili ayet</li></ol>
        </section>
      </div>
    </main>
  );
}
