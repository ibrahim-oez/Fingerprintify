const fs = require('fs');
const path = require('path');

// Build script for Fingerprintify Extension
console.log('🔨 Building Fingerprintify Extension...');

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Create content directory in dist
const contentDir = path.join(distDir, 'content');
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

// Read all module files and combine them
const moduleFiles = [
  'content/modules/logger.js',
  'content/modules/utils.js', 
  'content/modules/settings.js',
  'content/modules/navigator.js',
  'content/modules/screen.js',
  'content/modules/webgl.js',
  'content/modules/canvas.js',
  'content/modules/audio.js',
  'content/modules/webrtc.js',
  'content/inject-modular.js'
];

let combinedContent = '';

// Set production mode in logger
const loggerPath = path.join(__dirname, 'content/modules/logger.js');
let loggerContent = fs.readFileSync(loggerPath, 'utf8');
loggerContent = loggerContent.replace('const isDevelopment = false;', 'const isDevelopment = false;');
combinedContent += loggerContent + '\n\n';

// Add other modules
for (let i = 1; i < moduleFiles.length; i++) {
  const filePath = path.join(__dirname, moduleFiles[i]);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    combinedContent += content + '\n\n';
  }
}

// Write combined file
const outputPath = path.join(contentDir, 'content-bundle.js');
fs.writeFileSync(outputPath, combinedContent);

// Copy production manifest
const prodManifest = path.join(__dirname, 'manifest.production.json');
const targetManifest = path.join(distDir, 'manifest.json');
fs.copyFileSync(prodManifest, targetManifest);

console.log('✅ Build complete! Files ready for minification.');
console.log('📁 Combined content file:', outputPath);
console.log('📄 Production manifest copied to dist/');
console.log('\n🚀 Next steps:');
console.log('1. npm install (to install build tools)');
console.log('2. npm run build:prod (to minify and obfuscate)');
console.log('3. Use dist/ folder for Chrome Web Store upload');
