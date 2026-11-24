import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Briefcase, FileText, FolderOpen, LogOut, Mail, Monitor, TerminalSquare, User } from 'lucide-react';
import { Flag } from '../ui/Flag';
import { Window } from './Window';
import { clampRect, openingRect } from './geometry';
import type { Rect } from './geometry';
import { ContactContent, ProfileContent, ProjectsContent, ServicesContent, TerminalContent } from './windows';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useLang } from '../i18n/LanguageContext';
import wallpaper from '../assets/wallpaper-xp.webp';
import './retro.css';

type WindowId = 'profile' | 'services' | 'projects' | 'terminal' | 'contact';

const ORDER: WindowId[] = ['profile', 'services', 'projects', 'terminal', 'contact'];

const APPS: Record<WindowId, { icon: typeof User; color: string; w: number; h: number }> = {
  profile: { icon: User, color: '#2b6cd4', w: 640, h: 540 },
  services: { icon: Briefcase, color: '#7a3fc2', w: 560, h: 520 },
  projects: { icon: FolderOpen, color: '#d39400', w: 640, h: 520 },
  terminal: { icon: TerminalSquare, color: '#262626', w: 580, h: 380 },
  contact: { icon: Mail, color: '#2e8b57', w: 400, h: 340 },
};

const glyph = (Icon: typeof User, color: string, size = 32) => (
  <span className="retro-glyph" style={{ width: size, height: size, background: color }}>
    <Icon size={Math.round(size * 0.58)} strokeWidth={2.2} aria-hidden="true" />
  </span>
);

