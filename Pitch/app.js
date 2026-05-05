// ============================================================
// AI GAME ENGINE — PITCH PAGE
// ============================================================

// ── Step Navigation ───────────────────────────────────────────
document.querySelectorAll('.step-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const step = btn.dataset.step;
    document.querySelectorAll('.step-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.step === step)
    );
    document.querySelectorAll('.step-view').forEach(v =>
      v.classList.toggle('active', v.dataset.step === step)
    );
  });
});

// ── Card expand buttons ───────────────────────────────────────
function initCardBtn(btnId, expandId, labelOpen, labelClose) {
  const btn    = document.getElementById(btnId);
  const expand = document.getElementById(expandId);
  const card   = btn && btn.closest('.pipeline-card');
  if (!btn || !expand) return;
  btn.addEventListener('click', () => {
    const open = expand.classList.toggle('open');
    if (card) card.classList.toggle('expanded', open);
    btn.textContent = open ? labelClose : labelOpen;
  });
}

initCardBtn('methodology-btn',  'methodology-expand', 'Methodology', 'Hide');
initCardBtn('add-prompt-btn',  'prompt-expand',      'Add prompt',  'Hide prompt');

initCardBtn('web-methodology-btn', 'web-methodology-expand', 'Methodology', 'Hide');

initCardBtn('refine-prompt-btn', 'refine-prompt-expand', 'Add prompt', 'Hide prompt');

initCardBtn('engine-methodology-btn', 'engine-methodology-expand', 'Methodology', 'Hide');
initCardBtn('engine-prompt-btn',      'engine-prompt-expand',      'Add prompt',  'Hide prompt');

// ── Core-loop prompt cards: type out the prompt text when expanded ─────────
['prompt-expand', 'refine-prompt-expand', 'engine-prompt-expand'].forEach(id => {
  const expand = document.getElementById(id);
  if (!expand) return;
  const target = expand.querySelector('.card-expand-text');
  if (!target) return;
  target.dataset.full = target.textContent.trim();
  target.textContent = '';
  const observer = new MutationObserver(() => {
    if (expand.classList.contains('open')) typeCorePrompt(target);
  });
  observer.observe(expand, { attributes: true, attributeFilter: ['class'] });
});

function typeCorePrompt(el) {
  const text = el.dataset.full || '';
  const token = String(Date.now()) + Math.random();
  el.dataset.token = token;
  el.textContent = '';
  el.classList.add('is-typing');

  // Hide everything that appears after the prompt text until typing finishes.
  const followers = [];
  let sib = el.nextElementSibling;
  while (sib) { followers.push(sib); sib = sib.nextElementSibling; }
  followers.forEach(f => { f.classList.remove('is-revealed'); f.classList.add('is-pending'); });

  let i = 0;
  const tick = () => {
    if (el.dataset.token !== token) return;
    el.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(tick, 12);
    else {
      el.classList.remove('is-typing');
      followers.forEach((f, idx) => {
        setTimeout(() => {
          if (el.dataset.token !== token) return;
          f.classList.remove('is-pending');
          f.classList.add('is-revealed');
        }, 60 * idx);
      });
    }
  };
  tick();
}

// ── Web Prototype — show prototype button ─────────────────────
const showProtoBtn = document.getElementById('show-proto-btn');
const protoExpand  = document.getElementById('proto-expand');
const protoCard    = document.getElementById('web-proto-card');
let blockBlastInit = false;

if (showProtoBtn && protoExpand) {
  showProtoBtn.addEventListener('click', () => {
    const open = protoExpand.classList.toggle('open');
    protoCard.classList.toggle('expanded', open);
    showProtoBtn.textContent = open ? 'Hide prototype' : 'Show prototype';
    if (open && !blockBlastInit) {
      blockBlastInit = true;
      const demo = new BlockBlastDemo(document.getElementById('block-blast-game'));
      demo.startAutoPlay();
    }
  });
}

// ── Refinement — show refined prototype ───────────────────────
const refineProtoBtn    = document.getElementById('refine-proto-btn');
const refineProtoExpand = document.getElementById('refine-proto-expand');
const refinementCard    = document.getElementById('refinement-card');
let refinedBlastInit = false;

if (refineProtoBtn && refineProtoExpand) {
  refineProtoBtn.addEventListener('click', () => {
    const open = refineProtoExpand.classList.toggle('open');
    refinementCard.classList.toggle('expanded', open);
    refineProtoBtn.textContent = open ? 'Hide prototype' : 'Show prototype';
    if (open && !refinedBlastInit) {
      refinedBlastInit = true;
      const demo = new BlockBlastDemo(document.getElementById('block-blast-refined'), { refined: true });
      demo.startAutoPlay();
    }
  });
}

// ============================================================
// BLOCK BLAST GAME
// ============================================================

class BlockBlastDemo {
  constructor(el, opts = {}) {
    this.COLS = 8;
    this.ROWS = 8;
    this.el = el;
    this.refined = !!opts.refined;
    this.pieceProvider = opts.pieceProvider || null;
    this.board = opts.initialBoard ? opts.initialBoard.map(r => [...r]) : this.emptyBoard();
    this.pieces = opts.initialPieces
      ? opts.initialPieces.map(p => ({ ...p, placed: false }))
      : this.dealPieces();
    this.selected = null;
    this.score = 0;
    this.buildDOM();
    this.render();
  }

  loadLevel({ board, pieces }) {
    this.autoPlay = false;
    this.board = board ? board.map(r => [...r]) : this.emptyBoard();
    this.pieces = pieces ? pieces.map(p => ({ ...p, placed: false })) : this.dealPieces();
    this.selected = null;
    this.score = 0;
    this.clearPreview();
    this.render();
    this.renderPieces();
    const msg = this.el.querySelector('#bb-msg');
    if (msg) msg.textContent = '';
  }

  emptyBoard() {
    return Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(null));
  }

  get PIECE_DEFS() {
    return [
      { s: [[1,1,1,1]],           c: '#00a1e1' },
      { s: [[1,1,1]],             c: '#06b6d4' },
      { s: [[1,1],[1,1]],         c: '#f59e0b' },
      { s: [[0,1,0],[1,1,1]],     c: '#a78bfa' },
      { s: [[1,0],[1,0],[1,1]],   c: '#f97316' },
      { s: [[0,1],[0,1],[1,1]],   c: '#10b981' },
      { s: [[0,1,1],[1,1,0]],     c: '#ef4444' },
      { s: [[1,1,0],[0,1,1]],     c: '#ec4899' },
      { s: [[1,1],[1,0]],         c: '#8b5cf6' },
      { s: [[1,0],[1,1]],         c: '#14b8a6' },
      { s: [[1,1,1],[1,0,0]],     c: '#84cc16' },
      { s: [[1]],                 c: '#94a3b8' },
      { s: [[1,1]],               c: '#38bdf8' },
    ];
  }

  dealPieces() {
    if (this.pieceProvider) {
      return this.pieceProvider().map(p => ({ ...p, placed: false }));
    }
    const defs = this.PIECE_DEFS;
    return [0, 1, 2].map(() => {
      const def = defs[Math.floor(Math.random() * defs.length)];
      return { s: def.s, c: def.c, placed: false };
    });
  }

  buildDOM() {
    this.el.innerHTML = `
      <div class="bb-score">Score: <span id="bb-score-val">0</span></div>
      <div class="bb-grid" id="bb-grid"></div>
      <div class="bb-pieces" id="bb-pieces"></div>
      <div class="bb-msg" id="bb-msg"></div>`;

    const grid = this.el.querySelector('#bb-grid');
    this.cells = [];
    for (let r = 0; r < this.ROWS; r++) {
      const row = [];
      for (let c = 0; c < this.COLS; c++) {
        const cell = document.createElement('div');
        cell.className = 'bb-cell';
        cell.addEventListener('mouseenter', () => this.preview(r, c));
        cell.addEventListener('mouseleave', () => this.clearPreview());
        cell.addEventListener('click', () => this.place(r, c));
        grid.appendChild(cell);
        row.push(cell);
      }
      this.cells.push(row);
    }
    this.renderPieces();
  }

  renderPieces() {
    const container = this.el.querySelector('#bb-pieces');
    container.innerHTML = '';
    this.pieces.forEach((piece, i) => {
      if (piece.placed) {
        const ghost = document.createElement('div');
        ghost.className = 'bb-piece';
        ghost.style.opacity = '0.2';
        container.appendChild(ghost);
        return;
      }
      const pieceEl = document.createElement('div');
      pieceEl.className = 'bb-piece' + (this.selected === i ? ' selected' : '');
      pieceEl.addEventListener('click', () => {
        this.selected = this.selected === i ? null : i;
        this.clearPreview();
        this.renderPieces();
      });
      const shapeEl = document.createElement('div');
      shapeEl.className = 'bb-piece-shape';
      shapeEl.style.gridTemplateColumns = `repeat(${piece.s[0].length}, 11px)`;
      piece.s.forEach(row => {
        row.forEach(v => {
          const c = document.createElement('div');
          c.className = 'bb-piece-cell' + (v ? ' on' : '');
          if (v) c.style.background = piece.c;
          shapeEl.appendChild(c);
        });
      });
      pieceEl.appendChild(shapeEl);
      container.appendChild(pieceEl);
    });
  }

  canPlace(s, r, c) {
    for (let dr = 0; dr < s.length; dr++) {
      for (let dc = 0; dc < s[dr].length; dc++) {
        if (!s[dr][dc]) continue;
        const nr = r + dr, nc = c + dc;
        if (nr >= this.ROWS || nc >= this.COLS || this.board[nr][nc]) return false;
      }
    }
    return true;
  }

  preview(r, c) {
    this.clearPreview();
    if (this.selected === null) return;
    const piece = this.pieces[this.selected];
    if (piece.placed) return;
    const ok = this.canPlace(piece.s, r, c);
    for (let dr = 0; dr < piece.s.length; dr++) {
      for (let dc = 0; dc < piece.s[dr].length; dc++) {
        if (!piece.s[dr][dc]) continue;
        const nr = r + dr, nc = c + dc;
        if (nr < this.ROWS && nc < this.COLS) {
          const cell = this.cells[nr][nc];
          cell.classList.add(ok ? 'bb-preview-ok' : 'bb-preview-no');
          if (ok) cell.style.setProperty('--preview-color', piece.c);
        }
      }
    }
  }

  clearPreview() {
    this.cells.forEach(row => row.forEach(cell => {
      cell.classList.remove('bb-preview-ok', 'bb-preview-no');
      cell.style.removeProperty('--preview-color');
    }));
  }

  place(r, c) {
    if (this.selected === null) return;
    const piece = this.pieces[this.selected];
    if (piece.placed || !this.canPlace(piece.s, r, c)) return;

    for (let dr = 0; dr < piece.s.length; dr++) {
      for (let dc = 0; dc < piece.s[dr].length; dc++) {
        if (piece.s[dr][dc]) this.board[r + dr][c + dc] = piece.c;
      }
    }

    piece.placed = true;
    this.selected = null;
    this.clearPreview();

    const cleared = this.clearLines();
    this.score += cleared * 80 + 10;

    if (this.pieces.every(p => p.placed)) {
      this.pieces = this.dealPieces();
    }

    this.render();
    this.renderPieces();
    this.checkGameOver();
  }

  clearLines() {
    const fullRows = [];
    const fullCols = [];
    for (let r = 0; r < this.ROWS; r++) {
      if (this.board[r].every(c => c !== null)) fullRows.push(r);
    }
    for (let c = 0; c < this.COLS; c++) {
      if (this.board.every(row => row[c] !== null)) fullCols.push(c);
    }

    const cleared = fullRows.length + fullCols.length;

    if (this.refined && cleared > 0) {
      // Mark cells as clearing for CSS animation
      const clearing = new Set();
      fullRows.forEach(r => {
        for (let c = 0; c < this.COLS; c++) clearing.add(`${r},${c}`);
      });
      fullCols.forEach(c => {
        for (let r = 0; r < this.ROWS; r++) clearing.add(`${r},${c}`);
      });
      clearing.forEach(key => {
        const [r, c] = key.split(',').map(Number);
        const cell = this.cells[r][c];
        if (cell) cell.classList.add('clearing');
      });

      // Floating score popup
      const points = cleared * 80;
      this._showScorePopup(`+${points}`);

      // Clean up clearing class after animation
      setTimeout(() => {
        clearing.forEach(key => {
          const [r, c] = key.split(',').map(Number);
          const cell = this.cells[r][c];
          if (cell) cell.classList.remove('clearing');
        });
      }, 550);
    }

    fullRows.forEach(r => { for (let c = 0; c < this.COLS; c++) this.board[r][c] = null; });
    fullCols.forEach(c => { for (let r = 0; r < this.ROWS; r++) this.board[r][c] = null; });
    return cleared;
  }

  _showScorePopup(text) {
    if (!this.el) return;
    const popup = document.createElement('div');
    popup.className = 'bb-score-popup';
    popup.textContent = text;
    this.el.appendChild(popup);
    setTimeout(() => popup.remove(), 1100);
  }

  checkGameOver() {
    const active = this.pieces.filter(p => !p.placed);
    const stuck = active.length > 0 && !active.some(p => {
      for (let r = 0; r < this.ROWS; r++) {
        for (let c = 0; c < this.COLS; c++) {
          if (this.canPlace(p.s, r, c)) return true;
        }
      }
      return false;
    });
    const msg = this.el.querySelector('#bb-msg');
    if (stuck) {
      msg.textContent = 'Game over — click to restart';
      msg.onclick = () => {
        this.board = this.emptyBoard();
        this.pieces = this.dealPieces();
        this.selected = null;
        this.score = 0;
        msg.textContent = '';
        this.render();
        this.renderPieces();
      };
    }
  }

  render() {
    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        const cell = this.cells[r][c];
        const color = this.board[r][c];
        cell.style.background = color || '';
        cell.style.boxShadow = color ? 'inset 0 0 0 1px rgba(255,255,255,0.18)' : '';
      }
    }
    const scoreEl = this.el.querySelector('#bb-score-val');
    if (scoreEl) scoreEl.textContent = this.score;
  }

  // ── Auto-play bot ─────────────────────────────────────────────
  startAutoPlay() {
    this.autoPlay = true;
    this._scheduleBot(900);
  }

  _scheduleBot(delay) {
    if (!this.autoPlay) return;
    setTimeout(() => this._botStep(), delay);
  }

  _botStep() {
    if (!this.autoPlay) return;

    // Find unplaced pieces
    const available = this.pieces
      .map((p, i) => ({ ...p, i }))
      .filter(p => !p.placed);

    if (available.length === 0) {
      // All placed — new deal happens in place(), just re-render
      this._scheduleBot(600);
      return;
    }

    // Pick piece + best placement
    let best = null;

    for (const piece of available) {
      for (let r = 0; r < this.ROWS; r++) {
        for (let c = 0; c < this.COLS; c++) {
          if (!this.canPlace(piece.s, r, c)) continue;
          const score = this._scoreMove(piece.s, r, c);
          if (!best || score > best.score) {
            best = { pieceIdx: piece.i, r, c, score };
          }
        }
      }
    }

    if (!best) {
      // No valid moves — restart
      this.board = this.emptyBoard();
      this.pieces = this.dealPieces();
      this.selected = null;
      this.score = 0;
      this.render();
      this.renderPieces();
      this._scheduleBot(1200);
      return;
    }

    // Animate: highlight piece briefly, then place
    this.selected = best.pieceIdx;
    this.renderPieces();
    this.preview(best.r, best.c);

    setTimeout(() => {
      this.clearPreview();
      this.place(best.r, best.c);
      this._scheduleBot(this.pieces.every(p => p.placed) ? 700 : 500);
    }, 380);
  }

  _scoreMove(s, r, c) {
    // Simulate placing the piece
    const sim = this.board.map(row => [...row]);
    for (let dr = 0; dr < s.length; dr++) {
      for (let dc = 0; dc < s[dr].length; dc++) {
        if (s[dr][dc]) sim[r + dr][c + dc] = 'x';
      }
    }

    // Count completable rows and cols
    let clearable = 0;
    for (let row = 0; row < this.ROWS; row++) {
      if (sim[row].every(v => v !== null)) clearable++;
    }
    for (let col = 0; col < this.COLS; col++) {
      if (sim.every(row => row[col] !== null)) clearable++;
    }

    // Prefer center placement to keep edges open
    const centerR = this.ROWS / 2, centerC = this.COLS / 2;
    const distFromCenter = Math.abs(r - centerR) + Math.abs(c - centerC);

    // Add some randomness so it doesn't look mechanical
    const jitter = Math.random() * 2;

    return clearable * 12 - distFromCenter * 0.3 + jitter;
  }
}

// ============================================================
// STEP 2 — LEVEL DESIGN (single card, final-solution view)
// ============================================================

