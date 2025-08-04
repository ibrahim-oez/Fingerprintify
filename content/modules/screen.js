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
    
    // SEMI-REALISTISCHE Auflösungen - Ungewöhnlich aber nicht unmöglich
    const spoofedResolutions = [
      { width: 1920, height: 1080 },    // Standard aber häufig
      { width: 2560, height: 1440 },    // Standard QHD
      { width: 3440, height: 1440 },    // Ultrawide
      { width: 2560, height: 1600 },    // 16:10 Format
      { width: 1366, height: 768 },     // Alte Laptops
      { width: 1440, height: 900 },     // Ungewöhnlich aber real
      { width: 2048, height: 1152 },    // Seltene Auflösung
      { width: 2304, height: 1440 },    // MacBook Pro Retina
      { width: 1680, height: 1050 },    // Alte Monitore
      { width: 1600, height: 900 },     // 16:9 aber ungewöhnlich
      { width: 1536, height: 864 }      // 125% Skalierung
    ];
    
    const chosenRes = utils.randomChoice(spoofedResolutions);
    const fakeColorDepth = [24, 32][utils.randomInt(0, 1)]; // Nur realistische Werte
    
    try {
      Object.defineProperties(window.screen, {
        width: { get: () => chosenRes.width, configurable: false },
        height: { get: () => chosenRes.height, configurable: false },
        availWidth: { get: () => chosenRes.width - utils.randomInt(0, 100), configurable: false },
        availHeight: { get: () => chosenRes.height - utils.randomInt(0, 100), configurable: false },
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
