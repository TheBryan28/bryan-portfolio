import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Square, RotateCcw } from 'lucide-react';
import { useAssistant } from '../ai/useAssistant';
import { useLang } from '../i18n/LanguageContext';

export function AskPanel() {
  const ai = useAssistant();
  const { t } = useLang();
  const [input, setInput] = useState('');
  const logRef = useRef<HTMLDivElement>(null);
  const busy = ai.status === 'thinking' || ai.status === 'streaming';
  const onDevice = (ai.engine ?? ai.activeEngine) === 'on-device';

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [ai.messages]);

  const submit = (question: string) => {
    if (!question.trim() || busy) return;
    ai.send(question);
    setInput('');
  };

  return (
    <div>
      <div className="ask">
        <div className="ask-bar">
          <span className="engine-pill">
            <span className="dot" />
            {onDevice ? t.ask.onDevice : t.ask.cloud}
          </span>
          {ai.device === 'available' && (
            <button type="button" className="link-btn" onClick={() => ai.setPreferDevice(!ai.preferDevice)} disabled={busy}>
              {ai.preferDevice ? t.ask.useCloud : t.ask.useDevice}
            </button>
          )}
          {ai.device === 'downloadable' && (
            <button type="button" className="link-btn" onClick={ai.enableOnDevice}>
              {t.ask.runLocal}
            </button>
          )}
          {ai.downloadProgress !== null && (
            <span className="mono">
              {t.ask.downloading} {Math.round(ai.downloadProgress * 100)}%
            </span>
          )}
          <span className="spacer" />
          {ai.messages.length > 0 && (
            <button type="button" className="link-btn" onClick={ai.reset}>
              <RotateCcw size={12} aria-hidden="true" /> {t.ask.newChat}
            </button>
          )}
        </div>

        <div className="ask-log" ref={logRef} aria-live="polite">
          {ai.messages.length === 0 ? (
            <div className="ask-empty">
              {t.ask.empty}
              <div className="chips">
                {t.ask.suggestions.map((q) => (
                  <button key={q} type="button" className="chip" onClick={() => submit(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            ai.messages.map((m, i) => {
              const last = i === ai.messages.length - 1;
              return (
                <div key={i} className={`bubble ${m.role}${last && busy && m.role === 'assistant' ? ' pending' : ''}`}>
                  {m.content}
                </div>
              );
            })
          )}
        </div>

        {ai.error && (
          <p className="ask-error" role="alert">
            {t.ask.errors[ai.error]} {t.ask.errorTail}
          </p>
        )}

        <form
          className="ask-form"
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
        >
          <label htmlFor="ask-input" className="visually-hidden">
            {t.ask.label}
          </label>
          <input
            id="ask-input"
            value={input}
            maxLength={500}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.ask.placeholder}
            autoComplete="off"
          />
          {busy ? (
            <button type="button" className="btn" onClick={ai.stop} aria-label={t.ask.stop}>
              <Square size={14} aria-hidden="true" />
            </button>
          ) : (
            <button type="submit" className="btn" aria-label={t.ask.send} disabled={!input.trim()}>
              <ArrowUp size={16} aria-hidden="true" />
            </button>
          )}
        </form>
      </div>
      <p className="ask-note">{t.ask.note}</p>
    </div>
  );
}
