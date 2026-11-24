import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useAssistant } from '../ai/useAssistant';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useLang } from '../i18n/LanguageContext';
import { GoogleCloudIcon } from '../ui/GoogleCloudIcon';
import portrait from '../assets/profile.webp';

// Contents of each retro window. Text comes from src/data and src/i18n.

type Tab = 'general' | 'experience' | 'skills' | 'education';

export function ProfileContent() {
  const { t, profile } = useLang();
  const [tab, setTab] = useState<Tab>('general');
  const tabs: Tab[] = ['general', 'experience', 'skills', 'education'];

  return (
    <div>
      <div className="w95-tabs" role="tablist">
        {tabs.map((id) => (
          <button key={id} type="button" role="tab" className="w95-tab" aria-selected={tab === id} onClick={() => setTab(id)}>
            {t.retroUi.tabs[id]}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <div role="tabpanel">
          <div className="profile-head">
            <img className="w95-sunken" src={portrait} alt="Bryan Cruz" />
            <div>
              <h2>{profile.name}</h2>
              <p>
                <strong>{profile.title}</strong>
                <br />
                <span className="retro-muted">
                  {profile.location} · {profile.availability}
                </span>
              </p>
              <div className="retro-chips" style={{ marginBottom: 10 }}>
                {profile.certifications.slice(0, 2).map((c) => (
                  <span key={c.name} className="retro-chip with-icon">
                    <GoogleCloudIcon size={12} /> {c.name}
                  </span>
                ))}
              </div>
              <a className="w95-button" href={profile.resumeUrl} target="_blank" rel="noopener">
                {t.retroUi.openResume}
              </a>
            </div>
          </div>
          <div className="w95-sunken summary-box">
            <p>{profile.summary}</p>
          </div>
        </div>
      )}

      {tab === 'experience' && (
        <ul className="retro-list" role="tabpanel">
          {profile.experience.map((r) => (
            <li key={r.company}>
              <h3>{r.title}</h3>
              <div className="retro-muted">
                {r.company} · {r.start} – {r.end}
              </div>
              <ul>
                {r.highlights.map((h) => (
                  <li key={h.label}>
                    <strong>{h.label}:</strong> {h.text}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

      {tab === 'skills' && (
        <ul className="retro-list" role="tabpanel">
          {profile.skills.map((s) => (
            <li key={s.group}>
              <h3>{s.group}</h3>
              <div className="retro-chips">
                {s.items.map((i) => (
                  <span className="retro-chip" key={i}>
                    {i}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      {tab === 'education' && (
        <div role="tabpanel" className="edu-tab">
          <fieldset className="w95-group">
            <legend>{t.creds.certifications}</legend>
            <div className="cert-grid">
              {profile.certifications.map((c) => (
                <div key={c.name} className={`cert-tile w95-border${c.issuer.startsWith('Google') ? ' google' : ''}`}>
                  <span className="cert-seal" aria-hidden="true">
                    {c.issuer.startsWith('Google') ? <GoogleCloudIcon size={18} /> : 'PV'}
                  </span>
                  <strong>{c.name}</strong>
                  <span className="retro-muted">{c.issuer.startsWith('Google') ? 'Google Cloud' : 'Certiport'}</span>
                  <span className="cert-year">{c.year}</span>
                </div>
              ))}
            </div>
          </fieldset>
          <fieldset className="w95-group">
            <legend>{t.creds.education}</legend>
            <table className="edu-table">
              <tbody>
                {profile.education.map((e) => (
                  <tr key={e.name}>
                    <td className="edu-year">{e.year}</td>
                    <td>
                      <strong>{e.name}</strong>
                      <div className="retro-muted">{e.issuer}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </fieldset>
          <fieldset className="w95-group">
            <legend>{t.creds.languages}</legend>
            <div className="retro-chips">
              {profile.languages.map((l) => (
                <span key={l} className="retro-chip">
                  {l}
                </span>
              ))}
            </div>
          </fieldset>
        </div>
      )}
    </div>
  );
}

export function ProjectsContent() {
  const { profile } = useLang();
  return (
    <ul className="retro-list">
      {profile.projects.map((p) => (
        <li key={p.year + p.stack[0]}>
          <h3>
            {p.name} <span className="retro-muted">· {p.kind} · {p.year}</span>
          </h3>
          <p style={{ marginTop: 6 }}>{p.summary}</p>
          <div className="retro-chips">
            {p.stack.map((s) => (
              <span className="retro-chip" key={s}>
                {s}
              </span>
            ))}
          </div>
          {p.links.length > 0 && (
            <div className="retro-links">
              {p.links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener">
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function ServicesContent() {
  const { t, profile } = useLang();
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(t.services.ctaSubject)}`;
  return (
    <div className="services-win">
      <h2>{t.services.title}</h2>
      <p className="retro-muted">{t.services.lede}</p>
      <div className="service-list">
        {t.services.items.map((s, i) => (
          <fieldset key={s.title} className="w95-group">
            <legend>
              {i + 1}. {s.title}
            </legend>
            <p>{s.text}</p>
          </fieldset>
        ))}
      </div>
      <p>
        <strong>{t.services.processTitle}:</strong> {t.services.process.map((p) => p.title).join(' → ')}
      </p>
      <a className="w95-button" href={mailto}>
        {t.services.cta}
      </a>
    </div>
  );
}

export function ContactContent() {
  const { t, profile } = useLang();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <h2>{t.retroUi.talk}</h2>
      <p>{t.retroUi.talkText}</p>
      <div className="w95-sunken" style={{ padding: 8, fontFamily: 'monospace', userSelect: 'all', overflowWrap: 'anywhere' }}>
        {profile.email}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <button type="button" className="w95-button" onClick={copy}>
          {copied ? t.retroUi.copied : t.retroUi.copy}
        </button>
        <a className="w95-button" href={profile.links.linkedin.url} target="_blank" rel="noopener">
          LinkedIn
        </a>
        <a className="w95-button" href={profile.links.github.url} target="_blank" rel="noopener">
          GitHub
        </a>
        <a className="w95-button" href={profile.resumeUrl} target="_blank" rel="noopener">
          {t.retroUi.openResume}
        </a>
      </div>
    </div>
  );
}

interface Line {
  kind: 'system' | 'user';
  text: ReactNode;
}

export function TerminalContent({ onModern }: { onModern: () => void }) {
  const { t, profile } = useLang();
  const ai = useAssistant();
  const [log, setLog] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Only grab focus where there is a real keyboard, so phones don't pop one open.
  const finePointer = useMediaQuery('(pointer: fine)');

  const engine = ai.device === 'checking' ? t.retroUi.engineChecking : ai.activeEngine === 'on-device' ? t.retroUi.engineDevice : t.retroUi.engineCloud;
  const busy = ai.status === 'thinking' || ai.status === 'streaming';

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [log, ai.messages]);

  useEffect(() => {
    if (finePointer && !busy) inputRef.current?.focus({ preventScroll: true });
  }, [finePointer, busy]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd || busy) return;
    const lower = cmd.toLowerCase();
    if (lower === 'clear' || lower === 'cls') {
      setLog([]);
      ai.reset();
      return;
    }
    if (lower === 'help') {
      setLog((l) => [...l, { kind: 'user', text: cmd }, { kind: 'system', text: t.retroUi.termHelp }]);
      return;
    }
    if (lower === 'resume') {
      window.open(profile.resumeUrl, '_blank', 'noopener');
      setLog((l) => [...l, { kind: 'user', text: cmd }, { kind: 'system', text: t.retroUi.termOpening }]);
      return;
    }
    if (lower === 'modern' || lower === 'exit') {
      onModern();
      return;
    }
    ai.send(cmd);
  };

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="line dim">BryanOS AI Terminal · engine: {engine}</div>
      <div className="line dim">{t.retroUi.termHelp}</div>
      {log.map((l, i) => (
        <div key={i} className={`line ${l.kind === 'user' ? 'user' : ''}`}>
          {l.kind === 'user' ? `C:\\Users\\Guest> ${l.text}` : l.text}
        </div>
      ))}
      {ai.messages.map((m, i) => (
        <div key={`ai-${i}`} className={`line ${m.role === 'user' ? 'user' : ''}`}>
          {m.role === 'user' ? `C:\\Users\\Guest> ${m.content}` : m.content || '…'}
        </div>
      ))}
      {ai.error && <div className="line err">ERROR: {t.ask.errors[ai.error]}</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(input);
          setInput('');
        }}
      >
        <label htmlFor="terminal-input">C:\Users\Guest&gt;</label>
        <input
          id="terminal-input"
          ref={inputRef}
          value={input}
          maxLength={500}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          disabled={busy}
        />
      </form>
      <div ref={endRef} />
    </div>
  );
}
