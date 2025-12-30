// src/components/StoryPage.jsx
// Mobile-first story page with responsive text and interactions

import React, { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import MultiFramePage from './MultiFramePage';
import TransitionPage from './TransitionPage';

// Lazy load interaction components
const LightSwitch = lazy(() => import('./interactions/LightSwitch'));
const WindParticles = lazy(() => import('./interactions/WindParticles'));
const GlowPulse = lazy(() => import('./interactions/GlowPulse'));
const CosmicFloat = lazy(() => import('./interactions/CosmicFloat'));
const ParallaxStars = lazy(() => import('./interactions/ParallaxStars'));

// Lazy load ambient effect components
const SnowAmbient = lazy(() => import('./interactions/SnowAmbient'));
const BlizzardAmbient = lazy(() => import('./interactions/BlizzardAmbient'));
const GlowingEyes = lazy(() => import('./interactions/GlowingEyes'));
const GlowingOrbs = lazy(() => import('./interactions/GlowingOrbs'));
const RisingLines = lazy(() => import('./interactions/RisingLines'));

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
  
  // If this is a transition page, delegate to TransitionPage
  if (pageData.type === 'transition') {
    return (
      <TransitionPage 
        pageData={pageData} 
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
  
  // Text position classes - optimized for both mobile and desktop
  // Use left-1/2 -translate-x-1/2 for true horizontal centering on desktop
  // md:max-w-4xl = 896px, lg:max-w-5xl = 1024px for wider text on desktop
  // Mobile bottom increased to account for nav bar below
  const textPositionClasses = {
    top: 'top-4 sm:top-6 md:top-12 left-3 right-3 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[90%] md:max-w-4xl lg:max-w-5xl',
    center: 'top-1/2 left-3 right-3 md:left-1/2 md:right-auto md:-translate-x-1/2 -translate-y-1/2 md:w-[90%] md:max-w-4xl lg:max-w-5xl',
    bottom: 'bottom-2 sm:bottom-4 md:bottom-12 left-3 right-3 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[90%] md:max-w-4xl lg:max-w-5xl'
  };
  
  // Render ambient effects (non-blocking visual enhancements)
  const renderAmbientEffects = () => {
    if (!pageData.ambientEffects || pageData.ambientEffects.length === 0) return null;
    
    return (
      <Suspense fallback={null}>
        {pageData.ambientEffects.map((effect, index) => {
          // Handle string shorthand (e.g., 'snow', 'blizzard')
          if (typeof effect === 'string') {
            if (effect === 'snow') {
              return <SnowAmbient key={`ambient-${index}`} />;
            }
            if (effect === 'blizzard') {
              return <BlizzardAmbient key={`ambient-${index}`} />;
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
          
          if (effect.type === 'glowing-orbs') {
            return (
              <GlowingOrbs 
                key={`ambient-${index}`}
                intensity={effect.intensity}
                colorScheme={effect.colorScheme}
                size={effect.size}
              />
            );
          }
          
          if (effect.type === 'rising-lines') {
            return (
              <RisingLines 
                key={`ambient-${index}`}
                intensity={effect.intensity}
                color={effect.color}
                speed={effect.speed}
                lineLength={effect.lineLength}
                radialEffect={effect.radialEffect}
                vignette={effect.vignette}
                glow={effect.glow}
              />
            );
          }
          
          return null;
        })}
      </Suspense>
    );
  };
  
  // Check if we have a video background
  const hasVideo = pageData.backgroundVideo;

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
      
      {/* Video overlay if present */}
      {hasVideo && (
        <motion.div
          className="absolute inset-0 z-[11] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        >
          {/* Video container - adjustable size per breakpoint */}
          <div 
            className="relative w-[55%] h-[35%] sm:w-[65%] sm:h-[45%] md:w-[80%] md:h-[65%] lg:w-full lg:h-full overflow-hidden"
            style={{
              maskImage: 'radial-gradient(ellipse 100% 100% at center, black 40%, transparent 85%)',
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
                objectPosition: 'center 35%',
              }}
            />
          </div>
        </motion.div>
      )}
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
        <div className="glass-panel-styled rounded-2xl sm:rounded-3xl mx-auto px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 lg:px-12 lg:py-10">
          {/* Main story text - centered, elegant typography */}
          <p className="font-story text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] text-white/95 leading-[1.85] sm:leading-[1.95] md:leading-[2.1] tracking-wide text-center">
            {pageData.text}
          </p>
          
          {/* Subtitle/hint text */}
          {pageData.subText && (
            <motion.p 
              className="font-story text-sm sm:text-base md:text-lg text-white/50 mt-5 sm:mt-6 italic text-center border-t border-white/10 pt-5 sm:pt-6"
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
        {pageData.id?.replace('page-', '') || pageIndex}
      </div>
      
      {/* Decorative corner elements - desktop only */}
      <div className="hidden sm:block absolute top-3 left-3 w-8 h-8 md:w-10 md:h-10 border-l border-t border-white/10 rounded-tl-lg pointer-events-none" />
      <div className="hidden sm:block absolute bottom-16 sm:bottom-3 right-3 w-8 h-8 md:w-10 md:h-10 border-r border-b border-white/10 rounded-br-lg pointer-events-none" />
    </div>
  );
};

export default StoryPage;
