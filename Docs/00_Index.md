# AI Game Engine — Master Index

## How to Read This

**New to the project?** Follow this reading order:

1. Start with [`CLAUDE.md`](../CLAUDE.md) — project identity, the 9 verticals, conventions
2. Read [`01_Vision.md`](01_Vision.md) — why this exists, what "complete game" means, design principles
3. Read [`Architecture/SystemOverview.md`](Architecture/SystemOverview.md) — the big picture diagram
4. Read [`Architecture/SlotArchitecture.md`](Architecture/SlotArchitecture.md) — the core composition mechanism
5. Read [`SemanticDictionary/Glossary.md`](SemanticDictionary/Glossary.md) — learn the vocabulary
6. Read [`Verticals/00_SharedInterfaces.md`](Verticals/00_SharedInterfaces.md) — cross-vertical contracts
7. Pick the vertical you're working on and read its Spec.md first

**Looking for a specific topic?** Use the table below.

---

## Foundation

| File | Description | Status |
|------|-------------|--------|
| [`../CLAUDE.md`](../CLAUDE.md) | Project identity, 9 verticals, conventions, agent rules | Final |
| [`01_Vision.md`](01_Vision.md) | Problem, target output, design principles, non-goals, success metrics | Final |

## Architecture

| File | Description | Status |
|------|-------------|--------|
| [`Architecture/SystemOverview.md`](Architecture/SystemOverview.md) | 3-tier architecture, data flow summary, external dependencies | Final |
| [`Architecture/SlotArchitecture.md`](Architecture/SlotArchitecture.md) | Shell + Mechanic composition, slot types, interface contracts | Final |
| [`Architecture/PerformanceBudgets.md`](Architecture/PerformanceBudgets.md) | Mobile constraints: FPS, memory, download size, battery, network | Final |
| [`Architecture/GameState.md`](Architecture/GameState.md) | Save/load, cloud sync, offline queue, conflict resolution | Final |
| [`Architecture/ModuleRelationships.md`](Architecture/ModuleRelationships.md) | Module dependency graph between verticals | Final |
| [`Architecture/DataFlow.md`](Architecture/DataFlow.md) | Detailed data flow between pipeline stages | Final |
| [`Architecture/AgentOrchestration.md`](Architecture/AgentOrchestration.md) | How agents coordinate, sequencing, conflict resolution | Final |
| [`Architecture/EventModel.md`](Architecture/EventModel.md) | Event-driven communication between modules | Final |

## Semantic Dictionary

| File | Description | Status |
|------|-------------|--------|
| [`SemanticDictionary/Glossary.md`](SemanticDictionary/Glossary.md) | 80+ domain terms defined A-Z | Final |
| [`SemanticDictionary/MetricsDictionary.md`](SemanticDictionary/MetricsDictionary.md) | 50+ mobile gaming KPIs with formulas and targets | Final |
| [`SemanticDictionary/Concepts_Slot.md`](SemanticDictionary/Concepts_Slot.md) | Deep dive: slotting system, types, anti-patterns | Final |
| [`SemanticDictionary/Concepts_Curve.md`](SemanticDictionary/Concepts_Curve.md) | Deep dive: difficulty/economy curves, shapes, interactions | Final |
| [`SemanticDictionary/Concepts_Faucet_Sink.md`](SemanticDictionary/Concepts_Faucet_Sink.md) | Deep dive: economy flows, balance equation, per-segment ratios | Final |
| [`SemanticDictionary/Concepts_Shell.md`](SemanticDictionary/Concepts_Shell.md) | Deep dive: UI shell components, theming, boundary with mechanic | Final |
| [`SemanticDictionary/Concepts_Vertical.md`](SemanticDictionary/Concepts_Vertical.md) | Deep dive: agent domains, properties, cross-cutting concerns | Final |
| [`SemanticDictionary/Concepts_Agent.md`](SemanticDictionary/Concepts_Agent.md) | Deep dive: AI agent lifecycle, autonomy, communication, evaluation | Final |
| [`SemanticDictionary/Concepts_LiveOps.md`](SemanticDictionary/Concepts_LiveOps.md) | Deep dive: event types, calendar, lifecycle, vertical interactions | Final |
| [`SemanticDictionary/Concepts_Hypothesis.md`](SemanticDictionary/Concepts_Hypothesis.md) | Deep dive: AB test hypothesis format, lifecycle, prioritization | Final |
| [`SemanticDictionary/Concepts_Segmentation.md`](SemanticDictionary/Concepts_Segmentation.md) | Deep dive: player segments, per-segment vertical adjustments | Final |
| [`SemanticDictionary/Concepts_Onboarding.md`](SemanticDictionary/Concepts_Onboarding.md) | Deep dive: FTUE flow, progressive disclosure, anti-patterns | Final |

