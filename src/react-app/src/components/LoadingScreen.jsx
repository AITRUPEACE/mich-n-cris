// src/components/LoadingScreen.jsx
// Beautiful loading screen while assets load

import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ progress = 0 }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Ghost kitten eyes */}
        <motion.div
          className="flex gap-6 justify-center mb-8"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div 
            className="w-4 h-4 rounded-full bg-glow"
            style={{
              boxShadow: '0 0 15px 8px rgba(126, 200, 227, 0.6)',
            }}
          />
          <div 
            className="w-4 h-4 rounded-full bg-glow"
            style={{
              boxShadow: '0 0 15px 8px rgba(126, 200, 227, 0.6)',
            }}
          />
        </motion.div>
        
        {/* Title */}
        <h1 className="font-title text-2xl md:text-3xl text-white/80 mb-2">
          Mish'n'Cris Adventures
        </h1>
        <p className="font-story text-white/50 text-lg mb-8">
          Preparing your journey...
        </p>
        
        {/* Loading bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-glow to-purple-400 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Loading text */}
        <motion.p
          className="text-white/30 text-sm mt-4 font-story"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          {progress < 100 ? 'Loading...' : 'Ready!'}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;


