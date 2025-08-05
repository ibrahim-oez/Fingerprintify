// Speech Synthesis Spoofing Module
// Prevents voice fingerprinting through speech synthesis

window.FingerprintifyModules = window.FingerprintifyModules || {};

window.FingerprintifyModules.speech = {
  name: 'Speech Synthesis Spoofing',
  description: 'Spoofs speech synthesis voices to prevent fingerprinting',
  
  apply: function(protectionSettings, utils) {
    if (!protectionSettings.speech) {
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.info('Speech', 'Protection disabled');
      }
      return;
    }
    
    if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
      window.FingerprintifyModules.logger.info('Speech', 'Applying spoofing...');
    }
    
    if (!utils) {
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.error('Speech', 'Utils module required');
      }
      return;
    }
    
    // REALISTISCHE Voice-Listen - Echte TTS-Stimmen basierend auf echten Systemen
    const fakeVoices = [
      // Windows Standard-Stimmen
      {
        name: 'Microsoft David Desktop - English (United States)',
        lang: 'en-US',
        gender: 'male',
        localService: true,
        default: true
      },
      {
        name: 'Microsoft Zira Desktop - English (United States)',
        lang: 'en-US',
        gender: 'female',
        localService: true,
        default: false
      },
      {
        name: 'Microsoft Mark - English (United States)',
        lang: 'en-US',
        gender: 'male', 
        localService: true,
        default: false
      },
      
      // Internationale realistische Stimmen
      {
        name: 'Microsoft Hedda Desktop - German (Germany)',
        lang: 'de-DE',
        gender: 'female',
        localService: true,
        default: false
      },
      {
        name: 'Microsoft Stefan Desktop - German (Germany)',
        lang: 'de-DE',
        gender: 'male',
        localService: true,
        default: false
      },
      
      // macOS-ähnliche Stimmen
      {
        name: 'Alex',
        lang: 'en-US',
        gender: 'male',
        localService: true,
        default: false
      },
      {
        name: 'Samantha',
        lang: 'en-US',
        gender: 'female',
        localService: true,
        default: false
      }
    ];
    
    // Spoof speechSynthesis.getVoices()
    if (window.speechSynthesis && speechSynthesis.getVoices) {
      const originalGetVoices = speechSynthesis.getVoices;
      
      speechSynthesis.getVoices = function() {
        return fakeVoices.slice(0, utils.randomInt(3, 6)); // Return 3-6 realistic voices (normal range)
      };
      
      // Also spoof voice change events
      speechSynthesis.onvoiceschanged = function() {
        // Trigger fake event
        if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
          window.FingerprintifyModules.logger.debug('Speech', 'Fake voices changed event fired');
        }
      };
      
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('Speech', 'Speech synthesis voices spoofed');
      }
    }
    
    // Block speech recognition
    if (window.SpeechRecognition) {
      window.SpeechRecognition = function() {
        throw new Error('Speech recognition blocked by Fingerprintify');
      };
    }
    
    if (window.webkitSpeechRecognition) {
      window.webkitSpeechRecognition = function() {
        throw new Error('Speech recognition blocked by Fingerprintify');
      };
      
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('Speech', 'Speech recognition blocked');
      }
    }
  }
};
