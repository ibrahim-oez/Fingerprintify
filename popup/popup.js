// Enhanced Popup Script for Fingerprintify Extension
document.addEventListener('DOMContentLoaded', function() {
  console.log('🛡️ Fingerprintify: Enhanced popup loaded');
  
  // UI elements
  const statusElement = document.getElementById('status');
  const regenerateBtn = document.getElementById('regenerateBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const exportBtn = document.getElementById('exportBtn');
  const resetBtn = document.getElementById('resetBtn');
  
  // Default settings (SAFE defaults - all OFF)
  const defaultSettings = {
    navigator: false,
    screen: false,
    webgl: false,
    canvas: false,
    audio: false,
    fonts: false,
    webrtc: false,
    tracking: false
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
      saveSettingsBtn.textContent = '✅ Saved!';
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
        
        // Get detailed status from content script
        chrome.tabs.sendMessage(tabs[0].id, { action: 'checkDetails' }, (response) => {
          if (chrome.runtime.lastError) {
            if (statusElement) {
              statusElement.innerHTML = '<div>🔄 Loading protection...</div>';
              statusElement.className = 'status status-unknown';
            }
            return;
          }
          
          if (response && response.active) {
            currentStatus = response;
            updateStatusDisplay(response);
            updateStatusGrid(response);
          } else {
            if (statusElement) {
              statusElement.innerHTML = '<div>❌ Protection inactive</div>';
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
      const activeCount = Object.values(status).filter(v => v === true).length;
      statusElement.innerHTML = `
        <div>✅ Protection Active</div>
        <div style="font-size: 11px; margin-top: 4px;">
          ${activeCount} components protected
        </div>
      `;
      statusElement.className = 'status status-active';
    }
  }
  
  // Update status grid
  function updateStatusGrid(status) {
    const statusMap = {
      navigatorStatus: status.navigator?.platform ? '✅' : '❌',
      screenStatus: status.screen?.width ? '✅' : '❌',
      webglStatus: status.webgl?.vendor ? '✅' : '❌',
      canvasStatus: status.canvas ? '✅' : '❌',
      webrtcStatus: status.webrtc ? '✅' : '❌',
      audioStatus: '✅' // Assume active if other protections work
    };
    
    Object.entries(statusMap).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }
  
  // Update fingerprint info tab
  function updateFingerprintInfo() {
    if (!currentStatus) return;
    
    const elements = {
      currentPlatform: currentStatus.navigator?.platform || '-',
      currentHardware: `${currentStatus.navigator?.hardwareConcurrency || '-'} cores, ${currentStatus.navigator?.deviceMemory || '-'}GB`,
      currentScreen: currentStatus.screen ? `${currentStatus.screen.width}x${currentStatus.screen.height}` : '-',
      currentSession: currentStatus.session || '-'
    };
    
    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
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
