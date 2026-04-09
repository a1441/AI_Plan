# Glossary

Master glossary for the AI Game Engine. Every term used across documentation must be defined here. Organized alphabetically.

> **For KPI/metric definitions, see [MetricsDictionary.md](MetricsDictionary.md).**

---

### Ad Mediation
**Definition:** A layer that manages multiple ad networks, selecting the highest-paying ad for each impression.
**Context:** Monetization vertical — the mediation layer sits between the game and ad networks (AdMob, ironSource, AppLovin).
**See also:** Interstitial, Rewarded Ad, Banner Ad.

### Ad Slot
**Definition:** A designated position in the UI or gameplay flow where an advertisement can be displayed.
**Context:** Monetization vertical — ad slots are defined in the shell (between screens) and in gameplay (between levels, on death).
**See also:** Slot, Interstitial, Rewarded Ad.

### Agent
**Definition:** A specialized AI system that owns one vertical end-to-end, with defined inputs, outputs, and boundaries.
**Context:** Pipeline — each of the 9 verticals is owned by one agent.
**See also:** Vertical, Pipeline, Handoff.
**Deep dive:** [Concepts_Agent.md](Concepts_Agent.md)

### Allocation
**Definition:** The distribution of user traffic across experiment variants, adjusted dynamically in multi-armed bandit mode.
**Context:** AB Testing vertical — traffic starts evenly split, then shifts toward winning variants.
**See also:** Multi-Armed Bandit, Variant, Experiment.

### Asset Library
**Definition:** A shared repository of art, audio, and animation assets tagged by category, style, and license for reuse across games.
**Context:** Asset vertical — assets from any sourcing channel enter the library.
**See also:** Sourcing Channel, Asset Manifest.

### Asset Manifest
**Definition:** A structured document listing all assets required or delivered for a game, with metadata (type, resolution, license, source).
**Context:** Asset vertical — the manifest is the handoff artifact from the Asset Agent.
**See also:** Asset Library, Sourcing Channel.

### Banner Ad
**Definition:** A persistent, small-format advertisement displayed at the screen edge (typically bottom).
**Context:** Monetization vertical — lowest revenue per impression, least intrusive.
**See also:** Interstitial, Rewarded Ad, Ad Slot.

### Basic Currency
**Definition:** The primary in-game currency earned through gameplay actions (completing levels, watching ads, daily login).
**Context:** Economy vertical — every game has exactly one basic currency.
**Example:** Coins, gold, gems (when earned freely).
**See also:** Premium Currency, Faucet, Sink.

### Churn
**Definition:** When a player stops playing the game entirely, defined as no session within a rolling window (typically 7-14 days).
**Context:** Analytics vertical — churn rate is a key health metric.
**See also:** Retention, Segment, Cohort.

### Cohort
**Definition:** A group of players who share a common characteristic, typically their install date (e.g., "players who installed on March 1").
**Context:** Analytics vertical — retention and monetization are always measured by cohort.
**See also:** Segment, Retention.

### Compliance
**Definition:** Adherence to legal and platform requirements: COPPA, GDPR, app store policies, regional ad regulations.
**Context:** Monetization vertical — compliance constraints override all other design decisions.
**See also:** Ethical Guardrail.

### Core Loop
**Definition:** The fundamental repeating cycle of gameplay: action → reward → progression → action.
**Context:** Core Mechanics vertical — the core loop defines what the player does every session.
**Example:** Runner: run → collect coins → upgrade → run further. Merge: merge items → unlock new items → merge higher.
**See also:** Mechanic, Session.

### Curve
**Definition:** The progression of a parameter over time or levels, represented as a sequence of values.
**Context:** Difficulty and Economy verticals — curves define how hard levels get and how much players earn.
**Example:** Difficulty curve: `[1, 2, 3, 4, 5, 4, 6, 7, 8, 7, 9, 10]` (sawtooth pattern).
**Deep dive:** [Concepts_Curve.md](Concepts_Curve.md)

### Daily Active Users (DAU)
**Definition:** See [MetricsDictionary.md](MetricsDictionary.md).

