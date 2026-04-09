# Slot Composition Graph

Visual decomposition of how the UI Shell provides slots that other agents fill. The Shell is an empty frame; the Mechanics Agent, LiveOps Agent, Monetization Agent, and Asset Agent each fill their designated regions.

See [System Overview](../Architecture/SystemOverview.md) for the slot architecture overview and [Shared Interfaces](../Verticals/00_SharedInterfaces.md) for the `IMechanic`, `IEvent`, `IAdUnit`, and `IShopItem` contracts.

## Screen Region Map

```mermaid
graph TD
    subgraph Screen["Game Screen (Full Device)"]
        subgraph TopBar["Top Bar Region"]
            CURR["Currency Bar<br/><i>Basic: 1,240 | Premium: 15</i>"]
            ENERGY["Energy Display<br/><i>4/5 | Refill in 12:30</i>"]
            SETTINGS["Settings Icon"]
        end

        subgraph NavRegion["Navigation Region"]
            NAV_HOME["Home"]
            NAV_PLAY["Play"]
            NAV_SHOP["Shop"]
            NAV_EVENTS["Events"]
            NAV_SOCIAL["Social"]
        end

        subgraph CenterRegion["Center Region (Primary Content)"]
            MECHSLOT["MECHANIC SLOT<br/><i>Core gameplay renders here</i><br/><i>Implements IMechanic interface</i><br/>------<br/>Runner / Merge / Match-3 / etc."]
        end

        subgraph SideRegion["Overlay Slots"]
            EVENTSLOT["EVENT SLOT<br/><i>LiveOps banners, timers</i><br/><i>Implements IEvent</i>"]
            ADSLOT["AD SLOT<br/><i>Banner / Interstitial trigger</i><br/><i>Implements IAdUnit</i>"]
            SHOPSLOT["SHOP SLOT<br/><i>IAP offers, daily deals</i><br/><i>Implements IShopItem</i>"]
        end
    end

    classDef shell fill:#B0BEC5,stroke:#607D8B,color:#333
    classDef mechanic fill:#4A90D9,stroke:#2C5F8A,color:#fff
    classDef event fill:#FF9800,stroke:#E65100,color:#fff
    classDef ad fill:#E91E63,stroke:#AD1457,color:#fff
    classDef shop fill:#9C27B0,stroke:#6A1B9A,color:#fff

    class CURR,ENERGY,SETTINGS,NAV_HOME,NAV_PLAY,NAV_SHOP,NAV_EVENTS,NAV_SOCIAL shell
    class MECHSLOT mechanic
    class EVENTSLOT event
    class ADSLOT ad
    class SHOPSLOT shop
```

## Before and After: Empty Shell vs Filled Shell

### Empty Shell (UI Agent output only)

```mermaid
graph TD
    subgraph EmptyShell["Empty Shell — UI Agent Output"]
        E_TOP["Currency Bar: [--empty--]<br/>Energy: [--empty--]"]
        E_CENTER["MECHANIC SLOT<br/>[awaiting MechanicConfig]"]
        E_EVENT["EVENT SLOT<br/>[awaiting EventCalendar]"]
        E_AD["AD SLOT<br/>[awaiting MonetizationPlan]"]
        E_SHOP["SHOP SLOT<br/>[awaiting MonetizationPlan]"]
        E_NAV["Navigation: Home | Play | Shop | Events | Social"]
    end

    style EmptyShell fill:#F5F5F5,stroke:#BDBDBD
    style E_CENTER fill:#E3F2FD,stroke:#90CAF9,color:#333
    style E_EVENT fill:#FFF3E0,stroke:#FFE0B2,color:#333
    style E_AD fill:#FCE4EC,stroke:#F8BBD0,color:#333
    style E_SHOP fill:#F3E5F5,stroke:#CE93D8,color:#333
```

### Filled Shell (All agents have contributed)

