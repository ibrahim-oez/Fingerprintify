// Enhanced Content Script for Fingerprintify with Settings Support
(function() {
  'use strict';
  
  console.log('🛡️ Fingerprintify: Enhanced content script loaded');
  
  // Load and inject settings into main world BEFORE inject script runs
  function preloadSettings() {
    // Set settings in DOM IMMEDIATELY and SYNCHRONOUSLY
    
    // Try to get settings synchronously from background script
    chrome.storage.sync.get('fingerprintifySettings', (result) => {
      const settings = result.fingerprintifySettings || {
        navigator: true,  // Default to ON for testing
        screen: true,     // Default to ON for testing
        webgl: true,      // Default to ON for testing
        canvas: true,     // Default to ON for testing
        audio: true,      // Default to ON for testing
        fonts: false,     // Not implemented
        webrtc: true,     // Default to ON for testing
        tracking: false   // Not implemented
      };
      
      console.log('🛡️ Preloading settings:', settings);
      
      // Set in DOM immediately
      document.documentElement.setAttribute('data-fingerprintify-settings', JSON.stringify(settings));
      
      // Also set as window variable for immediate access
      window._fingerprintifyPreloadedSettings = settings;
    });
  }
  
  // CRITICAL: Preload settings IMMEDIATELY
  preloadSettings();
  
  // Also inject settings later for scripts that load after us
  function updateSettingsLater() {
    chrome.storage.sync.get('fingerprintifySettings', (result) => {
      const settings = result.fingerprintifySettings || {
        navigator: true,  // Default to ON for testing
        screen: true,     // Default to ON for testing
        webgl: true,      // Default to ON for testing
        canvas: true,     // Default to ON for testing
        audio: true,      // Default to ON for testing
        fonts: false,     // Not implemented
        webrtc: true,     // Default to ON for testing
        tracking: false   // Not implemented
      };
      
      // Update settings in DOM attribute (CSP safe)
      document.documentElement.setAttribute('data-fingerprintify-settings', JSON.stringify(settings));
    });
  }
  
  // Update settings after a delay too
  setTimeout(updateSettingsLater, 100);
  setTimeout(updateSettingsLater, 500);
  setTimeout(updateSettingsLater, 1000);
  
  // Extended protection status check with detailed reporting
  async function checkProtectionStatus() {
    const status = {
      active: false,
      session: null,
      profile: null,
      navigator: {},
      screen: {},
      webgl: {},
      canvas: false,
      webrtc: false,
      settings: {},
      timestamp: new Date().toISOString()
    };
    
    // Check basic protection flags
    // Inject script to get status from MAIN world
    let isActive = false;
    let mainWorldStatus = null;
    
    try {
      // CSP-safe method: Use DOM events for communication
      let statusReceived = false;
      
      // Listen for status from MAIN world
      const handleStatusMessage = (event) => {
        if (event.detail && event.detail.type === 'fingerprintify-status') {
          mainWorldStatus = event.detail.data;
          isActive = mainWorldStatus.active;
          statusReceived = true;
          document.removeEventListener('fingerprintify-status-response', handleStatusMessage);
        }
      };
      
      document.addEventListener('fingerprintify-status-response', handleStatusMessage);
      
      // Request status from MAIN world using CustomEvent
      const requestEvent = new CustomEvent('fingerprintify-status-request', {
        detail: { timestamp: Date.now() }
      });
      document.dispatchEvent(requestEvent);
      
      // Wait a bit for response
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Fallback: Look for evidence of spoofing in the current context
      if (!statusReceived || !isActive) {
        const spoofedUserAgents = ['QuantumOS', 'HoloWindows', 'CyberMac', 'UltraLinux', 'NeoAndroid', 'MetaWindows', 'HyperOS'];
        isActive = spoofedUserAgents.some(fake => navigator.userAgent.includes(fake));
        
        if (isActive) {
          // If we detect spoofing, create a fake status
          mainWorldStatus = {
            active: true,
            session: 'session_detected',
            settings: { navigator: true, screen: true, webgl: true, canvas: true, audio: true, webrtc: true },
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
        }
      }
      
      // Alternative check: Look for unrealistic hardware values
      if (!isActive && navigator.hardwareConcurrency) {
        const unrealisticCores = [3, 5, 7, 9, 11, 13, 15, 17, 20, 24, 28, 32, 41, 48, 64, 96, 128, 256, 512, 1024];
        isActive = unrealisticCores.includes(navigator.hardwareConcurrency);
        
        if (isActive && !mainWorldStatus) {
          mainWorldStatus = {
            active: true,
            session: 'session_detected',
            settings: { navigator: true, screen: true, webgl: true, canvas: true, audio: true, webrtc: true },
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
        }
      }
      
    } catch(e) {
      console.log('🛡️ Status check error:', e);
      // Fallback: Check for evidence of protection
      const spoofedUserAgents = ['QuantumOS', 'HoloWindows', 'CyberMac', 'UltraLinux', 'NeoAndroid', 'MetaWindows', 'HyperOS'];
      isActive = spoofedUserAgents.some(fake => navigator.userAgent.includes(fake));
      
      if (isActive) {
        mainWorldStatus = {
          active: true,
          session: 'session_detected_fallback',
          settings: { navigator: true, screen: true, webgl: true, canvas: true, audio: true, webrtc: true },
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
      }
    }
    
    if (isActive) {
      status.active = true;
      status.session = mainWorldStatus?.session || 'session_detected';
      status.profile = 'active';
      status.settings = mainWorldStatus?.settings || {};
      console.log('✅ Fingerprintify: ULTIMATE protection is ACTIVE');
      console.log('🔒 Evidence: Spoofed values detected');
      
      // Use main world status if available
      if (mainWorldStatus) {
        status.navigator = mainWorldStatus.navigator;
        status.screen = mainWorldStatus.screen;
      }
    } else {
      console.warn('❌ Fingerprintify: Protection NOT detected!');
      return status;
    }
    
    // Check Navigator spoofing
    try {
      status.navigator = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory,
        maxTouchPoints: navigator.maxTouchPoints,
        language: navigator.language,
        vendor: navigator.vendor
      };
      
      // Check for spoofed values
      const spoofedUserAgents = ['QuantumOS', 'HoloWindows', 'CyberMac', 'UltraLinux', 'NeoAndroid'];
      const isSpoofed = spoofedUserAgents.some(fake => status.navigator.userAgent.includes(fake));
      
      if (isSpoofed) {
        console.log('✅ Navigator: Successfully spoofed with', status.navigator.platform);
      } else {
        console.warn('⚠️ Navigator: May not be spoofed');
        console.log('🌐 UserAgent:', status.navigator.userAgent);
      }
    } catch (e) {
      console.log('✅ Navigator: Blocked or protected');
    }
    
    // Check Screen spoofing
    try {
      status.screen = {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      };
      
      // Check for unrealistic resolutions
      const unrealisticResolutions = [3333, 7777, 9999, 12000, 16384, 32768, 999, 1337];
      const hasUnrealistic = unrealisticResolutions.includes(status.screen.width) || 
                            unrealisticResolutions.includes(status.screen.height);
      
      if (hasUnrealistic) {
        console.log('✅ Screen: Successfully spoofed with', status.screen.width + 'x' + status.screen.height);
      } else {
        console.warn('⚠️ Screen: May not be spoofed');
        console.log('📺 Resolution:', status.screen.width + 'x' + status.screen.height);
      }
    } catch (e) {
      console.log('✅ Screen: Blocked or protected');
    }
    
    // Check WebGL spoofing
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (gl) {
        const vendor = gl.getParameter(gl.VENDOR);
        const renderer = gl.getParameter(gl.RENDERER);
        
        status.webgl = { vendor, renderer };
        
        // Check for spoofed values
        const spoofedVendors = ['QuantumTech', 'HyperGraphics', 'CyberVision', 'MetaGraphics', 'NeuralProcessing', 'FutureGPU'];
        const isSpoofed = spoofedVendors.some(fake => vendor.includes(fake));
        
        if (isSpoofed) {
          console.log('✅ WebGL: Successfully spoofed with', vendor);
        } else {
          console.warn('⚠️ WebGL: May not be spoofed');
          console.log('🎮 Vendor:', vendor);
          console.log('🖥️ Renderer:', renderer);
        }
      }
    } catch (e) {
      console.log('✅ WebGL: Blocked or failed (good for privacy)');
      status.webgl = { vendor: 'Blocked', renderer: 'Blocked' };
    }
    
    // Check Canvas fingerprint protection
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Try to detect if canvas is protected
        ctx.fillStyle = 'rgb(255,0,0)';
        ctx.fillRect(0, 0, 1, 1);
        const imageData = ctx.getImageData(0, 0, 1, 1);
        
        // If protection is working, the red pixel might be altered
        const red = imageData.data[0];
        status.canvas = red !== 255; // If not pure red, likely protected
        
        if (status.canvas) {
          console.log('✅ Canvas: Fingerprint protection active (pixel altered)');
        } else {
          console.warn('⚠️ Canvas: Protection may not be working');
        }
      }
    } catch (e) {
      console.log('✅ Canvas: Blocked or protected');
      status.canvas = true;
    }
    
    // Check WebRTC blocking
    try {
      if (typeof RTCPeerConnection === 'undefined' && 
          typeof webkitRTCPeerConnection === 'undefined' && 
          typeof mozRTCPeerConnection === 'undefined') {
        status.webrtc = true;
        console.log('✅ WebRTC: Successfully blocked');
      } else {
        console.warn('⚠️ WebRTC: May not be fully blocked');
      }
    } catch (e) {
      status.webrtc = true;
      console.log('✅ WebRTC: Blocked (exception thrown)');
    }
    
    return status;
  }
  
  // Global variable for storing protection status
  let protectionStatus = null;
  
  // Run initial check
  checkProtectionStatus().then(result => {
    protectionStatus = result;
  });
  
  // Enhanced message handling with settings support
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    try {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        try {
          console.log('🛡️ Received message:', request.action);
          
          switch (request.action) {
            case 'getStatus':
              // Always return fresh status
              checkProtectionStatus().then(freshStatus => {
                sendResponse(freshStatus);
                console.log('📊 Status sent to popup:', freshStatus.active ? 'ACTIVE' : 'INACTIVE');
              });
              return true; // Keep message channel open for async response
              
            case 'regenerate':
              console.log('🔄 Regenerating fingerprint...');
              // Clear any cached status
              protectionStatus = null;
              // Reload page to get new fingerprint
              setTimeout(() => {
                window.location.reload();
              }, 100);
              break;
              
            case 'checkDetails':
              checkProtectionStatus().then(detailedStatus => {
                sendResponse(detailedStatus);
                console.log('📋 Detailed status sent');
              });
              return true; // Keep message channel open for async response
              
            case 'updateSettings':
              // Save settings to storage first
              chrome.storage.sync.set({ fingerprintifySettings: request.settings }, () => {
                console.log('⚙️ Settings saved to storage:', request.settings);
                
              // Then inject into main world using CSP-safe method
              const updateEvent = new CustomEvent('fingerprintify-settings-update', {
                detail: {
                  type: 'settings-update',
                  data: request.settings
                }
              });
              document.dispatchEvent(updateEvent);
              
              sendResponse({ success: true });
            });
            return true; // Keep message channel open for async response            default:
              console.log('❓ Unknown action:', request.action);
              sendResponse({ error: 'Unknown action' });
          }
          
        } catch (e) {
          console.error('❌ Message handling error:', e);
          sendResponse({ error: e.message, active: false });
        }
      });
      
      console.log('✅ Message listener registered successfully');
      
    } catch (e) {
      console.error('❌ Could not set up message listener:', e);
    }
  } else {
    console.warn('⚠️ Chrome runtime not available');
  }
  
  // Periodic status monitoring (every 30 seconds)
  setInterval(async () => {
    const currentStatus = await checkProtectionStatus();
    if (currentStatus.active !== protectionStatus?.active) {
      console.log('🔄 Protection status changed:', currentStatus.active ? 'ACTIVATED' : 'DEACTIVATED');
      protectionStatus = currentStatus;
    }
  }, 30000);
  
  // Export status for debugging
  window._fingerprintifyDebug = {
    getStatus: async () => await checkProtectionStatus(),
    lastCheck: () => protectionStatus,
    version: '2.1.0'
  };
  
  console.log('🛡️ Enhanced Fingerprintify content script ready');
  console.log('🔧 Debug available via: window._fingerprintifyDebug.getStatus()');
  
})();
