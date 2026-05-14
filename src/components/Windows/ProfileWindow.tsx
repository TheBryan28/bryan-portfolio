import React from 'react';
import { Window } from '../Window';
import { User } from 'lucide-react';
import profilePhoto from '../../assets/profile.png';

interface ProfileWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  isActive: boolean;
  onFocus: () => void;
}

export const ProfileWindow: React.FC<ProfileWindowProps> = ({ 
  onClose, 
  onMinimize,
  onMaximize,
  isMaximized,
  isActive, 
  onFocus 
}) => {
  return (
    <Window 
      title="Perfil de Bryan" 
      icon={<User size={14} />} 
      onClose={onClose} 
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      isMaximized={isMaximized}
      isActive={isActive} 
      onFocus={onFocus}
      initialPosition={{ x: 150, y: 40 }}
      width={480}
    >
      <div style={{ height: '100%' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'flex-start' }}>
          <div className="w95-border-sunken" style={{ 
            width: '120px', 
            height: '140px', 
            backgroundColor: '#f0f0f0', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <img 
              src={profilePhoto} 
              alt="Bryan Cruz" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover'
              }} 
            />
          </div>
          <div style={{ flexGrow: 1 }}>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', color: 'var(--w95-title-bg)', borderBottom: '2px solid var(--accent-blue)', paddingBottom: '4px' }}>
              Bryan Cruz
            </h2>
            <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', fontSize: '15px', color: '#444' }}>
              Senior Full Stack Engineer & <span style={{ color: 'var(--accent-pink)' }}>AI Specialist</span>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['React', 'Node.js', 'Java', 'AI/LLM', 'Spring Boot'].map(tech => (
                <span key={tech} style={{ 
                  fontSize: '11px', 
                  padding: '2px 8px', 
                  backgroundColor: '#eee', 
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  fontWeight: '500'
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="w95-border-sunken" style={{ 
          padding: '15px', 
          fontSize: '14px', 
          lineHeight: '1.6', 
          backgroundColor: '#fafafa',
          color: '#333'
        }}>
          <p style={{ marginBottom: '12px' }}>
            <strong>Resumen Profesional:</strong>
          </p>
          <p style={{ textAlign: 'justify' }}>
            Ingeniero Full Stack Senior y Especialista en IA con un historial comprobado de arquitectura de soluciones EdTech escalables e integración de LLMs avanzados. Experto en ecosistemas frontend modernos (React, Angular, JavaScript) y arquitecturas backend robustas (PHP, Java, Node.js).
          </p>
          <p style={{ textAlign: 'justify', marginTop: '12px' }}>
            Actualmente cursando una Maestría en Ingeniería de Software, expandiendo capacidades técnicas en microservicios, observabilidad inteligente (AIOps) y ciberseguridad aplicada.
          </p>
        </div>
      </div>
    </Window>
  );
};
