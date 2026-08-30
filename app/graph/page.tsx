import type { Metadata } from 'next';
import { SiteHeader } from '@/app/components/site-header';
import { KnowledgeGraphExplorer } from '@/app/components/knowledge-graph-explorer';
import { getLocale } from '@/lib/server-locale';

export const metadata: Metadata = { title: 'Knowledge graph', description: 'Explore the connected IslamWiki corpus in a global or local graph.', openGraph: { images: [] }, twitter: { images: [] } };

export default async function GraphPage() {
  const locale = await getLocale();
  return <main className="atlas-page"><SiteHeader /><KnowledgeGraphExplorer locale={locale} /></main>;
}
