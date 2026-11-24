import type { ReactNode, RefObject } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Minus, Square, X } from 'lucide-react';
import { useIsMobile } from '../hooks/useMediaQuery';

interface WindowProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  active: boolean;
  maximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  width: number;
  height: number;
  bounds: RefObject<HTMLDivElement | null>;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

export function Window(props: WindowProps) {
  const isMobile = useIsMobile();
  const drag = useDragControls();
  const fill = isMobile || props.maximized;

  const frame = fill
    ? isMobile && !props.maximized
      ? { left: 6, top: 6, right: 6, width: 'auto', height: 'auto', maxHeight: 'calc(100% - 12px)' }
      : { left: 0, top: 0, width: '100%', height: '100%' }
    : { left: props.position.x, top: props.position.y, width: props.width, height: props.height, maxWidth: 'calc(100% - 16px)', maxHeight: 'calc(100% - 16px)' };

  return (
    <motion.section
      role="dialog"
      aria-label={props.title}
      className={`w95-window w95-border${props.active ? ' active' : ''}`}
      drag={!fill}
      dragControls={drag}
      dragListener={false}
      dragMomentum={false}
      dragConstraints={props.bounds}
      dragElastic={0}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 26, stiffness: 320 }}
      onPointerDown={props.onFocus}
      style={{ ...frame, zIndex: props.zIndex, boxShadow: props.active ? '8px 8px 24px rgba(0,0,0,0.35)' : '4px 4px 12px rgba(0,0,0,0.2)' }}
    >
      <div
        className="w95-title"
        onPointerDown={(e) => !fill && drag.start(e)}
        onDoubleClick={isMobile ? undefined : props.onMaximize}
        style={{ cursor: fill ? 'default' : 'grab' }}
      >
        <span className="name">
          {props.icon}
          {props.title}
        </span>
        <span className="controls">
          <button type="button" className="w95-button" aria-label="Minimize" onClick={(e) => (e.stopPropagation(), props.onMinimize())}>
            <Minus size={11} aria-hidden="true" />
          </button>
          {!isMobile && (
            <button type="button" className="w95-button" aria-label={props.maximized ? 'Restore' : 'Maximize'} onClick={(e) => (e.stopPropagation(), props.onMaximize())}>
              <Square size={9} aria-hidden="true" />
            </button>
          )}
          <button type="button" className="w95-button" aria-label="Close" onClick={(e) => (e.stopPropagation(), props.onClose())}>
            <X size={12} aria-hidden="true" />
          </button>
        </span>
      </div>
      <div className="w95-body">{props.children}</div>
    </motion.section>
  );
}
