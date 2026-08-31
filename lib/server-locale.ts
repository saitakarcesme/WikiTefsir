import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { isLocale, type Locale } from '@/lib/locale';
export const getLocale = cache(async (): Promise<Locale> => {
  const value = (await cookies()).get('islamwiki-language')?.value;
  return isLocale(value) ? value : 'en';
});
