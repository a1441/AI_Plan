# Merge Dragons

## Overview

| Field | Value |
|-------|-------|
| **Genre** | Merge Puzzle / Collection |
| **Developer** | Gram Games (acquired by Zynga) |
| **Platform** | iOS, Android |
| **First Release** | 2017 |
| **Why This Game** | Dual game spaces (levels + camp), deep item chains, 5+ currencies, and a discovery mechanic that makes merge addictive. Stress-tests the Economy vertical with multi-currency complexity and challenges the Shell+Slot model with two distinct play spaces. |

---

## Vertical Breakdown

### 01 -- UI

> Related: [UI Spec](../Verticals/01_UI/Spec.md) | [Onboarding](../Verticals/01_UI/Onboarding.md)

**Screens:**

- **World Map** -- level select screen showing a branching map of puzzle levels. Stars indicate completion rating. Locked levels shown with requirements.
- **Camp** -- the persistent base. A large scrollable grid where the player merges items, grows dragons, and builds their collection. Always accessible from any screen.
- **Level Gameplay** -- a self-contained grid puzzle with a goal (heal all dead land, merge specific items). Separate from camp.
- **Shop** -- gems, coins, premium dragons, camp expansions, season pass.
- **Dragon Book** -- collection catalog of all discoverable dragon breeds with merge chains shown.
- **Quest Log** -- active quests (camp quests, star quests, event quests) with reward previews.
- **Event Screen** -- dedicated UI for active events with their own map, rewards track, and timer.

**HUD (In-Level):**

- Goal indicator (what to merge/heal).
- Chalice count (energy remaining).
- Star rating progress.
- Inventory overflow indicator.

**HUD (In-Camp):**

- Dragon power meter (total progression).
- Currency bar (coins, gems, stone).
- Active quest tracker.
- Dragon idle status.

**Navigation Pattern:** Dual-hub. The World Map and Camp are both primary destinations. Levels are launched from the World Map and return to it on completion. Camp is persistent and always one tap away. This is more complex than a simple hub-and-spoke Shell.

**FTUE:** Guided merge tutorial in a simplified level. Introduces 3-merge, 5-merge (bonus), and the concept of item chains. Then transitions to camp with a guided first dragon hatch. Takes ~3 minutes. Well-paced but information-dense.

---

### 02 -- Core Mechanics

> Related: [Mechanic Catalog](../Verticals/02_CoreMechanics/MechanicCatalog.md) | [Core Mechanics Spec](../Verticals/02_CoreMechanics/Spec.md)

**Mechanic Type:** Grid-based Merge (maps to `merge` in the Mechanic Catalog).

**Core Loop:**

1. Place items on a grid.
2. Drag 3+ identical items together to merge them into the next tier.
3. Merging 5 creates a bonus item (incentivizes patience over speed).
4. Higher-tier items unlock new capabilities (better dragons, more valuable resources).
5. Discover new items by progressing through merge chains.

**Item Chains:**

The defining feature. Every item type has a chain of 6-10 tiers:

| Example Chain | Tiers |
|---------------|-------|
| Dragon Eggs | Egg > Nest > Whelp > Young > Adult > Elder > Legendary |
| Life Flowers | Seed > Sprout > Flower > Twin Flower > Life Tree |
| Coins | Bronze > Silver > Gold > Treasure Chest |

There are 20+ distinct item chains, each with their own visual identity and gameplay role.

**Dual Game Spaces:**

- **Levels:** Self-contained puzzles. Fixed starting items, specific goals, star ratings. Items do not transfer to camp (except star rewards).
- **Camp:** Persistent sandbox. Items stay permanently. Dragons idle-harvest resources. No win/lose state. Progress is measured by dragon power and chain completion.

This dual-space design means the Core Mechanics vertical must support two modes: constrained puzzle and open sandbox, both using the same merge mechanic.

**Discovery Mechanic:** New item types are hidden until the player first creates them through merging. The Dragon Book tracks discoveries. This creates a strong "what's next?" pull.

---

### 03 -- Monetization

> Related: [Monetization Spec](../Verticals/03_Monetization/Spec.md) | [Ethical Guardrails](../Verticals/03_Monetization/EthicalGuardrails.md)

