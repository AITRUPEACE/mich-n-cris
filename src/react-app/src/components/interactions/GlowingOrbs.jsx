// src/components/interactions/GlowingOrbs.jsx
// Floating multi-color glowing orbs for magical/cosmic scenes

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const GlowingOrbs = ({ intensity = 'normal', colorScheme = 'rainbow', size = 'normal' }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const orbsRef = useRef([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    // Orb counts based on intensity
    const isMobile = window.innerWidth < 768;
    const orbCounts = {
      subtle: isMobile ? 8 : 15,
      normal: isMobile ? 15 : 25,
      intense: isMobile ? 25 : 40
    };
    const orbCount = orbCounts[intensity] || orbCounts.normal;
    
    // Size multiplier
    const sizeMultipliers = {
      small: 0.6,
      normal: 1.0,
      large: 1.5,
      huge: 2.5
    };
    const sizeMult = typeof size === 'number' ? size : (sizeMultipliers[size] || 1.0);
    
    // Color palettes
    const colorPalettes = {
      rainbow: [
        { h: 280, s: 80, l: 60 },  // Purple
        { h: 320, s: 70, l: 55 },  // Pink/Magenta
        { h: 200, s: 85, l: 55 },  // Cyan
        { h: 160, s: 70, l: 50 },  // Teal
        { h: 45, s: 90, l: 60 },   // Gold
        { h: 260, s: 75, l: 65 },  // Lavender
        { h: 340, s: 80, l: 60 },  // Rose
      ],
      cosmic: [
        { h: 260, s: 90, l: 65 },  // Violet
        { h: 280, s: 85, l: 55 },  // Purple
        { h: 200, s: 95, l: 60 },  // Electric blue
        { h: 180, s: 80, l: 50 },  // Cyan
        { h: 320, s: 75, l: 60 },  // Magenta
        { h: 45, s: 100, l: 70 },  // Bright gold
      ],
      mushroom: [
        { h: 320, s: 65, l: 50 },  // Pink
        { h: 180, s: 70, l: 45 },  // Teal
        { h: 200, s: 80, l: 55 },  // Cyan
        { h: 340, s: 70, l: 55 },  // Rose pink
        { h: 120, s: 60, l: 50 }, // green color
        { h: 30, s: 100, l: 60 }, // orange color
      ]
    };
    const colors = colorPalettes[colorScheme] || colorPalettes.rainbow;
    
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    
    resizeCanvas();
    
    // Glowing orb class
    class GlowingOrb {
      constructor() {
        this.reset(true);
      }
      
      reset(initial = false) {
        const maxX = canvas.width / dpr;
        const maxY = canvas.height / dpr;
        
        this.x = Math.random() * maxX;
        this.y = initial ? Math.random() * maxY : maxY + 50;
        
        // Size varies - some tiny sparkles, some larger orbs
        const sizeRoll = Math.random();
        if (sizeRoll < 0.5) {
          this.baseSize = (Math.random() * 6 + 4) * sizeMult; // Small sparkles
        } else if (sizeRoll < 0.85) {
          this.baseSize = (Math.random() * 12 + 10) * sizeMult; // Medium orbs
        } else {
          this.baseSize = (Math.random() * 20 + 16) * sizeMult; // Large orbs
        }
        
        this.size = this.baseSize;
        
        // Slow, dreamy movement
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -Math.random() * 0.5 - 0.1; // Gentle rise
        
        // Wobble for organic movement
        this.wobbleX = Math.random() * Math.PI * 2;
        this.wobbleY = Math.random() * Math.PI * 2;
        this.wobbleSpeedX = Math.random() * 0.02 + 0.005;
        this.wobbleSpeedY = Math.random() * 0.015 + 0.005;
        this.wobbleAmountX = Math.random() * 20 + 10;
        this.wobbleAmountY = Math.random() * 10 + 5;
        
        // Color
        const colorData = colors[Math.floor(Math.random() * colors.length)];
        this.hue = colorData.h + (Math.random() - 0.5) * 20;
        this.saturation = colorData.s + (Math.random() - 0.5) * 10;
        this.lightness = colorData.l + (Math.random() - 0.5) * 10;
        
        // Glow properties
        this.glowSize = this.baseSize * (2 + Math.random() * 2);
        this.opacity = Math.random() * 0.4 + 0.3;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
        
        // Depth for parallax effect
        this.depth = Math.random();
      }
      
      update() {
        // Update wobble
        this.wobbleX += this.wobbleSpeedX;
        this.wobbleY += this.wobbleSpeedY;
        
        // Apply movement with wobble
        const wobbleOffsetX = Math.sin(this.wobbleX) * this.wobbleAmountX * this.depth;
        const wobbleOffsetY = Math.sin(this.wobbleY) * this.wobbleAmountY * this.depth;
        
        this.x += this.speedX + wobbleOffsetX * 0.02;
        this.y += this.speedY * (0.3 + this.depth * 0.7);
        
        // Pulse size
        this.pulsePhase += this.pulseSpeed;
        const pulseFactor = 0.8 + Math.sin(this.pulsePhase) * 0.2;
        this.size = this.baseSize * pulseFactor;
        
        // Color shift over time (subtle)
        this.hue += 0.1;
        if (this.hue > 360) this.hue -= 360;
        
        const maxX = canvas.width / dpr;
        const maxY = canvas.height / dpr;
        
        // Wrap around or reset
        if (this.y < -50) {
          this.reset();
        }
        if (this.x < -50) this.x = maxX + 50;
        if (this.x > maxX + 50) this.x = -50;
      }
      
      draw(ctx) {
        const wobbleOffsetX = Math.sin(this.wobbleX) * this.wobbleAmountX * this.depth;
        const wobbleOffsetY = Math.sin(this.wobbleY) * this.wobbleAmountY * this.depth;
        const drawX = this.x + wobbleOffsetX;
        const drawY = this.y + wobbleOffsetY;
        
        ctx.save();
        
        // Outer glow
        const gradient = ctx.createRadialGradient(
          drawX, drawY, 0,
          drawX, drawY, this.glowSize
        );
        
        const baseColor = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%`;
        gradient.addColorStop(0, `${baseColor}, ${this.opacity})`);
        gradient.addColorStop(0.3, `${baseColor}, ${this.opacity * 0.5})`);
        gradient.addColorStop(0.6, `${baseColor}, ${this.opacity * 0.2})`);
        gradient.addColorStop(1, `${baseColor}, 0)`);
        
        ctx.beginPath();
        ctx.arc(drawX, drawY, this.glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Inner bright core
        const coreGradient = ctx.createRadialGradient(
          drawX, drawY, 0,
          drawX, drawY, this.size
        );
        coreGradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, 95%, ${this.opacity + 0.3})`);
        coreGradient.addColorStop(0.5, `${baseColor}, ${this.opacity + 0.2})`);
        coreGradient.addColorStop(1, `${baseColor}, 0)`);
        
        ctx.beginPath();
        ctx.arc(drawX, drawY, this.size, 0, Math.PI * 2);
        ctx.fillStyle = coreGradient;
        ctx.fill();
        
        ctx.restore();
      }
    }
    
    // Create orbs
    orbsRef.current = Array.from({ length: orbCount }, () => new GlowingOrb());
    
    // Animation loop
    const animate = () => {
      const maxX = canvas.width / dpr;
      const maxY = canvas.height / dpr;
      
      ctx.clearRect(0, 0, maxX, maxY);
      
      // Sort by depth for proper layering
      orbsRef.current.sort((a, b) => a.depth - b.depth);
      
      // Update and draw orbs
      orbsRef.current.forEach(orb => {
        orb.update();
        orb.draw(ctx);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [intensity, colorScheme, size]);
  
  return (
    <motion.div
      className="absolute inset-0 z-5 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Orbs canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Subtle magical atmosphere overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(180, 100, 255, 0.03) 0%, transparent 70%)'
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
};

export default GlowingOrbs;

