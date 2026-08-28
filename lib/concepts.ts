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
  { slug: 'divine-names', title: 'Divine names and attributes', arabic: 'الأسماء والصفات', scope: 'Verses naming and describing Allah', verseRefs: [{ surah: 7, ayah: 180 }, { surah: 59, ayah: 22 }, { surah: 59, ayah: 24 }], related: ['tawhid', 'mercy', 'creation'] },
  { slug: 'faith', title: 'Faith', arabic: 'الإيمان', scope: 'Belief in Allah and what He revealed', verseRefs: [{ surah: 2, ayah: 285 }, { surah: 49, ayah: 15 }], related: ['tawhid', 'revelation', 'hereafter'] },
  { slug: 'worship', title: 'Worship', arabic: 'العبادة', scope: 'Source records concerning worship and servitude to Allah', verseRefs: [{ surah: 1, ayah: 5 }, { surah: 51, ayah: 56 }], related: ['tawhid', 'supplication', 'guidance'] },
  { slug: 'prayer', title: 'Prayer', arabic: 'الصلاة', scope: 'The establishment and purpose of prayer', verseRefs: [{ surah: 2, ayah: 43 }, { surah: 29, ayah: 45 }], related: ['worship', 'supplication', 'patience'] },
  { slug: 'zakat', title: 'Zakat and charity', arabic: 'الزكاة والصدقة', scope: 'Obligatory almsgiving and voluntary charity', verseRefs: [{ surah: 2, ayah: 43 }, { surah: 9, ayah: 60 }], related: ['worship', 'justice', 'community'] },
  { slug: 'fasting', title: 'Fasting', arabic: 'الصيام', scope: 'Fasting, Ramadan and spiritual discipline', verseRefs: [{ surah: 2, ayah: 183 }, { surah: 2, ayah: 185 }], related: ['worship', 'patience', 'gratitude'] },
  { slug: 'pilgrimage', title: 'Pilgrimage', arabic: 'الحج', scope: 'Hajj, its rites and the Sacred House', verseRefs: [{ surah: 2, ayah: 196 }, { surah: 3, ayah: 97 }], related: ['worship', 'community', 'prophethood'] },
  { slug: 'supplication', title: 'Supplication', arabic: 'الدعاء', scope: 'Source records concerning supplication and asking Allah', verseRefs: [{ surah: 1, ayah: 5 }, { surah: 2, ayah: 186 }], related: ['worship', 'mercy', 'guidance'] },
  { slug: 'guidance', title: 'Guidance', arabic: 'الهداية', scope: 'Source records concerning guidance and the straight path', verseRefs: [{ surah: 1, ayah: 6 }, { surah: 2, ayah: 2 }], related: ['supplication', 'revelation', 'worship'] },
  { slug: 'mercy', title: 'Mercy', arabic: 'الرحمة', scope: 'Source records concerning mercy', verseRefs: [{ surah: 1, ayah: 1 }, { surah: 7, ayah: 156 }], related: ['supplication', 'hereafter', 'guidance'] },
  { slug: 'repentance', title: 'Repentance', arabic: 'التوبة', scope: 'Turning back to Allah and seeking forgiveness', verseRefs: [{ surah: 39, ayah: 53 }, { surah: 66, ayah: 8 }], related: ['mercy', 'guidance', 'hereafter'] },
  { slug: 'patience', title: 'Patience', arabic: 'الصبر', scope: 'Steadfastness through trial and obedience', verseRefs: [{ surah: 2, ayah: 153 }, { surah: 103, ayah: 3 }], related: ['prayer', 'faith', 'gratitude'] },
  { slug: 'gratitude', title: 'Gratitude', arabic: 'الشكر', scope: 'Recognizing and thanking Allah for His favors', verseRefs: [{ surah: 14, ayah: 7 }, { surah: 31, ayah: 12 }], related: ['worship', 'patience', 'creation'] },
  { slug: 'justice', title: 'Justice', arabic: 'العدل', scope: 'Upholding justice even against self-interest', verseRefs: [{ surah: 4, ayah: 135 }, { surah: 5, ayah: 8 }], related: ['community', 'ethics', 'peace'] },
  { slug: 'knowledge', title: 'Knowledge', arabic: 'العلم', scope: 'Seeking, receiving and acting upon knowledge', verseRefs: [{ surah: 20, ayah: 114 }, { surah: 39, ayah: 9 }], related: ['revelation', 'guidance', 'creation'] },
  { slug: 'family', title: 'Family', arabic: 'الأسرة', scope: 'Marriage, household responsibility and kinship', verseRefs: [{ surah: 30, ayah: 21 }, { surah: 66, ayah: 6 }], related: ['mercy', 'ethics', 'community'] },
  { slug: 'ethics', title: 'Character and ethics', arabic: 'الأخلاق', scope: 'Moral conduct in speech and action', verseRefs: [{ surah: 16, ayah: 90 }, { surah: 49, ayah: 11 }], related: ['justice', 'family', 'community'] },
  { slug: 'community', title: 'Community', arabic: 'الأمة', scope: 'Unity, reconciliation and collective responsibility', verseRefs: [{ surah: 3, ayah: 103 }, { surah: 49, ayah: 10 }], related: ['justice', 'peace', 'family'] },
  { slug: 'peace', title: 'Peace and reconciliation', arabic: 'السلم والإصلاح', scope: 'Inclining to peace and reconciling believers', verseRefs: [{ surah: 8, ayah: 61 }, { surah: 49, ayah: 9 }], related: ['justice', 'community', 'ethics'] },
  { slug: 'hereafter', title: 'Hereafter', arabic: 'الآخرة', scope: 'Source records concerning the Hereafter and the Day of Judgment', verseRefs: [{ surah: 1, ayah: 4 }, { surah: 2, ayah: 4 }], related: ['mercy', 'worship', 'guidance'] },
  { slug: 'paradise', title: 'Paradise', arabic: 'الجنة', scope: 'Descriptions and promises of Paradise', verseRefs: [{ surah: 3, ayah: 133 }, { surah: 47, ayah: 15 }], related: ['hereafter', 'mercy', 'faith'] },
  { slug: 'hellfire', title: 'Hellfire', arabic: 'النار', scope: 'Warnings and descriptions of the Fire', verseRefs: [{ surah: 4, ayah: 56 }, { surah: 67, ayah: 6 }], related: ['hereafter', 'repentance', 'justice'] },
  { slug: 'revelation', title: 'Revelation', arabic: 'الوحي', scope: 'Source records concerning divine revelation', verseRefs: [{ surah: 42, ayah: 51 }, { surah: 53, ayah: 3 }, { surah: 53, ayah: 4 }], related: ['prophethood', 'guidance', 'tawhid'] },
  { slug: 'prophethood', title: 'Prophethood', arabic: 'النبوة', scope: 'Source records concerning prophets and messengers', verseRefs: [{ surah: 4, ayah: 165 }, { surah: 33, ayah: 40 }], related: ['revelation', 'tawhid', 'guidance'] },
  { slug: 'scriptures', title: 'Revealed scriptures', arabic: 'الكتب المنزلة', scope: 'The Quran and scriptures given to earlier messengers', verseRefs: [{ surah: 2, ayah: 285 }, { surah: 5, ayah: 48 }], related: ['revelation', 'prophethood', 'faith'] },
  { slug: 'angels', title: 'Angels', arabic: 'الملائكة', scope: 'Angels and the duties assigned to them', verseRefs: [{ surah: 2, ayah: 98 }, { surah: 35, ayah: 1 }], related: ['revelation', 'faith', 'hereafter'] },
  { slug: 'jinn', title: 'Jinn', arabic: 'الجن', scope: 'The creation, hearing and moral responsibility of jinn', verseRefs: [{ surah: 72, ayah: 1 }, { surah: 72, ayah: 14 }], related: ['creation', 'revelation', 'hereafter'] },
  { slug: 'destiny', title: 'Divine decree', arabic: 'القدر', scope: 'Creation by measure and events written before they occur', verseRefs: [{ surah: 54, ayah: 49 }, { surah: 57, ayah: 22 }], related: ['faith', 'patience', 'creation'] },
  { slug: 'miracles', title: 'Signs and miracles', arabic: 'الآيات والمعجزات', scope: 'Extraordinary signs given in support of revelation', verseRefs: [{ surah: 3, ayah: 49 }, { surah: 54, ayah: 1 }], related: ['prophethood', 'revelation', 'creation'] },
  { slug: 'creation', title: 'Creation', arabic: 'الخلق', scope: 'The created heavens, earth and living beings', verseRefs: [{ surah: 21, ayah: 30 }, { surah: 51, ayah: 47 }], related: ['divine-names', 'knowledge', 'gratitude'] },
];