**IAP:**

| Pack Type | Examples | Price Range |
|-----------|----------|-------------|
| Gem Packs | 30, 100, 260, 550, 1200 gems | $1.99 - $49.99 |
| Premium Dragons | Exclusive breeds not in merge chains | $4.99 - $19.99 |
| Camp Expansions | Unlock new land tiles | $2.99 - $9.99 |
| Starter Pack | One-time: gems + premium dragon + coins | $4.99 |
| Season Pass | Premium reward track for seasonal events | $9.99 |

**Rewarded Ads:**

- **Extra chalice:** Watch an ad to gain one chalice (energy) for levels.
- **Speed-up:** Watch an ad to skip a timer (dragon idle harvest, camp construction).
- **Bonus rewards:** Watch an ad for extra rewards after level completion.

**Season Pass Model:**

- Free track: basic rewards for all players.
- Premium track: enhanced rewards, exclusive dragons, bonus items.
- Duration: ~30 days per season.

**Notable Monetization Choices:**

- Gem economy is deep -- gems are required for many high-value camp actions (skipping timers, buying premium eggs, expanding land).
- Chalice (energy) system gates level play but not camp play. Camp is always accessible.
- High price ceiling: gem packs go up to $49.99, and heavy spenders can consume thousands of gems on camp optimization.

---

### 04 -- Economy

> Related: [Economy Spec](../Verticals/04_Economy/Spec.md) | [Balance Levers](../Verticals/04_Economy/BalanceLevers.md)

**Currencies:**

| Currency | Type | Earn Method | Primary Sink |
|----------|------|-------------|-------------|
| Coins | Basic (soft) | Level rewards, camp harvesting, merging coin chain | Camp items, low-tier purchases |
| Gems | Premium (hard) | Slow earn from quests, daily rewards, IAP | Timers, premium eggs, land expansion, continues |
| Chalices | Energy | Regenerate over time (1 per ~80 min, max 7) | Entering levels (1 per level) |
| Dragon Power | Progression | Earned by owning/upgrading dragons | Unlocks camp quests, world map progress |
| Stone | Building material | Camp harvesting, merging stone chain | Camp building construction |

**Faucets:**

- Coins: level star rewards, camp harvesting (dragons auto-collect), coin merge chain, daily login.
- Gems: quest completion (slow), daily rewards (1-3/day), rare camp discoveries, IAP.
- Chalices: time-based regeneration, rewarded ads, gem purchase.
- Dragon Power: permanent accumulation from dragon ownership (never spent, only gained).

**Sinks:**

- Coins: buying items from camp shop, speeding up processes.
- Gems: premium egg purchases, land unlocks, timer skips, event continues.
- Chalices: consumed on level entry.
- Stone: consumed on camp construction projects.

**Economy Characteristics:**

- Deep multi-currency economy. Five distinct currencies with different earn rates, spend patterns, and value propositions.
- Time-gating via chalices creates a natural session-end point for level play, but camp play has no gate.
- Gem economy is the primary monetization driver. Free gem earn rate is deliberately slow to encourage IAP.
- Dragon Power is a non-tradable, non-spendable progression metric. It functions as a score, not a currency, but the framework's Economy vertical should still model it.

---

### 05 -- Difficulty

> Related: [Difficulty Spec](../Verticals/05_Difficulty/Spec.md)

**Progression Model:** Level-based with star ratings (1-3 stars per level). Separate from camp progression.

**Level Difficulty Scaling:**

| Parameter | Behavior Over Levels |
|-----------|---------------------|
| Grid Size | Starts small (6x6), grows to large (12x12) |
| Starting Items | Fewer and lower-tier in harder levels |
| Dead Land Coverage | More dead land to heal in later levels |
| Goal Complexity | Single-goal early, multi-goal later |
| Required Chain Depth | Shallow chains early, deep chains later |
| Move Efficiency | Less margin for error in later levels |

**Star Rating System:**

- 1 star: complete the level goal.
- 2 stars: complete goal + secondary objective.
- 3 stars: complete goal + secondary + bonus (e.g., heal all land).

Stars unlock world map progression and camp rewards.

**Camp Difficulty:**

