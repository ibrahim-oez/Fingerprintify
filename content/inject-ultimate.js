// ULTIMATE Anti-Fingerprinting Protection - Combined Ultra + Ultimate
(function() {
  'use strict';
  
  console.log('🛡️ Fingerprintify: ULTIMATE+ULTRA protection starting...');
  
  // Protection settings (will be updated from storage via content script)
  let protectionSettings = {
    navigator: false,  // Default to FALSE to prevent blocking
    screen: false,
    webgl: false,
    canvas: false,
    audio: false,
    fonts: false,
    webrtc: false,     // Default WebRTC to FALSE 
    tracking: false
  };
  
  // Check if settings were pre-injected by content script
  if (window._fingerprintifyPreloadedSettings) {
    protectionSettings = { ...protectionSettings, ...window._fingerprintifyPreloadedSettings };
    console.log('🛡️ Using preloaded settings:', protectionSettings);
  }
  
  // Set protection flags
  window._fingerprintifyActive = true;
  window._fingerprintifySession = 'session_' + Date.now();
  window._fingerprintifyProfile = Math.floor(Math.random() * 10) + 1;
  window._fingerprintifySettings = protectionSettings;
  
  // Generate session-consistent random values
  const sessionSeed = Date.now() + Math.random();
  let seedCounter = 0;
  
  function deterministicRandom() {
    seedCounter++;
    const x = Math.sin(sessionSeed + seedCounter) * 10000;
    return x - Math.floor(x);
  }
  
  function randomInt(min, max) {
    return Math.floor(deterministicRandom() * (max - min + 1)) + min;
  }
  
  function randomChoice(array) {
    return array[Math.floor(deterministicRandom() * array.length)];
  }
  
  // ==== ULTRA-AGGRESSIVE USER AGENT SPOOFING ====
  const spoofedUserAgents = [
    // VÖLLIG UNREALISTISCHE UserAgents - Existieren nicht!
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
  
  const spoofedPlatforms = [
    // UNMÖGLICHE Platforms - Existieren nicht!
    'Win128', 'Win256', 'Win512', 'Win1024',
    'MacQuantum', 'MacNeural', 'MacHolo', 'MacCyber',
    'Linux x256', 'Linux x512', 'Linux quantum64', 'Linux neural128',
    'UltraLinux', 'HyperLinux', 'QuantumLinux', 'NeuralLinux',
    'QuantumOS', 'HoloWindows', 'CyberMac', 'NeoAndroid',
    'ARM256', 'ARM512', 'ARM1024', 'QuantumARM',
    'HyperX86', 'UltraX64', 'QuantumX128', 'NeuralX256',
    'MetaOS', 'HyperOS', 'FutureOS', 'NeuroOS'
  ];
  
  const spoofedCores = [
    // UNREALISTISCHE Werte - Gibt es nicht!
    3, 5, 7, 9, 11, 13, 15, 17, 20, 24, 28, 32, 
    48, 64, 96, 128, 256, 512, 1024, 2048, 4096,
    33, 37, 41, 47, 53, 67, 73, 97, 129, 257
  ];
  
  // ==== NAVIGATOR COMPLETE OVERRIDE ====
  const fakeNav = {
    userAgent: randomChoice(spoofedUserAgents),
    platform: randomChoice(spoofedPlatforms), 
    language: 'quantum-QU',
    languages: ['quantum-QU', 'neural-NE', 'en-US'],
    hardwareConcurrency: randomChoice(spoofedCores),
    deviceMemory: [3, 6, 12, 24, 48, 96, 128, 256, 512, 1024][randomInt(0, 9)],
    maxTouchPoints: [0, 1, 2, 5, 10, 16, 32, 64, 128, 256][randomInt(0, 9)],
    cookieEnabled: [true, false][randomInt(0, 1)],
    doNotTrack: ['1', '0', null, 'unspecified', 'quantum', 'neural'][randomInt(0, 5)],
    vendor: randomChoice(['Quantum Corp', 'HoloTech Inc', 'CyberSoft Ltd', 'QuantumTech Inc.', 'NeuralProcessing Ltd.']),
    vendorSub: '',
    product: 'Gecko',
    productSub: '20030107',
    appName: 'Netscape',
    appVersion: randomChoice(['5.0 (QuantumOS)', '5.0 (HoloWindows)', '5.0 (CyberMac)']),
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
      platform: randomChoice(spoofedPlatforms)
    }
  };
  
  // Aggressive Navigator Override using Object.defineProperty
  if (protectionSettings.navigator) {
    try {
      Object.defineProperty(window, 'navigator', {
        get: () => fakeNav,
        configurable: false
      });
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
      } catch(e2) {
        console.log('🛡️ Navigator override partially failed:', e2);
      }
    }
  }
  
  // ==== ULTRA-AGGRESSIVE SCREEN SPOOFING ====
  const spoofedResolutions = [
    // VÖLLIG UNREALISTISCHE Auflösungen - Gibt es nicht!
    { width: 3333, height: 2222 },
    { width: 7777, height: 4444 },
    { width: 9999, height: 5555 },
    { width: 12000, height: 8000 },
    { width: 16384, height: 9216 },
    { width: 32768, height: 18432 },
    { width: 999, height: 666 },
    { width: 1337, height: 1337 },
    { width: 11111, height: 7777 },
    { width: 25600, height: 14400 },
    { width: 50000, height: 30000 }
  ];
  
  const chosenRes = randomChoice(spoofedResolutions);
  const fakeColorDepth = [8, 16, 24, 32, 48, 64, 128][randomInt(0, 6)];
  
  if (protectionSettings.screen) {
    Object.defineProperties(window.screen, {
      width: { get: () => chosenRes.width, configurable: false },
      height: { get: () => chosenRes.height, configurable: false },
      availWidth: { get: () => chosenRes.width - randomInt(0, 100), configurable: false },
      availHeight: { get: () => chosenRes.height - randomInt(0, 100), configurable: false },
      colorDepth: { get: () => fakeColorDepth, configurable: false },
      pixelDepth: { get: () => fakeColorDepth, configurable: false }
    });
  }
  
  // ==== ULTRA-AGGRESSIVE WEBGL SPOOFING ====
  const vendors = [
    'QuantumTech Inc.', 'HyperGraphics Corp.', 'NeuralProcessing Ltd.',
    'CyberVision Systems', 'MetaGraphics Inc.', 'UltraRendering Co.',
    'FutureGPU Corp.', 'HolographicTech', 'QuantumGraphics LLC'
  ];
  
  const renderers = [
    'QuantumTech UltraGPU 9000X',
    'HyperGraphics Neural RTX 50000',
    'CyberVision HoloCard 8K Pro',
    'MetaGraphics Quantum RTX 99999',
    'Intel(R) Neural Graphics 2050',
    'AMD Radeon Quantum RX 50000X',
    'NVIDIA HyperForce RTX 90000 Ti',
    'Apple M25 Ultra Neural Pro',
    'FutureGPU QuantumCore 128GB'
  ];
  
  const fakeWebGLInfo = {
    vendor: randomChoice(vendors),
    renderer: randomChoice(renderers),
    version: randomChoice(['WebGL 5.0', 'WebGL 9.9', 'QuantumGL 10.0', 'HyperWebGL 25.0']),
    shadingLanguageVersion: randomChoice(['WebGL GLSL ES 5.00', 'QuantumGLSL ES 10.0', 'NeuralGLSL ES 99.0'])
  };
  
  if (protectionSettings.webgl) {
    // Override WebGL getParameter (both WebGL1 and WebGL2)
    if (window.WebGLRenderingContext) {
      const originalWebGLGetParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function(parameter) {
        switch(parameter) {
          case this.VENDOR: return fakeWebGLInfo.vendor;
          case this.RENDERER: return fakeWebGLInfo.renderer;
          case this.VERSION: return fakeWebGLInfo.version;
          case this.SHADING_LANGUAGE_VERSION: return fakeWebGLInfo.shadingLanguageVersion;
          case this.UNMASKED_VENDOR_WEBGL: return fakeWebGLInfo.vendor;
          case this.UNMASKED_RENDERER_WEBGL: return fakeWebGLInfo.renderer;
          case this.MAX_TEXTURE_SIZE: return 32768;
          case this.MAX_RENDERBUFFER_SIZE: return 32768;
        case this.MAX_VIEWPORT_DIMS: return new Int32Array([32768, 32768]);
        default: return originalWebGLGetParameter.call(this, parameter);
      }
    };
  }
  
  if (window.WebGL2RenderingContext) {
    const originalWebGL2GetParameter = WebGL2RenderingContext.prototype.getParameter;
    WebGL2RenderingContext.prototype.getParameter = function(parameter) {
      switch(parameter) {
        case this.VENDOR: return fakeWebGLInfo.vendor;
        case this.RENDERER: return fakeWebGLInfo.renderer;
        case this.VERSION: return fakeWebGLInfo.version;
        case this.SHADING_LANGUAGE_VERSION: return fakeWebGLInfo.shadingLanguageVersion;
        case this.UNMASKED_VENDOR_WEBGL: return fakeWebGLInfo.vendor;
        case this.UNMASKED_RENDERER_WEBGL: return fakeWebGLInfo.renderer;
        default: return originalWebGL2GetParameter.call(this, parameter);
      }
    };
  }
  }
  
  // ==== ULTRA-AGGRESSIVE CANVAS PROTECTION ====
  if (protectionSettings.canvas) {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
      const context = originalGetContext.call(this, contextType, contextAttributes);
      
      if (contextType === '2d' && context) {
      // Override getImageData with massive noise injection
      const originalGetImageData = context.getImageData;
      context.getImageData = function(sx, sy, sw, sh) {
        const imageData = originalGetImageData.call(this, sx, sy, sw, sh);
        // Add 50% aggressive noise
        for (let i = 0; i < imageData.data.length; i += 4) {
          if (deterministicRandom() < 0.5) {
            imageData.data[i] = randomInt(0, 255);     // R
            imageData.data[i + 1] = randomInt(0, 255); // G
            imageData.data[i + 2] = randomInt(0, 255); // B
          }
        }
        return imageData;
      };
      
      // Override fillText to add random variations
      const originalFillText = context.fillText;
      context.fillText = function(text, x, y, maxWidth) {
        const offsetX = (deterministicRandom() - 0.5) * 2;
        const offsetY = (deterministicRandom() - 0.5) * 2;
        return originalFillText.call(this, text, x + offsetX, y + offsetY, maxWidth);
      };
      
      // Override strokeText similarly
      const originalStrokeText = context.strokeText;
      context.strokeText = function(text, x, y, maxWidth) {
        const offsetX = (deterministicRandom() - 0.5) * 2;
        const offsetY = (deterministicRandom() - 0.5) * 2;
        return originalStrokeText.call(this, text, x + offsetX, y + offsetY, maxWidth);
      };
    }
    
    // WebGL context spoofing
    if ((contextType === 'webgl' || contextType === 'experimental-webgl' || contextType === 'webgl2') && context) {
      const originalReadPixels = context.readPixels;
      context.readPixels = function(x, y, width, height, format, type, pixels) {
        originalReadPixels.call(this, x, y, width, height, format, type, pixels);
        // Add noise to WebGL fingerprint
        if (pixels && pixels.length) {
          for (let i = 0; i < pixels.length; i++) {
            if (deterministicRandom() > 0.7) {
              pixels[i] = Math.floor(deterministicRandom() * 256);
            }
          }
        }
      };
    }
    
    return context;
  };
  
  // Override toDataURL with extreme noise
  const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function(type, encoderOptions) {
    const ctx = this.getContext('2d');
    if (ctx) {
      // Add random pixels before conversion
      const imageData = ctx.getImageData(0, 0, this.width, this.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (deterministicRandom() < 0.3) {
          imageData.data[i] = (imageData.data[i] + randomInt(-10, 10)) % 256;
          imageData.data[i + 1] = (imageData.data[i + 1] + randomInt(-10, 10)) % 256;
          imageData.data[i + 2] = (imageData.data[i + 2] + randomInt(-10, 10)) % 256;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }
  return originalToDataURL.call(this, type, encoderOptions);
  };
  }
  
  // ==== TIMEZONE COMPLETE SPOOFING ====
  const fakeTimezones = [
    'Pacific/Kiritimati', 'America/New_York', 'Europe/London', 
    'Asia/Tokyo', 'Australia/Sydney', 'Africa/Cairo',
    'Europe/Moscow', 'America/Los_Angeles', 'Asia/Shanghai'
  ];
  
  const chosenTimezone = randomChoice(fakeTimezones);
  
  // Override Date timezone offset
  Date.prototype.getTimezoneOffset = function() {
    return randomInt(-720, 720); // Random timezone offset
  };
  
  // Override Intl.DateTimeFormat
  const originalDateTimeFormat = Intl.DateTimeFormat;
  Intl.DateTimeFormat = function(...args) {
    const result = new originalDateTimeFormat(...args);
    const originalResolvedOptions = result.resolvedOptions;
    result.resolvedOptions = function() {
      const options = originalResolvedOptions.call(this);
      options.timeZone = chosenTimezone;
      return options;
    };
    return result;
  };
  
  // ==== FONT DETECTION SPOOFING ====
  const originalElementOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
  const originalElementOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
  
  if (originalElementOffsetWidth && originalElementOffsetHeight) {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      get: function() {
        const original = originalElementOffsetWidth.get.call(this);
        // Add slight random variation to font measurements
        if (this.style && this.style.fontFamily) {
          return original + Math.floor((deterministicRandom() - 0.5) * 4);
        }
        return original;
      }
    });
    
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      get: function() {
        const original = originalElementOffsetHeight.get.call(this);
        if (this.style && this.style.fontFamily) {
          return original + Math.floor((deterministicRandom() - 0.5) * 2);
        }
        return original;
      }
    });
  }
  
  // ==== AUDIO FINGERPRINT SPOOFING ====
  if (protectionSettings.audio && (window.AudioContext || window.webkitAudioContext)) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    
    // Override createOscillator
    const originalCreateOscillator = AudioCtx.prototype.createOscillator;
    AudioCtx.prototype.createOscillator = function() {
      const oscillator = originalCreateOscillator.call(this);
      const originalConnect = oscillator.connect;
      oscillator.connect = function(destination) {
        // Add slight frequency variation to scramble audio fingerprint
        if (this.frequency) {
          this.frequency.value = this.frequency.value + (deterministicRandom() - 0.5) * 0.001;
        }
        return originalConnect.call(this, destination);
      };
      return oscillator;
    };
    
    // Override createAnalyser
    const originalCreateAnalyser = AudioCtx.prototype.createAnalyser;
    AudioCtx.prototype.createAnalyser = function() {
      const analyser = originalCreateAnalyser.call(this);
      const originalGetFloatFrequencyData = analyser.getFloatFrequencyData;
      
      analyser.getFloatFrequencyData = function(array) {
        originalGetFloatFrequencyData.call(this, array);
        // Add noise to audio fingerprinting
        for (let i = 0; i < array.length; i++) {
          array[i] += (deterministicRandom() - 0.5) * 0.1;
        }
      };
      
      return analyser;
    };
  }
  
  // ==== COMPLETE WEBRTC BLOCKING ====
  if (protectionSettings.webrtc) {
    if (window.RTCPeerConnection) {
      window.RTCPeerConnection = function() {
        throw new Error('WebRTC blocked by Fingerprintify');
      };
    }
    if (window.webkitRTCPeerConnection) {
      window.webkitRTCPeerConnection = function() {
        throw new Error('WebRTC blocked by Fingerprintify');
      };
    }
    if (window.mozRTCPeerConnection) {
      window.mozRTCPeerConnection = function() {
        throw new Error('WebRTC blocked by Fingerprintify');
      };
    }
  }
  
  // Block getUserMedia
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia = function() {
      return Promise.reject(new Error('Media access blocked by Fingerprintify'));
    };
  }
  
  // Override legacy getUserMedia
  if (navigator.getUserMedia) {
    navigator.getUserMedia = function(constraints, success, error) {
      if (error) error(new Error('Media access blocked by Fingerprintify'));
    };
  }
  
  // ==== PERFORMANCE TIMING SPOOFING ====
  if (window.performance && window.performance.now) {
    const originalNow = window.performance.now;
    window.performance.now = function() {
      return originalNow.call(this) + (deterministicRandom() - 0.5) * 0.1;
    };
  }
  
  // ==== SUPERCOOKIE BLOCKING ====
  try {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      if (key.includes('fingerprint') || key.includes('track')) {
        console.log('🛡️ Blocked tracking localStorage:', key);
        return;
      }
      return originalSetItem.call(this, key, value);
    };
  } catch(e) {
    // Ignore if localStorage is not available
  }
  
  console.log('🛡️ Fingerprintify: ULTIMATE+ULTRA protection active!');
  console.log('🛡️ Session:', window._fingerprintifySession);
  console.log('🛡️ UserAgent:', fakeNav.userAgent);
  console.log('🛡️ Platform:', fakeNav.platform);
  console.log('🛡️ Hardware Cores:', fakeNav.hardwareConcurrency);
  console.log('🛡️ Device Memory:', fakeNav.deviceMemory + 'GB');
  console.log('🛡️ Screen:', (protectionSettings.screen ? chosenRes.width + 'x' + chosenRes.height + 'x' + fakeColorDepth : 'DISABLED - original values'));
  console.log('🛡️ WebGL Vendor:', (protectionSettings.webgl ? fakeWebGLInfo.vendor : 'DISABLED - original values'));
  console.log('🛡️ WebGL Renderer:', (protectionSettings.webgl ? fakeWebGLInfo.renderer : 'DISABLED - original values'));
  console.log('🛡️ Timezone:', chosenTimezone);
  console.log('🛡️ Canvas Protection:', (protectionSettings.canvas ? 'ENABLED' : 'DISABLED'));
  console.log('🛡️ Audio Protection:', (protectionSettings.audio ? 'ENABLED' : 'DISABLED'));
  console.log('🛡️ WebRTC Blocking:', (protectionSettings.webrtc ? 'ENABLED' : 'DISABLED'));
  console.log('🛡️ Navigator Spoofing:', (protectionSettings.navigator ? 'ENABLED' : 'DISABLED'));
  console.log('🛡️ Final Protection Settings:', protectionSettings);
  
  // Function to load settings from Chrome storage (via content script message)
  function loadProtectionSettings() {
    // Settings will be injected by content script
    console.log('🛡️ Waiting for settings from content script...');
  }
  
  // Function to update settings dynamically 
  window.updateFingerprintifySettings = function(newSettings) {
    const oldSettings = { ...protectionSettings };
    Object.assign(protectionSettings, newSettings);
    window._fingerprintifySettings = protectionSettings;
    console.log('🛡️ Settings updated from:', oldSettings, 'to:', protectionSettings);
    
    // Note: Some protections require page reload to take effect
    console.log('🛡️ Note: Navigator, Screen, WebGL protections require page reload');
    
    // Store settings globally for detection
    window._fingerprintifySettingsActive = protectionSettings;
  };
  
  // SAFETY: Check for preloaded settings again after a delay
  setTimeout(() => {
    if (window._fingerprintifyPreloadedSettings) {
      const preloadedSettings = window._fingerprintifyPreloadedSettings;
      console.log('🛡️ Applying delayed preloaded settings:', preloadedSettings);
      window.updateFingerprintifySettings(preloadedSettings);
    } else {
      console.log('🛡️ No preloaded settings found - using safe defaults (all OFF)');
    }
  }, 200);
  
  // Load settings on initialization
  loadProtectionSettings();
  
})();