```mermaid
graph TD
    subgraph FilledShell["Filled Shell — Runner Game Example"]
        F_TOP["Coins: 1,240 | Gems: 15<br/>Energy: 4/5 (Refill 12:30)"]
        F_CENTER["RUNNER MECHANIC<br/>Endless runner gameplay<br/>Speed: 8.5 | Score: 12,450<br/>Obstacles + Power-ups active"]
        F_EVENT["SPRING EVENT<br/>Cherry Blossom Festival<br/>3d 14h remaining<br/>Progress: 6/10 milestones"]
        F_AD["REWARDED AD<br/>Watch ad for 2x coins?<br/>Next interstitial in 3 levels"]
        F_SHOP["DAILY DEAL<br/>500 Gems — $4.99 (50% off!)<br/>Sakura Skin — 2,000 Coins"]
        F_NAV["Navigation: Home | Play | Shop | Events | Social"]
    end

    style FilledShell fill:#E8F5E9,stroke:#81C784
    style F_CENTER fill:#4A90D9,stroke:#2C5F8A,color:#fff
    style F_EVENT fill:#FF9800,stroke:#E65100,color:#fff
    style F_AD fill:#E91E63,stroke:#AD1457,color:#fff
    style F_SHOP fill:#9C27B0,stroke:#6A1B9A,color:#fff
```

## How Theming Wraps Everything

The UI Agent generates a `Theme` object (see [Shared Interfaces](../Verticals/00_SharedInterfaces.md)) that applies consistently across all slots:

```mermaid
graph TD
    THEME["Theme Object<br/><i>palette, typography,<br/>icons, animations</i>"]

    THEME --> SHELL_THEME["Shell Theming<br/>Background, nav colors,<br/>currency bar style"]
    THEME --> MECH_THEME["Mechanic Theming<br/>Game visuals match theme<br/>palette + typography"]
    THEME --> EVENT_THEME["Event Theme Overlay<br/>Seasonal colors override<br/>base theme temporarily"]
    THEME --> SHOP_THEME["Shop Theming<br/>Item cards, price tags,<br/>sale badges styled"]
    THEME --> AD_THEME["Ad Frame Theming<br/>Ad container matches<br/>game aesthetic"]

    classDef theme fill:#FFC107,stroke:#F57F17,color:#333
    class THEME theme
```

## Slot Interface Summary

Each slot type has a contract that the filling agent must implement:

| Slot | Interface | Filling Agent | Key Methods |
|------|-----------|--------------|-------------|
| Mechanic Slot | `IMechanic` | Mechanics Agent | `init()`, `start()`, `pause()`, events |
| Event Slot | `IEvent` | LiveOps Agent | `init()`, `start()`, `getProgress()`, `claimReward()` |
| Ad Slot | `IAdUnit` | Monetization Agent | `load()`, `isReady()`, `show()` |
| Shop Slot | `IShopItem` | Monetization Agent | `getDisplayInfo()`, `getPrice()`, `purchase()` |

## Composition Flow

```mermaid
sequenceDiagram
    participant GS as GameSpec
    participant UI as UI Agent
    participant MECH as Mechanics Agent
    participant MON as Monetization Agent
    participant LIVE as LiveOps Agent
    participant ASSET as Asset Agent

    GS->>UI: Theme, audience, genre
    UI->>UI: Generate empty shell with slots

    Note over UI: Shell has named slots:<br/>mechanic_main, event_banner,<br/>ad_banner, ad_interstitial,<br/>shop_daily, shop_featured

    GS->>MECH: Mechanic type
    MECH->>UI: MechanicConfig (fills mechanic_main)

    ASSET->>UI: AssetManifest (sprites, fonts)

    UI->>MON: ShellConfig (ad slot positions)
    MON->>UI: MonetizationPlan (fills ad + shop slots)

    LIVE->>UI: EventCalendar (fills event slots)

    Note over UI: All slots filled.<br/>Theme applied uniformly.<br/>Shell is complete.
```

The shell never knows *what* mechanic is running inside it. It only knows the `IMechanic` interface. This decoupling means the same shell can host a runner, a merge game, a match-3, or any other mechanic without changes.
