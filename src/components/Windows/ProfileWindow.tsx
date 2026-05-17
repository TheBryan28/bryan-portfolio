import React, { useState } from 'react';
import { Window } from '../Window';
import { User, Mail, Briefcase, GraduationCap, Code } from 'lucide-react';
import profilePhoto from '../../assets/profile.png';

// Inline SVGs to avoid dependency export mismatches
const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const resumePdf = new URL('../../assets/BryanCruzFullstack.pdf', import.meta.url).href;

interface ProfileWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  isActive: boolean;
  onFocus: () => void;
}

type TabType = 'general' | 'skills' | 'experience' | 'education';

export const ProfileWindow: React.FC<ProfileWindowProps> = ({ 
  onClose, 
  onMinimize,
  onMaximize,
  isMaximized,
  isActive, 
  onFocus 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('general');

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <User size={12} /> },
    { id: 'skills', label: 'Skills', icon: <Code size={12} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={12} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={12} /> },
  ];

  return (
    <Window 
      title="Bryan Cruz - Professional Profile" 
      icon={<User size={14} />} 
      onClose={onClose} 
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      isMaximized={isMaximized}
      isActive={isActive} 
      onFocus={onFocus}
      initialPosition={{ x: 80, y: 40 }}
      width={600}
      height={520}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Tab Headers */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '2px solid var(--w95-border-dark)', 
          marginBottom: '10px',
          paddingLeft: '5px',
          gap: '2px',
          flexShrink: 0
        }}>
          {tabs.map((tab) => {
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '12px',
                  fontWeight: isCurrent ? 'bold' : 'normal',
                  borderTop: '2px solid var(--w95-border-light)',
                  borderLeft: '2px solid var(--w95-border-light)',
                  borderRight: '2px solid var(--w95-border-darker)',
                  borderBottom: isCurrent ? '2px solid var(--w95-window-bg)' : '2px solid var(--w95-border-dark)',
                  backgroundColor: isCurrent ? 'var(--w95-window-bg)' : '#dcdcdc',
                  marginBottom: isCurrent ? '-2px' : '0px',
                  outline: 'none',
                  zIndex: isCurrent ? 2 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderTopLeftRadius: '3px',
                  borderTopRightRadius: '3px',
                  color: isCurrent ? '#000' : '#555',
                  boxShadow: isCurrent ? 'none' : 'inset -1px -1px 0 0 #b0b0b0'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div style={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexShrink: 0 }}>
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
                  <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', color: 'var(--w95-title-bg)', borderBottom: '2px solid var(--accent-blue)', paddingBottom: '4px', fontWeight: 'bold' }}>
                    Bryan Cruz
                  </h2>
                  <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '15px', color: '#444' }}>
                    Senior Full Stack Engineer & <span style={{ color: 'var(--accent-pink)' }}>AI Specialist</span>
                  </p>
                  
                  {/* Quick Contact Links */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                    <a href="mailto:bryan_sca386@outlook.com" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '500' }}>
                      <Mail size={13} /> bryan_sca386@outlook.com
                    </a>
                    <a href="https://github.com/TheBryan28" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '500' }}>
                      <GithubIcon size={13} /> github.com/TheBryan28
                    </a>
                    <a href="https://www.linkedin.com/in/bryan-santiago-cruz-angel-5454ab18a/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '500' }}>
                      <LinkedinIcon size={13} /> linkedin.com/in/bryan-santiago-cruz-angel-5454ab18a/
                    </a>
                  </div>

                  {/* Download Resume Button */}
                  <div style={{ marginTop: '14px' }}>
                    <a 
                      href={resumePdf} 
                      download="BryanCruzFullstack.pdf"
                      className="w95-button"
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        textDecoration: 'none', 
                        color: '#000', 
                        fontSize: '12px', 
                        fontWeight: 'bold',
                        padding: '6px 12px',
                        borderLeftColor: '#fff',
                        borderTopColor: '#fff',
                        boxShadow: 'inset -1px -1px 0 0 var(--w95-border-dark), inset 1px 1px 0 0 var(--w95-border-light-inner)'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000080' }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download Resume (PDF)
                    </a>
                  </div>
                </div>
              </div>

              {/* Summary box */}
              <div className="w95-border-sunken" style={{ 
                padding: '12px', 
                fontSize: '13px', 
                lineHeight: '1.5', 
                backgroundColor: '#fafafa',
                color: '#333',
                flexGrow: 1,
                overflowY: 'auto'
              }}>
                <p style={{ marginBottom: '8px' }}>
                  <strong>Professional Summary:</strong>
                </p>
                <p style={{ textAlign: 'justify', marginBottom: '8px' }}>
                  Senior Full-Stack Engineer with a proven track record of building scalable EdTech solutions and integrating advanced features with generative AI models (LLMs, RAG, Flowise). Expert in front-end ecosystems (React, Angular), enterprise back-end frameworks (Java/Spring Boot, Node.js/Next.js), and PHP platforms (Moodle, WordPress).
                </p>
                <p style={{ textAlign: 'justify', marginBottom: '8px' }}>
                  Adept at technical leadership and driving end-to-end project lifecycles, leveraging containerized infrastructure (Docker) and cloud platforms to orchestrate modern deployments.
                </p>
                <p style={{ textAlign: 'justify' }}>
                  Currently pursuing a Master's degree in Software Engineering, expanding expertise in microservices architectures (Java, Spring Cloud) and the implementation of cybersecurity practices (CWE, Pentesting) for the development of robust and secure software. Seeking high-impact roles in AI-driven architecture or senior full-stack engineering.
                </p>
              </div>
            </div>
          )}

          {/* SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="w95-border-sunken" style={{ 
              padding: '12px', 
              fontSize: '13px', 
              backgroundColor: '#fafafa',
              color: '#333',
              flexGrow: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {[
                { title: 'Languages', items: ['JavaScript (ES6+)', 'TypeScript', 'PHP', 'Java', 'SQL'] },
                { title: 'Frontend', items: ['ReactJS', 'Next.js', 'Angular 2+', 'Zustand', 'Tailwind CSS', 'HTML5/CSS3'] },
                { title: 'Backend & Cloud', items: ['Node.js', 'GraphQL', 'REST API', 'Spring Boot', 'Netflix Eureka', 'API Gateway', 'AWS (EC2, S3, RDS)', 'Docker', 'CI/CD (GitLab, Jenkins)', 'ElasticSearch'] },
                { title: 'AI & LLMs', items: ['Flowise', 'RAG', 'LangChain', 'Prompt Engineering', 'Computer Vision (YOLO)', 'Fine-tuning', 'Vector Databases (Pinecone)'] },
                { title: 'Databases', items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'] },
                { title: 'Cybersecurity', items: ['Vulnerability Analysis (CWE)', 'Penetration Testing', 'Parrot Security OS', 'Burp Suite', 'Secure Authentication (Ghost JWT)'] },
                { title: 'Testing & QA', items: ['PHPUnit', 'Behat (BDD)', 'Jest', 'Cypress', 'TDD', 'E2E Testing'] },
                { title: 'Languages Spoken', items: ['English (Advanced C1)', 'Spanish (Native)', 'Portuguese (Basic)'] },
              ].map((category, index) => (
                <div key={index} style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--w95-title-bg)', display: 'block', marginBottom: '4px' }}>
                    {category.title}:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {category.items.map((tech) => (
                      <span key={tech} style={{ 
                        fontSize: '11px', 
                        padding: '1px 6px', 
                        backgroundColor: '#eee', 
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontWeight: '500'
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EXPERIENCE TAB */}
          {activeTab === 'experience' && (
            <div className="w95-border-sunken" style={{ 
              padding: '12px', 
              fontSize: '13px', 
              backgroundColor: '#fafafa',
              color: '#333',
              flexGrow: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              {/* Job 1 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '5px' }}>
                  <div>
                    <strong style={{ fontSize: '14px' }}>Full Stack Software Engineer & Generative AI</strong>
                    <div style={{ color: '#555', fontWeight: '500' }}>Open LMS (General Atlantic Portfolio - US Remote)</div>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--accent-pink)', backgroundColor: '#fff0f5', padding: '1px 6px', border: '1px solid var(--accent-pink)', borderRadius: '3px' }}>
                    Feb 2025 - Present
                  </div>
                </div>
                <ul style={{ paddingLeft: '18px', margin: 0, textAlign: 'justify', lineHeight: '1.4' }}>
                  <li style={{ marginBottom: '4px' }}>
                    <strong>AI Project Leadership:</strong> Led the end-to-end product architecture of enterprise-grade AI plugins, radically streamlining content creation workflows for an ecosystem of more than 8 million users in over 120 countries.
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    <strong>AI Solution Development:</strong> Architected and shipped <code>tiny_ai_assistant</code> (AI content creator for Moodle) and an automated question generator using files and prompt engineering, enabling learning materials to be generated with high user satisfaction and significant time savings for educators.
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    <strong>Quality Automation (DevOps + AI):</strong> Implemented GitLab pipelines that incorporate Artificial Intelligence routines for reviewing and validating potential errors in unit and automated tests, raising the quality of the code and the CI/CD process.
                  </li>
                </ul>
              </div>

              {/* Job 2 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '5px' }}>
                  <div>
                    <strong style={{ fontSize: '14px' }}>Associate Software Engineer</strong>
                    <div style={{ color: '#555', fontWeight: '500' }}>Learning Technologies Group (UK Remote)</div>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#008080', backgroundColor: '#e6f2f2', padding: '1px 6px', border: '1px solid #008080', borderRadius: '3px' }}>
                    Mar 2022 - Feb 2025
                  </div>
                </div>
                <ul style={{ paddingLeft: '18px', margin: 0, textAlign: 'justify', lineHeight: '1.4' }}>
                  <li style={{ marginBottom: '4px' }}>
                    <strong>Lead Refactoring:</strong> Led the architectural modernization of the Snap theme for Moodle 4.x, aggressively eradicating technical debt and optimizing rendering performance to support thousands of concurrent global users.
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    <strong>Reactive UI Architecture:</strong> Redesigned complex interfaces using Angular and advanced reactive state management patterns (ReactJS principles), driving the development of highly modular user experiences.
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    <strong>System Optimization & Reliability:</strong> Optimized critical enterprise modules and legacy plugins. Engineered robust web services, tuned MySQL database queries, and implemented testing practices to ensure platform stability and high availability.
                  </li>
                </ul>
              </div>

              {/* Job 3 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '5px' }}>
                  <div>
                    <strong style={{ fontSize: '14px' }}>WordPress Consultant & Automations</strong>
                    <div style={{ color: '#555', fontWeight: '500' }}>Freelancer</div>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#666', backgroundColor: '#eee', padding: '1px 6px', border: '1px solid #999', borderRadius: '3px' }}>
                    Jun 2021 - Aug 2023
                  </div>
                </div>
                <ul style={{ paddingLeft: '18px', margin: 0, textAlign: 'justify', lineHeight: '1.4' }}>
                  <li style={{ marginBottom: '4px' }}>
                    <strong>Scalable Web Architecture:</strong> Architected and scaled digital presence for SMEs, optimizing database performance and security for WooCommerce environments, resulting in faster load times and increased conversion rates.
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    <strong>Artificial Intelligence Integration:</strong> Implemented generative AI solutions for the efficient creation of content assets, optimizing clients' digital strategies (ad variations using AI, WhatsApp automations, Social media design).
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    <strong>Analysis and Data:</strong> Managed analytics and metrics tools (Meta Ads) for data-driven decision-making and performance optimization by objectives (traffic, leads).
                  </li>
                </ul>
              </div>

              {/* Job 4 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', borderBottom: '1px solid #ccc', paddingBottom: '3px', marginBottom: '5px' }}>
                  <div>
                    <strong style={{ fontSize: '14px' }}>Artificial Intelligence Research Intern</strong>
                    <div style={{ color: '#555', fontWeight: '500' }}>Universidad del Rosario (Apprenticeship)</div>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#666', backgroundColor: '#eee', padding: '1px 6px', border: '1px solid #999', borderRadius: '3px' }}>
                    Jan 2021 - Aug 2021
                  </div>
                </div>
                <ul style={{ paddingLeft: '18px', margin: 0, textAlign: 'justify', lineHeight: '1.4' }}>
                  <li style={{ marginBottom: '4px' }}>
                    <strong>Deep Learning:</strong> Developed cutting-edge research in Deep Learning, implementing the YOLO (You Only Look Once) model with Python and Google Colab for computer vision applications in human activity monitoring and evaluation.
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    <strong>International Publication:</strong> Authored and presented research at the 17th International Symposium on Medical Information Processing in Brazil, validating technical findings at a global academic level.
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    <strong>AI Research:</strong> Contributed to the university's AI research group, strengthening theoretical and practical understanding of AI fundamentals, which are now applied in the development of Moodle plugins.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* EDUCATION TAB */}
          {activeTab === 'education' && (
            <div className="w95-border-sunken" style={{ 
              padding: '12px', 
              fontSize: '13px', 
              backgroundColor: '#fafafa',
              color: '#333',
              flexGrow: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {[
                {
                  title: 'Generative AI Foundations',
                  institution: 'Certiport, a Pearson VUE business',
                  year: '2026',
                  type: 'Certification'
                },
                {
                  title: 'Master of Science (M.Sc.) in Software Engineering',
                  institution: 'International University of Rioja - Spain',
                  year: '2025 - Present',
                  type: 'Degree'
                },
                {
                  title: 'Advanced Program in Generative AI',
                  institution: 'International University of Rioja - Spain',
                  year: '2025 - Present',
                  type: 'Specialization'
                },
                {
                  title: 'Fullstack Web Development Bootcamp',
                  institution: 'UT Talento Tech - Cymetria',
                  year: '2024',
                  type: 'Bootcamp'
                },
                {
                  title: 'Biomedical Engineering',
                  institution: 'Colombian School of Engineering Julio Garavito & Rosario University - Colombia',
                  year: '2016 - 2021',
                  type: 'Degree'
                }
              ].map((item, index) => (
                <div key={index} style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#000' }}>{item.title}</strong>
                    <div style={{ color: '#555', fontSize: '12px' }}>{item.institution}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ 
                      fontSize: '10px', 
                      backgroundColor: 'rgba(58, 134, 255, 0.1)', 
                      color: 'var(--accent-blue)', 
                      padding: '2px 6px', 
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      border: '1px solid rgba(58, 134, 255, 0.2)',
                      display: 'inline-block',
                      marginBottom: '4px'
                    }}>
                      {item.type}
                    </span>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#666' }}>{item.year}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Properties Dialog Footer (OK / Cancel Buttons) */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '8px', 
            marginTop: '10px', 
            flexShrink: 0 
          }}>
            <button 
              className="w95-button" 
              onClick={onClose}
              style={{ minWidth: '70px', fontWeight: 'bold' }}
            >
              OK
            </button>
            <button 
              className="w95-button" 
              onClick={onClose}
              style={{ minWidth: '70px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Window>
  );
};
