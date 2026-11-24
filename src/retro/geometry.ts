export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const MIN_W = 300;
export const MIN_H = 200;
// The part of a window that must stay on screen so it can always be grabbed.
const KEEP_VISIBLE = 120;

// Keeps a window's title bar reachable inside a desktop of size W × H.
export function clampRect(r: Rect, W: number, H: number): Rect {
  const w = Math.min(Math.max(r.w, MIN_W), W);
  const h = Math.min(Math.max(r.h, MIN_H), H);
  const x = Math.min(Math.max(r.x, KEEP_VISIBLE - w), W - KEEP_VISIBLE);
  const y = Math.min(Math.max(r.y, 0), H - 32);
  return { x, y, w, h };
}

// Where a new window opens: centred when there is room, cascading by `count`.
export function openingRect(size: { w: number; h: number }, preferred: { w: number; h: number }, count: number): Rect {
  const w = Math.min(preferred.w, size.w - 24);
  const h = Math.min(preferred.h, size.h - 24);
  const x = Math.max(12, Math.round((size.w - w) / 2) - 60 + count * 28);
  const y = Math.max(8, Math.round((size.h - h) / 3) + count * 24);
  return clampRect({ x, y, w, h }, size.w, size.h);
}
