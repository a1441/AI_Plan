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
    card.classList.toggle('expanded', open);
    btn.textContent = open ? labelClose : labelOpen;
  });
}

initCardBtn('methodology-btn',  'methodology-expand', 'Methodology', 'Hide');
initCardBtn('add-prompt-btn',  'prompt-expand',      'Add prompt',  'Hide prompt');

initCardBtn('web-methodology-btn', 'web-methodology-expand', 'Methodology', 'Hide');

initCardBtn('refine-prompt-btn', 'refine-prompt-expand', 'Add prompt', 'Hide prompt');

initCardBtn('engine-methodology-btn', 'engine-methodology-expand', 'Methodology', 'Hide');
initCardBtn('engine-prompt-btn',      'engine-prompt-expand',      'Add prompt',  'Hide prompt');

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

  // D2: auto-reveal the refined phone on initial load — surface the wow moment
  const autoReveal = () => refineProtoBtn.click();
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', autoReveal);
  } else {
    autoReveal();
  }
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
    this.board = this.emptyBoard();
    this.pieces = this.dealPieces();
    this.selected = null;
    this.score = 0;
    this.buildDOM();
    this.render();
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
