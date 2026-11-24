import { useCallback, useEffect, useRef, useState } from 'react';
import { AssistantError, ask, onDeviceAvailability, openOnDeviceSession, resetOnDeviceSession } from './engine';
import type { ChatTurn, Engine } from './engine';

export type AssistantStatus = 'idle' | 'thinking' | 'streaming' | 'error';

export interface AssistantState {
  messages: ChatTurn[];
  status: AssistantStatus;
  error: AssistantError['kind'] | null;
  engine: Engine | null;
  /** What Chrome reports for Gemini Nano on this machine. */
  device: LanguageModelAvailability | 'checking';
  downloadProgress: number | null;
  /** The visitor chose the private on-device mode. */
  preferDevice: boolean;
  /** The engine the next question will use. */
  activeEngine: Engine;
  setPreferDevice: (value: boolean) => void;
  send: (question: string) => void;
  stop: () => void;
  reset: () => void;
  enableOnDevice: () => void;
}

const MAX_QUESTION = 500;
const ENGINE_KEY = 'portfolio-ai-engine';

function storedPreference(): boolean {
  try {
    return localStorage.getItem(ENGINE_KEY) === 'on-device';
  } catch {
    return false;
  }
}

export function useAssistant(): AssistantState {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [status, setStatus] = useState<AssistantStatus>('idle');
  const [error, setError] = useState<AssistantError['kind'] | null>(null);
  const [engine, setEngine] = useState<Engine | null>(null);
  const [device, setDevice] = useState<AssistantState['device']>('checking');
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [preferDevice, setPreferDeviceState] = useState(storedPreference);
  const controller = useRef<AbortController | null>(null);
  const activeEngine: Engine = preferDevice && device === 'available' ? 'on-device' : 'cloud';

  useEffect(() => {
    let alive = true;
    onDeviceAvailability().then((a) => alive && setDevice(a));
    return () => {
      alive = false;
      controller.current?.abort();
    };
  }, []);

  // Chrome keeps downloading Gemini Nano in the background, even after a
  // reload. Check again every 20 seconds so the switch unlocks when it's ready.
  useEffect(() => {
    if (device !== 'downloading') return;
    const timer = setInterval(() => {
      onDeviceAvailability().then((a) => a !== 'downloading' && setDevice(a));
    }, 20_000);
    return () => clearInterval(timer);
  }, [device]);

  const send = useCallback(
    (raw: string) => {
      const question = raw.trim().slice(0, MAX_QUESTION);
      if (!question || status === 'thinking' || status === 'streaming') return;

      const history: ChatTurn[] = [...messages, { role: 'user', content: question }];
      setMessages([...history, { role: 'assistant', content: '' }]);
      setStatus('thinking');
      setError(null);

      const ac = new AbortController();
      controller.current = ac;

      (async () => {
        try {
          for await (const chunk of ask(history, activeEngine, device === 'available', ac.signal, setEngine)) {
            setStatus('streaming');
            setMessages((prev) => {
              const next = prev.slice();
              const last = next[next.length - 1];
              next[next.length - 1] = { ...last, content: last.content + chunk };
              return next;
            });
          }
          setStatus('idle');
        } catch (err) {
          if (ac.signal.aborted) {
            setStatus('idle');
            return;
          }
          setMessages((prev) => (prev[prev.length - 1]?.content ? prev : prev.slice(0, -1)));
          setError(err instanceof AssistantError ? err.kind : 'failed');
          setStatus('error');
        }
      })();
    },
    [messages, status, device, activeEngine],
  );

  const stop = useCallback(() => controller.current?.abort(), []);

  const reset = useCallback(() => {
    controller.current?.abort();
    resetOnDeviceSession();
    setMessages([]);
    setError(null);
    setStatus('idle');
  }, []);

  // Switching engines starts a new conversation, since each keeps its own history.
  const setPreferDevice = useCallback(
    (value: boolean) => {
      try {
        localStorage.setItem(ENGINE_KEY, value ? 'on-device' : 'cloud');
      } catch {
        // The choice lasts for this visit only.
      }
      setPreferDeviceState(value);
      reset();
      setEngine(null);
    },
    [reset],
  );

  // Starts the Gemini Nano download. Must be called from a click.
  const enableOnDevice = useCallback(() => {
    setDevice('downloading');
    setDownloadProgress(0);
    openOnDeviceSession((f) => setDownloadProgress(f))
      .then(() => {
        setDevice('available');
        setDownloadProgress(null);
        setPreferDevice(true);
      })
      .catch(() => {
        setDevice('unavailable');
        setDownloadProgress(null);
      });
  }, [setPreferDevice]);

  return { messages, status, error, engine, device, downloadProgress, preferDevice, activeEngine, setPreferDevice, send, stop, reset, enableOnDevice };
}
