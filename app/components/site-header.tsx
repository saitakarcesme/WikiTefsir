import Link from 'next/link';
import { ThemeToggle } from '@/app/components/theme-toggle';
import { LanguageToggle } from '@/app/components/language-toggle';
import { navigation } from '@/lib/locale';
import { getLocale } from '@/lib/server-locale';

export async function SiteHeader() {
  const locale = await getLocale();
  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="WikiTefsir home page">
        <span className="brand-copy"><strong>WikiTefsir</strong></span>
      </Link>

      <nav className="main-nav" aria-label={locale === 'tr' ? 'Ana menü' : 'Main navigation'}>
        {navigation[locale].map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
      </nav>

      <div className="header-actions">
        <LanguageToggle locale={locale} />
        <ThemeToggle />
      </div>
    </header>
  );
}
