// Fingerprintify Main Module
// Loads and coordinates all protection modules

(function() {
  'use strict';
  
  // Initialize logger first
  if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
    window.FingerprintifyModules.logger.init();
    window.FingerprintifyModules.logger.info('Fingerprintify', 'Modular protection system starting...');
  }
  
  // Set global flags
  window._fingerprintifyActive = true;
  window._fingerprintifySession = 'session_' + Date.now();
  window._fingerprintifyProfile = Math.floor(Math.random() * 10) + 1;
  
  // Initialize protection system
  async function initializeProtection() {
    try {
      // Wait for all modules to be loaded
      if (!window.FingerprintifyModules) {
        console.log('⚠️ Fingerprintify: Modules not loaded yet, retrying...');
        setTimeout(initializeProtection, 100);
        return;
      }
      
      const modules = window.FingerprintifyModules;
      
      // Initialize utilities first
      if (modules.utils) {
        modules.utils.init();
      } else {
        console.error('❌ Fingerprintify: Utils module not found!');
        return;
      }
      
      // Load settings
      let protectionSettings;
      if (modules.settings) {
        protectionSettings = await modules.settings.loadSettings();
      } else {
        if (modules.logger) {
          modules.logger.error('Fingerprintify', 'Settings module not found!');
        }
        return;
      }
      
      window._fingerprintifySettings = protectionSettings;
      
      if (modules.logger) {
        modules.logger.info('Fingerprintify', 'Applying protection modules...');
      }
      
      // Apply protection modules in order
      const results = {};
      
      // 1. Navigator spoofing (affects other modules)
      if (modules.navigator) {
        results.navigator = modules.navigator.apply(protectionSettings, modules.utils);
      }
      
      // 2. Screen spoofing
      if (modules.screen) {
        results.screen = modules.screen.apply(protectionSettings, modules.utils);
      }
      
      // 3. WebGL spoofing
      if (modules.webgl) {
        results.webgl = modules.webgl.apply(protectionSettings, modules.utils);
      }
      
      // 4. Canvas protection
      if (modules.canvas) {
        modules.canvas.apply(protectionSettings, modules.utils);
      }
      
      // 5. Audio spoofing
      if (modules.audio) {
        modules.audio.apply(protectionSettings, modules.utils);
      }
      
      // 6. WebRTC blocking (important for security)
      if (modules.webrtc) {
        modules.webrtc.apply(protectionSettings);
      }
      
      if (modules.logger) {
        modules.logger.success('Fingerprintify', 'All modules applied successfully!');
        modules.logger.debug('Fingerprintify', 'Session: ' + window._fingerprintifySession);
        modules.logger.debug('Fingerprintify', 'Settings: ' + JSON.stringify(protectionSettings));
      }
      
      // Log protection status
      if (results.navigator && modules.logger) {
        modules.logger.debug('Fingerprintify', 'UserAgent: ' + results.navigator.userAgent);
        modules.logger.debug('Fingerprintify', 'Platform: ' + results.navigator.platform);
        modules.logger.debug('Fingerprintify', 'Hardware Cores: ' + results.navigator.hardwareConcurrency);
        modules.logger.debug('Fingerprintify', 'Device Memory: ' + results.navigator.deviceMemory + 'GB');
      }
      
      if (results.screen && modules.logger) {
        modules.logger.debug('Fingerprintify', 'Screen: ' + (protectionSettings.screen ? 
          results.screen.resolution.width + 'x' + results.screen.resolution.height + 'x' + results.screen.colorDepth : 
          'DISABLED - original values'));
      }
      
      if (results.webgl && modules.logger) {
        modules.logger.debug('Fingerprintify', 'WebGL Vendor: ' + (protectionSettings.webgl ? results.webgl.vendor : 'DISABLED - original values'));
        modules.logger.debug('Fingerprintify', 'WebGL Renderer: ' + (protectionSettings.webgl ? results.webgl.renderer : 'DISABLED - original values'));
      }
      
      if (modules.logger) {
        modules.logger.info('Fingerprintify', 'Canvas Protection: ' + (protectionSettings.canvas ? 'ENABLED' : 'DISABLED'));
        modules.logger.info('Fingerprintify', 'Audio Protection: ' + (protectionSettings.audio ? 'ENABLED' : 'DISABLED'));
        modules.logger.info('Fingerprintify', 'WebRTC Blocking: ' + (protectionSettings.webrtc ? 'ENABLED' : 'DISABLED'));
        modules.logger.info('Fingerprintify', 'Navigator Spoofing: ' + (protectionSettings.navigator ? 'ENABLED' : 'DISABLED'));
      }
      
      // Function to update settings dynamically 
      window.updateFingerprintifySettings = function(newSettings) {
        const oldSettings = modules.settings.getSettings();
        const updatedSettings = modules.settings.updateSettings(newSettings);
        
        if (modules.logger) {
          modules.logger.debug('Fingerprintify', 'Settings updated from: ' + JSON.stringify(oldSettings) + ' to: ' + JSON.stringify(updatedSettings));
          modules.logger.info('Fingerprintify', 'Note: Some protections require page reload to take effect');
        }
        
        // Store settings globally for detection
        window._fingerprintifySettingsActive = updatedSettings;
      };
      
      // CSP-safe communication: Listen for status requests from content script
      document.addEventListener('fingerprintify-status-request', function(event) {
        const statusData = {
          active: window._fingerprintifyActive || false,
          session: window._fingerprintifySession || null,
          settings: window._fingerprintifySettings || null,
          navigator: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: navigator.deviceMemory,
            maxTouchPoints: navigator.maxTouchPoints,
            language: navigator.language,
            vendor: navigator.vendor
          },
          screen: {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth
          }
        };
        
        // Send response via CustomEvent
        const responseEvent = new CustomEvent('fingerprintify-status-response', {
          detail: {
            type: 'fingerprintify-status',
            data: statusData
          }
        });
        document.dispatchEvent(responseEvent);
        
        if (modules.logger) {
          modules.logger.debug('Fingerprintify', 'Status sent to content script: ' + (statusData.active ? 'ACTIVE' : 'INACTIVE'));
        }
      });
      
      // Listen for settings updates from content script
      document.addEventListener('fingerprintify-settings-update', function(event) {
        if (event.detail && event.detail.type === 'settings-update') {
          const newSettings = event.detail.data;
          if (window.updateFingerprintifySettings) {
            window.updateFingerprintifySettings(newSettings);
            if (modules.logger) {
              modules.logger.debug('Fingerprintify', 'Settings updated in main world via event: ' + JSON.stringify(newSettings));
            }
          }
        }
      });
      
    } catch (error) {
      console.error('❌ Fingerprintify: Initialization failed:', error);
    }
  }
  
  // Start initialization
  initializeProtection();
  
})();
