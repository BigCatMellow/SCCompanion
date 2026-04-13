const STORE = 'sc_tmg_app_v2';

const $ = (id) => document.getElementById(id);
const esc = (str = '') => String(str).replace(/[&<>"']/g, (m) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[m]));

const savedState = JSON.parse(localStorage.getItem(STORE) || '{}');
const FACTION_STORAGE = {
  zerg: { label: 'Zerg', key: 'sc-tmg-zerg-v4' },
  protoss: { label: 'Protoss', key: 'sc-tmg-protoss-v1' },
  terran: { label: 'Terran', key: 'sc-tmg-terran-v1' }
};
const ENGAGEMENT_SCALES = [
  { id: 'skirmish', name: 'Skirmish', type: 'Skirmish', table: '36" x 36"' },
  { id: 'standard', name: 'Standard', type: 'Standard', table: '36" x 54"' },
  { id: 'grand', name: 'Grand', type: 'Standard', table: '36" x 72"' }
];

const state = {
  view: ['play', 'systems'].includes(savedState.view) ? savedState.view : 'play',
  phase: Number(savedState.phase || 0),
  action: savedState.action || '',
  drawerTarget: savedState.drawerTarget || '',
  bookmarks: savedState.bookmarks || [],
  done: savedState.done || {},
  search: savedState.search || '',
  modal: savedState.modal || '',
  libraryPart: savedState.libraryPart || '',
  round: Number(savedState.round || 1),
  vp: savedState.vp || { p1: 0, p2: 0 },
  players: savedState.players || { p1: 'Player 1', p2: 'Player 2' },
  firstPlayer: savedState.firstPlayer || 'p1',
  activePlayer: savedState.activePlayer || 'p1',
  passed: savedState.passed || { p1: false, p2: false },
  armies: savedState.armies || { p1: null, p2: null },
  armyOpen: savedState.armyOpen || { p1: true, p2: true },
  armyView: savedState.armyView || 'p1',
  armyFilter: savedState.armyFilter || 'all',
  unitOpen: savedState.unitOpen || {},
  scenario: savedState.scenario || { scaleId: '', missionId: '', mapId: '', sides: { p1: 'blue', p2: 'red' }, markers: {} },
  unitStates: savedState.unitStates || { p1: {}, p2: {} },
  log: savedState.log || []
};

let APP = null;

const HOME = $('view-home');
const PLAY = $('view-play');
const SYSTEMS = $('view-systems');
const REFERENCE = $('view-reference');
const SEARCH = $('view-search');
const searchInput = $('globalSearch');
const searchResults = $('searchResults');
const searchCount = $('searchResultCount');

function save() {
  localStorage.setItem(STORE, JSON.stringify(state));
}

function addLog(text) {
  const phase = currentPhase();
  state.log.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    round: state.round,
    phaseIndex: state.phase,
    phase: phaseTone(phase.phaseClass).name,
    at: new Date().toISOString(),
    time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  });
}

function clearUnitActivations() {
  Object.values(state.unitStates || {}).forEach((units) => {
    Object.values(units || {}).forEach((status) => {
      status.activated = false;
    });
  });
}

function resetPasses() {
  state.passed = { p1: false, p2: false };
  state.activePlayer = state.firstPlayer;
  clearUnitActivations();
}

function otherPlayer(id = state.activePlayer) {
  return id === 'p1' ? 'p2' : 'p1';
}

function isAlternatingPhase(index = state.phase) {
  return index < 3;
}

function chooseRoundInitiative() {
  const p1 = state.vp.p1 || 0;
  const p2 = state.vp.p2 || 0;
  if (p1 < p2) return 'p1';
  if (p2 < p1) return 'p2';
  return state.firstPlayer;
}

function advancePhase(reason = 'Advanced phase.') {
  const oldPhase = currentPhase();
  addLog(reason);
  if (state.phase < phases().length - 1) {
    state.phase += 1;
    state.action = currentAction()?.title || '';
    resetPasses();
    addLog(`${phaseTone(oldPhase.phaseClass).name} complete. ${phaseTone(currentPhase().phaseClass).name} begins. ${playerName(state.firstPlayer)} has the first player marker.`);
    return;
  }

  if (state.round >= 5) {
    addLog('Final scoring phase complete. Proceed to final score.');
    resetPasses();
    return;
  }

  state.firstPlayer = chooseRoundInitiative();
  state.round += 1;
  state.phase = 0;
  state.action = currentAction()?.title || '';
  resetPasses();
  addLog(`Round ${state.round} begins. ${playerName(state.firstPlayer)} has initiative.`);
}

function passActivePlayer() {
  if (!isAlternatingPhase()) {
    advancePhase(`${phaseTone(currentPhase().phaseClass).name} complete.`);
    return;
  }
  const id = state.activePlayer;
  const opponent = otherPlayer(id);
  const wasFirstPass = !state.passed.p1 && !state.passed.p2;
  state.passed[id] = true;
  if (wasFirstPass) {
    state.firstPlayer = id;
    addLog(`${playerName(id)} passed first and claimed the first player marker for the next phase.`);
  } else {
    addLog(`${playerName(id)} passed.`);
  }

  if (state.passed.p1 && state.passed.p2) {
    advancePhase('Both players have passed.');
    return;
  }

  state.activePlayer = state.passed[opponent] ? id : opponent;
}

function completeActiveAction() {
  const action = currentAction();
  if (action) state.done[actionKey(action)] = true;
  addLog(`${playerName(state.activePlayer)} resolved ${action ? action.title : 'an action'}.`);
  const opponent = otherPlayer();
  if (!state.passed[opponent]) state.activePlayer = opponent;
}

function phaseTone(phaseClass) {
  return {
    phase1: { n: 'I', name: 'Movement', verb: 'Position', accent: 'movement' },
    phase2: { n: 'II', name: 'Assault', verb: 'Commit', accent: 'assault' },
    phase3: { n: 'III', name: 'Combat', verb: 'Resolve', accent: 'combat' },
    phase4: { n: 'IV', name: 'Scoring', verb: 'Score', accent: 'scoring' }
  }[phaseClass] || { n: '-', name: 'Phase', verb: 'Act', accent: 'system' };
}

function phases() {
  return APP.playGuide.phases || [];
}

function currentPhase() {
  const list = phases();
  state.phase = Math.max(0, Math.min(state.phase, list.length - 1));
  return list[state.phase];
}

function currentAction() {
  const phase = currentPhase();
  const actions = phase.procedures || [];
  return actions.find((a) => a.title === state.action) || actions[0] || null;
}

function actionKey(action) {
  return action?.target || action?.title || '';
}

function plainRows(rows) {
  return (rows || []).map((row) => row.plain || '').join(' ');
}

function findPart(id) {
  return APP.parts.find((part) => part.id === id);
}

function targetLabel(target) {
  if (!target) return '';
  const [partId, ruleId, childId] = target.split('::');
  const part = findPart(partId);
  if (!part) return target;
  if (!ruleId) return `${part.kicker} - ${part.title}`;
  const rule = (part.rules || []).find((r) => r.id === ruleId);
  if (!rule) return `${part.kicker} - ${part.title}`;
  if (!childId) return rule.title;
  const child = (rule.children || []).find((c) => c.id === childId);
  return child ? `${rule.title} - ${child.title}` : rule.title;
}

function targetRows(target) {
  if (!target) return [];
  const [partId, ruleId, childId] = target.split('::');
  const part = findPart(partId);
  if (!part) return [];
  if (!ruleId) return part.introRows || [];
  const rule = (part.rules || []).find((r) => r.id === ruleId);
  if (!rule) return [];
  if (!childId) return rule.rows || [];
  const child = (rule.children || []).find((c) => c.id === childId);
  return child ? child.rows || [] : rule.rows || [];
}

function buildSearchIndex(parts) {
  const out = [];
  for (const part of parts) {
    out.push({
      target: part.id,
      title: `${part.kicker} - ${part.title}`,
      meta: part.group,
      text: plainRows(part.introRows)
    });
    for (const rule of part.rules || []) {
      out.push({
        target: `${part.id}::${rule.id}`,
        title: rule.title,
        meta: `${part.kicker} - ${part.title}`,
        text: `${plainRows(rule.rows)} ${(rule.children || []).map((c) => `${c.title} ${plainRows(c.rows)}`).join(' ')}`
      });
      for (const child of rule.children || []) {
        out.push({
          target: `${part.id}::${rule.id}::${child.id}`,
          title: `${rule.title} - ${child.title}`,
          meta: `${part.kicker} - ${part.title}`,
          text: plainRows(child.rows)
        });
      }
    }
  }
  return out;
}

async function loadBuilderPayload(faction) {
  try {
    const text = await fetch(`Army%20Builder/runtime/payloads/${faction}.js`).then((r) => {
      if (!r.ok) throw new Error(`Missing ${faction} payload`);
      return r.text();
    });
    const sandbox = {};
    return Function('window', `${text}; return window.__starcraftTMGRuntimePayload;`)(sandbox);
  } catch (err) {
    console.warn(`Could not load ${faction} army builder payload`, err);
    return null;
  }
}

async function loadBuilderPayloads() {
  const entries = await Promise.all(Object.keys(FACTION_STORAGE).map(async (faction) => [faction, await loadBuilderPayload(faction)]));
  return Object.fromEntries(entries.filter(([, payload]) => payload));
}

async function loadMissionSetup() {
  try {
    const text = await fetch('Army%20Builder/runtime/payloads/mission-setup.js').then((r) => {
      if (!r.ok) throw new Error('Missing mission setup payload');
      return r.text();
    });
    const sandbox = {};
    return Function('window', `${text}; return window.__missionSetupData;`)(sandbox) || { missions: [], maps: [] };
  } catch (err) {
    console.warn('Could not load mission setup payload', err);
    return { missions: [], maps: [] };
  }
}

