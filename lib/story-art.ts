import { galleryImageById } from '@/lib/gallery-images';
import { galleryScenes, type GalleryScene } from '@/lib/gallery-scenes';
import type { QuranReference } from '@/lib/people';

export type StoryArtwork = GalleryScene & {
  image: string;
  sourceReference: QuranReference;
};

const generatedStoryArt: Record<string, string> = {
  'adam:creation': '/stories/adam/creation.webp',
  'adam:garden': '/stories/adam/garden.webp',
  'adam:temptation': '/stories/adam/temptation.webp',
  'adam:repentance': '/stories/adam/repentance.webp',
  'nuh:call': '/stories/nuh/call.webp',
  'nuh:ark': '/stories/nuh/ark.webp',
  'nuh:flood': '/stories/nuh/flood.webp',
  'nuh:landing': '/stories/nuh/landing.webp',
  'ibrahim:truth': '/stories/ibrahim/truth.webp',
  'ibrahim:idols': '/stories/ibrahim/idols.webp',
  'ibrahim:migration': '/stories/ibrahim/migration.webp',
  'ibrahim:house': '/stories/ibrahim/house.webp',
  'musa:infancy': '/stories/musa/infancy.webp',
  'musa:maturity': '/stories/musa/maturity.webp',
  'musa:midian': '/stories/musa/midian.webp',
  'musa:calling': '/stories/musa/calling.webp',
  'musa:pharaoh': '/stories/musa/pharaoh.webp',
  'musa:exodus': '/stories/musa/exodus.webp',
  'musa:sinai': '/stories/musa/sinai.webp',
  'musa:journey': '/stories/musa/journey.webp',
  'maryam:dedication': '/stories/maryam/dedication.webp',
  'maryam:chosen': '/stories/maryam/chosen.webp',
  'maryam:announcement': '/stories/maryam/announcement.webp',
  'maryam:birth': '/stories/maryam/birth.webp',
  'maryam:return': '/stories/maryam/return.webp',
  'yusuf:dream': '/stories/yusuf/dream.webp',
  'yusuf:well': '/stories/yusuf/well.webp',
  'yusuf:trial': '/stories/yusuf/trial.webp',
  'yusuf:vindication': '/stories/yusuf/vindication.webp',
  'yusuf:authority': '/stories/yusuf/authority.webp',
  'yusuf:reunion': '/stories/yusuf/reunion.webp',
};

const fallbacks: Record<string, number[]> = {
  hud: [11],
  shuayb: [12],
  ilyas: [13],
  'al-yasa': [102],
  'dhul-kifl': [102],
  idris: [101],
  luqman: [103],
  maryam: [64, 65, 66],
  jibril: [65, 81, 85],
};

function parseQuranSource(source: string) {
  const match = source.match(/^Quran\s+(\d+):(\d+)(?:[–-](\d+))?$/i);
  if (!match) return undefined;
  return { surah: Number(match[1]), start: Number(match[2]), end: Number(match[3] ?? match[2]) };
}

export function getStoryArtwork(slug: string, stageId: string, references: QuranReference[], stageIndex: number, usedSceneIds: ReadonlySet<number>): StoryArtwork | undefined {
  const generated = generatedStoryArt[`${slug}:${stageId}`];
  if (generated && references[0]) {
    return { id: -(stageIndex + 1), kind: 'Quran', image: generated, title: stageId.replaceAll('-', ' '), source: `Quran ${references[0].surah}:${references[0].ayah}`, brief: '', sourceReference: references[0] };
  }
  const matched = galleryScenes.find((scene) => {
    if (scene.kind !== 'Quran' || !galleryImageById[scene.id] || usedSceneIds.has(scene.id)) return false;
    const range = parseQuranSource(scene.source);
    return range && references.some((reference) => reference.surah === range.surah && reference.ayah >= range.start && reference.ayah <= range.end);
  });
  const fallbackIds = fallbacks[slug] ?? [];
  const fallback = galleryScenes.find((scene) => scene.id === fallbackIds[stageIndex % Math.max(1, fallbackIds.length)] && !usedSceneIds.has(scene.id));
  const scene = matched ?? fallback;
  if (!scene) return undefined;
  const range = parseQuranSource(scene.source);
  const sourceReference = range ? { surah: range.surah, ayah: range.start } : references[0];
  const image = scene.image ?? galleryImageById[scene.id];
  return image && sourceReference ? { ...scene, image, sourceReference } : undefined;
}
