import React, { useEffect } from 'react';
import { getMyPreferences } from '@/services/profile.service';

function applyTheme(theme: 'light'|'dark'|'auto'|undefined) {
  const root = typeof document !== 'undefined' ? document.documentElement : null;
  if (!root) return;

  const setLight = () => {
    root.style.setProperty('--color-background', '#FFFFFF');
    root.style.setProperty('--color-foreground', '#1A1A1A');
    root.style.setProperty('--color-border', '#E5E5E5');
  };
  const setDark = () => {
    root.style.setProperty('--color-background', '#0A0A0A');
    root.style.setProperty('--color-foreground', '#EDEDED');
    root.style.setProperty('--color-border', '#374151');
  };

  if (theme === 'auto') {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => (mq.matches ? setDark() : setLight());
    handler();
    // attach listener once for auto mode
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }

  if (theme === 'dark') setDark();
  else setLight();
  return undefined;
}

function applyLanguage(language: 'vi'|'en'|'zh'|undefined) {
  const root = typeof document !== 'undefined' ? document.documentElement : null;
  if (!root) return;
  if (language) root.lang = language;
}

const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      try {
        const prefs = await getMyPreferences();
        cleanup = applyTheme(prefs?.theme as any) || cleanup;
        applyLanguage(prefs?.language as any);
      } catch {
        // ignore
      }
    })();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return <>{children}</>;
};

export default ThemeLanguageProvider;
export { applyTheme, applyLanguage };
