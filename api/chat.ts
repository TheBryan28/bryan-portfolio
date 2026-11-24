// Vercel Function: the cloud fallback for the portfolio assistant.
// Streams Gemini's answer back as plain text. The API key never reaches the browser.
//
// Environment variables (set them in Vercel > Settings > Environment Variables):
//   GEMINI_API_KEY  required
//   GEMINI_MODEL    optional, defaults to gemini-3.5-flash-lite

import { SYSTEM_PROMPT } from '../src/ai/knowledge.js';

const DEFAULT_MODEL = 'gemini-3.5-flash-lite';
const MAX_MESSAGES = 12;
const MAX_CHARS = 1500;

// Best-effort limit per visitor. Memory is per function instance, so this
// slows abuse down but is not a hard guarantee; Google's own quota is the backstop.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 15;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS;
}

interface Turn {
  role: 'user' | 'assistant';
  content: string;
}

function parseMessages(body: unknown): Turn[] | null {
  if (!body || typeof body !== 'object' || !Array.isArray((body as { messages?: unknown }).messages)) return null;
  const raw = (body as { messages: unknown[] }).messages.slice(-MAX_MESSAGES);
  const turns: Turn[] = [];
  for (const m of raw) {
    if (!m || typeof m !== 'object') return null;
    const { role, content } = m as Record<string, unknown>;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;
    turns.push({ role, content: content.slice(0, MAX_CHARS) });
  }
  return turns.length && turns[turns.length - 1].role === 'user' ? turns : null;
}

const text = (status: number, message: string) =>
  new Response(message, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });

export async function POST(request: Request): Promise<Response> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return text(503, 'Assistant not configured');

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  if (rateLimited(ip)) return text(429, 'Too many questions, try again in a few minutes');

  let messages: Turn[] | null;
  try {
    messages = parseMessages(await request.json());
  } catch {
    messages = null;
  }
  if (!messages) return text(400, 'Invalid request');

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
        generationConfig: { temperature: 0.3, maxOutputTokens: 1500 },
      }),
    },
  );

  if (upstream.status === 429) return text(429, 'Daily limit reached');
  if (!upstream.ok || !upstream.body) {
    console.error('Gemini error', upstream.status, await upstream.text().catch(() => ''));
    return text(502, 'Upstream error');
  }

  // Gemini sends Server-Sent Events; forward only the text parts.
  const encoder = new TextEncoder();
  let buffer = '';
  const emit = (line: string, controller: TransformStreamDefaultController<Uint8Array>) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('data:')) return;
    try {
      const event = JSON.parse(trimmed.slice(5));
      const parts = event?.candidates?.[0]?.content?.parts ?? [];
      for (const part of parts) {
        if (typeof part.text === 'string' && !part.thought) controller.enqueue(encoder.encode(part.text));
      }
      const reason = event?.candidates?.[0]?.finishReason;
      if (reason && reason !== 'STOP') console.warn('Gemini finished early:', reason);
    } catch {
      // Ignore keep-alives.
    }
  };
  const stream = upstream.body.pipeThrough(new TextDecoderStream()).pipeThrough(
    new TransformStream<string, Uint8Array>({
      transform(chunk, controller) {
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) emit(line, controller);
      },
      // The last event often arrives without a trailing newline; without this
      // flush the end of the answer was dropped.
      flush(controller) {
        if (buffer) emit(buffer, controller);
        buffer = '';
      },
    }),
  );

  return new Response(stream, {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
  });
}
