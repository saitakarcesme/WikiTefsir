import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/app/components/site-header';
import { getAllPeople } from '@/lib/people';
import { getLocale } from '@/lib/server-locale';
import { getPersonKind, getPersonName } from '@/lib/person-locale';

export const metadata: Metadata = { title: 'Stories', description: 'Read Quranic stories as chronological, source-linked paths.', openGraph: { images: [] }, twitter: { images: [] } };

export default async function StoriesPage() {
  const locale = await getLocale();
  const tr = locale === 'tr';
  const stories = getAllPeople().filter((person) => person.narrative.length > 1);
  return <main><SiteHeader /><div className="reader-index-page stories-page">
    <nav className="breadcrumbs"><Link href="/">{tr ? 'Ana sayfa' : 'Home'}</Link><span>›</span>{tr ? 'Kıssalar' : 'Stories'}</nav>
    <header className="reader-page-header stories-header"><span className="reader-overline">{tr ? 'Kaynak temelli okuma yolları' : 'Source-led reading paths'}</span><h1>{tr ? 'Kıssalar' : 'Stories'}</h1><p>{tr ? 'Farklı surelere yayılan olayları kesintisiz bir anlatı olarak okuyun; her bölümün altında dayandığı Arapça ayetler ve Türkçe kaynak meal bulunur.' : 'Read events spread across different surahs as one continuous narrative, with the exact Arabic verses and sourced English translation kept beneath every chapter.'}</p></header>
    <section className="stories-index" aria-label={tr ? 'Kur’an kıssaları' : 'Quranic stories'}>
      {stories.map((person, index) => <Link href={`/stories/${person.slug}`} key={person.slug}><small>{String(index + 1).padStart(2, '0')} · {getPersonKind(person, locale)}</small><span className="story-name"><strong>{getPersonName(person, locale)}</strong><span lang="ar" dir="rtl">{person.arabic}</span></span><em>{person.narrative.length} {tr ? 'bölüm' : 'chapters'} →</em></Link>)}
    </section>
  </div></main>;
}
