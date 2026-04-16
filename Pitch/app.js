// ============================================================
// AI GAME ENGINE — PITCH PAGE
// ============================================================

// ── Game Data ────────────────────────────────────────────────
const GAMES = {
  metro: {
    id: 'metro',
    prompt: 'An endless runner set in a neon-lit underground metro. Player swipes left/right to switch between 3 lanes, ducks under low-ceiling trains, and jumps gaps between platforms. Speed increases every 30 seconds. Miss three obstacles and the run ends.',
  },
  poker: {
    id: 'poker',
    prompt: 'Cards flow from a central river into 4 sorting piles. Player must build the highest-ranked poker hand in each pile before the river overflows. Tap a card to lock its pile target. Combos of matching suits clear a full pile instantly.',
  },
  vowel: {
    id: 'vowel',
    prompt: 'A grid of letter tiles where vowels pulse with distinct colors. Player taps tile sequences to spell words — vowels must match the color pattern shown on the target. Clearing a board before the timer unlocks the next phonetic puzzle set.',
  },
};

let selectedGame = null;

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
// Advances body[data-scroll-stage] as user scrolls deeper sections
const STAGE_MAP = [
  { id: 'intro',         stage: 0 },
  { id: 'process',       stage: 0 },
  { id: 'game-selector', stage: 1 },
  { id: 'build',         stage: 2 },
  { id: 'pipeline',      stage: 3 },
];

const stageObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const found = STAGE_MAP.find(s => s.id === entry.target.id);
    if (found != null) {
      document.body.dataset.scrollStage = found.stage;
    }
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

// ── Game Screen Renderer — Raw ────────────────────────────────
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

// ── Apply Polish Step Overlays ────────────────────────────────
function applyMetroOverlays(gameDiv, step) {
  if (step >= 1) {
    gameDiv.insertAdjacentHTML('beforeend', `
      <div class="metro-ui-bar">
        <span>⬡ 1,240</span>
        <span>⚙</span>
      </div>`);
  }
  if (step >= 2) {
    gameDiv.insertAdjacentHTML('beforeend', `<div class="metro-score">4,820</div>`);
  }
  if (step >= 3) {
    gameDiv.insertAdjacentHTML('beforeend', `<div class="metro-level">LEVEL 4</div>`);
  }
  if (step >= 4) {
    gameDiv.insertAdjacentHTML('beforeend', `<div class="metro-shop-btn">SHOP</div>`);
  }
  if (step >= 5) {
    gameDiv.insertAdjacentHTML('beforeend', `
      <div class="metro-event-banner">
        <span>🌙 Night Metro Event</span><span>2d 14h</span>
      </div>`);
  }
}

function applyPokerOverlays(gameDiv, step) {
  if (step >= 1) {
    gameDiv.insertAdjacentHTML('beforeend', `
      <div class="poker-ui-bar">
        <span>♠ Poker Sort</span><span>⚙</span>
      </div>`);
  }
  if (step >= 2) {
    gameDiv.insertAdjacentHTML('beforeend', `<div class="poker-combo">COMBO ×2</div>`);
  }
  if (step >= 3) {
    gameDiv.insertAdjacentHTML('beforeend', `
      <div class="poker-timer-bar">
        <div class="poker-timer-fill" style="width:72%"></div>
      </div>`);
  }
  if (step >= 4) {
    gameDiv.insertAdjacentHTML('beforeend', `<div class="poker-plus-time">+5s</div>`);
  }
  if (step >= 5) {
    gameDiv.insertAdjacentHTML('beforeend', `
      <div class="poker-event-banner">
        <span>🃏 Daily Challenge</span><span>3h left</span>
      </div>`);
  }
}

function applyVowelOverlays(gameDiv, step) {
  if (step >= 1) {
    gameDiv.insertAdjacentHTML('beforeend', `
      <div class="vowel-ui-bar">
        <span>🔥 Streak 4</span><span>⚙</span>
      </div>`);
  }
  if (step >= 2) {
    gameDiv.insertAdjacentHTML('beforeend', `<div class="vowel-coins">+25 ⬡</div>`);
  }
  if (step >= 3) {
    gameDiv.insertAdjacentHTML('beforeend', `<div class="vowel-level">LEVEL 7</div>`);
  }
  if (step >= 4) {
    gameDiv.insertAdjacentHTML('beforeend', `<div class="vowel-hint-btn">HINT</div>`);
  }
  if (step >= 5) {
    gameDiv.insertAdjacentHTML('beforeend', `
      <div class="vowel-event-banner">
        <span>📖 Event Words</span><span>1d 6h</span>
      </div>`);
  }
}

