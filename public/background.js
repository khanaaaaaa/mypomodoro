/// <reference types="chrome" />

// background.js - service worker for Flavortown extension
// Contains install-time initialization and message handling.

// Default values stored for a fresh install.  We merge these with any
// existing state to avoid overwriting user data on extension upgrades.
const DEFAULT_STORAGE = {
  points: 0,
  currentEra: 'medieval',
  currentMood: 'adventurous',
  randomMode: false,
  stats: {
    points: 0,
    totalTransformations: 0,
    eraUsage: { medieval: 0, kawaii: 0 },
    moodUsage: { adventurous: 0, nostalgic: 0, mysterious: 0, energetic: 0 },
    uniqueCombos: 0,
    lastPlayDate: 0,
    sessionStartTime: Date.now(),
    transformationsInSession: 0
  },
  achievements: [],
  dailyChallenge: null,
  customThemes: []
};

// perform installation / upgrade initialization
chrome.runtime.onInstalled.addListener(() => {
  console.log('Flavortown Time-Travel Extension installed or updated');

  chrome.storage.local.get(Object.keys(DEFAULT_STORAGE), (stored) => {
    const toSet = {};
    for (const key in DEFAULT_STORAGE) {
      if (stored[key] === undefined) {
        toSet[key] = DEFAULT_STORAGE[key];
      }
    }
    if (Object.keys(toSet).length) {
      chrome.storage.local.set(toSet);
    }
  });
});

// Add custom header to all HTTP requests
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    details.requestHeaders.push({
      name: 'X-Flavortown-Ext-13118',
      value: 'true'
    });
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ['<all_urls>'] },
  ['requestHeaders', 'extraHeaders']
);

// Apply a random era to a given tab (used in random mode)
function applyRandomEraToTab(tabId) {
  const eras = ['medieval', 'kawaii'];
  const randomEra = eras[Math.floor(Math.random() * eras.length)];
  chrome.tabs.sendMessage(tabId, { action: 'applyEra', era: randomEra, mood: '' })
    .catch(() => {
      // content script might not be injected yet; ignore errors
    });
}

// cached copy of randomMode to avoid frequent storage lookups
let cachedRandomMode = DEFAULT_STORAGE.randomMode;

// grab the current value at startup
chrome.storage.local.get('randomMode', (res) => {
  if (res && typeof res.randomMode === 'boolean') {
    cachedRandomMode = res.randomMode;
  }
});

// update cache when storage changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.randomMode) {
    cachedRandomMode = changes.randomMode.newValue;
  }
});

// Listen for tab updates and optionally apply random era
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && cachedRandomMode) {
    applyRandomEraToTab(tabId);
  }
});

// The service worker may be restarted; ensure listeners are re-registered
chrome.runtime.onStartup.addListener(() => {
  console.log('Extension service worker restarted');
});

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    if (message.action === 'updatePoints') {
      // Update storage with new points
      if (message.points !== undefined) {
        chrome.storage.local.set({ points: message.points });
      }
      // Broadcast to all extension pages
      chrome.runtime.sendMessage(message).catch(() => {
        // receiver may not be available
      });
    }
    
    if (message.action === 'updateStats') {
      // Update stats in storage
      if (message.stats) {
        chrome.storage.local.set({ stats: message.stats });
      }
    }
    
    if (message.action === 'updateAchievements') {
      // Update achievements in storage
      if (message.achievements) {
        chrome.storage.local.set({ achievements: message.achievements });
      }
    }
    
    if (message.action === 'updateDailyChallenge') {
      // Update daily challenge in storage
      if (message.dailyChallenge !== undefined) {
        chrome.storage.local.set({ dailyChallenge: message.dailyChallenge });
      }
    }
    
    if (message.action === 'updateCustomThemes') {
      // Update custom themes in storage
      if (message.customThemes) {
        chrome.storage.local.set({ customThemes: message.customThemes });
      }
    }
    
    sendResponse({ received: true });
  } catch (error) {
    console.error('Error in message handler:', error);
    sendResponse({ received: false, error: String(error) });
  }
  return true;
});