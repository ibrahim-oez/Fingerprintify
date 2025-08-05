// Fingerprint Tracking Module
// Monitors and reports fingerprint changes

window.FingerprintifyModules = window.FingerprintifyModules || {};

window.FingerprintifyModules.tracker = {
  name: 'Fingerprint Tracker',
  description: 'Monitors fingerprint changes and computes hashes',
  
  currentFingerprint: null,
  fingerprintHash: null,
  
  apply: function(protectionSettings) {
    if (!protectionSettings.fingerprinting) {
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.info('Tracker', 'Tracking disabled');
      }
      return;
    }
    
    if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
      window.FingerprintifyModules.logger.info('Tracker', 'Starting fingerprint tracking...');
    }
    
    this.startTracking();
  },
  
  collectFingerprint: function() {
    const fingerprint = {
      timestamp: Date.now(),
      session: window._fingerprintifySession,
      components: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        languages: navigator.languages ? navigator.languages.join(',') : 'unknown',
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory,
        maxTouchPoints: navigator.maxTouchPoints,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        vendor: navigator.vendor,
        screen: {
          width: screen.width,
          height: screen.height,
          colorDepth: screen.colorDepth,
          pixelDepth: screen.pixelDepth,
          availWidth: screen.availWidth,
          availHeight: screen.availHeight
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        webgl: this.getWebGLInfo(),
        canvas: this.getCanvasFingerprint(),
        audio: this.getAudioFingerprint()
      }
    };
    
    return fingerprint;
  },
  
  getWebGLInfo: function() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) return 'not-supported';
      
      return {
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
      };
    } catch (e) {
      return 'error';
    }
  },
  
  getCanvasFingerprint: function() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Fingerprintify test 🛡️', 2, 2);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Canvas fingerprint', 4, 18);
      
      return canvas.toDataURL().substring(0, 50) + '...';
    } catch (e) {
      return 'error';
    }
  },
  
  getAudioFingerprint: function() {
    try {
      if (!window.AudioContext && !window.webkitAudioContext) {
        return 'not-supported';
      }
      
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      return {
        sampleRate: audioCtx.sampleRate,
        state: audioCtx.state,
        maxChannelCount: audioCtx.destination.maxChannelCount
      };
    } catch (e) {
      return 'error';
    }
  },
  
  computeHash: function(fingerprint) {
    // Simple hash function (in production, use crypto.subtle.digest)
    const str = JSON.stringify(fingerprint.components);
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16);
  },
  
  startTracking: function() {
    // Initial fingerprint
    this.updateFingerprint();
    
    // Track changes every 5 seconds
    setInterval(() => {
      this.updateFingerprint();
    }, 5000);
    
    // Track on important events
    ['focus', 'blur', 'resize'].forEach(event => {
      window.addEventListener(event, () => {
        setTimeout(() => this.updateFingerprint(), 100);
      });
    });
  },
  
  updateFingerprint: function() {
    const newFingerprint = this.collectFingerprint();
    const newHash = this.computeHash(newFingerprint);
    
    if (this.fingerprintHash !== newHash) {
      const oldHash = this.fingerprintHash;
      this.currentFingerprint = newFingerprint;
      this.fingerprintHash = newHash;
      
      // Dispatch fingerprint change event
      const event = new CustomEvent('fingerprintify-fingerprint-change', {
        detail: {
          type: 'fingerprint-update',
          data: {
            hash: newHash,
            previousHash: oldHash,
            fingerprint: newFingerprint,
            changed: !!oldHash
          }
        }
      });
      
      document.dispatchEvent(event);
      
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.debug('Tracker', 
          `Fingerprint ${oldHash ? 'changed' : 'initial'}: ${newHash}${oldHash ? ` (was: ${oldHash})` : ''}`);
      }
    }
  },
  
  getReport: function() {
    return {
      hash: this.fingerprintHash,
      fingerprint: this.currentFingerprint,
      session: window._fingerprintifySession,
      timestamp: Date.now()
    };
  }
};
