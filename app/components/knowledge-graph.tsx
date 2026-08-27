import Link from 'next/link';

const nodes = [
  { className: 'graph-node verse', label: 'Al-Fatihah 1:5', meta: 'Verse', position: 'center', href: '/surah/fatiha#verse-5' },
  { className: 'graph-node tafsir', label: 'Al-Tabari', meta: 'Tafsir', position: 'top-left', href: '/scholars/taberi' },
  { className: 'graph-node tafsir', label: 'Ibn Kathir', meta: 'Tafsir', position: 'bottom-left', href: '/scholars/ibn-kesir' },
  { className: 'graph-node tafsir', label: 'Al-Qurtubi', meta: 'Tafsir', position: 'top-right', href: '/scholars/kurtubi' },
  { className: 'graph-node concept', label: 'Worship', meta: 'Concept', position: 'bottom-right', href: '/concept/worship' },
];

export function KnowledgeGraph() {
  return (
    <section className="graph-section" id="relationships" aria-labelledby="graph-title">
      <div className="graph-copy">
        <span className="section-kicker">Knowledge map</span>
        <h2 id="graph-title">From one verse to every source.</h2>
        <p>
          See the scholarly connections between verses, hadiths, tafsirs, concepts and people
          at a glance. Every line represents a verifiable source relationship.
        </p>
        <ul>
          <li><span className="legend-dot green" /> Verses and surahs</li>
          <li><span className="legend-dot amber" /> Classical tafsirs</li>
          <li><span className="legend-dot blue" /> Concept articles</li>
        </ul>
        <Link className="graph-link" href="/surah/fatiha#verse-5">Explore the sample verse <span>→</span></Link>
      </div>

      <div className="graph-stage" role="img" aria-label="Relationships between Al-Fatihah 1:5, tafsirs and concepts">
        <span className="connector line-one" aria-hidden="true" />
        <span className="connector line-two" aria-hidden="true" />
        <span className="connector line-three" aria-hidden="true" />
        <span className="connector line-four" aria-hidden="true" />
        {nodes.map((node) => (
          <Link className={`${node.className} ${node.position}`} href={node.href} key={`${node.meta}-${node.label}`}>
            <small>{node.meta}</small>
            <strong>{node.label}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
