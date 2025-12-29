// src/components/interactions/RisingLines.jsx
// Animated vertical lines effect to create sensation of rising/ascending

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const RisingLines = ({ 
  intensity = 'normal', 
  color = 'white',
  speed = 'slow',           // 'slow', 'medium', 'fast' or number (0.1 - 2.0)
  lineLength = 'normal',    // 'short', 'normal', 'long' or number
  radialEffect = true,      // true/false or object { position, color, intensity, size }
  vignette = true,          // true/false or object { intensity, color }
  glow = true               // enable/disable line glow
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const linesRef = useRef([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    // Line counts based on intensity
    const isMobile = window.innerWidth < 768;
    const lineCounts = {
      subtle: isMobile ? 20 : 35,
      normal: isMobile ? 35 : 60,
      intense: isMobile ? 50 : 90
    };
    const lineCount = lineCounts[intensity] || lineCounts.normal;
    
    // Speed multiplier
    const speedMultipliers = {
      slow: 0.3,
      medium: 0.6,
      fast: 1.0
    };
    const speedMult = typeof speed === 'number' ? speed : (speedMultipliers[speed] || 0.3);
    
    // Line length multiplier
    const lengthMultipliers = {
      short: 0.5,
      normal: 1.0,
      long: 1.5
    };
    const lengthMult = typeof lineLength === 'number' ? lineLength : (lengthMultipliers[lineLength] || 1.0);
    
    // Color configurations
    const colorConfigs = {
      white: {
        primary: [255, 255, 255],
        glow: [200, 220, 255]
      },
      cosmic: {
        primary: [180, 150, 255],
        glow: [120, 80, 200]
      },
      gold: {
        primary: [255, 220, 150],
        glow: [255, 180, 80]
      },
      cyan: {
        primary: [100, 220, 255],
        glow: [50, 180, 220]
      },
      pink: {
        primary: [255, 150, 200],
        glow: [220, 100, 160]
      },
      rainbow: null // Special handling
    };
    
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    
    resizeCanvas();
    
    // Rising line class
    class RisingLine {
      constructor() {
        this.reset(true);
      }
      
      reset(initial = false) {
        const maxX = canvas.width / dpr;
        const maxY = canvas.height / dpr;
        
        this.x = Math.random() * maxX;
        this.y = initial ? Math.random() * maxY : -50 - Math.random() * 100;
        
        // Line properties - slower base speed
        this.length = (Math.random() * 80 + 40) * lengthMult;
        this.speed = (Math.random() * 3 + 1.5) * speedMult; // Much slower default
        this.thickness = Math.random() * 2 + 0.5;
        
        // Slight angle for organic feel
        this.angle = (Math.random() - 0.5) * 0.1;
        
        // Opacity and depth
        this.depth = Math.random();
        this.baseOpacity = Math.random() * 0.3 + 0.1;
        this.opacity = this.baseOpacity;
        
        // Fade in/out zones
        this.fadeInEnd = maxY * 0.15;
        this.fadeOutStart = maxY * 0.85;
        
        // Color variation for rainbow mode
        if (color === 'rainbow') {
          this.hue = Math.random() * 360;
        }
        
        // Shimmer
        this.shimmerPhase = Math.random() * Math.PI * 2;
        this.shimmerSpeed = Math.random() * 0.05 + 0.02; // Slower shimmer
      }
      
      update() {
        const maxY = canvas.height / dpr;
        
        // Move downward (creates rising sensation)
        this.y += this.speed * (0.5 + this.depth * 0.5);
        
        // Shimmer effect
        this.shimmerPhase += this.shimmerSpeed;
        const shimmer = 0.7 + Math.sin(this.shimmerPhase) * 0.3;
        
        // Calculate opacity based on position (fade in/out at edges)
        let positionOpacity = 1;
        if (this.y < this.fadeInEnd) {
          positionOpacity = this.y / this.fadeInEnd;
        } else if (this.y > this.fadeOutStart) {
          positionOpacity = 1 - (this.y - this.fadeOutStart) / (maxY - this.fadeOutStart);
        }
        
        this.opacity = this.baseOpacity * shimmer * Math.max(0, positionOpacity);
        
        // Reset when off screen
        if (this.y > maxY + this.length) {
          this.reset();
        }
      }
      
      draw(ctx) {
        if (this.opacity <= 0) return;
        
        ctx.save();
        
        const endX = this.x + Math.sin(this.angle) * this.length;
        const endY = this.y + this.length;
        
        // Get color
        let r, g, b;
        if (color === 'rainbow') {
          // Convert HSL to RGB for rainbow
          const h = this.hue / 360;
          const s = 0.7;
          const l = 0.7;
          const c = (1 - Math.abs(2 * l - 1)) * s;
          const x = c * (1 - Math.abs((h * 6) % 2 - 1));
          const m = l - c / 2;
          let r1, g1, b1;
          if (h < 1/6) { r1 = c; g1 = x; b1 = 0; }
          else if (h < 2/6) { r1 = x; g1 = c; b1 = 0; }
          else if (h < 3/6) { r1 = 0; g1 = c; b1 = x; }
          else if (h < 4/6) { r1 = 0; g1 = x; b1 = c; }
          else if (h < 5/6) { r1 = x; g1 = 0; b1 = c; }
          else { r1 = c; g1 = 0; b1 = x; }
          r = Math.round((r1 + m) * 255);
          g = Math.round((g1 + m) * 255);
          b = Math.round((b1 + m) * 255);
          // Slowly shift hue
          this.hue = (this.hue + 0.1) % 360;
        } else {
          const config = colorConfigs[color] || colorConfigs.white;
          [r, g, b] = config.primary;
        }
        
        // Create gradient for the line (bright at top, fades at bottom)
        const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.opacity})`);
        gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.8})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        // Draw main line
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.thickness * (0.5 + this.depth * 0.5);
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Draw glow for brighter lines
        if (glow && this.depth > 0.6 && this.opacity > 0.1) {
          const glowGradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
          glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.3})`);
          glowGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = glowGradient;
          ctx.lineWidth = this.thickness * 4;
          ctx.stroke();
        }
        
        ctx.restore();
      }
    }
    
    // Create lines
    linesRef.current = Array.from({ length: lineCount }, () => new RisingLine());
    
    // Animation loop
    const animate = () => {
      const maxX = canvas.width / dpr;
      const maxY = canvas.height / dpr;
      
      ctx.clearRect(0, 0, maxX, maxY);
      
      // Sort by depth for layering
      linesRef.current.sort((a, b) => a.depth - b.depth);
      
      // Update and draw lines
      linesRef.current.forEach(line => {
        line.update();
        line.draw(ctx);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [intensity, color, speed, lineLength, glow]);
  
  // Parse radial effect options
  const radialConfig = typeof radialEffect === 'object' ? radialEffect : {};
  const showRadial = radialEffect !== false;
  const radialPosition = radialConfig.position || 'top'; // 'top', 'center', 'bottom'
  const radialColor = radialConfig.color || 'white'; // 'white', 'cosmic', 'warm'
  const radialIntensity = radialConfig.intensity || 0.08;
  const radialSize = radialConfig.size || 'normal'; // 'small', 'normal', 'large'
  
  // Parse vignette options
  const vignetteConfig = typeof vignette === 'object' ? vignette : {};
  const showVignette = vignette !== false;
  const vignetteIntensity = vignetteConfig.intensity || 0.2;
  const vignetteColor = vignetteConfig.color || 'black';
  
  // Radial gradient position mapping
  const radialPositions = {
    top: '50% -10%',
    center: '50% 50%',
    bottom: '50% 110%'
  };
  
  // Radial gradient sizes
  const radialSizes = {
    small: '40% 20%',
    normal: '80% 40%',
    large: '120% 60%'
  };
  
  // Radial colors
  const radialColors = {
    white: 'rgba(255, 255, 255,',
    cosmic: 'rgba(180, 150, 255,',
    warm: 'rgba(255, 220, 180,',
    cyan: 'rgba(100, 220, 255,',
    pink: 'rgba(255, 150, 200,'
  };
  
  // Vignette colors
  const vignetteColors = {
    black: 'rgba(0, 0, 0,',
    dark: 'rgba(10, 10, 30,',
    cosmic: 'rgba(20, 10, 40,'
  };
  
  return (
    <motion.div
      className="absolute inset-0 z-5 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Lines canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Configurable radial light effect */}
      {showRadial && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse ${radialSizes[radialSize] || radialSizes.normal} at ${radialPositions[radialPosition] || radialPositions.top}, ${radialColors[radialColor] || radialColors.white} ${radialIntensity}) 0%, transparent 60%)`
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      
      {/* Configurable vignette */}
      {showVignette && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 30%, ${vignetteColors[vignetteColor] || vignetteColors.black} ${vignetteIntensity}) 100%)`
          }}
        />
      )}
    </motion.div>
  );
};

export default RisingLines;
