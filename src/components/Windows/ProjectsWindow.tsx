import React from 'react';
import { Window } from '../Window';
import { FolderOpen, Code, Database, Layout } from 'lucide-react';

interface ProjectsWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  isActive: boolean;
  onFocus: () => void;
}

export const ProjectsWindow: React.FC<ProjectsWindowProps> = ({ 
  onClose, 
  onMinimize,
  onMaximize,
  isMaximized,
  isActive, 
  onFocus 
}) => {
  const projects = [
    {
      title: 'Plataforma EdTech Escalable',
      icon: <Layout size={24} color="#000080" />,
      description: 'Arquitectura de solución integral para educación usando React y Node.js, manejando alto tráfico.',
      stack: 'React, Node.js, AWS'
    },
    {
      title: 'Integración LLM & RAG',
      icon: <Database size={24} color="#000080" />,
      description: 'Implementación de IA generativa para mejorar la búsqueda de información y asistencia a usuarios.',
      stack: 'Python, OpenAI, Pinecone'
    },
    {
      title: 'Microservicios con Spring Boot',
      icon: <Code size={24} color="#000080" />,
      description: 'Desarrollo de backend robusto y escalable usando arquitectura de microservicios con Spring Boot y Eureka.',
      stack: 'Java, Spring Boot, Eureka'
    }
  ];

  return (
    <Window 
      title="Proyectos Recientes" 
      icon={<FolderOpen size={14} />} 
      onClose={onClose} 
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      isMaximized={isMaximized}
      isActive={isActive} 
      onFocus={onFocus}
      initialPosition={{ x: 120, y: 80 }}
      width={550}
    >
      <div style={{ height: '100%', overflowY: 'auto' }}>
        <h3 style={{ margin: '0 0 15px 0', borderBottom: '2px solid var(--w95-border-light-inner)', paddingBottom: '8px', color: '#111', fontSize: '18px' }}>Portafolio Destacado</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {projects.map((proj, idx) => (
            <div key={idx} className="w95-border" style={{ 
              display: 'flex', 
              gap: '15px', 
              padding: '12px', 
              backgroundColor: '#fafafa',
              transition: 'transform 0.1s ease',
              cursor: 'default'
            }}>
              <div className="w95-border-sunken" style={{ 
                width: '48px', 
                height: '48px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                backgroundColor: '#fff',
                flexShrink: 0
              }}>
                {proj.icon}
              </div>
              <div style={{ flexGrow: 1 }}>
                <h4 style={{ margin: '0 0 6px 0', color: 'var(--w95-title-bg)', fontSize: '16px' }}>{proj.title}</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#444', lineHeight: '1.4' }}>{proj.description}</p>
                <div style={{ 
                  fontSize: '11px', 
                  color: 'var(--w95-title-bg)', 
                  backgroundColor: 'rgba(58, 134, 255, 0.1)', 
                  padding: '4px 10px', 
                  display: 'inline-block', 
                  borderRadius: '12px',
                  fontWeight: '600',
                  border: '1px solid rgba(58, 134, 255, 0.2)'
                }}>
                  {proj.stack}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
};
