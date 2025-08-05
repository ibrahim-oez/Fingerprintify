// Battery API Blocking Module
// Prevents battery level fingerprinting

window.FingerprintifyModules = window.FingerprintifyModules || {};

window.FingerprintifyModules.battery = {
  name: 'Battery API Blocking',
  description: 'Blocks battery level fingerprinting',
  
  apply: function(protectionSettings) {
    if (!protectionSettings.battery) {
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.info('Battery', 'Protection disabled');
      }
      return;
    }
    
    if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
      window.FingerprintifyModules.logger.info('Battery', 'Applying blocking...');
    }
    
    // Block getBattery method
    if (navigator.getBattery) {
      navigator.getBattery = function() {
        return Promise.reject(new Error('Battery API blocked by Fingerprintify'));
      };
      
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('Battery', 'navigator.getBattery() blocked');
      }
    }
    
    // Block battery property access
    if ('battery' in navigator) {
      Object.defineProperty(navigator, 'battery', {
        get: function() {
          throw new Error('Battery API blocked by Fingerprintify');
        },
        configurable: false
      });
      
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('Battery', 'navigator.battery property blocked');
      }
    }
    
    // Block webkitBattery (legacy)
    if ('webkitBattery' in navigator) {
      Object.defineProperty(navigator, 'webkitBattery', {
        get: function() {
          throw new Error('Battery API blocked by Fingerprintify');
        },
        configurable: false
      });
      
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('Battery', 'navigator.webkitBattery blocked');
      }
    }
  }
};
