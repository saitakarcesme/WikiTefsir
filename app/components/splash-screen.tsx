'use client';

import { useEffect, useState } from 'react';

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const seen = window.sessionStorage.getItem('islamwiki-splash-seen') === '1';
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem('islamwiki-splash-seen', '1');
      setVisible(false);
    }, seen ? 0 : 1850);
    return () => window.clearTimeout(timer);
  }, []);
  return visible ? <div className="splash-screen" aria-hidden="true"><span>الله</span></div> : null;
}
