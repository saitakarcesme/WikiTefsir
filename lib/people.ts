export interface QuranReference {
  surah: number;
  ayah: number;
}

export interface NarrativeStage {
  id: string;
  title: string;
  summary: string;
  references: QuranReference[];
}

export interface PersonRecord {
  slug: string;
  name: string;
  arabic: string;
  role: string;
  introduction: string;
  quranScope: string;
  concepts: string[];
  keyReferences: QuranReference[];
  narrative: NarrativeStage[];
  closingNote: string;
}

const people: PersonRecord[] = [
  {
    slug: 'musa',
    name: 'Moses',
    arabic: 'موسى',
    role: 'Prophet and messenger',
    introduction: 'A Quran-first reading path through the life and mission of Moses, assembled across the surahs in narrative order.',
    quranScope: 'The order below follows events explicitly described by the Quran. It is a reading sequence, not a claim that the surahs themselves were revealed in this order.',
    concepts: ['prophethood', 'revelation', 'guidance', 'worship'],
    keyReferences: [{ surah: 28, ayah: 7 }, { surah: 20, ayah: 41 }, { surah: 26, ayah: 63 }, { surah: 18, ayah: 60 }],
    narrative: [
      { id: 'infancy', title: 'Infancy and protection', summary: 'His mother is inspired to nurse him, place him in the river when afraid, and trust the promise of his return.', references: [{ surah: 28, ayah: 7 }, { surah: 28, ayah: 13 }, { surah: 20, ayah: 38 }] },
      { id: 'maturity', title: 'Maturity, the accidental killing, and repentance', summary: 'Moses reaches maturity, intervenes in a conflict, recognizes his error, and asks Allah for forgiveness.', references: [{ surah: 28, ayah: 14 }, { surah: 28, ayah: 16 }, { surah: 28, ayah: 17 }] },
      { id: 'midian', title: 'Flight to Midian', summary: 'Warned of a plot against him, he leaves the city, reaches Midian, helps two women at the well, and enters a period of safety and work.', references: [{ surah: 28, ayah: 20 }, { surah: 28, ayah: 22 }, { surah: 28, ayah: 24 }, { surah: 28, ayah: 27 }] },
      { id: 'calling', title: 'The call and the mission', summary: 'On his return journey, Moses sees a fire, is called, receives signs, and is sent with Aaron to Pharaoh.', references: [{ surah: 28, ayah: 29 }, { surah: 20, ayah: 11 }, { surah: 20, ayah: 24 }, { surah: 20, ayah: 42 }] },
      { id: 'pharaoh', title: 'Before Pharaoh and the magicians', summary: 'Moses delivers the message, the signs are challenged, and the magicians recognize the truth after the public encounter.', references: [{ surah: 20, ayah: 49 }, { surah: 20, ayah: 69 }, { surah: 20, ayah: 70 }, { surah: 26, ayah: 46 }] },
      { id: 'exodus', title: 'The exodus and the sea', summary: 'Moses is commanded to depart by night. The sea is parted, the believers cross, and Pharaoh’s forces are overwhelmed.', references: [{ surah: 20, ayah: 77 }, { surah: 26, ayah: 52 }, { surah: 26, ayah: 63 }, { surah: 26, ayah: 66 }] },
      { id: 'sinai', title: 'Sinai, covenant, and the calf', summary: 'Moses receives the appointed nights and the tablets, while his people are tested by the calf during his absence.', references: [{ surah: 7, ayah: 142 }, { surah: 7, ayah: 145 }, { surah: 20, ayah: 85 }, { surah: 20, ayah: 97 }] },
      { id: 'journey', title: 'The journey in search of knowledge', summary: 'Moses travels with his young companion and meets a servant of Allah from whom he asks to learn.', references: [{ surah: 18, ayah: 60 }, { surah: 18, ayah: 66 }, { surah: 18, ayah: 82 }] },
    ],
    closingNote: 'The Quran does not narrate the death of Moses. WikiTefsir therefore ends this Quran-only sequence without inventing a final-life event.',
  },
  {
    slug: 'muhammad',
    name: 'Muhammad',
    arabic: 'محمد',
    role: 'Prophet and final messenger',
    introduction: 'A source-led article connecting the Quran’s explicit references to Muhammad with revelation, mission, character, and community.',
    quranScope: 'This page does not replace a full seerah. Its sequence is limited to events and descriptions stated in the Quran; hadith-based chronology will be added only after source-level editorial alignment.',
    concepts: ['prophethood', 'revelation', 'guidance', 'mercy'],
    keyReferences: [{ surah: 3, ayah: 144 }, { surah: 33, ayah: 40 }, { surah: 47, ayah: 2 }, { surah: 48, ayah: 29 }],
    narrative: [
      { id: 'revelation', title: 'Revelation and recitation', summary: 'The Quran describes revelation sent to the Prophet and commands him to recite what has been revealed.', references: [{ surah: 47, ayah: 2 }, { surah: 29, ayah: 45 }, { surah: 53, ayah: 3 }, { surah: 53, ayah: 4 }] },
      { id: 'messenger', title: 'Messenger, not an object of worship', summary: 'Muhammad is identified as a messenger, and believers are reminded that the message does not depend on any human life.', references: [{ surah: 3, ayah: 144 }, { surah: 18, ayah: 110 }] },
      { id: 'finality', title: 'The seal of the prophets', summary: 'The Quran names Muhammad as the Messenger of Allah and the seal of the prophets.', references: [{ surah: 33, ayah: 40 }] },
      { id: 'character', title: 'Character and mercy', summary: 'The Prophet is described as being of outstanding character and as a mercy to the worlds.', references: [{ surah: 68, ayah: 4 }, { surah: 21, ayah: 107 }] },
      { id: 'community', title: 'The Messenger and the believers with him', summary: 'The Quran describes Muhammad and those with him through worship, resolve, and mutual mercy.', references: [{ surah: 48, ayah: 29 }] },
    ],
    closingNote: 'A fuller chronology requires carefully aligned authentic hadith and seerah sources. Until that layer is verified, this article deliberately stays within explicit Quran records.',
  },
];

const peopleBySlug = new Map(people.map((person) => [person.slug, person]));

export function getAllPeople() { return people; }
export function getPersonBySlug(slug: string) { return peopleBySlug.get(slug); }
export function getPersonHref(person: Pick<PersonRecord, 'slug'>) { return `/person/${person.slug}`; }

export function getPeopleForVerse(surah: number, ayah: number) {
  return people.filter((person) => person.keyReferences.some((reference) => reference.surah === surah && reference.ayah === ayah)
    || person.narrative.some((stage) => stage.references.some((reference) => reference.surah === surah && reference.ayah === ayah)));
}
