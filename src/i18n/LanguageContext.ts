import { createContext, useContext } from 'react';
import type { Profile } from '../data/profile';
import type { Strings } from './strings';

export type Lang = 'en' | 'es';

export interface LanguageState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: Strings;
  profile: Profile;
}

export const LanguageContext = createContext<LanguageState | null>(null);

export function useLang(): LanguageState {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider');
  return ctx;
}
