/* =============================================
   Regex Tester — app.js
   ============================================= */

(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);

  // DOM refs
  const regexInput    = $('regex-input');
  const regexFlags    = $('regex-flags');
  const testString    = $('test-string');
  const highlightLayer = $('highlight-layer');
  const matchCount    = $('match-count');
  const matchList     = $('match-list');
  const replaceInput  = $('replace-input');
  const replaceResult = $('replace-result');
  const errorBar      = $('error-bar');
  const errorText     = $('error-text');
  const statusBadge   = $('status-badge');
  const testMeta      = $('test-meta');
  const toastEl       = $('toast');
  const btnTheme      = $('btn-theme');
  const btnClear      = $('btn-clear');
  const btnPaste      = $('btn-paste');
  const btnSample     = $('btn-sample');
  const cheatsheetBody = $('cheatsheet-body');
  const btnCheatsheet  = $('btn-cheatsheet-toggle');

  // ── Theme ──
  function initTheme() {
    const saved = localStorage.getItem('regex-theme');
    const pref  = saved || 'light';
    document.documentElement.setAttribute('data-theme', pref);
  }
  initTheme();

  btnTheme.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('regex-theme', next);
  });

  // ── Toast ──
  let toastTimer = null;
  function showToast(msg, duration = 2200) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), duration);
  }

  // ── Flag Toggles ──
  const flagBtns = document.querySelectorAll('.flag-btn');
  flagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      syncFlags();
      runMatch();
    });
  });

  function syncFlags() {
    let flags = '';
    flagBtns.forEach(btn => {
      if (btn.classList.contains('active')) {
        flags += btn.dataset.flag;
      }
    });
    regexFlags.value = flags;
  }

  regexFlags.addEventListener('input', () => {
    const val = regexFlags.value;
    flagBtns.forEach(btn => {
      if (val.includes(btn.dataset.flag)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    runMatch();
  });

  // ── Meta ──
  function updateMeta() {
    const len = testString.value.length;
    testMeta.textContent = `${len.toLocaleString()} character${len !== 1 ? 's' : ''}`;
  }

  // ── Sync Scroll ──
  testString.addEventListener('scroll', () => {
    highlightLayer.scrollTop = testString.scrollTop;
    highlightLayer.scrollLeft = testString.scrollLeft;
  });

  // ── Escape HTML ──
  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ── Core: Run Match ──
  let debounceTimer = null;
  function scheduleMatch() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runMatch, 80);
  }

  function runMatch() {
    const pattern = regexInput.value;
    const flags   = regexFlags.value;
    const text    = testString.value;

    updateMeta();

    // Reset error
    errorBar.hidden = true;

    if (!pattern) {
      highlightLayer.innerHTML = escapeHtml(text);
      matchCount.textContent = '0 matches';
      matchList.innerHTML = '<div class="match-empty"><span class="match-empty__icon">🔍</span><p>Enter a regex and test string to see matches</p></div>';
      replaceResult.textContent = text;
      statusBadge.textContent = 'Ready';
      return;
    }

    // Try to compile regex
    let re;
    try {
      re = new RegExp(pattern, flags);
    } catch (e) {
      errorBar.hidden = false;
      errorText.textContent = e.message;
      highlightLayer.innerHTML = escapeHtml(text);
      matchCount.textContent = 'Error';
      matchList.innerHTML = '<div class="match-empty"><span class="match-empty__icon">⚠️</span><p>Invalid regex pattern</p></div>';
      statusBadge.textContent = 'Error';
      return;
    }

    // Find all matches
    const matches = [];
    let match;

    if (flags.includes('g')) {
      while ((match = re.exec(text)) !== null) {
        matches.push({
          value: match[0],
          index: match.index,
          end: match.index + match[0].length,
          groups: match.slice(1),
          namedGroups: match.groups || null
        });
        // Prevent infinite loops on zero-length matches
        if (match[0].length === 0) re.lastIndex++;
        // Safety limit
        if (matches.length > 5000) break;
      }
    } else {
      match = re.exec(text);
      if (match) {
        matches.push({
          value: match[0],
          index: match.index,
          end: match.index + match[0].length,
          groups: match.slice(1),
          namedGroups: match.groups || null
        });
      }
    }

    // Update count
    matchCount.textContent = `${matches.length} match${matches.length !== 1 ? 'es' : ''}`;
    statusBadge.textContent = matches.length > 0 ? `${matches.length} Match${matches.length !== 1 ? 'es' : ''}` : 'No Match';

    // Build highlighted text
    let highlighted = '';
    let lastIdx = 0;
    matches.forEach((m, i) => {
      highlighted += escapeHtml(text.slice(lastIdx, m.index));
      const colorClass = `hl-match-${i % 4}`;
      highlighted += `<mark class="hl-match ${colorClass}">${escapeHtml(m.value)}</mark>`;
      lastIdx = m.end;
    });
    highlighted += escapeHtml(text.slice(lastIdx));
    highlightLayer.innerHTML = highlighted;

    // Build match list
    if (matches.length === 0) {
      matchList.innerHTML = '<div class="match-empty"><span class="match-empty__icon">🔍</span><p>No matches found</p></div>';
    } else {
      let listHtml = '';
      matches.forEach((m, i) => {
        if (i >= 100) return; // Limit display
        listHtml += `<div class="match-item">`;
        listHtml += `<div class="match-item__header">`;
        listHtml += `<span class="match-item__label">Match ${i + 1}</span>`;
        listHtml += `<span class="match-item__index">idx: ${m.index}–${m.end}</span>`;
        listHtml += `</div>`;
        listHtml += `<div class="match-item__value">${escapeHtml(m.value)}</div>`;

        if (m.groups.length > 0) {
          listHtml += `<div class="match-item__groups">`;
          m.groups.forEach((g, gi) => {
            const name = m.namedGroups
              ? Object.entries(m.namedGroups).find(([, v]) => v === g)?.[0]
              : null;
            const label = name ? `${name}` : `Group ${gi + 1}`;
            listHtml += `<div class="match-group">`;
            listHtml += `<span class="match-group__label">${label}:</span>`;
            listHtml += `<span class="match-group__value">${g !== undefined ? escapeHtml(g) : '<em>undefined</em>'}</span>`;
            listHtml += `</div>`;
          });
          listHtml += `</div>`;
        }
        listHtml += `</div>`;
      });
      if (matches.length > 100) {
        listHtml += `<div class="match-empty"><p>… and ${matches.length - 100} more matches</p></div>`;
      }
      matchList.innerHTML = listHtml;
    }

    // Replace result
    try {
      const replaceVal = replaceInput.value;
      if (replaceVal) {
        replaceResult.textContent = text.replace(re, replaceVal);
      } else {
        replaceResult.textContent = '';
      }
    } catch (e) {
      replaceResult.textContent = 'Replace error: ' + e.message;
    }
  }

  // ── Event listeners ──
  regexInput.addEventListener('input', scheduleMatch);
  testString.addEventListener('input', scheduleMatch);
  replaceInput.addEventListener('input', scheduleMatch);

  // ── Paste ──
  btnPaste.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      testString.value = text;
      runMatch();
      showToast('📋 Pasted from clipboard');
    } catch {
      showToast('⚠️ Clipboard access denied');
    }
  });

  // ── Sample ──
  btnSample.addEventListener('click', () => {
    regexInput.value = '(\\w+)@(\\w+\\.\\w+)';
    regexFlags.value = 'gm';
    // Sync flag buttons
    flagBtns.forEach(btn => {
      btn.classList.toggle('active', 'gm'.includes(btn.dataset.flag));
    });
    testString.value = `Contact us at hello@example.com for support.
Send invoices to billing@company.org or admin@test.co.
Personal: john.doe@gmail.com`;
    runMatch();
    showToast('📝 Sample loaded');
  });

  // ── Clear ──
  btnClear.addEventListener('click', () => {
    regexInput.value = '';
    testString.value = '';
    replaceInput.value = '';
    runMatch();
    showToast('🗑️ Cleared');
  });

  // ── Cheatsheet toggle ──
  btnCheatsheet.addEventListener('click', () => {
    cheatsheetBody.classList.toggle('collapsed');
    btnCheatsheet.classList.toggle('rotated');
  });

  // ── Cheatsheet code click to insert ──
  cheatsheetBody.addEventListener('click', (e) => {
    if (e.target.tagName === 'CODE') {
      const val = e.target.textContent;
      const pos = regexInput.selectionStart;
      const before = regexInput.value.slice(0, pos);
      const after = regexInput.value.slice(pos);
      regexInput.value = before + val + after;
      regexInput.focus();
      regexInput.setSelectionRange(pos + val.length, pos + val.length);
      runMatch();
      showToast(`Inserted: ${val}`);
    }
  });

  // ── Preset patterns ──
  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      regexInput.value = chip.dataset.pattern;
      if (chip.dataset.sample) {
        testString.value = chip.dataset.sample;
      }
      regexFlags.value = 'gm';
      flagBtns.forEach(btn => {
        btn.classList.toggle('active', 'gm'.includes(btn.dataset.flag));
      });
      runMatch();
      showToast(`🎯 Loaded: ${chip.textContent}`);
    });
  });

  // ── Initial run ──
  runMatch();

})();
