// src/components/TransitionPage.jsx
// Epic transition page with film reel effect showing time/years passing

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

const TransitionPage = ({ pageData, onComplete }) => {
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [currentRow, setCurrentRow] = useState(0); // 0, 1, or 2 for the 3 rows
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);
  const rowCycleRef = useRef(null);
  
  const totalDuration = pageData.totalDuration || 10000;
  const totalRows = 3; // The panel images are 4x3 grids
  
  // Panel images for the film reel (4x3 grids)
  // Each image has 3 rows, so we create frames for each row
  const panelImages = [
    '/images/page-flip/panel-1 (1).png',
    '/images/page-flip/panel-1 (2).png',
    '/images/page-flip/panel-1 (3).png',
  ];
  
  // Create individual frames: each panel image has 3 rows
  // Flatten into individual row frames for a true film reel feel
  const filmFrames = [];
  // Each panel is a 4x3 grid (4 columns, 3 rows)
  panelImages.forEach((src, panelIdx) => {
    for (let row = 0; row < 3; row++) {
      filmFrames.push({ src, row, panelIdx });
    }
  });
  
  // Repeat the sequence for seamless scrolling
  const filmStrip = [...filmFrames, ...filmFrames, ...filmFrames];
  
  useEffect(() => {
    if (isComplete) return;
    
    startTimeRef.current = Date.now();
    let lastTime = Date.now();
    let currentOffset = 0;
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const deltaTime = now - lastTime;
      lastTime = now;
      
      const currentProgress = Math.min(elapsed / totalDuration, 1);
      setProgress(currentProgress);
      
      // Calculate scroll speed with easing:
      // - Start slow (0-10%): gentle acceleration
      // - Middle (10-70%): very fast scrolling
      // - End (70-100%): decelerate smoothly
      let speedMultiplier;
      if (currentProgress < 0.10) {
        // Ease in - slow start
        const t = currentProgress / 0.10;
        speedMultiplier = t * t * 0.5; // Quadratic ease-in
      } else if (currentProgress < 0.70) {
        // Fast middle section - accelerate through it
        const t = (currentProgress - 0.10) / 0.60;
        speedMultiplier = 0.5 + t * 3.5; // Ramp up to max speed
      } else {
        // Ease out - slow down
        const t = (currentProgress - 0.70) / 0.30;
        speedMultiplier = 4 * (1 - t * t); // Quadratic ease-out
      }
      
      // Update offset based on speed (pixels per second)
      const baseSpeed = 600; // base pixels per second (faster now since images are smaller)
      const pixelsThisFrame = (baseSpeed * speedMultiplier * deltaTime) / 1000;
      currentOffset += pixelsThisFrame;
      setScrollOffset(currentOffset);
      
      if (elapsed < totalDuration) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsComplete(true);
        setTimeout(() => onComplete?.(), 1500);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isComplete, totalDuration, onComplete]);
  
  // Row cycling effect - flips through rows faster as animation progresses
  useEffect(() => {
    if (isComplete) return;
    
    const cycleRows = () => {
      // Row cycle speed based on progress - faster in the middle
      let cycleInterval;
      if (progress < 0.10) {
        cycleInterval = 800; // Slow at start
      } else if (progress < 0.70) {
        // Fast in the middle - cycle faster as we go
        const t = (progress - 0.10) / 0.60;
        cycleInterval = 800 - (t * 600); // 800ms -> 200ms
      } else {
        // Slow down at the end
        const t = (progress - 0.70) / 0.30;
        cycleInterval = 200 + (t * 600); // 200ms -> 800ms
      }
      
      setCurrentRow(prev => (prev + 1) % totalRows);
      rowCycleRef.current = setTimeout(cycleRows, cycleInterval);
    };
    
    // Start the row cycling
    rowCycleRef.current = setTimeout(cycleRows, 600);
    
    return () => {
      if (rowCycleRef.current) {
        clearTimeout(rowCycleRef.current);
      }
    };
  }, [isComplete, progress, totalRows]);
  
  const handleTap = useCallback(() => {
    if (!isComplete) {
      setIsComplete(true);
      setProgress(1);
      setTimeout(() => onComplete?.(), 500);
    }
  }, [isComplete, onComplete]);
  
  // Calculate blur based on speed
  const getBlur = () => {
    if (progress < 0.10) return progress * 30;
    if (progress < 0.70) return 3 + Math.sin(progress * 40) * 2;
    return 5 * (1 - (progress - 0.70) / 0.30);
  };
  
  const blur = isComplete ? 0 : getBlur();
  const isScrolling = progress > 0.08 && progress < 0.92;
  
  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-black cursor-pointer"
      onClick={handleTap}
    >
      {/* Film reel background - old projector feel */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, #1a1510 0%, #0a0805 100%)'
        }}
      />
      
      {/* Projector light beam effect */}
      {isScrolling && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{ duration: 0.15, repeat: Infinity }}
          style={{
            background: 'conic-gradient(from 180deg at 50% -30%, transparent 35%, rgba(255,220,180,0.15) 50%, transparent 65%)'
          }}
        />
      )}
      
      {/* Film strip container - centered vertically for single row frames */}
      {/* CONTAINER HEIGHT: Adjust if frames are cut off (needs to fit frame + sprocket holes) */}
      <div 
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          zIndex: 5,
          height: 'clamp(240px, 55vw, 480px)', // Fit much taller frames + sprockets on mobile
        }}
      >
        {/* The scrolling film strip */}
        <div
          className="flex items-center h-full"
          style={{
            transform: `translateX(calc(50vw - ${scrollOffset}px))`,
            filter: `blur(${blur}px)`,
            transition: isComplete ? 'filter 0.5s ease-out' : 'none',
          }}
        >
          {filmStrip.map((frame, idx) => {
            // Use background-position to show only one row
            // For a 3-row grid: row 0 = 0%, row 1 = 50%, row 2 = 100%
            const bgPositionY = (frame.row / 2) * 100;
            
            // ============================================
            // ADJUST THESE VALUES FOR YOUR SCREEN:
            // ============================================
            // MUCH BIGGER on mobile - frames wider than viewport
            const frameWidth = 'clamp(450px, 150vw, 1200px)';   // Much wider on mobile (150vw = 585px on 390px screen)
            const frameHeight = 'clamp(160px, 42vw, 380px)';   // Much taller on mobile
            const frameGap = 'clamp(16px, 4vw, 32px)';          // GAP between frames
            const sprocketGap = 'clamp(32px, 8vw, 48px)';       // SPROCKET HOLE distance from frame
            const sprocketWidth = 'clamp(10px, 2.5vw, 16px)';   // SPROCKET HOLE width
            const sprocketHeight = 'clamp(16px, 4vw, 24px)';    // SPROCKET HOLE height
            // ============================================
            
            return (
              <div 
                key={idx} 
                style={{ 
                  position: 'relative',
                  flexShrink: 0,
                  width: frameWidth,
                  height: frameHeight,
                  margin: `0 ${frameGap}`,
                }}
              >
                {/* Film sprocket holes - top */}
                <div 
                  style={{
                    position: 'absolute',
                    top: `-${sprocketGap}`,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'space-around',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                >
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      style={{
                        width: sprocketWidth,
                        height: sprocketHeight,
                        borderRadius: '2px',
                        backgroundColor: '#000',
                        border: '1px solid #374151',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.9)',
                      }}
                    />
                  ))}
                </div>
                
                {/* The panel image - showing only one row using background */}
                <div 
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '3px',
                    backgroundImage: `url("${frame.src}")`,
                    // BACKGROUND SIZE: Controls how much of the image is visible
                    // - '100% 400%' = show 1/4 of image height (for 4 rows)
                    // - '100% 300%' = show 1/3 of image height (for 3 rows)
                    backgroundSize: '100% 400%',
                    backgroundPosition: `center ${bgPositionY}%`,
                    backgroundRepeat: 'no-repeat',
                    filter: 'sepia(0.12) contrast(1.05) brightness(0.92)',
                  }}
                />
                
                {/* Film sprocket holes - bottom */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: `-${sprocketGap}`,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'space-around',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                >
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      style={{
                        width: sprocketWidth,
                        height: sprocketHeight,
                        borderRadius: '2px',
                        backgroundColor: '#000',
                        border: '1px solid #374151',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.9)',
                      }}
                    />
                  ))}
                </div>
                
                {/* Film frame border */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                    borderRadius: '3px',
                    boxShadow: 'inset 0 0 25px rgba(0,0,0,0.5)',
                    border: '2px solid rgba(30,25,20,0.6)',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Film scratches and dust (animated) */}
      {isScrolling && !isComplete && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Vertical scratches */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`scratch-${i}`}
              className="absolute top-0 bottom-0 w-px bg-white/8"
              style={{ left: `${15 + i * 25}%` }}
              animate={{
                opacity: [0, 0.2, 0],
                x: [0, -100, -200],
              }}
              transition={{
                duration: 0.25,
                repeat: Infinity,
                delay: i * 0.08,
              }}
            />
          ))}
          
          {/* Dust particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`dust-${i}`}
              className="absolute w-1 h-1 bg-white/15 rounded-full"
              style={{
                top: `${20 + (i * 12)}%`,
                left: `${10 + (i * 15)}%`,
              }}
              animate={{
                opacity: [0, 0.4, 0],
                x: [-50, -150],
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                delay: i * 0.06,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Speed lines during fast section */}
      {progress > 0.15 && progress < 0.75 && !isComplete && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-[2px] bg-gradient-to-r from-transparent via-amber-200/20 to-transparent"
              style={{
                top: `${12 + i * 8}%`,
                left: 0,
                right: 0,
              }}
              animate={{
                x: ['-100%', '200%'],
                opacity: [0, 0.35, 0],
              }}
              transition={{
                duration: 0.12,
                repeat: Infinity,
                delay: i * 0.015,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}
      
      {/* Film gate frame - the projector window edges */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black via-black/95 to-transparent" />
        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/95 to-transparent" />
        {/* Left edge */}
        <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-black/90 to-transparent" />
        {/* Right edge */}
        <div className="absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l from-black/90 to-transparent" />
      </div>
      
      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)'
        }}
      />
      
      {/* Projector flicker overlay */}
      {isScrolling && !isComplete && (
        <motion.div
          className="absolute inset-0 pointer-events-none bg-amber-900/5"
          animate={{
            opacity: [0, 0.06, 0, 0.04, 0],
          }}
          transition={{
            duration: 0.12,
            repeat: Infinity,
          }}
        />
      )}
      
      {/* Text overlay - centered */}
      {pageData.text && (progress < 0.12 || isComplete) && (
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none w-full px-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: isComplete ? 0.3 : 0, duration: 0.8 }}
        >
          <div className="max-w-2xl mx-auto">
            <div 
              className="backdrop-blur-md bg-black/60 rounded-2xl p-6 border border-amber-900/30"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}
            >
              <p className="font-story text-lg sm:text-xl md:text-2xl text-amber-100/90 leading-relaxed text-center italic">
                {pageData.text}
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* "Years passing" indicator during scroll */}
      {isScrolling && !isComplete && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.15, 0.4, 0.15],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="text-center">
            <div className="text-amber-200/30 text-5xl sm:text-7xl font-thin tracking-widest">
              ❧
            </div>
            <div className="text-amber-100/25 text-xs tracking-[0.4em] uppercase mt-3 font-story">
              Years Pass
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Progress bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-amber-900/25 rounded-full overflow-hidden z-30">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-600/50 to-amber-400/50 rounded-full"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      
      {/* Skip hint */}
      {!isComplete && progress > 0.03 && progress < 0.5 && (
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.25, 0] }}
          transition={{ delay: 1.5, duration: 2, repeat: 2 }}
        >
          <span className="text-amber-200/25 text-xs font-story tracking-widest uppercase">
            Tap to skip
          </span>
        </motion.div>
      )}
      
      {/* Film grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
};

export default TransitionPage;
