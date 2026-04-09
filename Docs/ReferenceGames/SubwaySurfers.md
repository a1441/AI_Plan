# Subway Surfers

## Overview

| Field | Value |
|-------|-------|
| **Genre** | Endless Runner |
| **Developer** | Kiloo / SYBO Games |
| **Platform** | iOS, Android |
| **First Release** | 2012 |
| **Why This Game** | One of the most downloaded mobile games ever. Clean Shell+Slot architecture. Minimal economy, maximal LiveOps rotation. Validates that a simple mechanic can sustain a massive game when wrapped in strong meta-systems. |

---

## Vertical Breakdown

### 01 -- UI

> Related: [UI Spec](../Verticals/01_UI/Spec.md) | [Onboarding](../Verticals/01_UI/Onboarding.md)

**Screens:**

- **Loading Screen** -- branded splash with progress bar; rotates seasonal theme art.
- **Main Menu** -- central hub with character model, play button, and radial navigation to sub-screens.
- **Character Selection** -- horizontal scroll of owned/locked characters with unlock cost display.
- **Missions Panel** -- three active missions with progress bars and reward previews.
- **Shop** -- tabbed: coins, keys, characters, hoverboards, mystery boxes, special offers.
- **Leaderboard** -- friends and global, driven by weekly hunt score.
- **Settings** -- audio, language, social login.

**HUD (In-Run):**

- Currency bar (coins collected this run + total keys).
- Score counter (distance-based, top-right).
- Mission progress indicator (when near completion).
- Pause button.
- Power-up indicators with duration timers.

**Navigation Pattern:** Hub-and-spoke. Main menu is the hub; all sub-screens return to it. No deep nesting. This maps cleanly to the Shell concept -- the runner mechanic is a single Slot launched from the play button.

**FTUE:** Tutorial run with guided swipes (left, right, up, down). Introduces one obstacle type at a time. Ends with a coin collection reward. Minimal friction -- player is running within 10 seconds of first launch.

---

### 02 -- Core Mechanics

> Related: [Mechanic Catalog](../Verticals/02_CoreMechanics/MechanicCatalog.md) | [Core Mechanics Spec](../Verticals/02_CoreMechanics/Spec.md)

**Mechanic Type:** Endless Runner (maps to `runner` in the Mechanic Catalog).

**Core Loop:**

1. Player runs forward automatically (constant forward movement).
2. Swipe left/right to switch between 3 lanes.
3. Swipe up to jump, swipe down to roll.
4. Avoid obstacles (trains, barriers, tunnels) or crash.
5. Collect coins scattered along the path.
6. Activate power-ups (magnet, jetpack, 2x multiplier, super sneakers).
7. Run ends on collision (unless hoverboard absorbs it).
8. Score = distance traveled x score multiplier.

**Input Model:** Four-directional swipe. Tap for nothing (no tap-to-jump). Clean, unambiguous input that works at high speed.

**Scoring:**

- Primary score: distance (meters).
- Secondary score: coins collected.
- Score multiplier: increases by completing mission sets (permanent progression).

**Power-Ups:**

| Power-Up | Effect | Duration |
|----------|--------|----------|
| Coin Magnet | Attracts nearby coins | ~10s |
| Jetpack | Fly above obstacles, collect sky coins | ~10s |
| 2x Multiplier | Doubles score | ~10s |
| Super Sneakers | Higher jumps, float longer | ~10s |
| Hoverboard | Absorbs one crash (shield) | 30s or until hit |

Power-ups are upgradeable (longer duration) via coin spending -- this is the economy sink.

**Obstacle Patterns:** Procedurally generated from a pattern library. Patterns combine lane blockages, height requirements (jump/roll), and timing windows. Complexity increases with distance.

---

### 03 -- Monetization

> Related: [Monetization Spec](../Verticals/03_Monetization/Spec.md) | [Ethical Guardrails](../Verticals/03_Monetization/EthicalGuardrails.md)

**Rewarded Ads:**

- **Continue after crash:** Watch a 15-30s ad to revive and keep running. Limited to 1-2 per run. This is the highest-value ad placement -- player is emotionally invested in their run.
- **2x coin bonus:** After a run ends, watch an ad to double coins earned. Low friction, high take rate.
- **Mystery box boost:** Watch an ad for an extra mystery box spin.

**IAP:**

| Pack Type | Examples | Price Range |
|-----------|----------|-------------|
| Coin Packs | 10K, 50K, 150K coins | $0.99 - $9.99 |
| Key Packs | 5, 15, 40 keys | $0.99 - $4.99 |
| Character Bundles | Limited character + coins + keys | $2.99 - $9.99 |
| Starter Pack | One-time offer: coins + keys + hoverboard | $1.99 |
| Season Pass | Unlock seasonal rewards track | $4.99 |

**Notable Monetization Choices:**

