// WebRTC Blocking Module
// Enhanced blocking to prevent IP leaks and additional fingerprinting

window.FingerprintifyModules = window.FingerprintifyModules || {};

window.FingerprintifyModules.webrtc = {
  name: 'WebRTC Blocking',
  description: 'Comprehensive WebRTC blocking to prevent IP leaks and fingerprinting',
  
  apply: function(protectionSettings) {
    if (!protectionSettings.webrtc) {
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.info('WebRTC', 'Protection disabled');
      }
      return;
    }
    
    if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
      window.FingerprintifyModules.logger.info('WebRTC', 'Applying comprehensive blocking...');
    }
    
    // Block all RTCPeerConnection constructors
    const blockWebRTCConstructor = function() {
      throw new Error('WebRTC blocked by Fingerprintify - IP protection active');
    };
    
    // Block main constructors
    if (window.RTCPeerConnection) {
      window.RTCPeerConnection = blockWebRTCConstructor;
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('WebRTC', 'RTCPeerConnection blocked');
      }
    }
    
    if (window.webkitRTCPeerConnection) {
      window.webkitRTCPeerConnection = blockWebRTCConstructor;
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('WebRTC', 'webkitRTCPeerConnection blocked');
      }
    }
    
    if (window.mozRTCPeerConnection) {
      window.mozRTCPeerConnection = blockWebRTCConstructor;
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('WebRTC', 'mozRTCPeerConnection blocked');
      }
    }
    
    // Block related constructors
    if (window.RTCIceCandidate) {
      window.RTCIceCandidate = blockWebRTCConstructor;
    }
    
    if (window.RTCSessionDescription) {
      window.RTCSessionDescription = blockWebRTCConstructor;
    }
    
    if (window.RTCDataChannel) {
      window.RTCDataChannel = blockWebRTCConstructor;
    }
    
    // Block getUserMedia comprehensively
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
