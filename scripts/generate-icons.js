import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');

// 512x512 SVG master icon
const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="112" fill="#18181b"/>
  <path d="M256 96 L296 216 L416 256 L296 296 L256 416 L216 296 L96 256 L216 216 Z" fill="#2563eb"/>
  <circle cx="256" cy="256" r="40" fill="#ffffff"/>
</svg>
`;

// 1200x630 OG Banner SVG
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#09090b"/>
  
  <!-- Subtle background glow -->
  <circle cx="600" cy="260" r="320" fill="#2563eb" opacity="0.12"/>
  
  <!-- Brand Icon -->
  <g transform="translate(540, 120)">
    <rect width="120" height="120" rx="28" fill="#18181b" stroke="#27272a" stroke-width="2"/>
    <path d="M60 22 L70 50 L98 60 L70 70 L60 98 L50 70 L22 60 L50 50 Z" fill="#3b82f6"/>
    <circle cx="60" cy="60" r="10" fill="#ffffff"/>
  </g>
  
  <!-- Brand Name -->
  <text x="600" y="320" font-family="system-ui, -apple-system, sans-serif" font-size="54" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="-1">
    NOVA <tspan fill="#3b82f6">TOOLS</tspan>
  </text>
  
  <!-- Tagline -->
  <text x="600" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="500" fill="#a1a1aa" text-anchor="middle">
    Simple tools. Done well.
  </text>
  
  <!-- Supporting Line -->
  <text x="600" y="430" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="400" fill="#71717a" text-anchor="middle">
    Free, fast tools for everyday tasks
  </text>
  
  <!-- Subtle Badge -->
  <g transform="translate(480, 480)">
    <rect width="240" height="40" rx="20" fill="#18181b" stroke="#27272a" stroke-width="1"/>
    <text x="120" y="25" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500" fill="#93c5fd" text-anchor="middle">
      novatools.2bd.net
    </text>
  </g>
</svg>
`;

async function generate() {
  const iconBuffer = Buffer.from(iconSvg);
  const ogBuffer = Buffer.from(ogSvg);

  // 16x16
  await sharp(iconBuffer)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));

  // 32x32
  await sharp(iconBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  // 180x180 apple touch icon
  await sharp(iconBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 192x192 PWA
  await sharp(iconBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 512x512 PWA
  await sharp(iconBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 1200x630 OG banner
  await sharp(ogBuffer)
    .resize(1200, 630)
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));

  console.log('Successfully generated all icons and og-image.png');
}

generate().catch(console.error);
