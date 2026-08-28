'use client';

import { useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    (notify) => { window.addEventListener('wikitafsir-theme', notify); return () => window.removeEventListener('wikitafsir-theme', notify); },
    () => document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light',
    () => 'light' as Theme,
  );

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem('wikitafsir-theme', next);
    window.dispatchEvent(new Event('wikitafsir-theme'));
  }

  return <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Use ${theme === 'light' ? 'dark' : 'light'} theme`} title={`Use ${theme === 'light' ? 'dark' : 'light'} theme`}>
    <span aria-hidden="true">{theme === 'light' ? '◐' : '◑'}</span><span className="theme-toggle-label">{theme === 'light' ? 'Dark' : 'Light'}</span>
  </button>;
}