- No interstitial ads during gameplay. All ads are opt-in (rewarded). This preserves the core experience.
- No paywalled content that blocks progression. All characters are cosmetic.
- Aggressive but non-predatory: lots of offers, but the game is fully playable for free.

---

### 04 -- Economy

> Related: [Economy Spec](../Verticals/04_Economy/Spec.md) | [Balance Levers](../Verticals/04_Economy/BalanceLevers.md)

**Currencies:**

| Currency | Type | Earn Rate | Primary Sink |
|----------|------|-----------|-------------|
| Coins | Basic (soft) | ~200-500 per run | Power-up upgrades, character unlocks, hoverboards |
| Keys | Premium (hard) | ~1-3 per run (rare) | Mystery boxes, premium character unlocks |

**Faucets (Sources):**

- Coins: in-run collection, mission rewards, daily rewards, mystery boxes, IAP.
- Keys: in-run collection (rare spawns), mystery boxes, mission milestones, IAP.

**Sinks (Drains):**

- Power-up upgrades (coin sink, 5 levels each, escalating cost).
- Character unlocks (coin or key costs, some require event tokens).
- Hoverboard unlocks and usage (coin sink).
- Mystery box spins (key sink).

**Economy Characteristics:**

- Shallow economy: only 2 currencies. No energy system, no stamina, no time-gates on play.
- Infinite play sessions. The economy monetizes enhancement, not access.
- Score multiplier progression is the only permanent upgrade and is gated behind mission completion, not currency.

---

### 05 -- Difficulty

> Related: [Difficulty Spec](../Verticals/05_Difficulty/Spec.md)

**Progression Model:** Continuous (no discrete levels). Difficulty is a function of distance traveled within a single run.

**Scaling Parameters:**

| Parameter | Behavior Over Distance |
|-----------|----------------------|
| Movement Speed | Increases logarithmically; caps at a high but reachable maximum |
| Obstacle Density | Increases linearly; more obstacles per 100m segment |
| Pattern Complexity | More multi-lane blockages requiring jump+lane-switch combos |
| Coin Placement | Shifts from obvious paths to risky positions near obstacles |
| Train Frequency | Increases; narrower safe windows |

**Difficulty Curve Shape:** Logarithmic ramp. The first 500m are gentle (tutorial-like even after FTUE). 500-2000m is the "flow" zone for most players. 2000m+ is the expert zone where reaction time is the bottleneck.

**No Adaptive Difficulty:** The curve is deterministic per run. There is no DDA (Dynamic Difficulty Adjustment). Every player faces the same speed at the same distance. This is a deliberate design choice -- it makes leaderboards fair.

**Player Skill Expression:** Score multiplier (from mission progression) is the long-term skill signal. High-multiplier players earn more score per meter, rewarding consistent play.

---

### 06 -- LiveOps

> Related: [LiveOps Spec](../Verticals/06_LiveOps/Spec.md)

**Seasonal Updates (World Tour):**

- New city/theme every 3-4 weeks (e.g., Tokyo, Cairo, New York, Mumbai).
- Each update brings: new environment art, 1-2 new characters, themed obstacles, loading screen.
- This is the primary content cadence and retention driver.

**Weekly Hunts:**

- Collect themed tokens (e.g., roses, lanterns) during runs.
- Token collection unlocks hunt-specific rewards (coins, keys, mystery boxes, limited characters).
- Creates a weekly engagement loop on top of the session-level run loop.

**Limited Characters:**

- Some characters are only available during their city's World Tour season.
- Creates urgency and FOMO (fear of missing out).
- Characters are cosmetic-only, so this is ethical FOMO (no gameplay advantage).

**Daily Challenges / Rewards:**

- Daily login bonus (escalating over consecutive days).
- Daily mission refresh.

**LiveOps Cadence:**

| Cadence | Content |
|---------|---------|
| Daily | Login bonus, mission refresh |
| Weekly | Hunt cycle, leaderboard reset |
| Monthly | World Tour city rotation |
| Seasonal | Major themed events (Halloween, Lunar New Year) |

---

### 07 -- AB Testing

> Related: [AB Testing Spec](../Verticals/07_ABTesting/Spec.md)

**Known / Likely Tests:**

Subway Surfers is operated by a sophisticated live team. While specific tests are not public, the following are near-certain based on industry practice and observable variation between players:

- **Ad frequency:** How many rewarded ad opportunities per run (1 vs 2 continues).
- **Offer pricing:** Starter pack at $1.99 vs $2.99 vs $3.99.
- **Hunt reward amounts:** Token-to-reward ratios in weekly hunts.
- **New character pricing:** Coin cost vs key cost for new character unlocks.
- **Mystery box odds:** Probability of key drops vs coin drops in mystery boxes.
- **FTUE length:** Number of guided tutorial steps before free play.
- **Score multiplier progression:** How many missions per multiplier level.

