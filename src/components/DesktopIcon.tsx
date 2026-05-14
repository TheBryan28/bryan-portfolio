import React from 'react';

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  onDoubleClick: () => void;
  isSelected?: boolean;
  onClick?: () => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ 
  icon, 
  label, 
  onDoubleClick, 
  isSelected = false,
  onClick 
}) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobile) {
      onDoubleClick();
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`desktop-icon ${isSelected ? 'selected' : ''}`}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '4px',
        width: '85px',
        padding: '8px 4px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        borderRadius: '4px',
        userSelect: 'none'
      }}
      onClick={handleClick}
      onDoubleClick={!isMobile ? onDoubleClick : undefined}
    >
      <div className="icon-wrapper" style={{
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        {icon}
      </div>
      <span className="icon-label" style={{ 
        color: 'white', 
        fontSize: '12px', 
        textAlign: 'center',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        padding: '2px 4px',
        width: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {label}
      </span>
    </div>
  );
};
