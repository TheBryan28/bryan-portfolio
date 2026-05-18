import React from 'react';
import { X, Minus, Square } from 'lucide-react';
import { motion } from 'framer-motion';

interface WindowProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isMaximized?: boolean;
  isActive: boolean;
  onFocus: () => void;
  initialPosition?: { x: number; y: number };
  width?: string | number;
  height?: string | number;
}

export const Window: React.FC<WindowProps> = ({ 
  title, 
  icon, 
  children, 
  onClose, 
  onMinimize,
  onMaximize,
  isMaximized = false,
  isActive, 
  onFocus,
  initialPosition = { x: 50, y: 50 },
  width = 450,
  height = 'auto'
}) => {
  const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' && window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const responsiveWidth = isMobile ? 'calc(100% - 16px)' : (isMaximized ? '100%' : width);
  const responsiveHeight = isMaximized ? '100%' : height;
  const responsivePosition = isMobile ? { x: 8, y: 45 } : (isMaximized ? { x: 0, y: 0 } : initialPosition);

  return (
    <motion.div
      drag={!isMobile && !isMaximized}
      dragMomentum={false}
      dragConstraints={{ top: 0, left: 0, right: window.innerWidth - 100, bottom: window.innerHeight - 100 }}
      initial={{ scale: 0.9, opacity: 0, ...responsivePosition }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        ...responsivePosition,
        width: responsiveWidth,
        height: responsiveHeight,
        zIndex: isActive ? 100 : 10,
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      onMouseDown={onFocus}
      style={{
        position: 'absolute',
        backgroundColor: 'var(--w95-window-bg)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isActive 
          ? '10px 10px 30px rgba(0,0,0,0.4)' 
          : '5px 5px 15px rgba(0,0,0,0.2)',
        ...(!isActive ? { opacity: 0.98 } : {}),
        ...(isMobile 
          ? { maxHeight: 'calc(100% - 95px)' } 
          : (isMaximized ? { top: 0, left: 0, right: 0, bottom: 0, maxHeight: '100%' } : { maxHeight: 'calc(100% - 60px)' }))
      }}
      className="w95-border"
    >
      {/* Title Bar */}
      <div 
        style={{
          background: isActive ? 'var(--w95-title-bg)' : 'linear-gradient(90deg, #808080 0%, #b0b0b0 100%)',
          color: 'var(--w95-title-text)',
          padding: '4px 6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
          cursor: (isMobile || isMaximized) ? 'default' : 'grab',
          userSelect: 'none'
        }}
        className="w95-title-bar"
        onDoubleClick={onMaximize}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon && <span style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))' }}>{icon}</span>}
          <span style={{ fontSize: '13px', letterSpacing: '0.5px', textShadow: '1px 1px 0 rgba(0,0,0,0.4)' }}>{title}</span>
        </div>
        
        <div style={{ display: 'flex', gap: '2px' }}>
          <button 
            className="w95-button" 
            onClick={(e) => { e.stopPropagation(); onMinimize?.(); }}
            style={{ padding: '0px 2px', minWidth: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Minus size={12} />
          </button>
          <button 
            className="w95-button" 
            onClick={(e) => { e.stopPropagation(); onMaximize?.(); }}
            style={{ padding: '0px 2px', minWidth: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Square size={10} />
          </button>
          <button 
            className="w95-button" 
            style={{ 
              padding: '0px 2px', 
              minWidth: '18px', 
              height: '18px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 'bold'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ 
        padding: '12px', 
        flexGrow: 1, 
        overflow: 'auto', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#fff', // White content area for better readability
        margin: '2px',
        border: '1px solid var(--w95-border-dark)'
      }}>
        {children}
      </div>
    </motion.div>
  );
};
