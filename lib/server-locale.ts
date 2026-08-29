import 'server-only';
import { cookies } from 'next/headers';
import { isLocale, type Locale } from '@/lib/locale';
export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get('wikitafsir-language')?.value;
  return isLocale(value) ? value : 'en';
}
