# Coin Master

## Overview

| Field | Value |
|-------|-------|
| **Genre** | Slot Machine / Social-Casual |
| **Developer** | Moon Active |
| **Platform** | iOS, Android |
| **First Release** | 2015 |
| **Why This Game** | Social-viral mechanics as core gameplay, the most aggressive LiveOps cadence in mobile, and a slot machine as the central mechanic. Stress-tests LiveOps, AB Testing, and Monetization verticals. Proves that a mechanically simple game can generate billions with the right meta-systems. |

---

## Vertical Breakdown

### 01 -- UI

> Related: [UI Spec](../Verticals/01_UI/Spec.md) | [Onboarding](../Verticals/01_UI/Onboarding.md)

**Screens:**

- **Village View** -- the player's current village. Displays buildings in various construction/upgrade states. Central focus of the game.
- **Slot Machine** -- overlaid on the village view or full-screen. Three reels with four symbols: coin, attack, raid, shield. Always accessible.
- **Attack Screen** -- shown when attack symbol lands. View a random opponent's village. Choose a building to damage.
- **Raid Screen** -- shown when raid symbol lands. Dig holes in an opponent's village to find buried coins.
- **Card Collection** -- album view of all card sets. Shows owned/missing cards per set. Trade interface for sending/receiving cards with friends.
- **Shop** -- coin packs, spin packs, special offers, chest purchases.
- **Pet System** -- pet selection, feeding, and ability preview.
- **Friends List** -- connected Facebook friends, gifting interface, attack/revenge history.

**HUD:**

- Spin count (top of screen, always visible).
- Coin balance (large, prominent).
- Bet multiplier selector (1x to 200x+).
- Current village number and progress.

**Navigation Pattern:** Village-centric. The village is always visible. The slot machine overlays it. Attacks and raids are modal interruptions. Cards, shop, and pets are side-panel navigation. This is a simpler Shell than Merge Dragons but more interruption-driven than Subway Surfers.

**FTUE:** Extremely short. Spin the slot, build a building, attack someone. Takes under 60 seconds. The game prioritizes getting the player into the core loop immediately and relies on progressive disclosure for depth.

---

### 02 -- Core Mechanics

> Related: [Mechanic Catalog](../Verticals/02_CoreMechanics/MechanicCatalog.md) | [Core Mechanics Spec](../Verticals/02_CoreMechanics/Spec.md)

**Mechanic Type:** Slot Machine + Village Builder (hybrid; no single catalog entry covers this).

**Core Loop:**

1. **Spin** the slot machine. Three reels stop on symbols.
2. **Coins symbol:** earn coins (amount based on bet multiplier).
3. **Attack symbol (hammer):** attack a random player's village, destroying one building.
4. **Raid symbol (pig):** raid a random player's village, digging for buried coins.
5. **Shield symbol:** activate a shield that protects one building from attack.
6. **Spend coins** to build/upgrade village buildings.
7. **Complete the village** (all buildings fully upgraded) to advance to the next village.

**Slot Machine Mechanics:**

| Symbol | Frequency | Effect |
|--------|-----------|--------|
| Coins | High | Award coins (base x bet multiplier) |
| Attack | Medium | Random opponent, choose building to destroy |
| Raid | Medium | Random opponent, dig 3 holes for coins |
| Shield | Medium | Protect one building slot |
| Bonus | Rare | 3 symbols triggers a bonus mini-game |

**Bet Multiplier:** Players choose how many spins to bet per pull (1x, 2x, 5x, 10x, 50x, 100x, 200x+). Higher bets multiply all rewards but consume spins faster. This creates a risk/reward tension that is the game's primary decision point.

**Village Building:**

- Each village has 5 buildings, each with 3-5 upgrade levels.
- Building costs escalate with village number (village 1 costs thousands, village 200+ costs billions).
- Completing a village unlocks the next themed village and grants card rewards.

**Card Collection:**

