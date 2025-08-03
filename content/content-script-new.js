// Enhanced Content Script for Fingerprintify with Settings Support
(function() {
  'use strict';
  
  console.log('🛡️ Fingerprintify: Enhanced content script loaded');
  
  // Extended protection status check with detailed reporting
  function checkProtectionStatus() {
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
    if (window._fingerprintifyActive) {
      status.active = true;
      status.session = window._fingerprintifySession;
      status.profile = window._fingerprintifyProfile;
      status.settings = window._fingerprintifySettings || {};
      console.log('✅ Fingerprintify: ULTIMATE protection is ACTIVE');
      console.log('🔒 Session ID:', status.session);
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
        const spoofedVendors = ['QuantumTech', 'HyperGraphics', 'CyberVision', 'MetaGraphics'];
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
  
  // Run initial check
  let protectionStatus = checkProtectionStatus();
  
  // Enhanced message handling with settings support
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    try {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        try {
          console.log('🛡️ Received message:', request.action);
          
          switch (request.action) {
            case 'getStatus':
              // Always return fresh status
              const freshStatus = checkProtectionStatus();
              sendResponse(freshStatus);
              console.log('📊 Status sent to popup:', freshStatus.active ? 'ACTIVE' : 'INACTIVE');
              break;
              
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
              const detailedStatus = checkProtectionStatus();
              sendResponse(detailedStatus);
              console.log('📋 Detailed status sent');
              break;
              
            case 'updateSettings':
              // Update settings in inject script
              if (request.settings && window.updateFingerprintifySettings) {
                window.updateFingerprintifySettings(request.settings);
                console.log('⚙️ Settings updated:', request.settings);
                sendResponse({ success: true });
              } else {
                console.warn('⚠️ Could not update settings - function not available');
                sendResponse({ success: false, error: 'Settings update function not available' });
              }
              break;
              
            default:
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
  setInterval(() => {
    const currentStatus = checkProtectionStatus();
    if (currentStatus.active !== protectionStatus?.active) {
      console.log('🔄 Protection status changed:', currentStatus.active ? 'ACTIVATED' : 'DEACTIVATED');
      protectionStatus = currentStatus;
    }
  }, 30000);
  
  // Export status for debugging
  window._fingerprintifyDebug = {
    getStatus: checkProtectionStatus,
    lastCheck: () => protectionStatus,
    version: '2.1.0'
  };
  
  console.log('🛡️ Enhanced Fingerprintify content script ready');
  console.log('🔧 Debug available via: window._fingerprintifyDebug.getStatus()');
  
})();