## Vertical Specifications

### Shared
| File | Description | Status |
|------|-------------|--------|
| [`Verticals/00_SharedInterfaces.md`](Verticals/00_SharedInterfaces.md) | Cross-vertical contracts: types, events, APIs | Final |

### 01 — UI Shell
| File | Description | Status |
|------|-------------|--------|
| [`Verticals/01_UI/Spec.md`](Verticals/01_UI/Spec.md) | Shell specification: scope, I/O, constraints | Final |
| [`Verticals/01_UI/Interfaces.md`](Verticals/01_UI/Interfaces.md) | Navigation, screen, theme, toast, slot APIs | Final |
| [`Verticals/01_UI/DataModels.md`](Verticals/01_UI/DataModels.md) | ShellConfig, screen, nav graph, theme schemas | Final |
| [`Verticals/01_UI/AgentResponsibilities.md`](Verticals/01_UI/AgentResponsibilities.md) | UI agent decisions, coordination, failure modes | Final |
| [`Verticals/01_UI/Onboarding.md`](Verticals/01_UI/Onboarding.md) | FTUE flow, progressive disclosure, tutorial steps | Final |

### 02 — Core Mechanics
| File | Description | Status |
|------|-------------|--------|
| [`Verticals/02_CoreMechanics/Spec.md`](Verticals/02_CoreMechanics/Spec.md) | Mechanics specification: scope, I/O, constraints | Final |
| [`Verticals/02_CoreMechanics/Interfaces.md`](Verticals/02_CoreMechanics/Interfaces.md) | IMechanic, input, scoring, level flow APIs | Final |
| [`Verticals/02_CoreMechanics/DataModels.md`](Verticals/02_CoreMechanics/DataModels.md) | MechanicConfig, LevelConfig, InputModel schemas | Final |
| [`Verticals/02_CoreMechanics/AgentResponsibilities.md`](Verticals/02_CoreMechanics/AgentResponsibilities.md) | Mechanics agent decisions, coordination, failure modes | Final |
| [`Verticals/02_CoreMechanics/MechanicCatalog.md`](Verticals/02_CoreMechanics/MechanicCatalog.md) | 10 mechanic types: runner, merge, PVP, puzzle, idle, etc. | Final |

### 03 — Monetization
| File | Description | Status |
|------|-------------|--------|
| [`Verticals/03_Monetization/Spec.md`](Verticals/03_Monetization/Spec.md) | Monetization specification: scope, I/O, constraints | Final |
| [`Verticals/03_Monetization/Interfaces.md`](Verticals/03_Monetization/Interfaces.md) | Ad placement, mediation, IAP, shop, offer APIs | Final |
| [`Verticals/03_Monetization/DataModels.md`](Verticals/03_Monetization/DataModels.md) | MonetizationPlan, ad, IAP, shop, offer schemas | Final |
| [`Verticals/03_Monetization/AgentResponsibilities.md`](Verticals/03_Monetization/AgentResponsibilities.md) | Monetization agent decisions, coordination, failure modes | Final |
| [`Verticals/03_Monetization/EthicalGuardrails.md`](Verticals/03_Monetization/EthicalGuardrails.md) | Hard rules: no P2W, spending caps, transparent odds, no dark patterns | Final |
| [`Verticals/03_Monetization/Compliance.md`](Verticals/03_Monetization/Compliance.md) | COPPA, GDPR, app store policies, regional regulations | Final |

### 04 — Economy
| File | Description | Status |
|------|-------------|--------|
| [`Verticals/04_Economy/Spec.md`](Verticals/04_Economy/Spec.md) | Economy specification: scope, I/O, constraints | Final |
| [`Verticals/04_Economy/Interfaces.md`](Verticals/04_Economy/Interfaces.md) | Currency, reward, time-gate, pass APIs | Final |
| [`Verticals/04_Economy/DataModels.md`](Verticals/04_Economy/DataModels.md) | EconomyTable, faucet, sink, energy, pass schemas | Final |
| [`Verticals/04_Economy/AgentResponsibilities.md`](Verticals/04_Economy/AgentResponsibilities.md) | Economy agent decisions, coordination, failure modes | Final |
| [`Verticals/04_Economy/BalanceLevers.md`](Verticals/04_Economy/BalanceLevers.md) | Every tunable parameter with defaults, ranges, AB testability | Final |
| [`Verticals/04_Economy/Segmentation.md`](Verticals/04_Economy/Segmentation.md) | Per-segment economy: faucets, sinks, offers, transitions | Final |

