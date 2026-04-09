// ========================================
// COMPONENT DATA
// ========================================

const componentData = {
  ui: {
    title: 'UI Shell',
    layer: 'Layer 1 \u2014 Foundation',
    layerClass: 'layer-1-bg',
    desc: 'The standardized UI frame wrapping every game. Screens, navigation, theming, currency bar, shop \u2014 structurally identical across all games, themed per title.',
    does: [
      'Generates all screens: splash, main menu, shop, settings, leaderboard',
      'Builds the navigation graph (which screens connect to which)',
      'Creates the FTUE onboarding flow with progressive disclosure',
      'Applies theme: color palette, typography, animations',
      'Defines slot positions where other verticals plug in'
    ],
    output: 'ShellConfig \u2014 8 screens, nav graph,\ncurrency bar (coins + gems),\n3 ad slot positions,\nneon cyberpunk theme'
  },
  mechanics: {
    title: 'Core Mechanics',
    layer: 'Layer 1 \u2014 Foundation',
    layerClass: 'layer-1-bg',
    desc: 'The gameplay itself. A runner, puzzle, RPG, or any genre \u2014 each implements the same interface but delivers a different experience inside the shell.',
    does: [
      'Generates the core gameplay loop (run, match, fight, choose)',
      'Defines scoring formula and reward events',
      'Lists adjustable parameters (speed, difficulty, coin density)',
      'Specifies the input model (tap, swipe, drag)',
      'Implements the IMechanic slot interface'
    ],
    output: 'MechanicConfig \u2014 endless_runner,\nswipe input, distance scoring,\n4 tunable params: speed,\nobstacleRate, coinDensity, powerupChance'
  },
  assets: {
    title: 'Assets',
    layer: 'Layer 1 \u2014 Foundation',
    layerClass: 'layer-1-bg',
    desc: 'Art, audio, and animation sourced via AI generation, marketplace purchase, or artist commission. Builds a reusable collateral library across games.',
    does: [
      'Sources assets through 3 channels: AI-generated, purchased, commissioned',
      'Ensures style consistency across all assets per game',
      'Manages asset library for reuse across titles',
      'Validates performance budgets (file size, memory)',
      'Provides fallbacks for every critical asset'
    ],
    output: 'AssetManifest \u2014 6 characters,\n3 environments, 15 obstacles,\n8 powerups, UI icons,\n3 music tracks (120 BPM)'
  },
  economy: {
    title: 'Economy',
    layer: 'Layer 2 \u2014 Balance',
    layerClass: 'layer-2-bg',
    desc: 'Currencies, rewards, time-gates, and sinks. Controls how fast players earn, what things cost, and how long progression takes \u2014 the engine of engagement and revenue.',
    does: [
      'Defines currency types (basic coins, premium gems)',
      'Sets earn rates per activity and difficulty tier',
      'Configures time-gates (energy, cooldowns)',
      'Balances faucets (income) vs sinks (spending)',
      'Segments economy per player type (whale, casual, new)'
    ],
    output: 'EconomyTable \u2014 50 coins/easy run,\n500 coins/hard run, skins 500-5000,\nenergy: 5 lives, regen 20min,\npremium: 100 gems = $0.99'
  },
  difficulty: {
    title: 'Difficulty',
    layer: 'Layer 2 \u2014 Balance',
    layerClass: 'layer-2-bg',
    desc: 'Level generation and difficulty curves. Controls how hard the game gets over time \u2014 with rest points, spikes, and reward tier mapping.',
    does: [
      'Generates per-level difficulty parameters',
      'Creates difficulty curves (gradual, sawtooth, plateau)',
      'Maps difficulty scores to reward tiers',
      'Ensures tutorial levels are easy (difficulty 1-3)',
      'Inserts "rest points" after difficulty spikes'
    ],
    output: 'DifficultyProfile \u2014 speed 5\u219212 m/s,\nobstacles 1/50m \u2192 1/15m,\nreward tiers: easy/med/hard/extreme,\ncurve shape: gradual with 3 rest points'
  },
  monetization: {
    title: 'Monetization',
    layer: 'Layer 3 \u2014 Revenue',
    layerClass: 'layer-3-bg',
    desc: 'IAP, ads, and contextual offers placed ethically. Maximizes revenue without destroying player experience \u2014 with hard guardrails against dark patterns.',
    does: [
      'Places ad slots (interstitial, rewarded, banner)',
      'Configures IAP catalog with App Store price tiers',
      'Creates contextual offers (post-level, post-death)',
      'Enforces frequency caps and ethical guardrails',
      'Handles COPPA/GDPR compliance per audience'
    ],
    output: 'MonetizationPlan \u2014 rewarded ad on death,\ninterstitial every 3rd run,\ngem packs $0.99-$19.99,\nstarter bundle $2.99 (one-time)'
  },
  liveops: {
    title: 'LiveOps',
    layer: 'Layer 3 \u2014 Revenue',
    layerClass: 'layer-3-bg',
    desc: 'Time-limited events, seasonal content, and mini-games that keep players engaged post-launch. Drops into the game via event slots.',
    does: [
      'Designs event calendar (weekly, monthly, seasonal)',
      'Creates mini-game variations that slot into the main game',
      'Sets event reward budgets within economy limits',
      'Generates themed content (Halloween, holidays)',
      'Manages milestone and leaderboard mechanics'
    ],
    output: 'EventCalendar \u2014 Week 1: Neon Rush\nchallenge, Week 3: Cyberpunk Festival,\nmonthly tournaments,\ndaily challenges with coin rewards'
  },
  analytics: {
    title: 'Analytics',
    layer: 'Layer 4 \u2014 Optimization',
    layerClass: 'layer-4-bg',
    desc: 'Telemetry, KPIs, funnels, and dashboards. Tracks everything that matters and feeds data to AB Testing for continuous optimization.',
    does: [
      'Instruments every trackable event across all verticals',
      'Defines KPI computations (D1/D7/D30, ARPU, LTV)',
      'Creates funnel definitions (install \u2192 tutorial \u2192 purchase)',
      'Configures dashboards and alerting rules',
      'Produces the EventTaxonomy consumed by AB Testing'
    ],
    output: 'EventTaxonomy \u2014 28 tracked events,\n3 funnels (acquisition, monetization,\nengagement), D1/D7/D30 retention,\nARPDAU, sessions/day dashboards'
  },
  abtesting: {
    title: 'AB Testing',
    layer: 'Layer 4 \u2014 Optimization',
    layerClass: 'layer-4-bg',
    desc: 'Experiments, traffic allocation, and multi-armed bandits. Tests everything post-launch and automatically promotes winning variants.',
    does: [
      'Designs initial experiments from tunable parameters',
      'Allocates traffic across variants (50/50, multi-arm)',
      'Defines success and guardrail metrics per experiment',
      'Prevents conflicting experiments from running together',
      'Feeds winning variants back to Economy, Difficulty, Monetization'
    ],
    output: 'ExperimentPlan \u2014 3 experiments:\nad frequency (3 vs 5 runs),\nstarting coins (50 vs 100),\nenergy regen (15 vs 20 vs 30 min)'
  }
};

