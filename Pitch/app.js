// ============================================================
// AI GAME ENGINE — PITCH PAGE
// ============================================================

// ── Default game for progressive build section ───────────────
let selectedGame = 'metro';

// ── Build Step Labels ─────────────────────────────────────────
const BUILD_LABELS = [
  'Raw core mechanic',
  'UI Shell applied',
  'Economy balanced',
  'Difficulty tuned',
  'Monetization placed',
  'LiveOps event active',
  'Ship-ready game',
];

let currentBuildStep = -1;

// ── Scroll Stage Tracker ──────────────────────────────────────
const STAGE_MAP = [
  { id: 'intro',        stage: 0 },
  { id: 'process',      stage: 0 },
  { id: 'tetris-demo',  stage: 1 },
  { id: 'build',        stage: 2 },
  { id: 'pipeline',     stage: 3 },
];

const stageObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const found = STAGE_MAP.find(s => s.id === entry.target.id);
    if (found != null) document.body.dataset.scrollStage = found.stage;
  });
}, { threshold: 0.25 });

STAGE_MAP.forEach(({ id }) => {
  const el = document.getElementById(id);
  if (el) stageObserver.observe(el);
});

// ── Process Step Reveal ───────────────────────────────────────
const processObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.process-step').forEach(s => s.classList.add('visible'));
  });
}, { threshold: 0.3 });

const processSection = document.getElementById('process');
if (processSection) processObserver.observe(processSection);

// ── Scroll Reveal ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================================================
// TETRIS DEMO
// ============================================================

class TetrisDemo {
  constructor(el) {
    this.COLS = 10;
    this.ROWS = 18;
    this.el = el;
    this.board = this.emptyBoard();
    this.score = 0;
    this.piece = null;
    this.px = 0;
    this.py = 0;
    this.paused = false;
    this.running = true;

    this.buildDOM();
    this.prefill();
    this.render();
    this.spawn();
    this.scheduleLoop();
  }

  emptyBoard() {
    return Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(null));
  }

  buildDOM() {
    this.el.innerHTML = `
      <div class="tet-score" id="tet-score">0</div>
      <div class="tet-grid" id="tet-grid"></div>`;
    const grid = this.el.querySelector('#tet-grid');
    this.cells = [];
    for (let r = 0; r < this.ROWS; r++) {
      const row = [];
      for (let c = 0; c < this.COLS; c++) {
        const cell = document.createElement('div');
        cell.className = 'tet-cell';
        grid.appendChild(cell);
        row.push(cell);
      }
      this.cells.push(row);
    }
  }

  // Start with partial rows and 2 complete rows at the bottom
  prefill() {
    const colors = ['#06b6d4','#f59e0b','#a78bfa','#3b82f6','#f97316','#10b981','#ef4444'];
    const rng = () => colors[Math.floor(Math.random() * colors.length)];
    for (let r = this.ROWS - 8; r < this.ROWS; r++) {
      const isComplete = r >= this.ROWS - 2;
      const gap = isComplete ? -1 : Math.floor(Math.random() * this.COLS);
      for (let c = 0; c < this.COLS; c++) {
        if (c !== gap) this.board[r][c] = rng();
      }
    }
  }

  // Tetromino definitions [shape[][], color]
  get PIECES() {
    return [
      { s: [[1,1,1,1]],              c: '#06b6d4' }, // I
      { s: [[1,1],[1,1]],            c: '#f59e0b' }, // O
      { s: [[0,1,0],[1,1,1]],        c: '#a78bfa' }, // T
      { s: [[1,0],[1,0],[1,1]],      c: '#f97316' }, // L
      { s: [[0,1],[0,1],[1,1]],      c: '#3b82f6' }, // J
      { s: [[0,1,1],[1,1,0]],        c: '#10b981' }, // S
      { s: [[1,1,0],[0,1,1]],        c: '#ef4444' }, // Z
    ];
  }

  spawn() {
    const p = this.PIECES[Math.floor(Math.random() * this.PIECES.length)];
    this.piece = p;
    this.px = Math.floor((this.COLS - p.s[0].length) / 2);
    this.py = 0;

    // Board too full — reset to keep the demo looping
    if (this.collides(p.s, this.px, this.py)) {
      this.board = this.emptyBoard();
      this.prefill();
      this.score = 0;
      this.render();
    }
  }

  collides(shape, px, py) {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (!shape[r][c]) continue;
        const nr = py + r, nc = px + c;
        if (nr < 0 || nr >= this.ROWS || nc < 0 || nc >= this.COLS) return true;
        if (this.board[nr][nc]) return true;
      }
    }
    return false;
  }

  lock() {
    const { s, c } = this.piece;
    for (let r = 0; r < s.length; r++) {
      for (let col = 0; col < s[r].length; col++) {
        if (s[r][col]) this.board[this.py + r][this.px + col] = c;
      }
    }
  }

  clearLines() {
    const full = [];
    for (let r = 0; r < this.ROWS; r++) {
      if (this.board[r].every(c => c !== null)) full.push(r);
    }
    if (full.length === 0) return false;

    // Flash the completed rows
    full.forEach(r => {
      for (let c = 0; c < this.COLS; c++) {
        this.cells[r][c].classList.add('tet-flash');
      }
    });

    this.paused = true;
    setTimeout(() => {
      // Remove completed rows, add empty rows at top
      full.reverse().forEach(r => this.board.splice(r, 1));
      for (let i = 0; i < full.length; i++) {
        this.board.unshift(Array(this.COLS).fill(null));
      }
      this.score += full.length * 100;
      this.paused = false;
      this.render();
    }, 280);

    return true;
  }

  render() {
    // Board
    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        const cell = this.cells[r][c];
        const color = this.board[r][c];
        cell.className = 'tet-cell';
        if (color) {
          cell.style.background = color;
          cell.style.boxShadow = `0 0 3px ${color}88`;
        } else {
          cell.style.background = '';
          cell.style.boxShadow = '';
        }
      }
    }
    // Active piece
    if (this.piece) {
      const { s, c } = this.piece;
      for (let r = 0; r < s.length; r++) {
        for (let col = 0; col < s[r].length; col++) {
          if (!s[r][col]) continue;
          const gr = this.py + r, gc = this.px + col;
          if (gr >= 0 && gr < this.ROWS && gc >= 0 && gc < this.COLS) {
            const cell = this.cells[gr][gc];
            cell.style.background = c;
            cell.style.boxShadow = `0 0 5px ${c}`;
          }
        }
      }
    }
    // Score
    const scoreEl = this.el.querySelector('#tet-score');
    if (scoreEl) scoreEl.textContent = this.score.toLocaleString();
  }

  scheduleLoop() {
    if (!this.running) return;
    setTimeout(() => {
      this.tick();
      this.scheduleLoop();
    }, 420);
  }

  tick() {
    if (this.paused || !this.piece) return;
    if (!this.collides(this.piece.s, this.px, this.py + 1)) {
      this.py++;
      this.render();
    } else {
      this.lock();
      this.piece = null;
      const cleared = this.clearLines();
      if (!cleared) this.render();
      setTimeout(() => {
        this.spawn();
        this.render();
      }, cleared ? 340 : 80);
    }
  }
}

