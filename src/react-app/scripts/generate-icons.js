// Script to generate PWA icons from cover image
// Run with: node scripts/generate-icons.js

import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [192, 512];
const inputPath = join(__dirname, '../public/images/cover.png');
const outputDir = join(__dirname, '../public/icons');

async function generateIcons() {
  try {
    // Ensure output directory exists
    await mkdir(outputDir, { recursive: true });
    
    // Get image metadata to calculate crop
    const metadata = await sharp(inputPath).metadata();
    const { width, height } = metadata;
    
    console.log(`Source image: ${width}x${height}`);
    
    // Focus on the characters in the center-bottom of the image
    const cropSize = Math.floor(Math.min(width, height) * 0.65);
    const left = Math.floor((width - cropSize) / 2);
    const top = Math.floor(height * 0.28);
    
    console.log(`Crop: ${cropSize}x${cropSize} starting at (${left}, ${top})`);
    
    for (const size of sizes) {
      const outputPath = join(outputDir, `icon-${size}.png`);
      
      // Padding for the circular frame
      const padding = Math.floor(size * 0.06); // 6% padding
      const innerSize = size - (padding * 2);
      const radius = size / 2;
      const innerRadius = innerSize / 2;
      
      // Create the cropped and resized character image
      const characterImage = await sharp(inputPath)
        .extract({
          left: left,
          top: top,
          width: cropSize,
          height: cropSize
        })
        .resize(innerSize, innerSize, {
          fit: 'cover',
          position: 'center'
        })
        .toBuffer();
      
      // Create circular mask for the character image
      const circleMask = Buffer.from(
        `<svg width="${innerSize}" height="${innerSize}">
          <circle cx="${innerRadius}" cy="${innerRadius}" r="${innerRadius}" fill="white"/>
        </svg>`
      );
      
      // Apply circular mask to character image
      const circularCharacters = await sharp(characterImage)
        .composite([{
          input: circleMask,
          blend: 'dest-in'
        }])
        .toBuffer();
      
      // Create the background with subtle gradient and border
      // Dark background matching the app theme with a subtle warm border
      const background = Buffer.from(
        `<svg width="${size}" height="${size}">
          <defs>
            <!-- Subtle radial gradient for depth -->
            <radialGradient id="bgGrad" cx="50%" cy="30%" r="70%">
              <stop offset="0%" style="stop-color:#1a1a1f"/>
              <stop offset="100%" style="stop-color:#0a0a0a"/>
            </radialGradient>
            <!-- Warm golden border gradient -->
            <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#d4a574;stop-opacity:0.6"/>
              <stop offset="50%" style="stop-color:#f5d4a0;stop-opacity:0.8"/>
              <stop offset="100%" style="stop-color:#d4a574;stop-opacity:0.6"/>
            </linearGradient>
            <!-- Subtle glow -->
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <!-- Dark background circle -->
          <circle cx="${radius}" cy="${radius}" r="${radius}" fill="url(#bgGrad)"/>
          <!-- Subtle golden border ring -->
          <circle cx="${radius}" cy="${radius}" r="${radius - 2}" fill="none" stroke="url(#borderGrad)" stroke-width="3" filter="url(#glow)"/>
          <!-- Inner subtle shadow ring -->
          <circle cx="${radius}" cy="${radius}" r="${innerRadius + padding/2}" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="2"/>
        </svg>`
      );
      
      // Composite everything together
      await sharp(background)
        .composite([{
          input: circularCharacters,
          left: padding,
          top: padding
        }])
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated ${outputPath}`);
    }
    
    console.log('\n✅ All icons generated successfully!');
    console.log('Icons have circular frame with subtle golden border.');
  } catch (error) {
    console.error('Error generating icons:', error.message);
    console.error(error.stack);
  }
}

generateIcons();
