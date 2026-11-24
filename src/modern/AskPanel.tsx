import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Square, RotateCcw } from 'lucide-react';
import { useAssistant } from '../ai/useAssistant';
import { SUGGESTED_QUESTIONS } from '../ai/knowledge';

function EngineLabel({ engine, device }: { engine: string | null; device: string }) {
  if (engine === 'on-device' || (!engine && device === 'available')) return <>On-device · Gemini Nano</>;
  return <>Cloud · Gemini</>;
}

export function AskPanel() {
  const ai = useAssistant();
  const [input, setInput] = useState('');
  const logRef = useRef<HTMLDivElement>(null);
  const busy = ai.status === 'thinking' || ai.status === 'streaming';

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
            <EngineLabel engine={ai.engine} device={ai.device} />
          </span>
          {ai.device === 'downloadable' && (
            <button type="button" className="link-btn" onClick={ai.enableOnDevice}>
              Run it on your device instead
            </button>
          )}
          {ai.downloadProgress !== null && <span className="mono">Downloading Gemini Nano {Math.round(ai.downloadProgress * 100)}%</span>}
          <span className="spacer" />
          {ai.messages.length > 0 && (
            <button type="button" className="link-btn" onClick={ai.reset}>
              <RotateCcw size={12} aria-hidden="true" /> New chat
            </button>
          )}
        </div>

        <div className="ask-log" ref={logRef} aria-live="polite">
          {ai.messages.length === 0 ? (
            <div className="ask-empty">
              Ask about Bryan’s projects, stack or experience, in English or Spanish.
              <div className="chips">
                {SUGGESTED_QUESTIONS.map((q) => (
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
            {ai.error} You can still read everything below or email Bryan.
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
            Your question
          </label>
          <input
            id="ask-input"
            value={input}
            maxLength={500}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What has Bryan built with RAG?"
            autoComplete="off"
          />
          {busy ? (
            <button type="button" className="btn" onClick={ai.stop} aria-label="Stop the answer">
              <Square size={14} aria-hidden="true" />
            </button>
          ) : (
            <button type="submit" className="btn" aria-label="Send question" disabled={!input.trim()}>
              <ArrowUp size={16} aria-hidden="true" />
            </button>
          )}
        </form>
      </div>
      <p className="ask-note">
        On Chrome desktops with Gemini Nano, answers are generated on your device and nothing leaves it. Otherwise your question
        goes to Google’s Gemini API, which may use it to improve its services, so please don’t include personal information.
      </p>
    </div>
  );
}
