import Link from 'next/link';

type GraphNode = { label: string; kind: string; href: string };
type GraphCluster = { title: string; description: string; hub: GraphNode; nodes: GraphNode[] };

const clusters: GraphCluster[] = [
  {
    title: 'The story of Moses',
    description: 'A person article joined to the surahs, concepts, and commentary that explain its stages.',
    hub: { label: 'Moses', kind: 'Person', href: '/person/musa' },
    nodes: [
      { label: 'Al-Qasas', kind: 'Surah', href: '/surah/al-qasas' },
      { label: 'Ta-Ha', kind: 'Surah', href: '/surah/ta-ha' },
      { label: 'Prophethood', kind: 'Concept', href: '/concept/prophethood' },
      { label: 'Guidance', kind: 'Concept', href: '/concept/guidance' },
      { label: 'Al-Tabari', kind: 'Scholar', href: '/scholars/taberi' },
    ],
  },
  {
    title: 'The chain of revelation',
    description: 'The revealed word connects messenger, angel, scripture, source record, and explanation.',
    hub: { label: 'Revelation', kind: 'Concept', href: '/concept/revelation' },
    nodes: [
      { label: 'Muhammad', kind: 'Person', href: '/person/muhammad' },
      { label: 'Gabriel', kind: 'Angel', href: '/person/jibril' },
      { label: 'The Quran', kind: 'Scripture', href: '/surahs' },
      { label: 'Al-Ahzab', kind: 'Surah', href: '/surah/al-ahzab' },
      { label: 'Ibn Kathir', kind: 'Scholar', href: '/scholars/ibn-kesir' },
    ],
  },
  {
    title: 'Worship in practice',
    description: 'Verses and authentic hadith connect belief with prayer, supplication, and daily conduct.',
    hub: { label: 'Worship', kind: 'Concept', href: '/concept/worship' },
    nodes: [
      { label: 'Tawhid', kind: 'Concept', href: '/concept/tawhid' },
      { label: 'Prayer', kind: 'Concept', href: '/concept/prayer' },
      { label: 'Supplication', kind: 'Concept', href: '/concept/supplication' },
      { label: 'Al-Fatihah', kind: 'Surah', href: '/surah/fatiha' },
      { label: 'Authentic hadith', kind: 'Corpus', href: '/hadith' },
    ],
  },
];

function Cluster({ cluster }: { cluster: GraphCluster }) {
  return <article className="graph-cluster">
    <header><h3>{cluster.title}</h3><p>{cluster.description}</p></header>
    <div className="graph-cluster-map">
      <Link className="graph-hub" href={cluster.hub.href}><small>{cluster.hub.kind}</small><strong>{cluster.hub.label}</strong></Link>
      <div className="graph-branches">
        {cluster.nodes.map((node) => <Link href={node.href} key={`${cluster.title}-${node.label}`}><small>{node.kind}</small><strong>{node.label}</strong></Link>)}
      </div>
    </div>
  </article>;
}

export function KnowledgeGraphExplorer({ compact = false }: { compact?: boolean }) {
  const visibleClusters = compact ? clusters.slice(0, 1) : clusters;
  return <section className={`knowledge-explorer static${compact ? ' compact' : ''}`} aria-labelledby="knowledge-explorer-title">
    <div className="knowledge-explorer-copy"><span className="reader-overline">Knowledge graph</span><h2 id="knowledge-explorer-title">Follow the links without losing the source.</h2><p>Each map is fixed, readable, and responsive. Every box opens the article represented by that connection.</p>{compact ? <Link href="/graph">Open the complete graph <span aria-hidden="true">→</span></Link> : null}</div>
    <div className="graph-cluster-list">{visibleClusters.map((cluster) => <Cluster cluster={cluster} key={cluster.title} />)}</div>
  </section>;
}
