// src/components/PageFlipper.jsx
// Custom page flip with correct book-like animation

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';

const PageFlipper = ({ 
  children, 
  nextPageContent,
  prevPageContent,
  currentPage, 
  totalPages, 
  onPageChange,
  canNavigate = true,
  className 
}) => {
  const containerRef = useRef(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null);
  
  const flipProgress = useMotionValue(0);
  
  const canGoNext = currentPage < totalPages - 1 && canNavigate;
  const canGoPrev = currentPage > 0;
  
  // Transform hooks - called unconditionally at top level
  const rotateYNext = useTransform(flipProgress, [0, 1], [0, -180]);
  const rotateYPrev = useTransform(flipProgress, [0, 1], [0, 180]);
  const shadowOpacity = useTransform(flipProgress, [0, 0.5, 1], [0, 0.35, 0]);
  const pageScale = useTransform(flipProgress, [0, 0.5, 1], [1, 0.96, 1]);
  const underPageOpacity = useTransform(flipProgress, [0, 0.2, 1], [0.5, 0.85, 1]);
  
  const flipNext = useCallback(() => {
    if (!canGoNext || isFlipping) return;
    
    setIsFlipping(true);
    setFlipDirection('next');
    flipProgress.set(0);
    
    animate(flipProgress, 1, {
      type: 'spring',
      stiffness: 120,
      damping: 18,
      onComplete: () => {
        onPageChange?.(currentPage + 1, 1);
        flipProgress.set(0);
        setIsFlipping(false);
        setFlipDirection(null);
      }
    });
  }, [canGoNext, isFlipping, currentPage, onPageChange, flipProgress]);
  
  const flipPrev = useCallback(() => {
    if (!canGoPrev || isFlipping) return;
    
    setIsFlipping(true);
    setFlipDirection('prev');
    flipProgress.set(0);
    
    animate(flipProgress, 1, {
      type: 'spring',
      stiffness: 120,
      damping: 18,
      onComplete: () => {
        onPageChange?.(currentPage - 1, -1);
        flipProgress.set(0);
        setIsFlipping(false);
        setFlipDirection(null);
      }
    });
  }, [canGoPrev, isFlipping, currentPage, onPageChange, flipProgress]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') flipNext();
      else if (e.key === 'ArrowLeft') flipPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flipNext, flipPrev]);
  
  // Swipe navigation removed to allow swiping for image panning
  // Navigation is available via buttons, keyboard arrows, and page dots
  
  const activeRotation = flipDirection === 'prev' ? rotateYPrev : rotateYNext;
  const transformOrigin = flipDirection === 'prev' ? 'left center' : 'right center';
  
  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden select-none", className)}
      style={{ perspective: '2000px' }}
    >
      {/* Under page - next */}
      {flipDirection === 'next' && nextPageContent && (
        <motion.div className="absolute inset-0 z-0" style={{ opacity: underPageOpacity }}>
          {nextPageContent}
        </motion.div>
      )}
      
      {/* Under page - prev */}
      {flipDirection === 'prev' && prevPageContent && (
        <motion.div className="absolute inset-0 z-0" style={{ opacity: underPageOpacity }}>
          {prevPageContent}
        </motion.div>
      )}
      
      {/* Current page */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: isFlipping ? transformOrigin : 'center center',
          rotateY: isFlipping ? activeRotation : 0,
          scale: isFlipping ? pageScale : 1,
        }}
      >
        <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
          {children}
        </div>
        <div 
          className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        />
        {isFlipping && (
          <motion.div
            className="absolute inset-0 bg-black pointer-events-none"
            style={{ opacity: shadowOpacity }}
          />
        )}
      </motion.div>
      
      {/* Nav buttons */}
      <button
        onClick={flipPrev}
        disabled={!canGoPrev || isFlipping}
        className={cn(
          "absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30",
          "w-11 h-11 sm:w-12 sm:h-12 rounded-full",
          "flex items-center justify-center backdrop-blur-sm",
          "transition-all duration-200 border",
          canGoPrev 
            ? "bg-black/30 border-white/20 text-white/80 hover:bg-black/50 hover:text-white active:scale-95" 
            : "bg-black/10 border-white/5 text-white/20 cursor-not-allowed"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={flipNext}
        disabled={!canGoNext || isFlipping}
        className={cn(
          "absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30",
          "w-11 h-11 sm:w-12 sm:h-12 rounded-full",
          "flex items-center justify-center backdrop-blur-sm",
          "transition-all duration-200 border",
          canGoNext 
            ? "bg-black/30 border-white/20 text-white/80 hover:bg-black/50 hover:text-white active:scale-95" 
            : "bg-black/10 border-white/5 text-white/20 cursor-not-allowed"
        )}
        aria-label="Next page"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default PageFlipper;
