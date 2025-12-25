// src/components/interactions/CosmicFloat.jsx
// Mobile-optimized floating mushroom field effect

import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const CosmicFloat = ({ onComplete, pageData }) => {
  useEffect(() => {
    const timer = setTimeout(() => onComplete?.(), 6000);
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Mushroom positions - fewer on mobile
  const mushrooms = useMemo(() => [
    { x: '20%', y: '60%', size: 'lg', delay: 0 },
    { x: '45%', y: '55%', size: 'lg', delay: 0.4 },
    { x: '75%', y: '58%', size: 'lg', delay: 0.2 },
    ...(isMobile ? [] : [
      { x: '35%', y: '70%', size: 'md', delay: 0.3 },
      { x: '65%', y: '68%', size: 'md', delay: 0.5 },
      { x: '15%', y: '75%', size: 'sm', delay: 0.7 },
      { x: '85%', y: '72%', size: 'sm', delay: 0.6 },
    ])
  ], [isMobile]);
  
  const sizeMap = {
    sm: { w: 25, h: 18, glow: 12 },
    md: { w: 40, h: 28, glow: 20 },
    lg: { w: 55, h: 40, glow: 28 },
  };
  
  const sparkleCount = isMobile ? 15 : 25;
  
  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {/* Ambient cosmic glow */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(139, 92, 246, 0.15) 0%, transparent 55%)' }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Floating mushrooms */}
      {mushrooms.map((mushroom, i) => {
        const size = sizeMap[mushroom.size];
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: mushroom.x, top: mushroom.y, width: size.w, height: size.h }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: [-4, 4, -4], opacity: 1 }}
            transition={{
              y: { duration: 2.5 + Math.random() * 0.5, repeat: Infinity, ease: 'easeInOut', delay: mushroom.delay },
              opacity: { duration: 0.8, delay: mushroom.delay }
            }}
          >
            {/* Mushroom glow */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: size.glow * 2.5,
                height: size.glow * 1.8,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.5) 0%, rgba(139, 92, 246, 0.15) 50%, transparent 70%)',
                filter: 'blur(8px)',
              }}
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: mushroom.delay }}
            />
            
            {/* Mushroom cap */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full bg-gradient-to-t from-purple-600/40 to-purple-400/25"
              style={{ width: size.w, height: size.h * 0.6, boxShadow: `0 0 ${size.glow}px ${size.glow / 2}px rgba(139, 92, 246, 0.4)` }}
            />
          </motion.div>
        );
      })}
      
      {/* Rising sparkles */}
      {[...Array(sparkleCount)].map((_, i) => {
        const startX = 10 + Math.random() * 80;
        const startY = 55 + Math.random() * 35;
        
        return (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-purple-300"
            style={{ left: `${startX}%`, top: `${startY}%`, boxShadow: '0 0 3px 1px rgba(196, 181, 253, 0.5)' }}
            animate={{
              y: [0, -80, -150],
              x: [0, Math.random() * 15 - 7, Math.random() * 30 - 15],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{ duration: 3.5 + Math.random() * 1.5, repeat: Infinity, delay: Math.random() * 2.5, ease: 'easeOut' }}
          />
        );
      })}
      
      {/* Floating cat */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: [-15, 15, -15], opacity: [0, 1, 1] }}
        transition={{ y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 1.5, delay: 0.8 } }}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" style={{ background: 'radial-gradient(circle, rgba(126, 200, 227, 0.5) 0%, rgba(139, 92, 246, 0.25) 50%, transparent 70%)', filter: 'blur(12px)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3 sm:gap-4">
          <motion.div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white" style={{ boxShadow: '0 0 8px 4px rgba(126, 200, 227, 0.7)' }} animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} />
          <motion.div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white" style={{ boxShadow: '0 0 8px 4px rgba(126, 200, 227, 0.7)' }} animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity, delay: 0.1 }} />
        </div>
      </motion.div>
      
      {/* Ground mist */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/5"
        style={{ background: 'linear-gradient(to top, rgba(139, 92, 246, 0.25), transparent)' }}
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default CosmicFloat;
