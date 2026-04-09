# Module Dependency Graph

How the 9 verticals depend on each other. Edges represent data artifacts flowing between agents. No agent calls another directly; the pipeline orchestrator passes shared artifacts between stages.

See [System Overview](../Architecture/SystemOverview.md) for the full 3-tier architecture and [Shared Interfaces](../Verticals/00_SharedInterfaces.md) for the contracts at each boundary.

## Dependency Layers

The graph forms a directed acyclic graph (DAG) with three tiers:

1. **Foundation** -- UI and Mechanics read only the GameSpec. They have zero inter-agent dependencies and can run in parallel.
2. **Balance + Revenue** -- Economy, Difficulty, and Monetization depend on Foundation outputs. Economy and Difficulty have a bidirectional data relationship (Difficulty feeds reward tiers back to Economy).
3. **Content + Optimization** -- LiveOps, Assets, Analytics, and AB Testing sit at the leaves. AB Testing depends on Analytics and feeds results back into Tier 2 parameters.

## Full Dependency DAG

```mermaid
graph TD
    GS[GameSpec<br/><i>genre, theme, audience,<br/>monetization tier</i>]

    subgraph Tier1["Tier 1: Foundation"]
        UI["01 UI Agent<br/>Shell + Theming + FTUE"]
        MECH["02 Mechanics Agent<br/>Core Gameplay + Scoring"]
    end

    subgraph Tier2["Tier 2: Balance + Revenue"]
        ECON["04 Economy Agent<br/>Currencies + Rewards + Sinks"]
        DIFF["05 Difficulty Agent<br/>Level Gen + Curves"]
        MON["03 Monetization Agent<br/>IAP + Ads + Compliance"]
    end

    subgraph Tier3["Tier 3: Content + Optimization"]
        LIVE["06 LiveOps Agent<br/>Events + Seasonal Content"]
        ASSET["09 Asset Agent<br/>Art + Audio + Animation"]
        ANA["08 Analytics Agent<br/>Telemetry + KPIs + Funnels"]
        AB["07 AB Testing Agent<br/>Experiments + Bandits"]
    end

    %% GameSpec feeds Foundation + Assets
    GS -- "GameSpec" --> UI
    GS -- "GameSpec" --> MECH
    GS -- "GameSpec<br/>(art style, budget)" --> ASSET

    %% Foundation feeds Tier 2
    UI -- "ShellConfig<br/>(screens, shop slots,<br/>currency bar)" --> ECON
    UI -- "ShellConfig<br/>(ad slot positions,<br/>IAP screen hooks)" --> MON
    MECH -- "MechanicConfig<br/>(reward events,<br/>scoring formula)" --> ECON
    MECH -- "MechanicConfig<br/>(adjustable params,<br/>input model)" --> DIFF

    %% Tier 2 internal
    DIFF -- "DifficultyProfile<br/>(reward tiers per level)" --> ECON
    ECON -- "EconomyTable<br/>(pricing, conversion rates)" --> MON

    %% Tier 2 feeds Tier 3
    ECON -- "EconomyTable<br/>(reward budget)" --> LIVE
    MECH -- "MechanicConfig<br/>(mini-game slot)" --> LIVE

    %% Assets feed back into Foundation + Content
    ASSET -- "AssetManifest" --> UI
    ASSET -- "AssetManifest" --> MECH
    ASSET -- "AssetManifest" --> LIVE

    %% All agents feed Analytics
    UI -. "instrumentation" .-> ANA
    MECH -. "instrumentation" .-> ANA
    ECON -. "instrumentation" .-> ANA
    DIFF -. "instrumentation" .-> ANA
    MON -. "instrumentation" .-> ANA
    LIVE -. "instrumentation" .-> ANA

    %% Analytics feeds AB Testing
    ANA -- "EventTaxonomy<br/>(what can be measured)" --> AB

    %% AB Testing feedback loop
    AB -. "ExperimentResults<br/>(param adjustments)" .-> ECON
    AB -. "ExperimentResults<br/>(curve adjustments)" .-> DIFF
    AB -. "ExperimentResults<br/>(pricing/ad adjustments)" .-> MON

    %% Styles
    classDef tier1 fill:#4A90D9,stroke:#2C5F8A,color:#fff
    classDef tier2 fill:#D4A843,stroke:#A07B20,color:#fff
    classDef tier3 fill:#6BBF6B,stroke:#3D8B3D,color:#fff
    classDef spec fill:#E8E8E8,stroke:#999,color:#333

    class UI,MECH tier1
    class ECON,DIFF,MON tier2
    class LIVE,ASSET,ANA,AB tier3
    class GS spec
```

## Reading the Graph

- **Solid arrows** represent build-time data flow: an upstream agent produces an artifact that a downstream agent consumes during generation.
- **Dashed arrows** represent runtime/continuous data flow: instrumentation telemetry and experiment results that flow after the initial build.
- **Edge labels** name the shared artifact. Each artifact's schema is defined in [Shared Interfaces](../Verticals/00_SharedInterfaces.md).

## Key Observations

| Property | Detail |
|----------|--------|
| Root nodes | UI Agent, Mechanics Agent (depend only on GameSpec) |
| Most depended-on | Economy Agent (receives from UI, Mechanics, Difficulty; feeds Monetization, LiveOps) |
| Leaf nodes | AB Testing Agent, Analytics Agent (consume from most others, produce feedback) |
| Bidirectional pair | Economy and Difficulty (Difficulty sends reward tiers; Economy sends reward budgets) |
| Cross-cutting | Asset Agent serves UI, Mechanics, and LiveOps; Analytics instruments all agents |

## Parallelism Implications

Because the DAG has clear layers, the orchestrator can parallelize within each tier:

1. **Parallel:** UI + Mechanics (+ Asset Agent can start on GameSpec assets)
2. **Parallel:** Economy + Difficulty (after Foundation completes)
3. **Sequential:** Monetization (after Economy + UI)
4. **Parallel:** LiveOps + Analytics (after Tier 2)
5. **Last:** AB Testing (after Analytics)
