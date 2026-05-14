import React, { useState, useRef, useEffect } from 'react';
import { Window } from '../Window';
import { Terminal } from 'lucide-react';

interface TerminalWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  isActive: boolean;
  onFocus: () => void;
}

interface Message {
  text: string;
  isUser: boolean;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({ 
  onClose, 
  onMinimize,
  onMaximize,
  isMaximized,
  isActive, 
  onFocus 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'AI_Assistant_OS v1.0.0', isUser: false },
    { text: 'Conocimiento cargado: Perfil de Bryan Cruz.', isUser: false },
    { text: 'Escribe una pregunta sobre la experiencia o habilidades de Bryan...', isUser: false }
  ]);
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCommand = (cmd: string) => {
    const lowerCmd = cmd.toLowerCase();
    let response = '';

    if (lowerCmd.includes('experiencia') || lowerCmd.includes('trabajo')) {
      response = 'Bryan es un Senior Full Stack Engineer con experiencia arquitectando soluciones EdTech escalables e integrando LLMs avanzados.';
    } else if (lowerCmd.includes('stack') || lowerCmd.includes('tecnologia') || lowerCmd.includes('habilidades')) {
      response = 'Experto en frontend (React, Angular, JavaScript) y backend (PHP, Java, Node.js). También trabaja con microservicios (Spring Boot, Eureka).';
    } else if (lowerCmd.includes('educacion') || lowerCmd.includes('estudios')) {
      response = 'Actualmente está completando una Maestría (M.Sc.) en Ingeniería de Software.';
    } else if (lowerCmd.includes('ia') || lowerCmd.includes('ai') || lowerCmd.includes('inteligencia artificial')) {
      response = 'Es Especialista en IA, trabajando con LLMs avanzados, IA Generativa (RAG) y observabilidad inteligente (AIOps).';
    } else if (lowerCmd.includes('clear')) {
      setMessages([]);
      return;
    } else if (lowerCmd.trim() === '') {
      return;
    } else {
      response = 'No tengo información específica sobre eso en este momento. Pregunta sobre su experiencia, stack, educación o conocimientos en IA.';
    }

    setMessages(prev => [...prev, { text: cmd, isUser: true }, { text: response, isUser: false }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <Window 
      title="Terminal de IA - RAG" 
      icon={<Terminal size={14} />} 
      onClose={onClose} 
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      isMaximized={isMaximized}
      isActive={isActive} 
      onFocus={onFocus}
      initialPosition={{ x: 220, y: 120 }}
      width={500}
      height={350}
    >
      <div 
        style={{ 
          backgroundColor: '#000', 
          color: '#0f0', 
          fontFamily: "'VT323', monospace, Courier New", 
          fontSize: '18px',
          padding: '10px', 
          height: '100%', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={() => document.getElementById('terminal-input')?.focus()}
      >
        <div style={{ flexGrow: 1 }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: '8px', wordBreak: 'break-word' }}>
              {msg.isUser ? (
                <span style={{ color: '#fff' }}>C:\Users\Invitado&gt; {msg.text}</span>
              ) : (
                <span>{msg.text}</span>
              )}
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
        
        <div style={{ display: 'flex', marginTop: '10px' }}>
          <span style={{ color: '#fff', marginRight: '8px' }}>C:\Users\Invitado&gt;</span>
          <input 
            id="terminal-input"
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ 
              backgroundColor: 'transparent', 
              border: 'none', 
              color: '#fff', 
              fontFamily: "'VT323', monospace, Courier New", 
              fontSize: '18px',
              outline: 'none',
              flexGrow: 1,
              caretColor: '#fff'
            }} 
            autoFocus
            autoComplete="off"
          />
        </div>
      </div>
    </Window>
  );
};
