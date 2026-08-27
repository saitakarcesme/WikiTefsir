export interface ConceptRecord {
  slug: string;
  title: string;
  arabic: string;
  scope: string;
  verseRefs: Array<{ surah: number; ayah: number }>;
  related: string[];
}

const concepts: ConceptRecord[] = [
  { slug: 'tevhid', title: 'Tevhid', arabic: 'التوحيد', scope: 'Allah’ın birliğiyle ilgili kaynak kayıtları', verseRefs: [{ surah: 2, ayah: 255 }, { surah: 112, ayah: 1 }, { surah: 112, ayah: 4 }], related: ['ibadet', 'vahiy', 'nubuvvet'] },
  { slug: 'ibadet', title: 'İbadet', arabic: 'العبادة', scope: 'Kulluk ve ibadetle ilgili kaynak kayıtları', verseRefs: [{ surah: 1, ayah: 5 }, { surah: 51, ayah: 56 }], related: ['tevhid', 'dua', 'hidayet'] },
  { slug: 'dua', title: 'Dua', arabic: 'الدعاء', scope: 'Dua ve Allah’tan istemeyle ilgili kaynak kayıtları', verseRefs: [{ surah: 1, ayah: 5 }, { surah: 2, ayah: 186 }], related: ['ibadet', 'rahmet', 'hidayet'] },
  { slug: 'hidayet', title: 'Hidayet', arabic: 'الهداية', scope: 'Doğru yol ve hidayetle ilgili kaynak kayıtları', verseRefs: [{ surah: 1, ayah: 6 }, { surah: 2, ayah: 2 }], related: ['dua', 'vahiy', 'ibadet'] },
  { slug: 'rahmet', title: 'Rahmet', arabic: 'الرحمة', scope: 'Rahmet kavramıyla ilgili kaynak kayıtları', verseRefs: [{ surah: 1, ayah: 1 }, { surah: 7, ayah: 156 }], related: ['dua', 'ahiret', 'hidayet'] },
  { slug: 'ahiret', title: 'Âhiret', arabic: 'الآخرة', scope: 'Âhiret ve hesap günüyle ilgili kaynak kayıtları', verseRefs: [{ surah: 1, ayah: 4 }, { surah: 2, ayah: 4 }], related: ['rahmet', 'ibadet', 'hidayet'] },
  { slug: 'vahiy', title: 'Vahiy', arabic: 'الوحي', scope: 'Vahyin gelişiyle ilgili kaynak kayıtları', verseRefs: [{ surah: 42, ayah: 51 }, { surah: 53, ayah: 3 }, { surah: 53, ayah: 4 }], related: ['nubuvvet', 'hidayet', 'tevhid'] },
  { slug: 'nubuvvet', title: 'Nübüvvet', arabic: 'النبوة', scope: 'Peygamberlik ve resullerle ilgili kaynak kayıtları', verseRefs: [{ surah: 4, ayah: 165 }, { surah: 33, ayah: 40 }], related: ['vahiy', 'tevhid', 'hidayet'] },
];

const conceptsBySlug = new Map(concepts.map((concept) => [concept.slug, concept]));
const verseConcepts = new Map<string, string[]>([
  ['1:1', ['rahmet']],
  ['1:4', ['ahiret']],
  ['1:5', ['ibadet', 'dua', 'tevhid']],
  ['1:6', ['hidayet', 'dua']],
  ['2:2', ['hidayet', 'vahiy']],
  ['2:4', ['ahiret', 'vahiy']],
  ['2:186', ['dua', 'rahmet']],
  ['2:255', ['tevhid']],
  ['4:165', ['nubuvvet', 'vahiy']],
  ['7:156', ['rahmet']],
  ['33:40', ['nubuvvet']],
  ['42:51', ['vahiy']],
  ['51:56', ['ibadet']],
  ['53:3', ['vahiy', 'nubuvvet']],
  ['53:4', ['vahiy', 'nubuvvet']],
  ['112:1', ['tevhid']],
  ['112:4', ['tevhid']],
]);

export function getAllConcepts() {
  return concepts;
}

export function getConceptBySlug(slug: string) {
  return conceptsBySlug.get(slug);
}

export function getConceptHref(concept: Pick<ConceptRecord, 'slug'>) {
  return `/kavram/${concept.slug}`;
}

export function getConceptsForVerse(surah: number, ayah: number) {
  return (verseConcepts.get(`${surah}:${ayah}`) ?? []).flatMap((slug) => {
    const concept = conceptsBySlug.get(slug);
    return concept ? [concept] : [];
  });
}
