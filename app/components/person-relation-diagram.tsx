import Link from 'next/link';
import type { PersonRecord } from '@/lib/people';
import { getSurahByNumber, getSurahHref } from '@/lib/quran';

export function PersonRelationDiagram({ person }: { person: PersonRecord }) {
  const surah = getSurahByNumber(person.keyReferences[0].surah);
  return <section className="person-diagram" aria-labelledby="person-diagram-title">
    <div><span className="reader-overline">Relationship diagram</span><h2 id="person-diagram-title">How this article connects</h2></div>
    <div className="person-diagram-stage">
      <Link className="diagram-card diagram-story" href="#timeline-title"><small>Story</small><strong>{person.narrative.length} stages</strong></Link>
      <span className="diagram-line diagram-line-left" aria-hidden="true" />
      <div className="person-diagram-center"><small>{person.kind}</small><strong>{person.name}</strong></div>
      <span className="diagram-line diagram-line-right" aria-hidden="true" />
      {surah ? <Link className="diagram-card diagram-surah" href={getSurahHref(surah)}><small>Key surah</small><strong>{surah.nameTransliterated}</strong></Link> : null}
      <span className="diagram-line diagram-line-top" aria-hidden="true" />
      <Link className="diagram-card diagram-concept" href={`/concept/${person.concepts[0]}`}><small>Concept</small><strong>{person.concepts[0]}</strong></Link>
    </div>
  </section>;
}
