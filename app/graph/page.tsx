import type { Metadata } from 'next';
import { SiteHeader } from '@/app/components/site-header';
import { KnowledgeGraphExplorer } from '@/app/components/knowledge-graph-explorer';
import { getKnowledgeGraphBranch } from '@/lib/knowledge-graph';
import { getLocale } from '@/lib/server-locale';

export const metadata: Metadata = { title: 'Knowledge graph', description: 'Explore the complete WikiTefsir knowledge hierarchy.', openGraph: { images: [] }, twitter: { images: [] } };

export default async function GraphPage() {
  const locale = await getLocale();
  const initialBranch = getKnowledgeGraphBranch('allah', locale);
  if (!initialBranch) throw new Error('Knowledge graph root is missing');
  return <main className="atlas-page"><SiteHeader /><KnowledgeGraphExplorer initialBranch={initialBranch} locale={locale} /></main>;
}
