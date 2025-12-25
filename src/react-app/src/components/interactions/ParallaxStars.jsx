// src/components/interactions/ParallaxStars.jsx
// Mobile-optimized parallax star field with touch/tilt support

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const ParallaxStars = ({ onComplete, pageData }) => {
  const containerRef = useRef(null);
  const [showShootingStar, setShowShootingStar] = useState(false);
  
  // Mouse/touch position motion values
  const inputX = useMotionValue(0);
  const inputY = useMotionValue(0);
  
  // Smooth spring physics
  const springConfig = { damping: 30, stiffness: 80 };
  const smoothX = useSpring(inputX, springConfig);
  const smoothY = useSpring(inputY, springConfig);
  
  // Parallax transforms for each layer
  const layer1X = useTransform(smoothX, [-300, 300], [10, -10]);
  const layer1Y = useTransform(smoothY, [-300, 300], [10, -10]);
  const layer2X = useTransform(smoothX, [-300, 300], [20, -20]);
  const layer2Y = useTransform(smoothY, [-300, 300], [20, -20]);
  const layer3X = useTransform(smoothX, [-300, 300], [35, -35]);
  const layer3Y = useTransform(smoothY, [-300, 300], [35, -35]);
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Handle mouse move
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    inputX.set(e.clientX - rect.left - rect.width / 2);
    inputY.set(e.clientY - rect.top - rect.height / 2);
  }, [inputX, inputY]);
  
  // Handle touch move
  const handleTouchMove = useCallback((e) => {
    if (!containerRef.current) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    inputX.set(touch.clientX - rect.left - rect.width / 2);
    inputY.set(touch.clientY - rect.top - rect.height / 2);
  }, [inputX, inputY]);
  
  // Generate stars - fewer on mobile
  const generateStars = useCallback((count, layer) => {
    return [...Array(count)].map((_, i) => ({
      id: `${layer}-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: layer === 1 ? 1 : layer === 2 ? 1.5 : 2,
      opacity: 0.25 + Math.random() * 0.45,
      twinkleDelay: Math.random() * 3,
      twinkleDuration: 2 + Math.random() * 1.5,
    }));
  }, []);
  
  const starCounts = isMobile ? [50, 35, 20] : [70, 45, 25];
  
  const layer1Stars = useMemo(() => generateStars(starCounts[0], 1), [generateStars, starCounts]);
  const layer2Stars = useMemo(() => generateStars(starCounts[1], 2), [generateStars, starCounts]);
  const layer3Stars = useMemo(() => generateStars(starCounts[2], 3), [generateStars, starCounts]);
  
  // Shooting star timer
  useEffect(() => {
    const interval = setInterval(() => {
      setShowShootingStar(true);
      setTimeout(() => setShowShootingStar(false), 1200);
    }, 6000);
    return () => clearInterval(interval);
  }, []);
  
  // Auto-complete
  useEffect(() => {
    const timer = setTimeout(() => onComplete?.(), 8000);
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  // Render star layer
  const renderStarLayer = (stars, x, y) => (
    <motion.div className="absolute inset-0 star-layer" style={{ x, y }}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size }}
          animate={{ opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5], scale: [1, 1.15, 1] }}
          transition={{ duration: star.twinkleDuration, repeat: Infinity, delay: star.twinkleDelay, ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  );
  
  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-10 overflow-hidden"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Deep space background */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, #1a0a2e 0%, #0a0a15 100%)' }} />
      
      {/* Nebula clouds */}
      <motion.div
        className="absolute inset-0 opacity-25"
        style={{
          background: `
            radial-gradient(ellipse at 30% 40%, rgba(139, 92, 246, 0.25) 0%, transparent 35%),
            radial-gradient(ellipse at 70% 60%, rgba(236, 72, 153, 0.15) 0%, transparent 30%),
            radial-gradient(ellipse at 50% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 25%)
          `
        }}
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Star layers */}
      {renderStarLayer(layer1Stars, layer1X, layer1Y)}
      {renderStarLayer(layer2Stars, layer2X, layer2Y)}
      {renderStarLayer(layer3Stars, layer3X, layer3Y)}
      
      {/* Shooting star */}
      {showShootingStar && (
        <motion.div
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{ top: '15%', left: '25%', boxShadow: '0 0 4px 2px rgba(255, 255, 255, 0.7)' }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: 200, y: 150, opacity: [1, 1, 0] }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <div className="absolute top-1/2 right-full w-20 h-px -translate-y-1/2" style={{ background: 'linear-gradient(to left, rgba(255, 255, 255, 0.7), transparent)' }} />
        </motion.div>
      )}
      
      {/* Central cosmic glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.5 }}
      >
        <motion.div
          className="w-40 h-40 sm:w-56 sm:h-56 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(139, 92, 246, 0.15) 30%, transparent 65%)', filter: 'blur(15px)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/40"
          style={{ filter: 'blur(8px)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
      
      {/* Infinity symbol */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 1.2 }}
      >
        <motion.span
          className="text-white/70 font-title text-2xl sm:text-3xl tracking-widest"
          style={{ textShadow: '0 0 20px rgba(139, 92, 246, 0.7), 0 0 40px rgba(139, 92, 246, 0.3)' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          ∞
        </motion.span>
      </motion.div>
      
      {/* Hint */}
      <motion.div
        className="absolute bottom-20 sm:bottom-16 left-1/2 -translate-x-1/2 text-white/30 text-xs sm:text-sm font-story text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
      >
        {isMobile ? 'Touch to explore' : 'Move to explore'}
      </motion.div>
    </div>
  );
};

export default ParallaxStars;
