// Simplified popup script for Fingerprintify extension

document.addEventListener('DOMContentLoaded', function() {
  console.log('🛡️ Fingerprintify: Popup loaded');
  
  // UI elements
  const statusElement = document.getElementById('status');
  const regenerateBtn = document.getElementById('regenerateBtn');
  const optionsBtn = document.getElementById('optionsBtn');
  
  // Update status by checking current tab
  function updateStatus() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        // Check if tab URL is valid for injection
        const url = tabs[0].url;
        if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('edge://')) {
          if (statusElement) {
            statusElement.textContent = '⚠️ Cannot protect this page';
            statusElement.className = 'status status-unknown';
          }
          return;
        }
        
        // For valid pages, assume protection is active
        if (statusElement) {
          statusElement.textContent = '✅ Protection Active';
          statusElement.className = 'status status-active';
        }
      }
    });
  }
  
  // Initial status update
  updateStatus();
  
  // Regenerate button
  if (regenerateBtn) {
    regenerateBtn.addEventListener('click', function() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'regenerate' });
          // Close popup after regenerating
          setTimeout(() => window.close(), 100);
        }
      });
    });
  }
  
  // Options button
  if (optionsBtn) {
    optionsBtn.addEventListener('click', function() {
      chrome.runtime.openOptionsPage();
    });
  }
  
  // Refresh status every 2 seconds
  setInterval(updateStatus, 2000);
});
