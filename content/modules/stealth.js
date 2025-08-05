// Stealth Module
// Makes spoofed functions appear native to avoid detection

window.FingerprintifyModules = window.FingerprintifyModules || {};

window.FingerprintifyModules.stealth = {
  name: 'Stealth Anti-Detection',
  description: 'Makes spoofed functions appear native to avoid detection',
  
  apply: function(protectionSettings) {
    if (!protectionSettings.stealth) {
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.info('Stealth', 'Protection disabled');
      }
      return;
    }
    
    if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
      window.FingerprintifyModules.logger.info('Stealth', 'Applying anti-detection...');
    }
    
    // Helper function to make functions appear native
    function makeNative(func, name) {
      if (!func || typeof func !== 'function') return func;
      
      try {
        // Spoof toString to return native code appearance
        Object.defineProperty(func, 'toString', {
          value: function() {
            return `function ${name}() { [native code] }`;
          },
          writable: false,
          configurable: false
        });
        
        // Spoof function name
        Object.defineProperty(func, 'name', {
          value: name,
          writable: false,
          configurable: false
        });
        
        return func;
      } catch (e) {
        // If we can't modify, return original
        return func;
      }
    }
    
    // List of commonly checked functions that might be spoofed
    const functionsToCloak = [
      { obj: window, name: 'fetch' },
      { obj: Navigator.prototype, name: 'userAgent' },
      { obj: Screen.prototype, name: 'width' },
      { obj: Screen.prototype, name: 'height' },
      { obj: HTMLCanvasElement.prototype, name: 'getContext' },
      { obj: HTMLCanvasElement.prototype, name: 'toDataURL' },
      { obj: CanvasRenderingContext2D.prototype, name: 'getImageData' },
      { obj: WebGLRenderingContext.prototype, name: 'getParameter' },
      { obj: AudioContext.prototype, name: 'createOscillator' }
    ];
    
    functionsToCloak.forEach(({ obj, name }) => {
      try {
        if (obj && obj[name]) {
          obj[name] = makeNative(obj[name], name);
        }
      } catch (e) {
        // Silently continue if we can't modify
      }
    });
    
    // Spoof Function.prototype.toString for broader coverage
    const originalToString = Function.prototype.toString;
    Function.prototype.toString = function() {
      // Check if this function is likely spoofed by checking for our markers
      const funcString = originalToString.call(this);
      
      // If function contains fingerprinting keywords, make it look native
      if (funcString.includes('Fingerprintify') || 
          funcString.includes('spoof') || 
          funcString.includes('fake') ||
          funcString.includes('random')) {
        return `function ${this.name || 'anonymous'}() { [native code] }`;
      }
      
      return originalToString.call(this);
    };
    
    // Protect our toString override
    makeNative(Function.prototype.toString, 'toString');
    
    // Spoof Object.getOwnPropertyDescriptor to hide modifications
    const originalGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    Object.getOwnPropertyDescriptor = function(obj, prop) {
      const descriptor = originalGetOwnPropertyDescriptor.call(this, obj, prop);
      
      if (descriptor && descriptor.get && descriptor.get.toString().includes('Fingerprintify')) {
        // Return a descriptor that looks native
        return {
          ...descriptor,
          configurable: true,
          enumerable: true
        };
      }
      
      return descriptor;
    };
    
    // Protect our getOwnPropertyDescriptor override
    makeNative(Object.getOwnPropertyDescriptor, 'getOwnPropertyDescriptor');
    
    // Hide performance timing modifications
    if (performance && performance.now) {
      const originalNow = performance.now;
      performance.now = function() {
        // Add tiny random jitter to prevent timing-based detection
        return originalNow.call(this) + (Math.random() - 0.5) * 0.1;
      };
      makeNative(performance.now, 'now');
    }
    
    if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
      window.FingerprintifyModules.logger.success('Stealth', 'Anti-detection measures applied');
    }
  }
};
