// src/components/MultiFramePage.jsx
// Multi-frame page handler with frame transitions and interactions

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

// Lazy load interaction components
const FogWipe = lazy(() => import('./interactions/FogWipe'));
const FireplaceInteraction = lazy(() => import('./interactions/FireplaceInteraction'));

// Lazy load ambient effect components
const SnowAmbient = lazy(() => import('./interactions/SnowAmbient'));
const BlizzardAmbient = lazy(() => import('./interactions/BlizzardAmbient'));
const GlowingEyes = lazy(() => import('./interactions/GlowingEyes'));
const GlowingOrbs = lazy(() => import('./interactions/GlowingOrbs'));
const RisingLines = lazy(() => import('./interactions/RisingLines'));

const MultiFramePage = ({ pageData, pageIndex, onComplete }) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [interactionComplete, setInteractionComplete] = useState(false);
  
  // Reset frame state when page data changes (navigating to different multi-frame page)
  React.useEffect(() => {
    setCurrentFrameIndex(0);
    setInteractionComplete(false);
  }, [pageData.id]);
  
  const currentFrame = pageData.frames[currentFrameIndex];
  const isLastFrame = currentFrameIndex === pageData.frames.length - 1;
  
  // Auto-complete if last frame has no interaction
  useEffect(() => {
    const frame = pageData.frames[currentFrameIndex];
    const isLast = currentFrameIndex === pageData.frames.length - 1;
    
    if (isLast && !frame.interaction) {
      // Last frame with no interaction - auto-complete after a short delay
      const timer = setTimeout(() => {
        setInteractionComplete(true);
        onComplete?.();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentFrameIndex, pageData.frames, onComplete]);
  
  // Handle frame change (called by interactions)
  const handleFrameChange = (newFrameIndex) => {
    if (newFrameIndex < pageData.frames.length) {
      setCurrentFrameIndex(newFrameIndex);
      // Reset interaction complete when frame changes (for fog wipe that switches frames)
      setInteractionComplete(false);
    }
  };
  
  // Handle interaction completion
  const handleInteractionComplete = () => {
    setInteractionComplete(true);
    
    // Check if we're on the last frame
    const newIsLastFrame = currentFrameIndex === pageData.frames.length - 1;
    
    // If this is the last frame, mark page as complete
    if (newIsLastFrame) {
      setTimeout(() => {
        onComplete?.();
      }, 500);
    } else {
      // Move to next frame
      setCurrentFrameIndex(prev => prev + 1);
    }
  };
  
  // Handle tap for tap-element interactions
  const handleTapElement = () => {
    if (currentFrame.interaction === 'tap-element') {
      if (isLastFrame) {
        handleInteractionComplete();
      } else {
        setCurrentFrameIndex(currentFrameIndex + 1);
      }
    }
  };
  
  // Render interaction component
  const renderInteraction = () => {
    if (!currentFrame.interaction || interactionComplete) return null;
    
    const interactionProps = {
      onComplete: handleInteractionComplete,
      onFrameChange: handleFrameChange,
      pageData
    };
    
    return (
      <Suspense fallback={null}>
        {(() => {
          switch (currentFrame.interaction) {
            case 'fog-wipe':
              return <FogWipe {...interactionProps} />;
            case 'fireplace':
              return <FireplaceInteraction {...interactionProps} />;
            case 'tap-element':
              return null; // Handled by tap on image
            default:
              return null;
          }
        })()}
      </Suspense>
    );
  };
  
  // Text position classes - optimized for both mobile and desktop
  // Use left-1/2 -translate-x-1/2 for true horizontal centering on desktop
  const textPositionClasses = {
    top: 'top-4 sm:top-6 md:top-12 left-3 right-3 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[90%] md:max-w-3xl',
    center: 'top-1/2 left-3 right-3 md:left-1/2 md:right-auto md:-translate-x-1/2 -translate-y-1/2 md:w-[90%] md:max-w-3xl',
    bottom: 'bottom-4 sm:bottom-6 md:bottom-12 left-3 right-3 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[90%] md:max-w-3xl'
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
  
  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900">
      {/* Background image layer with frame transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFrameIndex}
          className="absolute inset-0 bg-slate-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Blurred background fill for letterbox areas */}
          <img
            src={currentFrame.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-40"
          />
          {/* Main sharp image centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={currentFrame.image}
              alt=""
              className="w-full h-full object-contain relative z-10"
            />
          </div>
        </motion.div>
      </AnimatePresence>
      
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
      
      {/* Interaction layer */}
      <div className="absolute inset-0 z-20">
        {renderInteraction()}
      </div>
      
      {/* Tap area for tap-element interactions - highest z-index to capture all taps */}
      {currentFrame.interaction === 'tap-element' && (
        <>
          <button
            type="button"
            className="absolute inset-0 z-[40] cursor-pointer bg-transparent border-none outline-none focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              handleTapElement();
            }}
            onTouchStart={(e) => {
              // Prevent any default touch behavior
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleTapElement();
            }}
            aria-label="Tap to continue to next frame"
          />
          {/* Subtle tap hint */}
          <motion.div 
            className="absolute bottom-70 left-1/2 -translate-x-1/2 z-[41] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-white/60 text-xs font-story tracking-widest uppercase">
              Tap to continue
            </span>
          </motion.div>
        </>
      )}
      
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
          <p className="font-story text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] text-white/95 leading-[1.85] sm:leading-[1.95] md:leading-[2.1] tracking-wide text-center">
            {pageData.text}
          </p>
        </div>
      </motion.div>
      
      {/* Frame indicator (optional - shows which frame you're on) */}
      {pageData.frames.length > 1 && (
        <div className="absolute top-4 right-4 z-30 flex gap-1.5 pointer-events-none">
          {pageData.frames.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                idx === currentFrameIndex 
                  ? "bg-white/80 w-6" 
                  : "bg-white/30"
              )}
            />
          ))}
        </div>
      )}
      
      {/* Page number */}
      <div className="absolute bottom-16 sm:bottom-4 right-3 sm:right-4 text-white/15 font-title text-xs sm:text-sm z-30 pointer-events-none">
        {pageData.id?.replace('page-', '') || pageIndex}
      </div>
    </div>
  );
};

export default MultiFramePage;

