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
    { text: 'AI_Assistant_OS v1.1.0', isUser: false },
    { text: 'Knowledge Base loaded successfully: Bryan Cruz\'s Profile.', isUser: false },
    { text: 'Type "help" to see all available commands, or ask a question about his experience, skills, education, AI expertise, or projects.', isUser: false }
  ]);
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCommand = (cmd: string) => {
    const lowerCmd = cmd.toLowerCase().trim();
    let response = '';

    if (lowerCmd === 'help') {
      response = 'Available commands: [experience] [skills] [education] [ai] [projects] [contact] [clear]\nYou can also ask general questions like "What is his tech stack?" or "Where does he work?".';
    } else if (lowerCmd.includes('experienc') || lowerCmd.includes('work') || lowerCmd.includes('job') || lowerCmd.includes('company')) {
      response = 'Bryan is a Senior Full-Stack Engineer currently working at Open LMS (US Remote). Previously, he was an Associate Software Engineer at Learning Technologies Group (LTG) and a WordPress & AI Consultant. He has built enterprise-grade plugins for 8M+ users.';
    } else if (lowerCmd.includes('stack') || lowerCmd.includes('tecnologi') || lowerCmd.includes('skills') || lowerCmd.includes('tech') || lowerCmd.includes('habilidad')) {
      response = 'Frontend: ReactJS, Next.js, Angular, Zustand, Tailwind CSS.\nBackend: Node.js, Java (Spring Boot, Spring Cloud), PHP, GraphQL, REST APIs.\nDatabases: MySQL, PostgreSQL, MongoDB, Redis, Pinecone.\nCloud & DevOps: AWS (EC2, S3, RDS), Docker, GitLab CI/CD, Jenkins.';
    } else if (lowerCmd.includes('educacion') || lowerCmd.includes('education') || lowerCmd.includes('studi') || lowerCmd.includes('degree') || lowerCmd.includes('master')) {
      response = 'Bryan is currently pursuing a Master of Science (M.Sc.) in Software Engineering at the International University of Rioja (Spain). He also holds a B.S. in Biomedical Engineering and multiple certifications in Generative AI Foundations.';
    } else if (lowerCmd.includes('ia') || lowerCmd.includes('ai') || lowerCmd.includes('inteligencia artificial') || lowerCmd.includes('llm') || lowerCmd.includes('rag') || lowerCmd.includes('generative')) {
      response = 'Bryan is an AI/ML Specialist. He has architected "tiny_ai_assistant" for Moodle, developed automated question generator pipelines, built RAG applications with Flowise and LangChain, and implemented YOLO-based real-time Computer Vision models.';
    } else if (lowerCmd.includes('project') || lowerCmd.includes('repositor') || lowerCmd.includes('code')) {
      response = 'Recent projects include:\n1. Distributed Microservices Platform (Spring Boot & React)\n2. tiny_ai_assistant (AI content creator for Moodle)\n3. Snap Theme Modernization (LTG)\n4. Deep Learning Activity Monitoring (YOLO publication).';
    } else if (lowerCmd.includes('contact') || lowerCmd.includes('mail') || lowerCmd.includes('email') || lowerCmd.includes('linkedin') || lowerCmd.includes('phone')) {
      response = 'You can reach Bryan at:\n- Email: bryan_sca386@outlook.com\n- GitHub: https://github.com/TheBryan28\n- LinkedIn: https://www.linkedin.com/in/bryan-santiago-cruz-angel-5454ab18a/';
    } else if (lowerCmd === 'clear') {
      setMessages([]);
      return;
    } else if (lowerCmd === '') {
      return;
    } else {
      response = 'Command or query not fully understood. Type "help" to see list of standard topics, or ask specifically about his experience, skills, education, or AI projects.';
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
      title="AI Terminal - RAG Knowledge Engine" 
      icon={<Terminal size={14} />} 
      onClose={onClose} 
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      isMaximized={isMaximized}
      isActive={isActive} 
      onFocus={onFocus}
      initialPosition={{ x: 200, y: 120 }}
      width={520}
      height={380}
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
            <div key={idx} style={{ marginBottom: '8px', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
              {msg.isUser ? (
                <span style={{ color: '#fff' }}>C:\Users\Guest&gt; {msg.text}</span>
              ) : (
                <span>{msg.text}</span>
              )}
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
        
        <div style={{ display: 'flex', marginTop: '10px', flexShrink: 0 }}>
          <span style={{ color: '#fff', marginRight: '8px' }}>C:\Users\Guest&gt;</span>
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
