import 'server-only';
import { getAllHadithsForLocale, getHadithCategoriesForLocale, getThemesForHadithLocale } from '@/lib/hadith';
import type { Locale } from '@/lib/locale';

export interface HadithDirectoryRecord {
  id: string;
  title: string;
  attribution: string;
  grade: string;
  categories: string;
  themes: string[];
}

const themeTranslations = new Map<string, string>([
  ['Worship & devotion','İbadet'], ['Character & manners','Ahlak ve edep'], ['Family & home','Aile ve ev'],
  ['Companions & community','Sahabe ve toplum'], ['Neighbors & society','Komşuluk ve toplum'],
  ['Knowledge & teaching','İlim ve eğitim'], ['Governance & justice','Yönetim ve adalet'],
  ['Peace & agreements','Barış ve antlaşmalar'], ['War & defense','Savaş ve savunma'],
  ['Trade & wealth','Ticaret ve mal'], ['Food, health & daily life','Yeme, sağlık ve günlük hayat'],
  ['Hereafter & spiritual life','Ahiret ve manevi hayat'], ['General guidance','Genel rehberlik'],
]);

export function translateHadithTheme(theme: string, locale: Locale) {
  return locale === 'tr' ? (themeTranslations.get(theme) ?? theme) : theme;
}

export function getHadithDirectoryRecords(locale: Locale): HadithDirectoryRecord[] {
  const categoryNames = new Map(getHadithCategoriesForLocale(locale).map((category) => [category.id, category.title]));
  return getAllHadithsForLocale(locale).map((record) => ({
    id: record.id,
    title: record.title,
    attribution: record.attribution,
    grade: record.grade,
    categories: record.categories.flatMap((id) => categoryNames.get(id) ?? []).join(' · '),
    themes: getThemesForHadithLocale(record, locale).map((theme) => translateHadithTheme(theme, locale)),
  }));
}

export function getHadithThemeLabels(locale: Locale, themes: readonly string[]) {
  return themes.map((theme) => translateHadithTheme(theme, locale));
}

export function normalizeHadithSearch(value: string) {
  return value.normalize('NFKD').replace(/[’'`]/gu, '').toLocaleLowerCase('en-US').replace(/\s+/gu, ' ').trim();
}
