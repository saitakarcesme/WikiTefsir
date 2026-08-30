'use client';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/locale';
export function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const next = locale === 'en' ? 'tr' : 'en';
  const label = locale === 'en' ? 'Türkçeye geç' : 'Switch to English';
  return <button className="language-toggle" type="button" aria-label={label} title={label} onClick={() => {
    document.cookie = `islamwiki-language=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    localStorage.setItem('islamwiki-language', next);
    document.documentElement.lang = next;
    router.refresh();
  }}><span aria-hidden="true">{next.toLocaleUpperCase('en-US')}</span></button>;
}