async function loadData() {
  const manifest = await fetch('data/manifest.json').then((r) => r.json());
  const parts = await Promise.all(manifest.parts.map(async (meta) => ({
    ...await fetch(meta.file).then((r) => r.json()),
    meta
  })));
  const playGuide = await fetch('data/play-guide.json').then((r) => r.json());
  const battlefieldGuide = await fetch('data/battlefield-guide.json').then((r) => r.json());
  const movementGuide = await fetch('data/movement-guide.json').then((r) => r.json());
  const keywordGuide = await fetch('data/keyword-guide.json').then((r) => r.json());
  const builderPayloads = await loadBuilderPayloads();
  const missionSetup = await loadMissionSetup();
  APP = { manifest, parts, playGuide, battlefieldGuide, movementGuide, keywordGuide, builderPayloads, missionSetup, searchIndex: buildSearchIndex(parts) };
  if (!state.action) state.action = currentAction()?.title || '';
  if (!state.libraryPart) state.libraryPart = parts[0]?.id || '';
}

function rowHtml(row, idx) {
  return `<div class="rule-row ${row.type || 'text'} ${idx % 2 ? 'alt' : ''}"><div class="rule-html">${row.html || esc(row.plain || '')}</div></div>`;
}

function rulePreview(target) {
  const rows = targetRows(target);
  if (!rows.length) return '<div class="empty-state">No exact rule text found for this item.</div>';
  return rows.slice(0, 5).map(rowHtml).join('');
}

function isBookmarked(target) {
  return state.bookmarks.some((b) => b.target === target);
}

function bookmarkButton(target) {
  if (!target) return '';
  return `<button class="ghost-btn ${isBookmarked(target) ? 'active' : ''}" data-bookmark="${esc(target)}">${isBookmarked(target) ? 'Saved' : 'Save'}</button>`;
}

function phaseStepper() {
  return `<div class="phase-stepper">
    ${phases().map((phase, idx) => {
      const tone = phaseTone(phase.phaseClass);
      return `<button class="phase-pill ${idx === state.phase ? 'active' : ''} ${phase.phaseClass}" data-phase="${idx}">
        <span>${tone.n}</span>
        <strong>${esc(tone.name)}</strong>
        <small>${esc(tone.verb)}</small>
      </button>`;
    }).join('')}
  </div>`;
}

function assistantHero() {
  const phase = currentPhase();
  const action = currentAction();
  const tone = phaseTone(phase.phaseClass);
  const done = (phase.procedures || []).filter((p) => state.done[actionKey(p)]).length;
  const total = Math.max(1, (phase.procedures || []).length);
  const progress = Math.round(done / total * 100);
  return `<section class="assistant-hero ${phase.phaseClass}">
    <div class="hero-copy">
      <div class="eyebrow">Round assistant</div>
      <h1>${esc(tone.name)}</h1>
      <p>${esc(phase.purpose)}</p>
      <div class="hero-actions">
        <button class="primary-btn" data-view-go="play">Continue phase</button>
        ${action?.target ? `<button class="ghost-btn" data-drawer="${esc(action.target)}">Current rule</button>` : ''}
      </div>
    </div>
    <div class="hero-status">
      <div class="phase-orb">${tone.n}</div>
      <div class="status-card">
        <span>Current focus</span>
        <strong>${action ? esc(action.title) : 'Choose an action'}</strong>
        <small>${action ? esc(action.when || action.ref || '') : 'Pick a phase to begin.'}</small>
      </div>
      <div class="progress-card">
        <div><span>Phase progress</span><strong>${done}/${total}</strong></div>
        <div class="progress-bar"><i style="width:${progress}%"></i></div>
      </div>
    </div>
  </section>`;
}

function playerName(id) {
  return state.players[id] || (id === 'p1' ? 'Player 1' : 'Player 2');
}

