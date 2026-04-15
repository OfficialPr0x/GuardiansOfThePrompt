/* ============================================
   Guardians of the Prompt — Background Service Worker
   ============================================ */

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getApiKey') {
    chrome.storage.sync.get(['deepseekApiKey'], result => {
      sendResponse({ apiKey: result.deepseekApiKey || '' });
    });
    return true;
  }

  if (request.action === 'setApiKey') {
    chrome.storage.sync.set({ deepseekApiKey: request.apiKey }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.action === 'validateApiKey') {
    validateApiKey(request.apiKey).then(result => {
      sendResponse(result);
    });
    return true;
  }
});

async function validateApiKey(apiKey) {
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 1
      })
    });

    if (response.ok) {
      return { valid: true };
    } else {
      const body = await response.text().catch(() => '');
      return { valid: false, error: `API returned ${response.status}: ${body}` };
    }
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

// Open popup on extension icon click (handled automatically by manifest)
// Install handler - open popup on first install
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.storage.sync.get(['deepseekApiKey'], result => {
      if (!result.deepseekApiKey) {
        // Will prompt user to set API key when they first use it
        console.log('Guardians of the Prompt installed! Please set your DeepSeek API key.');
      }
    });
  }
});
