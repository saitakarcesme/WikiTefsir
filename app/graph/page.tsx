import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/app/components/site-header';
import { KnowledgeGraphExplorer } from '@/app/components/knowledge-graph-explorer';
import { getLocale } from '@/lib/server-locale';

export const metadata: Metadata = { title: 'Knowledge graph', description: 'Explore connections across WikiTefsir.', openGraph: { images: [] }, twitter: { images: [] } };
export default async function GraphPage() { const locale = await getLocale(); const tr = locale === 'tr'; return <main><SiteHeader /><div className="graph-page"><nav className="breadcrumbs"><Link href="/">{tr ? 'Ana sayfa' : 'Home'}</Link><span>›</span>{tr ? 'Bilgi grafiği' : 'Knowledge graph'}</nav><header className="reader-page-header"><span className="reader-overline">{tr ? 'Bağlantıları keşfet' : 'Explore connections'}</span><h1>{tr ? 'Bilgi grafiği' : 'Knowledge graph'}</h1><p>{tr ? 'Üç sabit harita; kişileri, kavramları, sureleri, âlimleri ve sahih hadisleri üst üste binen etiketler olmadan bağlar.' : 'Three stable maps connect people, concepts, surahs, scholars, and authentic hadith without animated nodes or overlapping labels.'}</p></header><KnowledgeGraphExplorer locale={locale} /></div></main>; }
