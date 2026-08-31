'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/locale';

type NavigationItem = [label: string, href: string];

export function SiteNavigation({ items, locale }: { items: NavigationItem[]; locale: Locale }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <nav ref={containerRef} className={`main-nav${open ? ' menu-open' : ''}`} aria-label={locale === 'tr' ? 'Ana menü' : 'Main navigation'}>
      <div className="nav-primary">
        {items.map(([label, href]) => <Link prefetch href={href} key={href} aria-current={isActive(href) ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>)}
      </div>
      <button className="nav-menu-toggle" type="button" aria-label={locale === 'tr' ? 'Gezinme menüsü' : 'Navigation menu'} aria-expanded={open} aria-controls="site-navigation-menu" onClick={() => setOpen((current) => !current)}>
        <span className="nav-menu-label">{locale === 'tr' ? 'Menü' : 'Menu'}</span>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 6.5h12M4 10h12M4 13.5h12" /></svg>
      </button>
      {open ? <div className="nav-menu-panel" id="site-navigation-menu">
        <div className="nav-menu-mobile-items">
          {items.map(([label, href]) => <Link prefetch href={href} key={href} aria-current={isActive(href) ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>)}
        </div>
      </div> : null}
    </nav>
  );
}
