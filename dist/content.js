/* ============================================
   Guardians of the Prompt — Content Script
   ============================================ */

(() => {
  'use strict';

  // Avoid double-injection
  if (window.__GOTP_LOADED__) return;
  window.__GOTP_LOADED__ = true;

  // ── Default Personas ──────────────────────
  const DEFAULT_PERSONAS = [
    {
      id: 'professional',
      name: 'Professional',
      emoji: '💼',
      description: 'Polished, corporate-ready language',
      prompt: 'Rewrite the following text to sound highly professional, polished, and corporate-appropriate. Use precise vocabulary, clear structure, and authoritative tone. Maintain the original intent and meaning.',
      builtIn: true
    },
    {
      id: 'creative',
      name: 'Creative Writer',
      emoji: '✨',
      description: 'Vivid, engaging, and artistic prose',
      prompt: 'Rewrite the following text with creative flair. Use vivid imagery, engaging rhythm, varied sentence structures, and artistic language. Make it captivating while preserving the core message.',
      builtIn: true
    },
    {
      id: 'academic',
      name: 'Academic Scholar',
      emoji: '🎓',
      description: 'Scholarly, rigorous, and well-structured',
      prompt: 'Rewrite the following text in an academic, scholarly tone. Use precise terminology, formal register, logical flow, and evidence-based framing. Ensure intellectual rigor while maintaining clarity.',
      builtIn: true
    },
    {
      id: 'persuasive',
      name: 'Persuader',
      emoji: '🎯',
      description: 'Compelling, convincing, and action-driven',
      prompt: 'Rewrite the following text to be maximally persuasive and compelling. Use rhetorical techniques, strong calls to action, emotional appeals, and confident language. Make the reader want to agree and act.',
      builtIn: true
    },
    {
      id: 'concise',
      name: 'Concise Expert',
      emoji: '⚡',
      description: 'Sharp, minimal, maximum impact',
      prompt: 'Rewrite the following text to be as concise as possible without losing meaning. Remove all fluff, redundancy, and unnecessary words. Every word must earn its place. Be sharp, direct, and impactful.',
      builtIn: true
    },
    {
      id: 'friendly',
      name: 'Friendly & Warm',
      emoji: '😊',
      description: 'Approachable, warm, and conversational',
      prompt: 'Rewrite the following text to sound warm, friendly, and approachable. Use conversational language, positive framing, and an inviting tone. Make the reader feel comfortable and welcomed.',
      builtIn: true
    },
    {
      id: 'storyteller',
      name: 'Storyteller',
      emoji: '📖',
      description: 'Narrative-driven with hooks and arcs',
      prompt: 'Rewrite the following text as a compelling narrative. Add story elements — a hook, rising tension, and a satisfying conclusion. Use the art of storytelling to make the message unforgettable.',
      builtIn: true
    },
    {
      id: 'technical',
      name: 'Technical Expert',
      emoji: '🔧',
      description: 'Precise, detailed, engineering-grade',
      prompt: 'Rewrite the following text with technical precision and engineering-grade clarity. Use exact terminology, structured formatting, and leave no room for ambiguity. Be thorough and methodical.',
      builtIn: true
    },
    {
      id: 'visionary',
      name: 'Visionary Leader',
      emoji: '🚀',
      description: 'Inspirational, bold, future-focused',
      prompt: 'Rewrite the following text as a visionary leader would. Be bold, inspirational, and future-focused. Paint a picture of possibility, use powerful metaphors, and motivate the reader to think bigger.',
      builtIn: true
    },
    {
      id: 'witty',
      name: 'Witty & Clever',
      emoji: '🧠',
      description: 'Smart humor, wordplay, and charm',
      prompt: 'Rewrite the following text with wit and cleverness. Add smart humor, wordplay, and charming turns of phrase. Keep the core message but make it delightful and memorable to read.',
      builtIn: true
    }
  ];

  const SHIELD_SVG = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4L25 8.5V16C25 21.5 21 26 16 28C11 26 7 21.5 7 16V8.5L16 4Z" fill="rgba(255,255,255,0.15)" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M17.5 10L13 17L16 17L14.5 23L20 15L17 15Z" fill="#fbbf24" stroke="#f59e0b" stroke-width="0.5" stroke-linejoin="round"/>
  </svg>`;

  const EMOJI_OPTIONS = ['⚡', '🎯', '🔥', '💎', '🌟', '🎨', '🛡️', '📝', '🧪', '🎭', '👑', '🌊', '🦁', '🤖', '🧙', '💡'];

  // ── State ─────────────────────────────────
  let customPersonas = [];
  let activeDropdown = null;
  let activeShield = null;
  let currentAbortController = null;
  let isStreaming = false;

  // ── Load Custom Personas from Storage ─────
  function loadCustomPersonas() {
    return new Promise(resolve => {
      chrome.storage.sync.get(['customPersonas'], result => {
        customPersonas = result.customPersonas || [];
        resolve();
      });
    });
  }

  function saveCustomPersonas() {
    chrome.storage.sync.set({ customPersonas });
  }

  function getAllPersonas() {
    return [...DEFAULT_PERSONAS, ...customPersonas];
  }

  // ── Shield Logo Injection ─────────────────
  const processedInputs = new WeakSet();

  function isValidInput(el) {
    if (processedInputs.has(el)) return false;
    // Don't attach to our own elements
    if (el.closest('.gotp-dropdown, .gotp-modal-overlay, .gotp-shield, .gotp-streaming-indicator')) return false;
    if (el.classList.contains('gotp-search') || el.classList.contains('gotp-form-input') || el.classList.contains('gotp-form-textarea')) return false;

    // For standard inputs, only allow text-like types
    if (el.tagName === 'INPUT') {
      const type = (el.getAttribute('type') || 'text').toLowerCase();
      if (!['text', 'search', 'email', 'url'].includes(type)) return false;
    }

    if (el.readOnly || el.disabled) return false;

    // Skip hidden/invisible elements
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;

    // Check minimum visible size
    const rect = el.getBoundingClientRect();
    if (rect.width < 60 || rect.height < 20) return false;

    return true;
  }

  function getInputFields() {
    const inputs = Array.from(document.querySelectorAll(
      'input[type="text"], input[type="search"], input[type="email"], input[type="url"], input:not([type]), textarea'
    ));
    const editables = Array.from(document.querySelectorAll('[contenteditable="true"], [contenteditable=""]'));
    // Also match common rich text editors
    const roles = Array.from(document.querySelectorAll('[role="textbox"]'));
    const all = [...inputs, ...editables, ...roles];
    // Deduplicate
    return [...new Set(all)];
  }

  function positionShield(shield, el) {
    const rect = el.getBoundingClientRect();

    // Hide if element is not visible or off-screen
    if (rect.width === 0 || rect.height === 0 ||
        rect.bottom < 0 || rect.top > window.innerHeight ||
        rect.right < 0 || rect.left > window.innerWidth) {
      shield.style.display = 'none';
      return;
    }

    shield.style.display = 'flex';
    // Use fixed positioning — works regardless of parent transforms/positions
    shield.style.top = (rect.top + (rect.height - 28) / 2) + 'px';
    shield.style.left = (rect.right - 36) + 'px';
  }

  function cleanupShield(shield, el, repositionHandler, observer) {
    shield.remove();
    observer.disconnect();
    window.removeEventListener('scroll', repositionHandler, true);
    window.removeEventListener('resize', repositionHandler);
    processedInputs.delete(el);
  }

  function attachShield(el) {
    if (!isValidInput(el)) return;
    processedInputs.add(el);

    const shield = document.createElement('div');
    shield.className = 'gotp-shield';
    shield.innerHTML = SHIELD_SVG;
    shield.title = 'Guardians of the Prompt — Enhance your text';
    document.body.appendChild(shield);

    // Position the shield
    positionShield(shield, el);

    // Reposition on scroll (capture phase to catch all scrollable containers) and resize
    const repositionHandler = () => {
      requestAnimationFrame(() => positionShield(shield, el));
    };
    window.addEventListener('scroll', repositionHandler, { passive: true, capture: true });
    window.addEventListener('resize', repositionHandler, { passive: true });

    // Watch for element removal or hiding
    const observer = new MutationObserver(() => {
      if (!document.body.contains(el)) {
        cleanupShield(shield, el, repositionHandler, observer);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Click handler
    shield.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown(shield, el);
    });

    // Also reposition on focus/blur of the input (some sites resize on focus)
    el.addEventListener('focus', repositionHandler);
    el.addEventListener('blur', repositionHandler);
  }

  // ── Dropdown ──────────────────────────────
  function toggleDropdown(shield, inputEl) {
    if (activeDropdown) {
      closeDropdown();
      if (activeShield === shield) return;
    }
    openDropdown(shield, inputEl);
  }

  function closeDropdown() {
    if (activeDropdown) {
      activeDropdown.remove();
      activeDropdown = null;
      activeShield = null;
    }
  }

  function openDropdown(shield, inputEl) {
    const dropdown = document.createElement('div');
    dropdown.className = 'gotp-dropdown';

    // Header
    dropdown.innerHTML = `
      <div class="gotp-dropdown-header">
        ${SHIELD_SVG}
        <div>
          <div class="gotp-dropdown-title">Guardians of the Prompt</div>
          <div class="gotp-dropdown-subtitle">Select a persona to enhance your text</div>
        </div>
      </div>
      <div class="gotp-search-wrap">
        <input class="gotp-search" type="text" placeholder="Search personas..." />
      </div>
      <div class="gotp-persona-list"></div>
      <div class="gotp-divider"></div>
      <div class="gotp-add-persona">
        <div class="gotp-add-icon">+</div>
        <span>Create Custom Persona</span>
      </div>
    `;

    document.body.appendChild(dropdown);

    // Position
    const shieldRect = shield.getBoundingClientRect();
    dropdown.style.position = 'fixed';
    
    // Smart positioning: check available space
    const dropdownHeight = 420;
    const spaceBelow = window.innerHeight - shieldRect.bottom;
    const spaceAbove = shieldRect.top;
    
    if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
      dropdown.style.top = (shieldRect.bottom + 6) + 'px';
    } else {
      dropdown.style.bottom = (window.innerHeight - shieldRect.top + 6) + 'px';
    }
    
    // Horizontal: align right edge to shield
    const dropRight = shieldRect.right;
    const dropLeft = Math.max(8, dropRight - 300);
    dropdown.style.left = dropLeft + 'px';

    // Populate personas
    const list = dropdown.querySelector('.gotp-persona-list');
    renderPersonaList(list, inputEl);

    // Search functionality
    const searchInput = dropdown.querySelector('.gotp-search');
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      renderPersonaList(list, inputEl, query);
    });

    // Add persona button
    dropdown.querySelector('.gotp-add-persona').addEventListener('click', () => {
      closeDropdown();
      openPersonaModal(null, inputEl);
    });

    // Show with animation
    requestAnimationFrame(() => dropdown.classList.add('gotp-visible'));

    activeDropdown = dropdown;
    activeShield = shield;

    // Focus search
    setTimeout(() => searchInput.focus(), 50);
  }

  function renderPersonaList(container, inputEl, filter = '') {
    container.innerHTML = '';
    const personas = getAllPersonas().filter(p =>
      !filter || p.name.toLowerCase().includes(filter) || p.description.toLowerCase().includes(filter)
    );

    personas.forEach(persona => {
      const item = document.createElement('div');
      item.className = 'gotp-persona';
      item.innerHTML = `
        <div class="gotp-persona-icon">${persona.emoji}</div>
        <div class="gotp-persona-info">
          <div class="gotp-persona-name">${escapeHtml(persona.name)}</div>
          <div class="gotp-persona-desc">${escapeHtml(persona.description)}</div>
        </div>
        ${!persona.builtIn ? `
          <div class="gotp-persona-actions">
            <button class="gotp-persona-action-btn gotp-edit" title="Edit">✏️</button>
            <button class="gotp-persona-action-btn gotp-delete" title="Delete">🗑️</button>
          </div>
        ` : ''}
      `;

      // Click to enhance
      item.addEventListener('click', e => {
        if (e.target.closest('.gotp-persona-action-btn')) return;
        closeDropdown();
        enhanceText(inputEl, persona);
      });

      // Edit button
      const editBtn = item.querySelector('.gotp-edit');
      if (editBtn) {
        editBtn.addEventListener('click', e => {
          e.stopPropagation();
          closeDropdown();
          openPersonaModal(persona, inputEl);
        });
      }

      // Delete button
      const deleteBtn = item.querySelector('.gotp-delete');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', e => {
          e.stopPropagation();
          customPersonas = customPersonas.filter(p => p.id !== persona.id);
          saveCustomPersonas();
          renderPersonaList(container, inputEl, '');
        });
      }

      container.appendChild(item);
    });

    if (personas.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:20px;color:#5a5a7a;font-size:13px;">No personas found</div>';
    }
  }

  // ── Persona Modal ─────────────────────────
  function openPersonaModal(existingPersona, inputEl) {
    const isEditing = !!existingPersona;
    const overlay = document.createElement('div');
    overlay.className = 'gotp-modal-overlay';

    overlay.innerHTML = `
      <div class="gotp-modal">
        <div class="gotp-modal-title">${isEditing ? 'Edit Persona' : 'Create Custom Persona'}</div>
        <div class="gotp-modal-desc">${isEditing ? 'Modify your persona settings below.' : 'Design your own AI persona for text enhancement.'}</div>
        
        <div class="gotp-form-group">
          <label class="gotp-form-label">Persona Name</label>
          <input class="gotp-form-input" id="gotp-persona-name" type="text" placeholder="e.g. Marketing Guru" maxlength="40" value="${isEditing ? escapeHtml(existingPersona.name) : ''}" />
        </div>
        
        <div class="gotp-form-group">
          <label class="gotp-form-label">Icon</label>
          <div class="gotp-emoji-picker" id="gotp-emoji-picker"></div>
        </div>
        
        <div class="gotp-form-group">
          <label class="gotp-form-label">Short Description</label>
          <input class="gotp-form-input" id="gotp-persona-desc" type="text" placeholder="e.g. Bold, punchy marketing copy" maxlength="80" value="${isEditing ? escapeHtml(existingPersona.description) : ''}" />
        </div>
        
        <div class="gotp-form-group">
          <label class="gotp-form-label">System Prompt</label>
          <textarea class="gotp-form-textarea" id="gotp-persona-prompt" placeholder="Describe how this persona should rewrite text. e.g. 'Rewrite the following text as a bold marketing expert would...'">${isEditing ? escapeHtml(existingPersona.prompt) : ''}</textarea>
        </div>
        
        <div class="gotp-modal-actions">
          <button class="gotp-btn gotp-btn-cancel" id="gotp-modal-cancel">Cancel</button>
          <button class="gotp-btn gotp-btn-primary" id="gotp-modal-save">${isEditing ? 'Save Changes' : 'Create Persona'}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Emoji picker
    const emojiPicker = overlay.querySelector('#gotp-emoji-picker');
    let selectedEmoji = isEditing ? existingPersona.emoji : EMOJI_OPTIONS[0];

    EMOJI_OPTIONS.forEach(emoji => {
      const opt = document.createElement('div');
      opt.className = 'gotp-emoji-option' + (emoji === selectedEmoji ? ' gotp-selected' : '');
      opt.textContent = emoji;
      opt.addEventListener('click', () => {
        emojiPicker.querySelectorAll('.gotp-emoji-option').forEach(el => el.classList.remove('gotp-selected'));
        opt.classList.add('gotp-selected');
        selectedEmoji = emoji;
      });
      emojiPicker.appendChild(opt);
    });

    requestAnimationFrame(() => overlay.classList.add('gotp-visible'));

    // Cancel
    overlay.querySelector('#gotp-modal-cancel').addEventListener('click', () => {
      overlay.remove();
    });

    // Click overlay background to close
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.remove();
    });

    // Save
    overlay.querySelector('#gotp-modal-save').addEventListener('click', () => {
      const name = overlay.querySelector('#gotp-persona-name').value.trim();
      const desc = overlay.querySelector('#gotp-persona-desc').value.trim();
      const prompt = overlay.querySelector('#gotp-persona-prompt').value.trim();

      if (!name || !prompt) {
        showToast('Please fill in at least the name and system prompt.', true);
        return;
      }

      if (isEditing) {
        const idx = customPersonas.findIndex(p => p.id === existingPersona.id);
        if (idx !== -1) {
          customPersonas[idx] = { ...customPersonas[idx], name, emoji: selectedEmoji, description: desc, prompt };
        }
      } else {
        customPersonas.push({
          id: 'custom_' + Date.now(),
          name,
          emoji: selectedEmoji,
          description: desc,
          prompt,
          builtIn: false
        });
      }

      saveCustomPersonas();
      overlay.remove();
      showToast(`Persona "${name}" ${isEditing ? 'updated' : 'created'}!`);
    });
  }

  // ── Text Enhancement (DeepSeek API) ───────
  function getTextFromInput(el) {
    if (el.isContentEditable || el.getAttribute('contenteditable') !== null) {
      return el.innerText || el.textContent || '';
    }
    return el.value || '';
  }

  function setTextToInput(el, text) {
    if (el.isContentEditable || el.getAttribute('contenteditable') !== null) {
      // Preserve cursor at end for contenteditable
      el.innerText = text;
      // Move cursor to end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      // Use correct native setter based on element type for React/Vue/Angular compatibility
      const proto = el.tagName === 'TEXTAREA'
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype;
      const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;

      if (nativeSetter) {
        nativeSetter.call(el, text);
      } else {
        el.value = text;
      }

      // Dispatch events for framework compatibility
      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    }
  }

  async function enhanceText(inputEl, persona) {
    const originalText = getTextFromInput(inputEl).trim();
    if (!originalText) {
      showToast('Please type some text first before enhancing.', true);
      return;
    }

    // Check for API key
    const apiKey = await getApiKey();
    if (!apiKey) {
      showToast('Please set your DeepSeek API key in the extension popup (click the extension icon).', true);
      return;
    }

    // Abort any existing stream
    if (currentAbortController) {
      currentAbortController.abort();
    }

    currentAbortController = new AbortController();
    isStreaming = true;

    // Show streaming indicator
    const indicator = showStreamingIndicator(inputEl, persona.name);

    try {
      // Clear the input for streaming
      setTextToInput(inputEl, '');

      let accumulated = '';

      await streamFromDeepSeek(apiKey, persona.prompt, originalText, currentAbortController.signal, chunk => {
        accumulated += chunk;
        setTextToInput(inputEl, accumulated);

        // Auto-scroll textarea
        if (inputEl.tagName === 'TEXTAREA') {
          inputEl.scrollTop = inputEl.scrollHeight;
        }
      });

      isStreaming = false;
      indicator.remove();
      showToast(`Enhanced with ${persona.emoji} ${persona.name}`);
    } catch (err) {
      isStreaming = false;
      indicator.remove();

      if (err.name === 'AbortError') {
        showToast('Enhancement stopped.');
      } else {
        console.error('GOTP Enhancement error:', err);
        // Restore original text on error
        setTextToInput(inputEl, originalText);
        showToast('Enhancement failed: ' + (err.message || 'Unknown error'), true);
      }
    } finally {
      currentAbortController = null;
    }
  }

  async function streamFromDeepSeek(apiKey, systemPrompt, userText, signal, onChunk) {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt + '\n\nIMPORTANT: Output ONLY the enhanced/rewritten text. Do NOT include any preamble, explanation, labels, or commentary. Do NOT wrap in quotes. Just the rewritten text, nothing else.'
          },
          {
            role: 'user',
            content: userText
          }
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 4096
      }),
      signal
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      throw new Error(`API error ${response.status}: ${errBody}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') return;

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            onChunk(delta);
          }
        } catch {
          // Skip malformed JSON chunks
        }
      }
    }
  }

  function getApiKey() {
    return new Promise(resolve => {
      chrome.storage.sync.get(['deepseekApiKey'], result => {
        resolve(result.deepseekApiKey || '');
      });
    });
  }

  // ── Streaming Indicator ───────────────────
  function showStreamingIndicator(inputEl, personaName) {
    const indicator = document.createElement('div');
    indicator.className = 'gotp-streaming-indicator';
    indicator.innerHTML = `
      <div class="gotp-streaming-dot"></div>
      <span>Enhancing with ${escapeHtml(personaName)}...</span>
      <div class="gotp-streaming-stop" title="Stop">
        <div class="gotp-streaming-stop-icon"></div>
      </div>
    `;

    const rect = inputEl.getBoundingClientRect();
    indicator.style.position = 'fixed';
    indicator.style.top = (rect.top - 36) + 'px';
    indicator.style.left = rect.left + 'px';

    indicator.querySelector('.gotp-streaming-stop').addEventListener('click', () => {
      if (currentAbortController) currentAbortController.abort();
    });

    document.body.appendChild(indicator);
    return indicator;
  }

  // ── Toast Notifications ───────────────────
  function showToast(message, isError = false) {
    // Remove existing toasts
    document.querySelectorAll('.gotp-toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'gotp-toast' + (isError ? ' gotp-toast-error' : '');
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'gotp-toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ── Utilities ─────────────────────────────
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Close dropdown on outside click ───────
  document.addEventListener('click', e => {
    if (activeDropdown && !activeDropdown.contains(e.target) && !e.target.closest('.gotp-shield')) {
      closeDropdown();
    }
  }, true);

  // Escape key closes dropdown/modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeDropdown();
      const modal = document.querySelector('.gotp-modal-overlay');
      if (modal) modal.remove();
    }
  });

  // ── Scan & Attach ─────────────────────────
  function scanAndAttach() {
    const fields = getInputFields();
    fields.forEach(el => attachShield(el));
  }

  // Initial scan
  loadCustomPersonas().then(() => {
    scanAndAttach();
  });

  // Watch for dynamically added inputs
  const domObserver = new MutationObserver(mutations => {
    let shouldScan = false;
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) { // Element node
          shouldScan = true;
          break;
        }
      }
      if (shouldScan) break;
    }
    if (shouldScan) {
      // Debounce
      clearTimeout(domObserver._debounce);
      domObserver._debounce = setTimeout(scanAndAttach, 200);
    }
  });

  domObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['contenteditable', 'role', 'type']
  });

  // Single delayed re-scan for late-loading SPAs, then stop
  setTimeout(scanAndAttach, 2000);
  setTimeout(scanAndAttach, 5000);

})();
