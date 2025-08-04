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
    
    const vendors = [
      'QuantumTech Inc.', 'HyperGraphics Corp.', 'NeuralProcessing Ltd.',
      'CyberVision Systems', 'MetaGraphics Inc.', 'UltraRendering Co.',
      'FutureGPU Corp.', 'HolographicTech', 'QuantumGraphics LLC'
    ];
    
    const renderers = [
      'QuantumTech UltraGPU 9000X',
      'HyperGraphics Neural RTX 50000',
      'CyberVision HoloCard 8K Pro',
      'MetaGraphics Quantum RTX 99999',
      'Intel(R) Neural Graphics 2050',
      'AMD Radeon Quantum RX 50000X',
      'NVIDIA HyperForce RTX 90000 Ti',
      'Apple M25 Ultra Neural Pro',
      'FutureGPU QuantumCore 128GB'
    ];
    
    const fakeWebGLInfo = {
      vendor: utils.randomChoice(vendors),
      renderer: utils.randomChoice(renderers),
      version: utils.randomChoice(['WebGL 5.0', 'WebGL 9.9', 'QuantumGL 10.0', 'HyperWebGL 25.0']),
      shadingLanguageVersion: utils.randomChoice(['WebGL GLSL ES 5.00', 'QuantumGLSL ES 10.0', 'NeuralGLSL ES 99.0'])
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
