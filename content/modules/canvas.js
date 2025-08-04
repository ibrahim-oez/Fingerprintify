// Canvas Protection Module
// Adds noise to canvas fingerprints

window.FingerprintifyModules = window.FingerprintifyModules || {};

window.FingerprintifyModules.canvas = {
  name: 'Canvas Protection',
  description: 'Adds noise to canvas fingerprints',
  
  apply: function(protectionSettings, utils) {
    if (!protectionSettings.canvas) {
      if (window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.info('Canvas', 'Protection disabled');
      }
      return;
    }
    
    if (window.FingerprintifyModules.logger) {
      window.FingerprintifyModules.logger.info('Canvas', 'Applying protection...');
    }
    
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
      const context = originalGetContext.call(this, contextType, contextAttributes);
      
      if (contextType === '2d' && context) {
        // Override getImageData with massive noise injection
        const originalGetImageData = context.getImageData;
        context.getImageData = function(sx, sy, sw, sh) {
          const imageData = originalGetImageData.call(this, sx, sy, sw, sh);
          // Add subtle but effective noise (reduced from 50% to 10%)
          for (let i = 0; i < imageData.data.length; i += 4) {
            if (utils.deterministicRandom() < 0.1) {
              // Subtle changes instead of completely random pixels
              imageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] + utils.randomInt(-20, 20)));     // R
              imageData.data[i + 1] = Math.min(255, Math.max(0, imageData.data[i + 1] + utils.randomInt(-20, 20))); // G
              imageData.data[i + 2] = Math.min(255, Math.max(0, imageData.data[i + 2] + utils.randomInt(-20, 20))); // B
            }
          }
          return imageData;
        };
        
        // Override fillText to add subtle variations (reduced offset)
        const originalFillText = context.fillText;
        context.fillText = function(text, x, y, maxWidth) {
          const offsetX = (utils.deterministicRandom() - 0.5) * 0.5; // Reduced from 2 to 0.5
          const offsetY = (utils.deterministicRandom() - 0.5) * 0.5; // Reduced from 2 to 0.5
          return originalFillText.call(this, text, x + offsetX, y + offsetY, maxWidth);
        };
        
        // Override strokeText similarly (reduced offset)
        const originalStrokeText = context.strokeText;
        context.strokeText = function(text, x, y, maxWidth) {
          const offsetX = (utils.deterministicRandom() - 0.5) * 0.5; // Reduced from 2 to 0.5
          const offsetY = (utils.deterministicRandom() - 0.5) * 0.5; // Reduced from 2 to 0.5
          return originalStrokeText.call(this, text, x + offsetX, y + offsetY, maxWidth);
        };
        
        if (window.FingerprintifyModules.logger) {
          window.FingerprintifyModules.logger.success('Canvas', '2D context protection applied');
        }
      }
      
      // WebGL context spoofing
      if ((contextType === 'webgl' || contextType === 'experimental-webgl' || contextType === 'webgl2') && context) {
        const originalReadPixels = context.readPixels;
        context.readPixels = function(x, y, width, height, format, type, pixels) {
          originalReadPixels.call(this, x, y, width, height, format, type, pixels);
          // Add noise to WebGL fingerprint
          if (pixels && pixels.length) {
            for (let i = 0; i < pixels.length; i++) {
              if (utils.deterministicRandom() > 0.7) {
                pixels[i] = Math.floor(utils.deterministicRandom() * 256);
              }
            }
          }
        };
        if (window.FingerprintifyModules.logger) {
          window.FingerprintifyModules.logger.success('Canvas', 'WebGL context protection applied');
        }
      }
      
      return context;
    };
    
    // Override toDataURL with subtle noise
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function(type, encoderOptions) {
      const ctx = this.getContext('2d');
      if (ctx && this.width > 0 && this.height > 0) {
        try {
          // Add subtle random pixels before conversion (reduced intensity)
          const imageData = ctx.getImageData(0, 0, this.width, this.height);
          for (let i = 0; i < imageData.data.length; i += 4) {
            if (utils.deterministicRandom() < 0.05) { // Reduced from 0.3 to 0.05
              imageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] + utils.randomInt(-5, 5)));
              imageData.data[i + 1] = Math.min(255, Math.max(0, imageData.data[i + 1] + utils.randomInt(-5, 5)));
              imageData.data[i + 2] = Math.min(255, Math.max(0, imageData.data[i + 2] + utils.randomInt(-5, 5)));
            }
          }
          ctx.putImageData(imageData, 0, 0);
        } catch (e) {
          // If getImageData fails, just continue without noise
          if (window.FingerprintifyModules.logger) {
            window.FingerprintifyModules.logger.warn('Canvas', 'Could not add noise to toDataURL');
          }
        }
      }
      return originalToDataURL.call(this, type, encoderOptions);
    };
    
    if (window.FingerprintifyModules.logger) {
      window.FingerprintifyModules.logger.success('Canvas', 'Complete protection applied');
    }
  }
};
