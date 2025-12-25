// src/components/interactions/GlowPulse.jsx
// Mobile-optimized ghost kitten glow effect

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const GlowPulse = ({ onComplete, pageData }) => {
  useEffect(() => {
    const timer = setTimeout(() => onComplete?.(), 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  // Fewer particles on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const particleCount = isMobile ? 8 : 12;
  
  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {/* Main kitten glow */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Outer glow */}
        <motion.div
          className="absolute w-40 h-40 sm:w-56 sm:h-56 -left-20 -top-20 sm:-left-28 sm:-top-28 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(126, 200, 227, 0.35) 0%, rgba(126, 200, 227, 0.1) 50%, transparent 70%)' }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Inner glow */}
        <motion.div
          className="absolute w-24 h-24 sm:w-32 sm:h-32 -left-12 -top-12 sm:-left-16 sm:-top-16 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(126, 200, 227, 0.5) 30%, transparent 70%)', filter: 'blur(6px)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.5, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        
        {/* Kitten eyes */}
        <div className="relative flex gap-4 sm:gap-6 justify-center">
          <motion.div
            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white"
            style={{ boxShadow: '0 0 12px 6px rgba(126, 200, 227, 0.7)' }}
            animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white"
            style={{ boxShadow: '0 0 12px 6px rgba(126, 200, 227, 0.7)' }}
            animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
          />
        </div>
      </motion.div>
      
      {/* Floating particles */}
      {[...Array(particleCount)].map((_, i) => {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 70 + Math.random() * 40;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-glow/50"
            style={{ top: '33%', left: '50%', x, y, boxShadow: '0 0 4px 2px rgba(126, 200, 227, 0.3)' }}
            animate={{ x: [x, x + 8, x], y: [y - 8, y + 8, y - 8], opacity: [0.3, 0.7, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 3 + Math.random() * 1.5, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        );
      })}
      
      {/* Light rays - fewer on mobile */}
      {[...Array(isMobile ? 4 : 6)].map((_, i) => {
        const angle = (i / (isMobile ? 4 : 6)) * 360;
        return (
          <motion.div
            key={`ray-${i}`}
            className="absolute w-0.5 sm:w-1 h-20 sm:h-28 origin-bottom"
            style={{ top: '33%', left: '50%', transform: `rotate(${angle}deg)`, background: 'linear-gradient(to top, rgba(126, 200, 227, 0.3), transparent)' }}
            animate={{ opacity: [0.2, 0.4, 0.2], scaleY: [0.8, 1.1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          />
        );
      })}
      
      {/* Ground mist */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/4"
        style={{ background: 'linear-gradient(to top, rgba(126, 200, 227, 0.15), transparent)' }}
        animate={{ opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default GlowPulse;
