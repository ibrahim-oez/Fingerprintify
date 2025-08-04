// Logger Module for Fingerprintify
// Controls console output based on debug level

window.FingerprintifyModules = window.FingerprintifyModules || {};

window.FingerprintifyModules.logger = {
  name: 'Logger',
  description: 'Manages console output for production and development',
  
  // Log levels: 0=NONE, 1=ERROR, 2=WARN, 3=INFO, 4=DEBUG
  currentLevel: 0, // PRODUCTION: Set to 0, DEVELOPMENT: Set to 4
  
  levels: {
    NONE: 0,
    ERROR: 1,
    WARN: 2, 
    INFO: 3,
    DEBUG: 4
  },
  
  init: function() {
    // Auto-detect if development mode
    // You can manually set this to 0 for production builds
    const isDevelopment = false; // SET TO FALSE FOR PRODUCTION!
    this.currentLevel = isDevelopment ? this.levels.DEBUG : this.levels.NONE;
    
    if (this.currentLevel > 0) {
      console.log('🛡️ Fingerprintify Logger: Level', this.currentLevel);
    }
  },
  
  error: function(module, message, ...args) {
    if (this.currentLevel >= this.levels.ERROR) {
      console.error(`❌ ${module}: ${message}`, ...args);
    }
  },
  
  warn: function(module, message, ...args) {
    if (this.currentLevel >= this.levels.WARN) {
      console.warn(`⚠️ ${module}: ${message}`, ...args);
    }
  },
  
  info: function(module, message, ...args) {
    if (this.currentLevel >= this.levels.INFO) {
      console.log(`🛡️ ${module}: ${message}`, ...args);
    }
  },
  
  debug: function(module, message, ...args) {
    if (this.currentLevel >= this.levels.DEBUG) {
      console.log(`🔧 ${module}: ${message}`, ...args);
    }
  },
  
  success: function(module, message, ...args) {
    if (this.currentLevel >= this.levels.INFO) {
      console.log(`✅ ${module}: ${message}`, ...args);
    }
  }
};
