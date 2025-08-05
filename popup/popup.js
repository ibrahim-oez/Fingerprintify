// Enhanced Popup Script for Fingerprintify Extension
document.addEventListener('DOMContentLoaded', function() {
  console.log('🛡️ Fingerprintify: Enhanced popup loaded');
  
  // UI elements
  const statusElement = document.getElementById('status');
  const regenerateBtn = document.getElementById('regenerateBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const exportBtn = document.getElementById('exportBtn');
  const resetBtn = document.getElementById('resetBtn');
  
  // Default settings (should match settings.js)
  const defaultSettings = {
    navigator: true,
    screen: true,
    webgl: true,
    canvas: true,
    audio: true,
    fonts: false,
    webrtc: true,
    tracking: false,
    battery: true,
    speech: true,
    stealth: true,
    fingerprinting: true
  };
  
  let currentSettings = { ...defaultSettings };
  let currentStatus = null;
  
  // Initialize tabs
  initializeTabs();
  
  // Load settings from storage
  loadSettings();
  
  // Update status initially
  updateStatus();
  
  // Tab switching functionality
  function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active content
        tabContents.forEach(content => {
          content.classList.remove('active');
          if (content.id === targetTab + '-tab') {
            content.classList.add('active');
            
            // Refresh content when switching to info tab
            if (targetTab === 'info') {
              updateFingerprintInfo();
            }
          }
        });
      });
    });
  }
  
  // Load settings from Chrome storage
  function loadSettings() {
    chrome.storage.sync.get('fingerprintifySettings', (result) => {
      if (result.fingerprintifySettings) {
        currentSettings = { ...defaultSettings, ...result.fingerprintifySettings };
      }
      updateSettingsUI();
    });
  }
  
  // Save settings to Chrome storage
  function saveSettings() {
    chrome.storage.sync.set({ fingerprintifySettings: currentSettings }, () => {
      console.log('🛡️ Settings saved:', currentSettings);
      
      // Show feedback
      const originalText = saveSettingsBtn.textContent;
      saveSettingsBtn.textContent = 'ON Saved!';
      saveSettingsBtn.style.background = '#10B981';
      
      setTimeout(() => {
        saveSettingsBtn.textContent = originalText;
        saveSettingsBtn.style.background = '';
      }, 1500);
      
      // Notify content scripts about settings change
      notifySettingsChange();
    });
  }
  
  // Update settings UI toggles
  function updateSettingsUI() {
    const toggles = document.querySelectorAll('.toggle-switch');
    toggles.forEach(toggle => {
      const setting = toggle.dataset.setting;
      if (currentSettings[setting]) {
        toggle.classList.add('active');
      } else {
        toggle.classList.remove('active');
      }
    });
  }
  
  // Initialize toggle switches
  function initializeToggles() {
    const toggles = document.querySelectorAll('.toggle-switch');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const setting = toggle.dataset.setting;
        currentSettings[setting] = !currentSettings[setting];
        
        if (currentSettings[setting]) {
          toggle.classList.add('active');
        } else {
          toggle.classList.remove('active');
        }
        
        console.log('🛡️ Setting changed:', setting, currentSettings[setting]);
      });
    });
  }
  
  // Update protection status
  function updateStatus() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        const url = tabs[0].url;
        
        // Check if tab URL is valid for injection
        if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('edge://')) {
          if (statusElement) {
            statusElement.innerHTML = '<div>⚠️ Cannot protect this page</div>';
            statusElement.className = 'status status-unknown';
          }
          return;
        }
        
        // Use new communication system
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getStatus' }, (response) => {
          if (chrome.runtime.lastError) {
            if (statusElement) {
              statusElement.innerHTML = '<div>🔄 Loading protection...</div>';
              statusElement.className = 'status status-unknown';
            }
            console.log('⚠️ Popup: Communication error:', chrome.runtime.lastError);
            return;
          }
          
          if (response && response.success && response.data) {
            currentStatus = response.data;
            updateStatusDisplay(response.data);
            updateStatusGrid(response.data);
            updateFingerprintInfo(response.data);
          } else {
            if (statusElement) {
              statusElement.innerHTML = '<div>OFF Protection inactive</div>';
              statusElement.className = 'status status-inactive';
            }
          }
        });
      }
    });
  }
  
  // Update main status display
  function updateStatusDisplay(status) {
    if (statusElement) {
      console.log('🛡️ Popup: Updating main status display with:', status);
      
      // Count active protections based on settings rather than fake detection
      let activeCount = 0;
      
      // Use the settings to determine active protections
      const protectionModules = ['navigator', 'screen', 'webgl', 'canvas', 'webrtc', 'audio', 'battery', 'speech', 'stealth', 'fingerprinting'];
      
      protectionModules.forEach(module => {
        if (status.settings && status.settings[module] !== false) {
          activeCount++;
        }
      });
      
      // If no settings available, fall back to checking if protection is generally active
      if (!status.settings && status.active) {
        activeCount = 6; // Assume core protections are active
      }
      
      statusElement.innerHTML = `
        <div>ON Protection Active</div>
        <div style="font-size: 11px; margin-top: 4px;">
          ${activeCount} components protected
        </div>
      `;
      statusElement.className = 'status status-active';
      
      console.log(`🛡️ Popup: Status display updated - ${activeCount} active components`);
    }
  }
  
  // Update status grid
  function updateStatusGrid(status) {
    console.log('🛡️ Popup: Updating status grid with:', status);
    
    // New status mapping for all protection modules
    const statusMap = {
      navigatorStatus: status.settings?.navigator !== false ? 'ON' : 'OFF',
      screenStatus: status.settings?.screen !== false ? 'ON' : 'OFF', 
      webglStatus: status.settings?.webgl !== false ? 'ON' : 'OFF',
      canvasStatus: status.settings?.canvas !== false ? 'ON' : 'OFF',
      webrtcStatus: status.settings?.webrtc !== false ? 'ON' : 'OFF',
      audioStatus: status.settings?.audio !== false ? 'ON' : 'OFF',
      batteryStatus: status.settings?.battery !== false ? 'ON' : 'OFF',
      speechStatus: status.settings?.speech !== false ? 'ON' : 'OFF',
      stealthStatus: status.settings?.stealth !== false ? 'ON' : 'OFF',
      trackingStatus: status.settings?.fingerprinting !== false ? 'ON' : 'OFF'
    };
    
    console.log('🛡️ Popup: Status mapping:', statusMap);
    
    Object.entries(statusMap).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
        console.log(`🛡️ Popup: Set ${id} to ${value}`);
      } else {
        console.warn(`⚠️ Popup: Element ${id} not found`);
      }
    });
  }
  
  // Update fingerprint info tab
  function updateFingerprintInfo() {
    if (!currentStatus) {
      console.log('⚠️ Popup: No current status for fingerprint info');
      return;
    }
    
    console.log('🛡️ Popup: Updating fingerprint info with:', currentStatus);
    
    const elements = {
      currentPlatform: currentStatus.navigator?.platform || 'Original',
      currentHardware: currentStatus.navigator?.hardwareConcurrency ? 
        `${currentStatus.navigator.hardwareConcurrency} cores, ${currentStatus.navigator?.deviceMemory || '?'}GB` : 
        'Original',
      currentScreen: currentStatus.screen ? 
        `${currentStatus.screen.width}x${currentStatus.screen.height}@${currentStatus.screen.colorDepth}bit` : 
        'Original',
      currentSession: currentStatus.session || 'No Session'
    };
    
    console.log('🛡️ Popup: Info elements:', elements);
    
    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
        console.log(`🛡️ Popup: Set ${id} to ${value}`);
      } else {
        console.warn(`⚠️ Popup: Element ${id} not found`);
      }
    });
  }
  
  // Notify content scripts about settings changes
  function notifySettingsChange() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'updateSettings', 
          settings: currentSettings 
        });
      }
    });
  }
  
  // Event listeners
  if (regenerateBtn) {
    regenerateBtn.addEventListener('click', function() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'regenerate' });
          
          // Show feedback
          const originalText = regenerateBtn.textContent;
          regenerateBtn.textContent = '🔄 Regenerating...';
          regenerateBtn.disabled = true;
          
          setTimeout(() => {
            window.close();
            location.reload();
          }, 100); 
        }
      });
    });
  }
  
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', saveSettings);
  }
  
  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      const exportData = {
        settings: currentSettings,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], 
                           { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      chrome.downloads.download({
        url: url,
        filename: 'fingerprintify-settings.json',
        saveAs: true
      });
    });
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      if (confirm('Reset all settings to defaults?')) {
        currentSettings = { ...defaultSettings };
        updateSettingsUI();
        saveSettings();
      }
    });
  }
  
  // Initialize toggles after DOM is ready
  initializeToggles();
  
  // Refresh status every 3 seconds when popup is open
  const statusInterval = setInterval(updateStatus, 3000);
  
  // Clean up on popup close
  window.addEventListener('beforeunload', () => {
    clearInterval(statusInterval);
  });
  
  console.log('🛡️ Enhanced popup initialized with settings:', currentSettings);
});