function readSavedRoster(faction) {
  try {
    const raw = localStorage.getItem(FACTION_STORAGE[faction]?.key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn(`Could not read ${faction} roster`, err);
    return null;
  }
}

function findByIdOrName(list = [], id, name) {
  return list.find((item) => item.id === id) || list.find((item) => item.name === name) || null;
}

function selectedScale() {
  return ENGAGEMENT_SCALES.find((scale) => scale.id === state.scenario.scaleId)
    || ENGAGEMENT_SCALES.find((scale) => scale.id === state.armies.p1?.scaleId)
    || ENGAGEMENT_SCALES.find((scale) => scale.id === state.armies.p2?.scaleId)
    || ENGAGEMENT_SCALES[1];
}

function selectedMission() {
  return (APP.missionSetup?.missions || []).find((mission) => mission.id === state.scenario.missionId) || null;
}

function selectedMap() {
  return (APP.missionSetup?.maps || []).find((map) => map.id === state.scenario.mapId) || null;
}

function scenarioSides() {
  state.scenario.sides = state.scenario.sides || { p1: 'blue', p2: 'red' };
  state.scenario.sides.p1 = state.scenario.sides.p1 || 'blue';
  state.scenario.sides.p2 = state.scenario.sides.p2 || (state.scenario.sides.p1 === 'blue' ? 'red' : 'blue');
  return state.scenario.sides;
}

function playerSide(player) {
  return scenarioSides()[player] || (player === 'p1' ? 'blue' : 'red');
}

function sideLabel(side) {
  return side === 'blue' ? 'Blue' : 'Red';
}

function factionClass(roster) {
  return roster?.faction ? `faction-${roster.faction}` : '';
}

function playerTrackerLabel(id) {
  const bits = [];
  if (state.firstPlayer === id) bits.push('First');
  if (state.activePlayer === id) bits.push('Active');
  const roster = state.armies[id];
  if (roster?.factionName && playerName(id) !== roster.factionName) bits.push(roster.factionName);
  return bits.join(' · ');
}

function scenarioType() {
  return selectedScale().type || 'Standard';
}

function activeMissions() {
  return (APP.missionSetup?.missions || []).filter((mission) => mission.type === scenarioType());
}

function activeMaps() {
  return (APP.missionSetup?.maps || []).filter((map) => map.type === scenarioType());
}

function syncScenarioFromRoster(roster) {
  state.scenario.scaleId = state.scenario.scaleId || roster.scaleId || '';
  state.scenario.missionId = state.scenario.missionId || roster.missionId || '';
  state.scenario.mapId = state.scenario.mapId || roster.mapId || '';
}

function mapMarkers() {
  const map = selectedMap();
  const markers = map?.markers?.length ? map.markers : [1, 2, 3, 4, 5].map((num) => ({ num }));
  return [...markers].sort((a, b) => Number(a.num) - Number(b.num));
}

function missionStartsActivated() {
  return (selectedMission()?.parameters || []).some((item) => String(item).toLowerCase().includes('all mission markers are activated'));
}

function markerState(num) {
  state.scenario.markers = state.scenario.markers || {};
  const key = String(num);
  state.scenario.markers[key] = state.scenario.markers[key] || {
    active: missionStartsActivated(),
    controller: 'neutral',
    p1Supply: 0,
    p2Supply: 0
  };
  const row = state.scenario.markers[key];
  row.p1Supply = Number(row.p1Supply || 0);
  row.p2Supply = Number(row.p2Supply || 0);
  if (row.p1Supply > row.p2Supply) row.controller = 'p1';
  else if (row.p2Supply > row.p1Supply) row.controller = 'p2';
  else if (row.p1Supply === 0 && row.p2Supply === 0) row.controller = row.controller || 'neutral';
  else row.controller = 'neutral';
  return state.scenario.markers[key];
}

function markerCounts() {
  return mapMarkers().reduce((acc, marker) => {
    const row = markerState(marker.num);
    if (row.active) acc.active += 1;
    if (row.controller === 'p1') acc.p1 += 1;
    if (row.controller === 'p2') acc.p2 += 1;
    return acc;
  }, { active: 0, p1: 0, p2: 0 });
}

function hydrateRoster(faction, raw) {
  const payload = APP.builderPayloads?.[faction];
  if (!payload || !raw) return null;
  const units = (raw.units || []).map((entry, index) => {
    const unit = findByIdOrName(payload.units, entry.unitId, entry.name);
    if (!unit) return null;
    const tier = typeof entry.tier === 'object'
      ? entry.tier
      : (unit.tiers || []).find((candidate) => candidate.tier === entry.tier) || { tier: entry.tier };
    const selectedUpgrades = (entry.selectedUpgrades || []).map((upgrade) => {
      if (typeof upgrade === 'object') return upgrade;
      return findByIdOrName(unit.upgrades || payload.upgrades || [], upgrade, upgrade) || { id: upgrade, name: upgrade };
    });
    return {
      key: `${faction}-${unit.id}-${index}`,
      unitId: unit.id,
      unit,
      tier,
      cost: entry.cost ?? tier?.cost ?? 0,
      selectedUpgrades
    };
  }).filter(Boolean);
  const tactical = (raw.tactical || []).map((id) => findByIdOrName(payload.tacticalCards, id, id)).filter(Boolean);
  const factionCard = findByIdOrName(payload.factionCards, raw.factionId, raw.factionName) || payload.factionCards?.[0] || null;
  return {
    snapshotId: `${faction}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    faction,
    factionName: payload.faction || FACTION_STORAGE[faction].label,
    factionCard,
    scaleId: raw.scaleId || '',
    missionId: raw.missionId || '',
    mapId: raw.mapId || '',
    units,
    tactical,
    importedAt: Date.now()
  };
}

function detectedRosters() {
  return Object.keys(FACTION_STORAGE).map((faction) => ({
    faction,
    info: FACTION_STORAGE[faction],
    raw: readSavedRoster(faction),
    payload: APP.builderPayloads?.[faction]
  }));
}

function rosterImportName(player, roster) {
  const other = otherPlayer(player);
  if (state.armies[other]?.faction === roster.faction) {
    return `${roster.factionName} - ${player === 'p1' ? 'Player 1' : 'Player 2'}`;
  }
  return roster.factionName;
}

function rosterSnapshotLabel(roster) {
  if (!roster) return '';
  const imported = roster.importedAt ? new Date(roster.importedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '';
  return `Snapshot${imported ? ` ${imported}` : ''}`;
}

function unitState(player, key) {
  state.unitStates[player] = state.unitStates[player] || {};
  state.unitStates[player][key] = state.unitStates[player][key] || {
    location: 'reserves',
    activated: false,
    engaged: false,
    destroyed: false,
    models: null
  };
  return state.unitStates[player][key];
}

function parseModelRange(value) {
  const nums = String(value || '').match(/\d+/g)?.map(Number) || [];
  if (!nums.length) return { min: 1, max: 1 };
  return { min: nums[0], max: nums[nums.length - 1] };
}

function maxModels(entry) {
  return parseModelRange(entry.tier?.models).max;
}

function currentModels(entry, status) {
  if (status.models == null) status.models = maxModels(entry);
  return Math.max(0, Math.min(maxModels(entry), Number(status.models) || 0));
}

function currentUnitSupply(entry, status) {
  if (status.destroyed || status.location === 'destroyed') return 0;
  const models = currentModels(entry, status);
  const bracket = (entry.unit.tiers || []).find((tier) => {
    const range = parseModelRange(tier.models);
    return models >= range.min && models <= range.max;
  });
  return Number(bracket?.supply ?? entry.tier?.supply ?? 0);
}

function importArmy(player, faction) {
  const roster = hydrateRoster(faction, readSavedRoster(faction));
  if (!roster) {
    addLog(`No ${FACTION_STORAGE[faction]?.label || faction} roster found to import.`);
    return;
  }
  const oldName = playerName(player);
  state.armies[player] = roster;
  state.players[player] = rosterImportName(player, roster) || FACTION_STORAGE[faction]?.label || playerName(player);
  state.unitStates[player] = {};
  roster.units.forEach((entry) => unitState(player, entry.key));
  syncScenarioFromRoster(roster);
  addLog(`${oldName} imported ${roster.factionName}: ${roster.units.length} units and ${roster.tactical.length} tactical cards.`);
}

function clearArmy(player) {
  state.armies[player] = null;
  state.unitStates[player] = {};
  addLog(`${playerName(player)} cleared their imported army.`);
}

function armyTotals(roster) {
  const supply = (roster?.units || []).reduce((sum, entry) => sum + Number(entry.tier?.supply || 0), 0);
  const points = (roster?.units || []).reduce((sum, entry) => sum + Number(entry.cost || 0), 0);
  return { supply, points };
}

function playerTracker(player) {
  const roster = state.armies[player];
  const units = roster?.units || [];
  const onBoard = units.filter((entry) => unitState(player, entry.key).location === 'battlefield' && !unitState(player, entry.key).destroyed);
  const reserves = units.filter((entry) => unitState(player, entry.key).location === 'reserves' && !unitState(player, entry.key).destroyed);
  const destroyed = units.filter((entry) => unitState(player, entry.key).location === 'destroyed' || unitState(player, entry.key).destroyed);
  const boardSupply = onBoard.reduce((sum, entry) => sum + currentUnitSupply(entry, unitState(player, entry.key)), 0);
  const destroyedSupply = destroyed.reduce((sum, entry) => sum + Number(entry.tier?.supply || 0), 0);
  return { roster, units, onBoard, reserves, destroyed, boardSupply, destroyedSupply };
}

function missionSupplyCap() {
  const mission = selectedMission();
  if (!mission) return Infinity;
  return Number(mission.supply || 0) + Math.max(0, state.round - 1) * Number(mission.perRound || 0);
}

function remainingSupply(player, entry = null) {
  const cap = missionSupplyCap();
  if (!Number.isFinite(cap)) return Infinity;
  const tracker = playerTracker(player);
  const status = entry ? unitState(player, entry.key) : null;
  const current = entry && status?.location === 'battlefield' && !status.destroyed ? currentUnitSupply(entry, status) : 0;
  return Math.max(0, cap - tracker.boardSupply + current);
}

function supplyLabel(value) {
  return Number.isFinite(value) ? String(value) : 'free';
}

function canDeployUnit(player, entry) {
  const status = unitState(player, entry.key);
  const alreadyOnBoard = status.location === 'battlefield' && !status.destroyed;
  if (alreadyOnBoard) return true;
  if (phaseTone(currentPhase().phaseClass).name !== 'Movement') return false;
  const cap = missionSupplyCap();
  if (!Number.isFinite(cap)) return true;
  const supply = currentUnitSupply(entry, status);
  return supply <= remainingSupply(player, entry);
}

function deploymentWarning(player, entry) {
  if (canDeployUnit(player, entry)) return '';
  const status = unitState(player, entry.key);
  if (phaseTone(currentPhase().phaseClass).name !== 'Movement') return 'Units can only deploy from reserves during the Movement phase.';
  return `Needs ${currentUnitSupply(entry, status)} supply; ${remainingSupply(player, entry)} available.`;
}

function phaseMatches(value) {
  const text = String(value || '').toLowerCase();
  const phase = phaseTone(currentPhase().phaseClass).name.toLowerCase();
  return !text || text.includes('any') || text.includes(phase);
}

function unitPhaseTools(entry) {
  const phaseLabel = `${phaseTone(currentPhase().phaseClass).name} Phase`;
  const weapons = (entry.unit.weapons || []).filter((weapon) => phaseMatches(weapon.phase));
  const abilities = [
    ...(entry.unit.abilities || []).filter((ability) => phaseMatches(ability.phase)),
    ...((entry.unit.phaseAbilities || {})[phaseLabel] || [])
  ];
  const upgrades = (entry.selectedUpgrades || []).filter((upgrade) => phaseMatches(upgrade.phase || upgrade.timing || upgrade.type));
  return { weapons, abilities, upgrades };
}

function unitReminderHtml(entry) {
  const tools = unitPhaseTools(entry);
  const rows = [];
  tools.weapons.slice(0, 2).forEach((weapon) => rows.push(`<span>${esc(weapon.name)}: R${esc(weapon.range || '-')} Hit ${esc(weapon.hit || '-')} Dmg ${esc(weapon.damage || '-')}</span>`));
  tools.abilities.slice(0, 2).forEach((ability) => rows.push(`<span>${esc(ability.name)}${ability.type ? ` · ${esc(ability.type)}` : ''}</span>`));
  tools.upgrades.slice(0, 2).forEach((upgrade) => rows.push(`<span>${esc(upgrade.name || upgrade.id)}</span>`));
  return rows.length ? rows.join('') : '<span>No phase-specific card text found.</span>';
}

function scenarioPanel() {
  const mission = selectedMission();
  const map = selectedMap();
  const scale = selectedScale();
  const counts = markerCounts();
  const cap = missionSupplyCap();
  return `<section class="scenario-panel">
    <div class="scenario-scoreboard">
      <div class="mission-title-block">
        <div class="eyebrow">Mission tracker</div>
        <h3>${esc(mission?.name || 'Choose mission')}</h3>
        <p>${esc(scale.name)} · ${esc(map?.name || 'No map selected')}</p>
      </div>
      <div class="mission-score-strip">
        <article><span>Round supply</span><strong>${supplyLabel(cap)}</strong></article>
        <article><span>Active markers</span><strong>${counts.active}/${mapMarkers().length}</strong></article>
        <article><span>${esc(playerName('p1'))}</span><strong>${supplyLabel(remainingSupply('p1'))}</strong><small>${esc(sideLabel(playerSide('p1')))} side</small></article>
        <article><span>${esc(playerName('p2'))}</span><strong>${supplyLabel(remainingSupply('p2'))}</strong><small>${esc(sideLabel(playerSide('p2')))} side</small></article>
      </div>
    </div>
    <div class="scenario-toolbar">
      <div class="scenario-selects">
        <select data-scenario-scale aria-label="Scenario scale">${ENGAGEMENT_SCALES.map((item) => `<option value="${item.id}" ${scale.id === item.id ? 'selected' : ''}>${esc(item.name)}</option>`).join('')}</select>
        <select data-scenario-mission aria-label="Mission"><option value="">Mission</option>${activeMissions().map((item) => `<option value="${item.id}" ${state.scenario.missionId === item.id ? 'selected' : ''}>${esc(item.name)}</option>`).join('')}</select>
        <select data-scenario-map aria-label="Map"><option value="">Map</option>${activeMaps().map((item) => `<option value="${item.id}" ${state.scenario.mapId === item.id ? 'selected' : ''}>${esc(item.name)}</option>`).join('')}</select>
      </div>
      <div class="mission-actions">
        <button class="mission-chip" data-open-modal="mission">Mission info</button>
        <button class="mission-chip" data-open-modal="map" ${map ? '' : 'disabled'}>View map</button>
        <button class="mission-chip" data-swap-sides ${map ? '' : 'disabled'}>Swap sides</button>
      </div>
    </div>
    ${markerTracker()}
  </section>`;
}

function markerTracker() {
  return `<div class="marker-tracker">
    ${mapMarkers().map((marker) => {
      const row = markerState(marker.num);
      const owner = row.controller === 'neutral' ? 'Neutral' : playerName(row.controller);
      return `<button class="marker-chip ${row.active ? 'active' : ''} ${row.controller}" data-open-marker="${esc(marker.num)}">
        <strong>M${esc(marker.num)}</strong>
        <span>${esc(owner)}</span>
        <small>${row.p1Supply}-${row.p2Supply}</small>
      </button>`;
    }).join('')}
  </div>`;
}

function missionInfoModal() {
  const mission = selectedMission();
  const map = selectedMap();
  return `<div class="app-modal-panel">
    <div class="modal-head">
      <div><div class="eyebrow">Mission details</div><h3>${esc(mission?.name || 'Mission')}</h3></div>
      <button class="icon-btn" data-close-modal>×</button>
    </div>
    <div class="modal-grid">
      <article><span>Deployment</span>${map ? `<p><strong>${esc(playerName('p1'))}:</strong> ${esc(sideLabel(playerSide('p1')))} - ${esc((playerSide('p1') === 'blue' ? map.blueSetup : map.redSetup)?.title || 'Deployment zone')}</p><p><strong>${esc(playerName('p2'))}:</strong> ${esc(sideLabel(playerSide('p2')))} - ${esc((playerSide('p2') === 'blue' ? map.blueSetup : map.redSetup)?.title || 'Deployment zone')}</p>` : '<p>Select a map to show deployment zones.</p>'}</article>
      <article><span>Parameters</span>${(mission?.parameters || []).map((item) => `<p>${esc(item)}</p>`).join('') || '<p>Select a mission for parameters.</p>'}</article>
      <article><span>Scoring</span>${(mission?.scoring || []).map((item) => `<p>${esc(item)}</p>`).join('') || '<p>Select a mission for scoring.</p>'}</article>
      ${mission?.special ? `<article><span>Special</span><p>${esc(mission.special)}</p></article>` : ''}
    </div>
  </div>`;
}

function mapModal() {
  const map = selectedMap();
  if (!map) return '';
  const w = Number(map.width || 36);
  const h = Number(map.height || 36);
  const zoneRect = (zone, cls) => `<rect class="${cls}" x="${zone.x}" y="${zone.y}" width="${zone.w}" height="${zone.h}" rx="1" />`;
  return `<div class="app-modal-panel map-modal-panel">
    <div class="modal-head">
      <div><div class="eyebrow">Battlefield map</div><h3>${esc(map.name)}</h3><p>${esc(map.size || selectedScale().table)}</p></div>
      <button class="icon-btn" data-close-modal>×</button>
    </div>
    <svg class="battle-map" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(map.name)}">
      <rect class="map-board" x="0" y="0" width="${w}" height="${h}" />
      ${(map.blueZones || []).map((zone) => zoneRect(zone, 'blue-zone')).join('')}
      ${(map.redZones || []).map((zone) => zoneRect(zone, 'red-zone')).join('')}
      ${(map.markers || []).map((marker) => `<g><circle class="map-marker ${markerState(marker.num).controller}" cx="${marker.x}" cy="${marker.y}" r="1.6" /><text x="${marker.x}" y="${marker.y + .35}" text-anchor="middle">M${marker.num}</text></g>`).join('')}
    </svg>
    <div class="modal-grid two">
      <article><span>Blue setup</span>${(map.blueSetup?.instructions || []).map((item) => `<p>${esc(item)}</p>`).join('')}</article>
      <article><span>Red setup</span>${(map.redSetup?.instructions || []).map((item) => `<p>${esc(item)}</p>`).join('')}</article>
    </div>
  </div>`;
}

function markerModal(num) {
  const marker = mapMarkers().find((item) => String(item.num) === String(num)) || { num };
  const row = markerState(marker.num);
  const owner = row.controller === 'neutral' ? 'Neutral' : playerName(row.controller);
  return `<div class="app-modal-panel marker-modal-panel">
    <div class="modal-head">
      <div><div class="eyebrow">Mission marker</div><h3>M${esc(marker.num)} · ${esc(owner)}</h3>${marker.desc ? `<p>${esc(marker.desc)}</p>` : ''}</div>
      <button class="icon-btn" data-close-modal>×</button>
    </div>
    <div class="marker-editor">
      <button class="marker-active-toggle ${row.active ? 'active' : ''}" data-marker-active="${esc(marker.num)}">${row.active ? 'Active marker' : 'Inactive marker'}</button>
      ${['p1','p2'].map((player) => `<article class="marker-supply-editor ${row.controller === player ? 'controls' : ''}">
        <span>${esc(playerName(player))}</span>
        <button data-marker-supply="${esc(marker.num)}" data-marker-player="${player}" data-delta="-1">-</button>
        <strong>${row[`${player}Supply`]}</strong>
        <button data-marker-supply="${esc(marker.num)}" data-marker-player="${player}" data-delta="1">+</button>
      </article>`).join('')}
      <div class="marker-owner-buttons">
        ${['neutral','p1','p2'].map((ownerId) => `<button class="${row.controller === ownerId ? 'active' : ''}" data-marker-owner="${esc(marker.num)}" data-owner="${ownerId}">${ownerId === 'neutral' ? 'Neutral' : esc(playerName(ownerId))}</button>`).join('')}
      </div>
    </div>
  </div>`;
}

function appModal() {
  if (!state.modal) return '';
  const body = state.modal === 'mission' ? missionInfoModal()
    : state.modal === 'map' ? mapModal()
      : state.modal === 'log' ? logModal()
      : state.modal.startsWith('marker:') ? markerModal(state.modal.split(':')[1])
        : '';
  if (!body) return '';
  return `<aside class="app-modal"><div class="modal-backdrop" data-close-modal></div>${body}</aside>`;
}

function trackerSummary(player) {
  const tracker = playerTracker(player);
  const cap = missionSupplyCap();
  const over = Number.isFinite(cap) && tracker.boardSupply > cap;
  return `<div class="tracker-summary ${over ? 'over' : ''}">
    <span>${tracker.onBoard.length} board</span>
    <span>${tracker.reserves.length} reserves</span>
    <span>${tracker.destroyed.length} destroyed</span>
    <strong>${supplyLabel(remainingSupply(player))} left</strong>
  </div>`;
}

function armySlot(player) {
  const roster = state.armies[player];
  const totals = armyTotals(roster);
  const showingCards = roster && state.armyOpen[player] !== false;
  return `<article class="army-slot ${roster ? 'loaded' : ''} ${factionClass(roster)}">
    <div class="army-slot-head" ${roster ? `data-toggle-army="${player}"` : ''}>
      <div>
        <div class="eyebrow">${esc(playerName(player))}</div>
        <h3>${roster ? esc(roster.factionName) : 'No army loaded'}</h3>
        <p>${roster ? `${sideLabel(playerSide(player))} side · ${rosterSnapshotLabel(roster)} · ${roster.units.length} units · ${totals.supply} list supply · ${totals.points} pts` : 'Import a saved builder list for live unit cards.'}</p>
      </div>
      ${roster ? `<div class="army-head-actions"><button class="mini-btn" data-toggle-army="${player}">${showingCards ? 'Hide' : 'Open'}</button><button class="mini-btn" data-clear-army="${player}">Clear</button></div>` : ''}
    </div>
    ${roster ? trackerSummary(player) : ''}
    <div class="import-row">
      ${detectedRosters().map(({ faction, info, raw, payload }) => `<button class="mini-btn" data-import-army="${player}" data-faction="${faction}" ${raw && payload ? '' : 'disabled'}>${raw ? `Import ${info.label}` : `No ${info.label}`}</button>`).join('')}
    </div>
    <p class="import-hint">Imports are snapshots. For mirror matches, import one army, change and save the builder list, then import the other player.</p>
    ${showingCards ? `<div class="army-unit-list">${roster.units.map((entry) => unitCard(player, entry)).join('')}</div>` : ''}
  </article>`;
}

function unitCard(player, entry) {
  const status = unitState(player, entry.key);
  const models = currentModels(entry, status);
  const deployWarning = deploymentWarning(player, entry);
  const open = state.unitOpen[`${player}:${entry.key}`] !== false;
  const loc = status.destroyed ? 'destroyed' : status.location;
  const locMeta = {
    reserves: { label: 'Reserves', color: '#7b93a8' },
    battlefield: { label: 'On Board', color: '#c9a84c' },
    destroyed: { label: 'Destroyed', color: '#8b4049' }
  }[loc] || { label: loc, color: 'var(--dim)' };
  const weapons = entry.unit.weapons || [];
  const abilities = [
    ...(entry.unit.abilities || []),
    ...((entry.unit.phaseAbilities || {})[`${phaseTone(currentPhase().phaseClass).name} Phase`] || [])
  ];
  return `<article class="unit-card ${status.destroyed ? 'dead' : ''} ${status.activated ? 'activated' : ''} ${deployWarning ? 'blocked' : ''}">
    <div class="unit-row" data-unit-open="${player}" data-unit-key="${esc(entry.key)}">
      <span class="loc-dot" style="background:${locMeta.color};box-shadow:0 0 5px ${locMeta.color}40"></span>
      <div class="unit-title">
        <span class="unit-name ${status.destroyed ? 'dead' : ''}">${esc(entry.unit.name)}</span>
        <span class="unit-meta">${esc(entry.tier?.tier || 'Tier')} · S${currentUnitSupply(entry, status)}</span>
      </div>
      <button class="toggle-chip ${status.engaged ? 'on' : ''}" data-unit-toggle="${player}" data-unit-key="${esc(entry.key)}" data-toggle="engaged">Eng</button>
      <button class="toggle-chip ${status.activated ? 'on' : ''}" data-unit-toggle="${player}" data-unit-key="${esc(entry.key)}" data-toggle="activated">Act</button>
      <span class="model-badge" style="background:${locMeta.color}15;color:${locMeta.color}">${models}/${maxModels(entry)}</span>
      <span class="unit-chevron ${open ? 'open' : ''}">▼</span>
    </div>
    ${open ? `<div class="unit-expand">
      ${deployWarning ? `<div class="deploy-warning">${esc(deployWarning)}</div>` : ''}
      <div class="stat-strip">
        <div class="stat-box"><div class="stat-label">Spd</div><div class="stat-val">${esc(entry.unit.stats?.speed || '-')}</div></div>
        <div class="stat-box"><div class="stat-label">Arm</div><div class="stat-val">${esc(entry.unit.stats?.armour || '-')}</div></div>
        <div class="stat-box"><div class="stat-label">HP</div><div class="stat-val">${esc(entry.unit.stats?.hp || '-')}</div></div>
        <div class="stat-box"><div class="stat-label">Role</div><div class="stat-val">${esc(entry.unit.role || 'Unit')}</div></div>
      </div>
      ${weapons.length ? `<div class="unit-detail-block"><div class="sec-label">Weapons</div>
        ${weapons.map((weapon) => `<div class="weapon-row"><span class="weapon-name">${esc(weapon.name)}</span><span class="weapon-stats">R${esc(weapon.range || '-')} · ${esc(weapon.hit || '-')} · D${esc(weapon.damage || weapon.dmg || '-')}</span></div>`).join('')}
      </div>` : ''}
      ${abilities.length ? `<div class="unit-detail-block"><div class="sec-label">Abilities</div>
        ${abilities.map((ability) => `<div class="ability-row"><span class="ability-name">${esc(ability.name)}</span><span class="ability-desc">${ability.text || ability.description ? ` - ${esc(ability.text || ability.description)}` : ''}</span></div>`).join('')}
      </div>` : ''}
      <div class="unit-reminders">${unitReminderHtml(entry)}</div>
      <div class="model-row">
        <span class="sec-label">Models</span>
        <button class="step-btn" data-model-delta="-1" data-model-player="${player}" data-unit-key="${esc(entry.key)}">-</button>
        <span class="model-val">${models}</span>
        <button class="step-btn" data-model-delta="1" data-model-player="${player}" data-unit-key="${esc(entry.key)}">+</button>
        <span class="model-max">/${maxModels(entry)}</span>
      </div>
      <div class="loc-btns">
        ${['reserves','battlefield','destroyed'].map((item) => {
          const meta = {
            reserves: { label: 'Reserves', color: '#7b93a8' },
            battlefield: { label: 'On Board', color: '#c9a84c' },
            destroyed: { label: 'Destroyed', color: '#8b4049' }
          }[item];
          const active = status.location === item || (item === 'destroyed' && status.destroyed);
          return `<button class="loc-btn ${active ? 'active' : ''}" data-unit-location="${player}" data-unit-key="${esc(entry.key)}" data-location="${item}" ${item === 'battlefield' && deployWarning ? 'disabled' : ''} style="border-color:${active ? meta.color : 'var(--line)'};background:${active ? `${meta.color}15` : 'transparent'};color:${active ? meta.color : 'var(--dim)'}">${meta.label}</button>`;
        }).join('')}
      </div>
    </div>` : ''}
  </article>`;
}

function missionPrototypePanel() {
  const mission = selectedMission();
  const map = selectedMap();
  const scale = selectedScale();
  const counts = markerCounts();
  const cap = missionSupplyCap();
  return `<section class="mission-panel">
    <div class="mission-header">
      <div class="mission-header-info">
        <div class="mission-title">${esc(mission?.name || 'No mission')} · ${esc(map?.name || 'No map')}</div>
        <div class="mission-sub">${esc(scale.name)} · Supply cap ${Number.isFinite(cap) ? cap : '-'} · ${counts.active}/${mapMarkers().length} markers active</div>
      </div>
      <button class="mission-chip" data-open-modal="mission">Info</button>
      <button class="mission-chip" data-open-modal="map" ${map ? '' : 'disabled'}>Map</button>
    </div>
    <div class="mission-body">
      <div class="scale-chips">
        ${ENGAGEMENT_SCALES.map((item) => `<button class="scale-chip ${scale.id === item.id ? 'active' : ''}" data-scenario-scale-value="${item.id}">${esc(item.name)}<span>${esc(item.table)}</span></button>`).join('')}
      </div>
      <div class="mission-selects">
        <select class="mission-select" data-scenario-mission aria-label="Mission"><option value="">Mission</option>${activeMissions().map((item) => `<option value="${item.id}" ${state.scenario.missionId === item.id ? 'selected' : ''}>${esc(item.name)}</option>`).join('')}</select>
        <select class="mission-select" data-scenario-map aria-label="Map"><option value="">Map</option>${activeMaps().map((item) => `<option value="${item.id}" ${state.scenario.mapId === item.id ? 'selected' : ''}>${esc(item.name)}</option>`).join('')}</select>
      </div>
      <div class="sides-row">
        <span class="sides-label">Deployment</span>
        <span class="side-chip">${esc(playerName('p1'))}: ${esc(sideLabel(scenarioSides().p1))}</span>
        <span class="side-chip">${esc(playerName('p2'))}: ${esc(sideLabel(scenarioSides().p2))}</span>
        <button class="swap-btn" data-swap-sides ${map ? '' : 'disabled'}>Swap</button>
      </div>
      <div class="sec-label">Mission Markers</div>
      <div class="marker-grid">
        ${mapMarkers().map((marker) => {
          const row = markerState(marker.num);
          const owner = row.controller === 'neutral' ? 'Neutral' : playerName(row.controller);
          return `<button class="marker-chip ${row.active ? 'active' : ''} owner-${row.controller}" data-open-marker="${marker.num}">
            <span class="marker-num">M${marker.num}</span>
            <span class="marker-owner">${esc(owner)}</span>
            <span class="marker-supply">${row.p1Supply || 0}-${row.p2Supply || 0}</span>
          </button>`;
        }).join('')}
      </div>
    </div>
  </section>`;
}

function armyPrototypeSection() {
  const player = state.armyView || 'p1';
  const roster = state.armies[player];
  const tracker = playerTracker(player);
  const entries = roster?.units || [];
  const filtered = entries.filter((entry) => {
    const status = unitState(player, entry.key);
    if (state.armyFilter === 'all') return true;
    if (state.armyFilter === 'destroyed') return status.location === 'destroyed' || status.destroyed;
    return status.location === state.armyFilter && !status.destroyed;
  });
  const counts = {
    all: entries.length,
    battlefield: tracker.onBoard.length,
    reserves: tracker.reserves.length,
    destroyed: tracker.destroyed.length
  };
  return `<section class="army-section">
    <div class="army-toggle">
      ${['p1','p2'].map((id) => {
        const army = state.armies[id];
        const label = army ? `${playerName(id)} (${army.units.length})` : `${id.toUpperCase()} import`;
        return `<button class="${player === id ? 'active' : ''} ${factionClass(army)}" data-army-view="${id}">${esc(label)}</button>`;
      }).join('')}
    </div>
    ${roster ? `<div class="filter-chips">
      ${[
        ['all', `All (${counts.all})`],
        ['battlefield', `Board (${counts.battlefield})`],
        ['reserves', `Rsv (${counts.reserves})`],
        ['destroyed', `Lost (${counts.destroyed})`]
      ].map(([id, label]) => `<button class="filter-chip ${state.armyFilter === id ? 'active' : ''} ${factionClass(roster)}" data-army-filter="${id}">${esc(label)}</button>`).join('')}
    </div>
    ${filtered.length ? filtered.map((entry) => unitCard(player, entry)).join('') : '<div class="empty-msg">No units in this category.</div>'}` : `<div class="import-card">
      <div class="sec-label">${esc(playerName(player))}</div>
      <h3>No army loaded.</h3>
      <div class="import-row">
        ${detectedRosters().map(({ faction, info, raw, payload }) => `<button class="mini-btn" data-import-army="${player}" data-faction="${faction}" ${raw && payload ? '' : 'disabled'}>${raw ? `Import ${info.label}` : `No ${info.label}`}</button>`).join('')}
      </div>
      <p class="import-hint">Open the builder, save a list, then import it here as a snapshot.</p>
    </div>`}
  </section>`;
}

function armyCommandPanel() {
  return `<section class="army-command-panel">
    <div class="section-title">
      <div><div class="eyebrow">Army command</div><h2>Bring builder lists to the table.</h2></div>
      <div class="builder-links">
        <a class="ghost-link" href="Army%20Builder/zerg.html" target="_blank" rel="noreferrer">Zerg</a>
        <a class="ghost-link" href="Army%20Builder/protoss.html" target="_blank" rel="noreferrer">Protoss</a>
        <a class="ghost-link" href="Army%20Builder/terran.html" target="_blank" rel="noreferrer">Terran</a>
      </div>
    </div>
    ${scenarioPanel()}
    <div class="army-slots">${armySlot('p1')}${armySlot('p2')}</div>
    ${appModal()}
  </section>`;
}

function companionCockpit() {
  const phase = currentPhase();
  const tone = phaseTone(phase.phaseClass);
  const action = currentAction();
  const actions = phase.procedures || [];
  const phaseColor = `var(--${tone.accent})`;
  const cap = missionSupplyCap();
  const playerScore = (id) => {
    const roster = state.armies[id];
    const tracker = playerTracker(id);
    const active = state.activePlayer === id;
    const first = state.firstPlayer === id;
    return `<article class="vp-block score-card ${active ? 'active' : ''} ${first ? 'first' : ''} ${factionClass(roster)}">
      <div class="vp-label-row">
        <button class="first-token ${first ? 'on' : ''}" data-first-player="${id}" aria-label="Set first player">${first ? 'First' : 'Make first'}</button>
        <button class="active-token ${active ? 'on' : ''}" data-active-player="${id}">${active ? 'Acting' : 'Activate'}</button>
      </div>
      <input value="${esc(playerName(id))}" data-player-name="${id}" aria-label="${id} name">
      <div class="vp-score-line">
        <button data-vp-dec="${id}" aria-label="Remove victory point">-</button>
        <strong>${state.vp[id] || 0}</strong>
        <button data-vp-inc="${id}" aria-label="Add victory point">+</button>
      </div>
      <div class="vp-label">${esc(roster?.factionName || (id === 'p1' ? 'Player 1' : 'Player 2'))}</div>
      ${roster ? `<div class="score-army-line">
        <span>${tracker.boardSupply}/${Number.isFinite(cap) ? cap : '-'} supply</span>
        <span>${tracker.reserves.length} reserve</span>
        <span>${tracker.destroyed.length} lost</span>
      </div>` : '<div class="score-army-line"><span>No army imported</span></div>'}
    </article>`;
  };
  return `<section class="companion-cockpit ${phase.phaseClass}">
    <div class="scoreboard">
      <div class="score-row1">
        <div class="round-block">
          <button class="round-step" data-round-dec aria-label="Previous round">-</button>
          <div>
            <div class="round-label">Round</div>
            <div class="round-value">${state.round}</div>
            <div class="round-hint">tap + / -</div>
          </div>
          <button class="round-step" data-round-inc aria-label="Next round">+</button>
        </div>
        <div class="phase-col">
          <div class="phase-pills">
            ${phases().map((item, idx) => {
              const itemTone = phaseTone(item.phaseClass);
              const active = idx === state.phase;
              return `<button class="phase-pill ${active ? 'active' : ''} ${item.phaseClass}" data-phase="${idx}" style="${active ? `color:var(--${itemTone.accent});border-color:var(--${itemTone.accent});background:color-mix(in srgb,var(--${itemTone.accent}) 18%,transparent);` : ''}">${itemTone.n}</button>`;
            }).join('')}
          </div>
          <div class="phase-row2">
            <span class="phase-name" style="color:${phaseColor}">${esc(tone.name)} Phase</span>
            <button class="active-btn ${factionClass(state.armies[state.activePlayer])}" data-swap-active><span class="active-tag">${esc(playerName(state.activePlayer))}</span><span> acting</span></button>
          </div>
        </div>
      </div>
      <div class="vp-row">
        ${playerScore('p1')}
        <div class="vp-sep"><span>VP</span><span>vs</span></div>
        ${playerScore('p2')}
      </div>
    </div>
    <div class="turn-strip">
      <p class="phase-purpose">${esc(phase.purpose)}</p>
      <div class="action-chips">
        ${actions.map((item) => {
          const key = actionKey(item);
          return `<button class="action-chip ${action?.title === item.title ? 'active' : ''} ${state.done[key] ? 'done' : ''}" data-action="${esc(item.title)}">${state.done[key] ? 'Done: ' : ''}${esc(item.title)}</button>`;
        }).join('')}
      </div>
      ${action ? `<button class="action-detail" data-drawer="${esc(action.target || '')}" ${action.target ? '' : 'disabled'}>
        <span class="step-num" style="background:${phaseColor};color:#101113">${esc(action.ref || tone.n)}</span>
        <span><span class="action-title">${esc(action.title)}</span><span class="action-when">${esc(action.when || action.what || 'Use when this phase asks for it.')}</span></span>
        <span class="action-chevron">${action.target ? 'Rule' : ''}</span>
      </button>
      <div class="action-steps">
        ${(action.how || action.cannot || []).slice(0, 4).map((step, idx) => `<div class="step-row"><span class="step-num">${idx + 1}</span><span>${esc(step)}</span></div>`).join('') || `<div class="step-row"><span class="step-num">1</span><span>${esc(action.what || phase.purpose)}</span></div>`}
      </div>` : ''}
      <div class="resolve-row">
        <button class="resolve-btn primary-btn" data-log-action>Resolve ${action ? esc(action.title) : 'action'}</button>
        <button class="pass-btn ${state.passed[state.activePlayer] ? 'done' : ''}" data-pass-player="${state.activePlayer}">${isAlternatingPhase() ? (state.passed[state.activePlayer] ? 'Passed' : 'Pass') : 'Complete'}</button>
        <button class="pass-btn" data-next-phase>Next phase</button>
      </div>
      <div class="pass-state">
        <span class="${state.passed.p1 ? 'done' : ''}">${esc(playerName('p1'))} ${state.passed.p1 ? 'passed' : 'ready'}</span>
        <span class="${state.passed.p2 ? 'done' : ''}">${esc(playerName('p2'))} ${state.passed.p2 ? 'passed' : 'ready'}</span>
      </div>
    </div>
  </section>`;
}

function orderedLog() {
  return [...(state.log || [])].map((item, index) => ({ ...item, _index: index })).sort((a, b) => {
    const atA = Date.parse(a.at || '') || 0;
    const atB = Date.parse(b.at || '') || 0;
    if (atA !== atB) return atA - atB;
    return b._index - a._index;
  });
}

function logGroups() {
  return orderedLog().reduce((groups, item) => {
    const round = Number(item.round || 1);
    groups[round] = groups[round] || [];
    groups[round].push(item);
    return groups;
  }, {});
}

function logItemHtml(item) {
  return `<div class="log-item"><span>R${item.round || 1} ${esc(item.phase || 'Round')} · ${esc(item.time || '')}</span><strong>${esc(item.text)}</strong></div>`;
}

function logModal() {
  const groups = logGroups();
  const rounds = Object.keys(groups).map(Number).sort((a, b) => a - b);
  return `<div class="app-modal-panel log-modal-panel">
    <div class="modal-head">
      <div><div class="eyebrow">Match record</div><h3>Full game log</h3><p>${state.log.length} event${state.log.length === 1 ? '' : 's'} saved on this device.</p></div>
      <button class="icon-btn" data-close-modal>×</button>
    </div>
    <div class="round-log-list">
      ${rounds.length ? rounds.map((round) => `<section class="round-log-group">
        <div class="round-log-head"><strong>Round ${round}</strong><span>${groups[round].length} events</span></div>
        ${groups[round].map(logItemHtml).join('')}
      </section>`).join('') : '<div class="empty-state">No game events yet.</div>'}
    </div>
  </div>`;
}

function actionCompanion() {
  const phase = currentPhase();
  const action = currentAction();
  if (!action) return '';
  return `<section class="action-companion ${phase.phaseClass}">
    <div class="section-title">
      <div><div class="eyebrow">Action companion</div><h2>${esc(action.title)}</h2></div>
      ${action.target ? `<button class="ghost-btn" data-drawer="${esc(action.target)}">Exact rule</button>` : ''}
    </div>
    <div class="companion-flow">
      <article>
        <span>1. Legality</span>
        <p>${esc(action.when || 'Confirm the active unit is eligible to use this action now.')}</p>
      </article>
      <article>
        <span>2. Restrictions</span>
        ${(action.cannot || []).length ? `<ul>${action.cannot.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '<p>No special restrictions listed. Check exact rules for unusual board states.</p>'}
      </article>
      <article>
        <span>3. Resolve</span>
        ${(action.how || []).length ? `<ol>${action.how.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` : '<p>Resolve the exact rule text.</p>'}
      </article>
      <article>
        <span>4. Aftermath</span>
        <p>${esc(action.ifFails || 'Mark the unit/action resolved, then choose the next active player or pass.')}</p>
      </article>
    </div>
  </section>`;
}

function tableLog() {
  const latest = state.log.slice(0, 8);
  return `<section class="table-log">
    <div class="section-title">
      <div><div class="eyebrow">Game log</div><h2>What happened</h2><p>${state.log.length} event${state.log.length === 1 ? '' : 's'} saved.</p></div>
      <div class="log-actions"><button class="ghost-btn" data-open-modal="log">Full log</button><button class="ghost-btn" data-clear-log>Clear</button></div>
    </div>
    <div class="log-list">
      ${latest.length ? latest.map(logItemHtml).join('') : '<div class="empty-state">Resolve actions, passes, phase changes, and scoring to build a live table log.</div>'}
    </div>
  </section>`;
}

function actionCards(phase = currentPhase()) {
  return `<div class="action-grid">
    ${(phase.procedures || []).map((action) => {
      const key = actionKey(action);
      return `<button class="action-tile ${state.action === action.title ? 'active' : ''} ${state.done[key] ? 'done' : ''}" data-action="${esc(action.title)}">
        <span>${state.done[key] ? 'Done' : action.ref || 'Action'}</span>
        <strong>${esc(action.title)}</strong>
        <small>${esc(action.what || action.when || '')}</small>
      </button>`;
    }).join('')}
  </div>`;
}

function actionWorkspace() {
  const phase = currentPhase();
  const action = currentAction();
  if (!action) return '<section class="workspace-card">No action found for this phase.</section>';
  const key = actionKey(action);
  return `<section class="workspace-card ${phase.phaseClass}">
    <div class="workspace-head">
      <div>
        <div class="eyebrow">Selected action</div>
        <h2>${esc(action.title)}</h2>
        <p>${esc(action.what || phase.purpose)}</p>
      </div>
      <button class="complete-btn ${state.done[key] ? 'done' : ''}" data-complete="${esc(key)}">${state.done[key] ? 'Completed' : 'Mark complete'}</button>
    </div>
    <div class="decision-grid">
      <article>
        <span>When to use it</span>
        <p>${esc(action.when || 'Use this when the phase and unit state allow it.')}</p>
      </article>
      <article>
        <span>Check before resolving</span>
        ${(action.cannot || []).length
          ? `<ul>${action.cannot.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`
          : '<p>No special restrictions listed in the guide. Use the exact rule text if the table state is unusual.</p>'}
      </article>
      <article>
        <span>Resolution steps</span>
        ${(action.how || []).length
          ? `<ol>${action.how.map((item) => `<li>${esc(item)}</li>`).join('')}</ol>`
          : '<p>Resolve according to the exact rule text.</p>'}
      </article>
      <article>
        <span>Watch for</span>
        <p>${esc(action.ifFails || (phase.notes || [])[0] || 'Confirm timing and eligibility before moving on.')}</p>
      </article>
    </div>
    <div class="context-strip">
      ${(action.see || []).map((item) => `<span>${esc(item)}</span>`).join('')}
      ${action.target ? `<button class="ghost-btn" data-drawer="${esc(action.target)}">Read exact rule</button>` : ''}
      ${bookmarkButton(action.target)}
    </div>
  </section>`;
}

function remindersPanel() {
  const phase = currentPhase();
  return `<section class="side-panel">
    <div class="panel-block">
      <div class="eyebrow">Phase reminders</div>
      ${(phase.notes || []).map((note) => `<div class="reminder">${esc(note)}</div>`).join('') || '<div class="reminder">No reminders listed.</div>'}
    </div>
    <div class="panel-block">
      <div class="eyebrow">Available actions</div>
      <div class="chip-row">${(phase.actions || []).map((item) => `<span>${esc(item)}</span>`).join('')}</div>
    </div>
    <div class="panel-block">
      <div class="eyebrow">Jump to</div>
      <button class="quick-link" data-view-go="reference">Quick reference</button>
      <button class="quick-link" data-view-go="systems">Rules library</button>
      <button class="quick-link" data-view-go="search">Search all rules</button>
    </div>
  </section>`;
}

function drawer() {
  if (!state.drawerTarget) return '';
  return `<aside class="rule-drawer">
    <div class="drawer-backdrop" data-close-drawer></div>
    <div class="drawer-panel">
      <div class="drawer-head">
        <div>
          <div class="eyebrow">Exact rule</div>
          <h3>${esc(targetLabel(state.drawerTarget))}</h3>
        </div>
        <button class="icon-btn" data-close-drawer>×</button>
      </div>
      <div class="drawer-body">${rulePreview(state.drawerTarget)}</div>
    </div>
  </aside>`;
}

function renderHome() {
  HOME.innerHTML = `${companionCockpit()}
    ${armyCommandPanel()}
    <div class="home-dashboard">
      <section class="dashboard-main">
        <div class="section-title">
          <div><div class="eyebrow">Choose what is happening</div><h2>Pick the active action.</h2></div>
          <button class="ghost-btn" data-view-go="play">Open workspace</button>
        </div>
        ${actionCards()}
        ${actionCompanion()}
      </section>
      ${tableLog()}
    </div>
    <section class="reference-band">
      <button data-view-go="search"><strong>Find a rule</strong><span>Search the complete compendium.</span></button>
      <button data-view-go="systems"><strong>Browse library</strong><span>Read full Parts and systems.</span></button>
      <button data-view-go="reference"><strong>Quick reference</strong><span>Glossary, saved rules, and print.</span></button>
    </section>
    ${drawer()}`;
}

function renderPlay() {
  PLAY.innerHTML = `${companionCockpit()}
    ${missionPrototypePanel()}
    ${armyPrototypeSection()}
    ${tableLog()}
    ${appModal()}
    ${drawer()}`;
}

function renderPartList(parts) {
  return `<div class="library-grid">${parts.map((part) => `<button class="library-part ${state.libraryPart === part.id ? 'active' : ''}" data-library-part="${part.id}">
    <span>${esc(part.kicker)}</span>
    <strong>${esc(part.title)}</strong>
    <small>${part.rules.length} sections</small>
  </button>`).join('')}</div>`;
}

function renderLibraryPart() {
  const part = findPart(state.libraryPart) || APP.parts[0];
  if (!part) return '';
  return `<section class="library-reader">
    <div class="reader-head">
      <div><div class="eyebrow">${esc(part.kicker)}</div><h2>${esc(part.title)}</h2></div>
      ${bookmarkButton(part.id)}
    </div>
    ${(part.introRows || []).length ? `<div class="reader-intro">${part.introRows.map(rowHtml).join('')}</div>` : ''}
    <div class="rule-list">
      ${(part.rules || []).map((rule) => `<article class="reader-rule">
        <button class="reader-rule-head" data-drawer="${part.id}::${rule.id}">
          <strong>${esc(rule.title)}</strong>
          <span>Open</span>
        </button>
        <div class="reader-rule-preview">${(rule.rows || []).slice(0, 2).map(rowHtml).join('')}</div>
      </article>`).join('')}
    </div>
  </section>`;
}

function renderSystems() {
  SYSTEMS.innerHTML = `<section class="rules-tab">
    <div class="search-wrap">
      <input class="search-input" id="rulesSearchProxy" type="search" placeholder="Search all rules..." value="${esc(state.search)}">
      <button class="search-clear" data-view-go="search">⌕</button>
    </div>
    <div class="sec-label">Saved</div>
    <div class="saved-chips">
      ${state.bookmarks.length ? state.bookmarks.slice(0, 6).map((item) => `<button class="saved-chip" data-drawer="${esc(item.target)}"><strong>${esc(item.label)}</strong><small>${esc(item.target)}</small></button>`).join('') : '<button class="saved-chip" data-drawer="part-12"><strong>Quick reference</strong><small>Part 12</small></button><button class="saved-chip" data-drawer="part-11"><strong>Keyword glossary</strong><small>Part 11</small></button>'}
    </div>
    <div class="sec-label">Library</div>
    ${(APP.parts || []).map((part) => `<button class="lib-row" data-library-part="${part.id}">
      <div><span class="lib-kicker">${esc(part.kicker)}</span><div class="lib-title">${esc(part.title)}</div></div>
      <span class="lib-count">${part.rules.length}</span>
    </button>`).join('')}
  </section>
  ${renderLibraryPart()}
  ${drawer()}`;
}

function renderReference() {
  const saved = state.bookmarks;
  REFERENCE.innerHTML = `<div class="reference-layout">
    <section class="workspace-card">
      <div class="workspace-head">
        <div><div class="eyebrow">Saved rules</div><h2>Your table shortcuts</h2><p>Keep repeated rulings here while the full rulebook stays one tap away.</p></div>
      </div>
      <div class="saved-grid">
        ${saved.length ? saved.map((b) => `<button class="saved-card" data-drawer="${esc(b.target)}"><strong>${esc(b.label)}</strong><span>${esc(b.target)}</span></button>`).join('') : '<div class="empty-state">No saved rules yet. Save exact rules from the action workspace or library.</div>'}
      </div>
    </section>
    <section class="side-panel">
      <div class="panel-block"><div class="eyebrow">Quick tools</div>
        <button class="quick-link" data-drawer="part-12">Quick reference</button>
        <button class="quick-link" data-drawer="part-11">Keyword glossary</button>
        <button class="quick-link" id="referencePrintBtn">Printable version</button>
      </div>
      <div class="panel-block"><div class="eyebrow">Common lookups</div>
        <button class="quick-link" data-drawer="part-7::7-1-line-of-sight">Line of sight</button>
        <button class="quick-link" data-drawer="part-4::4-4-unit-coherency">Coherency</button>
        <button class="quick-link" data-drawer="part-6::6-2-how-supply-is-used">Supply</button>
      </div>
    </section>
  </div>
  ${drawer()}`;
}

function runSearch() {
  const q = (state.search || '').trim().toLowerCase();
  if (searchInput) searchInput.value = state.search || '';
  const hits = q.length < 2 ? [] : APP.searchIndex.filter((row) => `${row.title} ${row.meta} ${row.text}`.toLowerCase().includes(q)).slice(0, 80);
  if (searchCount) searchCount.textContent = q.length < 2 ? 'Type at least 2 characters.' : `${hits.length} result${hits.length === 1 ? '' : 's'}`;
  if (searchResults) searchResults.innerHTML = `<div class="search-grid">${hits.map((hit) => `<article class="search-hit">
    <span>${esc(hit.meta)}</span>
    <strong>${esc(hit.title)}</strong>
    <p>${esc(hit.text.slice(0, 180))}${hit.text.length > 180 ? '...' : ''}</p>
    <button class="ghost-btn" data-drawer="${esc(hit.target)}">Open rule</button>
  </article>`).join('')}</div>${drawer()}`;
}

function renderSearch() {
  SEARCH.querySelector('.search-panel')?.classList.add('modern-search');
  runSearch();
}

function setView(view, scroll = true) {
  state.view = view;
  document.querySelectorAll('.view').forEach((el) => el.classList.toggle('active', el.id === `view-${view}`));
  document.querySelectorAll('.nav-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.view === view));
  save();
  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderToc() {
  const list = $('tocList');
  if (!list) return;
  list.innerHTML = APP.parts.map((part) => `<button class="toc-row" data-library-part="${part.id}" data-view-go="systems">
    <span><strong>${esc(part.kicker)} - ${esc(part.title)}</strong><small>${part.rules.length} sections</small></span>
  </button>`).join('');
}

function renderAll(preserveScroll = true) {
  const y = window.scrollY;
  renderHome();
  renderPlay();
  renderSystems();
  renderReference();
  renderSearch();
  renderToc();
  bind();
  setView(state.view, false);
  if (preserveScroll) window.scrollTo({ top: y });
}

function bind() {
  document.querySelectorAll('[data-phase]').forEach((btn) => {
    btn.onclick = () => {
      state.phase = Number(btn.dataset.phase) || 0;
      state.action = currentAction()?.title || '';
      resetPasses();
      save();
      renderAll();
    };
  });
  document.querySelectorAll('[data-action]').forEach((btn) => {
    btn.onclick = () => {
      state.action = btn.dataset.action;
      save();
      renderAll();
    };
  });
  document.querySelectorAll('[data-complete]').forEach((btn) => {
    btn.onclick = () => {
      const key = btn.dataset.complete;
      state.done[key] = !state.done[key];
      save();
      renderAll();
    };
  });
  document.querySelectorAll('[data-next-phase]').forEach((btn) => {
    btn.onclick = () => {
      advancePhase(`Manually advanced from ${phaseTone(currentPhase().phaseClass).name}.`);
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-prev-phase]').forEach((btn) => {
    btn.onclick = () => {
      addLog(`Returned from ${phaseTone(currentPhase().phaseClass).name} phase.`);
      state.phase = Math.max(0, state.phase - 1);
      state.action = currentAction()?.title || '';
      resetPasses();
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-round-inc]').forEach((btn) => {
    btn.onclick = () => {
      state.round = Math.min(5, state.round + 1);
      state.phase = 0;
      resetPasses();
      addLog(`Started round ${state.round}.`);
      save();
      renderAll();
    };
  });
  document.querySelectorAll('[data-round-dec]').forEach((btn) => {
    btn.onclick = () => {
      state.round = Math.max(1, state.round - 1);
      addLog(`Set round to ${state.round}.`);
      save();
      renderAll();
    };
  });
  document.querySelectorAll('[data-vp-inc]').forEach((btn) => {
    btn.onclick = () => {
      const id = btn.dataset.vpInc;
      state.vp[id] = (state.vp[id] || 0) + 1;
      addLog(`${playerName(id)} gained 1 VP.`);
      save();
      renderAll();
    };
  });
  document.querySelectorAll('[data-vp-dec]').forEach((btn) => {
    btn.onclick = () => {
      const id = btn.dataset.vpDec;
      state.vp[id] = Math.max(0, (state.vp[id] || 0) - 1);
      addLog(`${playerName(id)} lost 1 VP.`);
      save();
      renderAll();
    };
  });
  document.querySelectorAll('[data-player-name]').forEach((input) => {
    input.onchange = () => {
      state.players[input.dataset.playerName] = input.value.trim() || (input.dataset.playerName === 'p1' ? 'Player 1' : 'Player 2');
      save();
      renderAll();
    };
  });
  document.querySelectorAll('[data-first-player]').forEach((btn) => {
    btn.onclick = () => {
      state.firstPlayer = btn.dataset.firstPlayer;
      addLog(`${playerName(state.firstPlayer)} took the first player marker.`);
      save();
      renderAll();
    };
  });
  document.querySelectorAll('[data-active-player]').forEach((btn) => {
    btn.onclick = () => {
      const id = btn.dataset.activePlayer;
      if (isAlternatingPhase() && state.passed[id]) {
        addLog(`${playerName(id)} has already passed and cannot activate again this phase.`);
      } else {
        state.activePlayer = id;
        addLog(`${playerName(state.activePlayer)} is active.`);
      }
      save();
      renderAll();
    };
  });
  document.querySelectorAll('[data-swap-active]').forEach((btn) => {
    btn.onclick = () => {
      const next = otherPlayer();
      if (isAlternatingPhase() && state.passed[next]) {
        addLog(`${playerName(next)} has passed; ${playerName(state.activePlayer)} keeps resolving remaining activations.`);
      } else {
        state.activePlayer = next;
        addLog(`${playerName(state.activePlayer)} is active.`);
      }
      save();
      renderAll();
    };
  });
  document.querySelectorAll('[data-pass-player]').forEach((btn) => {
    btn.onclick = () => {
      passActivePlayer();
      save();
      renderAll();
    };
  });
  document.querySelectorAll('[data-log-action]').forEach((btn) => {
    btn.onclick = () => {
      completeActiveAction();
      save();
      renderAll();
    };
  });
  document.querySelectorAll('[data-import-army]').forEach((btn) => {
    btn.onclick = () => {
      importArmy(btn.dataset.importArmy, btn.dataset.faction);
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-clear-army]').forEach((btn) => {
    btn.onclick = (event) => {
      event.stopPropagation();
      clearArmy(btn.dataset.clearArmy);
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-toggle-army]').forEach((btn) => {
    btn.onclick = (event) => {
      event.stopPropagation();
      const player = btn.dataset.toggleArmy;
      state.armyOpen[player] = state.armyOpen[player] === false;
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-army-view]').forEach((btn) => {
    btn.onclick = () => {
      state.armyView = btn.dataset.armyView;
      state.armyFilter = 'all';
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-army-filter]').forEach((btn) => {
    btn.onclick = () => {
      state.armyFilter = btn.dataset.armyFilter;
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-unit-open]').forEach((btn) => {
    btn.onclick = (event) => {
      if (event.target.closest('button')) return;
      const key = `${btn.dataset.unitOpen}:${btn.dataset.unitKey}`;
      state.unitOpen[key] = state.unitOpen[key] === false;
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-open-modal]').forEach((btn) => {
    btn.onclick = () => {
      state.modal = btn.dataset.openModal;
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-open-marker]').forEach((btn) => {
    btn.onclick = () => {
      state.modal = `marker:${btn.dataset.openMarker}`;
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.onclick = () => {
      state.modal = '';
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-scenario-scale]').forEach((input) => {
    input.onchange = () => {
      state.scenario.scaleId = input.value;
      state.scenario.missionId = '';
      state.scenario.mapId = '';
      state.scenario.markers = {};
      addLog(`Set scenario scale to ${selectedScale().name}.`);
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-scenario-scale-value]').forEach((btn) => {
    btn.onclick = () => {
      state.scenario.scaleId = btn.dataset.scenarioScaleValue;
      state.scenario.missionId = '';
      state.scenario.mapId = '';
      state.scenario.markers = {};
      addLog(`Set scenario scale to ${selectedScale().name}.`);
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-scenario-mission]').forEach((input) => {
    input.onchange = () => {
      state.scenario.missionId = input.value;
      state.scenario.markers = {};
      addLog(input.value ? `Selected mission: ${selectedMission()?.name || input.value}.` : 'Cleared mission.');
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-scenario-map]').forEach((input) => {
    input.onchange = () => {
      state.scenario.mapId = input.value;
      state.scenario.markers = {};
      addLog(input.value ? `Selected map: ${selectedMap()?.name || input.value}.` : 'Cleared map.');
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-swap-sides]').forEach((btn) => {
    btn.onclick = () => {
      const sides = scenarioSides();
      sides.p1 = sides.p1 === 'blue' ? 'red' : 'blue';
      sides.p2 = sides.p1 === 'blue' ? 'red' : 'blue';
      addLog(`${playerName('p1')} is now ${sideLabel(sides.p1)}; ${playerName('p2')} is now ${sideLabel(sides.p2)}.`);
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-marker-active]').forEach((btn) => {
    btn.onclick = () => {
      const row = markerState(btn.dataset.markerActive);
      row.active = !row.active;
      addLog(`Mission Marker ${btn.dataset.markerActive} is now ${row.active ? 'active' : 'inactive'}.`);
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-marker-control]').forEach((btn) => {
    btn.onclick = () => {
      const row = markerState(btn.dataset.markerControl);
      row.controller = btn.dataset.controller;
      const label = row.controller === 'neutral' ? 'Neutral' : playerName(row.controller);
      addLog(`Mission Marker ${btn.dataset.markerControl} controlled by ${label}.`);
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-marker-supply]').forEach((btn) => {
    btn.onclick = () => {
      const row = markerState(btn.dataset.markerSupply);
      const key = `${btn.dataset.markerPlayer}Supply`;
      row[key] = Math.max(0, Number(row[key] || 0) + Number(btn.dataset.delta || 0));
      markerState(btn.dataset.markerSupply);
      addLog(`Mission Marker ${btn.dataset.markerSupply}: ${playerName(btn.dataset.markerPlayer)} supply ${row[key]}.`);
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-marker-owner]').forEach((btn) => {
    btn.onclick = () => {
      const row = markerState(btn.dataset.markerOwner);
      if (btn.dataset.owner === 'neutral') {
        row.p1Supply = 0;
        row.p2Supply = 0;
        row.controller = 'neutral';
      } else {
        const player = btn.dataset.owner;
        const other = otherPlayer(player);
        row[`${player}Supply`] = Math.max(Number(row[`${other}Supply`] || 0) + 1, Number(row[`${player}Supply`] || 0), 1);
        row.controller = player;
      }
      markerState(btn.dataset.markerOwner);
      addLog(`Mission Marker ${btn.dataset.markerOwner} controlled by ${row.controller === 'neutral' ? 'Neutral' : playerName(row.controller)}.`);
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-unit-location]').forEach((btn) => {
    btn.onclick = () => {
      const status = unitState(btn.dataset.unitLocation, btn.dataset.unitKey);
      const roster = state.armies[btn.dataset.unitLocation];
      const entry = roster?.units.find((candidate) => candidate.key === btn.dataset.unitKey);
      if (btn.dataset.location === 'battlefield' && entry && !canDeployUnit(btn.dataset.unitLocation, entry)) {
        addLog(`Cannot deploy ${entry.unit.name}: ${deploymentWarning(btn.dataset.unitLocation, entry)}`);
        save();
        renderAll(false);
        return;
      }
      status.location = btn.dataset.location;
      status.destroyed = btn.dataset.location === 'destroyed';
      addLog(`${playerName(btn.dataset.unitLocation)} marked a unit ${btn.dataset.location}.`);
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-unit-toggle]').forEach((btn) => {
    btn.onclick = () => {
      const status = unitState(btn.dataset.unitToggle, btn.dataset.unitKey);
      status[btn.dataset.toggle] = !status[btn.dataset.toggle];
      addLog(`${playerName(btn.dataset.unitToggle)} updated a unit: ${btn.dataset.toggle} ${status[btn.dataset.toggle] ? 'on' : 'off'}.`);
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-model-delta]').forEach((btn) => {
    btn.onclick = () => {
      const player = btn.dataset.modelPlayer;
      const roster = state.armies[player];
      const entry = roster?.units.find((candidate) => candidate.key === btn.dataset.unitKey);
      if (!entry) return;
      const status = unitState(player, btn.dataset.unitKey);
      const next = currentModels(entry, status) + Number(btn.dataset.modelDelta || 0);
      status.models = Math.max(0, Math.min(maxModels(entry), next));
      status.destroyed = status.models <= 0;
      if (status.destroyed) status.location = 'destroyed';
      addLog(`${playerName(player)} set ${entry.unit.name} to ${status.models} models.`);
      save();
      renderAll(false);
    };
  });
  document.querySelectorAll('[data-clear-log]').forEach((btn) => {
    btn.onclick = () => {
      state.log = [];
      save();
      renderAll();
    };
  });
  document.querySelectorAll('[data-drawer]').forEach((btn) => {
    btn.onclick = () => {
      state.drawerTarget = btn.dataset.drawer;
      save();
      renderAll();
    };
  });
  document.querySelectorAll('[data-close-drawer]').forEach((btn) => {
    btn.onclick = () => {
      state.drawerTarget = '';
      save();
      renderAll();
    };
  });
  document.querySelectorAll('[data-bookmark]').forEach((btn) => {
    btn.onclick = () => {
      const target = btn.dataset.bookmark;
      const idx = state.bookmarks.findIndex((b) => b.target === target);
      if (idx >= 0) state.bookmarks.splice(idx, 1);
      else state.bookmarks.unshift({ target, label: targetLabel(target) });
      save();
      renderAll();
    };
  });
  document.querySelectorAll('[data-library-part]').forEach((btn) => {
    btn.onclick = () => {
      state.libraryPart = btn.dataset.libraryPart;
      save();
      if (btn.dataset.viewGo) setView(btn.dataset.viewGo);
      renderAll();
      $('tocSheet')?.classList.add('hidden');
    };
  });
  document.querySelectorAll('[data-view-go]').forEach((btn) => {
    btn.onclick = () => {
      if (btn.dataset.libraryPart) state.libraryPart = btn.dataset.libraryPart;
      state.view = btn.dataset.viewGo;
      save();
      renderAll(false);
      setView(state.view);
    };
  });
  const printBtn = $('referencePrintBtn');
  if (printBtn) printBtn.onclick = () => window.open('print.html', '_blank');
}

function initShell() {
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.onclick = () => setView(btn.dataset.view);
  });
  $('tocBtn').onclick = () => $('tocSheet').classList.remove('hidden');
  $('tocClose').onclick = () => $('tocSheet').classList.add('hidden');
  $('tocCloseBtn').onclick = () => $('tocSheet').classList.add('hidden');
  $('searchBtn').onclick = () => {
    setView('search');
    searchInput?.focus();
  };
  $('printBtn').onclick = () => window.open('print.html', '_blank');
  $('clearGlobalSearch').onclick = () => {
    state.search = '';
    save();
    runSearch();
  };
  searchInput?.addEventListener('input', () => {
    state.search = searchInput.value;
    save();
    runSearch();
    bind();
  });
  $('jumpTop').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  window.addEventListener('scroll', () => $('jumpTop').classList.toggle('hidden', window.scrollY < 500));
}

async function boot() {
  await loadData();
  initShell();
  renderAll(false);
}

boot();
