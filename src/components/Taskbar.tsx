import React, { useState, useEffect } from 'react';

interface TaskbarProps {
  openWindows: Record<string, boolean>;
  minimizedWindows: Record<string, boolean>;
  activeWindow: string;
  onWindowClick: (id: string) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ 
  openWindows, 
  minimizedWindows, 
  activeWindow, 
  onWindowClick 
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getIcon = (id: string) => {
    switch(id) {
      case 'profile': return <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png" alt="Profile" width={16} height={16} style={{ imageRendering: 'pixelated' }} />;
      case 'terminal': return <img src="https://win98icons.alexmeub.com/icons/png/console_prompt-0.png" alt="Terminal" width={16} height={16} style={{ imageRendering: 'pixelated' }} />;
      case 'projects': return <img src="https://win98icons.alexmeub.com/icons/png/directory_closed-4.png" alt="Projects" width={16} height={16} style={{ imageRendering: 'pixelated' }} />;
      case 'contact': return <img src="https://win98icons.alexmeub.com/icons/png/message_envelope_open-0.png" alt="Contact" width={16} height={16} style={{ imageRendering: 'pixelated' }} />;
      default: return null;
    }
  };

  const getLabel = (id: string) => {
    switch(id) {
      case 'profile': return 'Mi Perfil';
      case 'terminal': return 'Terminal IA';
      case 'projects': return 'Proyectos';
      case 'contact': return 'Contacto';
      default: return id;
    }
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '40px',
      backgroundColor: 'rgba(236, 236, 236, 0.9)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      padding: '4px',
      zIndex: 1000,
      borderTop: '2px solid var(--w95-border-light)',
      boxShadow: 'inset 0 1px 0 0 var(--w95-border-light-inner), 0 -2px 15px rgba(0,0,0,0.2)'
    }}>
      {/* Start Button */}
      <button 
        className="w95-button" 
        style={{ 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          fontWeight: 'bold', 
          padding: '0 8px',
          marginRight: '8px',
          background: 'linear-gradient(135deg, #dfdfdf 0%, #c0c0c0 100%)'
        }}
      >
        <img src="https://win98icons.alexmeub.com/icons/png/windows_slanted-1.png" alt="Start" width={20} height={20} style={{ imageRendering: 'pixelated' }} />
        <span style={{ fontSize: '14px' }}>Inicio</span>
      </button>

      {/* Vertical Divider */}
      <div style={{ 
        width: '2px', 
        height: '70%', 
        borderLeft: '1px solid var(--w95-border-dark)', 
        borderRight: '1px solid var(--w95-border-light)',
        marginRight: '10px'
      }} />

      {/* Open Windows Tabs */}
      <div style={{ display: 'flex', gap: '6px', flexGrow: 1, overflowX: 'auto', paddingRight: '10px' }}>
        {Object.entries(openWindows).map(([id, isOpen]) => {
          if (!isOpen) return null;
          const isActive = activeWindow === id;
          const isMinimized = minimizedWindows[id];
          
          return (
            <button
              key={id}
              className={`w95-button ${isActive ? 'active' : ''}`}
              style={{
                height: '32px',
                minWidth: '120px',
                maxWidth: '180px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.1s ease',
                ...(isActive ? {
                  borderTop: '2px solid var(--w95-border-darker)',
                  borderLeft: '2px solid var(--w95-border-darker)',
                  borderBottom: '2px solid var(--w95-border-light)',
                  borderRight: '2px solid var(--w95-border-light)',
                  boxShadow: 'inset -1px -1px 0 0 var(--w95-border-light-inner), inset 1px 1px 0 0 var(--w95-border-dark)',
                  backgroundColor: '#e0e0e0',
                  padding: '5px 7px 3px 9px',
                  fontWeight: 'bold'
                } : {
                  backgroundColor: isMinimized ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)',
                  opacity: isMinimized ? 0.7 : 1
                })
              }}
              onClick={() => onWindowClick(id)}
            >
              <span style={{ opacity: isActive ? 1 : 0.7, display: 'flex', alignItems: 'center' }}>{getIcon(id)}</span>
              <span style={{ 
                fontSize: '12px', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                opacity: isActive ? 1 : 0.8,
                textDecoration: isMinimized ? 'none' : 'none'
              }}>
                {getLabel(id)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Clock Tray */}
      <div 
        className="w95-border-sunken"
        style={{
          padding: '0 12px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          fontSize: '13px',
          fontWeight: '500',
          backgroundColor: 'rgba(0,0,0,0.05)',
          borderRadius: '2px'
        }}
      >
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};
