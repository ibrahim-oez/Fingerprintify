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
    
    // VÖLLIG UNREALISTISCHE UserAgents - Existieren nicht!
    const spoofedUserAgents = [
      'Mozilla/5.0 (Windows NT 15.0; Win128; x128) AppleWebKit/999.99 (KHTML, like Gecko) Chrome/250.0.0.0 Safari/999.99',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 20_50_99) AppleWebKit/777.77 (KHTML, like Gecko) Chrome/300.0.0.0 Safari/777.77',
      'Mozilla/5.0 (QuantumOS 12.5; Quantum64; x64) AppleWebKit/888.88 (KHTML, like Gecko) HyperBrowser/500.0.0.0',
      'Mozilla/5.0 (Windows NT 12.0; ARM128; aarch128) WebKit/666.66 (KHTML, like Gecko) FutureFox/999.0',
      'Mozilla/5.0 (UltraLinux 99.9; x256) AppleWebKit/1111.11 (KHTML, like Gecko) QuantumChrome/777.0.0.0',
      'Mozilla/5.0 (HoloWindows 25.0; Win256; x256) HyperWebKit/2000.0 (KHTML, like Gecko) MetaBrowser/1000.0.0.0',
      'Mozilla/5.0 (CyberMac; Intel Quantum X 50_0_0) AppleWebKit/3000.0 (KHTML, like Gecko) NeuralSafari/888.0.0.0',
      'Mozilla/5.0 (NeoAndroid 25.0; ARM256; aarch256) AppleWebKit/4444.44 (KHTML, like Gecko) CyberChrome/1500.0.0.0',
      'Mozilla/5.0 (HyperOS 99.0; Quantum128; x128) AppleWebKit/5555.55 (KHTML, like Gecko) UltraBrowser/2000.0.0.0',
      'Mozilla/5.0 (MetaWindows 50.0; Win512; x512) NeuralWebKit/9999.99 (KHTML, like Gecko) QuantumFox/5000.0'
    ];
    
    // UNMÖGLICHE Platforms - Existieren nicht!
    const spoofedPlatforms = [
      'Win128', 'Win256', 'Win512', 'Win1024',
      'MacQuantum', 'MacNeural', 'MacHolo', 'MacCyber',
      'Linux x256', 'Linux x512', 'Linux quantum64', 'Linux neural128',
      'UltraLinux', 'HyperLinux', 'QuantumLinux', 'NeuralLinux',
      'QuantumOS', 'HoloWindows', 'CyberMac', 'NeoAndroid',
      'ARM256', 'ARM512', 'ARM1024', 'QuantumARM',
      'HyperX86', 'UltraX64', 'QuantumX128', 'NeuralX256',
      'MetaOS', 'HyperOS', 'FutureOS', 'NeuroOS'
    ];
    
    // UNREALISTISCHE CPU-Kerne
    const spoofedCores = [
      3, 5, 7, 9, 11, 13, 15, 17, 20, 24, 28, 32, 
      48, 64, 96, 128, 256, 512, 1024, 2048, 4096,
      33, 37, 41, 47, 53, 67, 73, 97, 129, 257
    ];
    
    // Create fake navigator object
    const fakeNav = {
      userAgent: utils.randomChoice(spoofedUserAgents),
      platform: utils.randomChoice(spoofedPlatforms), 
      language: 'quantum-QU',
      languages: ['quantum-QU', 'neural-NE', 'en-US'],
      hardwareConcurrency: utils.randomChoice(spoofedCores),
      deviceMemory: [3, 6, 12, 24, 48, 96, 128, 256, 512, 1024][utils.randomInt(0, 9)],
      maxTouchPoints: [0, 1, 2, 5, 10, 16, 32, 64, 128, 256][utils.randomInt(0, 9)],
      cookieEnabled: [true, false][utils.randomInt(0, 1)],
      doNotTrack: ['1', '0', null, 'unspecified', 'quantum', 'neural'][utils.randomInt(0, 5)],
      vendor: utils.randomChoice(['Quantum Corp', 'HoloTech Inc', 'CyberSoft Ltd', 'QuantumTech Inc.', 'NeuralProcessing Ltd.']),
      vendorSub: '',
      product: 'Gecko',
      productSub: '20030107',
      appName: 'Netscape',
      appVersion: utils.randomChoice(['5.0 (QuantumOS)', '5.0 (HoloWindows)', '5.0 (CyberMac)']),
      onLine: true,
      plugins: [],
      mimeTypes: [],
      userAgentData: {
        brands: [
          { brand: 'QuantumBrowser', version: '500' },
          { brand: 'Not)A;Brand', version: '99' },
          { brand: 'HyperChrome', version: '888' }
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
