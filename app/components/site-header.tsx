import Link from 'next/link';
import { ThemeToggle } from '@/app/components/theme-toggle';
import { LanguageToggle } from '@/app/components/language-toggle';
import { navigation } from '@/lib/locale';
import { getLocale } from '@/lib/server-locale';

export async function SiteHeader() {
  const locale = await getLocale();
  const links = navigation[locale];
  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="IslamWiki home page">
        <span className="brand-copy"><strong>IslamWiki</strong></span>
      </Link>

      <nav className="main-nav" aria-label={locale === 'tr' ? 'Ana menü' : 'Main navigation'}>
        {links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
      </nav>

      <div className="header-actions">
        <details className="mobile-menu">
          <summary aria-label={locale === 'tr' ? 'Menüyü aç' : 'Open menu'}><span /><span /><span /></summary>
          <nav aria-label={locale === 'tr' ? 'Mobil menü' : 'Mobile navigation'}>
            {links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          </nav>
        </details>
        <LanguageToggle locale={locale} />
        <ThemeToggle />
      </div>
    </header>
  );
}