### Dark Pattern
**Definition:** A UI/UX design that manipulates users into unintended actions (fake urgency, hidden costs, guilt mechanics, confirm-shaming).
**Context:** Monetization vertical — dark patterns are explicitly banned by ethical guardrails.
**See also:** Ethical Guardrail, Compliance.

### Data Contract
**Definition:** A JSON schema defining the structure of data exchanged between agents at handoff points.
**Context:** Pipeline — data contracts ensure agents can process each other's output without ambiguity.
**See also:** Handoff, Pipeline, Agent.

### Difficulty Parameter
**Definition:** A numeric value that controls one aspect of a level's challenge (speed, enemy count, time limit, obstacle density).
**Context:** Difficulty vertical — each mechanic exposes its own set of adjustable difficulty parameters.
**See also:** Curve, Level.

### Energy System
**Definition:** A time-gate mechanic that limits play sessions by consuming a resource (energy, lives, hearts) that regenerates over time.
**Context:** Economy vertical — energy is a common sink and monetization hook (buy refills).
**See also:** Time-Gate, Sink, Faucet.

### Ethical Guardrail
**Definition:** A hard constraint on monetization design: no pay-to-win, no dark patterns, spending caps, transparent odds, age-appropriate content.
**Context:** Monetization vertical — guardrails are enforced constraints, not suggestions.
**See also:** Compliance, Dark Pattern.

### Event (Analytics)
**Definition:** A discrete telemetry data point sent from the game to the analytics service (e.g., `level_complete`, `purchase_made`, `ad_watched`).
**Context:** Analytics vertical — events are the raw data that feeds KPIs and funnels.
**See also:** Event Taxonomy, Funnel.

### Event (LiveOps)
**Definition:** A time-limited content drop: seasonal challenge, special mini-game, limited-time offer, or themed content.
**Context:** LiveOps vertical — events drop into predefined slots in the game.
**See also:** LiveOps, Event Slot, Mini-Game.

### Event Slot
**Definition:** A predefined position in the game where LiveOps content can be inserted without code changes.
**Context:** LiveOps vertical — the game's UI and flow have designated slots for event content.
**See also:** Slot, Event (LiveOps).

### Event Taxonomy
**Definition:** The structured catalog of all analytics events the game can fire, with their payload schemas.
**Context:** Analytics vertical — the taxonomy defines what can be measured.
**See also:** Event (Analytics), Data Contract.

### Experiment
**Definition:** An AB test instance: a hypothesis, control group, one or more variants, traffic allocation, and success criteria.
**Context:** AB Testing vertical — experiments are the unit of optimization.
**See also:** Hypothesis, Variant, Allocation.

### Faucet
**Definition:** Any mechanism that puts currency into the player's wallet: level rewards, daily login, ad watching, event prizes.
**Context:** Economy vertical — total faucet output must be carefully balanced against sinks.
**Deep dive:** [Concepts_Faucet_Sink.md](Concepts_Faucet_Sink.md)

### FTUE (First-Time User Experience)
**Definition:** The onboarding flow a new player experiences: tutorial, progressive disclosure of features, gated content unlocks.
**Context:** UI vertical — FTUE is the #1 lever for D1 retention.
**Deep dive:** [Concepts_Onboarding.md](Concepts_Onboarding.md)

### Funnel
**Definition:** A sequence of analytics events representing a desired player path, measured by conversion rate at each step.
**Context:** Analytics vertical — funnels identify where players drop off.
**Example:** Install → Tutorial Complete → First Level → First Purchase.
**See also:** Event (Analytics), KPI.

### Game Specification (GameSpec)
**Definition:** The input document that describes the game to be created: genre, mechanic type, theme, target audience, monetization tier, reference games.
**Context:** Pipeline — the GameSpec is the entry point to the agent pipeline.
**See also:** Pipeline, Template.

### Handoff
**Definition:** The point where one agent's output becomes another agent's input, governed by a data contract.
**Context:** Pipeline — handoffs are the seams between verticals.
**See also:** Data Contract, Agent, Pipeline.

