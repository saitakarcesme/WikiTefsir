import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/app/components/site-header';
import { KnowledgeGraphExplorer } from '@/app/components/knowledge-graph-explorer';

export const metadata: Metadata = { title: 'Knowledge graph', description: 'Explore connections across WikiTefsir.', openGraph: { images: [] }, twitter: { images: [] } };
export default function GraphPage() { return <main><SiteHeader /><div className="graph-page"><nav className="breadcrumbs"><Link href="/">Home</Link><span>›</span>Knowledge graph</nav><header className="reader-page-header"><span className="reader-overline">Explore connections</span><h1>Knowledge graph</h1><p>Three stable maps connect people, concepts, surahs, scholars, and authentic hadith without animated nodes or overlapping labels.</p></header><KnowledgeGraphExplorer /></div></main>; }