- Cards drop from chests (purchased or earned).
- Cards organized into themed sets.
- Completing a set grants massive coin/spin rewards.
- Cards can be traded with friends (except gold cards).
- Card rarity: common, rare, gold (untradeable).

**Pet System:**

- Pets provide passive bonuses (extra coins on raids, shield protection, attack bonus).
- Pets must be fed to stay active (food from spin events or purchases).
- Adds a strategic layer to the otherwise luck-based core loop.

---

### 03 -- Monetization

> Related: [Monetization Spec](../Verticals/03_Monetization/Spec.md) | [Ethical Guardrails](../Verticals/03_Monetization/EthicalGuardrails.md)

**IAP (Heavy):**

| Pack Type | Examples | Price Range |
|-----------|----------|-------------|
| Coin Packs | Scaled to village level | $1.99 - $99.99 |
| Spin Packs | 60, 200, 800, 2000 spins | $1.99 - $99.99 |
| Combo Packs | Spins + coins + chests | $4.99 - $49.99 |
| Chest Packs | Card chests for collection | $2.99 - $19.99 |
| Special Offers | Time-limited bundles (FOMO-driven) | $0.99 - $99.99 |

**Rewarded Ads:**

- Watch an ad for free spins (typically 5-10 spins per ad).
- Watch an ad for bonus coins after a raid.
- Ad frequency is high but positioned as "free stuff."

**Interstitials:**

- Shown between sessions and after events.
- More aggressive ad placement than Subway Surfers or Merge Dragons.

**Gift Links (Viral):**

- Moon Active distributes free spin links via social media (Facebook, Instagram, X).
- Players share links with friends for mutual rewards.
- This viral mechanic is a monetization strategy: it drives installs and re-engagement at zero ad cost.

**Event-Driven Spending:**

- Events create urgency to spend spins and coins within limited time windows.
- Event-exclusive rewards incentivize heavy play (and heavy spending) during event periods.

**Notable Monetization Choices:**

- Very high price ceiling ($99.99 packs) and very high spend depth (village costs escalate exponentially, creating effectively unlimited demand for coins).
- The slot machine mechanic itself creates a gambling-like feedback loop that encourages spending.
- Gift links turn every player into a marketing channel.

---

### 04 -- Economy

> Related: [Economy Spec](../Verticals/04_Economy/Spec.md) | [Balance Levers](../Verticals/04_Economy/BalanceLevers.md)

**Currencies:**

| Currency | Type | Earn Method | Primary Sink |
|----------|------|-------------|-------------|
| Coins | Basic (soft) | Slot spins, raids, event rewards | Village building/upgrading |
| Spins | Energy (regenerating) | Time regen (~1/hr, max 50), IAP, gift links, events | Slot machine pulls |
| Cards | Collectible | Chest drops, event rewards, trades | Set completion (consumed conceptually) |
| Pet Food | Consumable | Events, purchases | Feeding pets to activate bonuses |

**Faucets:**

- Coins: slot coin symbols, raids, event rewards, gift links, IAP.
- Spins: time regeneration (slow), IAP (primary), gift links, event rewards, daily bonus wheel.
- Cards: chest openings, event milestone rewards, card trading from friends.
- Pet Food: event rewards, IAP bundles.

**Sinks:**

- Coins: village building (exponentially increasing costs -- the primary sink).
- Spins: consumed on every slot pull (1x per spin at base bet).
- Cards: consumed conceptually on set completion (cards remain in collection but set reward is one-time).
- Pet Food: consumed when feeding pets.

**Economy Characteristics:**

- **Exponential cost curve** is the defining feature. Village 1 costs ~10K coins total. Village 200 costs billions. This creates infinite demand for coins and therefore infinite demand for spins.
- **Spin scarcity** is the primary monetization lever. Free spin earn rate (~50/day from regen + gifts) is far below what players want to spend, especially at high bet multipliers.
- **Inflationary by design.** Coin rewards scale with village level, but costs scale faster. The gap between earn and spend widens, pushing IAP.
- **Social trading** (cards) creates a secondary economy with its own dynamics. Rare cards have enormous perceived value despite having no coin equivalent.

