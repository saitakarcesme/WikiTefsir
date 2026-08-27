export function SiteHeader() {
  return (
    <header className="topbar">
      <a className="brand" href="/" aria-label="WikiTefsir ana sayfa">
        <span className="brand-mark" aria-hidden="true">و</span>
        <span>Wiki<span>Tefsir</span></span>
      </a>

      <nav className="main-nav" aria-label="Ana menü">
        <a href="/#kesfet">Keşfet</a>
        <a href="/sure/fatiha">Sureler</a>
        <a href="/hadis">Hadisler</a>
        <a href="/alim/taberi">Âlimler</a>
      </nav>

      <div className="header-actions">
        <a className="icon-button" href="/#arama" aria-label="Arama sayfasına git">⌕</a>
        <a className="plain-button" href="/#metodoloji">Metodoloji</a>
      </div>
    </header>
  );
}
