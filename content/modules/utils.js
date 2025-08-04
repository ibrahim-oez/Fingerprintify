// Utility Functions Module
// Provides common functions for all modules

window.FingerprintifyModules = window.FingerprintifyModules || {};

window.FingerprintifyModules.utils = {
  name: 'Utility Functions',
  description: 'Common helper functions for all modules',
  
  // Session-consistent random values
  sessionSeed: Date.now() + Math.random(),
  seedCounter: 0,
  
  deterministicRandom: function() {
    this.seedCounter++;
    const x = Math.sin(this.sessionSeed + this.seedCounter) * 10000;
    return x - Math.floor(x);
  },
  
  randomInt: function(min, max) {
    return Math.floor(this.deterministicRandom() * (max - min + 1)) + min;
  },
  
  randomChoice: function(array) {
    return array[Math.floor(this.deterministicRandom() * array.length)];
  },
  
  // Initialize session-specific values
  init: function() {
    this.sessionSeed = Date.now() + Math.random();
    this.seedCounter = 0;
    if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
      window.FingerprintifyModules.logger.debug('Utils', 'Initialized with session seed: ' + this.sessionSeed);
    }
  }
};