// Init Tetris when section is visible
const tetrisObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const gameEl = document.getElementById('tetris-game');
    if (gameEl && !gameEl.dataset.init) {
      gameEl.dataset.init = '1';
      new TetrisDemo(gameEl);
    }
  });
}, { threshold: 0.2 });

const tetrisSection = document.getElementById('tetris-demo');
if (tetrisSection) tetrisObserver.observe(tetrisSection);

// ============================================================
// GAME SCREEN RENDERER (used by progressive build section)
// ============================================================

function renderRawGameScreen(screenEl, gameId) {
  screenEl.innerHTML = '';
  screenEl.className = 'iphone-screen';

  if (gameId === 'metro') {
    screenEl.innerHTML = `
      <div class="metro-raw" id="active-game-div">
        <div class="metro-track"></div>
        <div class="metro-player" style="left: calc(33% - 13px)"></div>
        <div class="metro-obstacle" style="width:28px;height:48px;bottom:36%;animation-duration:2.3s;animation-delay:0s"></div>
        <div class="metro-obstacle" style="width:24px;height:34px;bottom:29%;animation-duration:1.9s;animation-delay:1.0s"></div>
        <div class="metro-obstacle" style="width:32px;height:26px;bottom:25%;animation-duration:2.7s;animation-delay:1.5s"></div>
      </div>`;
  } else if (gameId === 'poker') {
    screenEl.innerHTML = `
      <div class="poker-raw" id="active-game-div">
        <div class="poker-river">
          <div class="poker-card">A♠</div>
          <div class="poker-card red">K♥</div>
          <div class="poker-card red">Q♦</div>
          <div class="poker-card">J♣</div>
          <div class="poker-card red">10♥</div>
        </div>
        <div class="poker-piles">
          <div class="poker-pile"><div class="poker-card" style="top:3px;left:3px">A♠</div></div>
          <div class="poker-pile"></div>
          <div class="poker-pile"></div>
          <div class="poker-pile"></div>
        </div>
      </div>`;
  } else if (gameId === 'vowel') {
    const letters = ['B','A','T','R','E','S','T','I','N','G','P','O','W','E','R','F','U','L','L','Y'];
    const vowels = new Set(['A','E','I','O','U']);
    screenEl.innerHTML = `
      <div class="vowel-raw" id="active-game-div">
        <div class="vowel-grid">
          ${letters.map(l => `<div class="vowel-tile"${vowels.has(l) ? ` data-vowel="${l}"` : ''}>${l}</div>`).join('')}
        </div>
      </div>`;
  }
}

