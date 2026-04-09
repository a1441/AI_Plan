# AI Game Engine — Project Plan

## Context

We're building an AI-powered mobile game creation pipeline. The vision: AI agents collaborate to generate complete mobile games from scratch — UI, gameplay, monetization, economy, difficulty, LiveOps, and AB testing. Each domain is a "vertical" owned by a specialized agent. Games are composed by slotting a core mechanic (runner, merge, PVP, puzzle, etc.) into a standardized UI shell.

## Strategic Direction (2026-04-09)

Two business cases under consideration:

**Case 1 — Games Company:** Ship many games fast using AI. Value = portfolio + team expertise in post-launch operations (economy tuning, AB testing, LiveOps). Risk: nothing proprietary to sell; acquirer buys people, not IP. Founders locked into contracts.

**Case 2 — AI Product Company:** Build a proprietary tool that automates game creation AND post-launch management. Market gap: plenty of AI build tools exist, but nothing handles the full lifecycle (analytics setup, economy management, AB testing, LiveOps) with awareness of your product and code. This is a sellable product.

**Key insight (from Denzil):** Templates and frameworks are commodities ($10 on an asset store). An automated builder with vibe coding, AI-driven economy management, auto-integrated auxiliary systems, and selectable templates — that's a product.

**Decision:** Both cases share ~80% of the work. Build the tool for internal use (Case 1) while architecting it for external use (Case 2). The delta is polish, onboarding UX, and multi-tenancy. The 85-file documentation scaffold becomes the product spec for Case 2.

---

## Phase 1: Documentation Scaffold (COMPLETE)

**Starting state:** Empty project at `D:\Claude\AI_Engine\` with only a `Plans/` folder.
**End state:** 85 files, all Final. Complete semantic layer, architecture, vertical specs, pipeline docs, templates, reference games, and graphs.

---

## Phase 2: Interactive Pitch Page

### Context

We need a front-facing interactive page to explain the AI Game Engine to management and board members. The goal is to communicate: what it does, how it works (9 AI agents, shell+slot architecture), why it's valuable (market gap — nothing does build + manage end-to-end), and how it applies across game genres.

This is NOT a technical doc — it's a visual, interactive pitch that makes the concept click in 2 minutes.

### Design Direction

- **Style:** Light theme, startup aesthetic (clean whites, subtle gradients, generous whitespace, modern sans-serif)
- **Interactivity:** Core differentiator — click/hover to explore, animated transitions, genre switcher
- **Audience:** Management/board — business-literate but not necessarily technical
- **Hosting:** GitHub Pages (static HTML/CSS/JS, no build step)
- **Tech:** Single `index.html` or minimal files, Tailwind CDN, vanilla JS, no framework

### Page Structure (scroll-down flow)

#### Section 1: Hero
- Bold headline: "AI Game Engine" + one-line value prop
- Animated phone mockup showing a game being "assembled" from pieces
- CTA: "See How It Works" (smooth scroll)

#### Section 2: The Problem
- 3 pain points with icons:
  1. Building a mobile game takes months
  2. Most studios can build but can't optimize post-launch
  3. AI tools exist for pieces, but nothing does end-to-end
- Short, punchy copy. No paragraphs.

#### Section 3: The Solution — Deconstructed Game View (HERO SECTION)
- **Central interactive visual:** A mobile phone frame with a game inside
- The game "explodes" into its 9 components (UI shell, mechanics, economy, monetization, difficulty, LiveOps, AB testing, analytics, assets)
- Each component is a clickable card/piece that floats around the phone
- Clicking a piece:
  - Highlights it
  - Shows a panel with: what it is, what the AI agent does, example output
  - Shows how it connects to other pieces (dependency lines animate)
- The pieces are color-coded by pipeline layer:
  - Layer 1 (Foundation): blue — UI, Mechanics, Assets
  - Layer 2 (Balance): green — Economy, Difficulty
  - Layer 3 (Revenue): orange — Monetization, LiveOps
  - Layer 4 (Optimization): purple — Analytics, AB Testing

#### Section 4: Genre Showcase
- **Interactive genre switcher** — tabs or cards for 4-5 genres:
  - 2D Puzzle (e.g., match-3)
  - Casino/Slots
  - 3D RPG
  - Narrative/Story
  - Endless Runner
- Each genre shows:
  - A themed phone mockup (different visual style per genre)
  - How the shell stays the same but the mechanic slot changes
  - 2-3 bullet points on genre-specific AI decisions (e.g., "Economy agent tunes gacha rates for casino" vs. "Difficulty agent generates level layouts for puzzle")
- Visually demonstrates the shell+slot concept — same frame, different game inside

#### Section 5: The Pipeline
- Animated horizontal timeline showing the 6 phases
- Each phase shows which agents run (with small icons)
- Estimated time annotation: "GameSpec → Complete Game in ~5 minutes"
- Optional: animated data flow showing artifacts passing between agents

#### Section 6: The Market Gap
- Simple 2x2 or comparison visual:
  - "AI Build Tools" (many) vs. "AI Manage Tools" (few) vs. "End-to-End" (us)
  - Or: feature matrix showing competitors vs. us
- Emphasizes: nobody does build + analytics + economy + AB testing + LiveOps in one system

#### Section 7: Team & Next Steps
- Brief team credibility (industry knowledge, AI-native, post-launch ops)
- Roadmap: 3 milestones (Documentation ✓ → Prototype → Product)
- Contact/CTA

### File Structure

```
D:\Claude\AI_Engine\Pitch\
├── index.html          # Main page (single file, all sections)
├── styles.css          # Custom styles (Tailwind for utilities, custom for animations)
├── app.js              # Interactions: genre switcher, deconstructed view, animations
└── assets/
    └── (SVG icons for the 9 verticals, phone frame, genre illustrations)
