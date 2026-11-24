import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { FileText, FolderOpen, LogOut, Mail, Monitor, TerminalSquare, User } from 'lucide-react';
import { Window } from './Window';
import { ContactContent, ProfileContent, ProjectsContent, TerminalContent } from './windows';
import { profile } from '../data/profile';
import { useIsMobile } from '../hooks/useMediaQuery';
import wallpaper from '../assets/wallpaper-xp.webp';
import './retro.css';

type WindowId = 'profile' | 'projects' | 'terminal' | 'contact';

const glyph = (Icon: typeof User, color: string, size = 32) => (
  <span className="retro-glyph" style={{ width: size, height: size, background: color }}>
    <Icon size={size * 0.58} strokeWidth={2.2} aria-hidden="true" />
  </span>
);

const APPS: Record<WindowId, { title: string; label: string; icon: typeof User; color: string; x: number; y: number; w: number; h: number }> = {
  profile: { title: 'Bryan Cruz - Profile', label: 'My Profile', icon: User, color: '#2b6cd4', x: 120, y: 30, w: 620, h: 520 },
  terminal: { title: 'AI Terminal', label: 'AI Terminal', icon: TerminalSquare, color: '#262626', x: 300, y: 120, w: 560, h: 380 },
  projects: { title: 'Projects', label: 'Projects', icon: FolderOpen, color: '#d39400', x: 180, y: 60, w: 620, h: 500 },
  contact: { title: 'Contact', label: 'Contact', icon: Mail, color: '#2e8b57', x: 260, y: 140, w: 380, h: 330 },
};
const ORDER: WindowId[] = ['profile', 'projects', 'terminal', 'contact'];

export default function RetroDesktop({ onModern }: { onModern: () => void }) {
  const isMobile = useIsMobile();
  const desktop = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<WindowId[]>(() => (isMobile ? ['profile'] : ['profile', 'terminal']));
  const [minimized, setMinimized] = useState<Set<WindowId>>(new Set());
  const [maximized, setMaximized] = useState<Set<WindowId>>(new Set());
  const [stack, setStack] = useState<WindowId[]>(() => (isMobile ? ['profile'] : ['profile', 'terminal']));
  const [selected, setSelected] = useState<WindowId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const visible = stack.filter((id) => open.includes(id) && !minimized.has(id));
  const active = visible[visible.length - 1] ?? null;

  const focus = (id: WindowId) => {
    setStack((s) => [...s.filter((x) => x !== id), id]);
    setMinimized((m) => {
      if (!m.has(id)) return m;
      const n = new Set(m);
      n.delete(id);
      return n;
    });
  };

  const launch = (id: WindowId) => {
    setOpen((o) => (o.includes(id) ? o : [...o, id]));
    focus(id);
    setMenuOpen(false);
  };

  const close = (id: WindowId) => {
    setOpen((o) => o.filter((x) => x !== id));
    setMaximized((m) => {
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

  const content: Record<WindowId, ReactNode> = {
    profile: <ProfileContent />,
    projects: <ProjectsContent />,
    terminal: <TerminalContent onModern={onModern} />,
    contact: <ContactContent />,
  };

  return (
    <div className="retro" style={{ backgroundImage: `url(${wallpaper})` }}>
      <div
        className="retro-desktop"
        ref={desktop}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            setSelected(null);
            setMenuOpen(false);
          }
        }}
      >
        <div className="desktop-icons">
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
              <span className="label">{APPS[id].label}</span>
            </button>
          ))}
          <a className="desktop-icon" href={profile.resumeUrl} target="_blank" rel="noopener">
            {glyph(FileText, '#c0392b')}
            <span className="label">Resume.pdf</span>
          </a>
          <button type="button" className="desktop-icon" onClick={onModern}>
            {glyph(Monitor, '#5b6b7a')}
            <span className="label">Modern view</span>
          </button>
        </div>

        {stack.map((id, z) =>
          open.includes(id) && !minimized.has(id) ? (
            <Window
              key={id}
              title={APPS[id].title}
              icon={glyph(APPS[id].icon, APPS[id].color, 16)}
              active={id === active}
              maximized={maximized.has(id)}
              zIndex={10 + z}
              position={{ x: APPS[id].x, y: APPS[id].y }}
              width={APPS[id].w}
              height={APPS[id].h}
              bounds={desktop}
              onFocus={() => id !== active && focus(id)}
              onClose={() => close(id)}
              onMinimize={() => minimize(id)}
              onMaximize={() => toggleMax(id)}
            >
              {content[id]}
            </Window>
          ) : null,
        )}
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
                  {glyph(APPS[id].icon, APPS[id].color, 20)} {APPS[id].label}
                </button>
              </li>
            ))}
            <li>
              <a href={profile.resumeUrl} target="_blank" rel="noopener" onClick={() => setMenuOpen(false)}>
                {glyph(FileText, '#c0392b', 20)} Resume (PDF)
              </a>
            </li>
            <li>
              <hr />
            </li>
            <li>
              <button type="button" onClick={onModern}>
                {glyph(LogOut, '#5b6b7a', 20)} Exit to modern view
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
          <span className="brand-chip" aria-hidden="true" style={{ background: '#000080', color: '#fff', fontSize: 10, padding: '1px 4px' }}>
            BC
          </span>
          Start
        </button>
        <div className="task-list">
          {stack
            .filter((id) => open.includes(id))
            .sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b))
            .map((id) => (
              <button
                key={id}
                type="button"
                className={`w95-button${id === active ? ' pressed' : ''}${minimized.has(id) ? ' minimized' : ''}`}
                onClick={() => onTask(id)}
              >
                {glyph(APPS[id].icon, APPS[id].color, 16)}
                {APPS[id].label}
              </button>
            ))}
        </div>
        <div className="tray w95-sunken">
          <button type="button" className="w95-button" style={{ height: 24 }} onClick={onModern}>
            Modern view
          </button>
          <span className="clock">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
}
