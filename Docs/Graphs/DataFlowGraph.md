# Data Flow Graph

Traces every data artifact from the initial GameSpec through each agent to the final game build. Shows fan-out (one artifact feeding multiple agents) and fan-in (all artifacts combining into the output).

See [System Overview](../Architecture/SystemOverview.md) for the artifact table and [Shared Interfaces](../Verticals/00_SharedInterfaces.md) for each artifact's schema.

## Artifact Inventory

| Artifact | Produced By | Consumed By |
|----------|-------------|-------------|
| `GameSpec` | Designer / Product | UI, Mechanics, Assets |
| `ShellConfig` | UI Agent | Economy, Monetization |
| `MechanicConfig` | Mechanics Agent | Economy, Difficulty, LiveOps |
| `EconomyTable` | Economy Agent | Monetization, LiveOps |
| `DifficultyProfile` | Difficulty Agent | Economy |
| `MonetizationPlan` | Monetization Agent | (final build) |
| `EventCalendar` | LiveOps Agent | (final build) |
| `AssetManifest` | Asset Agent | UI, Mechanics, LiveOps |
| `EventTaxonomy` | Analytics Agent | AB Testing |
| `TelemetryConfig` | Analytics Agent | (final build) |
| `ExperimentResults` | AB Testing Agent | Economy, Difficulty, Monetization |

## Full Data Flow

```mermaid
graph LR
    GS["GameSpec<br/><i>genre, theme, audience,<br/>mechanic type, art style,<br/>monetization tier</i>"]

    subgraph Foundation["Foundation Agents"]
        UI["UI Agent"]
        MECH["Mechanics Agent"]
    end

    subgraph BalanceRevenue["Balance + Revenue Agents"]
        ECON["Economy Agent"]
        DIFF["Difficulty Agent"]
        MON["Monetization Agent"]
    end

    subgraph ContentOpt["Content + Optimization Agents"]
        LIVE["LiveOps Agent"]
        ASSET["Asset Agent"]
        ANA["Analytics Agent"]
        AB["AB Testing Agent"]
    end

    BUILD["Final Game Build"]

    %% GameSpec fan-out
    GS -- "GameSpec" --> UI
    GS -- "GameSpec" --> MECH
    GS -- "GameSpec" --> ASSET

    %% Foundation outputs
    UI -- "ShellConfig" --> ECON
    UI -- "ShellConfig" --> MON
    MECH -- "MechanicConfig" --> ECON
    MECH -- "MechanicConfig" --> DIFF
    MECH -- "MechanicConfig" --> LIVE

    %% Asset delivery
    ASSET -- "AssetManifest" --> UI
    ASSET -- "AssetManifest" --> MECH
    ASSET -- "AssetManifest" --> LIVE

    %% Balance layer
    DIFF -- "DifficultyProfile" --> ECON
    ECON -- "EconomyTable" --> MON
    ECON -- "EconomyTable" --> LIVE

    %% Analytics + AB
    UI -. "events" .-> ANA
    MECH -. "events" .-> ANA
    ECON -. "events" .-> ANA
    DIFF -. "events" .-> ANA
    MON -. "events" .-> ANA
    LIVE -. "events" .-> ANA
    ANA -- "EventTaxonomy" --> AB

    %% AB feedback
    AB -. "ExperimentResults" .-> ECON
    AB -. "ExperimentResults" .-> DIFF
    AB -. "ExperimentResults" .-> MON

    %% Fan-in to final build
    UI -- "ShellConfig" --> BUILD
    MECH -- "MechanicConfig" --> BUILD
    ECON -- "EconomyTable" --> BUILD
    DIFF -- "DifficultyProfile" --> BUILD
    MON -- "MonetizationPlan" --> BUILD
    LIVE -- "EventCalendar" --> BUILD
    ASSET -- "AssetManifest" --> BUILD
    ANA -- "TelemetryConfig" --> BUILD
    AB -- "ExperimentConfig" --> BUILD
```

## Fan-Out Points

These artifacts feed multiple downstream consumers:

```mermaid
graph TD
    subgraph "GameSpec Fan-Out (1 -> 3)"
        GS1[GameSpec] --> UI1[UI Agent]
        GS1 --> MECH1[Mechanics Agent]
        GS1 --> ASSET1[Asset Agent]
    end

    subgraph "ShellConfig Fan-Out (1 -> 2)"
        SC[ShellConfig] --> ECON1[Economy Agent]
        SC --> MON1[Monetization Agent]
    end

    subgraph "MechanicConfig Fan-Out (1 -> 3)"
        MC[MechanicConfig] --> ECON2[Economy Agent]
        MC --> DIFF1[Difficulty Agent]
        MC --> LIVE1[LiveOps Agent]
    end

    subgraph "AssetManifest Fan-Out (1 -> 3)"
        AM[AssetManifest] --> UI2[UI Agent]
        AM --> MECH2[Mechanics Agent]
        AM --> LIVE2[LiveOps Agent]
    end
```

## Fan-In: Final Game Build

All 9 agents contribute artifacts to the final build:

```mermaid
graph LR
    UI_OUT["ShellConfig<br/>(screens, nav, FTUE)"]
    MECH_OUT["MechanicConfig<br/>(gameplay module)"]
    ECON_OUT["EconomyTable<br/>(currencies, rates)"]
    DIFF_OUT["DifficultyProfile<br/>(levels, curves)"]
    MON_OUT["MonetizationPlan<br/>(IAP catalog, ad config)"]
    LIVE_OUT["EventCalendar<br/>(events, seasons)"]
    ASSET_OUT["AssetManifest<br/>(art, audio, anim)"]
    ANA_OUT["TelemetryConfig<br/>(events, funnels, dashboards)"]
    AB_OUT["ExperimentConfig<br/>(active tests, variants)"]

    BUILD["Complete<br/>Game Build"]

    UI_OUT --> BUILD
    MECH_OUT --> BUILD
    ECON_OUT --> BUILD
    DIFF_OUT --> BUILD
    MON_OUT --> BUILD
    LIVE_OUT --> BUILD
    ASSET_OUT --> BUILD
    ANA_OUT --> BUILD
    AB_OUT --> BUILD
```

## Artifact Lifecycle

Each artifact goes through these states:

1. **Requested** -- A downstream agent declares it needs this artifact.
2. **Generating** -- The owning agent is building the artifact.
3. **Published** -- The artifact is written to the shared artifact store.
4. **Consumed** -- Downstream agents have read and validated the artifact.
5. **Updated** -- AB Testing feedback triggers a new version (runtime only).

The orchestrator tracks artifact states and only advances an agent to "Generating" when all its input artifacts are in "Published" state.