---

### 05 -- Difficulty

> Related: [Difficulty Spec](../Verticals/05_Difficulty/Spec.md)

**Progression Model:** Village-based. Each village is a "level" with escalating costs.

**Difficulty Scaling:**

| Parameter | Behavior Over Villages |
|-----------|----------------------|
| Building Costs | Exponential increase (the primary difficulty lever) |
| Card Rarity | Higher villages require rarer cards to complete sets |
| Attack Damage | Scales with village level (higher-level players deal more damage) |
| Shield Importance | Increasingly critical as building costs rise (losing a building is costlier) |

**PVP Matchmaking:**

- Attack and raid targets are selected semi-randomly but weighted by village level.
- Players at similar village levels are matched more frequently.
- This creates an implicit difficulty bracket without explicit ranked matchmaking.

**No Skill-Based Difficulty:** The slot machine is pure RNG. Player agency is limited to bet sizing and building order. Difficulty is purely economic -- "can you afford to progress?" -- not mechanical.

**Whale Curve:** The exponential cost curve is specifically designed to separate player segments. Casual players progress through dozens of villages. Mid-spenders reach hundreds. Whales reach the highest villages, driven by leaderboard competition and set completion.

---

### 06 -- LiveOps

> Related: [LiveOps Spec](../Verticals/06_LiveOps/Spec.md)

**Event Types:**

| Event | Mechanic | Duration | Frequency |
|-------|----------|----------|-----------|
| Attack Madness | Bonus rewards for attacks | 1-3 days | Weekly |
| Raid Madness | Bonus rewards for raids | 1-3 days | Weekly |
| Village Master | Bonus for completing villages | 2-3 days | Bi-weekly |
| Card Trading Event | Boosted card drop rates, trading bonuses | 2-3 days | Bi-weekly |
| Viking Quest | Spin-based progression on a mini-map | 3-5 days | Monthly |
| Set Blast | Bonus for completing card sets | 1-2 days | Weekly |
| Bet Blast | Bonus for high-bet spins | 1-2 days | Weekly |
| Seasonal Events | Holiday-themed with exclusive rewards | 5-7 days | Seasonal |

**LiveOps Cadence:**

| Cadence | Content |
|---------|---------|
| Daily | Free gift links, daily bonus wheel, daily challenge |
| Every 2-3 days | At least one event active (often overlapping) |
| Weekly | Major event rotation (Attack Madness, Raid Madness, etc.) |
| Monthly | Viking Quest or equivalent large-scale event |
| Seasonal | Holiday themes (Christmas, Halloween, Easter, etc.) |

**Event Overlap:** Coin Master frequently runs 2-3 events simultaneously. This creates constant engagement pressure and makes every session feel "rewarding." The LiveOps cadence is the most aggressive of any game in this reference set.

**Gift Link Economy:**

- Daily free spin links distributed via social media accounts.
- Players share and collect links, creating a daily ritual.
- This is LiveOps via social media, not just in-game events.

**Notable LiveOps Characteristics:**

- Events are not mechanically complex. They layer bonus multipliers on top of existing actions (attack more, raid more, spin more).
- The real sophistication is in the scheduling: events overlap, rotate, and create FOMO.
- Every event encourages spin consumption, which feeds into monetization.

---

### 07 -- AB Testing

> Related: [AB Testing Spec](../Verticals/07_ABTesting/Spec.md)

**Known / Likely Tests:**

Moon Active is one of the most data-driven mobile game companies. They are known for extensive AB testing across every aspect of the game:

