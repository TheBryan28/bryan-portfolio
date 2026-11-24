import { NANO_EXAMPLES, NANO_PROMPT } from './knowledge';

// Hybrid assistant. The cloud (/api/chat → Gemini) answers by default because
// it gives the best answers. Visitors whose Chrome has Gemini Nano can switch
// to a private on-device mode, and Nano also steps in if the cloud fails.

export type Engine = 'on-device' | 'cloud';

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export class AssistantError extends Error {
  readonly kind: 'rate-limited' | 'not-configured' | 'failed';
  constructor(kind: AssistantError['kind'], message: string) {
    super(message);
    this.kind = kind;
  }
}

const LANGUAGE_OPTIONS: LanguageModelOptions = {
  expectedInputs: [{ type: 'text', languages: ['en', 'es'] }],
  expectedOutputs: [{ type: 'text', languages: ['en', 'es'] }],
};

function languageModel(): LanguageModelStatic | undefined {
  return (globalThis as { LanguageModel?: LanguageModelStatic }).LanguageModel;
}

export async function onDeviceAvailability(): Promise<LanguageModelAvailability> {
  const api = languageModel();
  if (!api) return 'unavailable';
  try {
    return await api.availability(LANGUAGE_OPTIONS);
  } catch {
    return 'unavailable';
  }
}

let session: Promise<LanguageModelSession> | null = null;

// create() must run after a user gesture; it also starts the model download
// when the model is "downloadable".
export function openOnDeviceSession(onProgress?: (fraction: number) => void): Promise<LanguageModelSession> {
  const api = languageModel();
  if (!api) return Promise.reject(new Error('Prompt API not available'));
  if (!session) {
    session = api
      .create({
        ...LANGUAGE_OPTIONS,
        initialPrompts: [{ role: 'system', content: NANO_PROMPT }, ...NANO_EXAMPLES],
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => onProgress?.((e as ProgressEvent).loaded));
        },
      })
      .catch((err) => {
        session = null;
        throw err;
      });
  }
  return session;
}

export function resetOnDeviceSession() {
  session?.then((s) => s.destroy()).catch(() => {});
  session = null;
}

// The on-device session keeps its own history, so it only needs the new question.
async function* askOnDevice(question: string, signal: AbortSignal): AsyncGenerator<string> {
  const s = await openOnDeviceSession();
  const reader = s.promptStreaming(question, { signal }).getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return;
    yield value;
  }
}

async function* askCloud(history: ChatTurn[], signal: AbortSignal): AsyncGenerator<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages: history }),
    signal,
  });
  if (res.status === 429) throw new AssistantError('rate-limited', 'The assistant reached its usage limit for now.');
  if (res.status === 503) throw new AssistantError('not-configured', 'The cloud assistant is not configured yet.');
  if (!res.ok || !res.body) throw new AssistantError('failed', 'The assistant could not answer right now.');

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return;
    yield value;
  }
}

export async function* ask(
  history: ChatTurn[],
  engine: Engine,
  deviceReady: boolean,
  signal: AbortSignal,
  onEngine: (engine: Engine) => void,
): AsyncGenerator<string> {
  const question = history[history.length - 1].content;
  const first = engine;
  const second: Engine | null = engine === 'cloud' ? (deviceReady ? 'on-device' : null) : 'cloud';
  for (const current of [first, second]) {
    if (!current) break;
    let produced = false;
    try {
      onEngine(current);
      const stream = current === 'on-device' ? askOnDevice(question, signal) : askCloud(history, signal);
      for await (const chunk of stream) {
        produced = true;
        yield chunk;
      }
      return;
    } catch (err) {
      // Give up if the visitor stopped it, an answer already started, or
      // there is no other engine to try.
      if (signal.aborted || produced || current === second || !second) throw err;
      if (current === 'on-device') resetOnDeviceSession();
    }
  }
}
