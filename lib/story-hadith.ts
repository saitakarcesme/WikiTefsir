import { getHadithByIdForLocale } from '@/lib/hadith';
import type { Locale } from '@/lib/locale';

const storyHadiths: Record<string, Array<{ id: string; image: string }>> = {
  adam: [{ id: '3556', image: '/stories/adam/hadith-greeting.webp' }],
  nuh: [{ id: '3421', image: '/stories/nuh/hadith-pious-names.webp' }],
  ibrahim: [{ id: '3347', image: '/stories/ibrahim/hadith-friend.webp' }],
};

export function getStoryHadiths(slug: string, locale: Locale) {
  return (storyHadiths[slug] ?? []).flatMap(({ id, image }) => {
    const record = getHadithByIdForLocale(id, locale);
    return record ? [{ record, image }] : [];
  });
}