### Hypothesis
**Definition:** An AB test's proposed change: "If we change X from A to B, metric Y will improve by Z%."
**Context:** AB Testing vertical — every experiment starts with a hypothesis.
**Deep dive:** [Concepts_Hypothesis.md](Concepts_Hypothesis.md)

### IAP (In-App Purchase)
**Definition:** A real-money transaction within the game, processed through the app store's payment system.
**Context:** Monetization vertical — IAP items live in the shop and can be triggered contextually.
**See also:** Premium Currency, Shop.

### Interstitial
**Definition:** A full-screen advertisement displayed at natural break points (between levels, on menu transitions).
**Context:** Monetization vertical — higher revenue than banners, but more intrusive. Frequency-capped.
**See also:** Rewarded Ad, Banner Ad, Ad Slot.

### Level
**Definition:** A discrete unit of gameplay with defined start/end conditions, difficulty parameters, and reward tier.
**Context:** Difficulty vertical — levels are generated with parameters from a difficulty curve.
**See also:** Difficulty Parameter, Curve.

### LiveOps
**Definition:** Post-launch operations: time-limited events, seasonal content, special offers, mini-games, and content refreshes.
**Context:** LiveOps vertical — LiveOps is what keeps the game alive after initial install.
**Deep dive:** [Concepts_LiveOps.md](Concepts_LiveOps.md)

### Mechanic
**Definition:** The core gameplay module that slots into the shell: a runner, merge game, PVP arena, puzzle, etc.
**Context:** Core Mechanics vertical — each mechanic implements the same slot interface but delivers different gameplay.
**See also:** Slot, Shell, Core Loop.

### Mini-Game
**Definition:** A secondary gameplay experience, simpler than the core mechanic, used in LiveOps events or as daily challenges.
**Context:** LiveOps vertical — mini-games drop into event slots.
**See also:** Event (LiveOps), Event Slot.

### Multi-Armed Bandit
**Definition:** An optimization algorithm that dynamically shifts traffic allocation toward better-performing experiment variants, balancing exploration and exploitation.
**Context:** AB Testing vertical — used instead of fixed-split AB tests when faster convergence is needed.
**See also:** Allocation, Experiment, Variant.

### Pass (Battle Pass / Season Pass)
**Definition:** A progression track with free and premium tiers, offering rewards for completing objectives over a time period (typically a season).
**Context:** Economy + Monetization verticals — passes are both a sink (premium tier purchase) and a faucet (rewards).
**See also:** Time-Gate, Faucet, Sink.

### Pipeline
**Definition:** The end-to-end sequence of agent processing stages that transforms a GameSpec into a complete game.
**Context:** Architecture — the pipeline is the master orchestration layer.
**See also:** Agent, Handoff, Quality Gate.

### Premium Currency
**Definition:** A secondary in-game currency primarily acquired through real-money IAP, used for high-value purchases and time-skip.
**Context:** Economy vertical — every game has exactly one premium currency.
**Example:** Diamonds, crystals, premium gems.
**See also:** Basic Currency, IAP.

### Quality Gate
**Definition:** A validation checkpoint between pipeline stages that verifies an agent's output meets defined criteria before downstream agents proceed.
**Context:** Pipeline — gates prevent garbage-in-garbage-out cascading.
**See also:** Pipeline, Data Contract.

### Retention
**Definition:** The percentage of a cohort that returns to the game on a given day after install (D1, D7, D30, D90).
**Context:** Analytics vertical — retention is the master health metric. See [MetricsDictionary.md](MetricsDictionary.md) for precise formulas.
**See also:** Cohort, Churn, DAU.

### Rewarded Ad
**Definition:** A voluntary full-screen advertisement the player opts into in exchange for an in-game reward (extra lives, currency, time-skip).
**Context:** Monetization vertical — highest revenue per impression, player-positive. The "good" ad format.
**See also:** Interstitial, Banner Ad, Ad Slot.

### Segment
**Definition:** A behavioral player group defined by spending, engagement, or lifecycle stage: whale, dolphin, minnow, casual, new, returning, churned.
**Context:** Economy + Analytics verticals — segments receive different economy parameters, ad loads, and offers.
**Deep dive:** [Concepts_Segmentation.md](Concepts_Segmentation.md)

