// Minimal types for Chrome's built-in Prompt API (Gemini Nano).
// https://developer.chrome.com/docs/ai/prompt-api

type LanguageModelAvailability = 'unavailable' | 'downloadable' | 'downloading' | 'available';

interface LanguageModelMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LanguageModelExpected {
  type: 'text';
  languages?: string[];
}

interface LanguageModelOptions {
  expectedInputs?: LanguageModelExpected[];
  expectedOutputs?: LanguageModelExpected[];
}

interface LanguageModelCreateOptions extends LanguageModelOptions {
  initialPrompts?: LanguageModelMessage[];
  signal?: AbortSignal;
  monitor?: (m: EventTarget) => void;
}

interface LanguageModelSession {
  prompt(input: string, options?: { signal?: AbortSignal }): Promise<string>;
  promptStreaming(input: string, options?: { signal?: AbortSignal }): ReadableStream<string>;
  destroy(): void;
}

interface LanguageModelStatic {
  availability(options?: LanguageModelOptions): Promise<LanguageModelAvailability>;
  create(options?: LanguageModelCreateOptions): Promise<LanguageModelSession>;
}
