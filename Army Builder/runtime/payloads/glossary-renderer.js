(() => {
  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeGlossaryText(text) {
    return String(text || '')
      .replace(/\r\n/g, '\n')
      .replace(/\s+\./g, '.')
      .replace(/\s+,/g, ',')
      .replace(/\s+:/g, ':')
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
  }

  function formatGlossaryText(text) {
    const normalized = normalizeGlossaryText(text);
    if (!normalized) return '';
    return normalized
      .split(/\n\s*\n/)
      .map((part) => `<p>${escapeHtml(part).replace(/\n/g, '<br>')}</p>`)
      .join('');
  }

  function formatBuilderGlossaryText(text, extraClass) {
    const normalized = normalizeGlossaryText(text);
    if (!normalized) return '';
    const className = extraClass ? `glossary-block-text ${extraClass}` : 'glossary-block-text';
    return `<div class="${className}">` + formatGlossaryText(normalized) + '</div>';
  }

  function escapeRegExp(value) {
    return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function escapeInlineJson(value) {
    return escapeHtml(JSON.stringify(String(value || '')));
  }

  function normalizeLookupKey(value) {
    return String(value || '')
      .normalize('NFKD')
      .replace(/[\u2018\u2019]/g, "'")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');
  }

  function buildQuickRead(rawText) {
    const cleaned = normalizeGlossaryText(rawText)
      .replace(/\(Part[^)]*\)/gi, '')
      .replace(/\bEnemy Units\b/g, 'enemy units')
      .replace(/\bEnemy Unit\b/g, 'enemy unit')
      .replace(/\bLeading Model\b/g, 'leading model')
      .replace(/\bMission Markers\b/g, 'mission markers')
      .replace(/\bMission Marker\b/g, 'mission marker')
      .replace(/\bUnits\b/g, 'units')
      .replace(/\bUnit\b/g, 'unit')
      .replace(/\bTerrain\b/g, 'terrain')
      .replace(/\bModels\b/g, 'models')
      .replace(/\bModel\b/g, 'model');
    const firstSentence = cleaned.split(/(?<=[.!?])\s+/)[0] || cleaned;
    if (!firstSentence) return '';
    const simplified = firstSentence.replace(/\s{2,}/g, ' ').replace(/\s+\./g, '.').trim();
    if (/^The player whose turn it is/i.test(simplified)) return 'This means the player currently taking actions.';
    if (/^A physical Token used to track/i.test(simplified)) return 'This is the token that shows who currently has initiative.';
    if (/^A terrain piece/i.test(simplified)) return 'This term explains a terrain rule that affects movement, line of sight, or both.';
    if (/^This Unit cannot/i.test(simplified)) return 'In simple terms: this places a hard restriction on what the unit can do.';
    if (/^This weapon cannot/i.test(simplified)) return 'In simple terms: this weapon is restricted in when it can be used.';
    return simplified;
  }

  function buildExample(name, rawText) {
    const upperName = String(name || '').toUpperCase();
    const examples = {
      'ACCESS POINT': 'Example: if a model climbs through a doorway or ramp between levels, it is using an access point.',
      'ACTIVE PLAYER': 'Example: if it is your activation and you are choosing actions, you are the active player.',
      'ANTI-EVADE': 'Example: if a weapon has ANTI-EVADE (1), the target makes its Evade roll one step worse for that attack.',
      'BUFF': 'Example: if a unit gains BUFF Speed (2), it moves farther until the round ends.',
      'BULKY': 'Example: if the unit is already engaged, it cannot fire a Bulky ranged weapon.',
      'BURROWED': 'Example: if a Zerg unit gains Burrowed, it is now treated as having that status until something removes it.',
      'BURST FIRE': 'Example: if the target is inside the listed short range, the weapon gains extra rate of attack dice.',
      'CONCENTRATED FIRE': 'Example: even if the attack rolls huge damage, it can only remove up to the listed number of models.',
      'CRITICAL HIT': 'Example: if CRITICAL HIT (1) triggers, one die skips Armour and goes straight into Damage.',
      'DEBUFF': 'Example: if a unit suffers DEBUFF Hit (1), its attack rolls become one step worse until the round ends.',
      'DODGE': 'Example: if Surge would push 2 dice into Damage and the unit has DODGE (1), only 1 die gets through from that effect.',
      'ENTRY EDGE': 'Example: when a reserve unit deploys, it comes in from its assigned entry edge.',
      'FIGHTING RANK': 'Example: a model within 1 inch of an enemy is in the fighting rank and can strike in Combat.',
      'FIRST PLAYER MARKER': 'Example: when someone passes first in Movement or Assault, the marker can change hands for the next phase.',
      'FLYING': 'Example: a Flying unit can move over terrain, but it cannot control mission markers or fight in Combat.',
      'HEAL': 'Example: if a unit has 2 damage marked and resolves HEAL (1), it drops to 1 damage marked.',
      'HIDDEN': 'Example: if the attacker is farther than 4 inches away, it usually cannot target a Hidden unit.',
      'HITS': 'Example: HITS 2 means 2 dice go straight into the Armour Pool before armour rolls are made.',
      'IMPACT': 'Example: after a successful charge, each eligible model rolls its Impact dice before normal Combat attacks.'
    };
    if (examples[upperName]) return examples[upperName];
    if (/cannot Control or Contest Mission Markers/i.test(rawText)) {
      return 'Example: even if it is standing next to an objective, that unit still does not count for controlling it.';
    }
    if (/When this Unit is targeted by an attack/i.test(rawText)) {
      return 'Example: this takes effect right when the unit becomes the target of an attack.';
    }
    if (/When making a Ranged Attack/i.test(rawText)) {
      return 'Example: check this keyword at the moment the ranged attack is declared and resolved.';
    }
    if (/When this Unit completes a successful Charge/i.test(rawText)) {
      return 'Example: this only happens after the charge succeeds, not on a failed charge.';
    }
    if (/cannot/i.test(rawText)) {
      return 'Example: if a situation would break this restriction, the action is not allowed unless another rule overrides it.';
    }
    return '';
  }

  function normalizeEntry(entry) {
    const raw = normalizeGlossaryText(entry.raw_definition || entry.raw || entry.description || entry.text || '');
    const quickRead = normalizeGlossaryText(entry.plain_english || entry.quickRead || '');
    const example = normalizeGlossaryText(entry.example || '');
    return {
      id: entry.id || entry.slug || '',
      name: entry.name || '',
      type: entry.type || 'Keyword',
      raw,
      quickRead: quickRead || buildQuickRead(raw),
      example: example || buildExample(entry.name || '', raw),
      keywords: [entry.name || '', entry.id || '', entry.slug || ''].join(' ').toLowerCase()
    };
  }

  function normalizeEntries(entries) {
    return Array.isArray(entries) ? entries.map(normalizeEntry).filter((entry) => entry.name && entry.raw) : [];
  }

  function renderGlossarySection({ grid, badge, entries, emptyText }) {
    if (!grid) return [];
    const list = normalizeEntries(entries).sort((a, b) => a.name.localeCompare(b.name));
    if (badge) badge.textContent = `${list.length} Terms`;

    if (!list.length) {
      grid.innerHTML = `<div class="glossary-empty">${escapeHtml(emptyText || 'No glossary terms are available yet.')}</div>`;
      return list;
    }

    grid.innerHTML = list.map((entry) => {
      const quickRead = entry.quickRead ? (
        '<div class="glossary-block">' +
          '<span class="glossary-block-label">Common English</span>' +
          `<div class="glossary-block-text"><p>${escapeHtml(entry.quickRead)}</p></div>` +
        '</div>'
      ) : '';
      const example = entry.example ? (
        '<div class="glossary-block">' +
          '<span class="glossary-block-label">Example</span>' +
          `<div class="glossary-block-text glossary-example"><p>${escapeHtml(entry.example)}</p></div>` +
        '</div>'
      ) : '';

      return (
        `<div class="glossary-card" data-keywords="${escapeHtml(`${entry.keywords} ${entry.raw}`.toLowerCase())}">` +
          '<div class="glossary-card-head">' +
            `<div class="glossary-card-name">${escapeHtml(entry.name)}</div>` +
            `<div class="glossary-card-type">${escapeHtml(entry.type)}</div>` +
          '</div>' +
          '<div class="glossary-card-body">' +
            '<div class="glossary-block raw">' +
              '<span class="glossary-block-label">RAW Definition</span>' +
              `<div class="glossary-block-text">${formatGlossaryText(entry.raw)}</div>` +
            '</div>' +
            quickRead +
            example +
          '</div>' +
        '</div>'
      );
    }).join('');

    return list;
  }

  function attachGlossarySearch({ input, clearBtn, noResults, grid }) {
    function runGlossarySearch(query) {
      const trimmed = String(query || '').toLowerCase().trim();
      if (clearBtn) clearBtn.classList.toggle('visible', trimmed.length > 0);

      let hasResults = false;
      grid.querySelectorAll('.glossary-card').forEach((card) => {
        const cardKeywords = card.dataset.keywords || '';
        const cardText = card.textContent.toLowerCase();
        const matches = trimmed.length === 0 || cardText.includes(trimmed) || cardKeywords.includes(trimmed);
        card.style.display = matches ? '' : 'none';
        if (matches) hasResults = true;
      });

      if (noResults) noResults.style.display = hasResults ? 'none' : 'block';
    }

    if (input) input.addEventListener('input', (event) => runGlossarySearch(event.target.value));
    if (clearBtn && input) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        runGlossarySearch('');
        input.focus();
      });
    }

    return runGlossarySearch;
  }

  function createBuilderGlossary({
    glossaryReference = [],
    keywords = {},
    tags = {},
    openFunctionName = 'showKeyword',
    closeFunctionName = 'closeKeywordModal'
  } = {}) {
    const sharedEntries = Array.isArray(glossaryReference) ? glossaryReference : [];
    const keywordEntries = keywords || {};
    const tagEntries = tags || {};
    const terms = Array.from(new Set([
      ...sharedEntries.map((entry) => entry?.name).filter(Boolean),
      ...Object.keys(tagEntries),
      ...Object.keys(keywordEntries)
    ])).sort((a, b) => b.length - a.length);
    const patterns = terms.map((keyword) => ({
      keyword,
      pattern: new RegExp(`\\b${escapeRegExp(keyword)}(?:\\s*\\([^)]+\\))?`, 'gi')
    }));

    function getEntry(keyword) {
      if (!keyword) return null;
      const normalized = normalizeLookupKey(keyword);
      const sharedEntry = sharedEntries.find((entry) =>
        normalizeLookupKey(entry?.name) === normalized ||
        normalizeLookupKey(entry?.id) === normalized ||
        normalizeLookupKey(entry?.slug) === normalized
      );
      if (sharedEntry) return normalizeEntry({ ...sharedEntry, name: sharedEntry.name || keyword });

      const exactKeyword = keywordEntries[keyword];
      if (exactKeyword) {
        const raw = exactKeyword.raw || exactKeyword.description || '';
        return {
          name: keyword,
          type: exactKeyword.type || 'Keyword',
          raw: normalizeGlossaryText(raw),
          quickRead: normalizeGlossaryText(exactKeyword.quickRead || buildQuickRead(raw)),
          example: normalizeGlossaryText(exactKeyword.example || buildExample(keyword, raw))
        };
      }

      const exactTag = tagEntries[keyword];
      if (exactTag) {
        const raw = exactTag.raw || exactTag.description || '';
        return {
          name: keyword,
          type: exactTag.type || 'Tag',
          raw: normalizeGlossaryText(raw),
          quickRead: normalizeGlossaryText(exactTag.quickRead || buildQuickRead(raw)),
          example: normalizeGlossaryText(exactTag.example || buildExample(keyword, raw))
        };
      }

      const keywordMatch = Object.keys(keywordEntries).find((name) => normalizeLookupKey(name) === normalized);
      if (keywordMatch) return getEntry(keywordMatch);
      const tagMatch = Object.keys(tagEntries).find((name) => normalizeLookupKey(name) === normalized);
      if (tagMatch) return getEntry(tagMatch);
      return null;
    }

    function renderModalBody(entry) {
      if (!entry) return '';
      let html = '<div class="keyword-detail">';
      if (entry.raw) html += '<div class="glossary-block raw"><span class="glossary-block-label">RAW Definition</span>' + formatBuilderGlossaryText(entry.raw) + '</div>';
      if (entry.quickRead) html += '<div class="glossary-block"><span class="glossary-block-label">Common English</span>' + formatBuilderGlossaryText(entry.quickRead) + '</div>';
      if (entry.example) html += '<div class="glossary-block"><span class="glossary-block-label">Example</span>' + formatBuilderGlossaryText(entry.example, 'glossary-example') + '</div>';
      html += '</div>';
      return html;
    }

    function renderModal(keyword) {
      const entry = getEntry(keyword);
      if (!entry) return '';
      return (
        `<div class="modal-overlay" onclick="${closeFunctionName}()">` +
          '<div class="modal" onclick="event.stopPropagation()">' +
            '<div class="modal-header">' +
              '<div>' +
                `<div class="modal-title">${escapeHtml(entry.name)}</div>` +
                `<div class="modal-type">${escapeHtml(entry.type)}</div>` +
              '</div>' +
              `<button class="modal-close" onclick="${closeFunctionName}()">&#215;</button>` +
            '</div>' +
            `<div class="modal-body">${renderModalBody(entry)}</div>` +
          '</div>' +
        '</div>'
      );
    }

    function highlight(text) {
      let result = String(text ?? '');
      patterns.forEach(({ keyword, pattern }) => {
        result = result.replace(pattern, (match) =>
          `<span class="keyword" onclick="${openFunctionName}(${escapeInlineJson(keyword)})">${match}</span>`
        );
      });
      return result;
    }

    return {
      getEntry,
      highlight,
      renderModal,
      renderModalBody
    };
  }

  window.__glossaryRenderer = {
    escapeHtml,
    normalizeGlossaryText,
    normalizeLookupKey,
    normalizeEntries,
    renderGlossarySection,
    attachGlossarySearch,
    createBuilderGlossary
  };
})();
