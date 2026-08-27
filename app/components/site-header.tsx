import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="WikiTefsir ana sayfa">
        <span className="brand-mark" aria-hidden="true">و</span>
        <span className="brand-copy"><strong>WikiTefsir</strong><small>özgür İslâmî bilgi ansiklopedisi</small></span>
      </Link>

      <nav className="main-nav" aria-label="Ana menü">
        <Link href="/">Ana sayfa</Link>
        <Link href="/sureler">Sureler</Link>
        <Link href="/hadis">Hadisler</Link>
        <Link href="/kavramlar">Kavramlar</Link>
        <Link href="/alim/taberi">Âlimler</Link>
      </nav>

      <div className="header-actions">
        <Link className="header-search-link" href="/#arama"><span>WikiTefsir’de ara</span><kbd>⌕</kbd></Link>
        <Link className="plain-button" href="/#metodoloji">Kaynak politikası</Link>
      </div>
    </header>
  );
}
