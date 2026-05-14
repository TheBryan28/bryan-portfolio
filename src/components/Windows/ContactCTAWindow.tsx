import React from 'react';
import { Window } from '../Window';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

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
      title="Contactar a Bryan" 
      icon={<Phone size={14} />} 
      onClose={onClose} 
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      isMaximized={isMaximized}
      isActive={isActive} 
      onFocus={onFocus}
      initialPosition={{ x: 200, y: 150 }}
      width={350}
    >
      <div style={{ textAlign: 'center', padding: '10px' }}>
        <div style={{ marginBottom: '25px', padding: '15px', background: 'rgba(58, 134, 255, 0.05)', borderRadius: '4px' }}>
          <h2 style={{ margin: '0 0 12px 0', color: 'var(--w95-title-bg)', fontSize: '24px', letterSpacing: '-0.5px' }}>¿Hablamos?</h2>
          <p style={{ margin: 0, fontSize: '15px', color: '#444', lineHeight: '1.5' }}>
            ¿Tienes un proyecto en mente? Hablemos sobre arquitecturas, <span style={{ color: 'var(--accent-purple)', fontWeight: '600' }}>IA</span> o desarrollo de alto impacto.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 10px' }}>
          <motion.a 
            href="https://wa.me/573123456789" 
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
              padding: '14px', 
              textDecoration: 'none', 
              color: '#000', 
              fontSize: '16px', 
              fontWeight: 'bold',
              borderLeftColor: '#fff',
              borderTopColor: '#fff'
            }}
          >
            <MessageCircle size={22} fill="#25D366" color="#fff" />
            <span style={{ color: '#128C7E' }}>WhatsApp Business</span>
          </motion.a>

          <motion.a 
            href="mailto:contacto@bryancruz.dev" 
            className="w95-button"
            whileHover={{ scale: 1.02, backgroundColor: '#f0f0f0' }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px', 
              padding: '14px', 
              textDecoration: 'none', 
              color: '#000', 
              fontSize: '16px', 
              fontWeight: 'bold',
              borderLeftColor: '#fff',
              borderTopColor: '#fff'
            }}
          >
            <Mail size={22} color="#D44638" />
            <span style={{ color: '#D44638' }}>Correo Electrónico</span>
          </motion.a>
        </div>
      </div>
    </Window>
  );
};