**Testing Infrastructure Pattern:** Server-side config with player segmentation. New players are bucketed on first launch. This maps directly to the [AB Testing vertical's](../Verticals/07_ABTesting/Spec.md) experiment allocation model.

---

### 08 -- Analytics

> Related: [Analytics Spec](../Verticals/08_Analytics/Spec.md)

**Key Metrics (Likely Tracked):**

| Category | Metrics |
|----------|---------|
| Engagement | DAU, MAU, session length, sessions per day, D1/D7/D30 retention |
| Core Loop | Distance per run, runs per session, coins per run, crash reasons |
| Economy | Coin earn rate, coin spend rate, key earn rate, key spend rate, currency balance distribution |
| Monetization | ARPDAU, conversion rate, IAP revenue per SKU, ad revenue per placement, rewarded ad take rate |
| LiveOps | Hunt participation rate, hunt completion rate, World Tour engagement lift |
| Progression | Score multiplier distribution, power-up upgrade distribution, character unlock rate |

**Funnels:**

- FTUE funnel: install > first run > tutorial complete > second run > day 2 return.
- Purchase funnel: shop view > offer view > purchase initiation > purchase complete.
- Ad funnel: crash > continue offer shown > ad watched > run continued.

**Segmentation:**

- New (D0-D7), engaged (D8-D30), veteran (D30+), churned (no session in 7+ days).
- Spender vs non-spender. Whale vs minnow.
- By World Tour engagement (participates in hunts vs ignores them).

---

### 09 -- Assets

> Related: [Assets Spec](../Verticals/09_Assets/Spec.md)

**Art Style:** Stylized 3D, low-poly with bright saturated colors. Designed for readability at high speed on small screens.

**Character Art:**

- ~50+ characters, each with unique model and animations.
- Characters are cosmetic skins -- no gameplay difference.
- Seasonal/limited characters drive collection behavior.

**Environment Art:**

- One full city environment per World Tour update.
- Shared structural grammar (tracks, trains, buildings) with city-specific theming.
- Skybox, props, and obstacle reskins per city.

**Effects:**

- Power-up activation effects (jetpack flames, magnet field, sneaker trails).
- Coin collection particles.
- Crash animation and screen shake.

**Audio:**

- Upbeat background music (changes per city).
- SFX: coin collect, swipe, jump, crash, power-up activation.
- No voice acting.

**UI Sprites:**

- Currency icons (coin, key).
- Power-up icons.
- Button styles (consistent across screens).
- City-themed loading screens and menu backgrounds.

---

## Framework Fit

### What Maps Cleanly

- **Shell+Slot is a perfect fit.** The main menu, shop, character selection, and currency bar are the Shell. The endless runner is the Slot. You could swap the runner for a different mechanic and the Shell would still work.
- **Economy is simple and well-bounded.** Two currencies, clear faucets and sinks. The Economy vertical handles this trivially.
- **LiveOps is the retention engine.** The World Tour rotation is a textbook LiveOps pattern -- drop new themed content into the existing Slot on a regular cadence.
- **Monetization placements are clean.** Rewarded ads at natural pause points (crash, end-of-run). IAP in the shop. No ambiguity about which vertical owns what.

### What Feels Awkward

- **Score multiplier progression** sits between Core Mechanics (it affects scoring) and Difficulty (it affects the player's power curve). In the framework, it likely belongs to Economy as a progression system, but it is not currency-based.
- **Obstacle pattern generation** could belong to Core Mechanics (it is gameplay) or Difficulty (it is challenge scaling). The framework should clarify that Difficulty owns the parameters and Core Mechanics owns the execution.
- **World Tour theming** spans Assets (new art), LiveOps (event schedule), and UI (new loading screens). The framework handles this via cross-vertical coordination in [Shared Interfaces](../Verticals/00_SharedInterfaces.md), but it is worth testing that the handoff is clean.

---

## Lessons for AI Engine

1. **A simple Slot can sustain a massive game.** The runner mechanic itself is not complex. The framework does not need to generate complex mechanics to produce commercially viable games.

2. **LiveOps cadence matters more than mechanic depth.** Subway Surfers stays relevant through relentless content rotation, not mechanical innovation. The LiveOps vertical should be capable of high-frequency content generation.

3. **Cosmetic-only progression is viable.** No pay-to-win, no gameplay-affecting IAP. The framework should support purely cosmetic economies alongside power-progression economies.

4. **Shell reuse is real.** The Subway Surfers Shell has barely changed since 2012. The mechanic Slot and the Asset themes rotate constantly. This validates the Shell+Slot separation as architecturally sound.

5. **Rewarded ads at emotional peaks convert best.** The "continue after crash" placement works because the player is invested. The Monetization vertical should understand emotional context, not just screen position.

---

*Cross-references: [Mechanic Catalog](../Verticals/02_CoreMechanics/MechanicCatalog.md) | [Economy Balance Levers](../Verticals/04_Economy/BalanceLevers.md) | [LiveOps Spec](../Verticals/06_LiveOps/Spec.md) | [Shared Interfaces](../Verticals/00_SharedInterfaces.md)*
