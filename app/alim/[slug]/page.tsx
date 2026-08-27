import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '../../components/site-header';

const scholars = {
  taberi: {
    name: 'İmam Taberî',
    arabic: 'محمد بن جرير الطبري',
    dates: '3–4. hicrî yüzyıl',
    place: 'Taberistan · Bağdat',
    field: 'Tefsir, tarih ve fıkıh',
    work: 'Câmiu’l-Beyân an Te’vîli Âyi’l-Kur’ân',
    initials: 'T',
    commentaryCount: 6236,
    summary: 'Rivayetleri senedleriyle bir araya getiren, dil ve kıraat değerlendirmelerine yer veren erken dönem müfessirlerinden biridir.',
  },
  'ibn-kesir': {
    name: 'İbn Kesîr',
    arabic: 'إسماعيل بن عمر بن كثير',
    dates: '8. hicrî yüzyıl',
    place: 'Busra · Dımaşk',
    field: 'Tefsir, hadis ve tarih',
    work: 'Tefsîru’l-Kur’âni’l-Azîm',
    initials: 'İK',
    commentaryCount: 6236,
    summary: 'Kur’an’ı Kur’an, hadis ve selef rivayetleriyle açıklama yöntemiyle tanınan Ehl-i Sünnet müfessiridir.',
  },
  kurtubi: {
    name: 'İmam Kurtubî',
    arabic: 'محمد بن أحمد القرطبي',
    dates: '7. hicrî yüzyıl',
    place: 'Kurtuba · Mısır',
    field: 'Tefsir ve fıkıh',
    work: 'el-Câmiʿ li-Ahkâmi’l-Kur’ân',
    initials: 'K',
    commentaryCount: 6234,
    summary: 'Ayetlerden çıkarılan hükümleri, dil açıklamalarını ve rivayetleri geniş biçimde ele alan Endülüslü müfessirdir.',
  },
} as const;

type ScholarSlug = keyof typeof scholars;

export function generateStaticParams() {
  return Object.keys(scholars).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const scholar = scholars[slug as ScholarSlug];
  if (!scholar) return {};
  return { title: scholar.name, description: `${scholar.name}, eserleri ve WikiTefsir’deki bağlantılı kayıtları.` };
}

export default async function ScholarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scholar = scholars[slug as ScholarSlug];
  if (!scholar) notFound();

  return (
    <main>
      <SiteHeader />
      <div className="profile-page">
        <nav className="breadcrumbs" aria-label="İçerik yolu"><Link href="/">Ana sayfa</Link><span>›</span><Link href="/#alimler">Âlimler</Link><span>›</span>{scholar.name}</nav>
        <header className="profile-hero">
          <div className="profile-monogram">{scholar.initials}</div>
          <div>
            <span className="section-kicker">Müfessir profili</span>
            <h1>{scholar.name}</h1>
            <p className="profile-arabic" lang="ar" dir="rtl">{scholar.arabic}</p>
            <p>{scholar.summary}</p>
          </div>
        </header>

        <div className="profile-grid">
          <article className="profile-main">
            <section>
              <span className="section-kicker">Başlıca eser</span>
              <h2>{scholar.work}</h2>
              <p>Eserin Arapça metni Quran Lab’ın sabitlenmiş 1.40.0 veri yayımından, ayet anahtarına göre ve değiştirilmeden sunulur. Birden çok ayeti kapsayan kaynak pasajları veri kaynağının verdiği koordinatlarla korunur.</p>
              <div className="record-stats"><span><strong>114</strong>Sure alanı</span><span><strong>{scholar.commentaryCount.toLocaleString('tr-TR')}</strong>Ayet yorumu</span><span><strong>1.40.0</strong>Kaynak sürümü</span></div>
            </section>
            <section>
              <span className="section-kicker">Bağlantılı kayıtlar</span>
              <div className="linked-record"><span>Fâtiha 1:1</span><strong>Kaynaklı Arapça tefsir kaydı</strong><Link href="/sure/fatiha#ayet-1">Kaydı aç →</Link></div>
              <div className="linked-record"><span>Bakara 2:255</span><strong>Âyetü’l-Kürsî tefsir kaydı</strong><Link href="/sure/al-baqara#ayet-255">Kaydı aç →</Link></div>
            </section>
          </article>

          <aside className="profile-facts">
            <h2>Kısa bilgiler</h2>
            <dl><div><dt>Dönem</dt><dd>{scholar.dates}</dd></div><div><dt>Coğrafya</dt><dd>{scholar.place}</dd></div><div><dt>Alanlar</dt><dd>{scholar.field}</dd></div><div><dt>Kaynak durumu</dt><dd>Doğrulandı · 1.40.0</dd></div></dl>
            <Link href="/sure/fatiha">Bağlantılı sureyi gör →</Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