function renderPolishedGameScreen(screenEl, gameId, step) {
  renderRawGameScreen(screenEl, gameId);

  const gameDiv = screenEl.firstElementChild;
  if (!gameDiv) return;

  const prefix = gameId === 'metro' ? 'metro' : gameId === 'poker' ? 'poker' : 'vowel';

  // Accumulate step classes so polish layers stack
  for (let i = 1; i <= step; i++) {
    gameDiv.classList.add(`${prefix}-step-${i}`);
  }

  if (gameId === 'metro')      applyMetroOverlays(gameDiv, step);
  else if (gameId === 'poker') applyPokerOverlays(gameDiv, step);
  else if (gameId === 'vowel') applyVowelOverlays(gameDiv, step);
}

// ── Game Selector ─────────────────────────────────────────────
function selectGame(gameId) {
  const game = GAMES[gameId];
  if (!game) return;

  selectedGame = gameId;

  // Sync cards
  document.querySelectorAll('.prompt-card').forEach(card => {
    card.classList.toggle('active', card.dataset.game === gameId);
  });

  // Sync dots
  document.querySelectorAll('.selector-dot').forEach(dot => {
    dot.classList.toggle('active', dot.dataset.game === gameId);
  });

  // Populate reveal panel
  document.getElementById('reveal-prompt-text').textContent = game.prompt;
  renderRawGameScreen(document.getElementById('reveal-screen'), gameId);

  // Show reveal panel with animation
  const reveal = document.getElementById('game-reveal');
  reveal.classList.remove('visible');
  requestAnimationFrame(() => reveal.classList.add('visible'));
  reveal.removeAttribute('aria-hidden');

  // If build screen is visible, refresh it at current step
  const buildScreen = document.getElementById('build-screen');
  if (buildScreen && currentBuildStep >= 0) {
    renderPolishedGameScreen(buildScreen, gameId, currentBuildStep);
  } else if (buildScreen) {
    renderRawGameScreen(buildScreen, gameId);
  }
}

document.querySelectorAll('.prompt-card').forEach(card => {
  card.addEventListener('click', () => selectGame(card.dataset.game));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectGame(card.dataset.game);
    }
  });
});

document.querySelectorAll('.selector-dot').forEach(dot => {
  dot.addEventListener('click', () => selectGame(dot.dataset.game));
});

// ── Progressive Build Stepper ─────────────────────────────────
function applyBuildStep(step) {
  currentBuildStep = step;

  // Sync active card
  document.querySelectorAll('.build-step-card').forEach(card => {
    card.classList.toggle('active', parseInt(card.dataset.step, 10) === step);
  });

  // Update label — only once a game is selected
  const labelEl = document.getElementById('build-step-label');
  if (labelEl) labelEl.textContent = selectedGame ? (BUILD_LABELS[step] ?? '') : 'Raw core mechanic';

  // Update phone glow
  const phone = document.getElementById('build-phone');
  if (phone) phone.dataset.step = step;

  // Render game at current polish step
  const screenEl = document.getElementById('build-screen');
  if (!screenEl) return;

  if (selectedGame) {
    renderPolishedGameScreen(screenEl, selectedGame, step);
  } else {
    // No game selected yet — show placeholder
    screenEl.innerHTML = '<div class="build-screen-placeholder"><span>← Select a game above</span></div>';
  }
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

// Seed the build screen when build section enters view
const buildSectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    if (currentBuildStep >= 0) return; // already seeded
    const screenEl = document.getElementById('build-screen');
    if (!screenEl) return;
    if (selectedGame) {
      renderRawGameScreen(screenEl, selectedGame);
      currentBuildStep = 0;
      applyBuildStep(0);
    }
  });
}, { threshold: 0.1 });

const buildSection = document.getElementById('build');
if (buildSection) buildSectionObserver.observe(buildSection);
