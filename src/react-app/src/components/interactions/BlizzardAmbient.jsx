// src/components/interactions/BlizzardAmbient.jsx
// Intense blizzard effect with heavy snow, wind streaks, and atmospheric effects

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const BlizzardAmbient = () => {
  const canvasRef = useRef(null);
  const windCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const windStreaksRef = useRef([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const windCanvas = windCanvasRef.current;
    if (!canvas || !windCanvas) return;
    
    const ctx = canvas.getContext('2d');
    const windCtx = windCanvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    // BLIZZARD settings - much more intense!
    const isMobile = window.innerWidth < 768;
    const snowParticleCount = isMobile ? 200 : 400; // Much more snow
    const windStreakCount = isMobile ? 15 : 30;
    
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      [canvas, windCanvas].forEach(c => {
        c.width = rect.width * dpr;
        c.height = rect.height * dpr;
        c.style.width = `${rect.width}px`;
        c.style.height = `${rect.height}px`;
      });
      ctx.scale(dpr, dpr);
      windCtx.scale(dpr, dpr);
    };
    
    resizeCanvas();
    
    // Heavy snowflake for blizzard
    class BlizzardSnowflake {
      constructor() {
        this.reset(true);
      }
      
      reset(initial = false) {
        const maxX = canvas.width / dpr;
        const maxY = canvas.height / dpr;
        
        // Start from left side or top for wind-driven effect
        if (Math.random() < 0.6) {
          // Come from left side (wind-blown)
          this.x = -10 - Math.random() * 50;
          this.y = Math.random() * maxY;
        } else {
          // Come from top
          this.x = Math.random() * maxX * 1.2;
          this.y = initial ? Math.random() * maxY : -10 - Math.random() * 30;
        }
        
        this.size = Math.random() * 4 + 1;
        this.speedY = Math.random() * 3 + 2; // Faster fall
        this.speedX = Math.random() * 8 + 5; // Strong horizontal wind!
        this.opacity = Math.random() * 0.7 + 0.3;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.05 + 0.02;
        this.wobbleAmount = Math.random() * 2 + 1;
        this.depth = Math.random();
        this.blur = this.depth < 0.3 ? 2 : 0;
      }
      
      update(windStrength, gustFactor) {
        this.wobble += this.wobbleSpeed;
        
        // Apply wind with gusts
        const windEffect = this.speedX * windStrength * (0.7 + gustFactor * 0.5);
        this.x += windEffect + Math.sin(this.wobble) * this.wobbleAmount;
        this.y += this.speedY * (0.5 + this.depth * 0.5);
        
        const maxX = canvas.width / dpr;
        const maxY = canvas.height / dpr;
        
        if (this.y > maxY + 20 || this.x > maxX + 50) {
          this.reset();
        }
      }
      
      draw(ctx) {
        ctx.save();
        ctx.beginPath();
        
        // Create slight motion blur effect for fast particles
        if (this.depth > 0.5) {
          // Draw trail for foreground particles
          ctx.moveTo(this.x - 3, this.y - 1);
          ctx.lineTo(this.x, this.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.3})`;
          ctx.lineWidth = this.size * 0.5;
          ctx.stroke();
        }
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * (0.5 + this.depth * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * (0.4 + this.depth * 0.6)})`;
        ctx.fill();
        ctx.restore();
      }
    }
    
    // Wind streak class for visible wind lines
    class WindStreak {
      constructor() {
        this.reset(true);
      }
      
      reset(initial = false) {
        const maxX = canvas.width / dpr;
        const maxY = canvas.height / dpr;
        
        this.x = initial ? Math.random() * maxX : -100;
        this.y = Math.random() * maxY;
        this.length = Math.random() * 80 + 40;
        this.speed = Math.random() * 20 + 15;
        this.opacity = Math.random() * 0.15 + 0.05;
        this.thickness = Math.random() * 1.5 + 0.5;
        this.angle = (Math.random() * 10 - 5) * Math.PI / 180; // Slight angle variation
      }
      
      update(windStrength) {
        this.x += this.speed * windStrength;
        this.y += Math.sin(this.angle) * this.speed * 0.1;
        
        if (this.x > canvas.width / dpr + this.length) {
          this.reset();
        }
      }
      
      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Create gradient for streak
        const gradient = ctx.createLinearGradient(0, 0, this.length, 0);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(0.3, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(0.7, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.length, 0);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
      }
    }
    
    // Create particles
    particlesRef.current = Array.from({ length: snowParticleCount }, () => new BlizzardSnowflake());
    windStreaksRef.current = Array.from({ length: windStreakCount }, () => new WindStreak());
    
    // Wind dynamics - more intense and variable for blizzard
    let windStrength = 1.0;
    let windTarget = 1.2;
    let gustFactor = 0;
    let gustTarget = 0;
    let windChangeTimer = 0;
    let gustTimer = 0;
    
    // Animation loop
    const animate = () => {
      const maxX = canvas.width / dpr;
      const maxY = canvas.height / dpr;
      
      ctx.clearRect(0, 0, maxX, maxY);
      windCtx.clearRect(0, 0, maxX, maxY);
      
      // Update wind with sudden gusts
      windChangeTimer++;
      gustTimer++;
      
      if (windChangeTimer > 100) {
        windTarget = Math.random() * 0.8 + 0.8; // Strong consistent wind
        windChangeTimer = 0;
      }
      
      // Random gusts
      if (gustTimer > 60 && Math.random() < 0.02) {
        gustTarget = Math.random() * 1.5 + 0.5;
        gustTimer = 0;
      }
      
      windStrength += (windTarget - windStrength) * 0.02;
      gustFactor += (gustTarget - gustFactor) * 0.1;
      gustTarget *= 0.95; // Gusts fade quickly
      
      // Draw wind streaks on separate canvas
      windStreaksRef.current.forEach(streak => {
        streak.update(windStrength + gustFactor * 0.5);
        streak.draw(windCtx);
      });
      
      // Update and draw snow particles
      particlesRef.current.forEach(particle => {
        particle.update(windStrength, gustFactor);
        particle.draw(ctx);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <motion.div
      className="absolute inset-0 z-5 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Wind streaks layer */}
      <canvas ref={windCanvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Snow particles layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Atmospheric white-out overlay - pulses with gusts */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ 
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(200, 220, 240, 0.12) 50%, rgba(255, 255, 255, 0.05) 100%)'
        }}
        animate={{ 
          opacity: [0.6, 1, 0.8, 1, 0.6],
          scale: [1, 1.01, 1, 1.02, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Wind vignette - darker edges with wind direction */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(50, 70, 100, 0.3) 0%, transparent 20%),
            radial-gradient(ellipse at center, transparent 40%, rgba(30, 50, 80, 0.25) 100%)
          `
        }}
      />
      
      {/* Ground snow accumulation / mist */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/4 pointer-events-none"
        style={{ 
          background: 'linear-gradient(to top, rgba(220, 235, 250, 0.4), rgba(200, 220, 240, 0.15) 50%, transparent)'
        }}
        animate={{ 
          opacity: [0.5, 0.8, 0.6, 0.9, 0.5],
          y: [0, -5, 0, -3, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Blowing snow at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(255, 255, 255, 0.3), transparent)'
        }}
        animate={{
          x: [0, 30, 0, 50, 0],
          opacity: [0.3, 0.5, 0.3, 0.6, 0.3]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Screen shake effect for intense gusts */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          x: [0, 2, -1, 3, -2, 1, 0],
          y: [0, 1, -1, 0, 1, -1, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: 'linear',
          times: [0, 0.15, 0.3, 0.5, 0.65, 0.85, 1]
        }}
      />
    </motion.div>
  );
};

export default BlizzardAmbient;


