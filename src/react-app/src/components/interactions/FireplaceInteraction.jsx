// src/components/interactions/FireplaceInteraction.jsx
// Fireplace interaction: tap firewood bucket, then tap fireplace

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FireplaceInteraction = ({ onComplete, onFrameChange }) => {
  const [stage, setStage] = useState('bucket'); // 'bucket' -> 'fireplace' -> 'complete'
  
  const handleBucketTap = () => {
    if (stage === 'bucket') {
      setStage('fireplace');
      onFrameChange?.(1); // Switch to frame with fire
    }
  };
  
  const handleFireplaceTap = () => {
    if (stage === 'fireplace') {
      setStage('complete');
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }
  };
  
  return (
    <div className="absolute inset-0 z-20">
      {/* Firewood bucket tap area - approximate position */}
      {stage === 'bucket' && (
        <motion.div
          className="absolute bottom-3/8 left-2/9 w-16 h-16 sm:w-40 sm:h-40 cursor-pointer"
          onClick={handleBucketTap}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Visual hint */}
          <motion.div
            className="absolute inset-0 border-2 border-amber-400/50 rounded-xl bg-amber-400/5 backdrop-blur-lg"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-white/80 text-xs sm:text-sm font-story drop-shadow-lg">
              Tap bucket
            </span>
          </div>
        </motion.div>
      )}
      
      {/* Fireplace tap area */}
      {stage === 'fireplace' && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-32 sm:w-64 sm:h-40 cursor-pointer"
          onClick={handleFireplaceTap}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Visual hint */}
          <motion.div
            className="absolute inset-0 border-2 border-orange-400/50 rounded-lg bg-orange-400/10 backdrop-blur-sm"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-white/80 text-xs sm:text-sm font-story drop-shadow-lg">
              Tap fireplace
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FireplaceInteraction;


