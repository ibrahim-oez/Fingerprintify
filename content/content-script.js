// Content script for Fingerprintify
(function() {
  'use strict';
  
  console.log('🛡️ Fingerprintify: Content script loaded');
  
  // Check if protection is active
  if (window._fingerprintifyActive) {
    console.log('🛡️ Fingerprintify: ULTIMATE protection is active - Session:', window._fingerprintifySession);
  } else {
    console.warn('🛡️ Fingerprintify: Protection not detected!');
  }
  
  // Listen for messages from popup/options (with error handling)
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    try {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        try {
          if (request.action === 'getStatus') {
            sendResponse({
              active: !!window._fingerprintifyActive,
              session: window._fingerprintifySession,
              profile: window._fingerprintifyProfile
            });
          }
          
          if (request.action === 'regenerate') {
            // Reload page to get new fingerprint
            window.location.reload();
          }
        } catch (e) {
          console.warn('🛡️ Message handling error:', e);
        }
      });
    } catch (e) {
      console.warn('🛡️ Could not set up message listener:', e);
    }
  }
  
})();
