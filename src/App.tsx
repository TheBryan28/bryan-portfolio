import { useState } from 'react';
import './index.css';
import { Taskbar } from './components/Taskbar';
import { DesktopIcon } from './components/DesktopIcon';
import { ProfileWindow } from './components/Windows/ProfileWindow';
import { TerminalWindow } from './components/Windows/TerminalWindow';
import { ProjectsWindow } from './components/Windows/ProjectsWindow';
import { ContactCTAWindow } from './components/Windows/ContactCTAWindow';
import wallpaper from './assets/wallpaper-xp.png';

function App() {
  const [openWindows, setOpenWindows] = useState<Record<string, boolean>>({
    profile: true,
    terminal: true,
    projects: false,
    contact: false,
  });

  const [minimizedWindows, setMinimizedWindows] = useState<Record<string, boolean>>({});
  const [maximizedWindows, setMaximizedWindows] = useState<Record<string, boolean>>({});
  const [activeWindow, setActiveWindow] = useState<string>('terminal');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [lastOpenState, setLastOpenState] = useState<Record<string, boolean>>({});

  const handleStartClick = () => {
    // Check if there is at least one open window that is NOT minimized
    const hasVisibleWindows = Object.entries(openWindows).some(
      ([id, isOpen]) => isOpen && !minimizedWindows[id]
    );

    if (hasVisibleWindows) {
      // Minimize all currently visible windows and save their states
      const savedStates: Record<string, boolean> = {};
      const newMinimized = { ...minimizedWindows };
      
      Object.entries(openWindows).forEach(([id, isOpen]) => {
        if (isOpen) {
          savedStates[id] = !minimizedWindows[id]; // true if it was visible
          newMinimized[id] = true;
        }
      });

      setLastOpenState(savedStates);
      setMinimizedWindows(newMinimized);
      setActiveWindow('');
    } else {
      // If all are minimized, restore the ones that were visible before minimization
      const newMinimized = { ...minimizedWindows };
      let restoredAny = false;

      Object.entries(lastOpenState).forEach(([id, wasVisible]) => {
        if (wasVisible && openWindows[id]) {
          newMinimized[id] = false;
          restoredAny = true;
          setActiveWindow(id);
        }
      });

      // If we didn't restore anything (e.g. last state was empty), restore all open windows
      if (!restoredAny) {
        Object.entries(openWindows).forEach(([id, isOpen]) => {
          if (isOpen) {
            newMinimized[id] = false;
            setActiveWindow(id);
          }
        });
      }

      setMinimizedWindows(newMinimized);
    }
  };

  const toggleWindow = (id: string) => {
    if (!openWindows[id]) {
      // If closed, open it and focus
      setOpenWindows(prev => ({ ...prev, [id]: true }));
      setMinimizedWindows(prev => ({ ...prev, [id]: false }));
      setActiveWindow(id);
    } else {
      // If open
      if (activeWindow === id && !minimizedWindows[id]) {
        // If active and not minimized, minimize it
        setMinimizedWindows(prev => ({ ...prev, [id]: true }));
      } else {
        // If not active or minimized, restore and focus
        setMinimizedWindows(prev => ({ ...prev, [id]: false }));
        setActiveWindow(id);
      }
    }
  };

  const closeWindow = (id: string) => {
    setOpenWindows(prev => ({ ...prev, [id]: false }));
    if (activeWindow === id) setActiveWindow('');
  };

  const minimizeWindow = (id: string) => {
    setMinimizedWindows(prev => ({ ...prev, [id]: true }));
    if (activeWindow === id) setActiveWindow('');
  };

  const toggleMaximize = (id: string) => {
    setMaximizedWindows(prev => ({ ...prev, [id]: !prev[id] }));
    setActiveWindow(id);
  };

  const bringToFront = (id: string) => {
    setActiveWindow(id);
    setSelectedIcon(null);
    if (minimizedWindows[id]) {
      setMinimizedWindows(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDesktopClick = () => {
    setSelectedIcon(null);
  };

  return (
    <div 
      onClick={handleDesktopClick}
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'relative', 
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      
      {/* Desktop Area (everything except taskbar) */}
      <div style={{ flexGrow: 1, position: 'relative', width: '100%', overflow: 'hidden' }}>
        
        {/* Desktop Icons */}
        <div style={{ 
          padding: '20px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px', 
          width: 'fit-content',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}>

        <DesktopIcon 
          icon={<img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png" alt="Profile" width={32} height={32} style={{ imageRendering: 'pixelated' }} />} 
          label="My Profile" 
          isSelected={selectedIcon === 'profile'}
          onClick={() => setSelectedIcon('profile')}
          onDoubleClick={() => toggleWindow('profile')} 
        />
        <DesktopIcon 
          icon={<img src="https://win98icons.alexmeub.com/icons/png/directory_closed-4.png" alt="Projects" width={32} height={32} style={{ imageRendering: 'pixelated' }} />} 
          label="Projects" 
          isSelected={selectedIcon === 'projects'}
          onClick={() => setSelectedIcon('projects')}
          onDoubleClick={() => toggleWindow('projects')} 
        />
        <DesktopIcon 
          icon={<img src="https://win98icons.alexmeub.com/icons/png/console_prompt-0.png" alt="AI Terminal" width={32} height={32} style={{ imageRendering: 'pixelated' }} />} 
          label="AI Terminal" 
          isSelected={selectedIcon === 'terminal'}
          onClick={() => setSelectedIcon('terminal')}
          onDoubleClick={() => toggleWindow('terminal')} 
        />
        <DesktopIcon 
          icon={<img src="https://win98icons.alexmeub.com/icons/png/message_envelope_open-0.png" alt="Contact" width={32} height={32} style={{ imageRendering: 'pixelated' }} />} 
          label="Contact" 
          isSelected={selectedIcon === 'contact'}
          onClick={() => setSelectedIcon('contact')}
          onDoubleClick={() => toggleWindow('contact')} 
        />
      </div>

      {/* Windows */}
      {openWindows.profile && !minimizedWindows.profile && (
        <ProfileWindow 
          onClose={() => closeWindow('profile')} 
          onMinimize={() => minimizeWindow('profile')}
          onMaximize={() => toggleMaximize('profile')}
          isMaximized={maximizedWindows.profile}
          isActive={activeWindow === 'profile'}
          onFocus={() => bringToFront('profile')}
        />
      )}
      
      {openWindows.terminal && !minimizedWindows.terminal && (
        <TerminalWindow 
          onClose={() => closeWindow('terminal')} 
          onMinimize={() => minimizeWindow('terminal')}
          onMaximize={() => toggleMaximize('terminal')}
          isMaximized={maximizedWindows.terminal}
          isActive={activeWindow === 'terminal'}
          onFocus={() => bringToFront('terminal')}
        />
      )}

      {openWindows.projects && !minimizedWindows.projects && (
        <ProjectsWindow 
          onClose={() => closeWindow('projects')} 
          onMinimize={() => minimizeWindow('projects')}
          onMaximize={() => toggleMaximize('projects')}
          isMaximized={maximizedWindows.projects}
          isActive={activeWindow === 'projects'}
          onFocus={() => bringToFront('projects')}
        />
      )}

      {openWindows.contact && !minimizedWindows.contact && (
        <ContactCTAWindow 
          onClose={() => closeWindow('contact')} 
          onMinimize={() => minimizeWindow('contact')}
          onMaximize={() => toggleMaximize('contact')}
          isMaximized={maximizedWindows.contact}
          isActive={activeWindow === 'contact'}
          onFocus={() => bringToFront('contact')}
        />
      )}
      </div>

      {/* Taskbar */}
      <Taskbar 
        openWindows={openWindows} 
        minimizedWindows={minimizedWindows}
        activeWindow={activeWindow} 
        onWindowClick={toggleWindow} 
        onStartClick={handleStartClick}
      />
    </div>
  );
}

export default App;
