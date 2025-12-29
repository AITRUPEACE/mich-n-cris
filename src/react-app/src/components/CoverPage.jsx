// src/components/CoverPage.jsx
// Cover page with centered content - supports video or image backgrounds

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { cn } from '../utils/cn';

const CoverPage = ({ pageData }) => {
  const hasVideo = pageData.backgroundVideo;
  const backgroundSrc = pageData.background;

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900">
      {/* Blurred background fill - creates atmosphere on wide screens */}
      <div 
        className="absolute inset-0 scale-110"
        style={{ 
          backgroundImage: `url(${backgroundSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(30px)',
          opacity: 0.5
        }}
      />
      
      {/* Main background image - always present */}
      <motion.img
        src={backgroundSrc}
        alt=""
        className="absolute inset-0 w-full h-full object-contain z-[1]"
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      
      {/* Video overlay - small centered portal on mobile, fills screen on desktop */}
      {hasVideo && (
        <motion.div
          className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        >
          {/* Video container - small centered window on mobile, scales up on larger screens */}
          <div 
            className="relative w-[100%] h-[47%] sm:w-[65%] sm:h-[45%] md:w-[80%] md:h-[65%] lg:w-full lg:h-full overflow-hidden"
            style={{
              // Soft vignette edge to blend with static image underneath
              maskImage: 'radial-gradient(ellipse 100% 100% at center, black 35%, transparent 59%)',
              WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at center, black 40%, transparent 85%)',
            }}
          >
            <video
              src={pageData.backgroundVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{
                // Crop out video's title bars by adjusting position
                objectPosition: 'center 35%',
              }}
            />
          </div>
        </motion.div>
      )}
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-[2]" />
      
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none z-[3]">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              opacity: [0.2, 0.7, 0.2],
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
      
      {/* Main content - centered */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-3 z-[10]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main title */}
        <motion.h1 
          className="font-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white text-center leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            textShadow: '0 0 40px rgba(212, 165, 116, 0.3), 0 4px 12px rgba(0,0,0,0.5)'
          }}
        >
          {pageData.text}
        </motion.h1>
        
        {/* Decorative divider */}
        <motion.div 
          className="flex items-center gap-3 my-2"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent to-amber-500/60" />
          <div className="w-2 h-2 bg-amber-400/80 rotate-45" />
          <div className="w-12 sm:w-16 h-px bg-gradient-to-l from-transparent to-amber-500/60" />
        </motion.div>
        
        {/* Subtitle */}
        <motion.h2 
          className="font-title text-sm sm:text-base md:text-lg text-amber-400/70 uppercase tracking-widest text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {pageData.subText}
        </motion.h2>
        
        {/* Begin hint */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className={cn(
            "px-6 sm:px-8 py-3 rounded-full",
            "bg-white/5 backdrop-blur-sm border border-white/10",
            "text-white/60 font-story text-sm sm:text-base",
            "flex items-center gap-2"
          )}>
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Tap → to begin</span>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Corner decorations */}
      <div className="absolute top-3 left-3 sm:top-5 sm:left-5 w-8 h-8 sm:w-12 sm:h-12 border-l-2 border-t-2 border-amber-500/20 rounded-tl-lg pointer-events-none z-[5]" />
      <div className="absolute top-3 right-3 sm:top-5 sm:right-5 w-8 h-8 sm:w-12 sm:h-12 border-r-2 border-t-2 border-amber-500/20 rounded-tr-lg pointer-events-none z-[5]" />
      <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 w-8 h-8 sm:w-12 sm:h-12 border-l-2 border-b-2 border-amber-500/20 rounded-bl-lg pointer-events-none z-[5]" />
      <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 w-8 h-8 sm:w-12 sm:h-12 border-r-2 border-b-2 border-amber-500/20 rounded-br-lg pointer-events-none z-[5]" />
    </div>
  );
};

export default CoverPage;
