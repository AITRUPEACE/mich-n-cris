// src/components/interactions/LightSwitch.jsx
// Mobile-optimized light switch toggle interaction

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, LightbulbOff } from 'lucide-react';

const LightSwitch = ({ onComplete, pageData }) => {
  const [isLightOn, setIsLightOn] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const toggleLight = () => {
    setIsLightOn(!isLightOn);
    
    if (!hasInteracted) {
      setHasInteracted(true);
      setTimeout(() => onComplete?.(), 2000);
    }
  };
  
  return (
    <div className="absolute inset-0 z-20">
      {/* Dark overlay when lights are off */}
      <AnimatePresence>
        {!isLightOn && (
          <motion.div
            className="absolute inset-0 bg-blue-950/60 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
      
      {/* Warm glow when lights are on */}
      <AnimatePresence>
        {isLightOn && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Warm ambient light */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at 50% 40%, rgba(255, 200, 100, 0.25) 0%, transparent 55%)'
              }}
            />
            
            {/* Fireplace glow */}
            <motion.div
              className="absolute bottom-0 left-1/4 w-1/2 h-1/3"
              style={{
                background: 'radial-gradient(ellipse at 50% 100%, rgba(255, 150, 50, 0.35) 0%, transparent 65%)'
              }}
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Glowing eyes in window */}
      <AnimatePresence>
        {isLightOn && (
          <motion.div
            className="absolute top-1/4 right-1/4 flex gap-3 sm:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <motion.div
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-glow"
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ boxShadow: '0 0 8px 4px rgba(126, 200, 227, 0.5)' }}
            />
            <motion.div
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-glow"
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
              style={{ boxShadow: '0 0 8px 4px rgba(126, 200, 227, 0.5)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Light switch button - large touch target */}
      <motion.button
        className="absolute top-1/3 left-4 sm:left-8 md:left-12 p-4 sm:p-5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 touch-target"
        onClick={toggleLight}
        whileTap={{ scale: 0.92 }}
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <motion.div
          animate={{ 
            rotate: isLightOn ? 0 : 180,
            color: isLightOn ? '#fbbf24' : '#94a3b8'
          }}
          transition={{ duration: 0.25 }}
        >
          {isLightOn ? (
            <Lightbulb className="w-7 h-7 sm:w-8 sm:h-8" />
          ) : (
            <LightbulbOff className="w-7 h-7 sm:w-8 sm:h-8" />
          )}
        </motion.div>
        
        {/* Switch label */}
        <motion.span
          className="absolute -bottom-7 sm:-bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-xs sm:text-sm font-story whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          {isLightOn ? 'On' : 'Tap'}
        </motion.span>
      </motion.button>
      
      {/* Hint text */}
      {!hasInteracted && (
        <motion.div
          className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 text-center px-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <span className="text-white/40 text-xs sm:text-sm font-story">
            💡 Tap the switch
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default LightSwitch;