### Session
**Definition:** A single continuous play period, from app open to app close/background.
**Context:** Analytics vertical — session length and frequency are key engagement metrics.
**See also:** Core Loop, Energy System.

### Shell
**Definition:** The standardized UI frame that wraps every game: loading screen, main menu, currency bar, navigation, shop, settings.
**Context:** UI vertical — the shell is built once and themed per game.
**Deep dive:** [Concepts_Shell.md](Concepts_Shell.md)

### Shop
**Definition:** The in-game store where players spend basic or premium currency on items, upgrades, cosmetics, or IAP bundles.
**Context:** UI + Monetization verticals — the shop is a shell screen with monetization content.
**See also:** IAP, Sink, Premium Currency.

### Sink
**Definition:** Any mechanism that removes currency from the player's wallet: shop purchases, upgrades, energy refills, cosmetics.
**Context:** Economy vertical — sinks prevent inflation and create purchase motivation.
**Deep dive:** [Concepts_Faucet_Sink.md](Concepts_Faucet_Sink.md)

### Slot
**Definition:** An interface boundary where a module plugs into the framework: mechanic slot (gameplay in shell), event slot (LiveOps content), ad slot (monetization placement).
**Context:** Architecture — slots are the core composition mechanism.
**Deep dive:** [Concepts_Slot.md](Concepts_Slot.md)

### Sourcing Channel
**Definition:** One of three methods for acquiring assets: AI-generated, purchased from marketplaces, or commissioned from artists.
**Context:** Asset vertical — each channel has different cost, speed, and quality tradeoffs.
**See also:** Asset Library, Asset Manifest.

### Template
**Definition:** A fill-in-the-blank document format for defining a specific artifact (game spec, level, economy table, AB test, etc.).
**Context:** Pipeline — templates standardize how agents and humans define artifacts.
**See also:** GameSpec, Data Contract.

### Theme
**Definition:** The visual and tonal identity of a specific game: color palette, art style, iconography, fonts, sound design.
**Context:** UI + Asset verticals — the theme is applied to the shell and all visual elements.
**See also:** Shell, Asset Library.

### Time-Gate
**Definition:** A mechanic that limits access to content or resources based on real-world time (energy regeneration, cooldowns, daily limits).
**Context:** Economy vertical — time-gates create monetization opportunities (pay to skip) and session pacing.
**See also:** Energy System, Pass, Sink.

### Variant
**Definition:** One configuration of an AB test parameter. The control is variant A; alternatives are variants B, C, etc.
**Context:** AB Testing vertical — each variant represents a different value for the parameter being tested.
**See also:** Experiment, Hypothesis, Allocation.

### Vertical
**Definition:** A domain of responsibility owned by one AI agent, with defined scope, inputs, and outputs.
**Context:** Architecture — the 9 verticals are: UI, Core Mechanics, Monetization, Economy, Difficulty, LiveOps, AB Testing, Analytics, Assets.
**Deep dive:** [Concepts_Vertical.md](Concepts_Vertical.md)

### Whale
**Definition:** A player segment characterized by high spending (top 1-5% of revenue contributors).
**Context:** Economy + Monetization verticals — whale-targeted offers are high-value, low-frequency.
**See also:** Segment, Dolphin, Minnow.

### Dolphin
**Definition:** A player segment characterized by moderate spending (top 5-20% of revenue contributors).
**Context:** Economy + Monetization verticals — dolphin-targeted offers balance value and frequency.
**See also:** Segment, Whale, Minnow.

### Minnow
**Definition:** A player segment characterized by low spending (occasional small purchases or purely ad-supported).
**Context:** Economy + Monetization verticals — minnow monetization relies on ad revenue and conversion to dolphin.
**See also:** Segment, Whale, Dolphin.

---

## Related Documents

- [Metrics Dictionary](MetricsDictionary.md) — 50+ KPI definitions with formulas
- [All Concept Deep Dives](.) — Concepts_*.md files in this folder
- [Shared Interfaces](../Verticals/00_SharedInterfaces.md) — Cross-vertical contracts
