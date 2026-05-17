import React from 'react';
import { Window } from '../Window';
import { FolderOpen, Database, Layout, Bot, Eye, Award, ExternalLink } from 'lucide-react';

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
      title: 'Distributed Microservices Platform for Online Library',
      year: '2026',
      icon: <Database size={24} color="#000080" />,
      description: 'Engineered a high-availability backend architecture leveraging Java and Spring Boot. Implemented service discovery via Netflix Eureka and an API Gateway utilizing round-robin load balancing. Integrated Elasticsearch for high-performance indexing and built a responsive ReactJS frontend.',
      stack: 'Java, Spring Boot, Netflix Eureka, API Gateway, Elasticsearch, ReactJS',
      links: [
        { label: 'ReactJS_frontend', url: 'https://github.com/TheBryan28/ReactJS_frontend' },
        { label: 'RelatosPapelBackend', url: 'https://github.com/TheBryan28/RelatosPapelBackend' }
      ]
    },
    {
      title: 'tiny_ai_assistant (AI Moodle Assistant)',
      year: '2025',
      icon: <Bot size={24} color="#a100a1" />,
      description: 'Architected and shipped an AI content creator assistant for Moodle and an automated question generator using files and prompt engineering, enabling learning materials to be generated with high user satisfaction.',
      stack: 'Generative AI, Prompt Engineering, Moodle, Python, LLMs',
      links: [
        { label: 'tiny_ai_assistant', url: 'https://github.com/TheBryan28/tiny_ai_assistant' }
      ]
    },
    {
      title: 'Snap Theme Modernization',
      year: '2024',
      icon: <Layout size={24} color="#008080" />,
      description: 'Led the architectural modernization of the Snap theme for Moodle 4.x, aggressively eradicating technical debt and optimizing rendering performance to support thousands of concurrent global users.',
      stack: 'JavaScript, CSS/Sass, Moodle, UI Performance',
      links: [
        { label: 'Theme Snap Contributions', url: 'https://github.com/TheBryan28' }
      ]
    },
    {
      title: 'Publication: Monitoring & Evaluation of People using Deep Learning',
      year: '2021',
      icon: <Eye size={24} color="#005500" />,
      description: 'Developed a real-time computer vision pipeline for human activity monitoring using Python, YOLO, and Deep Learning architectures (TensorFlow/PyTorch). Engineered the object detection and human pose estimation models to process low-cost video streams in real-time, delivering an accessible e-health solution.',
      stack: 'Python, YOLO, TensorFlow, PyTorch, Deep Learning',
      links: [
        { label: 'Publication Details', url: 'https://github.com/TheBryan28' }
      ]
    },
    {
      title: 'National Recognition - "Ser Pilo Paga 2"',
      year: '2016 - 2021',
      icon: <Award size={24} color="#b08d00" />,
      description: 'Excellence Scholarship for achieving the highest score on the national standardized tests (ICFES), awarded by the Colombian government.',
      stack: 'Academic Excellence Award',
      links: []
    }
  ];

  return (
    <Window 
      title="Recent Projects & Contributions" 
      icon={<FolderOpen size={14} />} 
      onClose={onClose} 
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      isMaximized={isMaximized}
      isActive={isActive} 
      onFocus={onFocus}
      initialPosition={{ x: 140, y: 80 }}
      width={600}
      height={480}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 12px 0', borderBottom: '2px solid var(--w95-border-light-inner)', paddingBottom: '6px', color: '#111', fontSize: '18px', fontWeight: 'bold', flexShrink: 0 }}>
          Featured Portfolio & Research
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flexGrow: 1, overflowY: 'auto', paddingRight: '5px' }}>
          {projects.map((proj, idx) => (
            <div key={idx} className="w95-border" style={{ 
              display: 'flex', 
              gap: '15px', 
              padding: '12px', 
              backgroundColor: '#fafafa',
              transition: 'transform 0.1s ease',
              cursor: 'default',
              flexDirection: 'row',
              alignItems: 'flex-start'
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <h4 style={{ margin: '0', color: 'var(--w95-title-bg)', fontSize: '15px', fontWeight: 'bold' }}>
                    {proj.title}
                  </h4>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#666' }}>
                    {proj.year}
                  </span>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#333', lineHeight: '1.4', textAlign: 'justify' }}>
                  {proj.description}
                </p>
                
                {/* Tech tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: proj.links.length > 0 ? '8px' : '0' }}>
                  {proj.stack.split(', ').map(tech => (
                    <span key={tech} style={{ 
                      fontSize: '10px', 
                      color: 'var(--w95-title-bg)', 
                      backgroundColor: 'rgba(58, 134, 255, 0.08)', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      fontWeight: '600',
                      border: '1px solid rgba(58, 134, 255, 0.15)'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Repo links */}
                {proj.links.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {proj.links.map((link, lIdx) => (
                      <a 
                        key={lIdx} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w95-button" 
                        style={{ 
                          fontSize: '11px', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '4px', 
                          textDecoration: 'none', 
                          color: '#000',
                          padding: '2px 6px',
                          fontWeight: 'bold'
                        }}
                      >
                        <ExternalLink size={10} />
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
};
