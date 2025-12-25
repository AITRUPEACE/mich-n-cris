// src/components/interactions/SnowAmbient.jsx
// Non-blocking ambient snow effect for winter scenes

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const SnowAmbient = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    // Lighter particle count for ambient effect (performance-friendly)
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 50 : 80;
    
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    
    resizeCanvas();
    
    // Snowflake class - gentler motion for ambient effect
    class Snowflake {
      constructor() {
        this.reset(true);
      }
      
      reset(initial = false) {
        this.x = Math.random() * canvas.width / dpr;
        this.y = initial ? Math.random() * canvas.height / dpr : -10;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = Math.random() * 0.8 + 0.3; // Slower fall
        this.speedX = Math.random() * 0.5 - 0.1; // Gentler horizontal drift
        this.wind = Math.random() * 0.2 + 0.1;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.01 + 0.005;
        this.depth = Math.random();
      }
      
      update(windStrength) {
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.3 + this.speedX + (windStrength * this.wind);
        this.y += this.speedY * (0.5 + this.depth * 0.5);
        
        const maxX = canvas.width / dpr;
        const maxY = canvas.height / dpr;
        
        if (this.y > maxY + 10 || this.x > maxX + 30 || this.x < -30) {
          this.reset();
        }
      }
      
      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * (0.5 + this.depth * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * (0.3 + this.depth * 0.4)})`;
        ctx.fill();
      }
    }
    
    // Create particles
    particlesRef.current = Array.from({ length: particleCount }, () => new Snowflake());
    
    // Gentle wind variation
    let windStrength = 0.5;
    let windTarget = 0.5;
    let windChangeTimer = 0;
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      // Update wind gently
      windChangeTimer++;
      if (windChangeTimer > 200) {
        windTarget = Math.random() * 1.2 + 0.3;
        windChangeTimer = 0;
      }
      windStrength += (windTarget - windStrength) * 0.008;
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update(windStrength);
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
      className="absolute inset-0 z-5 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Subtle ground mist */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/6 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(200, 220, 235, 0.15), transparent)' }}
        animate={{ opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
};

export default SnowAmbient;

