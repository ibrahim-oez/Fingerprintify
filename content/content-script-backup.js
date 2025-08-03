// Enhanced Content Script for Fingerprintify
(function() {
  'use strict';
  
  console.log('🛡️ Fingerprintify: Enhanced content script loaded');
  
  // Extended protect          case 'checkDetails':
            const detailedStatus = checkProtectionStatus();
            sendResponse(detailedStatus);
            console.log('📋 Detailed status sent');
            break;
            
          case 'updateSettings':
            // Update settings in inject script
            if (message.settings && window.updateFingerprintifySettings) {
              window.updateFingerprintifySettings(message.settings);
              console.log('⚙️ Settings updated:', message.settings);
              sendResponse({ success: true });
            } else {
              console.warn('⚠️ Could not update settings - function not available');
              sendResponse({ success: false, error: 'Settings update function not available' });
            }
            break;
          
        } catch (e) {
          console.error('❌ Message handling error:', e);
          sendResponse({ error: e.message, active: false });
        } check with detailed reporting
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
      timestamp: new Date().toISOString()
    };
    
    // Check basic protection flags
    if (window._fingerprintifyActive) {
      status.active = true;
      status.session = window._fingerprintifySession;
      status.profile = window._fingerprintifyProfile;
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
        console.log('🔧 Hardware Cores:', status.navigator.hardwareConcurrency);
        console.log('💾 Device Memory:', status.navigator.deviceMemory + 'GB');
      } else {
        console.warn('⚠️ Navigator: May not be fully spoofed');
      }
    } catch (e) {
      console.error('❌ Navigator check failed:', e);
    }
    
    // Check Screen spoofing
    try {
      status.screen = {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      };
      
      // Check for unrealistic resolutions
      const unrealisticResolutions = [3333, 7777, 9999, 11111, 12000, 16384, 32768, 50000];
      const hasUnrealisticRes = unrealisticResolutions.includes(status.screen.width) || 
                               unrealisticResolutions.includes(status.screen.height);
      
      if (hasUnrealisticRes) {
        console.log('✅ Screen: Successfully spoofed to', status.screen.width + 'x' + status.screen.height);
        console.log('🎨 Color Depth:', status.screen.colorDepth + ' bits');
      } else {
        console.warn('⚠️ Screen: May not be spoofed (normal resolution detected)');
      }
    } catch (e) {
      console.error('❌ Screen check failed:', e);
    }
    
    // Check WebGL spoofing
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const vendor = gl.getParameter(gl.VENDOR);
        const renderer = gl.getParameter(gl.RENDERER);
        status.webgl = { vendor, renderer };
        
        const spoofedVendors = ['Quantum', 'Holo', 'Cyber', 'Meta', 'Ultra', 'Neural'];
        const isWebGLSpoofed = spoofedVendors.some(fake => vendor.includes(fake) || renderer.includes(fake));
        
        if (isWebGLSpoofed) {
          console.log('✅ WebGL: Successfully spoofed');
          console.log('🎮 Vendor:', vendor);
          console.log('🖥️ Renderer:', renderer);
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
  
  // Enhanced message handling with better error reporting
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    try {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        try {
          console.log('🛡️ Received message:', request.action);
          
          if (request.action === 'getStatus') {
            // Always return fresh status
            const freshStatus = checkProtectionStatus();
            sendResponse(freshStatus);
            console.log('📊 Status sent to popup:', freshStatus.active ? 'ACTIVE' : 'INACTIVE');
          }
          
          if (request.action === 'regenerate') {
            console.log('🔄 Regenerating fingerprint...');
            // Clear any cached status
            protectionStatus = null;
            // Reload page to get new fingerprint
            setTimeout(() => {
              window.location.reload();
            }, 100);
          }
          
          if (request.action === 'checkDetails') {
            const detailedStatus = checkProtectionStatus();
            sendResponse(detailedStatus);
            console.log('📋 Detailed status sent');
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
    version: '2.0.0'
  };
  
  console.log('🛡️ Enhanced Fingerprintify content script ready');
  console.log('🔧 Debug available via: window._fingerprintifyDebug.getStatus()');
  
})();
