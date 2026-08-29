import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/app/components/site-header';
import { getAllProphets, getAllQuranicFigures, getPersonHref, type PersonRecord } from '@/lib/people';
import { getLocale } from '@/lib/server-locale';
import { getPersonIntro, getPersonKind, getPersonName } from '@/lib/person-locale';

export const metadata: Metadata = {
  title: 'People in the Quran',
  description: 'Quran-first articles for all 25 named prophets and major Quranic people, groups, angels, rulers, and unnamed figures.',
  openGraph: { images: [] }, twitter: { images: [] },
};

export default async function PeoplePage() {
  const locale = await getLocale(); const tr = locale === 'tr';
  const prophets = getAllProphets();
  const figures = getAllQuranicFigures();
  function cards(records: PersonRecord[]) { return records.map((person) => <Link href={getPersonHref(person)} key={person.slug}>
    <span className="reader-card-arabic" lang="ar" dir="rtl">{person.arabic}</span>
    <span><strong>{getPersonName(person, locale)}</strong><small>{getPersonKind(person, locale)}</small><p>{getPersonIntro(person, locale)}</p><em>{tr ? 'Kur’an’daki açık kayıtlar esas alınır.' : person.quranNaming}</em></span>
    <span aria-hidden="true">→</span>
  </Link>); }
  return (
    <main><SiteHeader /><div className="reader-index-page">
      <nav className="breadcrumbs"><Link href="/">{tr ? 'Ana sayfa' : 'Home'}</Link><span>›</span>{tr ? 'Kişiler' : 'People'}</nav>
      <header className="reader-page-header"><span className="reader-overline">{tr ? 'Bağlantılı makaleler' : 'Connected articles'}</span><h1>{tr ? 'Kur’an’daki kişiler ve topluluklar' : 'People & figures in the Quran'}</h1><p>{tr ? 'Kur’an’da adı geçen bütün peygamberleri anlatı sırasıyla okuyun; ardından hükümdarları, aileleri, melekleri, karşıtları, toplulukları ve adı verilmeyen kişileri keşfedin. Her aşama doğrudan ayetlere döner.' : 'Read every Quran-named prophet in narrative order, then explore rulers, families, angels, adversaries, communities, and unnamed figures. Every stage returns to exact verses.'}</p><div className="people-counts"><a href="#prophets"><strong>25</strong><span>{tr ? 'adı geçen peygamber' : 'named prophets'}</span></a><a href="#figures"><strong>{figures.length}</strong><span>{tr ? 'diğer kişi ve topluluk' : 'other figures'}</span></a></div></header>
      <section id="prophets" className="people-directory-section"><div className="reader-section-heading"><span>{tr ? 'Tam adlandırılmış küme' : 'Complete named set'}</span><h2>{tr ? 'Kur’an’daki peygamberler' : 'Prophets in the Quran'}</h2></div><div className="reader-card-list" aria-label={tr ? 'Peygamber makaleleri' : 'Prophet articles'}>{cards(prophets)}</div></section>
      <section id="figures" className="people-directory-section"><div className="reader-section-heading"><span>{tr ? 'Kişiler, varlıklar ve topluluklar' : 'People, beings & communities'}</span><h2>{tr ? 'Diğer Kur’an kişileri' : 'Other Quranic figures'}</h2></div><div className="reader-card-list" aria-label={tr ? 'Diğer kişi makaleleri' : 'Other Quranic figure articles'}>{cards(figures)}</div></section>
    </div></main>
  );
}
