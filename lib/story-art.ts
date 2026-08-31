import { galleryImageById } from '@/lib/gallery-images';
import { galleryScenes, type GalleryScene } from '@/lib/gallery-scenes';
import type { QuranReference } from '@/lib/people';

export type StoryArtwork = GalleryScene & {
  image: string;
  sourceReference: QuranReference;
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

export function getStoryArtwork(slug: string, references: QuranReference[], stageIndex: number): StoryArtwork | undefined {
  const matched = galleryScenes.find((scene) => {
    if (scene.kind !== 'Quran' || !galleryImageById[scene.id]) return false;
    const range = parseQuranSource(scene.source);
    return range && references.some((reference) => reference.surah === range.surah && reference.ayah >= range.start && reference.ayah <= range.end);
  });
  const fallbackIds = fallbacks[slug] ?? [];
  const fallback = galleryScenes.find((scene) => scene.id === fallbackIds[stageIndex % Math.max(1, fallbackIds.length)]);
  const scene = matched ?? fallback;
  if (!scene) return undefined;
  const range = parseQuranSource(scene.source);
  const sourceReference = range ? { surah: range.surah, ayah: range.start } : references[0];
  const image = scene.image ?? galleryImageById[scene.id];
  return image && sourceReference ? { ...scene, image, sourceReference } : undefined;
}
