// Settings Manager Module
// Handles loading and managing protection settings

window.FingerprintifyModules = window.FingerprintifyModules || {};

window.FingerprintifyModules.settings = {
  name: 'Settings Manager',
  description: 'Handles loading and managing protection settings',
  
  defaultSettings: {
    navigator: true,   // Default ON for testing
    screen: true,      // Default ON for testing
    webgl: true,       // Default ON for testing
    canvas: true,      // Default ON for testing
    audio: true,       // Default ON for testing
    fonts: false,      // Not implemented yet
    webrtc: true,      // Default ON for testing
    tracking: false    // Not implemented yet
  },
  
  currentSettings: null,
  
  loadSettings: function() {
    return new Promise((resolve) => {
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.debug('Settings', 'Loading protection settings...');
      }
      
      let settingsLoaded = false;
      let protectionSettings = { ...this.defaultSettings };
      
      // Try to load from window variable first
      if (window._fingerprintifyPreloadedSettings) {
        protectionSettings = { ...protectionSettings, ...window._fingerprintifyPreloadedSettings };
        settingsLoaded = true;
        if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
          window.FingerprintifyModules.logger.debug('Settings', 'Using preloaded settings: ' + JSON.stringify(protectionSettings));
        }
        this.currentSettings = protectionSettings;
        resolve(protectionSettings);
        return;
      }
      
      // Try to load from DOM attribute (CSP safe)
      const checkForSettings = () => {
        const settingsAttr = document.documentElement.getAttribute('data-fingerprintify-settings');
        if (settingsAttr) {
          try {
            const parsedSettings = JSON.parse(settingsAttr);
            // Only use if settings are not all false (real settings vs defaults)
            const hasRealSettings = Object.values(parsedSettings).some(value => value === true);
            if (hasRealSettings || !settingsLoaded) {
              protectionSettings = { ...protectionSettings, ...parsedSettings };
              settingsLoaded = true;
              if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
                window.FingerprintifyModules.logger.debug('Settings', 'Loaded from DOM: ' + JSON.stringify(protectionSettings));
              }
              this.currentSettings = protectionSettings;
              resolve(protectionSettings);
              return true;
            }
          } catch (e) {
            if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
              window.FingerprintifyModules.logger.warn('Settings', 'Failed to parse DOM settings, using defaults');
            }
          }
        }
        return false;
      };
      
      // Try immediately
      if (!checkForSettings()) {
        // If not found, observe for changes with timeout
        const observer = new MutationObserver(() => {
          if (checkForSettings()) {
            observer.disconnect();
            if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
              window.FingerprintifyModules.logger.debug('Settings', 'Loaded via observer');
            }
          }
        });
        
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['data-fingerprintify-settings']
        });
        
        // Timeout for settings loading
        setTimeout(() => {
          observer.disconnect();
          if (!settingsLoaded) {
            if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
              window.FingerprintifyModules.logger.info('Settings', 'No real settings found after timeout, using defaults (all OFF)');
            }
            this.currentSettings = protectionSettings;
            resolve(protectionSettings);
          }
        }, 2000);
      }
    });
  },
  
  updateSettings: function(newSettings) {
    this.currentSettings = { ...this.currentSettings, ...newSettings };
    window._fingerprintifySettings = this.currentSettings;
    if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
      window.FingerprintifyModules.logger.debug('Settings', 'Updated to: ' + JSON.stringify(this.currentSettings));
    }
    return this.currentSettings;
  },
  
  getSettings: function() {
    return this.currentSettings || this.defaultSettings;
  }
};
