import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { profile } from '../data/profile';
import { profileEs } from '../data/profile.es';
import { STRINGS } from './strings';
import { LanguageContext } from './LanguageContext';
import type { Lang, LanguageState } from './LanguageContext';

const KEY = 'portfolio-lang';

// Saved choice first, then ?lang=es in the URL, then the browser's language.
function initialLang(): Lang {
  const param = new URLSearchParams(window.location.search).get('lang');
  if (param === 'es' || param === 'en') return param;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'es' || saved === 'en') return saved;
  } catch {
    // Storage blocked.
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // The choice lasts for this visit only.
    }
  }, []);

  const value = useMemo<LanguageState>(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang(lang === 'en' ? 'es' : 'en'),
      t: STRINGS[lang],
      profile: lang === 'es' ? profileEs : profile,
    }),
    [lang, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
