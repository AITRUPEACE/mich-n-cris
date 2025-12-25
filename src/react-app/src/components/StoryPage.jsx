// src/components/StoryPage.jsx
// Mobile-first story page with responsive text and interactions

import React, { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import MultiFramePage from './MultiFramePage';

// Lazy load interaction components
const LightSwitch = lazy(() => import('./interactions/LightSwitch'));
const WindParticles = lazy(() => import('./interactions/WindParticles'));
const GlowPulse = lazy(() => import('./interactions/GlowPulse'));
const CosmicFloat = lazy(() => import('./interactions/CosmicFloat'));
const ParallaxStars = lazy(() => import('./interactions/ParallaxStars'));

// Lazy load ambient effect components
const SnowAmbient = lazy(() => import('./interactions/SnowAmbient'));
const GlowingEyes = lazy(() => import('./interactions/GlowingEyes'));

// Loading fallback
const InteractionLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
  </div>
);

const StoryPage = ({ pageData, pageIndex, onComplete }) => {
  const [interactionComplete, setInteractionComplete] = useState(false);
  
  // If this is a multi-frame page, delegate to MultiFramePage
  if (pageData.type === 'multi-frame') {
    return (
      <MultiFramePage 
        pageData={pageData} 
        pageIndex={pageIndex}
        onComplete={onComplete}
      />
    );
  }
  
  // Render the appropriate interaction component
  const renderInteraction = () => {
    if (!pageData.interaction || interactionComplete) return null;
    
    const interactionProps = {
      onComplete: () => {
        setInteractionComplete(true);
        onComplete?.();
      },
      pageData
    };
    
    return (
      <Suspense fallback={<InteractionLoader />}>
        {(() => {
          switch (pageData.interaction) {
            case 'light-switch':
              return <LightSwitch {...interactionProps} />;
            case 'wind-particles':
              return <WindParticles {...interactionProps} />;
            case 'glow-pulse':
              return <GlowPulse {...interactionProps} />;
            case 'cosmic-float':
              return <CosmicFloat {...interactionProps} />;
            case 'parallax-stars':
              return <ParallaxStars {...interactionProps} />;
            default:
              return null;
          }
        })()}
      </Suspense>
    );
  };
  
  // Text position classes - mobile optimized
  const textPositionClasses = {
    top: 'top-4 sm:top-6 md:top-8 left-3 right-3 sm:left-6 sm:right-6 md:left-8 md:right-8',
    center: 'top-1/2 left-3 right-3 sm:left-6 sm:right-6 md:left-8 md:right-8 -translate-y-1/2',
    bottom: 'bottom-4 sm:bottom-6 md:bottom-8 left-3 right-3 sm:left-6 sm:right-6 md:left-8 md:right-8'
  };
  
  // Render ambient effects (non-blocking visual enhancements)
  const renderAmbientEffects = () => {
    if (!pageData.ambientEffects || pageData.ambientEffects.length === 0) return null;
    
    return (
      <Suspense fallback={null}>
        {pageData.ambientEffects.map((effect, index) => {
          // Handle string shorthand (e.g., 'snow')
          if (typeof effect === 'string') {
            if (effect === 'snow') {
              return <SnowAmbient key={`ambient-${index}`} />;
            }
            return null;
          }
          
          // Handle object configuration
          if (effect.type === 'glowing-eyes') {
            return (
              <GlowingEyes 
                key={`ambient-${index}`}
                position={effect.position}
                size={effect.size}
                color={effect.color}
              />
            );
          }
          
          return null;
        })}
      </Suspense>
    );
  };
  
  // Background image component - blurred fill with sharp centered image
  const BackgroundImage = (
    <div className="absolute inset-0 bg-slate-900">
      {/* Blurred background fill for letterbox areas */}
      <motion.img
        src={pageData.background}
        alt=""
        className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 0.8 }}
      />
      {/* Main sharp image centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.img
          src={pageData.background}
          alt=""
          className="w-full h-full object-contain relative z-10"
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
  
  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900">
      {/* Background image layer */}
      {BackgroundImage}
      
      {/* Ambient effects layer (snow, glowing eyes, etc.) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {renderAmbientEffects()}
      </div>
      
      {/* Gradient overlay for text readability */}
      <div 
        className={cn(
          "absolute inset-0 pointer-events-none z-15",
          pageData.textPosition === 'bottom' && "bg-gradient-to-t from-black/80 via-black/20 to-transparent",
          pageData.textPosition === 'top' && "bg-gradient-to-b from-black/80 via-black/20 to-transparent",
          pageData.textPosition === 'center' && "bg-black/40"
        )}
      />
      
      {/* Interaction layer - pointer-events-none when no interaction, enabled when interaction renders */}
      <div className={cn(
        "absolute inset-0 z-20",
        (!pageData.interaction || interactionComplete) && "pointer-events-none"
      )}>
        {renderInteraction()}
      </div>
      
      {/* Text content layer */}
      <motion.div 
        className={cn(
          "absolute z-30",
          textPositionClasses[pageData.textPosition || 'bottom']
        )}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 max-w-2xl mx-auto">
          {/* Main story text - responsive sizing with better line height */}
          <p className="font-story text-lg sm:text-xl md:text-2xl lg:text-[1.625rem] text-white/90 leading-[1.9] sm:leading-[2] tracking-wide text-center sm:text-left px-1 sm:px-2">
            {pageData.text}
          </p>
          
          {/* Subtitle/hint text */}
          {pageData.subText && (
            <motion.p 
              className="font-story text-sm sm:text-base md:text-lg text-white/40 mt-5 sm:mt-6 italic text-center sm:text-left border-t border-white/10 pt-5 sm:pt-6 px-1 sm:px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {pageData.subText}
            </motion.p>
          )}
        </div>
      </motion.div>
      
      {/* Page number - positioned to not interfere with nav */}
      <div className="absolute bottom-16 sm:bottom-4 right-3 sm:right-4 text-white/15 font-title text-xs sm:text-sm z-30 pointer-events-none">
        {pageIndex}
      </div>
      
      {/* Decorative corner elements - desktop only */}
      <div className="hidden sm:block absolute top-3 left-3 w-8 h-8 md:w-10 md:h-10 border-l border-t border-white/10 rounded-tl-lg pointer-events-none" />
      <div className="hidden sm:block absolute bottom-16 sm:bottom-3 right-3 w-8 h-8 md:w-10 md:h-10 border-r border-b border-white/10 rounded-br-lg pointer-events-none" />
    </div>
  );
};

export default StoryPage;
