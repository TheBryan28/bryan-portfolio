import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { profile } from '../data/profile';
import { useAssistant } from '../ai/useAssistant';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { GoogleCloudIcon } from '../ui/GoogleCloudIcon';
import portrait from '../assets/profile.webp';

// Contents of each retro window. All text comes from src/data/profile.ts.

export function ProfileContent() {
  const tabs = ['General', 'Experience', 'Skills', 'Education'] as const;
  const [tab, setTab] = useState<(typeof tabs)[number]>('General');

  return (
    <div>
      <div className="w95-tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t} type="button" role="tab" className="w95-tab" aria-selected={tab === t} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'General' && (
        <div role="tabpanel">
          <div className="profile-head">
            <img className="w95-sunken" src={portrait} alt="Portrait of Bryan Cruz" />
            <div>
              <h2>{profile.name}</h2>
              <p>
                <strong>{profile.title}</strong>
                <br />
                <span className="retro-muted">
                  {profile.location} · {profile.availability}
                </span>
              </p>
              <p>
                {profile.certifications.slice(0, 2).map((c) => (
                  <span key={c.name} className="retro-chip" style={{ marginRight: 4 }}>
                    {c.issuer}: {c.name}
                  </span>
                ))}
              </p>
              <a className="w95-button" href={profile.resumeUrl} target="_blank" rel="noopener">
                Open resume (PDF)
              </a>
            </div>
          </div>
          <div className="w95-sunken" style={{ padding: 10, background: '#fafafa' }}>
            <p style={{ margin: 0 }}>{profile.summary}</p>
          </div>
        </div>
      )}

      {tab === 'Experience' && (
        <ul className="retro-list" role="tabpanel">
          {profile.experience.map((r) => (
            <li key={r.title}>
              <h3>{r.title}</h3>
              <div className="retro-muted">
                {r.company} · {r.start} – {r.end}
              </div>
              <ul>
                {r.highlights.map((h) => (
                  <li key={h.label} style={{ border: 0, padding: 0 }}>
                    <strong>{h.label}:</strong> {h.text}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

      {tab === 'Skills' && (
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

      {tab === 'Education' && (
        <div role="tabpanel" className="edu-tab">
          <fieldset className="w95-group">
            <legend>Certifications</legend>
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
            <legend>Education</legend>
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
            <legend>Languages</legend>
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
  return (
    <ul className="retro-list">
      {profile.projects.map((p) => (
        <li key={p.name}>
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
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

export function ContactContent() {
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
      <h2>Let’s talk</h2>
      <p>Building something with generative AI, or need a full-stack engineer who ships? Send me a note.</p>
      <div className="w95-sunken" style={{ padding: 8, fontFamily: 'monospace', userSelect: 'all' }}>
        {profile.email}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <button type="button" className="w95-button" onClick={copy}>
          {copied ? 'Copied!' : 'Copy email'}
        </button>
        <a className="w95-button" href={profile.links.linkedin.url} target="_blank" rel="noopener">
          LinkedIn
        </a>
        <a className="w95-button" href={profile.links.github.url} target="_blank" rel="noopener">
          GitHub
        </a>
        <a className="w95-button" href={profile.resumeUrl} target="_blank" rel="noopener">
          Resume (PDF)
        </a>
      </div>
    </div>
  );
}

interface Line {
  kind: 'system' | 'user' | 'assistant';
  text: ReactNode;
}

const HELP = `Commands: help · clear · resume · modern
Anything else is a question for the AI, in English or Spanish.`;

export function TerminalContent({ onModern }: { onModern: () => void }) {
  const ai = useAssistant();
  const [log, setLog] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Only grab focus where there is a real keyboard, so phones don't pop one open.
  const finePointer = useMediaQuery('(pointer: fine)');

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [log, ai.messages]);

  const engine =
    ai.device === 'available' ? 'Gemini Nano (on-device)' : ai.device === 'checking' ? 'checking…' : 'Gemini (cloud)';
  const busy = ai.status === 'thinking' || ai.status === 'streaming';

  useEffect(() => {
    if (finePointer && !busy) inputRef.current?.focus();
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
      setLog((l) => [...l, { kind: 'user', text: cmd }, { kind: 'system', text: HELP }]);
      return;
    }
    if (lower === 'resume') {
      window.open(profile.resumeUrl, '_blank', 'noopener');
      setLog((l) => [...l, { kind: 'user', text: cmd }, { kind: 'system', text: 'Opening the resume in a new tab…' }]);
      return;
    }
    if (lower === 'modern' || lower === 'exit') {
      onModern();
      return;
    }
    ai.send(cmd);
  };

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div className="line dim">BryanOS AI Terminal · engine: {engine}</div>
      <div className="line dim">{HELP}</div>
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
      {ai.error && <div className="line">ERROR: {ai.error}</div>}
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
