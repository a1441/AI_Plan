# AI Game Engine

An AI-powered pipeline that creates complete mobile games from scratch. Specialized AI agents collaborate across 9 verticals to generate, balance, test, and optimize every aspect of a game — from UI shell to monetization to LiveOps.

## Project Identity

| Field | Value |
|-------|-------|
| **Name** | AI Game Engine |
| **Type** | Documentation-first AI pipeline architecture |
| **Path** | `D:\Claude\AI_Engine` |
| **Phase** | Semantic layer & architecture documentation |
| **Stack** | Markdown, Mermaid, JSON Schema (no code yet) |

## Core Concept: Shell + Slot

Every game is composed of two layers:

1. **Shell** — Standardized UI frame: loading screen, main menu, currency bar, shop, navigation, settings. Themed per game but structurally identical.
2. **Mechanic Slot** — Modular gameplay that plugs into the shell. A runner, merge game, PVP arena, or puzzle each implement the same interface but deliver different experiences.

This separation means: build the shell once, slot in 10+ different game types.

## The 9 Verticals

Each vertical is owned by a specialized AI agent with defined inputs, outputs, and boundaries.

| # | Vertical | Owns | Agent Responsibility |
|---|----------|------|---------------------|
| 01 | **UI** | Shell, navigation, theming, FTUE | Generate the game's visual frame and onboarding flow |
| 02 | **Core Mechanics** | Gameplay logic, input handling, scoring | Generate the slottable game mechanic |
| 03 | **Monetization** | IAP, ads, placements, compliance | Place revenue touchpoints ethically |
| 04 | **Economy** | Currencies, rewards, time-gates, sinks | Balance earning/spending for engagement + revenue |
| 05 | **Difficulty** | Level generation, curves, parameters | Create levels with AI-driven difficulty progression |
| 06 | **LiveOps** | Events, mini-games, seasonal content | Generate time-limited content that drops into slots |
| 07 | **AB Testing** | Experiments, analysis, allocation | Test everything, optimize via multi-armed bandits |
| 08 | **Analytics** | Telemetry, KPIs, funnels, dashboards | Track what matters, feed data to other verticals |
| 09 | **Assets** | Art, audio, animation, collateral library | Source via AI generation, purchase, or artist commission |

## Documentation Structure

```
Docs/
├── 00_Index.md              — Master index with reading order
├── 01_Vision.md             — Project vision, goals, constraints
├── Architecture/            — System diagrams, data flow, slot architecture
├── SemanticDictionary/      — Glossary (80+ terms), Metrics (50+ KPIs), concept deep dives
├── Verticals/               — Per-vertical specs, interfaces, data models, agent responsibilities
│   └── 00_SharedInterfaces.md — Cross-vertical contracts (the coordination layer)
├── Pipeline/                — End-to-end game creation flow, handoffs, quality gates
├── Graphs/                  — Mermaid visualizations of all architecture
├── Templates/               — Fill-in-the-blank formats for all artifact types
└── ReferenceGames/          — Real games mapped to our framework
```

## Conventions

### Document Format
- **Max 400 lines** per file. Split if longer.
- **Mermaid** for all diagrams — text-based, version-controllable, AI-parseable.
- **TypeScript-style pseudocode** for interface definitions — language-agnostic, type-expressive.
- **JSON Schema** for data models — validatable, universal.
- **Tables** for structured data — scannable, diff-friendly.

### Cross-References
- Every document must link to related documents using relative paths.
- Terms must be defined in `SemanticDictionary/Glossary.md` before use.
- KPIs must be defined in `SemanticDictionary/MetricsDictionary.md` before reference.
- Interfaces must align with `Verticals/00_SharedInterfaces.md`.

### Naming
- Folders: `PascalCase` (e.g., `SemanticDictionary/`)
- Files: `PascalCase.md` (e.g., `SystemOverview.md`)
- Vertical folders: `##_Name` (e.g., `01_UI/`, `02_CoreMechanics/`)

### Agent Behavior
- Read the Glossary and SharedInterfaces before writing any vertical spec.
- Do not invent terms — use what's in the Glossary.
- Do not redefine interfaces — extend or reference SharedInterfaces.
- Each vertical agent writes only within its own folder.
- Cross-vertical changes require updating SharedInterfaces first.

## Key Semantic Terms (Quick Reference)

| Term | Meaning |
|------|---------|
| **Shell** | The standardized UI frame wrapping every game |
| **Slot** | An interface boundary where a module plugs in (mechanic slot, event slot, ad slot) |
| **Vertical** | A domain of responsibility owned by one AI agent |
| **Curve** | Progression of a parameter over time/levels (difficulty curve, economy curve) |
| **Faucet** | A source of currency entering the player's wallet |
| **Sink** | A destination consuming currency from the player's wallet |
| **FTUE** | First-Time User Experience — the onboarding flow |
| **Hypothesis** | An AB test's proposed change with expected metric impact |
| **Segment** | A player group (whale, casual, new, churned) with distinct behavior |

Full definitions: `Docs/SemanticDictionary/Glossary.md`

## Related Projects

- **DarkStory** (`D:\DarkStory`) — Dark fantasy RPG in Unity 6. Shares patterns: event bus, command pattern, MVP UI, modular namespaces, ScriptableObject data. Reference for implementation.