- No explicit difficulty curve, but camp quests escalate in requirements.
- Early quests: "Merge 3 life flowers." Late quests: "Create a level 10 life tree."
- Camp progression is gated by dragon power and land availability, both of which require significant time or spending.

**No Fail State in Camp:** Players cannot lose in camp. This is a comfort mechanic that keeps players engaged even when levels feel hard.

---

### 06 -- LiveOps

> Related: [LiveOps Spec](../Verticals/06_LiveOps/Spec.md)

**Seasonal Events:**

- Large-scale merge events with their own map, exclusive item chains, and reward tracks.
- Duration: 3-5 days.
- Frequency: 1-2 per month.
- Own energy system (event chalices, separate from main chalices).
- Exclusive event dragons and items.

**Weekend Events:**

- Shorter events (Friday-Sunday) with simpler goals.
- Often themed around a specific merge chain (e.g., "Harvest Festival" focused on life flowers).

**Den Events (Social):**

- Cooperative events where den (guild) members contribute merge progress toward shared goals.
- Den rewards are distributed to all participating members.
- Creates social pressure and retention.

**LiveOps Cadence:**

| Cadence | Content |
|---------|---------|
| Daily | Login bonus, daily quest refresh, free gift |
| Weekend | Mini-events, bonus challenges |
| Bi-weekly | Major seasonal event |
| Monthly | Season pass cycle |
| Quarterly | Major content update (new dragon families, new level chapters) |

**Content Rotation:** Events reuse the merge mechanic with themed item sets. This is content-efficient -- the engine is the same, only the data changes. Strong validation of the Slot concept for LiveOps.

---

### 07 -- AB Testing

> Related: [AB Testing Spec](../Verticals/07_ABTesting/Spec.md)

**Known / Likely Tests:**

- **Merge chain lengths:** Does a 7-tier chain retain better than a 10-tier chain? Shorter chains give faster gratification; longer chains give deeper engagement.
- **Gem pricing:** Price elasticity of gem packs across regions and player segments.
- **Event reward amounts:** How generous should event rewards be to maximize participation without devaluing gems?
- **Chalice regeneration rate:** 80 minutes vs 60 minutes vs 100 minutes per chalice.
- **Camp land unlock costs:** Gem cost for expanding camp territory.
- **Season pass pricing:** $9.99 vs $7.99 vs $12.99.
- **5-merge bonus value:** How much better should the 5-merge bonus be vs two 3-merges?
- **FTUE depth:** How many tutorial steps before camp access.

**Testing Complexity:** The multi-currency economy creates a large parameter space for AB testing. Changes to gem pricing affect chalice purchase rates, which affect level engagement, which affects coin earn rates. The AB Testing vertical needs to model these cascading effects.

---

### 08 -- Analytics

> Related: [Analytics Spec](../Verticals/08_Analytics/Spec.md)

**Key Metrics:**

| Category | Metrics |
|----------|---------|
| Engagement | DAU, MAU, D1/D7/D30 retention, session length, sessions per day |
| Core Loop | Merges per session, chain completion rate, 5-merge ratio, level attempts per completion |
| Economy | Gem balance distribution, chalice spend rate, coin velocity, dragon power growth curve |
| Monetization | ARPDAU, conversion rate, gem pack revenue by SKU, season pass attach rate, LTV by cohort |
| Progression | Level completion rate by level, star distribution, camp dragon power curve, chain discovery rate |
| LiveOps | Event participation rate, event completion rate, den activity, event gem spend |
| Social | Den join rate, den contribution rate, friend referral rate |

**Funnels:**

- FTUE funnel: install > tutorial start > first merge > camp access > first level > day 2 return.
- Level funnel: level start > attempt 1 > attempt 2 > completion > star collection.
- Purchase funnel: shop view > gem pack view > purchase start > purchase complete.
- Event funnel: event awareness > event start > midpoint > event complete.

**Merge-Specific Analytics:**

- Merge efficiency: ratio of 5-merges to 3-merges (indicates player skill/patience).
- Chain depth reached per item family.
- Discovery rate: new items found per session.
- These are mechanic-specific metrics that the Analytics vertical must support per-Slot, not generically.

---

### 09 -- Assets

> Related: [Assets Spec](../Verticals/09_Assets/Spec.md)

