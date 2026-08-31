import Link from 'next/link';
import { ThemeToggle } from '@/app/components/theme-toggle';
import { LanguageToggle } from '@/app/components/language-toggle';
import { SiteNavigation } from '@/app/components/site-navigation';
import { navigation } from '@/lib/locale';
import { getLocale } from '@/lib/server-locale';

export async function SiteHeader() {
  const locale = await getLocale();
  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="IslamWiki home page">
        <span className="brand-copy"><strong>IslamWiki</strong></span>
      </Link>

      <SiteNavigation items={navigation[locale]} locale={locale} />

      <div className="header-actions">
        <LanguageToggle locale={locale} />
        <ThemeToggle />
      </div>
    </header>
  );
}