function rng(seed) {
  let s = seed >>> 0;
  return function() {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashParams(p) {
  const s = `${p.solutions}|${p.rounds}|${p.sqrMin}|${p.sqrMax}|${p.totalMin}|${p.totalMax}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function difficultyScore(p) {
  const solFactor = { 10: 0.0, 5: 0.34, 2: 0.68, 1: 1.0 }[p.solutions] ?? Math.max(0, Math.min(1, (10 - p.solutions) / 9));
  const roundsFactor = Math.min(1, (p.rounds - 1) / 9);
  const sqrAvgFactor = Math.min(1, (((p.sqrMin + p.sqrMax) / 2) - 1) / 14);
  const totalAvgFactor = Math.min(1, (((p.totalMin + p.totalMax) / 2) - 10) / 190);
  const rangeVarFactor = Math.min(1, (p.sqrMax - p.sqrMin) / 14);
  const W = { sol: 3.5, rounds: 1.5, sqrAvg: 2.0, totalAvg: 1.5, range: 1.5 };
  const raw =
    solFactor * W.sol +
    roundsFactor * W.rounds +
    sqrAvgFactor * W.sqrAvg +
    totalAvgFactor * W.totalAvg +
    rangeVarFactor * W.range;
  return Math.max(0, Math.min(10, raw));
}

const PIECE_LIBRARY_2 = [
  // simple
  { s: [[1]],             c: '#94a3b8', size: 1 },
  { s: [[1,1]],           c: '#38bdf8', size: 2 },
  { s: [[1],[1]],         c: '#60a5fa', size: 2 },
  { s: [[1,1,1]],         c: '#06b6d4', size: 3 },
  { s: [[1],[1],[1]],     c: '#22d3ee', size: 3 },
  // medium
  { s: [[1,1],[1,1]],     c: '#f59e0b', size: 4 },
  { s: [[1,1,1,1]],       c: '#00a1e1', size: 4 },
  { s: [[1,1],[1,0]],     c: '#8b5cf6', size: 3 },
  { s: [[1,0],[1,1]],     c: '#14b8a6', size: 3 },
  // complex
  { s: [[0,1,0],[1,1,1]], c: '#a78bfa', size: 4 },
  { s: [[1,0],[1,0],[1,1]], c: '#f97316', size: 4 },
  { s: [[0,1],[0,1],[1,1]], c: '#10b981', size: 4 },
  { s: [[1,1,1],[1,0,0]], c: '#84cc16', size: 4 },
];

function pickPieces(params) {
  const r = rng(hashParams(params));
  // Complexity gating: lower solutionsCount → more complex pieces preferred
  const tierMax = params.solutions >= 10 ? 3 : params.solutions >= 5 ? 4 : params.solutions >= 2 ? 4 : 4;
  const preferLarge = params.solutions <= 2;
  const pool = PIECE_LIBRARY_2.filter(p => p.size <= tierMax);

  // Total pieces: roughly rounds × 3
  const N = Math.max(3, Math.min(12, params.rounds * 3));
  const pieces = [];
  const targetAvg = (params.sqrMin + params.sqrMax) / 2;

  for (let i = 0; i < N; i++) {
    // Bias pool toward target size
    const candidates = pool.filter(p => p.size >= params.sqrMin - 1 && p.size <= params.sqrMax + 1);
    const src = candidates.length ? candidates : pool;
    let idx;
    if (preferLarge) {
      // pick weighted toward larger
      const weights = src.map(p => p.size);
      const total = weights.reduce((a, b) => a + b, 0);
      let pick = r() * total;
      idx = 0;
      for (let k = 0; k < weights.length; k++) {
        pick -= weights[k];
        if (pick <= 0) { idx = k; break; }
      }
    } else {
      idx = Math.floor(r() * src.length);
    }
    const def = src[idx];
    pieces.push({ s: def.s.map(row => [...row]), c: def.c });
  }
  return pieces;
}

// ── Solver — backtrack until all pieces fit ────────────────
function canPlaceAt(board, s, r, c) {
  const ROWS = 8, COLS = 8;
  for (let dr = 0; dr < s.length; dr++) {
    for (let dc = 0; dc < s[dr].length; dc++) {
      if (!s[dr][dc]) continue;
      const nr = r + dr, nc = c + dc;
      if (nr >= ROWS || nc >= COLS || board[nr][nc] !== null) return false;
    }
  }
  return true;
}

function placeOn(board, piece, r, c, mark) {
  const next = board.map(row => [...row]);
  for (let dr = 0; dr < piece.s.length; dr++) {
    for (let dc = 0; dc < piece.s[dr].length; dc++) {
      if (piece.s[dr][dc]) next[r + dr][c + dc] = mark;
    }
  }
  return next;
}

function clearLines(board) {
  const ROWS = 8, COLS = 8;
  const next = board.map(r => [...r]);
  const fullRows = [];
  const fullCols = [];
  for (let r = 0; r < ROWS; r++) if (next[r].every(v => v !== null)) fullRows.push(r);
  for (let c = 0; c < COLS; c++) if (next.every(row => row[c] !== null)) fullCols.push(c);
  fullRows.forEach(r => { for (let c = 0; c < COLS; c++) next[r][c] = null; });
  fullCols.forEach(c => { for (let r = 0; r < ROWS; r++) next[r][c] = null; });
  return next;
}

function solve(pieces, maxTimeMs = 200) {
  const start = Date.now();
  const emptyBoard = Array.from({ length: 8 }, () => Array(8).fill(null));

  function backtrack(board, remaining, path) {
    if (Date.now() - start > maxTimeMs) return null;
    if (remaining.length === 0) return path;

    for (let pi = 0; pi < remaining.length; pi++) {
      const piece = remaining[pi];
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (!canPlaceAt(board, piece.s, r, c)) continue;
          const placed = placeOn(board, piece, r, c, piece.c);
          const cleared = clearLines(placed);
          const nextRem = remaining.filter((_, i) => i !== pi);
          const result = backtrack(cleared, nextRem, [
            ...path,
            { piece, origIdx: piece._origIdx, r, c },
          ]);
          if (result) return result;
        }
      }
    }
    return null;
  }

  const tagged = pieces.map((p, i) => ({ ...p, _origIdx: i }));
  return backtrack(emptyBoard, tagged, []);
}

// Replay a solve to compute final board state
function replaySolution(path) {
  let board = Array.from({ length: 8 }, () => Array(8).fill(null));
  for (const step of path) {
    board = placeOn(board, step.piece, step.r, step.c, step.piece.c);
    board = clearLines(board);
  }
  return board;
}

// ── STEP 2 CONTROLLER ────────────────────────────────────────
const Step2 = {
  params: { solutions: 2, rounds: 3, sqrMin: 3, sqrMax: 6, totalMin: 25, totalMax: 50 },

  init() {
    if (this._inited) return;
    this._inited = true;
    this.bindParams();
    this.regenerate();
  },

  regenerate() {
    this.updateDifficultyReadout();
    this.renderSolution();
  },

  updateDifficultyReadout() {
    const score = difficultyScore(this.params);
    const pct = (score / 10 * 100) + '%';
    const scoreEl = document.getElementById('dr-score');
    const barEl = document.getElementById('dr-bar-fill');
    if (scoreEl) scoreEl.textContent = score.toFixed(1);
    if (barEl) barEl.style.width = pct;
    const sdbScore = document.getElementById('sdb-score');
    const sdbBar = document.getElementById('sdb-bar-fill');
    if (sdbScore) sdbScore.textContent = score.toFixed(1);
    if (sdbBar) sdbBar.style.width = pct;
  },

  renderSolution() {
    const host = document.getElementById('solution-view');
    const caption = document.getElementById('solution-caption');
    if (!host) return;

    let pieces = pickPieces(this.params);
    // Order pieces by original index into solve; solver picks its own order
    pieces = pieces.map((p, i) => ({ ...p, _genIdx: i }));

    const path = solve(pieces, 250);
    if (!path) {
      host.innerHTML = `<div class="sol-empty">No solution found for these parameters —<br>loosen a constraint.</div>`;
      if (caption) caption.textContent = 'Solver could not fit all pieces; try relaxing squares or rounds.';
      return;
    }

    const finalBoard = replaySolution(path);

    // Map each cell to the step index that placed the color there (for ordering overlay)
    const cellStep = Array.from({ length: 8 }, () => Array(8).fill(null));
    let boardSim = Array.from({ length: 8 }, () => Array(8).fill(null));
    path.forEach((step, idx) => {
      // Mark cells placed in this step
      for (let dr = 0; dr < step.piece.s.length; dr++) {
        for (let dc = 0; dc < step.piece.s[dr].length; dc++) {
          if (step.piece.s[dr][dc]) {
            cellStep[step.r + dr][step.c + dc] = idx + 1;
          }
        }
      }
      boardSim = placeOn(boardSim, step.piece, step.r, step.c, step.piece.c);
      const before = boardSim.map(r => [...r]);
      boardSim = clearLines(boardSim);
      // If a cell got cleared its step number persists as "transient" — but final cell value determines visible color
    });

    // Build grid HTML using finalBoard for color, cellStep for order number (only if cell still filled)
    let gridHTML = '<div class="sol-grid">';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const color = finalBoard[r][c];
        if (color) {
          const n = cellStep[r][c] ?? '';
          gridHTML += `<div class="sol-cell filled" style="background:${color}">${n}</div>`;
        } else {
          gridHTML += `<div class="sol-cell"></div>`;
        }
      }
    }
    gridHTML += '</div>';

    // Pieces strip (in solver-chosen order)
    let piecesHTML = '<div class="sol-pieces">';
    path.forEach((step, idx) => {
      const p = step.piece;
      piecesHTML += `<div class="sol-piece"><div class="sol-piece-num">${idx + 1}</div>`;
      piecesHTML += `<div class="sol-piece-shape" style="grid-template-columns:repeat(${p.s[0].length},6px)">`;
      p.s.forEach(row => {
        row.forEach(v => {
          piecesHTML += v
            ? `<div class="sol-piece-cell on" style="background:${p.c}"></div>`
            : `<div class="sol-piece-cell"></div>`;
        });
      });
      piecesHTML += '</div></div>';
    });
    piecesHTML += '</div>';

    host.innerHTML = gridHTML + piecesHTML;

    const filledCount = finalBoard.flat().filter(v => v !== null).length;
    if (caption) {
      caption.textContent = `${path.length} pieces dealt in order — all fit on the grid.`;
    }
  },

  bindParams() {
    const clamp = (el) => {
      const lo = parseFloat(el.min);
      const hi = parseFloat(el.max);
      let v = parseFloat(el.value);
      if (Number.isNaN(v)) v = lo;
      if (v < lo) v = lo;
      if (v > hi) v = hi;
      el.value = v;
      return v;
    };

    this.bindSingle('slider-solutions', 'param-solutions', (v) => {
      this.params.solutions = v;
      this.regenerate();
    }, clamp);

    this.bindSingle('slider-rounds', 'param-rounds', (v) => {
      this.params.rounds = v;
      this.regenerate();
    }, clamp);

    this.bindDualWithInputs('slider-sqr', 'param-sqr-min', 'param-sqr-max', (min, max) => {
      this.params.sqrMin = min;
      this.params.sqrMax = max;
      this.regenerate();
    }, clamp);

    this.bindDualWithInputs('slider-total', 'param-total-min', 'param-total-max', (min, max) => {
      this.params.totalMin = min;
      this.params.totalMax = max;
      this.updateDifficultyReadout();
    }, clamp);
  },

  bindSingle(sliderId, inputId, onChange, clamp) {
    const slider = document.getElementById(sliderId);
    const input = document.getElementById(inputId);
    if (!slider || !input) return;
    slider.addEventListener('input', () => {
      input.value = slider.value;
      onChange(parseFloat(slider.value));
    });
    const commitInput = () => {
      const v = clamp(input);
      slider.value = v;
      onChange(v);
    };
    input.addEventListener('change', commitInput);
    input.addEventListener('blur', commitInput);
  },

  bindDualWithInputs(dualId, minInputId, maxInputId, onChange, clamp) {
    const wrap = document.getElementById(dualId);
    const minInput = document.getElementById(minInputId);
    const maxInput = document.getElementById(maxInputId);
    if (!wrap || !minInput || !maxInput) return;
    const sMin = wrap.querySelector('.range-min');
    const sMax = wrap.querySelector('.range-max');
    const fill = wrap.querySelector('.range-fill');
    const lo = parseFloat(wrap.dataset.min);
    const hi = parseFloat(wrap.dataset.max);

    const paint = (a, b) => {
      const pa = ((a - lo) / (hi - lo)) * 100;
      const pb = ((b - lo) / (hi - lo)) * 100;
      fill.style.left = pa + '%';
      fill.style.width = (pb - pa) + '%';
    };

    const fromSliders = () => {
      let a = parseFloat(sMin.value);
      let b = parseFloat(sMax.value);
      if (a > b) { a = b; sMin.value = a; }
      minInput.value = a;
      maxInput.value = b;
      paint(a, b);
      onChange(a, b);
    };
    const fromInputs = () => {
      let a = clamp(minInput);
      let b = clamp(maxInput);
      if (a > b) { a = b; minInput.value = a; }
      sMin.value = a;
      sMax.value = b;
      paint(a, b);
      onChange(a, b);
    };

    sMin.addEventListener('input', fromSliders);
    sMax.addEventListener('input', fromSliders);
    ['change', 'blur'].forEach(ev => {
      minInput.addEventListener(ev, fromInputs);
      maxInput.addEventListener(ev, fromInputs);
    });

    paint(parseFloat(sMin.value), parseFloat(sMax.value));
  },
};

// Wire the two card buttons (Methodology / Settings) — reuse initCardBtn
initCardBtn('setup-method-btn',   'setup-method-expand',   'Methodology', 'Hide');
initCardBtn('setup-settings-btn', 'setup-settings-expand', 'Settings',    'Hide settings');

// Lazy-init Step 2 modules (Level Setup + Difficulty Curve + Tracking) on first click
document.querySelectorAll('.step-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.step === '2') { Step2.init(); DifficultyCurve.init(); Step3.init(); }
    if (btn.dataset.step === '3') { Economy.init(); EconomyTuning.init(); }
    if (btn.dataset.step === '4') { Monetization.init(); }
  });
});

// ============================================================
// ECONOMY CONFIGURATOR (Step 3)
// ============================================================
const Economy = {
  _started: false,
  state: {},

  // The superset of everything the economy can contain.
  catalog: {
    currencies: [
      { id: 'coin',   title: 'Coins',           sub: 'Soft — earned every session',          glyph: '🪙' },
      { id: 'gem',    title: 'Gems',            sub: 'Hard — premium currency',              glyph: '💎' },
      { id: 'energy', title: 'Energy / Lives',  sub: 'Time-gate — regens over real time',    glyph: '❤' },
      { id: 'xp',     title: 'XP',              sub: 'Progression — level up the player',    glyph: '⭐' },
      { id: 'token',  title: 'Event Tokens',    sub: 'LiveOps — earned only during events',  glyph: '🎟' },
    ],
    boosters: [
      { id: 'reshape',  title: 'Reshape',     sub: 'Swap a piece for a different shape',  glyph: '↻' },
      { id: 'line',     title: 'Line Clear',  sub: 'Auto-clear a row or column',          glyph: '═' },
      { id: 'overlay',  title: 'Overlay',     sub: 'Place on top of placed pieces',       glyph: '⌸' },
      { id: 'undo',     title: 'Undo',        sub: 'Rewind the last placement',           glyph: '↶' },
      { id: 'hint',     title: 'Hint',        sub: 'Highlight a valid next move',         glyph: '💡' },
      { id: 'shuffle',  title: 'Shuffle',     sub: 'Re-roll the current piece tray',      glyph: '⇆' },
      { id: 'freeze',   title: 'Freeze',      sub: 'Pause the turn timer for N seconds',  glyph: '❄' },
    ],
    faucets: [
      { id: 'level-complete', title: 'Level complete',          sub: 'Scales with difficulty',          deps: ['coin'],           needs: ['coin'] },
      { id: 'daily-login',    title: 'Daily login streak',      sub: 'Escalating 7-day loop',           deps: ['coin'],           needs: ['coin'] },
      { id: 'win-streak',     title: 'Win streak multiplier',   sub: 'N wins in a row → bonus',         deps: ['coin'],           needs: ['coin'] },
      { id: 'rv-multiplier',  title: 'Rewarded ad · multiplier',sub: '2× / 3× at level end',            deps: ['ad', 'coin'],     needs: ['coin'] },
      { id: 'wheel',          title: 'Spin the wheel',          sub: 'Daily free spin',                 deps: ['coin', 'gem', 'booster'], needs: [] },
      { id: 'milestones',     title: 'Milestone rewards',       sub: 'Every 10 / 25 / 50 levels',       deps: ['gem'],            needs: ['gem'] },
      { id: 'objectives',     title: 'Daily objectives',        sub: '3 rotating goals',                deps: ['gem', 'booster'], needs: [] },
      { id: 'iap',            title: 'IAP gem pack',            sub: 'Primary gem source',              deps: ['iap', 'gem'],     needs: ['gem'] },
      { id: 'rv-booster',     title: 'Rewarded ad · free booster', sub: 'Capped 3 / day',               deps: ['ad', 'booster'],  needs: ['anyBooster'] },
      { id: 'energy-regen',   title: 'Energy regen',            sub: '1 life per 30 min',               deps: ['energy'],         needs: ['energy'] },
      { id: 'xp-per-win',     title: 'XP on win',               sub: 'Every successful level',          deps: ['xp'],             needs: ['xp'] },
      { id: 'event-drops',    title: 'Event token drops',       sub: 'Only during live events',         deps: ['token'],          needs: ['token'] },
      { id: 'referral',       title: 'Friend referral',         sub: 'Both players get a reward',       deps: ['gem'],            needs: ['gem'] },
    ],
    sinks: [
      { id: 'reshape-retry',  title: 'Reshape & retry failed level', sub: '20 💎 flat',                   deps: ['gem'],             needs: ['gem'] },
      { id: 'buy-reshape',    title: 'Buy Reshape booster',          sub: 'Soft-currency sink',           deps: ['coin', 'booster'], needs: ['coin', 'booster:reshape'] },
      { id: 'buy-line',       title: 'Buy Line Clear booster',       sub: 'Coins or gems',                deps: ['coin', 'gem', 'booster'], needs: ['booster:line'] },
      { id: 'buy-overlay',    title: 'Buy Overlay booster',          sub: 'Gems or IAP-only',             deps: ['gem', 'iap', 'booster'], needs: ['booster:overlay'] },
      { id: 'buy-undo',       title: 'Buy Undo charges',             sub: 'Small coin cost',              deps: ['coin', 'booster'], needs: ['booster:undo'] },
      { id: 'buy-hint',       title: 'Buy Hints',                    sub: 'Coin bundle',                  deps: ['coin', 'booster'], needs: ['booster:hint'] },
      { id: 'limited-offer',  title: 'Limited-time daily offer',     sub: 'Rotating bundle',              deps: ['iap', 'gem'],     needs: ['gem'] },
      { id: 'second-chance',  title: 'Second-chance on fail',        sub: 'Ad or gem cost',               deps: ['ad', 'gem'],      needs: [] },
      { id: 'extra-spin',     title: 'Extra spin · wheel',           sub: 'Pay to spin again',            deps: ['gem'],            needs: ['gem'] },
      { id: 'energy-refill',  title: 'Energy refill',                sub: 'Gems to skip the wait',        deps: ['gem', 'energy'],  needs: ['gem', 'energy'] },
      { id: 'event-shop',     title: 'Event shop',                   sub: 'Spend tokens on rewards',      deps: ['token'],          needs: ['token'] },
      { id: 'level-skip',     title: 'Skip level',                   sub: 'Gems to bypass a wall',        deps: ['gem'],            needs: ['gem'] },
      { id: 'cosmetics',      title: 'Cosmetic unlocks',             sub: 'Vanity sink',                  deps: ['coin', 'gem'],    needs: [] },
    ],
  },

  presets: {
    minimal:  { currencies: ['coin'],                          boosters: ['reshape'],                          faucets: ['level-complete', 'daily-login', 'wheel'],                                                                    sinks: ['buy-reshape', 'cosmetics'] },
    standard: { currencies: ['coin', 'gem'],                   boosters: ['reshape', 'line', 'overlay'],       faucets: ['level-complete', 'daily-login', 'win-streak', 'rv-multiplier', 'milestones', 'objectives', 'iap', 'rv-booster'], sinks: ['reshape-retry', 'buy-reshape', 'buy-line', 'buy-overlay', 'limited-offer', 'second-chance'] },
    liveops:  { currencies: ['coin', 'gem', 'token'],          boosters: ['reshape', 'line', 'overlay', 'shuffle'], faucets: ['level-complete', 'daily-login', 'win-streak', 'rv-multiplier', 'wheel', 'milestones', 'objectives', 'iap', 'rv-booster', 'event-drops', 'referral'], sinks: ['reshape-retry', 'buy-reshape', 'buy-line', 'buy-overlay', 'limited-offer', 'second-chance', 'extra-spin', 'event-shop', 'cosmetics'] },
    full:     { currencies: ['coin', 'gem', 'energy', 'xp', 'token'], boosters: ['reshape', 'line', 'overlay', 'undo', 'hint', 'shuffle', 'freeze'], faucets: null /* all */, sinks: null /* all */ },
  },

  init() {
    if (this._started) return;
    this._started = true;
    this.state = { currencies: new Set(), boosters: new Set(), faucets: new Set(), sinks: new Set() };
    this.render();
    this.bindPresets();
    this.bindGenerate();
    this.applyPreset('standard', { animate: false });
  },

  render() {
    const mount = (group, items) => {
      const host = document.querySelector(`.econ-items[data-group="${group}"]`);
      if (!host) return;
      host.innerHTML = items.map(it => this.rowHtml(group, it)).join('');
      host.querySelectorAll('.econ-item').forEach(el => {
        el.addEventListener('click', () => {
          if (el.classList.contains('disabled')) return;
          const id = el.dataset.id;
          const set = this.state[group];
          if (set.has(id)) set.delete(id); else set.add(id);
          this.syncAll();
        });
      });
    };
    mount('currencies', this.catalog.currencies);
    mount('boosters',   this.catalog.boosters);
    mount('faucets',    this.catalog.faucets);
    mount('sinks',      this.catalog.sinks);
  },

  rowHtml(group, it) {
    const deps = (it.deps || []).map(d => `<span class="econ-dep econ-dep--${d}">${this.depGlyph(d)}</span>`).join('');
    const glyph = it.glyph ? `<span class="econ-item-glyph">${it.glyph}</span>` : '';
    return `
      <div class="econ-item" data-id="${it.id}">
        <span class="econ-check"></span>
        ${glyph}
        <div class="econ-item-body">
          <span class="econ-item-title">${it.title}</span>
          <span class="econ-item-sub">${it.sub}</span>
        </div>
        <div class="econ-item-deps">${deps}</div>
      </div>`;
  },

  depGlyph(d) {
    return { coin: '🪙', gem: '💎', energy: '❤', xp: '⭐', token: '🎟', booster: '⚡', ad: '▶', iap: '$' }[d] || d;
  },

  isAvailable(group, it) {
    const needs = it.needs || [];
    for (const n of needs) {
      if (n === 'anyBooster') { if (this.state.boosters.size === 0) return false; continue; }
      if (n.startsWith('booster:')) { if (!this.state.boosters.has(n.slice(8))) return false; continue; }
      if (!this.state.currencies.has(n)) return false;
    }
    return true;
  },

  syncAll() {
    ['currencies', 'boosters', 'faucets', 'sinks'].forEach(group => {
      const items = this.catalog[group];
      const host = document.querySelector(`.econ-items[data-group="${group}"]`);
      if (!host) return;
      items.forEach(it => {
        const row = host.querySelector(`[data-id="${it.id}"]`);
        if (!row) return;
        const avail = (group === 'currencies' || group === 'boosters') ? true : this.isAvailable(group, it);
        if (!avail && this.state[group].has(it.id)) this.state[group].delete(it.id);
        row.classList.toggle('checked', this.state[group].has(it.id));
        row.classList.toggle('disabled', !avail);
      });
    });
    this.updateSummary();
    this.renderPreviews();
  },

  // ---------- Live phone previews ----------
  renderPreviews() {
    this.renderGameplay();
    this.renderEndgame();
  },

  walletPillsHtml() {
    const wanted = [['coin', '🪙', '2,340'], ['gem', '💎', '185'], ['energy', '❤', '5'], ['xp', '⭐', 'Lv 12'], ['token', '🎟', '48']];
    return wanted.filter(([id]) => this.state.currencies.has(id))
      .map(([id, g, v]) => `<span class="pv-wallet-pill pv-wallet-pill--${id}">${g} ${v}</span>`)
      .join('');
  },

  renderGameplay() {
    const host = document.getElementById('preview-gameplay');
    if (!host) return;

    if (!this._gameMounted) {
      host.innerHTML = `
        <div class="pv-refined-hud" id="pv-refined-hud"></div>
        <div class="pv-game-demo" id="pv-game-demo"></div>
        <div class="pv-booster-bar pv-booster-bar--big pv-booster-bar--refined" id="pv-booster-bar"></div>`;
      const demoHost = document.getElementById('pv-game-demo');
      try {
        this._gameDemo = new BlockBlastDemo(demoHost, { refined: true });
        this._gameDemo.startAutoPlay();
      } catch (e) {
        demoHost.innerHTML = `<div class="pv-empty">Demo unavailable.</div>`;
      }
      this._gameMounted = true;
    }

    const hud = document.getElementById('pv-refined-hud');
    if (hud) hud.innerHTML = this.walletPillsHtml() || '<span style="color:#64748b;font-size:0.6rem;font-style:italic;">No currencies enabled</span>';

    const bar = document.getElementById('pv-booster-bar');
    if (!bar) return;
    const boosterOrder  = ['reshape','line','overlay','undo','hint','shuffle','freeze'];
    const boosterGlyphs = { reshape:'↻', line:'═', overlay:'⌸', undo:'↶', hint:'💡', shuffle:'⇆', freeze:'❄' };
    const boosterLabels = { reshape:'Reshape', line:'Line', overlay:'Overlay', undo:'Undo', hint:'Hint', shuffle:'Shuffle', freeze:'Freeze' };
    const active = boosterOrder.filter(b => this.state.boosters.has(b)).slice(0, 3);
    bar.innerHTML = active.length
      ? active.map(b => `<div class="pv-booster"><div class="pv-booster-icon pv-booster-icon--big ${b}">${boosterGlyphs[b]}</div><span class="pv-booster-label">${boosterLabels[b]}</span><span class="pv-booster-count">×${1 + Math.floor(Math.random()*3)}</span></div>`).join('')
      : `<span style="color:#cbd5e1;font-size:0.62rem;font-style:italic;">No boosters enabled</span>`;
  },

  renderEndgame() {
    const host = document.getElementById('preview-endgame');
    if (!host) return;
    if (this.state.currencies.size === 0) {
      host.innerHTML = `<div class="pv-empty">Enable a currency to show the level-end rewards.</div>`;
      return;
    }

    // ---- solved-board background (static colored 8×8 grid) ----
    const seed = 13;
    const rand = this._mulberry(seed);
    const palette = ['#00a1e1', '#06b6d4', '#f59e0b', '#a78bfa', '#f97316', '#10b981', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6', '#84cc16', '#38bdf8'];
    let bgCells = '';
    for (let i = 0; i < 64; i++) {
      const filled = rand() < 0.58;
      if (filled) bgCells += `<div class="bb-cell" style="background:${palette[Math.floor(rand() * palette.length)]}"></div>`;
      else        bgCells += `<div class="bb-cell"></div>`;
    }

    // ---- rewards ----
    const rewards = [];
    if (this.state.currencies.has('coin'))  rewards.push(`<span class="pv-end-reward pv-end-reward--coin">🪙 +100</span>`);
    if (this.state.currencies.has('xp'))    rewards.push(`<span class="pv-end-reward pv-end-reward--xp">⭐ +1</span>`);
    else                                    rewards.push(`<span class="pv-end-reward pv-end-reward--xp">⭐ +1</span>`); // star always shown
    if (this.state.currencies.has('token')) rewards.push(`<span class="pv-end-reward pv-end-reward--token">🎟 +3</span>`);
    if (this.state.currencies.has('gem') && this.state.faucets.has('milestones')) rewards.push(`<span class="pv-end-reward pv-end-reward--gem">💎 +5</span>`);

    // ---- spin wheel (inline SVG conic-gradient pie) ----
    const slices = [
      { label: '50 🪙',   color: '#f59e0b' },
      { label: '2×',      color: '#10b981' },
      { label: '10 💎',   color: '#00a1e1' },
      { label: '100 🪙',  color: '#f97316' },
      { label: '+1 ★',    color: '#a855f7' },
      { label: 'JACKPOT', color: '#ef4444' },
    ];
    const n = slices.length;
    const sliceDeg = 360 / n;
    const wheelBg = `conic-gradient(${slices.map((s, i) => `${s.color} ${i * sliceDeg}deg ${(i + 1) * sliceDeg}deg`).join(',')})`;
    const sliceLabels = slices.map((s, i) => {
      const angle = i * sliceDeg + sliceDeg / 2;
      const rad = (angle - 90) * Math.PI / 180;
      const r = 30;
      const x = 50 + r * Math.cos(rad);
      const y = 50 + r * Math.sin(rad);
      return `<span class="pv-wheel-label" style="left:${x}%; top:${y}%; transform:translate(-50%,-50%) rotate(${angle}deg);">${s.label}</span>`;
    }).join('');

    // ---- CTA buttons ----
    const cta = [];
    if (this.state.faucets.has('rv-multiplier')) cta.push(`<button class="pv-end-btn pv-end-btn--rv">▶ Double coins · watch ad</button>`);
    cta.push(`<button class="pv-end-btn pv-end-btn--next">Continue ▸</button>`);

    host.innerHTML = `
      <div class="pv-refined-hud">${this.walletPillsHtml()}</div>
      <div class="pv-end-stage">
        <div class="pv-end-bg">
          <div class="bb-grid pv-end-bg-grid">${bgCells}</div>
        </div>
        <div class="pv-end-veil"></div>
        <div class="pv-end-modal">
          <div class="pv-end-modal-top">
            <div class="pv-end-badge">LEVEL WON</div>
            <div class="pv-end-rewards">${rewards.join('')}</div>
          </div>
          <div class="pv-end-modal-mid">
            ${this.state.faucets.has('wheel') ? `
              <div class="pv-wheel">
                <div class="pv-wheel-pointer"></div>
                <div class="pv-wheel-disc" style="background:${wheelBg};">
                  ${sliceLabels}
                </div>
                <div class="pv-wheel-hub">RV</div>
              </div>
              <div class="pv-wheel-cta">▶ Spin for bonus · watch ad</div>
            ` : ''}
          </div>
          <div class="pv-end-cta">${cta.join('')}</div>
        </div>
      </div>`;
  },

  _mulberry(a) {
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  },

  renderShop() {
    const host = document.getElementById('preview-shop');
    if (!host) return;
    const items = [];

    if (this.state.sinks.has('limited-offer') && this.state.currencies.has('gem')) {
      items.push(`<div class="pv-shop-item featured"><div class="pv-shop-icon pv-shop-icon--gem">🔥</div><div class="pv-shop-info"><div class="pv-shop-title">Daily bundle</div><div class="pv-shop-sub">150 💎 + 3 boosters · 40% off</div></div><div class="pv-shop-price">$2.99</div></div>`);
    }
    if (this.state.currencies.has('gem')) {
      items.push(`<div class="pv-shop-item"><div class="pv-shop-icon pv-shop-icon--gem">💎</div><div class="pv-shop-info"><div class="pv-shop-title">Handful of gems</div><div class="pv-shop-sub">80 💎</div></div><div class="pv-shop-price">$0.99</div></div>`);
      items.push(`<div class="pv-shop-item"><div class="pv-shop-icon pv-shop-icon--gem">💎</div><div class="pv-shop-info"><div class="pv-shop-title">Pile of gems</div><div class="pv-shop-sub">500 💎</div></div><div class="pv-shop-price">$4.99</div></div>`);
      items.push(`<div class="pv-shop-item"><div class="pv-shop-icon pv-shop-icon--gem">💎</div><div class="pv-shop-info"><div class="pv-shop-title">Bag of gems</div><div class="pv-shop-sub">1,200 💎</div></div><div class="pv-shop-price">$9.99</div></div>`);
    }

    // Booster packs — only show if that booster is active and at least one sink sells it
    const boosterPrices = {
      reshape: { title: 'Reshape × 5',  sub: 'Swap a piece',                      coin: 600,  gem: 40 },
      line:    { title: 'Line Clear × 3', sub: 'Clear a row or column',            coin: 900,  gem: 60 },
      overlay: { title: 'Overlay × 3',  sub: 'Place on top of pieces',             coin: null, gem: 90 },
      undo:    { title: 'Undo × 5',     sub: 'Rewind a placement',                 coin: 400,  gem: 25 },
      hint:    { title: 'Hint × 5',     sub: 'Highlight a valid move',             coin: 300,  gem: 20 },
      shuffle: { title: 'Shuffle × 3',  sub: 'Re-roll the piece tray',             coin: 500,  gem: 30 },
      freeze:  { title: 'Freeze × 3',   sub: 'Pause the turn timer',               coin: null, gem: 45 },
    };
    this.catalog.boosters.forEach(b => {
      if (!this.state.boosters.has(b.id)) return;
      const bp = boosterPrices[b.id];
      const usesCoin = bp.coin && this.state.currencies.has('coin');
      const usesGem  = bp.gem  && this.state.currencies.has('gem');
      if (!usesCoin && !usesGem) return;
      const price = usesCoin ? `🪙 ${bp.coin}` : `💎 ${bp.gem}`;
      items.push(`<div class="pv-shop-item"><div class="pv-shop-icon pv-shop-icon--boost">${{'reshape':'↻','line':'═','overlay':'⌸','undo':'↶','hint':'💡','shuffle':'⇆','freeze':'❄'}[b.id]}</div><div class="pv-shop-info"><div class="pv-shop-title">${bp.title}</div><div class="pv-shop-sub">${bp.sub}</div></div><div class="pv-shop-price">${price}</div></div>`);
    });

    if (this.state.sinks.has('energy-refill') && this.state.currencies.has('energy')) {
      items.push(`<div class="pv-shop-item"><div class="pv-shop-icon pv-shop-icon--energy">❤</div><div class="pv-shop-info"><div class="pv-shop-title">Full energy refill</div><div class="pv-shop-sub">Instant 5 lives</div></div><div class="pv-shop-price">💎 30</div></div>`);
    }

    // Always useful: remove-ads tile if any ad-based faucet exists
    if (this.state.faucets.has('rv-multiplier') || this.state.faucets.has('rv-booster') || this.state.sinks.has('second-chance')) {
      items.push(`<div class="pv-shop-item"><div class="pv-shop-icon pv-shop-icon--noads">🚫</div><div class="pv-shop-info"><div class="pv-shop-title">Remove ads</div><div class="pv-shop-sub">One-time · opt-in RVs stay</div></div><div class="pv-shop-price">$2.99</div></div>`);
    }

    const body = items.length
      ? items.join('')
      : `<div class="pv-empty">No sinks enabled — shop is empty.</div>`;

    host.innerHTML = `
      <div class="pv-hud">
        <span class="pv-level">SHOP</span>
        <div class="pv-wallet">${this.walletPillsHtml()}</div>
      </div>
      <div class="pv-shop-body">
        <div class="pv-shop-tabs"><span class="pv-shop-tab active">Deals</span><span class="pv-shop-tab">Gems</span><span class="pv-shop-tab">Boosters</span></div>
        ${body}
      </div>`;
  },

  updateSummary() {
    const c = this.state.currencies.size;
    const b = this.state.boosters.size;
    const f = this.state.faucets.size;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('econ-count-curr', c);
    set('econ-count-boost', b);
    set('econ-count-fauc', f);

    const currNames = [...this.state.currencies].map(id => this.catalog.currencies.find(x => x.id === id)?.title).filter(Boolean);
    const boostNames = [...this.state.boosters].map(id => this.catalog.boosters.find(x => x.id === id)?.title).filter(Boolean);
    let text;
    if (c === 0 && b === 0) {
      text = 'Pick a preset or generate to see the assembled economy.';
    } else {
      const currPart = currNames.length ? currNames.join(' + ') : 'no currencies';
      const boostPart = boostNames.length ? `${boostNames.length} booster${boostNames.length === 1 ? '' : 's'} (${boostNames.join(', ')})` : 'no boosters';
      text = `${currPart} economy with ${boostPart} — players gain via ${f} faucet${f === 1 ? '' : 's'}.`;
    }
    const t = document.getElementById('econ-summary-text');
    if (t) t.textContent = text;
  },

  bindPresets() {
    document.querySelectorAll('.econ-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => this.applyPreset(btn.dataset.preset, { animate: true }));
    });
  },

  bindGenerate() {
    const btn = document.getElementById('econ-generate-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const activePreset = document.querySelector('.econ-preset-btn.active')?.dataset.preset || 'standard';
      const tier = this.tierBounds(activePreset);
      const curr = ['coin'];
      if (tier.maxCurr >= 2 || Math.random() < 0.7) curr.push('gem');
      // Fill more currencies up to tier.maxCurr with weighted optionals
      const optionals = ['energy', 'xp', 'token'];
      while (curr.length < tier.minCurr) curr.push(optionals.shift());
      optionals.forEach(o => { if (curr.length < tier.maxCurr && Math.random() < tier.optionalBias) curr.push(o); });

      const allBoost = this.catalog.boosters.map(b => b.id);
      const nB = tier.minBoost + Math.floor(Math.random() * (tier.maxBoost - tier.minBoost + 1));
      const boosters = this.pickRandom(allBoost, Math.min(nB, allBoost.length));

      this.applySelection({ currencies: curr, boosters, faucets: 'auto', sinks: 'auto' }, { animate: true });
      // Keep the active preset highlighted — generate is a variation within that tier
      document.querySelectorAll('.econ-preset-btn').forEach(b => b.classList.toggle('active', b.dataset.preset === activePreset));
    });
  },

  tierBounds(preset) {
    switch (preset) {
      case 'minimal':  return { minCurr: 1, maxCurr: 2, minBoost: 1, maxBoost: 2, optionalBias: 0.1 };
      case 'standard': return { minCurr: 2, maxCurr: 3, minBoost: 3, maxBoost: 4, optionalBias: 0.35 };
      case 'liveops':  return { minCurr: 3, maxCurr: 4, minBoost: 4, maxBoost: 5, optionalBias: 0.7 };
      case 'full':     return { minCurr: 5, maxCurr: 5, minBoost: 7, maxBoost: 7, optionalBias: 1 };
      default:         return { minCurr: 2, maxCurr: 3, minBoost: 3, maxBoost: 4, optionalBias: 0.35 };
    }
  },

  pickRandom(arr, n) {
    const copy = arr.slice();
    const out = [];
    for (let i = 0; i < n && copy.length; i++) {
      out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    }
    return out;
  },

  applyPreset(key, opts) {
    const p = this.presets[key];
    if (!p) return;
    document.querySelectorAll('.econ-preset-btn').forEach(b => b.classList.toggle('active', b.dataset.preset === key));
    const faucets = p.faucets === null ? this.catalog.faucets.map(x => x.id) : p.faucets;
    const sinks   = p.sinks   === null ? this.catalog.sinks.map(x => x.id)   : p.sinks;
    this.applySelection({ currencies: p.currencies, boosters: p.boosters, faucets, sinks }, opts);
  },

  applySelection(sel, { animate = false } = {}) {
    // Clear current state first
    this.state.currencies.clear();
    this.state.boosters.clear();
    this.state.faucets.clear();
    this.state.sinks.clear();

    const resolveAuto = (group) => this.catalog[group].filter(it => this.isAvailable(group, it)).map(it => it.id);

    // Set currencies and boosters (no availability gating on these)
    sel.currencies.forEach(id => this.state.currencies.add(id));
    sel.boosters.forEach(id => this.state.boosters.add(id));

    // For faucets/sinks, 'auto' = every available one
    const faucetIds = sel.faucets === 'auto' ? resolveAuto('faucets') : sel.faucets;
    const sinkIds   = sel.sinks   === 'auto' ? resolveAuto('sinks')   : sel.sinks;
    faucetIds.forEach(id => this.state.faucets.add(id));
    sinkIds.forEach(id => this.state.sinks.add(id));

    if (animate) {
      this.syncAll();
      this.playFlipAnimation();
    } else {
      this.syncAll();
    }
  },

  playFlipAnimation() {
    const checked = [...document.querySelectorAll('.econ-item.checked')];
    checked.forEach((el, i) => {
      el.classList.remove('flip-in');
      void el.offsetWidth; // force reflow to restart animation
      setTimeout(() => el.classList.add('flip-in'), i * 28);
    });
  },
};

// ============================================================
// DIFFICULTY CURVE — draggable anchors + level generation
// ============================================================
const DifficultyCurve = {
  VB_W: 600,
  VB_H: 240,
  PAD_L: 8,
  PAD_R: 8,
  PAD_T: 14,
  PAD_B: 14,
  LEVELS: 10,
  BUCKETS: ['Very easy', 'Easy', 'Medium', 'Hard', 'Very hard'],

  anchors: [
    { level: 1,  y: 0.15 },
    { level: 3,  y: 0.35 },
    { level: 5,  y: 0.55 },
    { level: 6,  y: 0.85 },
    { level: 8,  y: 0.70 },
    { level: 10, y: 0.95 },
  ],

  init() {
    if (this._inited) return;
    this._inited = true;
    this.svg = document.getElementById('curve-svg');
    if (!this.svg) return;
    this.gridG = document.getElementById('curve-grid');
    this.pathEl = document.getElementById('curve-path');
    this.areaEl = document.getElementById('curve-area');
    this.anchorG = document.getElementById('curve-anchors');
    this.renderGrid();
    this.renderCurve();
    this.renderAnchors();
    document.getElementById('generate-levels-btn')?.addEventListener('click', () => this.generateLevels());
    document.querySelectorAll('.curve-preset').forEach(btn => {
      btn.addEventListener('click', () => { this.applyPreset(btn.dataset.preset); this.scheduleRegenerate(); });
    });
    // Render levels immediately on first view
    this.scheduleRegenerate();
  },

  scheduleRegenerate() {
    clearTimeout(this._regenTimer);
    this._regenTimer = setTimeout(() => {
      this.generateLevels();
      if (window.Step3 && Step3._inited) Step3.build();
    }, 120);
  },

  levelToX(level) {
    const innerW = this.VB_W - this.PAD_L - this.PAD_R;
    return this.PAD_L + ((level - 1) / (this.LEVELS - 1)) * innerW;
  },
  xToLevel(px) {
    const innerW = this.VB_W - this.PAD_L - this.PAD_R;
    const t = Math.max(0, Math.min(1, (px - this.PAD_L) / innerW));
    return 1 + t * (this.LEVELS - 1);
  },
  yToPx(y) {
    const innerH = this.VB_H - this.PAD_T - this.PAD_B;
    return this.PAD_T + (1 - y) * innerH;
  },
  pxToY(px) {
    const innerH = this.VB_H - this.PAD_T - this.PAD_B;
    return Math.max(0, Math.min(1, 1 - (px - this.PAD_T) / innerH));
  },

  renderGrid() {
    let html = '';
    for (let i = 0; i < 5; i++) {
      const y = this.PAD_T + (i / 4) * (this.VB_H - this.PAD_T - this.PAD_B);
      html += `<line x1="${this.PAD_L}" y1="${y}" x2="${this.VB_W - this.PAD_R}" y2="${y}"/>`;
    }
    for (let l = 1; l <= this.LEVELS; l++) {
      const x = this.levelToX(l);
      html += `<line x1="${x}" y1="${this.PAD_T}" x2="${x}" y2="${this.VB_H - this.PAD_B}"/>`;
    }
    this.gridG.innerHTML = html;
  },

  renderCurve() {
    const pts = this.anchors.map(a => ({ x: this.levelToX(a.level), y: this.yToPx(a.y) }));
    const d = catmullRomPath(pts);
    this.pathEl.setAttribute('d', d);
    const areaBottom = this.VB_H - this.PAD_B;
    const areaD = d + ` L ${pts[pts.length - 1].x} ${areaBottom} L ${pts[0].x} ${areaBottom} Z`;
    this.areaEl.setAttribute('d', areaD);
  },

  renderAnchors() {
    this.anchorG.innerHTML = '';
    this.anchors.forEach((a, idx) => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', this.levelToX(a.level));
      c.setAttribute('cy', this.yToPx(a.y));
      c.setAttribute('r', 6.5);
      c.dataset.idx = idx;
      this.anchorG.appendChild(c);
      this.bindDrag(c, idx);
    });
  },

  bindDrag(circle, idx) {
    const isFirst = idx === 0;
    const isLast  = idx === this.anchors.length - 1;
    const GAP = 0.15;
    const start = (e) => {
      e.preventDefault();
      circle.classList.add('dragging');
      circle.setPointerCapture(e.pointerId);
      const move = (ev) => {
        const rect = this.svg.getBoundingClientRect();
        const localY = ((ev.clientY - rect.top) / rect.height) * this.VB_H;
        this.anchors[idx].y = this.pxToY(localY);

        if (!isFirst && !isLast) {
          const localX = ((ev.clientX - rect.left) / rect.width) * this.VB_W;
          const minL = this.anchors[idx - 1].level + GAP;
          const maxL = this.anchors[idx + 1].level - GAP;
          let newL = this.xToLevel(localX);
          newL = Math.max(minL, Math.min(maxL, newL));
          this.anchors[idx].level = newL;
          circle.setAttribute('cx', this.levelToX(newL));
        }

        circle.setAttribute('cy', this.yToPx(this.anchors[idx].y));
        this.renderCurve();
        this.scheduleRegenerate();
      };
      const end = (ev) => {
        circle.classList.remove('dragging');
        circle.releasePointerCapture(ev.pointerId);
        circle.removeEventListener('pointermove', move);
        circle.removeEventListener('pointerup', end);
        circle.removeEventListener('pointercancel', end);
        this.scheduleRegenerate();
      };
      circle.addEventListener('pointermove', move);
      circle.addEventListener('pointerup', end);
      circle.addEventListener('pointercancel', end);
    };
    circle.addEventListener('pointerdown', start);
  },

  applyPreset(name) {
    if (name === 'ramp') {
      this.anchors = [
        { level: 1, y: 0.10 }, { level: 3, y: 0.25 }, { level: 5, y: 0.45 },
        { level: 6, y: 0.60 }, { level: 8, y: 0.80 }, { level: 10, y: 0.95 },
      ];
    } else if (name === 'wave') {
      this.anchors = [
        { level: 1, y: 0.20 }, { level: 3, y: 0.65 }, { level: 5, y: 0.30 },
        { level: 6, y: 0.75 }, { level: 8, y: 0.40 }, { level: 10, y: 0.85 },
      ];
    } else if (name === 'spike') {
      this.anchors = [
        { level: 1, y: 0.15 }, { level: 3, y: 0.20 }, { level: 5, y: 0.35 },
        { level: 6, y: 0.95 }, { level: 8, y: 0.50 }, { level: 10, y: 0.90 },
      ];
    }
    this.renderCurve();
    this.renderAnchors();
  },

  // Sample curve y at a specific level index (1..LEVELS) using Catmull-Rom through anchors on x-axis
  sampleYAtLevel(level) {
    // Find surrounding anchors by level
    const sorted = [...this.anchors].sort((a, b) => a.level - b.level);
    if (level <= sorted[0].level) return sorted[0].y;
    if (level >= sorted[sorted.length - 1].level) return sorted[sorted.length - 1].y;
    for (let i = 0; i < sorted.length - 1; i++) {
      if (level >= sorted[i].level && level <= sorted[i + 1].level) {
        const t = (level - sorted[i].level) / (sorted[i + 1].level - sorted[i].level);
        // Smoothstep between anchors for curve-like feel
        const tt = t * t * (3 - 2 * t);
        return sorted[i].y + (sorted[i + 1].y - sorted[i].y) * tt;
      }
    }
    return 0.5;
  },

  bucketLabel(y) {
    const idx = Math.min(4, Math.max(0, Math.floor(y * 5 - 0.0001)));
    return this.BUCKETS[idx];
  },
  bucketKey(y) {
    const idx = Math.min(4, Math.max(0, Math.floor(y * 5 - 0.0001)));
    return ['ve', 'e', 'm', 'h', 'vh'][idx];
  },

  // Derive Step2-compatible params for a given target difficulty (0..1) using base params as seed
  deriveParams(yNorm, levelIdx) {
    const base = Step2.params;
    // Solutions: harder levels → fewer solutions
    const solLadder = [10, 5, 2, 1];
    const solIdx = Math.min(3, Math.floor(yNorm * 4));
    const solutions = solLadder[solIdx];
    // Rounds: scale 2..9 with difficulty
    const rounds = Math.max(2, Math.min(9, Math.round(2 + yNorm * 7)));
    // Squares per round: widen and raise with difficulty
    const sqrCenter = 3 + Math.round(yNorm * 7); // 3..10
    const sqrHalf   = 1 + Math.round(yNorm * 3); // 1..4
    const sqrMin = Math.max(1, sqrCenter - sqrHalf);
    const sqrMax = Math.min(15, sqrCenter + sqrHalf);
    // Total squares: rises with difficulty, modest spread
    const totalCenter = Math.round(25 + yNorm * 120); // 25..145
    const totalHalf   = Math.round(10 + yNorm * 25);
    const totalMin = Math.max(10, totalCenter - totalHalf);
    const totalMax = Math.min(200, totalCenter + totalHalf);
    // Add small per-level jitter via levelIdx so phones look distinct
    return {
      solutions,
      rounds,
      sqrMin, sqrMax,
      totalMin, totalMax,
      _seed: levelIdx * 7919,
    };
  },

  generateLevels() {
    const host = document.getElementById('levels-grid');
    if (!host) return;
    host.innerHTML = '';
    for (let lvl = 1; lvl <= this.LEVELS; lvl++) {
      const y = this.sampleYAtLevel(lvl);
      const params = this.deriveParams(y, lvl);
      const score = difficultyScore(params);
      const card = document.createElement('div');
      card.className = `level-card level-card--${this.bucketKey(y)}`;
      card.innerHTML = `
        <div class="level-card-head">
          <span class="level-card-num">Lv ${lvl}</span>
          <span class="level-card-diff">${score.toFixed(1)}</span>
        </div>
        <span class="level-card-bucket">${this.bucketLabel(y)}</span>
        <div class="mini-phone-frame">
          <div class="mini-phone-notch"></div>
          <div class="mini-phone-screen"></div>
          <div class="mini-phone-home"></div>
        </div>
      `;
      host.appendChild(card);
      renderSolutionInto(card.querySelector('.mini-phone-screen'), params);
    }
  },
};

// Render the solver output (grid + pieces) into an arbitrary host element — used by mini-phones
function renderSolutionInto(host, params) {
  if (!host) return;
  // jitter hash so each level has unique seed
  const p = { ...params };
  p.__jit = params._seed || 0;
  // monkey-patch hashParams behavior via a tiny wrapper: re-use pickPieces but add jitter to the hash
  const origHash = hashParams;
  const localHash = (pp) => origHash(pp) ^ (pp.__jit >>> 0);

  // Local pickPieces clone using localHash
  const r = rng(localHash(p));
  const tierMax = p.solutions >= 10 ? 3 : p.solutions >= 5 ? 4 : 4;
  const preferLarge = p.solutions <= 2;
  const pool = PIECE_LIBRARY_2.filter(pp => pp.size <= tierMax);
  const N = Math.max(3, Math.min(12, p.rounds * 3));
  const targetAvg = (p.sqrMin + p.sqrMax) / 2;
  const pieces = [];
  for (let i = 0; i < N; i++) {
    const candidates = pool.filter(pp => pp.size >= p.sqrMin - 1 && pp.size <= p.sqrMax + 1);
    const src = candidates.length ? candidates : pool;
    let idx;
    if (preferLarge) {
      const weights = src.map(pp => pp.size);
      const total = weights.reduce((a, b) => a + b, 0);
      let pick = r() * total;
      idx = 0;
      for (let k = 0; k < src.length; k++) { pick -= weights[k]; if (pick <= 0) { idx = k; break; } }
    } else {
      idx = Math.floor(r() * src.length);
    }
    pieces.push({ ...src[idx], _genIdx: i });
  }

  const path = solve(pieces, 180);
  if (!path) {
    host.innerHTML = `<div class="sol-empty" style="padding:10px;font-size:0.6rem">No solution —<br>loosen constraints.</div>`;
    return;
  }
  const finalBoard = replaySolution(path);
  const cellStep = Array.from({ length: 8 }, () => Array(8).fill(null));
  let boardSim = Array.from({ length: 8 }, () => Array(8).fill(null));
  path.forEach((step, idx) => {
    for (let dr = 0; dr < step.piece.s.length; dr++) {
      for (let dc = 0; dc < step.piece.s[dr].length; dc++) {
        if (step.piece.s[dr][dc]) cellStep[step.r + dr][step.c + dc] = idx + 1;
      }
    }
    boardSim = placeOn(boardSim, step.piece, step.r, step.c, step.piece.c);
    boardSim = clearLines(boardSim);
  });

  let gridHTML = '<div class="sol-grid">';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const color = finalBoard[r][c];
      if (color) {
        const n = cellStep[r][c] ?? '';
        gridHTML += `<div class="sol-cell filled" style="background:${color}">${n}</div>`;
      } else {
        gridHTML += `<div class="sol-cell"></div>`;
      }
    }
  }
  gridHTML += '</div>';

  let piecesHTML = '<div class="sol-pieces">';
  path.forEach((step, idx) => {
    const pc = step.piece;
    piecesHTML += `<div class="sol-piece"><div class="sol-piece-num">${idx + 1}</div>`;
    piecesHTML += `<div class="sol-piece-shape" style="grid-template-columns:repeat(${pc.s[0].length},4px)">`;
    pc.s.forEach(row => {
      row.forEach(v => {
        piecesHTML += v
          ? `<div class="sol-piece-cell on" style="background:${pc.c}"></div>`
          : `<div class="sol-piece-cell"></div>`;
      });
    });
    piecesHTML += '</div></div>';
  });
  piecesHTML += '</div>';

  host.innerHTML = gridHTML + piecesHTML;
}

// Catmull-Rom spline → cubic Bezier path for smooth curve through points
function catmullRomPath(pts) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

// ============================================================
// STEP 3 — TRACKING & ADJUSTMENT
// ============================================================
const Step3 = {
  VB_W: 600, VB_H: 240, PAD_L: 8, PAD_R: 8, PAD_T: 14, PAD_B: 14,
  simPlays: 10000,
  snapshot: [], // per level: { lvl, target, observed, bucketKey, bucketLabel, plays, wins, losses, attempts, wr, drift, substituted }

  init() {
    if (this._inited) return;
    this._inited = true;
    document.querySelectorAll('#sim-plays button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#sim-plays button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.simPlays = parseInt(btn.dataset.val, 10);
        this.build();
      });
    });
    document.getElementById('substitute-all-btn')?.addEventListener('click', () => this.substituteAll());
    this.build();
  },

  // Simulate telemetry deterministically from the current curve + simPlays
  build() {
    const rand = rng(hashParams({
      solutions: DifficultyCurve.anchors.reduce((a,b) => a+b.level*100+b.y*1000, 0),
      rounds: this.simPlays, sqrMin: 0, sqrMax: 0, totalMin: 0, totalMax: 0,
    }));
    this.snapshot = [];
    for (let lvl = 1; lvl <= 10; lvl++) {
      const yNorm = DifficultyCurve.sampleYAtLevel(lvl);
      const params = DifficultyCurve.deriveParams(yNorm, lvl);
      const target = difficultyScore(params);
      // Target win rate: harder → fewer wins
      const targetWR = Math.max(0.05, Math.min(0.95, 1 - target / 12));
      // Observed = target + drift noise in WR space (±0.18 stdev-ish)
      const noise = (rand() - 0.5) * 0.35;
      const observedWR = Math.max(0.03, Math.min(0.98, targetWR + noise));
      const observed = Math.max(0, Math.min(10, (1 - observedWR) * 12));
      const plays = this.simPlays;
      const wins = Math.round(plays * observedWR);
      const losses = plays - wins;
      // Attempts/play scales with difficulty (harder = retries)
      const attemptsPerPlay = 1 + observed * 0.35 + rand() * 0.4;
      const attempts = Math.round(plays * attemptsPerPlay);
      this.snapshot.push({
        lvl, target, observed, yNorm,
        bucketKey: DifficultyCurve.bucketKey(yNorm),
        bucketLabel: DifficultyCurve.bucketLabel(yNorm),
        plays, wins, losses, attempts,
        wr: observedWR,
        drift: observed - target,
        substituted: false,
      });
    }
    this.render();
  },

  substituteAll() {
    this.snapshot.forEach(r => {
      if (Math.abs(r.drift) > 0.9) {
        // "AI substitutes the level" — pull observed into target, with tiny residual
        r.observed = r.target + (r.drift > 0 ? -0.15 : 0.15) * (Math.random() * 0.5);
        r.wr = Math.max(0.05, Math.min(0.95, 1 - r.observed / 12));
        r.wins = Math.round(r.plays * r.wr);
        r.losses = r.plays - r.wins;
        r.drift = r.observed - r.target;
        r.substituted = true;
      }
    });
    this.render();
  },

  substituteOne(idx) {
    const r = this.snapshot[idx];
    r.observed = r.target + (Math.random() - 0.5) * 0.3;
    r.wr = Math.max(0.05, Math.min(0.95, 1 - r.observed / 12));
    r.wins = Math.round(r.plays * r.wr);
    r.losses = r.plays - r.wins;
    r.drift = r.observed - r.target;
    r.substituted = true;
    this.render();
  },

  render() {
    this.renderKPIs();
    this.renderChart();
    this.renderTable();
  },

  renderKPIs() {
    const total = this.snapshot.reduce((a, r) => a + r.plays, 0);
    const totalAttempts = this.snapshot.reduce((a, r) => a + r.attempts, 0);
    const totalWins = this.snapshot.reduce((a, r) => a + r.wins, 0);
    const avgWR = totalWins / total;
    const drifting = this.snapshot.filter(r => Math.abs(r.drift) > 0.9).length;
    const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : '' + n;
    document.getElementById('kpi-plays').textContent = fmt(total);
    document.getElementById('kpi-attempts').textContent = fmt(totalAttempts);
    document.getElementById('kpi-winrate').textContent = (avgWR * 100).toFixed(0) + '%';
    document.getElementById('kpi-drift').textContent = `${drifting} / 10`;
  },

  levelToX(lvl) {
    const innerW = this.VB_W - this.PAD_L - this.PAD_R;
    return this.PAD_L + ((lvl - 1) / 9) * innerW;
  },
  difficultyToY(d) {
    const innerH = this.VB_H - this.PAD_T - this.PAD_B;
    return this.PAD_T + (1 - d / 10) * innerH;
  },

  renderChart() {
    const gridG = document.getElementById('tracking-grid');
    const deltasG = document.getElementById('tracking-deltas');
    const dotsG = document.getElementById('tracking-observed-dots');
    const targetPath = document.getElementById('tracking-target-path');
    const observedPath = document.getElementById('tracking-observed-path');
    const observedArea = document.getElementById('tracking-observed-area');
    if (!gridG) return;

    // Grid lines
    let gh = '';
    for (let i = 0; i < 5; i++) {
      const y = this.PAD_T + (i / 4) * (this.VB_H - this.PAD_T - this.PAD_B);
      gh += `<line x1="${this.PAD_L}" y1="${y}" x2="${this.VB_W - this.PAD_R}" y2="${y}"/>`;
    }
    for (let l = 1; l <= 10; l++) {
      const x = this.levelToX(l);
      gh += `<line x1="${x}" y1="${this.PAD_T}" x2="${x}" y2="${this.VB_H - this.PAD_B}"/>`;
    }
    gridG.innerHTML = gh;

    const targetPts = this.snapshot.map(r => ({ x: this.levelToX(r.lvl), y: this.difficultyToY(r.target) }));
    const observedPts = this.snapshot.map(r => ({ x: this.levelToX(r.lvl), y: this.difficultyToY(r.observed) }));

    targetPath.setAttribute('d', catmullRomPath(targetPts));
    const obD = catmullRomPath(observedPts);
    observedPath.setAttribute('d', obD);
    const areaBottom = this.VB_H - this.PAD_B;
    observedArea.setAttribute('d', obD + ` L ${observedPts[observedPts.length-1].x} ${areaBottom} L ${observedPts[0].x} ${areaBottom} Z`);

    // Drift segments (target → observed)
    let dh = '';
    this.snapshot.forEach((r, i) => {
      if (Math.abs(r.drift) > 0.9) {
        dh += `<line x1="${targetPts[i].x}" y1="${targetPts[i].y}" x2="${observedPts[i].x}" y2="${observedPts[i].y}"/>`;
      }
    });
    deltasG.innerHTML = dh;

    // Observed dots
    let dotsH = '';
    observedPts.forEach(p => { dotsH += `<circle cx="${p.x}" cy="${p.y}" r="4"/>`; });
    dotsG.innerHTML = dotsH;
  },

  renderTable() {
    const host = document.getElementById('tt-rows');
    if (!host) return;
    const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : '' + n;
    host.innerHTML = this.snapshot.map((r, i) => {
      const drift = r.drift;
      const driftCls = Math.abs(drift) > 0.9 ? 'tt-delta--warn' : 'tt-delta--ok';
      const sign = drift > 0 ? '+' : '';
      const off = Math.abs(drift) > 0.9;
      const actLabel = r.substituted ? 'Fixed' : (off ? 'Substitute' : 'On target');
      const actCls = off && !r.substituted ? 'tt-action tt-action--active' : 'tt-action';
      return `
        <div class="tt-row">
          <span class="tt-lv">${r.lvl}</span>
          <span class="tt-bucket level-card--${r.bucketKey}">${r.bucketLabel}</span>
          <span class="tt-num">${fmt(r.plays)}</span>
          <span class="tt-num">${(r.wr * 100).toFixed(0)}%</span>
          <span class="tt-num">${(r.attempts / r.plays).toFixed(1)}</span>
          <span class="tt-target">${r.target.toFixed(1)}</span>
          <span class="tt-observed">${r.observed.toFixed(1)}</span>
          <span class="tt-delta ${driftCls}">${sign}${drift.toFixed(1)}</span>
          <button class="${actCls}" data-idx="${i}">${actLabel}</button>
        </div>
      `;
    }).join('');
    host.querySelectorAll('.tt-action--active').forEach(btn => {
      btn.addEventListener('click', () => this.substituteOne(parseInt(btn.dataset.idx, 10)));
    });
  },
};

// ============================================================
// ECONOMY TUNING (Step 4)
// ============================================================
const EconomyTuning = {
  _started: false,
  LEVELS: 50,
  VB_W: 600,
  VB_H: 220,
  state: {
    checkpoint: 10,
    decay: 20,
    coin: { start: 500, earnStart: 100, earnEnd: 50, spend: 70, spike: 300 },
    gem:  { start: 50,  earnStart: 5,   earnEnd: 2,  spend: 3,  spike: 30  },
  },
  presets: {
    generous: { checkpoint: 15, decay: 30, coin: { start: 1000, earnStart: 200, earnEnd: 120, spend: 60, spike: 200 }, gem: { start: 100, earnStart: 8, earnEnd: 4, spend: 2, spike: 20 } },
    balanced: { checkpoint: 10, decay: 20, coin: { start: 500,  earnStart: 100, earnEnd: 50,  spend: 70, spike: 300 }, gem: { start: 50,  earnStart: 5, earnEnd: 2, spend: 3, spike: 30 } },
    grindy:   { checkpoint: 7,  decay: 12, coin: { start: 200,  earnStart: 60,  earnEnd: 30,  spend: 80, spike: 400 }, gem: { start: 20,  earnStart: 2, earnEnd: 1, spend: 4, spike: 50 } },
  },

  _randomize: false,
  _randTimer: null,
  _randVel: null,

  init() {
    if (this._started) return;
    this._started = true;
    this.bindSliders();
    this.bindPresets();
    this.bindGenerate();
    this.bindRandomize();
    this.applyPreset('balanced', { silent: true });
    this.syncAll();
  },

  bindSliders() {
    document.querySelectorAll('.et-slider').forEach(s => {
      s.addEventListener('input', () => {
        this.stopRandomize();
        const cur = s.dataset.c;
        const p   = s.dataset.p;
        const v   = parseFloat(s.value);
        if (cur) this.state[cur][p] = v;
        else     this.state[p] = v;
        this.syncAll();
      });
    });
  },

  bindPresets() {
    document.querySelectorAll('.et-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.stopRandomize();
        this.applyPreset(btn.dataset.preset);
      });
    });
  },

  bindRandomize() {
    const btn = document.getElementById('et-randomize-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (this._randomize) this.stopRandomize();
      else this.startRandomize();
    });
  },

  _sliderBounds(c, p) {
    const sel = c ? `.et-slider[data-c="${c}"][data-p="${p}"]` : `.et-slider[data-p="${p}"]:not([data-c])`;
    const s = document.querySelector(sel);
    if (!s) return null;
    return { min: parseFloat(s.min), max: parseFloat(s.max), step: parseFloat(s.step) || 1 };
  },

  _initRandomVel() {
    this._randVel = { coin: {}, gem: {} };
    ['coin', 'gem'].forEach(c => {
      ['start', 'earnStart', 'earnEnd', 'spend', 'spike'].forEach(p => {
        const b = this._sliderBounds(c, p);
        if (!b) return;
        // start with a random kick so motion begins immediately
        const range = b.max - b.min;
        this._randVel[c][p] = (Math.random() - 0.5) * range * 0.04;
      });
    });
  },

  _stepRandomize() {
    if (!this._randVel) this._initRandomVel();
    ['coin', 'gem'].forEach(c => {
      ['start', 'earnStart', 'earnEnd', 'spend', 'spike'].forEach(p => {
        const b = this._sliderBounds(c, p);
        if (!b) return;
        const range = b.max - b.min || 1;
        const cur = this.state[c][p];
        const norm = (cur - b.min) / range; // 0..1 position in range

        // random impulse + light friction + edge repel so values keep traversing full range
        const impulse = (Math.random() - 0.5) * range * 0.045;
        let edge = 0;
        if (norm < 0.08) edge = range * 0.006;
        else if (norm > 0.92) edge = -range * 0.006;

        let vel = (this._randVel[c][p] || 0) * 0.9 + impulse + edge;
        const maxVel = range * 0.04;
        if (vel > maxVel) vel = maxVel;
        if (vel < -maxVel) vel = -maxVel;
        this._randVel[c][p] = vel;

        let next = cur + vel;
        if (next < b.min) { next = b.min; this._randVel[c][p] = Math.abs(vel) * 0.5; }
        if (next > b.max) { next = b.max; this._randVel[c][p] = -Math.abs(vel) * 0.5; }
        next = Math.round(next / b.step) * b.step;
        this.state[c][p] = next;
      });
    });
    this.writeBackToDom();
    this.syncAll();
  },

  startRandomize() {
    if (this._randomize) return;
    this._randomize = true;
    this._initRandomVel();
    const btn = document.getElementById('et-randomize-btn');
    if (btn) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      btn.textContent = 'Randomize: on';
    }
    const tick = () => {
      if (!this._randomize) return;
      this._stepRandomize();
      this._randTimer = setTimeout(tick, 70);
    };
    tick();
  },

  stopRandomize() {
    if (!this._randomize && !this._randTimer) return;
    this._randomize = false;
    if (this._randTimer) { clearTimeout(this._randTimer); this._randTimer = null; }
    const btn = document.getElementById('et-randomize-btn');
    if (btn) {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
      btn.textContent = 'Randomize: off';
    }
  },

  bindGenerate() {
    const btn = document.getElementById('et-generate-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      this.stopRandomize();
      const active = document.querySelector('.et-preset-btn.active')?.dataset.preset || 'balanced';
      const base = this.presets[active];
      // jitter each field ±20%
      const jitter = (v, pct = 0.2) => Math.max(0, Math.round(v * (1 - pct + Math.random() * pct * 2)));
      const next = {
        checkpoint: Math.max(5, Math.min(20, base.checkpoint + Math.floor(Math.random() * 5 - 2))),
        decay:      Math.max(5, Math.min(50, base.decay + Math.floor(Math.random() * 8 - 4))),
        coin: {
          start: jitter(base.coin.start),
          earnStart: jitter(base.coin.earnStart),
          earnEnd: jitter(base.coin.earnEnd),
          spend: jitter(base.coin.spend),
          spike: jitter(base.coin.spike),
        },
        gem: {
          start: jitter(base.gem.start),
          earnStart: jitter(base.gem.earnStart),
          earnEnd: jitter(base.gem.earnEnd),
          spend: jitter(base.gem.spend),
          spike: jitter(base.gem.spike),
        },
      };
      this.state = next;
      this.writeBackToDom();
      this.syncAll();
    });
  },

  applyPreset(name, opts = {}) {
    const p = this.presets[name];
    if (!p) return;
    document.querySelectorAll('.et-preset-btn').forEach(b => b.classList.toggle('active', b.dataset.preset === name));
    this.state = JSON.parse(JSON.stringify(p));
    this.writeBackToDom();
    if (!opts.silent) this.syncAll();
  },

  writeBackToDom() {
    document.querySelectorAll('.et-slider').forEach(s => {
      const cur = s.dataset.c;
      const p   = s.dataset.p;
      s.value = cur ? this.state[cur][p] : this.state[p];
    });
  },

  syncAll() {
    // update label text from sliders
    document.querySelectorAll('.et-slider').forEach(s => {
      const cur = s.dataset.c;
      const p   = s.dataset.p;
      const target = cur ? `coin:${p}` : p;
      const labelSelector = cur ? `[data-cv="${cur}:${p}"]` : `[data-v="${p}"]`;
      const el = document.querySelector(labelSelector);
      if (el) el.textContent = cur ? this.state[cur][p] : this.state[p];
    });
    const coinData = this.simulate('coin');
    const gemData  = this.simulate('gem');
    this.renderChart('et-coin-chart', coinData, '#f59e0b', 10000);
    this.renderChart('et-gem-chart',  gemData,  '#00a1e1', 1500);
    this.updateStats(coinData, gemData);
  },

  simulate(cur) {
    const s = this.state[cur];
    const { checkpoint, decay } = this.state;
    const balance = [];
    let b = s.start;
    const net = [];
    for (let L = 1; L <= this.LEVELS; L++) {
      const t = Math.min(1, (L - 1) / Math.max(1, decay));
      const earn = s.earnStart + (s.earnEnd - s.earnStart) * t;
      let spend = s.spend;
      const isCheckpoint = L % checkpoint === 0 && L > 0;
      if (isCheckpoint) spend += s.spike;
      const delta = earn - spend;
      b = b + delta;
      balance.push(b);
      net.push(delta);
    }
    return { balance, net, totalEarn: net.reduce((a, d, i) => a + Math.max(0, d), 0), totalSpend: net.reduce((a, d) => a + Math.max(0, -d), 0) };
  },

  renderChart(id, data, color, yMax) {
    const svg = document.getElementById(id);
    if (!svg) return;
    const { VB_W, VB_H, LEVELS } = this;
    const { balance } = data;

    const minV = -yMax;
    const maxV = yMax;
    const range = maxV - minV;
    const padTop = 12, padBot = 12;
    const usable = VB_H - padTop - padBot;

    const xAt = L => ((L - 1) / (LEVELS - 1)) * VB_W;
    const yAt = v => padTop + (1 - (v - minV) / range) * usable;

    // grid (skip i=2 — the zero line renders there with its own style)
    const grid = svg.querySelector('.et-chart-grid');
    grid.innerHTML = '';
    for (let i = 0; i <= 4; i++) {
      if (i === 2) continue;
      const y = padTop + (usable * i / 4);
      grid.innerHTML += `<line x1="0" y1="${y}" x2="${VB_W}" y2="${y}"/>`;
    }

    // checkpoints
    const cps = svg.querySelector('.et-chart-checkpoints');
    cps.innerHTML = '';
    for (let L = this.state.checkpoint; L <= LEVELS; L += this.state.checkpoint) {
      const x = xAt(L);
      cps.innerHTML += `<line x1="${x}" y1="${padTop}" x2="${x}" y2="${VB_H - padBot}"/>`;
    }

    // zero line
    const zero = svg.querySelector('.et-chart-zero');
    const y0 = yAt(0);
    zero.setAttribute('y1', y0);
    zero.setAttribute('y2', y0);
    zero.setAttribute('x2', VB_W);

    // line + area
    const pts = balance.map((v, i) => `${xAt(i + 1)},${yAt(v)}`);
    const linePath = 'M' + pts.join(' L');
    const areaPath = `M${xAt(1)},${y0} L${pts.join(' L')} L${xAt(LEVELS)},${y0} Z`;
    svg.querySelector('.et-chart-line').setAttribute('d', linePath);
    svg.querySelector('.et-chart-area').setAttribute('d', areaPath);

    // dry dots — mark levels where balance is ≤ 0 AND previous was > 0 (entering dry), OR is a checkpoint and ≤ 0
    const dots = svg.querySelector('.et-chart-dry-dots');
    dots.innerHTML = '';
    balance.forEach((v, i) => {
      const L = i + 1;
      const isCp = L % this.state.checkpoint === 0;
      if (isCp && v <= 5) {
        dots.innerHTML += `<circle cx="${xAt(L)}" cy="${yAt(v)}" r="4"/>`;
      }
    });

    // x-axis: baseline + ticks (in SVG) + aligned numeric labels (in HTML overlay)
    const xaxis = svg.querySelector('.et-chart-xaxis');
    const axisY = VB_H - padBot;
    const tickLevels = [1, 10, 20, 30, 40, 50];
    let xAxisHtml = `<line class="et-xaxis-base" x1="0" y1="${axisY}" x2="${VB_W}" y2="${axisY}"/>`;
    tickLevels.forEach(L => {
      const x = xAt(L);
      xAxisHtml += `<line class="et-xaxis-tick" x1="${x}" y1="${axisY}" x2="${x}" y2="${axisY + 4}"/>`;
    });
    xaxis.innerHTML = xAxisHtml;

    const labelsWrap = svg.parentElement.querySelector('[data-xlabels]');
    if (labelsWrap) {
      labelsWrap.innerHTML = tickLevels.map(L => {
        const pct = ((L - 1) / (LEVELS - 1)) * 100;
        return `<span style="left:${pct}%">${L}</span>`;
      }).join('');
    }

    // y-axis: baseline + ticks (in SVG) + aligned numeric labels (in HTML overlay)
    const yaxis = svg.querySelector('.et-chart-yaxis');
    let yAxisHtml = `<line class="et-yaxis-base" x1="0" y1="${padTop}" x2="0" y2="${VB_H - padBot}"/>`;
    const fmtY = (v) => {
      const a = Math.abs(v);
      if (a >= 1000) return (v / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
      return Math.round(v).toString();
    };
    const yLabelsHtml = [];
    for (let i = 0; i <= 4; i++) {
      const y = padTop + (usable * i / 4);
      yAxisHtml += `<line class="et-yaxis-tick" x1="0" y1="${y}" x2="4" y2="${y}"/>`;
      const val = maxV - (range * i / 4);
      const pct = (y / VB_H) * 100;
      yLabelsHtml.push(`<span style="top:${pct}%">${fmtY(val)}</span>`);
    }
    yaxis.innerHTML = yAxisHtml;

    const yLabelsWrap = svg.parentElement.querySelector('[data-ylabels]');
    if (yLabelsWrap) yLabelsWrap.innerHTML = yLabelsHtml.join('');
  },

  updateStats(coinData, gemData) {
    const firstDry = (arr) => { for (let i = 0; i < arr.length; i++) if (arr[i] <= 0) return i + 1; return null; };
    const coinDry = firstDry(coinData.balance);
    const gemDry  = firstDry(gemData.balance);
    const fmt = (n) => n === null ? '—' : `Lv ${n}`;

    const setStat = (id, val, cls) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = val;
      el.classList.remove('et-stat-val--warn', 'et-stat-val--ok');
      if (cls) el.classList.add(cls);
    };

    setStat('et-coin-dry', fmt(coinDry), coinDry && coinDry < 50 ? 'et-stat-val--warn' : 'et-stat-val--ok');
    setStat('et-gem-dry',  fmt(gemDry),  gemDry  && gemDry  < 50 ? 'et-stat-val--warn' : 'et-stat-val--ok');

    const coinNet = coinData.balance[coinData.balance.length - 1] - this.state.coin.start;
    const gemNet  = gemData.balance[gemData.balance.length - 1]  - this.state.gem.start;
    const fmtNet = (n, g) => `${n >= 0 ? '+' : ''}${Math.round(n)} ${g}`;
    setStat('et-coin-total', fmtNet(coinNet, '🪙'), coinNet >= 0 ? 'et-stat-val--ok' : 'et-stat-val--warn');
    setStat('et-gem-total',  fmtNet(gemNet,  '💎'), gemNet  >= 0 ? 'et-stat-val--ok' : 'et-stat-val--warn');
  },
};

// ============================================================
// MONETIZATION (Step 4) — Ads + IAPs
// ============================================================
const Monetization = {
  _started: false,
  state: {
    activeTab: 'ads',
    ads: {
      enabled: { banner: true, interstitial: true, rewarded: true },
      banner: {
        position: 'bottom',      // 'bottom' | 'top' | 'middle'
        visibility: 'persistent', // 'persistent' | 'levels'
        levelRange: '5-20, 40+',
      },
      interstitial: {
        placements: {
          app_start: false, level_start: false, level_finish: true, level_lose: true,
          level_win: false, during_level: false, main_menu: false, shop: false,
        },
        cadenceMode: 'levels', // 'levels' | 'minutes'
        cadenceLevels: 2,
        cadenceMinutes: 2,
      },
      rv: {
        placements: {
          daily_reward: true, double_level: true, double_levelup: false,
          shop_reroll: false, coins_diamonds: false, placement_boost: false,
          lives_refresh: true, spin_wheel: false,
        },
        pausesInterstitials: true,
      },
      estimate: {
        dau: 50000,
        metric: 'imp_per_dau', // 'imp_per_dau' | 'ecpm' | 'arpu'
      },
    },
    iaps: {
      skus: [
        { price: 0.99,  contents: '500 🪙',                featured: false },
        { price: 4.99,  contents: '3,000 🪙 + 10 💎',       featured: true  },
        { price: 9.99,  contents: '7,000 🪙 + 25 💎',       featured: false },
        { price: 99.99, contents: 'Whale bundle',           featured: false },
      ],
      anchorPrice: 'featured', // 'cheapest' | 'featured' | 'expensive'
      starterEnabled: true,
      starterDiscount: 40,
      starterTrigger: 'session3', // 'first_launch' | 'session3' | 'first_loss'
      offerEnabled: true,
      offerCooldown: 48,
      offerTypes: { coin_gem: true, booster: true, cosmetic: false, whale: false },
      estimate: {
        dau: 50000,
        metric: 'funnel', // 'funnel' | 'revenue_by_sku' | 'arpdau_vs_dau'
      },
    },
  },

  init() {
    if (this._started) return;
    this._started = true;
    this.bindTabs();
    this.bindAdsConfigurator();
    this.bindIapsConfigurator();
    this.renderSkuTable();
    this.bindGenerate();
    this.updateBannerPreview();
    this.updateInterPreview();
    this.updateRvPreview();
    this.renderEstimate();
    this.bindEstimateHover();
    this.renderShopPreview();
    this.renderStarterPreview();
    this.renderOfferPreview();
    this.renderIapEstimate();
    this.bindIapEstimateHover();
    // Re-render charts on resize so pixel-matched viewBoxes stay crisp.
    if (!this._resizeBound) {
      this._resizeBound = true;
      let raf;
      window.addEventListener('resize', () => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => { this.renderEstimate(); this.renderIapEstimate(); });
      });
    }
  },

  _svgDims(svg) {
    const r = svg.getBoundingClientRect();
    const w = Math.max(100, Math.round(r.width));
    const h = Math.max(60, Math.round(r.height));
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    return { w, h };
  },

  bindTabs() {
    document.querySelectorAll('.mon-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const which = btn.dataset.mtab;
        this.state.activeTab = which;
        document.querySelectorAll('.mon-tab-btn').forEach(b => {
          const on = b.dataset.mtab === which;
          b.classList.toggle('active', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        document.querySelectorAll('.mon-panel').forEach(p => {
          p.classList.toggle('active', p.dataset.mpanel === which);
        });
      });
    });
  },

  bindAdsConfigurator() {
    const onChange = () => { this.renderEstimate(); };

    // Card enable checkboxes
    document.querySelectorAll('.ads-enable').forEach(cb => {
      cb.addEventListener('change', () => {
        const f = cb.dataset.f;
        this.state.ads.enabled[f] = cb.checked;
        const card = cb.closest('.ads-card');
        if (card) card.classList.toggle('ads-card--off', !cb.checked);
        onChange();
      });
    });

    // BANNER
    document.querySelectorAll('input[name="bannerPos"]').forEach(r => {
      r.addEventListener('change', () => {
        if (r.checked) {
          this.state.ads.banner.position = r.value;
          this.updateBannerPreview();
          onChange();
        }
      });
    });
    document.querySelectorAll('input[name="bannerVis"]').forEach(r => {
      r.addEventListener('change', () => {
        if (!r.checked) return;
        this.state.ads.banner.visibility = r.value;
        const rangeWrap = document.getElementById('ads-banner-levels');
        if (rangeWrap) rangeWrap.hidden = r.value !== 'levels';
        this.updateBannerPreview();
        onChange();
      });
    });
    const levelInput = document.getElementById('ads-banner-level-range');
    if (levelInput) {
      levelInput.addEventListener('input', () => {
        this.state.ads.banner.levelRange = levelInput.value;
      });
    }

    // INTERSTITIAL
    document.querySelectorAll('[data-group="interPlacements"] input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        this.state.ads.interstitial.placements[cb.dataset.p] = cb.checked;
        this.updateInterPreview();
        onChange();
      });
    });
    document.querySelectorAll('input[name="interCadence"]').forEach(r => {
      r.addEventListener('change', () => {
        if (r.checked) {
          this.state.ads.interstitial.cadenceMode = r.value;
          this.updateInterPreview();
          onChange();
        }
      });
    });
    const cadLevels = document.getElementById('ads-cadence-levels');
    if (cadLevels) {
      cadLevels.addEventListener('input', () => {
        const v = Math.max(1, parseInt(cadLevels.value, 10) || 1);
        this.state.ads.interstitial.cadenceLevels = v;
        this.updateInterPreview();
        onChange();
      });
    }
    const cadMinutes = document.getElementById('ads-cadence-minutes');
    if (cadMinutes) {
      cadMinutes.addEventListener('input', () => {
        const v = Math.max(1, parseInt(cadMinutes.value, 10) || 1);
        this.state.ads.interstitial.cadenceMinutes = v;
        this.updateInterPreview();
        onChange();
      });
    }

    // RV
    document.querySelectorAll('[data-group="rvPlacements"] input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        this.state.ads.rv.placements[cb.dataset.p] = cb.checked;
        this.updateRvPreview();
        onChange();
      });
    });
    const rvPauses = document.getElementById('ads-rv-pauses');
    if (rvPauses) {
      rvPauses.addEventListener('change', () => {
        this.state.ads.rv.pausesInterstitials = rvPauses.checked;
        onChange();
      });
    }

    // ESTIMATE — DAU chips
    document.querySelectorAll('#ads-dau-chips .ads-dau-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const value = chip.dataset.dau;
        document.querySelectorAll('#ads-dau-chips .ads-dau-chip').forEach(c => c.classList.toggle('active', c === chip));
        const customInput = document.getElementById('ads-dau-custom');
        if (value === 'custom') {
          if (customInput) {
            customInput.hidden = false;
            customInput.focus();
          }
        } else {
          if (customInput) customInput.hidden = true;
          this.state.ads.estimate.dau = parseInt(value, 10);
          this.renderEstimate();
        }
      });
    });
    const customInput = document.getElementById('ads-dau-custom');
    if (customInput) {
      customInput.addEventListener('input', () => {
        const v = Math.max(1000, parseInt(customInput.value, 10) || 1000);
        this.state.ads.estimate.dau = v;
        this.renderEstimate();
      });
    }

    // ESTIMATE — metric tabs (scoped to ads panel only)
    document.querySelectorAll('.mon-panel[data-mpanel="ads"] .ads-metric-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const metric = tab.dataset.metric;
        this.state.ads.estimate.metric = metric;
        document.querySelectorAll('.mon-panel[data-mpanel="ads"] .ads-metric-tab').forEach(t => {
          const on = t.dataset.metric === metric;
          t.classList.toggle('active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        this.renderEstimate();
      });
    });

  },

  updateBannerPreview() {
    const mock = document.querySelector('#ads-preview-banner .ads-banner-mock');
    const card = document.querySelector('.ads-card--banner');
    if (!mock || !card) return;
    const { position, visibility } = this.state.ads.banner;
    const enabled = this.state.ads.enabled.banner;
    mock.dataset.pos = position;
    mock.classList.toggle('ads-hidden', !enabled);
    mock.textContent = visibility === 'levels' ? 'Banner (lv 5-20)' : 'Banner ad';
  },

  updateInterPreview() {
    const caption = document.getElementById('ads-inter-caption');
    if (!caption) return;
    const { placements, cadenceMode, cadenceLevels, cadenceMinutes } = this.state.ads.interstitial;
    const labels = {
      app_start: 'App start', level_start: 'Level start', level_finish: 'Level finish',
      level_lose: 'Level lose', level_win: 'Level win', during_level: 'During level',
      main_menu: 'Main menu', shop: 'Shop', custom: 'Custom',
    };
    const active = Object.keys(placements).filter(k => placements[k]).map(k => labels[k]);
    const cadenceText = cadenceMode === 'levels'
      ? `every ${cadenceLevels} level${cadenceLevels === 1 ? '' : 's'}`
      : `every ${cadenceMinutes} min${cadenceMinutes === 1 ? '' : 's'}`;
    caption.textContent = active.length
      ? `Fires on: ${active.join(', ')} · ${cadenceText}`
      : `No placements selected · ${cadenceText}`;
  },

  updateRvPreview() {
    const title = document.getElementById('ads-rv-title');
    if (!title) return;
    const { placements } = this.state.ads.rv;
    const labels = {
      daily_reward: 'Daily reward', double_level: 'Double level reward',
      double_levelup: 'Double level-up', shop_reroll: 'Shop reroll',
      coins_diamonds: 'Coins → Diamonds', placement_boost: 'Placement boost',
      lives_refresh: 'Lives refresh', spin_wheel: 'Spin the wheel',
      custom: 'Custom',
    };
    const first = Object.keys(placements).find(k => placements[k]);
    title.textContent = first ? labels[first] : 'Rewarded video';
  },

  pulseEstimateBtn() {
    const btn = document.getElementById('ads-estimate-btn');
    if (!btn) return;
    btn.classList.remove('pulse');
    void btn.offsetWidth;
    btn.classList.add('pulse');
  },

  // ---------- Estimate model ----------
  estimateAdsPerFormat() {
    const { enabled, banner, interstitial, rv } = this.state.ads;
    // Per-format impressions per DAU per day (deterministic model).
    const SESSIONS_PER_DAY = 3.2;

    // Banner: persistent = more impressions; "specific levels" = ~50% less (coverage).
    const bannerBaseImpr = banner.visibility === 'persistent' ? 22 : 11;
    // Middle overlay is more intrusive → slightly higher eCPM but capped impressions.
    const bannerEcpm = banner.position === 'middle' ? 0.9 : 0.35;
    const banIpd = enabled.banner ? bannerBaseImpr : 0;

    // Interstitial: impressions driven by placement count + cadence.
    const interPlacementCount = Object.values(interstitial.placements).filter(Boolean).length;
    const triggersPerSession = Math.min(6, interPlacementCount * 0.9);
    let cadenceFactor;
    if (interstitial.cadenceMode === 'levels') {
      cadenceFactor = 1 / Math.max(1, interstitial.cadenceLevels);
    } else {
      cadenceFactor = 1 / Math.max(1, interstitial.cadenceMinutes * 0.7);
    }
    let interIpd = enabled.interstitial ? SESSIONS_PER_DAY * triggersPerSession * cadenceFactor * 2.5 : 0;
    // RV pauses interstitials — ~25% suppression when enabled and RV active.
    if (enabled.interstitial && enabled.rewarded && rv.pausesInterstitials) {
      interIpd *= 0.75;
    }
    const interEcpm = 8.5;

    // RV: impressions driven by placements × engagement.
    const rvPlacementCount = Object.values(rv.placements).filter(Boolean).length;
    const rvEngageRate = 0.42;
    const rvIpd = enabled.rewarded ? Math.min(5, rvPlacementCount * rvEngageRate) : 0;
    const rvEcpm = 15;

    return {
      banner: { impr: banIpd, ecpm: bannerEcpm },
      interstitial: { impr: interIpd, ecpm: interEcpm },
      rv: { impr: rvIpd, ecpm: rvEcpm },
    };
  },

  buildEstimateSeries() {
    const { dau } = this.state.ads.estimate;
    const perFormat = this.estimateAdsPerFormat();
    const DAYS = 30;
    const formats = ['banner', 'interstitial', 'rv'];
    // Saturating LTV-style curve: fast ramp by ~d7, slow growth till d30. Monotonically increasing.
    // Different tau per format → curves saturate at different rates for visual split.
    const tauMap = { banner: 2.2, interstitial: 3.5, rv: 5.0 };
    const baselineMap = { banner: 0.35, interstitial: 0.28, rv: 0.22 };
    const engageFactor = (d, f) => {
      const b = baselineMap[f];
      return b + (1 - b) * (1 - Math.exp(-d / tauMap[f]));
    };
    // eCPM also warms up as targeting + frequency data improves; same saturating shape, gentler spread.
    const ecpmFactor = (d, f) => 0.7 + 0.3 * (1 - Math.exp(-d / (tauMap[f] * 1.2)));

    const series = {};
    formats.forEach(f => {
      const { impr, ecpm } = perFormat[f];
      const impPerDau = []; // impressions per DAU per day
      const ecpmArr = [];
      const arpu = [];     // revenue per user per day
      for (let d = 0; d < DAYS; d++) {
        const ipd = impr * engageFactor(d, f);
        const ecpmDay = ecpm * ecpmFactor(d, f);
        const arpuDay = (ipd * ecpmDay) / 1000;
        impPerDau.push(ipd);
        ecpmArr.push(ecpmDay);
        arpu.push(arpuDay);
      }
      series[f] = { imp_per_dau: impPerDau, ecpm: ecpmArr, arpu };
    });
    // Totals: sum per-DAU impressions + ARPU across formats; blended eCPM is revenue-weighted.
    const total = { imp_per_dau: [], ecpm: [], arpu: [] };
    for (let d = 0; d < DAYS; d++) {
      const ti = formats.reduce((a, f) => a + series[f].imp_per_dau[d], 0);
      const ta = formats.reduce((a, f) => a + series[f].arpu[d], 0);
      const blended = ti > 0 ? (ta * 1000) / ti : 0;
      total.imp_per_dau.push(ti);
      total.arpu.push(ta);
      total.ecpm.push(blended);
    }
    return { series, total, dau, perFormat };
  },

  renderEstimate() {
    const svg = document.getElementById('ads-estimate-chart');
    if (!svg) return;
    const { metric } = this.state.ads.estimate;
    const { series, total, dau } = this.buildEstimateSeries();

    const padL = 44, padR = 16, padTop = 12, padBot = 24;
    const { w: VB_W, h: VB_H } = this._svgDims(svg);
    const FORMATS = [
      { key: 'banner', color: '#00a1e1', grad: 'url(#ads-est-grad-banner)', label: 'Banner' },
      { key: 'interstitial', color: '#f59e0b', grad: 'url(#ads-est-grad-inter)', label: 'Interstitial' },
      { key: 'rv', color: '#10b981', grad: 'url(#ads-est-grad-rv)', label: 'Rewarded' },
    ];

    // All metrics render as per-format split (daily curves).
    const perFormatView = true;
    const days = total.imp_per_dau.length;
    const xAt = (i) => padL + (i / (days - 1)) * (VB_W - padL - padR);

    // Compute maxV
    let maxV = 0;
    if (perFormatView) {
      FORMATS.forEach(f => {
        series[f.key][metric].forEach(v => { if (v > maxV) maxV = v; });
      });
    } else {
      total[metric].forEach(v => { if (v > maxV) maxV = v; });
    }
    maxV = Math.max(maxV * 1.15, 0.0001);
    const yAt = (v) => padTop + (1 - v / maxV) * (VB_H - padTop - padBot);

    const buildPath = (arr) => {
      let p = `M ${xAt(0).toFixed(1)} ${yAt(arr[0]).toFixed(1)}`;
      for (let i = 1; i < arr.length; i++) p += ` L ${xAt(i).toFixed(1)} ${yAt(arr[i]).toFixed(1)}`;
      return p;
    };
    const buildArea = (arr) => {
      const line = buildPath(arr);
      return `${line} L ${xAt(arr.length - 1).toFixed(1)} ${(VB_H - padBot).toFixed(1)} L ${xAt(0).toFixed(1)} ${(VB_H - padBot).toFixed(1)} Z`;
    };

    // Gridlines
    const gridGroup = svg.querySelector('.et-chart-grid');
    if (gridGroup) {
      let g = '';
      for (let i = 0; i <= 4; i++) {
        const yy = padTop + ((VB_H - padTop - padBot) * i / 4);
        g += `<line x1="${padL}" y1="${yy.toFixed(1)}" x2="${VB_W - padR}" y2="${yy.toFixed(1)}" stroke="rgba(22,27,37,0.08)" stroke-width="1" stroke-dasharray="${i === 4 ? '0' : '3,4'}" vector-effect="non-scaling-stroke"/>`;
      }
      gridGroup.innerHTML = g;
    }

    // Render series
    const seriesGroup = svg.querySelector('.ads-est-series');
    if (!seriesGroup) return;
    let html = '';
    if (perFormatView) {
      FORMATS.forEach(f => {
        const arr = series[f.key][metric];
        html += `<path d="${buildArea(arr)}" fill="${f.grad}" stroke="none"/>`;
        html += `<path d="${buildPath(arr)}" fill="none" stroke="${f.color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
      });
    } else {
      const color = metric === 'revenue' ? '#10b981' : '#00a1e1';
      const grad = metric === 'revenue' ? 'url(#ads-est-grad-rv)' : 'url(#ads-est-grad-banner)';
      const arr = total[metric];
      html += `<path d="${buildArea(arr)}" fill="${grad}" stroke="none"/>`;
      html += `<path d="${buildPath(arr)}" fill="none" stroke="${color}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
    }
    // Baseline
    html += `<line x1="${padL}" y1="${VB_H - padBot}" x2="${VB_W - padR}" y2="${VB_H - padBot}" stroke="rgba(22,27,37,0.2)" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
    seriesGroup.innerHTML = html;

    // X labels (every 5 days)
    const xLabelsWrap = svg.parentElement.querySelector('[data-xlabels]');
    if (xLabelsWrap) {
      const parts = [];
      for (let d = 0; d < days; d += 5) {
        const pct = ((xAt(d) / VB_W) * 100).toFixed(2);
        parts.push(`<span style="left:${pct}%">D${d + 1}</span>`);
      }
      xLabelsWrap.innerHTML = parts.join('');
    }

    // Y labels
    const yLabelsWrap = svg.parentElement.querySelector('[data-ylabels]');
    if (yLabelsWrap) {
      const fmt = this.formatMetric.bind(this);
      const parts = [];
      for (let i = 0; i <= 4; i++) {
        const yy = padTop + ((VB_H - padTop - padBot) * i / 4);
        const v = maxV - (maxV * i / 4);
        const pct = ((yy / VB_H) * 100).toFixed(2);
        parts.push(`<span style="top:${pct}%">${fmt(v, metric)}</span>`);
      }
      yLabelsWrap.innerHTML = parts.join('');
    }

    // Legend
    const legend = document.getElementById('ads-estimate-legend');
    if (legend) {
      if (perFormatView) {
        legend.innerHTML = FORMATS.map(f => {
          const enabled = this.state.ads.enabled[f.key === 'rv' ? 'rewarded' : f.key];
          const opacity = enabled ? '1' : '0.4';
          return `<span class="ads-legend-item" style="opacity:${opacity}"><span class="ads-legend-swatch" style="background:${f.color}"></span>${f.label}</span>`;
        }).join('');
      } else {
        legend.innerHTML = `<span class="ads-legend-item"><span class="ads-legend-swatch" style="background:${metric === 'revenue' ? '#10b981' : '#00a1e1'}"></span>Total ${metric === 'revenue' ? 'revenue' : 'ARPDAU'}</span>`;
      }
    }

    // Stats — averages across the 30-day window.
    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / Math.max(arr.length, 1);
    const avgImpPerDau = avg(total.imp_per_dau);
    const avgArpu = avg(total.arpu);
    const blendedEcpm = avgImpPerDau > 0 ? (avgArpu * 1000) / avgImpPerDau : 0;

    const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    setText('ads-est-impr', avgImpPerDau.toFixed(1));
    setText('ads-est-ecpm', `$${blendedEcpm.toFixed(2)}`);
    setText('ads-est-arpdau', `$${avgArpu.toFixed(3)}`);

    // Cache for hover lookup (no recompute on mousemove)
    this._est = {
      series, total, metric, perFormatView, days, VB_W, VB_H,
      padL, padR, padTop, padBot, maxV, FORMATS,
      xAt: (i) => padL + (i / (days - 1)) * (VB_W - padL - padR),
      yAt: (v) => padTop + (1 - v / maxV) * (VB_H - padTop - padBot),
    };
  },

  formatCount(v) {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M';
    if (v >= 1000) return (v / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return Math.round(v).toString();
  },

  formatMetric(v, metric) {
    if (metric === 'ecpm') return `$${v.toFixed(2)}`;
    if (metric === 'arpu') return `$${v.toFixed(3)}`;
    // imp_per_dau — small numbers, show one decimal
    return v.toFixed(2);
  },

  formatDollarsShort(v) {
    if (v >= 1_000_000) return '$' + (v / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (v >= 1000) return '$' + (v / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    if (v >= 1) return '$' + v.toFixed(2);
    return '$' + v.toFixed(3);
  },

  bindEstimateHover() {
    const svg = document.getElementById('ads-estimate-chart');
    const tooltip = document.getElementById('ads-est-tooltip');
    if (!svg || !tooltip) return;

    const onMove = (e) => {
      if (!this._est) return;
      const rect = svg.getBoundingClientRect();
      const { VB_W, padL, padR, days, xAt } = this._est;
      // Convert clientX to viewBox X
      const localX = e.clientX - rect.left;
      const vbX = (localX / rect.width) * VB_W;
      const usable = VB_W - padL - padR;
      let idx = Math.round(((vbX - padL) / usable) * (days - 1));
      idx = Math.max(0, Math.min(days - 1, idx));
      this.updateHover(idx, rect);
    };
    const onLeave = () => this.hideHover();

    svg.addEventListener('mousemove', onMove);
    svg.addEventListener('mouseleave', onLeave);
  },

  updateHover(idx, svgRect) {
    if (!this._est) return;
    const { series, total, metric, perFormatView, FORMATS, VB_W, VB_H, padTop, padBot, xAt, yAt } = this._est;
    const svg = document.getElementById('ads-estimate-chart');
    const crosshair = svg.querySelector('.ads-est-crosshair');
    const dotsG = svg.querySelector('.ads-est-dots');
    const tooltip = document.getElementById('ads-est-tooltip');
    if (!crosshair || !dotsG || !tooltip) return;

    const xVB = xAt(idx);
    crosshair.setAttribute('x1', xVB);
    crosshair.setAttribute('x2', xVB);
    crosshair.setAttribute('y1', padTop);
    crosshair.setAttribute('y2', VB_H - padBot);
    crosshair.style.display = '';

    let dotsHtml = '';
    let rowsHtml = '';
    if (perFormatView) {
      FORMATS.forEach(f => {
        const stateKey = f.key === 'rv' ? 'rewarded' : f.key;
        const enabled = this.state.ads.enabled[stateKey];
        const v = series[f.key][metric][idx];
        const y = yAt(v);
        dotsHtml += `<circle cx="${xVB.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${f.color}" stroke="#fff" stroke-width="2" opacity="${enabled ? 1 : 0.35}" vector-effect="non-scaling-stroke"/>`;
        rowsHtml += `<div class="ads-est-tt-row" style="opacity:${enabled ? 1 : 0.5}"><span class="ads-est-tt-swatch" style="background:${f.color}"></span><span class="ads-est-tt-label">${f.label}</span><span class="ads-est-tt-val">${this.formatMetric(v, metric)}</span></div>`;
      });
    } else {
      const color = metric === 'revenue' ? '#10b981' : '#00a1e1';
      const label = metric === 'revenue' ? 'Revenue' : 'ARPDAU';
      const v = total[metric][idx];
      const y = yAt(v);
      dotsHtml += `<circle cx="${xVB.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="${color}" stroke="#fff" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
      rowsHtml += `<div class="ads-est-tt-row"><span class="ads-est-tt-swatch" style="background:${color}"></span><span class="ads-est-tt-label">${label}</span><span class="ads-est-tt-val">${this.formatMetric(v, metric)}</span></div>`;
    }
    dotsG.innerHTML = dotsHtml;

    tooltip.innerHTML = `<div class="ads-est-tt-head">Day ${idx + 1}</div>${rowsHtml}`;
    tooltip.style.display = '';

    // Position tooltip in plot coordinates — flip to left if we're past 60% of width.
    const rect = svgRect || svg.getBoundingClientRect();
    const plotLeft = svg.offsetLeft;
    const plotWidth = rect.width;
    const xPx = plotLeft + (xVB / VB_W) * plotWidth;
    const plotEl = svg.parentElement;
    const tooltipWidth = tooltip.offsetWidth || 160;
    const flipLeft = (xVB / VB_W) > 0.6;
    const leftPos = flipLeft ? (xPx - tooltipWidth - 10) : (xPx + 10);
    tooltip.style.left = `${Math.max(8, Math.min(leftPos, plotEl.clientWidth - tooltipWidth - 8))}px`;
    tooltip.style.top = `${svg.offsetTop + 12}px`;
  },

  hideHover() {
    const svg = document.getElementById('ads-estimate-chart');
    const tooltip = document.getElementById('ads-est-tooltip');
    if (svg) {
      const crosshair = svg.querySelector('.ads-est-crosshair');
      const dotsG = svg.querySelector('.ads-est-dots');
      if (crosshair) crosshair.style.display = 'none';
      if (dotsG) dotsG.innerHTML = '';
    }
    if (tooltip) tooltip.style.display = 'none';
  },

  bindIapsConfigurator() {
    const onChange = () => {
      this.renderShopPreview();
      this.renderStarterPreview();
      this.renderOfferPreview();
      this.renderIapEstimate();
    };

    // Card enable toggles (starter / offer)
    document.querySelectorAll('.iap-enable').forEach(cb => {
      cb.addEventListener('change', () => {
        const f = cb.dataset.f;
        if (f === 'starter') this.state.iaps.starterEnabled = cb.checked;
        else if (f === 'offer') this.state.iaps.offerEnabled = cb.checked;
        const card = cb.closest('.iap-card');
        if (card) card.classList.toggle('ads-card--off', !cb.checked);
        onChange();
      });
    });

    // Anchor price radios
    document.querySelectorAll('input[name="anchorPrice"]').forEach(r => {
      r.addEventListener('change', () => {
        if (r.checked) {
          this.state.iaps.anchorPrice = r.value;
          onChange();
        }
      });
    });

    // Starter trigger radios
    document.querySelectorAll('input[name="starterTrigger"]').forEach(r => {
      r.addEventListener('change', () => {
        if (r.checked) {
          this.state.iaps.starterTrigger = r.value;
          this.renderStarterPreview();
        }
      });
    });

    // Offer bundle-type checkboxes
    document.querySelectorAll('[data-group="offerTypes"] input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        this.state.iaps.offerTypes[cb.dataset.o] = cb.checked;
        this.renderOfferPreview();
      });
    });

    // IAP sliders (discount + cadence)
    document.querySelectorAll('.mon-panel[data-mpanel="iaps"] .mon-slider[data-i]').forEach(s => {
      s.addEventListener('input', () => {
        const i = s.dataset.i;
        this.state.iaps[i] = parseInt(s.value, 10);
        const valEl = document.querySelector(`[data-iv="${i}"]`);
        if (valEl) valEl.textContent = s.value;
        if (i === 'starterDiscount') this.renderStarterPreview();
        if (i === 'offerCooldown') this.renderOfferPreview();
        this.renderIapEstimate();
      });
    });

    // Add SKU
    const addBtn = document.getElementById('mon-sku-add');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        if (this.state.iaps.skus.length >= 8) return;
        this.state.iaps.skus.push({ price: 1.99, contents: 'New pack', featured: false });
        this.renderSkuTable();
        onChange();
      });
    }

    // Estimate DAU chips
    document.querySelectorAll('#iap-dau-chips .ads-dau-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const value = chip.dataset.dau;
        document.querySelectorAll('#iap-dau-chips .ads-dau-chip').forEach(c => c.classList.toggle('active', c === chip));
        const customInput = document.getElementById('iap-dau-custom');
        if (value === 'custom') {
          if (customInput) {
            customInput.hidden = false;
            customInput.focus();
          }
        } else {
          if (customInput) customInput.hidden = true;
          this.state.iaps.estimate.dau = parseInt(value, 10);
          this.renderIapEstimate();
        }
      });
    });
    const customDau = document.getElementById('iap-dau-custom');
    if (customDau) {
      customDau.addEventListener('input', () => {
        const v = Math.max(1000, parseInt(customDau.value, 10) || 1000);
        this.state.iaps.estimate.dau = v;
        this.renderIapEstimate();
      });
    }

    // Estimate metric tabs
    document.querySelectorAll('#iap-metric-tabs .ads-metric-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const metric = tab.dataset.metric;
        this.state.iaps.estimate.metric = metric;
        document.querySelectorAll('#iap-metric-tabs .ads-metric-tab').forEach(t => {
          const on = t.dataset.metric === metric;
          t.classList.toggle('active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        this.renderIapEstimate();
      });
    });
  },

  renderSkuTable() {
    const table = document.getElementById('mon-sku-table');
    if (!table) return;
    table.querySelectorAll('.mon-sku-row').forEach(r => r.remove());
    this.state.iaps.skus.forEach((sku, idx) => {
      const row = document.createElement('div');
      row.className = 'mon-sku-row';
      row.innerHTML = `
        <input type="number" step="0.01" min="0" value="${sku.price.toFixed(2)}" data-sidx="${idx}" data-sfield="price">
        <input type="text" value="${sku.contents.replace(/"/g, '&quot;')}" data-sidx="${idx}" data-sfield="contents">
        <input type="checkbox" class="mon-sku-featured" ${sku.featured ? 'checked' : ''} data-sidx="${idx}" data-sfield="featured">
        <button class="mon-sku-del" type="button" data-sidx="${idx}" aria-label="Remove SKU">×</button>
      `;
      table.appendChild(row);
    });
    table.querySelectorAll('.mon-sku-row input').forEach(inp => {
      const ev = inp.type === 'checkbox' ? 'change' : 'input';
      inp.addEventListener(ev, () => {
        const idx = parseInt(inp.dataset.sidx, 10);
        const field = inp.dataset.sfield;
        const sku = this.state.iaps.skus[idx];
        if (!sku) return;
        if (field === 'price') sku.price = Math.max(0, parseFloat(inp.value) || 0);
        else if (field === 'contents') sku.contents = inp.value;
        else if (field === 'featured') {
          // Only one SKU can be featured at a time
          if (inp.checked) this.state.iaps.skus.forEach((s, i) => { s.featured = (i === idx); });
          else sku.featured = false;
          this.renderSkuTable();
        }
        this.renderShopPreview();
        this.renderIapEstimate();
      });
    });
    table.querySelectorAll('.mon-sku-del').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.sidx, 10);
        if (this.state.iaps.skus.length <= 1) return;
        this.state.iaps.skus.splice(idx, 1);
        this.renderSkuTable();
        this.renderShopPreview();
        this.renderIapEstimate();
      });
    });
    const addBtn = document.getElementById('mon-sku-add');
    if (addBtn) addBtn.disabled = this.state.iaps.skus.length >= 8;
  },

  // ---------- IAP funnel math ----------
  _anchorSku() {
    const { skus, anchorPrice } = this.state.iaps;
    if (!skus.length) return { price: 4.99 };
    if (anchorPrice === 'cheapest')  return skus.reduce((a, b) => a.price < b.price ? a : b);
    if (anchorPrice === 'expensive') return skus.reduce((a, b) => a.price > b.price ? a : b);
    return skus.find(s => s.featured) || skus[0];
  },

  computeFunnel() {
    const { skus, starterEnabled, starterDiscount, offerEnabled, offerCooldown } = this.state.iaps;
    const anchor = this._anchorSku();
    const basePrice = anchor.price || 4.99;
    const priceFactor = Math.max(0.4, Math.min(1.6, 2.5 / basePrice));
    const starterBoost = starterEnabled ? (1 + starterDiscount / 150) : 1;
    const offerMult = offerEnabled ? 1 : 0.82;
    const cadenceBoost = offerEnabled ? 1 + (48 / Math.max(offerCooldown, 6) - 1) * 0.15 : 1;

    const install = 1.0;
    const session3 = 0.38;
    const firstBuy = Math.min(0.08, 0.025 * priceFactor * starterBoost * cadenceBoost * offerMult);
    const repeat = firstBuy * 0.42;
    const whale = firstBuy * 0.035;

    const payerPct = firstBuy * 100;
    const atv = skus.reduce((a, s) => a + s.price, 0) / Math.max(skus.length, 1);
    const purchasesPerPayer = 1 + repeat / Math.max(firstBuy, 0.0001) * 3 + whale / Math.max(firstBuy, 0.0001) * 15;
    const iapArpdau = firstBuy * atv * purchasesPerPayer;

    return {
      steps: [
        { label: 'Install',        val: install },
        { label: 'Session 3',      val: session3 },
        { label: 'First purchase', val: firstBuy },
        { label: 'Repeat buy',     val: repeat },
        { label: 'Whale',          val: whale },
      ],
      firstBuy, repeat, whale,
      payerPct, atv, iapArpdau, purchasesPerPayer,
    };
  },

  // ---------- Previews ----------
  renderShopPreview() {
    const grid = document.getElementById('iap-shop-grid');
    if (!grid) return;
    const tiles = this.state.iaps.skus.slice(0, 4);
    const colors = ['#00a1e1', '#f59e0b', '#10b981', '#8b5cf6'];
    grid.innerHTML = tiles.map((sku, i) => {
      const price = `$${sku.price.toFixed(2)}`;
      const featCls = sku.featured ? ' iap-shop-tile--featured' : '';
      const badge = sku.featured ? '<div class="iap-shop-tile-badge">★</div>' : '';
      return `
        <div class="iap-shop-tile${featCls}" style="--tile-accent:${colors[i % colors.length]}">
          ${badge}
          <div class="iap-shop-tile-contents">${this._escape(sku.contents)}</div>
          <div class="iap-shop-tile-price">${price}</div>
        </div>
      `;
    }).join('');
  },

  renderStarterPreview() {
    const { starterEnabled, starterDiscount, starterTrigger } = this.state.iaps;
    const card = document.querySelector('.iap-card--starter');
    if (card) card.classList.toggle('ads-card--off', !starterEnabled);
    const anchor = this._anchorSku();
    const basePrice = anchor.price || 9.99;
    const fullPrice = Math.max(basePrice, 4.99);
    const discounted = fullPrice * (1 - starterDiscount / 100);
    const origEl = document.getElementById('iap-starter-orig');
    const nowEl = document.getElementById('iap-starter-now');
    if (origEl) origEl.textContent = `$${fullPrice.toFixed(2)}`;
    if (nowEl)  nowEl.textContent  = `$${discounted.toFixed(2)}`;
    const captionEl = document.getElementById('iap-starter-caption');
    if (captionEl) {
      const trigLabel = { first_launch: 'first launch', session3: 'session 3', first_loss: 'first loss', custom: 'custom prompt' }[starterTrigger] || 'session 3';
      captionEl.textContent = starterEnabled
        ? `Triggers after ${trigLabel} · ${starterDiscount}% off`
        : 'Disabled';
    }
  },

  renderOfferPreview() {
    const { offerEnabled, offerCooldown, offerTypes } = this.state.iaps;
    const card = document.querySelector('.iap-card--offer');
    if (card) card.classList.toggle('ads-card--off', !offerEnabled);

    const types = {
      coin_gem: { label: 'Coins + Gems bundle', icon: '🪙💎', header: 'FLASH DEAL',  old: 14.99, bonus: '+120%' },
      booster:  { label: 'Booster pack',        icon: '⚡⚡⚡', header: 'POWER UP',    old: 9.99,  bonus: '+3 boosters' },
      cosmetic: { label: 'Exclusive cosmetic',  icon: '🎨',   header: 'RARE SKIN',   old: 11.99, bonus: 'Exclusive' },
      whale:    { label: 'Whale bundle',        icon: '👑',   header: 'VIP OFFER',   old: 99.99, bonus: '+400%' },
      custom:   { label: 'Custom bundle',       icon: '✨',   header: 'CUSTOM',      old: 4.99,  bonus: 'Defined' },
    };
    const active = Object.keys(offerTypes).filter(k => offerTypes[k]);
    const pick = active.length ? types[active[0]] : types.coin_gem;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('iap-offer-header', pick.header);
    set('iap-offer-icon',   pick.icon);
    set('iap-offer-body',   pick.label);
    set('iap-offer-old',    `$${pick.old.toFixed(2)}`);
    set('iap-offer-bonus',  pick.bonus);
    const captionEl = document.getElementById('iap-offer-caption');
    if (captionEl) {
      captionEl.textContent = offerEnabled
        ? `Every ${offerCooldown}h · ${active.length || 1} bundle type${active.length === 1 ? '' : 's'} in rotation`
        : 'Disabled';
    }
  },

  _escape(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  },

  // ---------- IAP Estimate (chart + stats) ----------
  renderIapEstimate() {
    const funnel = this.computeFunnel();
    const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    setText('mon-iap-payer',  `${funnel.payerPct.toFixed(1)}%`);
    setText('mon-iap-atv',    `$${funnel.atv.toFixed(2)}`);
    setText('mon-iap-arpdau', `$${funnel.iapArpdau.toFixed(3)}`);

    const svg = document.getElementById('iap-estimate-chart');
    if (!svg) return;
    const { metric } = this.state.iaps.estimate;
    const padL = 44, padR = 16, padTop = 12, padBot = 24;
    const { w: VB_W, h: VB_H } = this._svgDims(svg);
    const seriesGroup = svg.querySelector('.iap-est-series');
    const gridGroup = svg.querySelector('.et-chart-grid');
    const xLabelsWrap = svg.parentElement.querySelector('[data-xlabels]');
    const yLabelsWrap = svg.parentElement.querySelector('[data-ylabels]');
    const legend = document.getElementById('iap-estimate-legend');
    if (!seriesGroup || !xLabelsWrap || !yLabelsWrap || !legend) return;
    if (gridGroup) gridGroup.innerHTML = '';

    // Dispatch per-metric renderer.
    let state;
    if (metric === 'funnel') {
      state = this._renderFunnelChart(seriesGroup, xLabelsWrap, yLabelsWrap, legend, funnel, VB_W, VB_H, padL, padR, padTop, padBot);
    } else if (metric === 'revenue_by_sku') {
      state = this._renderRevenueBySku(seriesGroup, gridGroup, xLabelsWrap, yLabelsWrap, legend, funnel, VB_W, VB_H, padL, padR, padTop, padBot);
    } else if (metric === 'arpdau_vs_dau') {
      state = this._renderArpdauVsDau(seriesGroup, gridGroup, xLabelsWrap, yLabelsWrap, legend, funnel, VB_W, VB_H, padL, padR, padTop, padBot);
    } else if (metric === 'conv_d30') {
      state = this._renderRampD30(seriesGroup, gridGroup, xLabelsWrap, yLabelsWrap, legend, funnel, VB_W, VB_H, padL, padR, padTop, padBot, 'conv');
    } else {
      state = this._renderRampD30(seriesGroup, gridGroup, xLabelsWrap, yLabelsWrap, legend, funnel, VB_W, VB_H, padL, padR, padTop, padBot, 'arpu');
    }
    this._iapEst = { metric, VB_W, VB_H, padL, padR, padTop, padBot, ...state };
  },

  _renderFunnelChart(seriesG, xLab, yLab, legend, funnel, VB_W, VB_H, padL, padR, padTop, padBot) {
    const steps = funnel.steps;
    const max = steps[0].val;
    const color = '#00a1e1';

    // Clear the SVG chart and axis labels — funnel uses the HTML overlay instead.
    seriesG.innerHTML = '';
    xLab.innerHTML = '';
    yLab.innerHTML = '';
    const svg = document.getElementById('iap-estimate-chart');
    if (svg) svg.style.visibility = 'hidden';
    yLab.style.visibility = 'hidden';

    // Populate the HTML funnel overlay
    const overlay = document.getElementById('iap-funnel-html');
    if (overlay) {
      overlay.hidden = false;
      overlay.innerHTML = steps.map(s => {
        const pct = (s.val / max) * 100;
        const display = s.val >= 0.1 ? `${(s.val * 100).toFixed(0)}%` : `${(s.val * 100).toFixed(1)}%`;
        return `
          <div class="iap-funnel-row">
            <span class="iap-funnel-label">${s.label}</span>
            <div class="iap-funnel-track"><div class="iap-funnel-bar" style="width:${pct.toFixed(1)}%"></div></div>
            <span class="iap-funnel-val">${display}</span>
          </div>
        `;
      }).join('');
    }

    legend.innerHTML = `<span class="ads-legend-item"><span class="ads-legend-swatch" style="background:${color}"></span>Install → Whale funnel</span>`;
    return { mode: 'funnel', funnel };
  },

  _showSvgChart() {
    const svg = document.getElementById('iap-estimate-chart');
    if (svg) svg.style.visibility = '';
    const overlay = document.getElementById('iap-funnel-html');
    if (overlay) { overlay.hidden = true; overlay.innerHTML = ''; }
    const plot = svg ? svg.parentElement : null;
    const yLab = plot ? plot.querySelector('[data-ylabels]') : null;
    if (yLab) yLab.style.visibility = '';
  },

  _gridlines(gridG, VB_W, VB_H, padL, padR, padTop, padBot) {
    if (!gridG) return;
    let g = '';
    for (let i = 0; i <= 4; i++) {
      const yy = padTop + ((VB_H - padTop - padBot) * i / 4);
      g += `<line x1="${padL}" y1="${yy.toFixed(1)}" x2="${VB_W - padR}" y2="${yy.toFixed(1)}" stroke="rgba(22,27,37,0.08)" stroke-width="1" stroke-dasharray="${i === 4 ? '0' : '3,4'}" vector-effect="non-scaling-stroke"/>`;
    }
    gridG.innerHTML = g;
  },

  _renderRevenueBySku(seriesG, gridG, xLab, yLab, legend, funnel, VB_W, VB_H, padL, padR, padTop, padBot) {
    this._showSvgChart();
    const skus = this.state.iaps.skus;
    const dau = this.state.iaps.estimate.dau;
    const totalPayers = dau * funnel.firstBuy;
    const anchor = this._anchorSku();
    const weights = skus.map(s => {
      const base = s === anchor ? 0.45 : (1 - 0.45) / Math.max(skus.length - 1, 1);
      return { sku: s, share: base };
    });
    const revenues = weights.map(w => ({ sku: w.sku, rev: totalPayers * w.share * w.sku.price * funnel.purchasesPerPayer, featured: w.sku === anchor }));
    const maxV = Math.max(...revenues.map(r => r.rev), 0.0001) * 1.2;

    this._gridlines(gridG, VB_W, VB_H, padL, padR, padTop, padBot);

    const n = revenues.length;
    const usableW = VB_W - padL - padR;
    const groupW = usableW / n;
    const barW = Math.min(36, groupW * 0.32);  // narrower, crisper bars
    const baseColor = '#10b981';
    const featColor = '#f59e0b';
    const plotBot = VB_H - padBot;

    let html = '';
    const hoverRects = [];
    revenues.forEach((r, i) => {
      const cx = padL + groupW * i + groupW / 2;
      const x = cx - barW / 2;
      const h = (r.rev / maxV) * (VB_H - padTop - padBot);
      const y = plotBot - h;
      const color = r.featured ? featColor : baseColor;
      const fill = r.featured ? 'url(#iap-est-grad-feat)' : 'url(#iap-est-grad-sku)';
      // Rounded top only — draw as path so bottom stays square on baseline
      const rx = Math.min(6, barW / 2, h / 2);
      const d = `M ${x} ${plotBot} L ${x} ${y + rx} Q ${x} ${y} ${x + rx} ${y} L ${x + barW - rx} ${y} Q ${x + barW} ${y} ${x + barW} ${y + rx} L ${x + barW} ${plotBot} Z`;
      html += `<path d="${d}" fill="${fill}" stroke="${color}" stroke-width="1.4" vector-effect="non-scaling-stroke"/>`;
      // Value label on top of bar
      const valText = this.formatDollarsShort(r.rev);
      html += `<text x="${cx}" y="${y - 6}" text-anchor="middle" font-size="11" font-weight="700" fill="${color}" font-family="var(--font)">${valText}</text>`;
      hoverRects.push({ x: cx - groupW / 2, y: padTop, w: groupW, h: VB_H - padTop - padBot, idx: i, cx, top: y, rev: r.rev, sku: r.sku });
    });
    // Baseline
    html += `<line x1="${padL}" y1="${plotBot}" x2="${VB_W - padR}" y2="${plotBot}" stroke="rgba(22,27,37,0.2)" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
    seriesG.innerHTML = html;

    xLab.innerHTML = revenues.map((r, i) => {
      const pct = (((padL + groupW * i + groupW / 2) / VB_W) * 100).toFixed(2);
      const style = r.featured
        ? `left:${pct}%; transform:translateX(-50%); color:#f59e0b; font-weight:700`
        : `left:${pct}%; transform:translateX(-50%)`;
      return `<span style="${style}">$${r.sku.price.toFixed(2)}</span>`;
    }).join('');

    const fmt = this.formatDollarsShort.bind(this);
    const parts = [];
    for (let i = 0; i <= 4; i++) {
      const yy = padTop + ((VB_H - padTop - padBot) * i / 4);
      const v = maxV - (maxV * i / 4);
      const pct = ((yy / VB_H) * 100).toFixed(2);
      parts.push(`<span style="top:${pct}%">${fmt(v)}</span>`);
    }
    yLab.innerHTML = parts.join('');
    legend.innerHTML = `<span class="ads-legend-item"><span class="ads-legend-swatch" style="background:${baseColor}"></span>SKU</span>
      <span class="ads-legend-item"><span class="ads-legend-swatch" style="background:${featColor}"></span>Anchor</span>
      <span class="ads-legend-item" style="opacity:0.7">at ${this.formatCount(dau)} DAU</span>`;

    return { mode: 'bars', hoverRects };
  },

  _renderArpdauVsDau(seriesG, gridG, xLab, yLab, legend, funnel, VB_W, VB_H, padL, padR, padTop, padBot) {
    this._showSvgChart();
    const dauPoints = [10000, 25000, 50000, 100000, 215000, 500000];
    const series = dauPoints.map(d => ({ dau: d, rev: d * funnel.iapArpdau }));
    const maxV = Math.max(...series.map(s => s.rev), 0.0001) * 1.2;
    const n = series.length;
    const xAt = (i) => padL + (i / (n - 1)) * (VB_W - padL - padR);
    const yAt = (v) => padTop + (1 - v / maxV) * (VB_H - padTop - padBot);
    const color = '#f59e0b';
    const grad = 'url(#iap-est-grad-dau)';

    this._gridlines(gridG, VB_W, VB_H, padL, padR, padTop, padBot);

    let linePath = `M ${xAt(0).toFixed(1)} ${yAt(series[0].rev).toFixed(1)}`;
    for (let i = 1; i < n; i++) linePath += ` L ${xAt(i).toFixed(1)} ${yAt(series[i].rev).toFixed(1)}`;
    const areaPath = `${linePath} L ${xAt(n-1).toFixed(1)} ${(VB_H - padBot).toFixed(1)} L ${xAt(0).toFixed(1)} ${(VB_H - padBot).toFixed(1)} Z`;

    let html = '';
    html += `<path d="${areaPath}" fill="${grad}" stroke="none"/>`;
    html += `<path d="${linePath}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
    series.forEach((p, i) => {
      html += `<circle cx="${xAt(i).toFixed(1)}" cy="${yAt(p.rev).toFixed(1)}" r="4" fill="#fff" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
    });
    html += `<line x1="${padL}" y1="${VB_H - padBot}" x2="${VB_W - padR}" y2="${VB_H - padBot}" stroke="rgba(22,27,37,0.2)" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
    seriesG.innerHTML = html;

    xLab.innerHTML = series.map((p, i) => {
      const pct = ((xAt(i) / VB_W) * 100).toFixed(2);
      return `<span style="left:${pct}%; transform:translateX(-50%)">${this.formatCount(p.dau)}</span>`;
    }).join('');

    const fmt = this.formatDollarsShort.bind(this);
    const parts = [];
    for (let i = 0; i <= 4; i++) {
      const yy = padTop + ((VB_H - padTop - padBot) * i / 4);
      const v = maxV - (maxV * i / 4);
      const pct = ((yy / VB_H) * 100).toFixed(2);
      parts.push(`<span style="top:${pct}%">${fmt(v)}</span>`);
    }
    yLab.innerHTML = parts.join('');
    legend.innerHTML = `<span class="ads-legend-item"><span class="ads-legend-swatch" style="background:${color}"></span>Daily IAP revenue</span>`;

    const hoverPoints = series.map((p, i) => ({ idx: i, cx: xAt(i), cy: yAt(p.rev), dau: p.dau, rev: p.rev }));
    return { mode: 'line', hoverPoints };
  },

  _renderRampD30(seriesG, gridG, xLab, yLab, legend, funnel, VB_W, VB_H, padL, padR, padTop, padBot, which) {
    this._showSvgChart();
    const DAYS = 30;
    // Saturating ramps: first-purchase conversion saturates earlier (tau=6),
    // cumulative ARPU-per-install saturates later (tau=8).
    const convSteady = funnel.firstBuy * 100;
    const arpuSteady = funnel.atv * funnel.purchasesPerPayer * funnel.firstBuy;

    const isConv = which === 'conv';
    const values = [];
    for (let d = 1; d <= DAYS; d++) {
      values.push(isConv
        ? convSteady * (1 - Math.exp(-d / 6))
        : arpuSteady * (1 - Math.exp(-d / 8)));
    }
    const steady = isConv ? convSteady : arpuSteady;
    const maxV = Math.max(steady * 1.1, 0.0001);
    const n = DAYS;
    const xAt = (i) => padL + (i / (n - 1)) * (VB_W - padL - padR);
    const yAt = (v) => padTop + (1 - v / maxV) * (VB_H - padTop - padBot);

    this._gridlines(gridG, VB_W, VB_H, padL, padR, padTop, padBot);

    const color = isConv ? '#00a1e1' : '#10b981';
    const grad = isConv ? 'url(#iap-est-grad-conv)' : 'url(#iap-est-grad-arpu)';
    const label = isConv ? 'Conversion' : 'ARPU / install';
    const fmtV = isConv
      ? (v) => `${v.toFixed(2)}%`
      : (v) => this.formatDollarsShort(v);

    let linePath = `M ${xAt(0).toFixed(1)} ${yAt(values[0]).toFixed(1)}`;
    for (let i = 1; i < n; i++) linePath += ` L ${xAt(i).toFixed(1)} ${yAt(values[i]).toFixed(1)}`;
    const areaPath = `${linePath} L ${xAt(n-1).toFixed(1)} ${(VB_H - padBot).toFixed(1)} L ${xAt(0).toFixed(1)} ${(VB_H - padBot).toFixed(1)} Z`;

    let html = '';
    html += `<path d="${areaPath}" fill="${grad}" stroke="none"/>`;
    html += `<path d="${linePath}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
    // Steady-state ceiling
    html += `<line x1="${padL}" y1="${yAt(steady).toFixed(1)}" x2="${VB_W - padR}" y2="${yAt(steady).toFixed(1)}" stroke="${color}" stroke-width="1" stroke-dasharray="2,4" opacity="0.55" vector-effect="non-scaling-stroke"/>`;
    // End dot
    html += `<circle cx="${xAt(n-1).toFixed(1)}" cy="${yAt(values[n-1]).toFixed(1)}" r="4" fill="#fff" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
    // Baseline
    html += `<line x1="${padL}" y1="${VB_H - padBot}" x2="${VB_W - padR}" y2="${VB_H - padBot}" stroke="rgba(22,27,37,0.2)" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
    seriesG.innerHTML = html;

    // X axis: D1, D5, D10, D15, D20, D25, D30
    const marks = [0, 4, 9, 14, 19, 24, 29];
    xLab.innerHTML = marks.map(i => {
      const pct = ((xAt(i) / VB_W) * 100).toFixed(2);
      return `<span style="left:${pct}%; transform:translateX(-50%)">D${i + 1}</span>`;
    }).join('');

    // Y axis
    const parts = [];
    for (let i = 0; i <= 4; i++) {
      const yy = padTop + ((VB_H - padTop - padBot) * i / 4);
      const v = maxV - (maxV * i / 4);
      const pct = ((yy / VB_H) * 100).toFixed(2);
      parts.push(`<span style="top:${pct}%">${fmtV(v)}</span>`);
    }
    yLab.innerHTML = parts.join('');

    legend.innerHTML = `<span class="ads-legend-item"><span class="ads-legend-swatch" style="background:${color}"></span>${label}</span>
      <span class="ads-legend-item" style="opacity:0.7">saturates to ${fmtV(steady)}</span>`;

    const hoverPoints = [];
    for (let i = 0; i < n; i++) {
      hoverPoints.push({ idx: i, cx: xAt(i), cy: yAt(values[i]), day: i + 1, val: values[i], label, color, fmtV });
    }
    return { mode: 'ramp', hoverPoints, color, label };
  },

  bindIapEstimateHover() {
    const svg = document.getElementById('iap-estimate-chart');
    const tooltip = document.getElementById('iap-est-tooltip');
    if (!svg || !tooltip) return;

    const onMove = (e) => {
      if (!this._iapEst) return;
      const rect = svg.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      const { VB_W, VB_H, mode } = this._iapEst;
      const vbX = (localX / rect.width) * VB_W;
      const vbY = (localY / rect.height) * VB_H;

      if (mode === 'funnel') {
        // Funnel values are rendered inline in HTML — no tooltip needed.
        this._hideIapTooltip();
      } else if (mode === 'bars') {
        const hit = this._iapEst.hoverRects.find(r => vbX >= r.x && vbX <= r.x + r.w);
        if (hit) this._showIapTooltipBar(hit, rect);
        else this._hideIapTooltip();
      } else if (mode === 'line') {
        const pts = this._iapEst.hoverPoints;
        let best = pts[0], bestDist = Infinity;
        pts.forEach(p => { const d = Math.abs(p.cx - vbX); if (d < bestDist) { bestDist = d; best = p; } });
        this._showIapTooltipLine(best, rect);
      } else if (mode === 'ramp') {
        const pts = this._iapEst.hoverPoints;
        let best = pts[0], bestDist = Infinity;
        pts.forEach(p => { const d = Math.abs(p.cx - vbX); if (d < bestDist) { bestDist = d; best = p; } });
        this._showIapTooltipRamp(best, rect);
      }
    };
    const onLeave = () => this._hideIapTooltip();
    svg.addEventListener('mousemove', onMove);
    svg.addEventListener('mouseleave', onLeave);
  },

  _iapCrosshair(xVB) {
    const svg = document.getElementById('iap-estimate-chart');
    if (!svg) return;
    const crosshair = svg.querySelector('.iap-est-crosshair');
    const { VB_H, padTop, padBot } = this._iapEst;
    if (crosshair) {
      crosshair.setAttribute('x1', xVB);
      crosshair.setAttribute('x2', xVB);
      crosshair.setAttribute('y1', padTop);
      crosshair.setAttribute('y2', VB_H - padBot);
      crosshair.style.display = '';
    }
  },

  _iapPlaceTooltip(tooltip, xVB, svgRect) {
    const svg = document.getElementById('iap-estimate-chart');
    const { VB_W } = this._iapEst;
    const rect = svgRect || svg.getBoundingClientRect();
    const plotLeft = svg.offsetLeft;
    const xPx = plotLeft + (xVB / VB_W) * rect.width;
    const plotEl = svg.parentElement;
    const tooltipWidth = tooltip.offsetWidth || 160;
    const flipLeft = (xVB / VB_W) > 0.6;
    const leftPos = flipLeft ? (xPx - tooltipWidth - 10) : (xPx + 10);
    tooltip.style.left = `${Math.max(8, Math.min(leftPos, plotEl.clientWidth - tooltipWidth - 8))}px`;
    tooltip.style.top = `${svg.offsetTop + 12}px`;
  },

  _showIapTooltipFunnel(hit, svgRect) {
    const tooltip = document.getElementById('iap-est-tooltip');
    const step = this._iapEst.funnel.steps[hit.idx];
    const xVB = hit.x + hit.w; // align to bar end
    this._iapCrosshair(xVB);
    const dotsG = document.querySelector('#iap-estimate-chart .iap-est-dots');
    if (dotsG) dotsG.innerHTML = '';
    const pct = step.val >= 0.1 ? `${(step.val * 100).toFixed(1)}%` : `${(step.val * 100).toFixed(2)}%`;
    tooltip.innerHTML = `<div class="ads-est-tt-head">${step.label}</div>
      <div class="ads-est-tt-row"><span class="ads-est-tt-swatch" style="background:#00a1e1"></span><span class="ads-est-tt-label">Share</span><span class="ads-est-tt-val">${pct}</span></div>`;
    tooltip.style.display = '';
    this._iapPlaceTooltip(tooltip, xVB, svgRect);
  },

  _showIapTooltipBar(hit, svgRect) {
    const tooltip = document.getElementById('iap-est-tooltip');
    this._iapCrosshair(hit.cx);
    const dotsG = document.querySelector('#iap-estimate-chart .iap-est-dots');
    if (dotsG) dotsG.innerHTML = `<circle cx="${hit.cx.toFixed(1)}" cy="${hit.top.toFixed(1)}" r="5" fill="#10b981" stroke="#fff" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
    tooltip.innerHTML = `<div class="ads-est-tt-head">$${hit.sku.price.toFixed(2)} SKU</div>
      <div class="ads-est-tt-row"><span class="ads-est-tt-swatch" style="background:#10b981"></span><span class="ads-est-tt-label">${this._escape(hit.sku.contents)}</span><span class="ads-est-tt-val">${this.formatDollarsShort(hit.rev)}/day</span></div>`;
    tooltip.style.display = '';
    this._iapPlaceTooltip(tooltip, hit.cx, svgRect);
  },

  _showIapTooltipLine(pt, svgRect) {
    const tooltip = document.getElementById('iap-est-tooltip');
    this._iapCrosshair(pt.cx);
    const dotsG = document.querySelector('#iap-estimate-chart .iap-est-dots');
    if (dotsG) dotsG.innerHTML = `<circle cx="${pt.cx.toFixed(1)}" cy="${pt.cy.toFixed(1)}" r="5" fill="#f59e0b" stroke="#fff" stroke-width="2.2" vector-effect="non-scaling-stroke"/>`;
    tooltip.innerHTML = `<div class="ads-est-tt-head">${this.formatCount(pt.dau)} DAU</div>
      <div class="ads-est-tt-row"><span class="ads-est-tt-swatch" style="background:#f59e0b"></span><span class="ads-est-tt-label">IAP revenue</span><span class="ads-est-tt-val">${this.formatDollarsShort(pt.rev)}/day</span></div>`;
    tooltip.style.display = '';
    this._iapPlaceTooltip(tooltip, pt.cx, svgRect);
  },

  _showIapTooltipRamp(pt, svgRect) {
    const tooltip = document.getElementById('iap-est-tooltip');
    this._iapCrosshair(pt.cx);
    const dotsG = document.querySelector('#iap-estimate-chart .iap-est-dots');
    if (dotsG) {
      dotsG.innerHTML = `<circle cx="${pt.cx.toFixed(1)}" cy="${pt.cy.toFixed(1)}" r="5" fill="${pt.color}" stroke="#fff" stroke-width="2.2" vector-effect="non-scaling-stroke"/>`;
    }
    tooltip.innerHTML = `<div class="ads-est-tt-head">Day ${pt.day}</div>
      <div class="ads-est-tt-row"><span class="ads-est-tt-swatch" style="background:${pt.color}"></span><span class="ads-est-tt-label">${pt.label}</span><span class="ads-est-tt-val">${pt.fmtV(pt.val)}</span></div>`;
    tooltip.style.display = '';
    this._iapPlaceTooltip(tooltip, pt.cx, svgRect);
  },

  _hideIapTooltip() {
    const svg = document.getElementById('iap-estimate-chart');
    const tooltip = document.getElementById('iap-est-tooltip');
    if (svg) {
      const crosshair = svg.querySelector('.iap-est-crosshair');
      const dotsG = svg.querySelector('.iap-est-dots');
      if (crosshair) crosshair.style.display = 'none';
      if (dotsG) dotsG.innerHTML = '';
    }
    if (tooltip) tooltip.style.display = 'none';
  },

  bindGenerate() {
    const btn = document.getElementById('mon-generate-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      this.renderEstimate();
      this.renderIapEstimate();
      document.querySelectorAll('.mon-panel').forEach(p => {
        p.classList.remove('mon-pulse');
        // restart animation
        void p.offsetWidth;
        p.classList.add('mon-pulse');
      });
    });
  },
};

// ── Horizon: templated event tiles (click to toggle, custom expands w/ typed prompt) ──
document.querySelectorAll('.horizon-event-tile').forEach(tile => {
  tile.addEventListener('click', () => {
    const wasOn = tile.classList.contains('horizon-event-tile--on');
    document.querySelectorAll('.horizon-event-tile--on').forEach(t =>
      t.classList.remove('horizon-event-tile--on')
    );
    if (!wasOn) {
      tile.classList.add('horizon-event-tile--on');
      if (tile.classList.contains('horizon-event-tile--custom')) {
        typeCustomPrompt(tile);
      }
    }
  });
});

function typeCustomPrompt(tile) {
  const input = tile.querySelector('.horizon-custom-input');
  if (!input) return;
  const text = input.dataset.prompt || '';
  input.textContent = '';
  let i = 0;
  const tick = () => {
    if (!tile.classList.contains('horizon-event-tile--on')) return;
    input.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(tick, 28);
  };
  tick();
}

// ── IAP custom-option chat inputs (Shop / Starter / Limited-time offer) ──
function typeIapPrompt(input) {
  if (!input) return;
  const text = input.dataset.prompt || '';
  input.textContent = '';
  input.classList.add('is-typing');
  const token = (input.dataset.token = String(Date.now()));
  let i = 0;
  const tick = () => {
    if (input.dataset.token !== token || !input.classList.contains('is-open')) return;
    input.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(tick, 28);
    else input.classList.remove('is-typing');
  };
  tick();
}
function openIapPrompt(input) {
  if (!input) return;
  input.classList.add('is-open');
  typeIapPrompt(input);
}
function closeIapPrompt(input) {
  if (!input) return;
  input.classList.remove('is-open', 'is-typing');
  input.dataset.token = '';
}

// Shop — custom SKU describe button
const skuCustomBtn = document.getElementById('mon-sku-add-custom');
const skuCustomInput = document.getElementById('mon-sku-custom-input');
if (skuCustomBtn && skuCustomInput) {
  skuCustomBtn.addEventListener('click', () => {
    const open = skuCustomInput.classList.toggle('is-open');
    skuCustomBtn.classList.toggle('is-active', open);
    if (open) typeIapPrompt(skuCustomInput);
    else closeIapPrompt(skuCustomInput);
  });
}

// Starter pack — custom trigger radio
const starterCustomInput = document.getElementById('iap-starter-custom-input');
document.querySelectorAll('input[name="starterTrigger"]').forEach(r => {
  r.addEventListener('change', () => {
    if (!starterCustomInput) return;
    if (r.checked && r.value === 'custom') openIapPrompt(starterCustomInput);
    else if (r.checked) closeIapPrompt(starterCustomInput);
  });
});

// Limited-time offer — custom rotation checkbox
const offerCustomCb = document.querySelector('[data-group="offerTypes"] input[data-o="custom"]');
const offerCustomInput = document.getElementById('iap-offer-custom-input');
if (offerCustomCb && offerCustomInput) {
  offerCustomCb.addEventListener('change', () => {
    if (offerCustomCb.checked) openIapPrompt(offerCustomInput);
    else closeIapPrompt(offerCustomInput);
  });
}

// Banner — custom position radio
const bannerCustomInput = document.getElementById('ads-banner-custom-input');
document.querySelectorAll('input[name="bannerPos"]').forEach(r => {
  r.addEventListener('change', () => {
    if (!bannerCustomInput) return;
    if (r.checked && r.value === 'custom') openIapPrompt(bannerCustomInput);
    else if (r.checked) closeIapPrompt(bannerCustomInput);
  });
});

// Interstitial — custom placement checkbox
const interCustomCb = document.querySelector('[data-group="interPlacements"] input[data-p="custom"]');
const interCustomInput = document.getElementById('ads-inter-custom-input');
if (interCustomCb && interCustomInput) {
  interCustomCb.addEventListener('change', () => {
    if (interCustomCb.checked) openIapPrompt(interCustomInput);
    else closeIapPrompt(interCustomInput);
  });
}

// Rewarded video — custom placement checkbox
const rvCustomCb = document.querySelector('[data-group="rvPlacements"] input[data-p="custom"]');
const rvCustomInput = document.getElementById('ads-rv-custom-input');
if (rvCustomCb && rvCustomInput) {
  rvCustomCb.addEventListener('change', () => {
    if (rvCustomCb.checked) openIapPrompt(rvCustomInput);
    else closeIapPrompt(rvCustomInput);
  });
}

// Step 3 economy + Step 5 horizon — custom describe rows (toggle + type prompt)
document.querySelectorAll('.econ-custom-add').forEach(btn => {
  const input = document.getElementById(btn.dataset.target);
  if (!input) return;
  const horizonCard = btn.closest('.horizon-card');
  btn.addEventListener('click', () => {
    const open = input.classList.toggle('is-open');
    btn.classList.toggle('is-active', open);
    if (horizonCard) horizonCard.classList.toggle('has-custom', open);
    if (open) typeIapPrompt(input);
    else closeIapPrompt(input);
  });
});
