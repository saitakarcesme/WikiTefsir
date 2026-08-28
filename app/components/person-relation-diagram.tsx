import Link from 'next/link';
import type { PersonRecord } from '@/lib/people';

export function PersonRelationDiagram({ person }: { person: PersonRecord }) {
  return <section className="person-diagram" aria-labelledby="person-diagram-title">
    <div><span className="reader-overline">Relationship diagram</span><h2 id="person-diagram-title">How this article connects</h2></div>
    <div className="person-diagram-stage">
      <div className="person-diagram-center"><small>Person</small><strong>{person.name}</strong></div>
      <div className="diagram-spoke left"><span /><Link href="#timeline-title"><small>Story</small><strong>{person.narrative.length} stages</strong></Link></div>
      <div className="diagram-spoke top"><span /><Link href={`/concept/${person.concepts[0]}`}><small>Concept</small><strong>{person.concepts[0]}</strong></Link></div>
      <div className="diagram-spoke right"><span /><Link href={`/surah/${person.slug === 'musa' ? 'al-qasas' : 'al-ahzab'}`}><small>Key surah</small><strong>{person.slug === 'musa' ? 'Al-Qasas' : 'Al-Ahzab'}</strong></Link></div>
    </div>
  </section>;
}