function applyMetroOverlays(gameDiv, step) {
  if (step >= 1) gameDiv.insertAdjacentHTML('beforeend', `<div class="metro-ui-bar"><span>⬡ 1,240</span><span>⚙</span></div>`);
  if (step >= 2) gameDiv.insertAdjacentHTML('beforeend', `<div class="metro-score">4,820</div>`);
  if (step >= 3) gameDiv.insertAdjacentHTML('beforeend', `<div class="metro-level">LEVEL 4</div>`);
  if (step >= 4) gameDiv.insertAdjacentHTML('beforeend', `<div class="metro-shop-btn">SHOP</div>`);
  if (step >= 5) gameDiv.insertAdjacentHTML('beforeend', `<div class="metro-event-banner"><span>🌙 Night Metro Event</span><span>2d 14h</span></div>`);
}

function applyPokerOverlays(gameDiv, step) {
  if (step >= 1) gameDiv.insertAdjacentHTML('beforeend', `<div class="poker-ui-bar"><span>♠ Poker Sort</span><span>⚙</span></div>`);
  if (step >= 2) gameDiv.insertAdjacentHTML('beforeend', `<div class="poker-combo">COMBO ×2</div>`);
  if (step >= 3) gameDiv.insertAdjacentHTML('beforeend', `<div class="poker-timer-bar"><div class="poker-timer-fill" style="width:72%"></div></div>`);
  if (step >= 4) gameDiv.insertAdjacentHTML('beforeend', `<div class="poker-plus-time">+5s</div>`);
  if (step >= 5) gameDiv.insertAdjacentHTML('beforeend', `<div class="poker-event-banner"><span>🃏 Daily Challenge</span><span>3h left</span></div>`);
}

function applyVowelOverlays(gameDiv, step) {
  if (step >= 1) gameDiv.insertAdjacentHTML('beforeend', `<div class="vowel-ui-bar"><span>🔥 Streak 4</span><span>⚙</span></div>`);
  if (step >= 2) gameDiv.insertAdjacentHTML('beforeend', `<div class="vowel-coins">+25 ⬡</div>`);
  if (step >= 3) gameDiv.insertAdjacentHTML('beforeend', `<div class="vowel-level">LEVEL 7</div>`);
  if (step >= 4) gameDiv.insertAdjacentHTML('beforeend', `<div class="vowel-hint-btn">HINT</div>`);
  if (step >= 5) gameDiv.insertAdjacentHTML('beforeend', `<div class="vowel-event-banner"><span>📖 Event Words</span><span>1d 6h</span></div>`);
}

function renderPolishedGameScreen(screenEl, gameId, step) {
  renderRawGameScreen(screenEl, gameId);
  const gameDiv = screenEl.firstElementChild;
  if (!gameDiv) return;
  const prefix = gameId === 'metro' ? 'metro' : gameId === 'poker' ? 'poker' : 'vowel';
  for (let i = 1; i <= step; i++) gameDiv.classList.add(`${prefix}-step-${i}`);
  if (gameId === 'metro')      applyMetroOverlays(gameDiv, step);
  else if (gameId === 'poker') applyPokerOverlays(gameDiv, step);
  else if (gameId === 'vowel') applyVowelOverlays(gameDiv, step);
}

// ── Progressive Build Stepper ─────────────────────────────────
function applyBuildStep(step) {
  currentBuildStep = step;

  document.querySelectorAll('.build-step-card').forEach(card => {
    card.classList.toggle('active', parseInt(card.dataset.step, 10) === step);
  });

  const labelEl = document.getElementById('build-step-label');
  if (labelEl) labelEl.textContent = BUILD_LABELS[step] ?? '';

  const phone = document.getElementById('build-phone');
  if (phone) phone.dataset.step = step;

  const screenEl = document.getElementById('build-screen');
  if (!screenEl) return;
  renderPolishedGameScreen(screenEl, selectedGame, step);
}

const buildStepObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const step = parseInt(entry.target.dataset.step, 10);
    if (step === currentBuildStep) return;
    applyBuildStep(step);
  });
}, { threshold: 0.55 });

document.querySelectorAll('.build-step-card').forEach(card => buildStepObserver.observe(card));

// Seed build screen when section enters view
const buildSectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    if (currentBuildStep >= 0) return;
    const screenEl = document.getElementById('build-screen');
    if (!screenEl) return;
    renderRawGameScreen(screenEl, selectedGame);
    currentBuildStep = 0;
    applyBuildStep(0);
  });
}, { threshold: 0.1 });

const buildSection = document.getElementById('build');
if (buildSection) buildSectionObserver.observe(buildSection);
