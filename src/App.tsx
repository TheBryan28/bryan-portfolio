import { Suspense, lazy, useEffect, useState } from 'react';
import { ModernSite } from './modern/ModernSite';

// The retro desktop is loaded only when someone opens it. If its chunk is gone
// (an old tab after a new deploy), reload once instead of showing a blank page.
const RetroDesktop = lazy(() =>
  import('./retro/RetroDesktop').catch((err) => {
    try {
      if (!sessionStorage.getItem('retro-reloaded')) {
        sessionStorage.setItem('retro-reloaded', '1');
        window.location.reload();
        return new Promise<never>(() => {});
      }
    } catch {
      // Storage blocked: fall through to the error.
    }
    throw err;
  }),
);

type Mode = 'modern' | 'retro';
const STORAGE_KEY = 'portfolio-view';

function initialMode(): Mode {
  if (window.location.hash === '#retro') return 'retro';
  try {
    return localStorage.getItem(STORAGE_KEY) === 'retro' ? 'retro' : 'modern';
  } catch {
    return 'modern';
  }
}

export default function App() {
  const [mode, setMode] = useState<Mode>(initialMode);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Private windows can block storage; the view still works.
    }
    if (mode === 'retro' && window.location.hash !== '#retro') history.replaceState(null, '', '#retro');
    if (mode === 'modern' && window.location.hash === '#retro') history.replaceState(null, '', window.location.pathname);
    document.title = mode === 'retro' ? 'BryanOS · Bryan Cruz' : 'Bryan Cruz · Full-Stack AI Engineer';
  }, [mode]);

  useEffect(() => {
    const onHash = () => window.location.hash === '#retro' && setMode('retro');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = (next: Mode) => {
    setMode(next);
    window.scrollTo(0, 0);
  };

  if (mode === 'retro') {
    return (
      <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#3a6ea5' }} />}>
        <RetroDesktop onModern={() => go('modern')} />
      </Suspense>
    );
  }
  return <ModernSite onRetro={() => go('retro')} />;
}
