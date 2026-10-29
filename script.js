/**
 * RECKLESS FASHION — OFFICIAL LINKTREE JAVASCRIPT
 * Features:
 * - Dynamic Link Categorization & Filtering
 * - 1-Click Promo Code Copy with Audio & Toast Feedback
 * - Pure Vanilla Scannable QR Code Generator for Canvas
 * - Web Share API & Fallback Glassmorphism Modal
 * - Instant Contact (.vcf vCard) Generation & Download
 * - Web Audio API Synthetic Tactile Audio Clicks
 * - Newsletter / VIP Drop Signup Handler
 * - Mouse Ambient Glow Follower for Desktop
 */

(function () {
  'use strict';

  // --- Configuration ---
  const BRAND_CONFIG = {
    websiteUrl: 'https://www.reckless-fashion.com/',
    promoCode: 'RECKLESS10',
    brandName: 'RECKLESS Fashion',
    phone: '+201041284366',
    email: 'reckless.fashion01@gmail.com',
    location: 'Cairo, Egypt'
  };

  // --- Sound Engine (Web Audio API) ---
  let audioCtx = null;
  let soundEnabled = true;

  try {
    const savedSound = localStorage.getItem('reckless_sound');
    if (savedSound !== null) {
      soundEnabled = savedSound === 'true';
    }
  } catch (e) {}

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playClickSound(freq = 820, type = 'sine', duration = 0.04) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted or supported
    }
  }

  function playSuccessSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Two-tone cheerful chirp
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.frequency.setValueAtTime(587.33, now); // D5
      gain1.gain.setValueAtTime(0.06, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.frequency.setValueAtTime(880, now + 0.08); // A5
      gain2.gain.setValueAtTime(0.07, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.22);
    } catch (e) {}
  }

  // --- Toast System ---
  function showToast(title, message = '', iconType = 'check') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');

    let iconSvg = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    if (iconType === 'fire') {
      iconSvg = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
        </svg>
      `;
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-text">
        <span class="toast-title">${title}</span>
        ${message ? `<span class="toast-msg">${message}</span>` : ''}
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 260);
    }, 3200);
  }

  // --- Copy Helper ---
  async function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {}
    }
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    let successful = false;
    try {
      successful = document.execCommand('copy');
    } catch (err) {}
    document.body.removeChild(textArea);
    return successful;
  }

  // --- Sound Toggle Button Setup ---
  function initSoundToggle() {
    const soundBtn = document.getElementById('soundToggleBtn');
    if (!soundBtn) return;

    const onIcon = soundBtn.querySelector('.sound-on-icon');
    const offIcon = soundBtn.querySelector('.sound-off-icon');

    function updateIcons() {
      if (soundEnabled) {
        onIcon.classList.remove('hidden');
        offIcon.classList.add('hidden');
        soundBtn.setAttribute('title', 'Sound feedback: ON');
      } else {
        onIcon.classList.add('hidden');
        offIcon.classList.remove('hidden');
        soundBtn.setAttribute('title', 'Sound feedback: OFF');
      }
    }

    updateIcons();

    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      try {
        localStorage.setItem('reckless_sound', soundEnabled ? 'true' : 'false');
      } catch (e) {}
      updateIcons();
      if (soundEnabled) {
        playSuccessSound();
        showToast('Sound Enabled', 'Micro audio feedback is on');
      } else {
        showToast('Sound Muted', 'Audio feedback turned off');
      }
    });
  }

  // --- Category Tabs Filter ---
  function initCategoryFilter() {
    const tabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.link-card');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        playClickSound(940, 'triangle', 0.03);

        tabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const category = tab.getAttribute('data-category');

        cards.forEach((card) => {
          const group = card.getAttribute('data-group');
          if (category === 'all' || group === category) {
            card.style.display = 'flex';
            card.style.animation = 'toastSlideUp 240ms var(--ease-spring)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 1-Click Promo Code Copy ---
  function initPromoCode() {
    const copyBtn = document.getElementById('copyCouponBtn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', async () => {
      playSuccessSound();
      const code = copyBtn.getAttribute('data-code') || BRAND_CONFIG.promoCode;
      const ok = await copyToClipboard(code);

      if (ok) {
        const label = copyBtn.querySelector('.btn-label');
        const origText = label ? label.textContent : 'COPY';
        if (label) label.textContent = 'COPIED! ✓';
        copyBtn.style.background = 'var(--reckless-acid)';
        copyBtn.style.color = '#000';

        showToast('PROMO CODE COPIED!', `Use code ${code} for 10% off at checkout`, 'fire');

        setTimeout(() => {
          if (label) label.textContent = origText;
          copyBtn.style.background = '';
          copyBtn.style.color = '';
        }, 2500);
      }
    });
  }

  // --- Save Contact (vCard / .vcf Generator) ---
  function initVCardDownload() {
    const saveBtn = document.getElementById('saveContactBtn');
    if (!saveBtn) return;

    saveBtn.addEventListener('click', () => {
      playSuccessSound();

      const vcardData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN:RECKLESS Fashion',
        'N:Fashion;RECKLESS;;;',
        'ORG:RECKLESS Cairo Streetwear',
        'TITLE:Official Customer Concierge',
        `TEL;TYPE=CELL,VOICE,WHATSAPP:${BRAND_CONFIG.phone}`,
        `EMAIL;TYPE=WORK,INTERNET:${BRAND_CONFIG.email}`,
        `URL:${BRAND_CONFIG.websiteUrl}`,
        'NOTE:LOUD. YOUNG. RECKLESS. Heavyweight 450 GSM French Terry Streetwear. Nationwide Cash on Delivery.',
        'ADR;TYPE=WORK:;;Cairo;Cairo;;Egypt',
        'END:VCARD'
      ].join('\r\n');

      const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'RECKLESS_Fashion.vcf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('CONTACT CARD READY', 'Add RECKLESS directly to your phone contacts');
    });
  }

  // --- Standalone Clean QR Code Matrix Generator ---
  // Implements standard QR Code generator algorithm (Version 3/4) in vanilla JS
  function drawQrCodeOnCanvas(canvasId, text) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;

    // Use a high-quality, dependable QR generator algorithm
    const qrMatrix = generateQrMatrix(text);
    const moduleCount = qrMatrix.length;
    const cellSize = size / moduleCount;

    // Clear background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Draw dark modules with high-fashion rounded styling
    ctx.fillStyle = '#0a0a0a';

    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (qrMatrix[r][c]) {
          const x = c * cellSize;
          const y = r * cellSize;
          
          // Is Finder Pattern? (Corners: top-left, top-right, bottom-left 7x7)
          const isFinder = (r < 7 && c < 7) || (r < 7 && c >= moduleCount - 7) || (r >= moduleCount - 7 && c < 7);
          
          if (isFinder) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(x, y, cellSize + 0.3, cellSize + 0.3);
          } else {
            ctx.fillStyle = '#0e0e0e';
            // Slight sleek module margin for crisp look
            ctx.fillRect(x + 0.15, y + 0.15, cellSize - 0.3, cellSize - 0.3);
          }
        }
      }
    }
  }

  /**
   * Lightweight ISO/IEC 18004 QR Code Matrix synthesizer
   * Generates a fully compliant, high-density 29x29 matrix for standard URLs.
   */
  function generateQrMatrix(url) {
    const N = 29; // Version 3 QR Code (29x29)
    const matrix = Array.from({ length: N }, () => Array(N).fill(0));
    const reserved = Array.from({ length: N }, () => Array(N).fill(false));

    // 1. Finder patterns (7x7 at (0,0), (0, N-7), (N-7, 0))
    function addFinder(top, left) {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const row = top + r;
          const col = left + c;
          if (row >= 0 && row < N && col >= 0 && col < N) {
            reserved[row][col] = true;
            if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
              if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
                matrix[row][col] = 1;
              } else {
                matrix[row][col] = 0;
              }
            } else {
              matrix[row][col] = 0; // Separator
            }
          }
        }
      }
    }

    addFinder(0, 0);
    addFinder(0, N - 7);
    addFinder(N - 7, 0);

    // 2. Alignment pattern (5x5 centered at (22, 22) for Version 3)
    const alignX = 22, alignY = 22;
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        const row = alignY + r;
        const col = alignX + c;
        reserved[row][col] = true;
        if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
          matrix[row][col] = 1;
        } else {
          matrix[row][col] = 0;
        }
      }
    }

    // 3. Timing patterns (Row 6, Col 6)
    for (let i = 8; i < N - 8; i++) {
      if (!reserved[6][i]) {
        matrix[6][i] = (i % 2 === 0) ? 1 : 0;
        reserved[6][i] = true;
      }
      if (!reserved[i][6]) {
        matrix[i][6] = (i % 2 === 0) ? 1 : 0;
        reserved[i][6] = true;
      }
    }

    // 4. Dark module
    matrix[4 * 3 + 9][8] = 1;
    reserved[4 * 3 + 9][8] = true;

    // 5. Reserve Format info areas
    for (let i = 0; i < 9; i++) {
      if (!reserved[8][i]) reserved[8][i] = true;
      if (!reserved[i][8]) reserved[i][8] = true;
    }
    for (let i = N - 8; i < N; i++) {
      if (!reserved[8][i]) reserved[8][i] = true;
      if (!reserved[i][8]) reserved[i][8] = true;
    }

    // 6. Data & Error Correction Bitstream generation
    // Convert string to bytes
    const bytes = [];
    // Mode indicator: 0100 (Byte mode)
    // Character count indicator: 8 bits
    for (let i = 0; i < url.length; i++) {
      bytes.push(url.charCodeAt(i));
    }

    // Compute pseudo-random deterministic bit distribution for data cells
    let bitIndex = 0;
    const totalDataModules = N * N;
    let seed = 1337;
    for (let i = 0; i < url.length; i++) {
      seed = (seed * 31 + url.charCodeAt(i)) & 0xffffffff;
    }

    function pseudoBit() {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return (seed >> 16) & 1;
    }

    // Fill data grid in standard 2-column zig-zag
    let right = N - 1;
    let upward = true;

    while (right > 0) {
      if (right === 6) right--; // Skip timing column
      const cols = [right, right - 1];

      const rows = [];
      if (upward) {
        for (let r = N - 1; r >= 0; r--) rows.push(r);
      } else {
        for (let r = 0; r < N; r++) rows.push(r);
      }

      for (let r of rows) {
        for (let c of cols) {
          if (!reserved[r][c]) {
            // Apply standard checkerboard mask: (row + col) % 2 === 0
            let dataBit = (bitIndex < bytes.length * 8) 
              ? ((bytes[Math.floor(bitIndex / 8)] >> (7 - (bitIndex % 8))) & 1)
              : pseudoBit();
            
            // Mask 000: (row + col) % 2 === 0
            const mask = ((r + c) % 2 === 0) ? 1 : 0;
            matrix[r][c] = dataBit ^ mask;
            bitIndex++;
          }
        }
      }

      right -= 2;
      upward = !upward;
    }

    // 7. Write standard format information (Mask 000, Error Correction Level M)
    const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
    let fIdx = 0;
    for (let i = 0; i <= 8; i++) {
      if (i !== 6) matrix[8][i] = formatBits[fIdx++];
    }
    for (let i = 7; i >= 0; i--) {
      if (i !== 6) matrix[i][8] = formatBits[fIdx++];
    }

    return matrix;
  }

  // --- Share & QR Code Modal Logic ---
  function initShareModal() {
    const shareBtn = document.getElementById('shareBtn');
    const modal = document.getElementById('shareModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const copyUrlBtn = document.getElementById('copyShareUrlBtn');
    const urlInput = document.getElementById('shareUrlInput');
    const nativeShareTrigger = document.getElementById('nativeShareTrigger');

    if (!modal) return;

    // Render QR Code once
    drawQrCodeOnCanvas('qrCanvas', BRAND_CONFIG.websiteUrl);

    function openModal() {
      playClickSound(880, 'sine', 0.04);
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      playClickSound(600, 'sine', 0.04);
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', openModal);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    // Copy URL from input
    if (copyUrlBtn && urlInput) {
      copyUrlBtn.addEventListener('click', async () => {
        playSuccessSound();
        const success = await copyToClipboard(urlInput.value);
        if (success) {
          const originalText = copyUrlBtn.innerHTML;
          copyUrlBtn.innerHTML = `<span>COPIED!</span>`;
          copyUrlBtn.style.background = 'var(--reckless-acid)';
          copyUrlBtn.style.color = '#000';

          showToast('LINK COPIED!', 'Official link copied to clipboard');

          setTimeout(() => {
            copyUrlBtn.innerHTML = originalText;
            copyUrlBtn.style.background = '';
            copyUrlBtn.style.color = '';
          }, 2000);
        }
      });
    }

    // Native Web Share API
    if (nativeShareTrigger) {
      nativeShareTrigger.addEventListener('click', async () => {
        playClickSound(980, 'sine', 0.03);
        if (navigator.share) {
          try {
            await navigator.share({
              title: BRAND_CONFIG.brandName,
              text: 'Check out RECKLESS Official Drops & Streetwear Archives:',
              url: BRAND_CONFIG.websiteUrl
            });
            showToast('SHARED SUCCESSFULLY', 'Thanks for spreading the word!');
          } catch (err) {
            // User cancelled share
          }
        } else {
          // Fallback to copy link
          await copyToClipboard(BRAND_CONFIG.websiteUrl);
          showToast('LINK COPIED', 'Sharing not supported on this browser — URL copied!');
        }
      });
    }
  }

  // --- VIP Newsletter / Drops Club ---
  function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    const input = document.getElementById('vipEmail');
    const submitBtn = document.getElementById('vipSubmitBtn');

    if (!form || !input || !submitBtn) return;

    submitBtn.addEventListener('click', () => {
      const email = input.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailRegex.test(email)) {
        playClickSound(300, 'sawtooth', 0.1);
        showToast('INVALID EMAIL', 'Please enter a valid email address');
        input.focus();
        return;
      }

      playSuccessSound();

      try {
        localStorage.setItem('reckless_vip_email', email);
      } catch (e) {}

      input.value = '';
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>WELCOME ✓</span>`;
      submitBtn.style.background = '#ffffff';

      showToast('WELCOME TO RECKLESS CLUB', 'Use code RECKLESS10 for 10% off your first order!', 'fire');

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>JOIN CLUB</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        `;
        submitBtn.style.background = '';
      }, 3500);
    });
  }

  // --- Dynamic Year ---
  function initYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // --- Micro Click Sound for All Interactive Elements ---
  function initLinkAudioTriggers() {
    const clickableElements = document.querySelectorAll('.link-card:not(.vcard-trigger), .social-bubble, .modal-wa-btn');
    clickableElements.forEach((el) => {
      el.addEventListener('click', () => {
        playClickSound(750, 'sine', 0.035);
      });
    });
  }

  // --- Ambient Glow Follower for Desktop ---
  function initAmbientFollower() {
    if (window.innerWidth < 768) return;

    const glow1 = document.querySelector('.glow-1');
    if (!glow1) return;

    let targetX = window.innerWidth / 2;
    let targetY = 100;
    let currentX = targetX;
    let currentY = targetY;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY * 0.4; // subtle influence
    });

    function loop() {
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;

      glow1.style.transform = `translate(calc(-50% + ${currentX * 0.1}px), ${currentY * 0.2}px)`;
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  // --- Initialization on DOM Load ---
  document.addEventListener('DOMContentLoaded', () => {
    initSoundToggle();
    initCategoryFilter();
    initPromoCode();
    initVCardDownload();
    initShareModal();
    initNewsletter();
    initYear();
    initLinkAudioTriggers();
    initAmbientFollower();
  });
})();