const conceptsBySlug = new Map(concepts.map((concept) => [concept.slug, concept]));
const verseConcepts = new Map<string, string[]>();
for (const concept of concepts) {
  for (const reference of concept.verseRefs) {
    const key = `${reference.surah}:${reference.ayah}`;
    verseConcepts.set(key, [...(verseConcepts.get(key) ?? []), concept.slug]);
  }
}

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
  [/faith|belief/iu, 'faith'],
  [/prayer|salah/iu, 'prayer'],
  [/charity|zak[aā]h/iu, 'zakat'],
  [/fasting|ramadan/iu, 'fasting'],
  [/pilgrimage|hajj/iu, 'pilgrimage'],
  [/repentance|forgiveness/iu, 'repentance'],
  [/patience|steadfast/iu, 'patience'],
  [/justice|fairness/iu, 'justice'],
  [/knowledge|learning/iu, 'knowledge'],
  [/family|marriage|parents/iu, 'family'],
  [/character|manners|ethics/iu, 'ethics'],
  [/angel/iu, 'angels'],
  [/jinn/iu, 'jinn'],
  [/paradise|garden/iu, 'paradise'],
  [/hell|fire/iu, 'hellfire'],
];

export function getConceptsForLabels(labels: string[]) {
  const text = labels.join(' ');
  const slugs = conceptLabelPatterns.flatMap(([pattern, slug]) => pattern.test(text) ? [slug] : []);
  return [...new Set(slugs)].flatMap((slug) => {
    const concept = conceptsBySlug.get(slug);
    return concept ? [concept] : [];
  });
}
