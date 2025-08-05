// Screen Spoofing Module
// Spoofs screen resolution and color depth

window.FingerprintifyModules = window.FingerprintifyModules || {};

window.FingerprintifyModules.screen = {
  name: 'Screen Spoofing',
  description: 'Spoofs screen resolution and color depth',
  
  apply: function(protectionSettings, utils) {
    if (!protectionSettings.screen) {
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.info('Screen', 'Protection disabled');
      }
      return;
    }
    
    if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
      window.FingerprintifyModules.logger.info('Screen', 'Applying spoofing...');
    }
    
    // REALISTISCHE Auflösungen - Echte Monitor-Auflösungen
    const spoofedResolutions = [
      // Standard-Auflösungen (häufig)
      { width: 1920, height: 1080 },    // Full HD (sehr häufig)
      { width: 1366, height: 768 },     // Alte Laptops (sehr häufig)
      { width: 2560, height: 1440 },    // QHD (häufig)
      { width: 1536, height: 864 },     // 125% Windows Scaling
      { width: 1440, height: 900 },     // 16:10 Laptops
      
      // Weniger häufige aber realistische Auflösungen
      { width: 1680, height: 1050 },    // Alte 20" Monitore
      { width: 2048, height: 1152 },    // Seltene aber echte Auflösung
      { width: 1600, height: 900 },     // 16:9 aber seltener
      { width: 2560, height: 1600 },    // 16:10 QHD
      { width: 3840, height: 2160 },    // 4K (seltener aber real)
      
      // Ultrawide Monitore (real aber auffälliger)
      { width: 3440, height: 1440 },    // 21:9 Ultrawide
      { width: 2560, height: 1080 }     // 21:9 FHD Ultrawide
    ];
    
    const chosenRes = utils.randomChoice(spoofedResolutions);
    const fakeColorDepth = 24; // Immer 24-bit (Standard und realistisch)
    
    try {
      Object.defineProperties(window.screen, {
        width: { get: () => chosenRes.width, configurable: false },
        height: { get: () => chosenRes.height, configurable: false },
        availWidth: { get: () => chosenRes.width - utils.randomInt(0, 50), configurable: false }, // Realistische Taskbar-Abzüge
        availHeight: { get: () => chosenRes.height - utils.randomInt(30, 80), configurable: false }, // Realistische Taskbar-Abzüge
        colorDepth: { get: () => fakeColorDepth, configurable: false },
        pixelDepth: { get: () => fakeColorDepth, configurable: false }
      });
      
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('Screen', 'Spoofing applied');
        window.FingerprintifyModules.logger.debug('Screen', 'Resolution: ' + chosenRes.width + 'x' + chosenRes.height);
        window.FingerprintifyModules.logger.debug('Screen', 'Color Depth: ' + fakeColorDepth + ' bits');
      }
      
    } catch(e) {
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.warn('Screen', 'Override failed: ' + e.message);
      }
    }
    
    return { resolution: chosenRes, colorDepth: fakeColorDepth };
  }
};
