import React, { useState, useEffect } from 'react';

interface TaskbarProps {
  openWindows: Record<string, boolean>;
  minimizedWindows: Record<string, boolean>;
  activeWindow: string;
  onWindowClick: (id: string) => void;
  onStartClick: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ 
  openWindows, 
  minimizedWindows, 
  activeWindow, 
  onWindowClick,
  onStartClick
}) => {
  const [time, setTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 768);
  const [showWindowMenu, setShowWindowMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setShowWindowMenu(false);
  }, [activeWindow]);

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
      case 'profile': return 'My Profile';
      case 'terminal': return 'AI Terminal';
      case 'projects': return 'Projects';
      case 'contact': return 'Contact';
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
        onClick={onStartClick}
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
        <span style={{ fontSize: '14px' }}>Start</span>
      </button>

      {/* Vertical Divider */}
      <div style={{ 
        width: '2px', 
        height: '70%', 
        borderLeft: '1px solid var(--w95-border-dark)', 
        borderRight: '1px solid var(--w95-border-light)',
        marginRight: '10px'
      }} />

      {/* Open Windows Tabs / Mobile Collapsible Selector */}
      {isMobile ? (
        <div style={{ flexGrow: 1, display: 'flex', position: 'relative' }}>
          {(() => {
            const openWindowList = Object.entries(openWindows).filter(([_, isOpen]) => isOpen);
            const openCount = openWindowList.length;
            
            if (openCount === 0) return null;
            
            const activeWindowLabel = activeWindow ? getLabel(activeWindow) : 'Windows Menu';
            const activeWindowIcon = activeWindow ? getIcon(activeWindow) : null;
            
            return (
              <>
                <button
                  className="w95-button"
                  onClick={() => setShowWindowMenu(!showWindowMenu)}
                  style={{
                    height: '32px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 10px',
                    backgroundColor: showWindowMenu ? '#e0e0e0' : 'rgba(255,255,255,0.4)',
                    borderTop: showWindowMenu ? '2px solid var(--w95-border-darker)' : '2px solid var(--w95-border-light)',
                    borderLeft: showWindowMenu ? '2px solid var(--w95-border-darker)' : '2px solid var(--w95-border-light)',
                    borderBottom: showWindowMenu ? '2px solid var(--w95-border-light)' : '2px solid var(--w95-border-darker)',
                    borderRight: showWindowMenu ? '2px solid var(--w95-border-light)' : '2px solid var(--w95-border-darker)',
                    boxShadow: showWindowMenu ? 'inset -1px -1px 0 0 var(--w95-border-light-inner), inset 1px 1px 0 0 var(--w95-border-dark)' : 'inset -1px -1px 0 0 var(--w95-border-dark), inset 1px 1px 0 0 var(--w95-border-light-inner)',
                    fontWeight: 'bold',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeWindowIcon}
                    <span style={{ fontSize: '12px' }}>
                      {activeWindow ? `${activeWindowLabel} (${openCount})` : `Tasks (${openCount})`}
                    </span>
                  </div>
                  <span style={{ fontSize: '10px' }}>{showWindowMenu ? '▲' : '▼'}</span>
                </button>

                {showWindowMenu && (
                  <div 
                    className="w95-border"
                    style={{
                      position: 'absolute',
                      bottom: '36px',
                      left: '0px',
                      right: '0px',
                      backgroundColor: 'var(--w95-window-bg)',
                      zIndex: 1100,
                      padding: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      boxShadow: '0 -5px 15px rgba(0,0,0,0.3)',
                    }}
                  >
                    <div style={{
                      backgroundColor: '#000080',
                      color: '#fff',
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <span>Active Tasks</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowWindowMenu(false); }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#fff',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '10px',
                          padding: '0 4px'
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    {openWindowList.map(([id, _]) => {
                      const isActive = activeWindow === id;
                      const isMinimized = minimizedWindows[id];
                      return (
                        <button
                          key={id}
                          className="w95-button"
                          onClick={() => {
                            onWindowClick(id);
                            setShowWindowMenu(false);
                          }}
                          style={{
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            textAlign: 'left',
                            width: '100%',
                            backgroundColor: isActive ? '#e0e0e0' : 'rgba(255,255,255,0.6)',
                            borderTop: isActive ? '2px solid var(--w95-border-darker)' : '2px solid var(--w95-border-light)',
                            borderLeft: isActive ? '2px solid var(--w95-border-darker)' : '2px solid var(--w95-border-light)',
                            borderBottom: isActive ? '2px solid var(--w95-border-light)' : '2px solid var(--w95-border-darker)',
                            borderRight: isActive ? '2px solid var(--w95-border-light)' : '2px solid var(--w95-border-darker)',
                            boxShadow: isActive ? 'inset -1px -1px 0 0 var(--w95-border-light-inner), inset 1px 1px 0 0 var(--w95-border-dark)' : 'inset -1px -1px 0 0 var(--w95-border-dark), inset 1px 1px 0 0 var(--w95-border-light-inner)',
                            fontWeight: isActive ? 'bold' : 'normal',
                            opacity: isMinimized ? 0.6 : 1,
                          }}
                        >
                          {getIcon(id)}
                          <span style={{ fontSize: '12px', flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {getLabel(id)} {isMinimized ? '(Minimized)' : isActive ? '(Active)' : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      ) : (
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
      )}

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