export default function RetroDesktop({ onModern }: { onModern: () => void }) {
  const { t, lang, toggleLang, profile } = useLang();
  const isMobile = useIsMobile();
  const desktopRef = useRef<HTMLDivElement>(null);
  const booted = useRef(false);
  const [desktop, setDesktop] = useState({ w: 1024, h: 700 });
  const [open, setOpen] = useState<WindowId[]>([]);
  const [stack, setStack] = useState<WindowId[]>([]);
  const [minimized, setMinimized] = useState<Set<WindowId>>(new Set());
  const [maximized, setMaximized] = useState<Set<WindowId>>(new Set());
  const [rects, setRects] = useState<Partial<Record<WindowId, Rect>>>({});
  const [selected, setSelected] = useState<WindowId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState(() => new Date());

  const labels: Record<WindowId, string> = {
    profile: t.retroUi.profile,
    services: t.nav.services,
    projects: t.retroUi.projects,
    terminal: t.retroUi.terminal,
    contact: t.retroUi.contact,
  };

  // Track the desktop size and pull every window back inside when it shrinks.
  useLayoutEffect(() => {
    const el = desktopRef.current;
    if (!el) return;
    const measure = () => {
      const size = { w: el.clientWidth, h: el.clientHeight };
      setDesktop(size);
      if (!booted.current) {
        // First measurement: open the profile, plus the AI terminal on larger screens.
        booted.current = true;
        const first: WindowId[] = size.w <= 768 ? ['profile'] : ['profile', 'terminal'];
        setOpen(first);
        setStack(first);
        setRects(Object.fromEntries(first.map((id, i) => [id, openingRect(size, APPS[id], i)])));
        return;
      }
      setRects((rs) => {
        const next: Partial<Record<WindowId, Rect>> = {};
        for (const [id, r] of Object.entries(rs) as [WindowId, Rect][]) next[id] = clampRect(r, size.w, size.h);
        return next;
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const visible = stack.filter((id) => open.includes(id) && !minimized.has(id));
  const active = visible[visible.length - 1] ?? null;

  const focus = useCallback((id: WindowId) => {
    setStack((s) => (s[s.length - 1] === id ? s : [...s.filter((x) => x !== id), id]));
    setMinimized((m) => {
      if (!m.has(id)) return m;
      const n = new Set(m);
      n.delete(id);
      return n;
    });
  }, []);

  const launch = useCallback(
    (id: WindowId) => {
      setMenuOpen(false);
      setOpen((o) => (o.includes(id) ? o : [...o, id]));
      setRects((rs) => (rs[id] ? rs : { ...rs, [id]: openingRect(desktop, APPS[id], Object.keys(rs).length) }));
      focus(id);
    },
    [desktop, focus],
  );

  const close = (id: WindowId) => {
    setOpen((o) => o.filter((x) => x !== id));
    setMaximized((m) => {
      const n = new Set(m);
      n.delete(id);
      return n;
    });
    setMinimized((m) => {
      const n = new Set(m);
      n.delete(id);
      return n;
    });
  };

  const minimize = (id: WindowId) => setMinimized((m) => new Set(m).add(id));

  const toggleMax = (id: WindowId) => {
    setMaximized((m) => {
      const n = new Set(m);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
    focus(id);
  };

  const onTask = (id: WindowId) => (id === active ? minimize(id) : focus(id));

  const showDesktop = () => {
    setMinimized(new Set(open));
    setMenuOpen(false);
  };

  // Escape closes the start menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const content: Record<WindowId, ReactNode> = {
    profile: <ProfileContent />,
    services: <ServicesContent />,
    projects: <ProjectsContent />,
    terminal: <TerminalContent onModern={onModern} />,
    contact: <ContactContent />,
  };

  return (
    <div className="retro" style={{ backgroundImage: `url(${wallpaper})` }}>
      <div
        className="retro-desktop"
        ref={desktopRef}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            setSelected(null);
            setMenuOpen(false);
          }
        }}
      >
        <nav className="desktop-icons" aria-label="Desktop">
          {ORDER.map((id) => (
            <button
              key={id}
              type="button"
              className={`desktop-icon${selected === id ? ' selected' : ''}`}
              onClick={() => (isMobile ? launch(id) : setSelected(id))}
              onDoubleClick={() => launch(id)}
              onKeyDown={(e) => e.key === 'Enter' && launch(id)}
            >
              {glyph(APPS[id].icon, APPS[id].color)}
              <span className="label">{labels[id]}</span>
            </button>
          ))}
          <a className="desktop-icon" href={profile.resumeUrl} target="_blank" rel="noopener">
            {glyph(FileText, '#c0392b')}
            <span className="label">{t.retroUi.resume}</span>
          </a>
          <button type="button" className="desktop-icon" onClick={onModern}>
            {glyph(Monitor, '#5b6b7a')}
            <span className="label">{t.retroUi.modern}</span>
          </button>
        </nav>

        <AnimatePresence>
          {stack.map((id, z) =>
            open.includes(id) && !minimized.has(id) && rects[id] ? (
              <Window
                key={id}
                title={labels[id]}
                icon={glyph(APPS[id].icon, APPS[id].color, 16)}
                active={id === active}
                maximized={maximized.has(id)}
                fullscreen={isMobile}
                zIndex={10 + z}
                rect={rects[id]!}
                desktop={desktop}
                onRect={(r) => setRects((rs) => ({ ...rs, [id]: r }))}
                onFocus={() => id !== active && focus(id)}
                onClose={() => close(id)}
                onMinimize={() => minimize(id)}
                onMaximize={() => toggleMax(id)}
              >
                {content[id]}
              </Window>
            ) : null,
          )}
        </AnimatePresence>
      </div>

      {menuOpen && (
        <nav className="start-menu w95-border" aria-label="Start menu">
          <div className="side" aria-hidden="true">
            BryanOS
          </div>
          <ul>
            {ORDER.map((id) => (
              <li key={id}>
                <button type="button" onClick={() => launch(id)}>
                  {glyph(APPS[id].icon, APPS[id].color, 20)} {labels[id]}
                </button>
              </li>
            ))}
            <li>
              <a href={profile.resumeUrl} target="_blank" rel="noopener" onClick={() => setMenuOpen(false)}>
                {glyph(FileText, '#c0392b', 20)} {t.retroUi.openResume}
              </a>
            </li>
            <li>
              <hr />
            </li>
            <li>
              <button type="button" onClick={showDesktop}>
                {glyph(Monitor, '#3a6ea5', 20)} {t.retroUi.showDesktop}
              </button>
            </li>
            <li>
              <button type="button" onClick={onModern}>
                {glyph(LogOut, '#5b6b7a', 20)} {t.retroUi.exitModern}
              </button>
            </li>
          </ul>
        </nav>
      )}

      <div className="taskbar">
        <button
          type="button"
          className={`w95-button start-btn${menuOpen ? ' pressed' : ''}`}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((m) => !m)}
        >
          <span className="start-mark" aria-hidden="true">
            BC
          </span>
          {lang === 'es' ? 'Inicio' : 'Start'}
        </button>
        <div className="task-list">
          {ORDER.filter((id) => open.includes(id)).map((id) => (
            <button
              key={id}
              type="button"
              className={`w95-button${id === active ? ' pressed' : ''}${minimized.has(id) ? ' minimized' : ''}`}
              onClick={() => onTask(id)}
              title={labels[id]}
            >
              {glyph(APPS[id].icon, APPS[id].color, 16)}
              <span className="task-label">{labels[id]}</span>
            </button>
          ))}
        </div>
        <div className="tray w95-sunken">
          <button type="button" className="tray-btn" onClick={toggleLang} title={t.switchTo} aria-label={t.switchTo}>
            <Flag country={lang === 'en' ? 'co' : 'us'} size={16} /> {t.retroUi.language}
          </button>
          <button type="button" className="tray-btn" onClick={onModern}>
            {t.retroUi.modern}
          </button>
          <span className="clock">{time.toLocaleTimeString(lang === 'es' ? 'es-CO' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
}
