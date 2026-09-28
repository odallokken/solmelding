(() => {
  'use strict';

  const PLAYERS = ['Arnt', 'Ola', 'Ørjan'];
  const LEGACY_KEY = 'solmelding_backgammon_v1';
  const API = '/.netlify/functions/scores';
  const el = id => document.getElementById(id);
  const dialog = el('bgMode');
  const dateLabel = new Intl.DateTimeFormat('nb-NO', {
    timeZone: 'Europe/Oslo', day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  let lastNonna = null, taps = 0, returnFocus = null, pin = '', results = [], legacy = [];
  let generation = 0, busy = false, pendingResult = null, pendingUndo = null;

  function resetTaps() { lastNonna = null; taps = 0; }
  function status(message, error = false, id = 'bgStatus') {
    el(id).textContent = message;
    el(id).dataset.error = String(error);
  }
  function setBusy(value) {
    busy = value;
    el('bgResultFields').disabled = value;
    for (const id of ['bgRefresh', 'bgRetry', 'bgImportFile']) el(id).disabled = value;
    el('bgPinForm').querySelector('button').disabled = value;
    el('bgPin').disabled = value;
    el('bgUndo').disabled = value || !results.some(entry => !entry.seed);
    el('bgImport').disabled = value || legacy.length === 0;
  }
  function validEntry(entry) {
    return entry && typeof entry.id === 'string' && /^[a-zA-Z0-9-]{1,80}$/.test(entry.id)
      && PLAYERS.includes(entry.winner) && PLAYERS.includes(entry.loser) && entry.winner !== entry.loser
      && Number.isSafeInteger(entry.points) && entry.points > 0
      && Number.isSafeInteger(entry.at) && entry.at >= 0 && entry.at <= 8640000000000000;
  }
  function parseResults(data, imported = false) {
    if (!data || data.version !== 1 || !Array.isArray(data.results)) throw new Error('Ugyldige poengdata.');
    const ids = new Set();
    for (const entry of data.results) {
      if (!validEntry(entry) || ids.has(entry.id)
          || (imported ? entry.id.startsWith('seed-') || entry.seed : typeof entry.seed !== 'boolean')) {
        throw new Error('En registrering er ugyldig.');
      }
      ids.add(entry.id);
    }
    if (!imported && data.results.filter(entry => entry.seed).length !== 6) {
      throw new Error('Serverens startpoeng mangler.');
    }
    return data.results;
  }
  async function api(method, data, enteredPin = pin) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(API, {
        method, headers: { 'X-Scores-Pin': enteredPin, ...(data ? { 'Content-Type': 'application/json' } : {}) },
        body: data ? JSON.stringify(data) : undefined, signal: controller.signal, cache: 'no-store',
      });
      if (!response.headers.get('Content-Type')?.includes('application/json')) {
        throw new Error(response.status === 429
          ? 'For mange forespørsler. Vent et minutt og prøv igjen.'
          : 'Poengtjenesten er ikke tilgjengelig. Siden må åpnes fra Netlify.');
      }
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Poengtjenesten svarte med en feil.');
      return parseResults(result);
    } finally { clearTimeout(timer); }
  }
  function node(tag, text, className) {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  }
  function render() {
    const matrix = PLAYERS.map(() => PLAYERS.map(() => 0));
    for (const entry of results) matrix[PLAYERS.indexOf(entry.winner)][PLAYERS.indexOf(entry.loser)] += entry.points;
    el('bgTotals').replaceChildren(...PLAYERS.map((name, index) => {
      const card = node('div', undefined, 'bg-total');
      card.append(node('span', name), node('strong', String(matrix[index].reduce((a, b) => a + b, 0))));
      return card;
    }));
    el('bgPairs').replaceChildren(...[[0, 1], [0, 2], [2, 1]].map(([a, b]) => {
      const pair = node('div', undefined, 'bg-pair');
      pair.setAttribute('role', 'group');
      pair.setAttribute('aria-label', `${PLAYERS[a]}: ${matrix[a][b]} poeng mot ${PLAYERS[b]}. ${PLAYERS[b]}: ${matrix[b][a]} poeng mot ${PLAYERS[a]}.`);
      pair.append(node('span', PLAYERS[a]), node('strong', `${matrix[a][b]} – ${matrix[b][a]}`), node('span', PLAYERS[b]));
      return pair;
    }));
    const history = results.filter(entry => !entry.seed);
    el('bgHistoryCount').textContent = `(${history.length})`;
    el('bgHistory').replaceChildren(...history.reverse().map(entry => {
      const item = node('li', `${entry.winner} +${entry.points} mot ${entry.loser}`);
      const time = node('time', dateLabel.format(entry.at));
      time.dateTime = new Date(entry.at).toISOString();
      item.append(time);
      return item;
    }));
  }
  async function load() {
    if (!pin || busy) return;
    const current = generation;
    setBusy(true);
    status('Henter felles poeng …');
    try {
      const next = await api('GET');
      if (current !== generation) return;
      results = next;
      pendingUndo = null;
      render();
      el('bgScoreData').hidden = false;
      el('bgRetry').hidden = true;
      status('Poengene er oppdatert.');
    } catch (error) {
      if (current !== generation) return;
      console.warn('Kunne ikke hente backgammonpoeng:', error);
      el('bgScoreData').hidden = true;
      el('bgRetry').hidden = false;
      status('Kunne ikke hente poengene. ' + error.message, true);
    } finally { if (current === generation) setBusy(false); }
  }
  async function save(method, entry, message, statusId) {
    const current = generation;
    setBusy(true);
    status('Lagrer på serveren …', false, statusId);
    try {
      const next = await api(method, entry);
      if (current !== generation) return false;
      results = next;
      render();
      status(message, false, statusId);
      return true;
    } catch (error) {
      if (current !== generation) return false;
      console.warn('Kunne ikke bekrefte backgammonendringen:', error);
      status('Lagringen er ikke bekreftet. Prøv igjen; samme registrering telles ikke dobbelt. ' + error.message, true, statusId);
      return false;
    } finally { if (current === generation) setBusy(false); }
  }
  function updatePreview() {
    const value = el('bgPointsInput').value;
    el('bgResultPreview').textContent = `${el('bgWinner').value} får ${value || '…'} poeng mot ${el('bgLoser').value}.`;
    for (const button of dialog.querySelectorAll('[data-bg-points]')) {
      button.setAttribute('aria-pressed', String(button.dataset.bgPoints === value));
    }
  }
  function updateOpponent() {
    const winner = el('bgWinner').value, loser = el('bgLoser');
    if (loser.value === winner) loser.value = PLAYERS.find(name => name !== winner);
    for (const option of loser.options) option.disabled = option.value === winner;
    updatePreview();
  }
  function showLegacy(entries) {
    const saved = new Set(results.map(entry => entry.id));
    legacy = entries.filter(entry => !saved.has(entry.id));
    el('bgImportInfo').textContent = legacy.length ? `${legacy.length} gamle registreringer er klare til import.` : 'Ingen nye registreringer å importere.';
    el('bgImport').disabled = busy || !legacy.length;
  }
  function open(nonna) {
    generation++;
    returnFocus = nonna;
    pin = '';
    setBusy(false);
    dialog.classList.remove('is-unlocked');
    el('bgPinForm').hidden = false;
    el('bgScores').hidden = true;
    el('bgPin').value = '';
    el('bgPin').removeAttribute('aria-invalid');
    el('bgPinError').textContent = '';
    el('bgHistoryPanel').open = false;
    solStopMusic();
    solStopNonnaSpeech();
    dialog.showModal();
    dialog.scrollTop = 0;
    el('bgPin').focus();
  }
  document.addEventListener('click', event => {
    if (dialog.open) return;
    const nonna = event.target instanceof Element && event.target.closest('#solNonnas .nonna');
    if (!nonna || el('solMode').classList.contains('hidden')) { resetTaps(); return; }
    taps = lastNonna === nonna ? taps + 1 : 1;
    lastNonna = nonna;
    if (taps === 5) {
      resetTaps();
      event.preventDefault();
      event.stopImmediatePropagation();
      open(nonna);
    }
  }, true);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') resetTaps(); });
  el('bgClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    generation++;
    pin = '';
    setBusy(false);
    resetTaps();
    el('bgPin').value = '';
    el('bgScores').hidden = true;
    if (returnFocus && !el('solMode').classList.contains('hidden')) returnFocus.focus({ preventScroll: true });
  });
  el('bgPinForm').addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    const current = generation, enteredPin = el('bgPin').value;
    setBusy(true);
    el('bgPinError').textContent = 'Kobler til poengtavlen …';
    try {
      const next = await api('GET', undefined, enteredPin);
      if (current !== generation) return;
      pin = enteredPin;
      results = next;
      pendingUndo = null;
      render();
      dialog.classList.add('is-unlocked');
      el('bgPin').value = '';
      el('bgPinForm').hidden = true;
      el('bgScores').hidden = false;
      el('bgScoreData').hidden = false;
      el('bgRetry').hidden = true;
      for (const id of ['bgStatus', 'bgResultStatus', 'bgUndoStatus', 'bgImportStatus']) status('', false, id);
      try {
        const old = localStorage.getItem(LEGACY_KEY);
        showLegacy(old ? parseResults(JSON.parse(old), true) : []);
      } catch (error) {
        console.warn('Kunne ikke lese gamle lokale poeng:', error);
        showLegacy([]);
        status('Gamle lokale poeng kunne ikke leses. Ingen lokale data er endret.', true, 'bgImportStatus');
      }
      el('bgTitle').focus();
      dialog.scrollTop = 0;
    } catch (error) {
      if (current !== generation) return;
      console.warn('Kunne ikke åpne poengtavlen:', error);
      el('bgPinError').textContent = error.message;
      el('bgPin').setAttribute('aria-invalid', 'true');
    } finally { if (current === generation) setBusy(false); }
  });
  el('bgPin').addEventListener('input', () => {
    el('bgPin').removeAttribute('aria-invalid');
    el('bgPinError').textContent = '';
  });
  el('bgRetry').addEventListener('click', load);
  el('bgRefresh').addEventListener('click', load);
  for (const id of ['bgWinner', 'bgLoser']) el(id).replaceChildren(...PLAYERS.map(name => new Option(name, name)));
  el('bgLoser').value = 'Ola';
  el('bgWinner').addEventListener('change', updateOpponent);
  el('bgLoser').addEventListener('change', updatePreview);
  el('bgPointsInput').addEventListener('input', updatePreview);
  for (const button of dialog.querySelectorAll('[data-bg-points]')) {
    button.addEventListener('click', () => {
      el('bgPointsInput').value = button.dataset.bgPoints;
      updatePreview();
    });
  }
  el('bgResultForm').addEventListener('submit', async event => {
    event.preventDefault();
    if (!pin || busy) return;
    const winner = el('bgWinner').value, loser = el('bgLoser').value, value = el('bgPointsInput').value;
    const points = Number(value);
    if (!PLAYERS.includes(winner) || !PLAYERS.includes(loser) || winner === loser
        || !/^\d+$/.test(value) || !Number.isSafeInteger(points) || points < 1) {
      status('Velg to forskjellige spillere og et positivt heltall som poeng.', true, 'bgResultStatus');
      return;
    }
    if (!pendingResult || pendingResult.winner !== winner || pendingResult.loser !== loser || pendingResult.points !== points) {
      pendingResult = { id: crypto.randomUUID(), winner, loser, points };
    }
    if (await save('POST', pendingResult, `Lagret: ${winner} +${points} poeng mot ${loser}.`, 'bgResultStatus')) {
      pendingResult = null;
      el('bgPointsInput').value = '1';
      updatePreview();
    }
  });
  el('bgUndo').addEventListener('click', async () => {
    if (!pin || busy) return;
    pendingUndo = pendingUndo || results.filter(entry => !entry.seed).at(-1);
    if (!pendingUndo) return;
    if (await save('DELETE', { id: pendingUndo.id }, `Angret: ${pendingUndo.winner} +${pendingUndo.points} mot ${pendingUndo.loser}.`, 'bgUndoStatus')) {
      pendingUndo = null;
    }
  });
  el('bgImportFile').addEventListener('change', async () => {
    const file = el('bgImportFile').files[0];
    if (!file) return;
    const current = generation;
    setBusy(true);
    try {
      if (file.size > 1000000) throw new Error('Filen er for stor.');
      const imported = parseResults(JSON.parse(await file.text()), true);
      if (current !== generation) return;
      showLegacy(imported);
      status('', false, 'bgImportStatus');
    } catch (error) {
      if (current !== generation) return;
      showLegacy([]);
      status('Sikkerhetskopien kunne ikke leses. ' + error.message, true, 'bgImportStatus');
    } finally { if (current === generation) setBusy(false); }
  });
  el('bgImport').addEventListener('click', async () => {
    if (!pin || busy || !legacy.length) return;
    const current = generation;
    setBusy(true);
    let count = 0;
    const total = legacy.length;
    try {
      while (legacy.length) {
        const next = await api('POST', legacy[0]);
        if (current !== generation) return;
        results = next;
        legacy.shift();
        render();
        status(`Importert ${++count} av ${total}.`, false, 'bgImportStatus');
      }
      status('Import fullført. De gamle lokale dataene er beholdt.', false, 'bgImportStatus');
      showLegacy([]);
    } catch (error) {
      if (current !== generation) return;
      console.warn('Import av gamle poeng stoppet:', error);
      showLegacy(legacy);
      status(`Import stoppet etter ${count} registreringer. Prøv igjen; allerede importerte resultater telles ikke dobbelt. ${error.message}`, true, 'bgImportStatus');
    } finally { if (current === generation) setBusy(false); }
  });
  updateOpponent();
})();
