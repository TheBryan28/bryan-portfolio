import React from 'react';
import { Window } from '../Window';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

// Inline SVGs to avoid dependency export mismatches
const GithubIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 20, color = 'currentColor', fill = 'none' }: { size?: number; color?: string; fill?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface ContactCTAWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  isActive: boolean;
  onFocus: () => void;
}

export const ContactCTAWindow: React.FC<ContactCTAWindowProps> = ({ 
  onClose, 
  onMinimize,
  onMaximize,
  isMaximized,
  isActive, 
  onFocus 
}) => {
  return (
    <Window 
      title="Contact Bryan Cruz" 
      icon={<Mail size={14} />} 
      onClose={onClose} 
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      isMaximized={isMaximized}
      isActive={isActive} 
      onFocus={onFocus}
      initialPosition={{ x: 220, y: 150 }}
      width={360}
    >
      <div style={{ textAlign: 'center', padding: '10px' }}>
        <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(58, 134, 255, 0.05)', borderRadius: '4px' }}>
          <h2 style={{ margin: '0 0 12px 0', color: 'var(--w95-title-bg)', fontSize: '22px', letterSpacing: '-0.5px', fontWeight: 'bold' }}>Let's Connect!</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: '1.5', textAlign: 'justify' }}>
            Have an exciting project in mind? Let's discuss system architecture, <span style={{ color: 'var(--accent-purple)', fontWeight: '600' }}>Generative AI</span> integration, or high-performance engineering.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 5px' }}>
          {/* LinkedIn Link */}
          <motion.a 
            href="https://www.linkedin.com/in/bryan-santiago-cruz-angel-5454ab18a/" 
            target="_blank"
            rel="noopener noreferrer"
            className="w95-button"
            whileHover={{ scale: 1.02, backgroundColor: '#f0f0f0' }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px', 
              padding: '12px', 
              textDecoration: 'none', 
              color: '#000', 
              fontSize: '15px', 
              fontWeight: 'bold',
              borderLeftColor: '#fff',
              borderTopColor: '#fff'
            }}
          >
            <LinkedinIcon size={20} color="#0077B5" fill="#0077B5" />
            <span style={{ color: '#0077B5' }}>LinkedIn Profile</span>
          </motion.a>

          {/* Email Link */}
          <motion.a 
            href="mailto:bryan_sca386@outlook.com" 
            className="w95-button"
            whileHover={{ scale: 1.02, backgroundColor: '#f0f0f0' }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px', 
              padding: '12px', 
              textDecoration: 'none', 
              color: '#000', 
              fontSize: '15px', 
              fontWeight: 'bold',
              borderLeftColor: '#fff',
              borderTopColor: '#fff'
            }}
          >
            <Mail size={20} color="#D44638" />
            <span style={{ color: '#D44638' }}>Email Address</span>
          </motion.a>

          {/* GitHub Link */}
          <motion.a 
            href="https://github.com/TheBryan28" 
            target="_blank"
            rel="noopener noreferrer"
            className="w95-button"
            whileHover={{ scale: 1.02, backgroundColor: '#f0f0f0' }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px', 
              padding: '12px', 
              textDecoration: 'none', 
              color: '#000', 
              fontSize: '15px', 
              fontWeight: 'bold',
              borderLeftColor: '#fff',
              borderTopColor: '#fff'
            }}
          >
            <GithubIcon size={20} color="#333" />
            <span style={{ color: '#333' }}>GitHub Profile</span>
          </motion.a>
        </div>
      </div>
    </Window>
  );
};
