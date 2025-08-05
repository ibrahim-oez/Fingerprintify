// WebGL Spoofing Module
// Spoofs WebGL renderer and vendor information

window.FingerprintifyModules = window.FingerprintifyModules || {};

window.FingerprintifyModules.webgl = {
  name: 'WebGL Spoofing',
  description: 'Spoofs WebGL renderer and vendor information',
  
  apply: function(protectionSettings, utils) {
    if (!protectionSettings.webgl) {
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.info('WebGL', 'Protection disabled');
      }
      return;
    }
    
    if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
      window.FingerprintifyModules.logger.info('WebGL', 'Applying spoofing...');
    }
    
    // REALISTISCHE GPU-Vendors - Echte Hersteller
    const vendors = [
      'Intel Inc.',
      'NVIDIA Corporation', 
      'ATI Technologies Inc.',
      'AMD',
      'Apple Inc.',
      'Qualcomm',
      'Google Inc.'
    ];
    
    // REALISTISCHE GPU-Renderer - Echte Grafikkarten mit leichten Variationen
    const renderers = [
      // Intel iGPUs (sehr häufig)
      'Intel(R) UHD Graphics 620',
      'Intel(R) Iris(R) Xe Graphics',
      'Intel(R) HD Graphics 630',
      'Intel(R) UHD Graphics 730',
      'Intel(R) Iris(R) Plus Graphics 640',
      
      // NVIDIA GPUs (häufig)
      'NVIDIA GeForce GTX 1050',
      'NVIDIA GeForce RTX 3060',
      'NVIDIA GeForce GTX 1650',
      'NVIDIA GeForce RTX 4060',
      'NVIDIA GeForce GTX 1060',
      'NVIDIA GeForce RTX 3070',
      
      // AMD GPUs (weniger häufig aber realistisch)
      'AMD Radeon RX 580',
      'AMD Radeon RX 6600',
      'AMD Radeon RX 5500 XT',
      'AMD Radeon(TM) Graphics',
      
      // Apple GPUs (für macOS)
      'Apple M1',
      'Apple M2',
      'Apple GPU'
    ];
    
    const fakeWebGLInfo = {
      vendor: utils.randomChoice(vendors),
      renderer: utils.randomChoice(renderers),
      version: utils.randomChoice(['WebGL 1.0', 'WebGL 2.0']), // Nur echte WebGL-Versionen
      shadingLanguageVersion: utils.randomChoice(['WebGL GLSL ES 1.0', 'WebGL GLSL ES 3.0']) // Nur echte GLSL-Versionen
    };
    
    // Override WebGL1 getParameter
    if (window.WebGLRenderingContext) {
      const originalWebGLGetParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function(parameter) {
        switch(parameter) {
          case this.VENDOR: return fakeWebGLInfo.vendor;
          case this.RENDERER: return fakeWebGLInfo.renderer;
          case this.VERSION: return fakeWebGLInfo.version;
          case this.SHADING_LANGUAGE_VERSION: return fakeWebGLInfo.shadingLanguageVersion;
          case this.UNMASKED_VENDOR_WEBGL: return fakeWebGLInfo.vendor;
          case this.UNMASKED_RENDERER_WEBGL: return fakeWebGLInfo.renderer;
          case this.MAX_TEXTURE_SIZE: return 32768;
          case this.MAX_RENDERBUFFER_SIZE: return 32768;
          case this.MAX_VIEWPORT_DIMS: return new Int32Array([32768, 32768]);
          default: return originalWebGLGetParameter.call(this, parameter);
        }
      };
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('WebGL', 'WebGL1 getParameter overridden');
      }
    }
    
    // Override WebGL2 getParameter
    if (window.WebGL2RenderingContext) {
      const originalWebGL2GetParameter = WebGL2RenderingContext.prototype.getParameter;
      WebGL2RenderingContext.prototype.getParameter = function(parameter) {
        switch(parameter) {
          case this.VENDOR: return fakeWebGLInfo.vendor;
          case this.RENDERER: return fakeWebGLInfo.renderer;
          case this.VERSION: return fakeWebGLInfo.version;
          case this.SHADING_LANGUAGE_VERSION: return fakeWebGLInfo.shadingLanguageVersion;
          case this.UNMASKED_VENDOR_WEBGL: return fakeWebGLInfo.vendor;
          case this.UNMASKED_RENDERER_WEBGL: return fakeWebGLInfo.renderer;
          default: return originalWebGL2GetParameter.call(this, parameter);
        }
      };
      if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
        window.FingerprintifyModules.logger.success('WebGL', 'WebGL2 getParameter overridden');
      }
    }
    
    if (window.FingerprintifyModules && window.FingerprintifyModules.logger) {
      window.FingerprintifyModules.logger.debug('WebGL', 'Vendor: ' + fakeWebGLInfo.vendor);
      window.FingerprintifyModules.logger.debug('WebGL', 'Renderer: ' + fakeWebGLInfo.renderer);
      window.FingerprintifyModules.logger.debug('WebGL', 'Version: ' + fakeWebGLInfo.version);
    }
    
    return fakeWebGLInfo;
  }
};
