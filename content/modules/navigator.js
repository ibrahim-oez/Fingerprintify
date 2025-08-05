// Navigator Spoofing Module
// Spoofs browser and hardware information

window.FingerprintifyModules = window.FingerprintifyModules || {};

window.FingerprintifyModules.navigator = {
  name: 'Navigator Spoofing',
  description: 'Spoofs browser and hardware information',
  
  apply: function(protectionSettings, utils) {
    if (!protectionSettings.navigator) {
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.info('Navigator', 'Protection disabled');
      }
      return;
    }
    
    if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
      window.FingerprintifyModules.logger.info('Navigator', 'Applying spoofing...');
    }
    
    // REALISTISCHE UserAgents - Echte Browser mit leichten Variationen
    const spoofedUserAgents = [
      // Windows Chrome Varianten (realistisch)
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      
      // Windows Firefox Varianten
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/120.0',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
      
      // macOS Safari Varianten
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      
      // Linux Chrome/Firefox
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/120.0',
      
      // Edge Varianten
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
    ];
    
    // REALISTISCHE Platforms - Echte Betriebssysteme
    const spoofedPlatforms = [
      'Win32',           // Windows Standard
      'MacIntel',        // macOS Intel
      'Linux x86_64',    // Linux 64-bit
      'Linux i686',      // Linux 32-bit (seltener)
      'Win64'            // Windows 64-bit (seltener)
    ];
    
    // REALISTISCHE CPU-Kerne - Echte Hardware
    const spoofedCores = [
      2, 4, 6, 8, 12, 16, // Standard Desktop/Laptop CPUs 
      2, 4, 6, 8, 12, 16, // Standard Desktop/Laptop CPUs
      20, 24, 32         // High-end Workstation CPUs (aber realistisch)
    ];
    
    // Create fake navigator object
    const fakeNav = {
      userAgent: utils.randomChoice(spoofedUserAgents),
      platform: utils.randomChoice(spoofedPlatforms), 
      language: utils.randomChoice(['en-US', 'en-GB', 'de-DE', 'fr-FR', 'es-ES', 'it-IT', 'pt-BR', 'ru-RU', 'ja-JP', 'ko-KR']),
      languages: [utils.randomChoice(['en-US', 'en-GB', 'de-DE', 'fr-FR']), 'en'],
      hardwareConcurrency: utils.randomChoice(spoofedCores),
      deviceMemory: utils.randomChoice([2, 4, 8, 16, 32]), // Realistische RAM-Werte
      maxTouchPoints: utils.randomChoice([0, 1, 5, 10]), // 0=Desktop, 1=seltener Touch, 5/10=Standard Touch
      cookieEnabled: true, // Immer true (realistisch)
      doNotTrack: utils.randomChoice(['1', '0', null]), // Nur realistische Werte
      vendor: utils.randomChoice(['Google Inc.', 'Apple Computer, Inc.', '', 'Mozilla']), // Echte Browser-Vendors
      vendorSub: '',
      product: 'Gecko',
      productSub: '20030107',
      appName: 'Netscape',
      appVersion: utils.randomChoice(['5.0 (Windows)', '5.0 (Macintosh)', '5.0 (X11)']),
      onLine: true,
      plugins: [],
      mimeTypes: [],
      userAgentData: {
        brands: [
          { brand: 'Google Chrome', version: '120' },
          { brand: 'Not)A;Brand', version: '99' },
          { brand: 'Chromium', version: '120' }
        ],
        mobile: false,
        platform: utils.randomChoice(spoofedPlatforms)
      }
    };
    
    // Apply navigator spoofing
    try {
      Object.defineProperty(window, 'navigator', {
        get: () => fakeNav,
        configurable: false
      });
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('Navigator', 'Complete window.navigator override applied');
      }
    } catch(e) {
      // Fallback: Override individual properties
      try {
        Object.defineProperty(navigator, 'userAgent', {
          value: fakeNav.userAgent,
          writable: false,
          configurable: false
        });
        Object.defineProperty(navigator, 'platform', {
          value: fakeNav.platform,
          writable: false,
          configurable: false
        });
        Object.defineProperty(navigator, 'hardwareConcurrency', {
          value: fakeNav.hardwareConcurrency,
          writable: false,
          configurable: false
        });
        Object.defineProperty(navigator, 'deviceMemory', {
          value: fakeNav.deviceMemory,
          writable: false,
          configurable: false
        });
        Object.defineProperty(navigator, 'maxTouchPoints', {
          value: fakeNav.maxTouchPoints,
          writable: false,
          configurable: false
        });
        Object.defineProperty(navigator, 'userAgentData', {
          value: fakeNav.userAgentData,
          writable: false,
          configurable: false
        });
        if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
          window.FingerprintifyModules.logger.success('Navigator', 'Individual property overrides applied');
        }
      } catch(e2) {
        if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
          window.FingerprintifyModules.logger.warn('Navigator', 'Partial override failed: ' + e2.message);
        }
      }
    }
    
    if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
      window.FingerprintifyModules.logger.debug('Navigator', 'UserAgent: ' + fakeNav.userAgent);
      window.FingerprintifyModules.logger.debug('Navigator', 'Platform: ' + fakeNav.platform);
      window.FingerprintifyModules.logger.debug('Navigator', 'Hardware Cores: ' + fakeNav.hardwareConcurrency);
      window.FingerprintifyModules.logger.debug('Navigator', 'Device Memory: ' + fakeNav.deviceMemory + 'GB');
    }
    
    return fakeNav;
  }
};
