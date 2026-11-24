import { useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Copy, Minus, Square, X } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { clampRect } from './geometry';
import type { Rect } from './geometry';

interface WindowProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  active: boolean;
  maximized: boolean;
  fullscreen: boolean;
  zIndex: number;
  rect: Rect;
  desktop: { w: number; h: number };
  onRect: (rect: Rect) => void;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

type Gesture = { kind: 'move' | 'resize'; px: number; py: number; start: Rect } | null;

export function Window(props: WindowProps) {
  const { t } = useLang();
  const gesture = useRef<Gesture>(null);
  const ref = useRef<HTMLElement>(null);
  const filled = props.maximized || props.fullscreen;

  // Focus the window when it opens so the keyboard lands inside it.
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  function start(kind: 'move' | 'resize', e: ReactPointerEvent<HTMLElement>) {
    if (filled || e.button !== 0) return;
    if (kind === 'move' && (e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current = { kind, px: e.clientX, py: e.clientY, start: props.rect };
  }

  const move = (e: ReactPointerEvent<HTMLElement>) => {
    const g = gesture.current;
    if (!g) return;
    const dx = e.clientX - g.px;
    const dy = e.clientY - g.py;
    const { w: W, h: H } = props.desktop;
    if (g.kind === 'move') {
      props.onRect(clampRect({ ...g.start, x: g.start.x + dx, y: g.start.y + dy }, W, H));
    } else {
      props.onRect(
        clampRect(
          {
            ...g.start,
            w: Math.min(g.start.w + dx, W - g.start.x),
            h: Math.min(g.start.h + dy, H - g.start.y),
          },
          W,
          H,
        ),
      );
    }
  };

  const end = (e: ReactPointerEvent<HTMLElement>) => {
    if (!gesture.current) return;
    gesture.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const style = props.fullscreen
    ? { left: 4, top: 4, width: props.desktop.w - 8, height: props.desktop.h - 8 }
    : props.maximized
      ? { left: 0, top: 0, width: props.desktop.w, height: props.desktop.h }
      : { left: props.rect.x, top: props.rect.y, width: props.rect.w, height: props.rect.h };

  return (
    <motion.section
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-label={props.title}
      className={`w95-window w95-border${props.active ? ' active' : ''}${filled ? ' filled' : ''}`}
      initial={{ opacity: 0, scale: 0.94, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 24, transition: { duration: 0.14 } }}
      transition={{ type: 'spring', damping: 28, stiffness: 380 }}
      onPointerDownCapture={props.onFocus}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          props.onClose();
        }
      }}
      style={{ ...style, zIndex: props.zIndex }}
    >
      <div
        className="w95-title"
        onPointerDown={(e) => start('move', e)}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onDoubleClick={props.fullscreen ? undefined : props.onMaximize}
        style={{ cursor: filled ? 'default' : 'move' }}
      >
        <span className="name">
          {props.icon}
          <span className="name-text">{props.title}</span>
        </span>
        <span className="controls">
          <button type="button" className="w95-button" aria-label={t.retroUi.minimize} title={t.retroUi.minimize} onClick={props.onMinimize}>
            <Minus size={11} aria-hidden="true" />
          </button>
          {!props.fullscreen && (
            <button
              type="button"
              className="w95-button"
              aria-label={props.maximized ? t.retroUi.restore : t.retroUi.maximize}
              title={props.maximized ? t.retroUi.restore : t.retroUi.maximize}
              onClick={props.onMaximize}
            >
              {props.maximized ? <Copy size={9} aria-hidden="true" /> : <Square size={9} aria-hidden="true" />}
            </button>
          )}
          <button type="button" className="w95-button close" aria-label={t.retroUi.close} title={t.retroUi.close} onClick={props.onClose}>
            <X size={12} aria-hidden="true" />
          </button>
        </span>
      </div>
      <div className="w95-body">{props.children}</div>
      {!filled && (
        <span
          className="w95-resize"
          aria-hidden="true"
          onPointerDown={(e) => start('resize', e)}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
        />
      )}
    </motion.section>
  );
}
