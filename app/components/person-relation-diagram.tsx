import Link from 'next/link';
import type { PersonRecord } from '@/lib/people';
import { getSurahByNumber, getSurahHref } from '@/lib/quran';
import type { Locale } from '@/lib/locale';
import { getPersonKind, getPersonName } from '@/lib/person-locale';

export function PersonRelationDiagram({ person, locale = 'en' }: { person: PersonRecord; locale?: Locale }) {
  const tr = locale === 'tr';
  const surah = getSurahByNumber(person.keyReferences[0].surah);
  const firstStage = person.narrative[0];
  const lastStage = person.narrative.at(-1);
  return <section className="person-diagram" aria-labelledby="person-diagram-title">
    <div><span className="reader-overline">{tr ? 'Bağlantı diyagramı' : 'Relationship diagram'}</span><h2 id="person-diagram-title">{tr ? 'Bu makalenin bağlantıları' : 'How this article connects'}</h2></div>
    <div className="person-diagram-stage">
      <div className="person-diagram-center"><small>{getPersonKind(person, locale)}</small><strong>{getPersonName(person, locale)}</strong></div>
      <span className="diagram-trunk" aria-hidden="true" />
      <div className="diagram-branch-row">
        <Link className="diagram-card diagram-concept" href={`/concept/${person.concepts[0]}`}><small>{tr ? 'Ana kavram' : 'Core concept'}</small><strong>{person.concepts[0]}</strong></Link>
        {surah ? <Link className="diagram-card diagram-surah" href={getSurahHref(surah)}><small>{tr ? 'Ana sure' : 'Key surah'}</small><strong>{surah.nameTransliterated}</strong></Link> : null}
        <Link className="diagram-card diagram-story" href="#timeline-title"><small>{tr ? 'Okuma yolu' : 'Reading path'}</small><strong>{person.narrative.length} {tr ? 'aşama' : 'stages'}</strong></Link>
      </div>
      <span className="diagram-trunk" aria-hidden="true" />
      <div className="diagram-story-span">
        <Link href={`#${firstStage.id}`}><small>{tr ? 'Başlangıç' : 'Begins'}</small><strong>{tr ? 'İlk ayet grubu' : firstStage.title}</strong></Link>
        {lastStage && lastStage.id !== firstStage.id ? <Link href={`#${lastStage.id}`}><small>{tr ? 'Sonuç' : 'Concludes'}</small><strong>{tr ? 'Son ayet grubu' : lastStage.title}</strong></Link> : null}
      </div>
    </div>
  </section>;
}
