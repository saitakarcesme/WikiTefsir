import Link from 'next/link';
import { ThemeToggle } from '@/app/components/theme-toggle';

export function SiteHeader() {
  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="WikiTefsir home page">
        <span className="brand-copy"><strong>WikiTefsir</strong></span>
      </Link>

      <nav className="main-nav" aria-label="Main navigation">
        <Link href="/">Main page</Link>
        <Link href="/surahs">Surahs</Link>
        <Link href="/hadith">Hadiths</Link>
        <Link href="/concepts">Concepts</Link>
        <Link href="/people">People</Link>
        <Link href="/scholars">Scholars</Link>
        <Link href="/graph">Graph</Link>
        <Link href="/gallery">Gallery</Link>
      </nav>

      <div className="header-actions">
        <ThemeToggle />
      </div>
    </header>
  );
}
