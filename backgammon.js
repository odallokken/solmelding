(() => {
  'use strict';

  const PLAYERS = ['Arnt', 'Ola', 'Ørjan'];
  const START_POINTS = [[0, 18, 5], [22, 0, 4], [6, 16, 0]];
  const STORAGE_KEY = 'solmelding_backgammon_v1';
  const el = id => document.getElementById(id);
  const dialog = el('bgMode');
  const dateLabel = new Intl.DateTimeFormat('nb-NO', {
    timeZone: 'Europe/Oslo', day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  let lastNonna = null, taps = 0, returnFocus = null, unlocked = false, results = [];

  function resetTaps() { lastNonna = null; taps = 0; }

  function status(message, error = false, id = 'bgStatus') {
    el(id).textContent = message;
    el(id).dataset.error = String(error);
  }

  function totals(entries) {
    const matrix = START_POINTS.map(row => [...row]);
    for (const entry of entries) {
      matrix[PLAYERS.indexOf(entry.winner)][PLAYERS.indexOf(entry.loser)] += entry.points;
    }
    if (matrix.some(row => !Number.isSafeInteger(row.reduce((sum, value) => sum + value, 0)))) {
      throw new Error('Poengsummen er for stor.');
    }
    return matrix;
  }

  function readResults() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const saved = JSON.parse(raw);
    if (!saved || saved.version !== 1 || !Array.isArray(saved.results)) {
      throw new Error('Ukjent format på lagrede resultater.');
    }
    const ids = new Set();
    for (const entry of saved.results) {
      if (!entry || typeof entry.id !== 'string' || !entry.id || ids.has(entry.id)
          || !PLAYERS.includes(entry.winner) || !PLAYERS.includes(entry.loser) || entry.winner === entry.loser
          || !Number.isSafeInteger(entry.points) || entry.points < 1
          || !Number.isSafeInteger(entry.at) || entry.at < 0 || entry.at > 8640000000000000) {
        throw new Error('Et lagret resultat er ugyldig.');
      }
      ids.add(entry.id);
    }
    totals(saved.results);
    return saved.results;
  }

  function node(tag, text, className) {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  }

  function render() {
    const matrix = totals(results);
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
    el('bgHistoryCount').textContent = `(${results.length})`;
    el('bgHistory').replaceChildren(...[...results].reverse().map(entry => {
      const item = node('li', `${entry.winner} +${entry.points} mot ${entry.loser}`);
      const time = node('time', dateLabel.format(entry.at));
      time.dateTime = new Date(entry.at).toISOString();
      item.append(time);
      return item;
    }));
    el('bgUndo').disabled = results.length === 0;
  }

  function load(message = '') {
    try {
      results = readResults();
      render();
      el('bgScoreData').hidden = false;
      el('bgRetry').hidden = true;
      status(message);
      status('', false, 'bgResultStatus');
      status('', false, 'bgUndoStatus');
    } catch (error) {
      console.warn('Kunne ikke lese backgammonresultatene:', error);
      el('bgScoreData').hidden = true;
      el('bgRetry').hidden = false;
      status('Kunne ikke lese lagrede poeng. Ingen data er endret. Kontroller at nettleserlagring er tillatt, og prøv igjen.', true);
    }
  }

  function save(change, message, statusId = 'bgResultStatus') {
    try {
      // Les på nytt før hver endring, slik at en annen fanes resultater beholdes.
      const next = change(readResults());
      totals(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, results: next }));
      results = next;
      render();
      status('', false, 'bgResultStatus');
      status('', false, 'bgUndoStatus');
      status(message, false, statusId);
      return true;
    } catch (error) {
      console.warn('Kunne ikke lagre backgammonresultatet:', error);
      status('Endringen ble ikke lagret. Kontroller nettleserlagring og prøv igjen. ' + error.message, true, statusId);
      return false;
    }
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

  function open(nonna) {
    returnFocus = nonna;
    unlocked = false;
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
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') resetTaps();
  });
  el('bgClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    unlocked = false;
    resetTaps();
    el('bgPin').value = '';
    el('bgScores').hidden = true;
    if (returnFocus && !el('solMode').classList.contains('hidden')) returnFocus.focus({ preventScroll: true });
  });
  el('bgPinForm').addEventListener('submit', event => {
    event.preventDefault();
    if (el('bgPin').value !== '0478') {
      el('bgPinError').textContent = 'Feil PIN-kode. Prøv igjen.';
      el('bgPin').setAttribute('aria-invalid', 'true');
      el('bgPin').focus();
      el('bgPin').select();
      return;
    }
    unlocked = true;
    dialog.classList.add('is-unlocked');
    el('bgPin').value = '';
    el('bgPinForm').hidden = true;
    el('bgScores').hidden = false;
    load();
    el('bgTitle').focus();
    dialog.scrollTop = 0;
  });
  el('bgPin').addEventListener('input', () => {
    el('bgPin').removeAttribute('aria-invalid');
    el('bgPinError').textContent = '';
  });
  el('bgRetry').addEventListener('click', () => { if (unlocked) load(); });
  for (const id of ['bgWinner', 'bgLoser']) {
    el(id).replaceChildren(...PLAYERS.map(name => new Option(name, name)));
  }
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
  el('bgResultForm').addEventListener('submit', event => {
    event.preventDefault();
    if (!unlocked) return;
    const winner = el('bgWinner').value, loser = el('bgLoser').value, value = el('bgPointsInput').value;
    const points = Number(value);
    if (!PLAYERS.includes(winner) || !PLAYERS.includes(loser) || winner === loser) {
      status('Velg to forskjellige spillere.', true, 'bgResultStatus');
      return;
    }
    if (!/^\d+$/.test(value) || !Number.isSafeInteger(points) || points < 1) {
      status('Skriv et positivt heltall som poeng.', true, 'bgResultStatus');
      el('bgPointsInput').focus();
      return;
    }
    if (save(entries => [...entries, {
      id: crypto.randomUUID(), winner, loser, points, at: Date.now(),
    }], `Lagret: ${winner} +${points} poeng mot ${loser}.`)) {
      el('bgPointsInput').value = '1';
      updatePreview();
    }
  });
  el('bgUndo').addEventListener('click', () => {
    if (!unlocked || results.length === 0) return;
    const last = results[results.length - 1];
    save(entries => {
      if (entries[entries.length - 1]?.id !== last.id) {
        throw new Error('Resultatene er endret i en annen fane. Åpne poengtavlen igjen.');
      }
      return entries.slice(0, -1);
    }, `Angret: ${last.winner} +${last.points} poeng mot ${last.loser}.`, 'bgUndoStatus');
  });
  window.addEventListener('storage', event => {
    if (unlocked && (event.key === STORAGE_KEY || event.key === null)) load('Poengene er oppdatert fra en annen fane.');
  });
  updateOpponent();
})();
