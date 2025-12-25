// src/components/interactions/GlowingEyes.jsx
// Positioned glowing eyes effect with customizable location

import React from 'react';
import { motion } from 'framer-motion';

const GlowingEyes = ({ position = { x: 50, y: 30 }, size = 'medium', color = 'cyan' }) => {
  // Size configurations
  const sizeConfig = {
    small: { eye: 'w-2 h-2 sm:w-2.5 sm:h-2.5', gap: 'gap-3 sm:gap-4', glow: 8, blur: 4 },
    medium: { eye: 'w-3 h-3 sm:w-4 sm:h-4', gap: 'gap-4 sm:gap-6', glow: 12, blur: 6 },
    large: { eye: 'w-4 h-4 sm:w-5 sm:h-5', gap: 'gap-5 sm:gap-8', glow: 16, blur: 8 }
  };
  
  // Color configurations
  const colorConfig = {
    cyan: { 
      main: 'rgba(126, 200, 227, 0.9)', 
      glow: 'rgba(126, 200, 227, 0.7)',
      outer: 'rgba(126, 200, 227, 0.3)'
    },
    blue: { 
      main: 'rgba(96, 165, 250, 0.9)', 
      glow: 'rgba(96, 165, 250, 0.7)',
      outer: 'rgba(96, 165, 250, 0.3)'
    },
    white: { 
      main: 'rgba(255, 255, 255, 0.9)', 
      glow: 'rgba(200, 220, 235, 0.7)',
      outer: 'rgba(200, 220, 235, 0.3)'
    }
  };
  
  const sizeStyles = sizeConfig[size] || sizeConfig.medium;
  const colorStyles = colorConfig[color] || colorConfig.cyan;
  
  return (
    <motion.div
      className="absolute z-15 pointer-events-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Outer ambient glow */}
      <motion.div
        className="absolute -inset-8 sm:-inset-12 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colorStyles.outer} 0%, transparent 70%)`
        }}
        animate={{ 
          scale: [1, 1.2, 1], 
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
      />
      
      {/* Eyes container */}
      <div className={`relative flex ${sizeStyles.gap} justify-center`}>
        {/* Left eye */}
        <motion.div
          className={`${sizeStyles.eye} rounded-full`}
          style={{
            backgroundColor: colorStyles.main,
            boxShadow: `0 0 ${sizeStyles.glow}px ${sizeStyles.blur}px ${colorStyles.glow}`
          }}
          animate={{ 
            opacity: [0.7, 1, 0.7], 
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />
        
        {/* Right eye */}
        <motion.div
          className={`${sizeStyles.eye} rounded-full`}
          style={{
            backgroundColor: colorStyles.main,
            boxShadow: `0 0 ${sizeStyles.glow}px ${sizeStyles.blur}px ${colorStyles.glow}`
          }}
          animate={{ 
            opacity: [0.7, 1, 0.7], 
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: 'easeInOut',
            delay: 0.1 
          }}
        />
      </div>
      
      {/* Occasional blink effect */}
      <motion.div
        className="absolute inset-0 flex justify-center"
        style={{ gap: sizeStyles.gap }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: [1, 1, 1, 0.1, 1, 1, 1, 1, 1, 1] }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: 'easeInOut',
          delay: 2
        }}
      >
        <div 
          className={`${sizeStyles.eye} rounded-full bg-slate-900`}
          style={{ opacity: 0 }}
        />
        <div 
          className={`${sizeStyles.eye} rounded-full bg-slate-900`}
          style={{ opacity: 0 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default GlowingEyes;

