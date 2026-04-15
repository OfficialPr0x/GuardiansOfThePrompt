/* ============================================
   Guardians of the Prompt — Popup Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveBtn = document.getElementById('saveBtn');
  const validateBtn = document.getElementById('validateBtn');
  const toggleVisibility = document.getElementById('toggleVisibility');
  const status = document.getElementById('status');
  const customCount = document.getElementById('customCount');
  const resetBtn = document.getElementById('resetBtn');

  // Load existing key
  chrome.storage.sync.get(['deepseekApiKey'], result => {
    if (result.deepseekApiKey) {
      apiKeyInput.value = result.deepseekApiKey;
    }
  });

  // Load custom persona count
  chrome.storage.sync.get(['customPersonas'], result => {
    const personas = result.customPersonas || [];
    customCount.textContent = personas.length;
  });

  // Toggle password visibility
  toggleVisibility.addEventListener('click', () => {
    const isPassword = apiKeyInput.type === 'password';
    apiKeyInput.type = isPassword ? 'text' : 'password';
    toggleVisibility.textContent = isPassword ? '🔒' : '👁️';
  });

  // Save API key
  saveBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
      showStatus('Please enter an API key.', 'error');
      return;
    }

    // Basic format validation
    if (!key.startsWith('sk-')) {
      showStatus('API key should start with "sk-".', 'error');
      return;
    }

    chrome.storage.sync.set({ deepseekApiKey: key }, () => {
      showStatus('API key saved successfully!', 'success');
    });
  });

  // Validate API key
  validateBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
      showStatus('Please enter an API key first.', 'error');
      return;
    }

    validateBtn.disabled = true;
    validateBtn.textContent = 'Checking...';

    chrome.runtime.sendMessage({ action: 'validateApiKey', apiKey: key }, response => {
      validateBtn.disabled = false;
      validateBtn.textContent = 'Validate';

      if (response && response.valid) {
        showStatus('API key is valid! You\'re all set.', 'success');
      } else {
        showStatus('Invalid API key: ' + (response?.error || 'Unknown error'), 'error');
      }
    });
  });

  // Reset custom personas
  resetBtn.addEventListener('click', () => {
    if (confirm('Delete all custom personas? This cannot be undone.')) {
      chrome.storage.sync.set({ customPersonas: [] }, () => {
        customCount.textContent = '0';
        showStatus('Custom personas cleared.', 'success');
      });
    }
  });

  function showStatus(message, type) {
    status.textContent = message;
    status.className = 'status ' + type;
    setTimeout(() => {
      status.className = 'status';
    }, 4000);
  }
});