- **Spin rewards:** Coin amounts per symbol at each village level.
- **Village costs:** Building upgrade costs (the primary economy lever).
- **Event frequency:** How many concurrent events maximize engagement without fatigue.
- **Offer pricing:** Dynamic pricing based on player segment, purchase history, and predicted LTV.
- **Bet multiplier options:** Which multiplier tiers to offer (does adding 200x increase or decrease revenue?).
- **Gift link amounts:** How many free spins per daily link.
- **Card drop rates:** Chest rarity distributions.
- **Ad frequency:** How many interstitials per session before churn increases.
- **FTUE flow:** Tutorial length and first-purchase offer timing.
- **Pet effectiveness:** How strong pet bonuses should be to incentivize feeding (and food purchases).

**Personalized Offers:** Coin Master is known for showing different IAP offers to different players based on their spending history and predicted price sensitivity. This is advanced AB testing that borders on dynamic pricing.

**Testing at Scale:** With hundreds of millions of installs, Coin Master can run dozens of concurrent experiments with statistical significance in hours, not weeks. The AB Testing vertical should accommodate this kind of high-throughput experimentation.

---

### 08 -- Analytics

> Related: [Analytics Spec](../Verticals/08_Analytics/Spec.md)

**Key Metrics:**

| Category | Metrics |
|----------|---------|
| Engagement | DAU, MAU, D1/D7/D30 retention, session length, sessions per day, spin sessions per day |
| Core Loop | Spins per session, bet distribution, attack frequency, raid frequency, shield usage |
| Economy | Coin earn/spend ratio, spin balance distribution, village progression rate, coins per village |
| Monetization | ARPDAU, ARPPU, conversion rate, IAP revenue by SKU, ad revenue per session, LTV by cohort |
| Progression | Village completion rate, average village level by cohort age, time per village |
| Social/Viral | Gift link clicks, installs from links, friend connections, card trades per day, K-factor |
| LiveOps | Event participation rate, event spin consumption, event revenue lift, concurrent event engagement |
| Cards | Set completion rate, card trading volume, chest open rate, rare card distribution |

**Viral Loop Metrics:**

- **K-factor:** Average number of new installs generated per existing player.
- **Gift link conversion:** Links shared > links clicked > installs > retained players.
- **Social graph density:** Average friend connections per player.

These viral metrics are unique to Coin Master's social model. The Analytics vertical needs to support game-specific metric definitions beyond standard KPIs.

**Funnels:**

- FTUE funnel: install > first spin > first build > first attack > day 2 return.
- Purchase funnel: offer shown > offer viewed > purchase started > purchase complete.
- Viral funnel: link shared > link clicked > app opened/installed > first session > retained.
- Event funnel: event awareness > first event action > midpoint > event complete.

**Segmentation:**

- By spending tier: non-spender, minnow, dolphin, whale.
- By village level: early (1-50), mid (50-150), late (150+).
- By social engagement: solo, social-light (few friends), social-heavy (active trader).
- By event engagement: event-ignorer, event-participant, event-driven.

---

### 09 -- Assets

> Related: [Assets Spec](../Verticals/09_Assets/Spec.md)

**Art Style:** 2D cartoon, bright and playful. Viking theme as base, but villages span dozens of themes (pirate, Egyptian, Japanese, sci-fi, etc.).

**Village Art:**

- Each village number has a unique theme and 5 building designs.
- Buildings have 3-5 visual upgrade states.
- With 300+ villages, this is an enormous art pipeline (1500+ building states).
- Art style is simple enough to produce at high volume.

**Slot Machine Graphics:**

- Reel symbols (coin, hammer, pig bandit, shield).
- Spin animation effects.
- Win celebration effects (big coin shower, attack impact, raid dig).

**Card Art:**

- Hundreds of unique card illustrations organized into themed sets.
- Cards range from common (simple illustration) to gold (premium illustration with special border).

**Character Art:**

- Player avatar (viking character with customizable skins).
- Pet illustrations and animations.
- Opponent character display during attacks/raids.

**Event Themes:**

- Event-specific UI overlays, banners, and backgrounds.
- Seasonal visual overhauls (Halloween village decorations, Christmas themes).

**Audio:**