```

### Key Interactions to Build

| Interaction | Description |
|-------------|-------------|
| **Exploded view** | Phone game splits into 9 floating pieces on scroll/click |
| **Piece inspector** | Click a piece → slide-in panel with details + dependency lines |
| **Genre switcher** | Click genre tab → phone mockup and mechanic slot swap with transition |
| **Pipeline animation** | Scroll-triggered timeline that animates left-to-right |
| **Dependency lines** | SVG paths connecting related pieces, animate on hover |

### Visual References

- Light background (#ffffff, #f8f9fa)
- Accent colors: teal/blue primary, warm orange secondary, purple for AI/optimization
- Large type for headlines (48-64px), clean body text (16-18px)
- Rounded cards with subtle shadows
- Smooth scroll-triggered animations (IntersectionObserver)
- Phone mockup as recurring visual anchor

### Implementation Order

1. HTML structure with all 7 sections (static content first)
2. Tailwind + custom CSS (layout, typography, colors, cards)
3. Deconstructed game view (the hero interaction — most complex)
4. Genre switcher
5. Pipeline timeline animation
6. Polish: scroll animations, transitions, responsive

### Verification

- [ ] Page loads on GitHub Pages (no build step, all CDN)
- [ ] All 7 sections render correctly
- [ ] Deconstructed view is interactive (click pieces, see details)
- [ ] Genre switcher swaps content smoothly
- [ ] Pipeline timeline animates on scroll
- [ ] Responsive on mobile (board members may view on phone)
- [ ] No technical jargon without explanation
- [ ] A non-technical person can understand the pitch in under 2 minutes

---

## Folder Structure

```
D:\Claude\AI_Engine\
├── CLAUDE.md                              # AI agent instructions for this project
├── Plans/                                 # Implementation plans (exists)
│
├── Docs/
│   ├── 00_Index.md                        # Master index with reading order
│   ├── 01_Vision.md                       # Project vision, goals, constraints
│   │
│   ├── Architecture/
│   │   ├── SystemOverview.md              # High-level system diagram (Mermaid)
│   │   ├── ModuleRelationships.md         # Module dependency graph (Mermaid)
│   │   ├── DataFlow.md                    # Data flow between pipeline stages (Mermaid)
│   │   ├── AgentOrchestration.md          # How agents coordinate (Mermaid swimlanes)
│   │   ├── SlotArchitecture.md            # Shell + Mechanic composition (Mermaid)
│   │   ├── EventModel.md                  # Event-driven communication
│   │   ├── PerformanceBudgets.md          # Mobile constraints: FPS, memory, battery, network
│   │   └── GameState.md                   # Save/load, cloud sync, offline, session recovery
│   │
│   ├── SemanticDictionary/
│   │   ├── Glossary.md                    # Master glossary A-Z (80+ terms)
│   │   ├── MetricsDictionary.md           # 50+ mobile gaming KPIs defined precisely
│   │   ├── Concepts_Slot.md              # Deep dive: slotting system
│   │   ├── Concepts_Curve.md             # Deep dive: difficulty/economy curves
│   │   ├── Concepts_Faucet_Sink.md       # Deep dive: economy flows
│   │   ├── Concepts_Shell.md             # Deep dive: UI shell
│   │   ├── Concepts_Vertical.md          # Deep dive: agent domains
│   │   ├── Concepts_Agent.md             # Deep dive: AI agent model
│   │   ├── Concepts_LiveOps.md           # Deep dive: live operations
│   │   ├── Concepts_Hypothesis.md        # Deep dive: AB test lifecycle
│   │   ├── Concepts_Segmentation.md      # Deep dive: player segments & cohorts
│   │   └── Concepts_Onboarding.md        # Deep dive: FTUE & progressive disclosure
│   │
│   ├── Verticals/
│   │   ├── 00_SharedInterfaces.md         # Cross-vertical interface contracts (written FIRST)
│   │   │
│   │   ├── 01_UI/
│   │   │   ├── Spec.md                    # UI shell specification
│   │   │   ├── Interfaces.md             # Shell API, theming, nav graph
│   │   │   ├── DataModels.md             # Screen defs, theme schema
│   │   │   ├── AgentResponsibilities.md  # UI agent scope
│   │   │   └── Onboarding.md             # FTUE flow, tutorial, progressive disclosure
│   │   │
│   │   ├── 02_CoreMechanics/
│   │   │   ├── Spec.md                    # Mechanics vertical spec
│   │   │   ├── Interfaces.md             # IMechanic interface, slot contract
│   │   │   ├── DataModels.md             # Mechanic config schemas
│   │   │   ├── AgentResponsibilities.md  # Mechanics agent scope
│   │   │   └── MechanicCatalog.md        # 10+ mechanic types detailed
│   │   │
│   │   ├── 03_Monetization/
│   │   │   ├── Spec.md                    # Monetization vertical spec
│   │   │   ├── Interfaces.md             # Ad placement API, IAP hooks
│   │   │   ├── DataModels.md             # Ad config, IAP catalog, placements
│   │   │   ├── AgentResponsibilities.md  # Monetization agent scope
│   │   │   ├── EthicalGuardrails.md      # Hard rules, spending limits, dark pattern bans
│   │   │   └── Compliance.md             # COPPA, GDPR, age ratings, regional ad regs
│   │   │
│   │   ├── 04_Economy/
│   │   │   ├── Spec.md                    # Economy vertical spec
│   │   │   ├── Interfaces.md             # Currency API, reward hooks
│   │   │   ├── DataModels.md             # Currency types, earn/spend tables
│   │   │   ├── AgentResponsibilities.md  # Economy agent scope
│   │   │   ├── BalanceLevers.md          # Tunable params with ranges
│   │   │   └── Segmentation.md           # Per-segment economy behavior (whale/casual/new/churned)
│   │   │
│   │   ├── 05_Difficulty/
│   │   │   ├── Spec.md                    # Difficulty & level gen spec
│   │   │   ├── Interfaces.md             # Level generator API, curve contracts
│   │   │   ├── DataModels.md             # Level params, difficulty schema
│   │   │   ├── AgentResponsibilities.md  # Difficulty agent scope
│   │   │   └── CurveTemplates.md         # Standard curve shapes with data
│   │   │
│   │   ├── 06_LiveOps/
│   │   │   ├── Spec.md                    # LiveOps vertical spec
│   │   │   ├── Interfaces.md             # Event slot API, content drops
│   │   │   ├── DataModels.md             # Event schema, schedules
│   │   │   └── AgentResponsibilities.md  # LiveOps agent scope
│   │   │
│   │   ├── 07_ABTesting/
│   │   │   ├── Spec.md                    # AB Testing vertical spec
│   │   │   ├── Interfaces.md             # Experiment API, allocation hooks
│   │   │   ├── DataModels.md             # Experiment schema, variants
│   │   │   ├── AgentResponsibilities.md  # AB testing agent scope
│   │   │   └── FeedbackLoop.md           # Test-Analyze-Allocate-Iterate cycle
│   │   │
│   │   ├── 08_Analytics/
│   │   │   ├── Spec.md                    # Analytics & telemetry vertical spec
│   │   │   ├── Interfaces.md             # Event tracking API, funnel hooks
│   │   │   ├── DataModels.md             # Event taxonomy, payload schemas
│   │   │   ├── AgentResponsibilities.md  # Analytics agent scope
│   │   │   └── KPIDashboards.md          # Dashboard definitions, alert thresholds
│   │   │
│   │   └── 09_Assets/
│   │       ├── Spec.md                    # Asset pipeline specification
│   │       ├── Interfaces.md             # Asset request/delivery API
│   │       ├── DataModels.md             # Asset manifest, metadata schema
│   │       ├── AgentResponsibilities.md  # Asset agent scope
│   │       ├── SourcingStrategy.md       # AI-generated vs purchased vs artist-made
│   │       └── AssetLibrary.md           # Collateral library: structure, tagging, reuse
│   │
│   ├── Pipeline/
│   │   ├── GameCreationPipeline.md       # End-to-end: prompt → game
│   │   ├── AgentHandoffs.md             # Handoff artifacts between agents
│   │   ├── QualityGates.md              # Pass criteria per stage
│   │   ├── DataContracts.md             # JSON schemas for agent I/O
│   │   └── ErrorRecovery.md             # Retry, fallback, escalation
│   │
│   ├── Graphs/
│   │   ├── ModuleDependencyGraph.md     # Mermaid: vertical dependencies
│   │   ├── AgentOrchestrationGraph.md   # Mermaid: agent swimlanes
│   │   ├── DataFlowGraph.md             # Mermaid: data through pipeline
│   │   ├── EconomyFlowGraph.md          # Mermaid: faucets/sinks/loops
│   │   ├── ABTestingFlowGraph.md        # Mermaid: hypothesis to optimization
│   │   ├── SlotCompositionGraph.md      # Mermaid: shell + mechanic visual
│   │   └── PlayerJourneyGraph.md        # Mermaid: FTUE → core loop → retention → monetization
│   │
│   ├── Templates/
│   │   ├── GameSpec_Template.md          # New game definition format
│   │   ├── LevelDefinition_Template.md   # Level definition format
│   │   ├── EconomyTable_Template.md      # Economy parameter format
│   │   ├── ABTestDefinition_Template.md  # Experiment format
│   │   ├── EventDefinition_Template.md   # LiveOps event format
│   │   ├── MechanicModule_Template.md    # New mechanic format
│   │   ├── AdPlacement_Template.md       # Ad placement rules format
│   │   └── AssetRequest_Template.md      # Asset sourcing request format
│   │
│   └── ReferenceGames/
│       ├── README.md                      # How to read these mappings
│       ├── SubwaySurfers.md              # Runner mapped to our framework
│       ├── MergeDragons.md               # Merge game mapped to our framework
│       └── CoinMaster.md                 # Casual/social mapped to our framework
```

**Total: ~85 files** across 9 verticals + supporting layers.

---

## What Changed from v1

| Addition | Why |
|----------|-----|
| **08_Analytics vertical** (5 files) | AB testing has nothing to measure without telemetry. KPIs, event taxonomy, funnels, dashboards. |
| **09_Assets vertical** (6 files) | Art/audio/animation pipeline: AI-generated, purchased, or artist-made. Includes collateral library for reuse across games. |
| **MetricsDictionary.md** | 50+ mobile KPIs (DAU, D1/D7/D30, ARPU, LTV, CPI, etc.) defined precisely. Separate from domain Glossary. |
| **Concepts_Segmentation.md** | Player segments (whale/casual/new/churned) that drive economy, ads, difficulty, LiveOps behavior. |
| **Concepts_Onboarding.md** | FTUE is the #1 retention lever. Tutorial flow, progressive disclosure, gating. |
| **01_UI/Onboarding.md** | Concrete FTUE spec: what screens, what order, what's gated. |
| **04_Economy/Segmentation.md** | Per-segment economy behavior — whales see different offers than casuals. |
| **03_Monetization/Compliance.md** | COPPA, GDPR, age ratings, Belgium loot box ban, regional ad regulations. |
| **Architecture/PerformanceBudgets.md** | Mobile constraints (30/60fps, memory caps, battery, network) that constrain all verticals. |
| **Architecture/GameState.md** | Save/load, cloud sync, offline support, session recovery. |
| **00_SharedInterfaces.md** | Written BEFORE vertical specs — coordinates Economy ↔ Difficulty ↔ Monetization interfaces. Prevents parallel agents from diverging. |
| **ReferenceGames/** (4 files) | Real games mapped to our framework. Validates architecture against reality. |
| **PlayerJourneyGraph.md** | Mermaid: FTUE → core loop → retention → monetization. The master player flow. |
| **AssetRequest_Template.md** | Standard format for requesting assets (AI/purchased/artist). |
| **Glossary expanded to 80+** | Mobile gaming has far more than 35 terms. |
| **00_Index.md gets "How to Read This"** | Reading order for new agents/humans joining the project. |

---

## Implementation Phases

### Phase 1: Foundation (5 files)
Project identity, shared vocabulary, and the big picture. Everything else references these.

| # | File | Purpose |
|---|------|---------|
| 1 | `CLAUDE.md` | Agent instructions, project identity, conventions |
| 2 | `Docs/01_Vision.md` | Problem, target output, design principles, non-goals |
| 3 | `Docs/SemanticDictionary/Glossary.md` | 80+ terms defined (A-Z) |
| 4 | `Docs/SemanticDictionary/MetricsDictionary.md` | 50+ mobile gaming KPIs |
| 5 | `Docs/Architecture/SystemOverview.md` | Big picture Mermaid diagram |

### Phase 2: Semantic Layer (12 files)
Deep-dive concept docs + core architectural concepts.

| # | File | Purpose |
|---|------|---------|
| 1 | `Architecture/SlotArchitecture.md` | Shell + Mechanic composition |
| 2 | `Architecture/PerformanceBudgets.md` | Mobile constraints |
| 3 | `Architecture/GameState.md` | Save/load/sync |
| 4-13 | `SemanticDictionary/Concepts_*.md` (10 files) | Deep dives on each core concept |

### Phase 2.5: Shared Interfaces (1 file, CRITICAL)
Written BEFORE vertical specs to coordinate cross-vertical contracts. Prevents parallel agents from diverging on Economy ↔ Difficulty ↔ Monetization ↔ Analytics interfaces.

| # | File | Purpose |
|---|------|---------|
| 1 | `Verticals/00_SharedInterfaces.md` | Cross-vertical interface contracts |

### Phase 3: Vertical Specs (42 files, parallelizable)
Each vertical gets 4-6 files. Written in parallel — one agent per vertical, all referencing SharedInterfaces.

| Vertical | Files |
|----------|-------|
| 01_UI | Spec, Interfaces, DataModels, AgentResponsibilities, Onboarding |
| 02_CoreMechanics | Spec, Interfaces, DataModels, AgentResponsibilities, MechanicCatalog |
| 03_Monetization | Spec, Interfaces, DataModels, AgentResponsibilities, EthicalGuardrails, Compliance |
| 04_Economy | Spec, Interfaces, DataModels, AgentResponsibilities, BalanceLevers, Segmentation |
| 05_Difficulty | Spec, Interfaces, DataModels, AgentResponsibilities, CurveTemplates |
| 06_LiveOps | Spec, Interfaces, DataModels, AgentResponsibilities |
| 07_ABTesting | Spec, Interfaces, DataModels, AgentResponsibilities, FeedbackLoop |
| 08_Analytics | Spec, Interfaces, DataModels, AgentResponsibilities, KPIDashboards |
| 09_Assets | Spec, Interfaces, DataModels, AgentResponsibilities, SourcingStrategy, AssetLibrary |

### Phase 4: Integration Layer (10 files)
Pipeline docs + remaining architecture. Requires vertical specs.

| # | Files | Purpose |
|---|-------|---------|
| 1-5 | `Pipeline/*.md` (5 files) | Agent handoffs, quality gates, contracts, error recovery |
| 6-8 | `Architecture/` remaining (3 files) | Module relationships, data flow, event model |
| 9 | `Architecture/AgentOrchestration.md` | Agent coordination patterns |
| 10 | Cross-reference pass | Link all docs together |

### Phase 5: Reference Games (4 files)
Real games mapped to our framework. Validates architecture.

| # | File | Purpose |
|---|------|---------|
| 1 | `ReferenceGames/README.md` | How to read these mappings |
| 2 | `ReferenceGames/SubwaySurfers.md` | Runner archetype |
| 3 | `ReferenceGames/MergeDragons.md` | Merge archetype |
| 4 | `ReferenceGames/CoinMaster.md` | Casual/social archetype |

### Phase 6: Templates & Index (9 files)
Fill-in-the-blank templates + master index. Done late since they're informed by all specs.

| # | Files | Purpose |
|---|-------|---------|
| 1-8 | `Templates/*.md` (8 files) | Standard formats for all artifact types |
| 9 | `Docs/00_Index.md` | Master TOC with "How to Read This" reading order |

### Phase 7: Graphs (7 files)
Visual Mermaid diagrams summarizing the architecture.

| # | File | Purpose |
|---|------|---------|
| 1-7 | `Graphs/*.md` (7 files) | Module deps, agent flow, data flow, economy, AB, slot composition, player journey |

### Phase 8: Memory & Context
- Save project memory to `C:\Users\admin\.claude\projects\D--Claude-AI_Engine\memory\`
- Add AI_Engine to context routing

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **~85 small files** (200-400 lines each) | Digestible per agent context pass. Same pattern as DarkStory GDD. |
| **SharedInterfaces.md before vertical specs** | Prevents parallel agents from diverging on cross-vertical contracts. |
| **9 verticals** (not 7) | Analytics and Assets are load-bearing — can't ship games without them. |
| **TypeScript-style pseudocode** for interfaces | Widely understood by AI, type-expressive, language-agnostic. |
| **JSON schemas** for data models | Lingua franca, validatable, works with any runtime. |
| **Mermaid** for all diagrams | Text-based, version-controllable, AI can generate and parse. |
| **Separate SemanticDictionary** | Eliminates ambiguity in multi-agent systems. The "Rosetta Stone." |
| **Separate MetricsDictionary** | KPIs need precise mathematical definitions, not just glossary entries. |
| **Reference games** | Validates architecture against reality — if Subway Surfers can't map to our framework, the framework is wrong. |
| **Asset sourcing: AI + purchased + artist** | Three channels, eventually building a reusable collateral library across games. |
| **Templates last** | Informed by all specs — can't template what isn't defined yet. |

---

## Execution Strategy

**Phase 1-2.5:** Sequential. Foundation must exist before anything references it. ~18 files.

**Phase 3:** Parallel — 9 agents, one per vertical, each writing 4-6 files. All reference SharedInterfaces.md and the foundation docs. ~42 files.

**Phase 4-7:** Semi-parallel — pipeline, reference games, templates, and graphs can overlap. ~30 files.

**Estimated total:** ~85 files, ~18,000-22,000 lines of documentation.

---

## Current Status (2026-04-09)

**84 of 85 files complete.** Phases 1–7 are done except for one file.

### Remaining Work

| # | Task | Details |
|---|------|---------|
| 1 | **Create `Pipeline/ErrorRecovery.md`** | The only missing file. Retry, fallback, escalation strategies. Referenced by AgentOrchestration.md, DataContracts.md, QualityGates.md, and 00_Index.md. |
| 2 | **Update `00_Index.md` status markers** | Many entries still say "Planned" or "In Progress" — should be "Final" now that files exist. |
| 3 | **Cross-reference pass** | Verify all inter-doc links are valid and ErrorRecovery.md is properly linked from related docs. |

### Verification

After each phase:
- [x] All files exist at specified paths (84/85 — ErrorRecovery.md remaining)
- [ ] Cross-references between files are valid (no broken links)
- [x] Mermaid diagrams render correctly
- [x] No term used without Glossary or MetricsDictionary definition
- [x] Each vertical spec covers: purpose, inputs, outputs, dependencies, constraints
- [x] SharedInterfaces contracts are consistent across all vertical Interfaces.md files
- [x] Reference games successfully map to all 9 verticals
- [x] Templates are fillable (no ambiguous placeholders)
- [x] CLAUDE.md accurately reflects the project state
- [x] 00_Index.md has a clear reading order for new participants
