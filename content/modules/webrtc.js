// WebRTC Blocking Module
// Prevents IP leaks through WebRTC connections

window.FingerprintifyModules = window.FingerprintifyModules || {};

window.FingerprintifyModules.webrtc = {
  name: 'WebRTC Blocking',
  description: 'Blocks WebRTC to prevent IP leaks',
  
  apply: function(protectionSettings) {
    if (!protectionSettings.webrtc) {
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.info('WebRTC', 'Protection disabled');
      }
      return;
    }
    
    if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
      window.FingerprintifyModules.logger.info('WebRTC', 'Applying complete blocking...');
    }
    
    // Block RTCPeerConnection constructors
    if (window.RTCPeerConnection) {
      window.RTCPeerConnection = function() {
        throw new Error('WebRTC blocked by Fingerprintify');
      };
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('WebRTC', 'RTCPeerConnection blocked');
      }
    }
    
    if (window.webkitRTCPeerConnection) {
      window.webkitRTCPeerConnection = function() {
        throw new Error('WebRTC blocked by Fingerprintify');
      };
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('WebRTC', 'webkitRTCPeerConnection blocked');
      }
    }
    
    if (window.mozRTCPeerConnection) {
      window.mozRTCPeerConnection = function() {
        throw new Error('WebRTC blocked by Fingerprintify');
      };
      console.log('🛡️ WebRTC: mozRTCPeerConnection blocked');
    }
    
    // Block getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia = function() {
        return Promise.reject(new Error('Media access blocked by Fingerprintify'));
      };
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('WebRTC', 'getUserMedia blocked');
      }
    }
    
    // Override legacy getUserMedia
    if (navigator.getUserMedia) {
      navigator.getUserMedia = function(constraints, success, error) {
        if (error) error(new Error('Media access blocked by Fingerprintify'));
      };
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('WebRTC', 'Legacy getUserMedia blocked');
      }
    }
    
    if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
      window.FingerprintifyModules.logger.success('WebRTC', 'Complete blocking applied');
    }
  }
};