**Art Style:** 2D top-down, stylized fantasy. Bright, clean, high-contrast sprites designed for readability on small grid tiles.

**Item Sprites:**

- Hundreds of unique item sprites across 20+ chains.
- Each chain has a consistent visual progression (small/simple to large/ornate).
- Items must be distinguishable at grid-tile size (~40x40px effective).

**Dragon Art:**

- Each dragon breed has sprites for: egg, whelp, young, adult, elder.
- Idle animations, harvesting animations, flying animations.
- 100+ distinct dragon designs.

**Environment Art:**

- Camp terrain tiles (grass, dead land, water, stone).
- Level backgrounds (themed per chapter).
- Event-specific environments and item sets.

**Effects:**

- Merge sparkle effect (the signature animation).
- Healing effect (dead land transforming to grass).
- Discovery flash (new item type revealed).
- Dragon hatching animation.

**UI Elements:**

- Currency icons (coins, gems, chalices, stone, dragon power).
- Chain progress indicators.
- Quest markers and reward previews.
- Event banners and countdown timers.

**Audio:**

- Calm, ambient background music (fantasy genre).
- SFX: merge sound, discovery chime, dragon sounds, coin collect.
- Event-specific music themes.

---

## Framework Fit

### What Maps Cleanly

- **Merge mechanic as a Slot works well.** The merge engine is self-contained: input (drag items), rules (3+ match = merge up), output (new tier item). It plugs into both level and camp contexts.
- **Multi-currency economy is fully supported.** The Economy vertical's faucet/sink model handles 5 currencies without strain. Each currency has clear sources and drains.
- **LiveOps event model is clean.** Events reuse the merge Slot with different data (themed items, different chain definitions). This validates the Slot+data-swap pattern for LiveOps.

### What Feels Awkward

- **Dual game spaces (levels + camp) challenge Shell+Slot.** The Shell is not a single hub -- it is two hubs (World Map and Camp) with different UIs and different gameplay contexts. The framework may need a concept of "multi-Slot Shell" or "Shell with sub-modes."
- **Discovery/collection mechanic** spans Core Mechanics (you discover by merging), Economy (discoveries unlock value), and Assets (new sprites revealed). It is a cross-cutting concern without a clear vertical owner.
- **Dragon Power** is not really a currency (you never spend it) but it gates progression. The Economy vertical models it as a "progression metric," but the framework should formalize the distinction between spendable currencies and accumulation metrics.
- **Den (social) features** do not have a clear vertical. Social systems are not one of the 9 verticals. Den events are LiveOps, but den management, friend lists, and social pressure mechanics have no home.

---

## Lessons for AI Engine

1. **The framework must support dual play spaces.** Merge Dragons is not unique here -- many successful games have "levels + persistent base" (Clash of Clans, Candy Crush Saga, Gardenscapes). The Shell+Slot model should accommodate a persistent space alongside level-based play.

2. **Deep item chains are a mechanic and an economy intertwined.** The merge chain is gameplay, but the chain depth, tier values, and discovery rates are economy parameters. The boundary between Core Mechanics and Economy needs to be especially clear for merge-type games.

3. **Multi-currency economies are the norm, not the exception.** Two currencies (Subway Surfers) is the minimum. Five currencies (Merge Dragons) is common in mid-core games. The Economy vertical should be designed for N currencies from the start.

4. **Social features are a gap in the 9-vertical model.** Dens, friends, leaderboards, cooperative events -- these are significant features with no dedicated vertical. Consider whether Social should be a 10th vertical or whether social features should be distributed across LiveOps (cooperative events), UI (friend lists), and Analytics (social metrics).

5. **Discovery as a retention mechanic is powerful.** The "what's next in the chain?" question keeps players merging. The framework should support hidden content that reveals through gameplay, not just content that is visible from the start.

---

*Cross-references: [Mechanic Catalog](../Verticals/02_CoreMechanics/MechanicCatalog.md) | [Economy Balance Levers](../Verticals/04_Economy/BalanceLevers.md) | [Economy Segmentation](../Verticals/04_Economy/Segmentation.md) | [Shared Interfaces](../Verticals/00_SharedInterfaces.md)*
