// src/components/interactions/FogWipe.jsx
// Mobile-optimized canvas-based frost wiping interaction

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FogWipe = ({ onComplete, pageData, onFrameChange }) => {
  const canvasRef = useRef(null);
  const [isCleared, setIsCleared] = useState(false);
  const [clearPercentage, setClearPercentage] = useState(0);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const ctxRef = useRef(null);
  
  // Brush size - larger on mobile for finger
  const getBrushSize = () => window.innerWidth < 768 ? 50 : 40;
  
  // Initialize canvas with frost effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctxRef.current = ctx;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
    
    const initCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      
      // Wait for valid dimensions
      if (rect.width <= 0 || rect.height <= 0) {
        requestAnimationFrame(initCanvas);
        return;
      }
      
      // Set canvas size
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      // Create frost texture
      createFrostTexture(ctx, rect.width, rect.height);
    };
    
    // Initialize with small delay to ensure parent has rendered
    const timer = setTimeout(initCanvas, 100);
    
    // Handle resize
    const handleResize = () => {
      const newRect = canvas.getBoundingClientRect();
      if (newRect.width <= 0 || newRect.height <= 0) return;
      
      canvas.width = newRect.width * dpr;
      canvas.height = newRect.height * dpr;
      ctx.scale(dpr, dpr);
      createFrostTexture(ctx, newRect.width, newRect.height);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Create frost/fog texture
  const createFrostTexture = (ctx, width, height) => {
    // Guard against zero dimensions
    if (width <= 0 || height <= 0) return;
    
    // Base frost layer
    ctx.fillStyle = 'rgba(200, 220, 235, 0.9)';
    ctx.fillRect(0, 0, width, height);
    
    // Add noise texture for realism
    const imageData = ctx.getImageData(0, 0, Math.max(1, width), Math.max(1, height));
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 15;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Add frost crystal patterns
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      drawFrostCrystal(ctx, x, y, Math.random() * 15 + 8);
    }
  };
  
  // Draw frost crystal pattern
  const drawFrostCrystal = (ctx, x, y, size) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
    }
    ctx.stroke();
  };
  
  // Calculate clear percentage (throttled)
  const calculateClearPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width <= 0 || canvas.height <= 0) return 0;
    
    try {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const imageData = ctx.getImageData(0, 0, Math.max(1, canvas.width), Math.max(1, canvas.height));
      const data = imageData.data;
      
      if (data.length === 0) return 0;
      
      let transparentPixels = 0;
      // Sample every 16th pixel for performance
      for (let i = 3; i < data.length; i += 64) {
        if (data[i] < 100) transparentPixels++;
      }
      
      return (transparentPixels / (data.length / 64)) * 100;
    } catch (e) {
      return 0;
    }
  }, []);
  
  // Draw (erase) function
  const draw = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || isCleared) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const brushSize = getBrushSize();
    
    // Erase with soft gradient
    ctx.globalCompositeOperation = 'destination-out';
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.7)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw line from last position for smoother wiping
    if (isDrawingRef.current && lastPosRef.current.x !== 0) {
      ctx.lineWidth = brushSize * 1.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    
    lastPosRef.current = { x, y };
    
    // Check clear percentage (throttled)
    const percentage = calculateClearPercentage();
    setClearPercentage(Math.round(percentage));
    
    if (percentage > 50 && !isCleared) {
      setIsCleared(true);
      // If onFrameChange is provided, switch frame first, then complete after frame transition
      if (onFrameChange) {
        setTimeout(() => {
          onFrameChange(1); // Switch to next frame (index 1)
          // Don't call onComplete here - let MultiFramePage handle it when it sees the last frame
        }, 800);
      } else {
        setTimeout(() => onComplete?.(), 800);
      }
    }
  }, [isCleared, calculateClearPercentage, onComplete, onFrameChange]);
  
  // Mouse handlers
  const handleMouseDown = (e) => {
    isDrawingRef.current = true;
    lastPosRef.current = { x: 0, y: 0 };
    draw(e.clientX, e.clientY);
  };
  
  const handleMouseMove = (e) => {
    if (!isDrawingRef.current) return;
    draw(e.clientX, e.clientY);
  };
  
  const handleMouseUp = () => {
    isDrawingRef.current = false;
    lastPosRef.current = { x: 0, y: 0 };
  };
  
  // Touch handlers
  const handleTouchStart = (e) => {
    e.preventDefault();
    isDrawingRef.current = true;
    lastPosRef.current = { x: 0, y: 0 };
    const touch = e.touches[0];
    draw(touch.clientX, touch.clientY);
  };
  
  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!isDrawingRef.current) return;
    const touch = e.touches[0];
    draw(touch.clientX, touch.clientY);
  };
  
  const handleTouchEnd = () => {
    isDrawingRef.current = false;
    lastPosRef.current = { x: 0, y: 0 };
  };
  
  return (
    <AnimatePresence>
      {!isCleared && (
        <motion.div
          className="absolute inset-0 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full touch-none"
            style={{ cursor: 'crosshair' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          
          {/* Wipe instruction */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="text-white/90 text-base sm:text-lg font-story drop-shadow-lg mb-3">
              ✋ Wipe the frost
            </div>
            <div className="w-24 sm:w-28 h-1.5 bg-white/20 rounded-full mx-auto overflow-hidden">
              <motion.div
                className="h-full bg-white/70 rounded-full"
                style={{ width: `${clearPercentage}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FogWipe;