- Slot machine sounds (reel spin, stop, win jingle).
- Village construction sounds.
- Attack/raid impact effects.
- Celebratory music for big wins and village completion.
- Background music (varies by village theme).

---

## Framework Fit

### What Maps Cleanly

- **Monetization is comprehensive and well-bounded.** Every revenue touchpoint (IAP, ads, gift links) fits neatly into the Monetization vertical. The framework's placement model handles multiple simultaneous monetization strategies.
- **Economy currencies are clear.** Coins, spins, cards, and pet food each have well-defined faucets and sinks. The exponential cost curve is a parameter the Economy vertical can model directly.
- **LiveOps is a natural fit.** Events are data-driven overlays on existing mechanics. The LiveOps vertical's event-slot model handles Coin Master's aggressive cadence.
- **AB Testing is core to the business.** Coin Master proves that the AB Testing vertical is not optional -- it is a primary driver of revenue optimization.

### What Feels Awkward

- **Social/viral mechanics have no vertical.** Gift links, friend attacks, card trading, and the viral K-factor loop are central to Coin Master's success. These span Monetization (viral as acquisition), LiveOps (gift links as daily content), and Analytics (viral metrics). A Social vertical is conspicuously absent.
- **Slot machine as Core Mechanic** is pure RNG. The Core Mechanics vertical assumes player agency (input > action > outcome based on skill). Coin Master's core input is "tap to spin" with random outcomes. The framework must accommodate luck-based mechanics alongside skill-based ones.
- **PVP (attack/raid) blurs vertical boundaries.** Attacking another player's village involves Core Mechanics (the action), Difficulty (matchmaking), Economy (coin impact), and a Social component (revenge, retaliation). The cross-vertical coordination for PVP is heavier than for single-player mechanics.
- **Dynamic/personalized pricing** is an AB Testing concern, a Monetization concern, and an Analytics concern simultaneously. The framework should clarify which vertical owns offer personalization.

---

## Lessons for AI Engine

1. **Social mechanics need a framework answer.** Both Coin Master and Merge Dragons surface this gap. Whether it is a 10th vertical or a cross-cutting concern formalized in [Shared Interfaces](../Verticals/00_SharedInterfaces.md), the framework must address social features systematically.

2. **RNG-based core mechanics are valid and lucrative.** The Mechanic Catalog should include luck-based mechanics (slot, gacha, dice) alongside skill-based ones (runner, merge, puzzle). Player agency exists in meta-decisions (bet sizing, building order) even when the moment-to-moment mechanic is random.

3. **Exponential cost curves are a monetization strategy, not just a difficulty one.** The Difficulty and Economy verticals must coordinate on progression curves. In Coin Master, "difficulty" is entirely economic -- the Difficulty vertical owns the parameters but the Economy vertical determines their impact.

4. **LiveOps volume can substitute for mechanic depth.** Coin Master's core mechanic is trivially simple. Retention comes from event layering, social pressure, and FOMO. The LiveOps vertical should support high-frequency, low-complexity event generation -- not just periodic large-scale events.

5. **Viral loops are a zero-cost acquisition channel.** Gift links and social sharing generate installs without ad spend. The framework should model viral mechanics as a monetization strategy (not just a social feature) with measurable K-factor targets in the Analytics vertical.

6. **Personalized offers require tight AB Testing and Analytics integration.** Coin Master shows that static pricing is suboptimal. The AB Testing vertical should support player-level experiment allocation (not just cohort-level), and the Analytics vertical must feed real-time spending signals back into the testing engine.

---

*Cross-references: [Mechanic Catalog](../Verticals/02_CoreMechanics/MechanicCatalog.md) | [Economy Balance Levers](../Verticals/04_Economy/BalanceLevers.md) | [Monetization Compliance](../Verticals/03_Monetization/Compliance.md) | [Ethical Guardrails](../Verticals/03_Monetization/EthicalGuardrails.md) | [Shared Interfaces](../Verticals/00_SharedInterfaces.md)*