### 05 — Difficulty
| File | Description | Status |
|------|-------------|--------|
| [`Verticals/05_Difficulty/Spec.md`](Verticals/05_Difficulty/Spec.md) | Difficulty specification: scope, I/O, constraints | Final |
| [`Verticals/05_Difficulty/Interfaces.md`](Verticals/05_Difficulty/Interfaces.md) | Level generator, curve, template, validator APIs | Final |
| [`Verticals/05_Difficulty/DataModels.md`](Verticals/05_Difficulty/DataModels.md) | DifficultyProfile, LevelConfig, curve schemas | Final |
| [`Verticals/05_Difficulty/AgentResponsibilities.md`](Verticals/05_Difficulty/AgentResponsibilities.md) | Difficulty agent decisions, coordination, failure modes | Final |
| [`Verticals/05_Difficulty/CurveTemplates.md`](Verticals/05_Difficulty/CurveTemplates.md) | 8 standard curves with data, sparklines, mechanic pairings | Final |

### 06 — LiveOps
| File | Description | Status |
|------|-------------|--------|
| [`Verticals/06_LiveOps/Spec.md`](Verticals/06_LiveOps/Spec.md) | LiveOps specification: scope, I/O, constraints | Final |
| [`Verticals/06_LiveOps/Interfaces.md`](Verticals/06_LiveOps/Interfaces.md) | Event creation, calendar, slot, mini-game, lifecycle APIs | Final |
| [`Verticals/06_LiveOps/DataModels.md`](Verticals/06_LiveOps/DataModels.md) | EventCalendar, EventConfig, seasonal, mini-game schemas | Final |
| [`Verticals/06_LiveOps/AgentResponsibilities.md`](Verticals/06_LiveOps/AgentResponsibilities.md) | LiveOps agent decisions, coordination, failure modes | Final |

### 07 — AB Testing
| File | Description | Status |
|------|-------------|--------|
| [`Verticals/07_ABTesting/Spec.md`](Verticals/07_ABTesting/Spec.md) | AB Testing specification: scope, I/O, constraints | Final |
| [`Verticals/07_ABTesting/Interfaces.md`](Verticals/07_ABTesting/Interfaces.md) | Experiment, allocation, override, analysis, guardrail APIs | Final |
| [`Verticals/07_ABTesting/DataModels.md`](Verticals/07_ABTesting/DataModels.md) | ExperimentPlan, Experiment, Variant, Result schemas | Final |
| [`Verticals/07_ABTesting/AgentResponsibilities.md`](Verticals/07_ABTesting/AgentResponsibilities.md) | AB Testing agent decisions, coordination, failure modes | Final |
| [`Verticals/07_ABTesting/FeedbackLoop.md`](Verticals/07_ABTesting/FeedbackLoop.md) | Test→Analyze→Allocate→Iterate cycle, bandit algorithms | Final |

### 08 — Analytics
| File | Description | Status |
|------|-------------|--------|
| [`Verticals/08_Analytics/Spec.md`](Verticals/08_Analytics/Spec.md) | Analytics specification: scope, I/O, constraints | Final |
| [`Verticals/08_Analytics/Interfaces.md`](Verticals/08_Analytics/Interfaces.md) | Event tracking, taxonomy, funnel, KPI, dashboard, alert APIs | Final |
| [`Verticals/08_Analytics/DataModels.md`](Verticals/08_Analytics/DataModels.md) | EventTaxonomy, funnel, dashboard, alert, batch schemas | Final |
| [`Verticals/08_Analytics/AgentResponsibilities.md`](Verticals/08_Analytics/AgentResponsibilities.md) | Analytics agent decisions, coordination, failure modes | Final |
| [`Verticals/08_Analytics/KPIDashboards.md`](Verticals/08_Analytics/KPIDashboards.md) | 4 dashboards: Executive, Engagement, Monetization, LiveOps | Final |

