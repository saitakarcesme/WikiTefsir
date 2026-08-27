import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="WikiTefsir ana sayfa">
        <span className="brand-mark" aria-hidden="true">و</span>
        <span>Wiki<span>Tefsir</span></span>
      </Link>

      <nav className="main-nav" aria-label="Ana menü">
        <Link href="/#kesfet">Keşfet</Link>
        <Link href="/sureler">Sureler</Link>
        <Link href="/hadis">Hadisler</Link>
        <Link href="/alim/taberi">Âlimler</Link>
      </nav>

      <div className="header-actions">
        <Link className="icon-button" href="/#arama" aria-label="Arama sayfasına git">⌕</Link>
        <Link className="plain-button" href="/#metodoloji">Metodoloji</Link>
      </div>
    </header>
  );
}
