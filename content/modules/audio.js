// Audio Spoofing Module
// Randomizes audio context fingerprints

window.FingerprintifyModules = window.FingerprintifyModules || {};

window.FingerprintifyModules.audio = {
  name: 'Audio Spoofing',
  description: 'Randomizes audio context fingerprints',
  
  apply: function(protectionSettings, utils) {
    if (!protectionSettings.audio) {
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.info('Audio', 'Protection disabled');
      }
      return;
    }
    
    if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
      window.FingerprintifyModules.logger.info('Audio', 'Applying spoofing...');
    }
    
    if (window.AudioContext || window.webkitAudioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      
      // Override createOscillator
      const originalCreateOscillator = AudioCtx.prototype.createOscillator;
      AudioCtx.prototype.createOscillator = function() {
        const oscillator = originalCreateOscillator.call(this);
        const originalConnect = oscillator.connect;
        oscillator.connect = function(destination) {
          // Add slight frequency variation to scramble audio fingerprint
          if (this.frequency) {
            this.frequency.value = this.frequency.value + (utils.deterministicRandom() - 0.5) * 0.001;
          }
          return originalConnect.call(this, destination);
        };
        return oscillator;
      };
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('Audio', 'createOscillator overridden');
      }
      
      // Override createAnalyser
      const originalCreateAnalyser = AudioCtx.prototype.createAnalyser;
      AudioCtx.prototype.createAnalyser = function() {
        const analyser = originalCreateAnalyser.call(this);
        const originalGetFloatFrequencyData = analyser.getFloatFrequencyData;
        
        analyser.getFloatFrequencyData = function(array) {
          originalGetFloatFrequencyData.call(this, array);
          // Add noise to audio fingerprinting
          for (let i = 0; i < array.length; i++) {
            array[i] += (utils.deterministicRandom() - 0.5) * 0.1;
          }
        };
        
        return analyser;
      };
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('Audio', 'createAnalyser overridden');
      }
      
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('Audio', 'Complete spoofing applied');
      }
    } else {
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.warn('Audio', 'AudioContext not available');
      }
    }
  }
};