### 09 — Assets
| File | Description | Status |
|------|-------------|--------|
| [`Verticals/09_Assets/Spec.md`](Verticals/09_Assets/Spec.md) | Asset pipeline specification: scope, I/O, constraints | Final |
| [`Verticals/09_Assets/Interfaces.md`](Verticals/09_Assets/Interfaces.md) | Asset request, delivery, search, validation, theme APIs | Final |
| [`Verticals/09_Assets/DataModels.md`](Verticals/09_Assets/DataModels.md) | AssetManifest, metadata, library entry, quality schemas | Final |
| [`Verticals/09_Assets/AgentResponsibilities.md`](Verticals/09_Assets/AgentResponsibilities.md) | Asset agent decisions, coordination, failure modes | Final |
| [`Verticals/09_Assets/SourcingStrategy.md`](Verticals/09_Assets/SourcingStrategy.md) | AI-generated vs purchased vs artist: decision matrix, costs | Final |
| [`Verticals/09_Assets/AssetLibrary.md`](Verticals/09_Assets/AssetLibrary.md) | Library structure, tagging, search, reuse, versioning | Final |

## Pipeline

| File | Description | Status |
|------|-------------|--------|
| [`Pipeline/GameCreationPipeline.md`](Pipeline/GameCreationPipeline.md) | End-to-end: GameSpec → complete game | Final |
| [`Pipeline/AgentHandoffs.md`](Pipeline/AgentHandoffs.md) | Handoff artifacts between every agent pair | Final |
| [`Pipeline/QualityGates.md`](Pipeline/QualityGates.md) | Pass criteria per pipeline stage | Final |
| [`Pipeline/DataContracts.md`](Pipeline/DataContracts.md) | JSON schemas for all inter-agent artifacts | Final |
| [`Pipeline/ErrorRecovery.md`](Pipeline/ErrorRecovery.md) | Retry, fallback, escalation strategies | Final |

## Graphs

| File | Description | Status |
|------|-------------|--------|
| [`Graphs/ModuleDependencyGraph.md`](Graphs/ModuleDependencyGraph.md) | Mermaid: vertical dependencies | Final |
| [`Graphs/AgentOrchestrationGraph.md`](Graphs/AgentOrchestrationGraph.md) | Mermaid: agent swimlanes over time | Final |
| [`Graphs/DataFlowGraph.md`](Graphs/DataFlowGraph.md) | Mermaid: data through pipeline | Final |
| [`Graphs/EconomyFlowGraph.md`](Graphs/EconomyFlowGraph.md) | Mermaid: faucets/sinks/currency loops | Final |
| [`Graphs/ABTestingFlowGraph.md`](Graphs/ABTestingFlowGraph.md) | Mermaid: hypothesis to optimization | Final |
| [`Graphs/SlotCompositionGraph.md`](Graphs/SlotCompositionGraph.md) | Mermaid: shell + mechanic visual | Final |
| [`Graphs/PlayerJourneyGraph.md`](Graphs/PlayerJourneyGraph.md) | Mermaid: install to loyal/churned | Final |

## Templates

| File | Description | Status |
|------|-------------|--------|
| [`Templates/GameSpec_Template.md`](Templates/GameSpec_Template.md) | New game definition format | Final |
| [`Templates/LevelDefinition_Template.md`](Templates/LevelDefinition_Template.md) | Level definition format | Final |
| [`Templates/EconomyTable_Template.md`](Templates/EconomyTable_Template.md) | Economy parameter format | Final |
| [`Templates/ABTestDefinition_Template.md`](Templates/ABTestDefinition_Template.md) | Experiment format | Final |
| [`Templates/EventDefinition_Template.md`](Templates/EventDefinition_Template.md) | LiveOps event format | Final |
| [`Templates/MechanicModule_Template.md`](Templates/MechanicModule_Template.md) | New mechanic format | Final |
| [`Templates/AdPlacement_Template.md`](Templates/AdPlacement_Template.md) | Ad placement rules format | Final |
| [`Templates/AssetRequest_Template.md`](Templates/AssetRequest_Template.md) | Asset sourcing request format | Final |

## Reference Games

| File | Description | Status |
|------|-------------|--------|
| [`ReferenceGames/README.md`](ReferenceGames/README.md) | How to read reference game mappings | Final |
| [`ReferenceGames/SubwaySurfers.md`](ReferenceGames/SubwaySurfers.md) | Runner archetype mapped to framework | Final |
| [`ReferenceGames/MergeDragons.md`](ReferenceGames/MergeDragons.md) | Merge archetype mapped to framework | Final |
| [`ReferenceGames/CoinMaster.md`](ReferenceGames/CoinMaster.md) | Casual/social archetype mapped to framework | Final |
