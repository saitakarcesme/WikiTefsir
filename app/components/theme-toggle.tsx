'use client';

import { useEffect, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

export function ThemeToggle() {
  useEffect(() => {
    const savedTheme = window.localStorage.getItem('wikitafsir-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      document.documentElement.dataset.theme = savedTheme;
      window.dispatchEvent(new Event('wikitafsir-theme'));
    }
  }, []);

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
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
      {theme === 'light'
        ? <path d="M12 3a9 9 0 1 0 9 9c0-.5-.04-1-.12-1.48A7 7 0 0 1 12 3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        : <><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></>}
    </svg>
  </button>;
}
