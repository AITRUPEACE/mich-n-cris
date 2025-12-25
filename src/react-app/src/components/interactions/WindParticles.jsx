// src/components/interactions/WindParticles.jsx
// Mobile-optimized snow/wind particle effect

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const WindParticles = ({ onComplete, pageData }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    // Fewer particles on mobile for performance
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 80 : 120;
    
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    
    resizeCanvas();
    
    // Snowflake class
    class Snowflake {
      constructor() {
        this.reset(true);
      }
      
      reset(initial = false) {
        this.x = Math.random() * canvas.width / dpr;
        this.y = initial ? Math.random() * canvas.height / dpr : -10;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 1.5 + 0.8;
        this.speedX = Math.random() * 1.5 - 0.3;
        this.wind = Math.random() * 0.4 + 0.4;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.015 + 0.008;
        this.depth = Math.random();
      }
      
      update(windStrength) {
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.4 + this.speedX + (windStrength * this.wind);
        this.y += this.speedY * (0.5 + this.depth * 0.5);
        
        const maxX = canvas.width / dpr;
        const maxY = canvas.height / dpr;
        
        if (this.y > maxY + 10 || this.x > maxX + 40 || this.x < -40) {
          this.reset();
        }
      }
      
      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * (0.5 + this.depth * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * (0.4 + this.depth * 0.5)})`;
        ctx.fill();
      }
    }
    
    // Create particles
    particlesRef.current = Array.from({ length: particleCount }, () => new Snowflake());
    
    // Wind varies over time
    let windStrength = 1.5;
    let windTarget = 1.5;
    let windChangeTimer = 0;
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      // Update wind
      windChangeTimer++;
      if (windChangeTimer > 150) {
        windTarget = Math.random() * 2.5 + 0.8;
        windChangeTimer = 0;
      }
      windStrength += (windTarget - windStrength) * 0.015;
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update(windStrength);
        particle.draw(ctx);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    window.addEventListener('resize', resizeCanvas);
    
    // Auto-complete after viewing
    const completeTimer = setTimeout(() => onComplete?.(), 4000);
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);
  
  return (
    <motion.div
      className="absolute inset-0 z-10 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Simplified wind lines - fewer on mobile */}
      <div className="absolute inset-0 overflow-hidden hidden sm:block">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
            style={{ width: '25%', top: `${25 + i * 20}%`, left: '-25%' }}
            animate={{ x: ['0%', '250%'], opacity: [0, 0.4, 0] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 1, ease: 'linear' }}
          />
        ))}
      </div>
      
      {/* Ground mist */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/5 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(200, 220, 235, 0.25), transparent)' }}
        animate={{ opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
};

export default WindParticles;
