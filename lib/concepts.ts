export interface ConceptRecord {
  slug: string;
  title: string;
  arabic: string;
  scope: string;
  verseRefs: Array<{ surah: number; ayah: number }>;
  related: string[];
}

const concepts: ConceptRecord[] = [
  { slug: 'tawhid', title: 'Tawhid', arabic: 'التوحيد', scope: 'Source records concerning the oneness of Allah', verseRefs: [{ surah: 2, ayah: 255 }, { surah: 112, ayah: 1 }, { surah: 112, ayah: 4 }], related: ['worship', 'revelation', 'prophethood'] },
  { slug: 'worship', title: 'Worship', arabic: 'العبادة', scope: 'Source records concerning worship and servitude to Allah', verseRefs: [{ surah: 1, ayah: 5 }, { surah: 51, ayah: 56 }], related: ['tawhid', 'supplication', 'guidance'] },
  { slug: 'supplication', title: 'Supplication', arabic: 'الدعاء', scope: 'Source records concerning supplication and asking Allah', verseRefs: [{ surah: 1, ayah: 5 }, { surah: 2, ayah: 186 }], related: ['worship', 'mercy', 'guidance'] },
  { slug: 'guidance', title: 'Guidance', arabic: 'الهداية', scope: 'Source records concerning guidance and the straight path', verseRefs: [{ surah: 1, ayah: 6 }, { surah: 2, ayah: 2 }], related: ['supplication', 'revelation', 'worship'] },
  { slug: 'mercy', title: 'Mercy', arabic: 'الرحمة', scope: 'Source records concerning mercy', verseRefs: [{ surah: 1, ayah: 1 }, { surah: 7, ayah: 156 }], related: ['supplication', 'hereafter', 'guidance'] },
  { slug: 'hereafter', title: 'Hereafter', arabic: 'الآخرة', scope: 'Source records concerning the Hereafter and the Day of Judgment', verseRefs: [{ surah: 1, ayah: 4 }, { surah: 2, ayah: 4 }], related: ['mercy', 'worship', 'guidance'] },
  { slug: 'revelation', title: 'Revelation', arabic: 'الوحي', scope: 'Source records concerning divine revelation', verseRefs: [{ surah: 42, ayah: 51 }, { surah: 53, ayah: 3 }, { surah: 53, ayah: 4 }], related: ['prophethood', 'guidance', 'tawhid'] },
  { slug: 'prophethood', title: 'Prophethood', arabic: 'النبوة', scope: 'Source records concerning prophets and messengers', verseRefs: [{ surah: 4, ayah: 165 }, { surah: 33, ayah: 40 }], related: ['revelation', 'tawhid', 'guidance'] },
];

const conceptsBySlug = new Map(concepts.map((concept) => [concept.slug, concept]));
const verseConcepts = new Map<string, string[]>([
  ['1:1', ['mercy']],
  ['1:4', ['hereafter']],
  ['1:5', ['worship', 'supplication', 'tawhid']],
  ['1:6', ['guidance', 'supplication']],
  ['2:2', ['guidance', 'revelation']],
  ['2:4', ['hereafter', 'revelation']],
  ['2:186', ['supplication', 'mercy']],
  ['2:255', ['tawhid']],
  ['4:165', ['prophethood', 'revelation']],
  ['7:156', ['mercy']],
  ['33:40', ['prophethood']],
  ['42:51', ['revelation']],
  ['51:56', ['worship']],
  ['53:3', ['revelation', 'prophethood']],
  ['53:4', ['revelation', 'prophethood']],
  ['112:1', ['tawhid']],
  ['112:4', ['tawhid']],
]);

export function getAllConcepts() {
  return concepts;
}

export function getConceptBySlug(slug: string) {
  return conceptsBySlug.get(slug);
}

export function getConceptHref(concept: Pick<ConceptRecord, 'slug'>) {
  return `/concept/${concept.slug}`;
}

export function getConceptsForVerse(surah: number, ayah: number) {
  return (verseConcepts.get(`${surah}:${ayah}`) ?? []).flatMap((slug) => {
    const concept = conceptsBySlug.get(slug);
    return concept ? [concept] : [];
  });
}

const conceptLabelPatterns: Array<[RegExp, string]> = [
  [/\btawh[iī]d\b|oneness of allah|names and attributes/iu, 'tawhid'],
  [/\bworship\b|prayer|fasting|zak[aā]h|pilgrimage/iu, 'worship'],
  [/supplication|invocation|remembrance/iu, 'supplication'],
  [/guidance|straight path/iu, 'guidance'],
  [/mercy|compassion/iu, 'mercy'],
  [/hereafter|resurrection|paradise|hellfire/iu, 'hereafter'],
  [/revelation|qur'an|quran/iu, 'revelation'],
  [/prophethood|prophet|messenger/iu, 'prophethood'],
];

export function getConceptsForLabels(labels: string[]) {
  const text = labels.join(' ');
  const slugs = conceptLabelPatterns.flatMap(([pattern, slug]) => pattern.test(text) ? [slug] : []);
  return [...new Set(slugs)].flatMap((slug) => {
    const concept = conceptsBySlug.get(slug);
    return concept ? [concept] : [];
  });
}