// ========================================
// SCROLL REVEAL
// ========================================

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ========================================
// DECONSTRUCTED VIEW — COMPONENT CLICK
// ========================================

const detailPanel = document.getElementById('detail-panel');
const detailClose = document.getElementById('detail-close');
const pieces = document.querySelectorAll('.component-piece');
let activeComponent = null;

pieces.forEach(piece => {
  piece.addEventListener('click', () => {
    const key = piece.dataset.component;
    const data = componentData[key];
    if (!data) return;

    // Toggle off if clicking same piece
    if (activeComponent === key) {
      closeDetail();
      return;
    }

    activeComponent = key;

    // Update active state
    pieces.forEach(p => p.classList.remove('active'));
    piece.classList.add('active');

    // Populate detail panel
    document.getElementById('detail-badge').className = 'detail-layer-badge ' + data.layerClass;
    document.getElementById('detail-badge').textContent = data.layer;
    document.getElementById('detail-title').textContent = data.title;
    document.getElementById('detail-desc').textContent = data.desc;

    const doesList = document.getElementById('detail-does');
    doesList.innerHTML = data.does.map(d => `<li>${d}</li>`).join('');

    document.getElementById('detail-output').textContent = data.output;

    // Update phone content
    const phoneContent = document.getElementById('phone-content');
    phoneContent.innerHTML = `
      <div style="text-align:center">
        <div style="font-size:32px;margin-bottom:8px">${piece.querySelector('.piece-icon').innerHTML}</div>
        <div style="font-weight:700;font-size:14px;color:#1f2937">${data.title}</div>
        <div style="font-size:11px;color:#9ca3af;margin-top:4px">${data.layer}</div>
      </div>
    `;

    // Open panel
    detailPanel.classList.add('open');
  });
});

function closeDetail() {
  detailPanel.classList.remove('open');
  pieces.forEach(p => p.classList.remove('active'));
  activeComponent = null;

  // Reset phone
  document.getElementById('phone-content').innerHTML = `
    <div class="phone-placeholder">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-gray-300"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      <span class="text-gray-400 text-sm mt-2">Select a component</span>
    </div>
  `;
}

detailClose.addEventListener('click', closeDetail);

// Close on escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDetail();
});

// Close on click outside
document.addEventListener('click', (e) => {
  if (detailPanel.classList.contains('open') &&
      !detailPanel.contains(e.target) &&
      !e.target.closest('.component-piece')) {
    closeDetail();
  }
});

// ========================================
// GENRE SWITCHER
// ========================================

const genreTabs = document.querySelectorAll('.genre-tab');
const genrePanels = document.querySelectorAll('.genre-panel');

genreTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const genre = tab.dataset.genre;

    genreTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    genrePanels.forEach(p => {
      if (p.dataset.genre === genre) {
        p.classList.add('active');
        // Animate in
        p.style.opacity = '0';
        p.style.transform = 'translateY(10px)';
        requestAnimationFrame(() => {
          p.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          p.style.opacity = '1';
          p.style.transform = 'translateY(0)';
        });
      } else {
        p.classList.remove('active');
      }
    });
  });
});

// ========================================
// PIPELINE ANIMATION
// ========================================

const pipelineSection = document.getElementById('pipeline');
const pipelinePhases = document.querySelectorAll('.pipeline-phase');
const pipelineProgress = document.getElementById('pipeline-progress');
let pipelineAnimated = false;

const pipelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !pipelineAnimated) {
      pipelineAnimated = true;
      animatePipeline();
    }
  });
}, { threshold: 0.3 });

pipelineObserver.observe(pipelineSection);

function animatePipeline() {
  pipelinePhases.forEach((phase, i) => {
    setTimeout(() => {
      phase.classList.add('visible');
      phase.classList.add('active');

      // Update progress bar
      const progress = ((i + 1) / pipelinePhases.length) * 100;
      pipelineProgress.style.width = progress + '%';
    }, i * 300);
  });
}

// ========================================
// SMOOTH SCROLL
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
