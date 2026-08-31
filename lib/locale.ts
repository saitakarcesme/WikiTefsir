export const locales = ['en', 'tr'] as const;
export type Locale = typeof locales[number];
export function isLocale(value: string | undefined): value is Locale { return value === 'en' || value === 'tr'; }
export function localize<T>(locale: Locale, english: T, turkish: T): T { return locale === 'tr' ? turkish : english; }
export function localeNumber(locale: Locale) { return locale === 'tr' ? 'tr-TR' : 'en-US'; }
export const navigation = {
  en: [['Main page', '/'], ['Surahs', '/surahs'], ['Hadiths', '/hadith'], ['Concepts', '/concepts'], ['People', '/people'], ['Stories', '/stories'], ['Scholars', '/scholars'], ['Gallery', '/gallery']],
  tr: [['Ana sayfa', '/'], ['Sureler', '/surahs'], ['Hadisler', '/hadith'], ['Kavramlar', '/concepts'], ['Kişiler', '/people'], ['Kıssalar', '/stories'], ['Âlimler', '/scholars'], ['Galeri', '/gallery']],
} satisfies Record<Locale, Array<[string, string]>>;
