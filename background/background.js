// Minimal background service worker for Fingerprintify
console.log('🛡️ Fingerprintify: Background script starting...');

// Simple extension state
let isEnabled = true;

// Fake UserAgents für HTTP Headers
const fakeUserAgents = [
  'Mozilla/5.0 (QuantumOS 12.5; Quantum64; x64) AppleWebKit/888.88 (KHTML, like Gecko) HyperBrowser/500.0.0.0',
  'Mozilla/5.0 (HoloWindows 25.0; Win256; x256) HyperWebKit/2000.0 (KHTML, like Gecko) MetaBrowser/1000.0.0.0',
  'Mozilla/5.0 (UltraLinux 99.9; x256) AppleWebKit/1111.11 (KHTML, like Gecko) QuantumChrome/777.0.0.0',
  'Mozilla/5.0 (CyberMac; Intel Quantum X 50_0_0) AppleWebKit/3000.0 (KHTML, like Gecko) NeuralSafari/888.0.0.0',
  'Mozilla/5.0 (NeoAndroid 25.0; ARM256; aarch256) AppleWebKit/4444.44 (KHTML, like Gecko) CyberChrome/1500.0.0.0',
  'Mozilla/5.0 (MetaWindows 50.0; Win512; x512) NeuralWebKit/9999.99 (KHTML, like Gecko) QuantumFox/5000.0'
];

const fakePlatforms = [
  'QuantumOS', 'HoloWindows', 'UltraLinux', 'CyberMac', 'NeoAndroid', 'MetaWindows',
  'Win256', 'Win512', 'ARM256', 'QuantumARM', 'HyperX86', 'NeuralX256'
];

// Dynamische Header Rules updaten
function updateHeaderRules() {
  const randomUA = fakeUserAgents[Math.floor(Math.random() * fakeUserAgents.length)];
  const randomPlatform = fakePlatforms[Math.floor(Math.random() * fakePlatforms.length)];
  
  const newRules = [
    {
      "id": 1,
      "priority": 1,
      "action": {
        "type": "modifyHeaders",
        "requestHeaders": [
          {
            "header": "user-agent",
            "operation": "set",
            "value": randomUA
          },
          {
            "header": "sec-ch-ua-platform",
            "operation": "set",
            "value": `"${randomPlatform}"`
          },
          {
            "header": "sec-ch-ua",
            "operation": "set", 
            "value": `"QuantumBrowser";v="500", "Not)A;Brand";v="99", "HyperChrome";v="${Math.floor(Math.random() * 1000)}"`
          }
        ]
      },
      "condition": {
        "resourceTypes": ["main_frame", "sub_frame"]
      }
    }
  ];
  
  // Alte Rules löschen und neue setzen
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1, 2, 3, 4, 5],
    addRules: newRules
  }).then(() => {
    console.log('🛡️ Fingerprintify: HTTP Headers updated!', randomUA, randomPlatform);
  }).catch(err => {
    console.error('🛡️ Fingerprintify: Failed to update headers:', err);
  });
}

// Handle extension installation
self.addEventListener('install', () => {
  console.log('🛡️ Fingerprintify: Service worker installed');
  updateHeaderRules();
});

self.addEventListener('activate', () => {
  console.log('🛡️ Fingerprintify: Service worker activated');
  updateHeaderRules();
});

// Handle runtime startup
chrome.runtime.onStartup.addListener(() => {
  console.log('🛡️ Fingerprintify: Runtime started');
  updateHeaderRules();
});

// Header alle 30 Sekunden randomisieren
setInterval(updateHeaderRules, 30000);

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('🛡️ Fingerprintify: Extension installed/updated');
});

// Handle messages (optional, for future UI communication)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStatus') {
    sendResponse({ enabled: isEnabled });
  } else if (request.action === 'toggle') {
    isEnabled = !isEnabled;
    sendResponse({ enabled: isEnabled });
  }
  return true; // Keep message channel open
});

console.log('🛡️ Fingerprintify: Background script loaded');
