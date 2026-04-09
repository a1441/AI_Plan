# Player Journey Graph

The master player flow from install to loyal user or churn. Maps every major touchpoint, decision point, and branching path across the player lifecycle. Each stage connects to the agent responsible for that experience.

See [System Overview](../Architecture/SystemOverview.md) for the agent responsibilities and [Shared Interfaces](../Verticals/00_SharedInterfaces.md) for the `PlayerContext.segments` definitions.

## Full Player Journey

```mermaid
graph TD
    INSTALL["App Install<br/><i>Day 0</i>"]

    subgraph FTUE["First-Time User Experience (FTUE)"]
        SPLASH["Splash Screen +<br/>Asset Loading"]
        TUT1["Tutorial Step 1<br/><i>Basic controls</i>"]
        TUT2["Tutorial Step 2<br/><i>First level (easy)</i>"]
        TUT3["Tutorial Step 3<br/><i>First reward earned</i>"]
        FTUE_SHOP["Tutorial Step 4<br/><i>Shop introduction</i>"]
    end

    FTUE_CHECK{"Completes<br/>FTUE?"}

    subgraph CoreLoop["Core Loop"]
        PLAY["Play Level"]
        REWARD["Earn Rewards<br/><i>Currency + XP</i>"]
        PROGRESS["Progress<br/><i>Unlock content,<br/>upgrade abilities</i>"]
        ENGAGE["Engagement Hook<br/><i>Daily login, streak,<br/>challenge</i>"]
    end

    subgraph MonTouch["Monetization Touchpoints"]
        AD_PROMPT["Rewarded Ad Prompt<br/><i>After level fail or<br/>for bonus rewards</i>"]
        SHOP_VISIT["Shop Visit<br/><i>Daily deals, bundles,<br/>currency packs</i>"]
        IAP_PROMPT["IAP Prompt<br/><i>Starter bundle,<br/>limited offer</i>"]
    end

    PURCHASE_CHECK{"Makes First<br/>Purchase?"}

    subgraph Retention["Retention Hooks"]
        DAILY_REWARD["Daily Login Reward<br/><i>Streak bonuses</i>"]
        PUSH["Push Notification<br/><i>Energy full, event starting</i>"]
        SOCIAL["Social Features<br/><i>Friends, leaderboard</i>"]
    end

    D7_CHECK{"Returns<br/>Day 7?"}

    subgraph LiveOpsEvents["LiveOps Events"]
        SEASONAL["Seasonal Event<br/><i>Limited-time content</i>"]
        CHALLENGE["Challenge Event<br/><i>Special rewards</i>"]
        BATTLEPASS["Battle Pass<br/><i>Premium progression</i>"]
    end

    subgraph Segments["Player Segments"]
        WHALE["Whale Path<br/><i>High IAP spend<br/>Exclusive content<br/>VIP treatment</i>"]
        CASUAL["Casual Path<br/><i>Ad-monetized<br/>Light engagement<br/>Weekend warrior</i>"]
        LOYAL["Loyal Player<br/><i>Regular engagement<br/>Moderate spend<br/>Community member</i>"]
        CHURNED["Churned Player<br/><i>Stopped playing<br/>Win-back campaigns<br/>Lapsed offers</i>"]
    end

    WINBACK["Win-Back Campaign<br/><i>Push notification +<br/>lapsed player bonus</i>"]

    %% Main flow
    INSTALL --> SPLASH
    SPLASH --> TUT1
    TUT1 --> TUT2
    TUT2 --> TUT3
    TUT3 --> FTUE_SHOP
    FTUE_SHOP --> FTUE_CHECK

    FTUE_CHECK -- "Yes (75-85%)" --> PLAY
    FTUE_CHECK -- "No (15-25%)" --> CHURNED

    PLAY --> REWARD
    REWARD --> PROGRESS
    PROGRESS --> ENGAGE
    ENGAGE --> PLAY

    %% Monetization touchpoints branch from core loop
    PLAY -- "After fail" --> AD_PROMPT
    PROGRESS -- "Needs currency" --> SHOP_VISIT
    ENGAGE -- "Special offer" --> IAP_PROMPT

    AD_PROMPT --> PLAY
    SHOP_VISIT --> PURCHASE_CHECK
    IAP_PROMPT --> PURCHASE_CHECK

    PURCHASE_CHECK -- "Yes (2-5%)" --> D7_CHECK
    PURCHASE_CHECK -- "No (95-98%)" --> D7_CHECK

    %% Retention
    D7_CHECK -- "Yes (25-40%)" --> DAILY_REWARD
    D7_CHECK -- "No (60-75%)" --> CHURNED

    DAILY_REWARD --> PUSH
    PUSH --> SOCIAL
    SOCIAL --> PLAY

    %% LiveOps
    DAILY_REWARD --> SEASONAL
    DAILY_REWARD --> CHALLENGE
    DAILY_REWARD --> BATTLEPASS
    SEASONAL --> PLAY
    CHALLENGE --> PLAY
    BATTLEPASS --> PLAY

    %% Segment branching
    PURCHASE_CHECK -- "High spend" --> WHALE
    D7_CHECK -- "Light engagement" --> CASUAL
    SOCIAL --> LOYAL

    %% Win-back
    CHURNED --> WINBACK
    WINBACK -- "Returns (5-15%)" --> PLAY
    WINBACK -- "Stays churned" --> CHURNED

    %% Styles
    classDef ftue fill:#4A90D9,stroke:#2C5F8A,color:#fff
    classDef core fill:#4CAF50,stroke:#2E7D32,color:#fff
    classDef money fill:#E91E63,stroke:#AD1457,color:#fff
    classDef retain fill:#FF9800,stroke:#E65100,color:#fff
    classDef segment fill:#9C27B0,stroke:#6A1B9A,color:#fff
    classDef decision fill:#FFC107,stroke:#F57F17,color:#333
    classDef churn fill:#F44336,stroke:#C62828,color:#fff

    class SPLASH,TUT1,TUT2,TUT3,FTUE_SHOP ftue
    class PLAY,REWARD,PROGRESS,ENGAGE core
    class AD_PROMPT,SHOP_VISIT,IAP_PROMPT money
    class DAILY_REWARD,PUSH,SOCIAL,SEASONAL,CHALLENGE,BATTLEPASS retain
    class WHALE,CASUAL,LOYAL segment
    class FTUE_CHECK,PURCHASE_CHECK,D7_CHECK decision
    class CHURNED,WINBACK churn
```

## Key Metrics at Each Stage

| Stage | Key Metric | Healthy Benchmark | Owning Agent |
|-------|-----------|-------------------|-------------|
| Install | Install-to-open rate | > 90% | UI (splash optimization) |
| FTUE Start | Tutorial start rate | > 95% | UI (FTUE flow) |
| FTUE Complete | Tutorial completion rate | 75-85% | UI + Mechanics |
| First Session | Session length | > 5 min | Mechanics (engagement) |
| Core Loop | Levels per session | 3-8 | Mechanics + Difficulty |
| First Ad | Rewarded ad opt-in rate | 30-50% | Monetization |
| First Purchase | Conversion rate (D0-D7) | 2-5% | Monetization |
| D1 Retention | % returning Day 1 | 40-50% | All (core loop quality) |
| D7 Retention | % returning Day 7 | 25-40% | Economy + LiveOps |
| D30 Retention | % returning Day 30 | 10-20% | LiveOps + AB Testing |
| ARPDAU | Avg revenue per daily active user | $0.05-0.15 | Monetization + Economy |
| LTV | Lifetime value per install | $0.50-5.00 | All agents |

## Decision Points Detail

### Decision 1: Does the player complete FTUE?

```mermaid
graph LR
    START["FTUE Begins"] --> Q1{"Understands<br/>controls?"}
    Q1 -- "Yes" --> Q2{"Completes<br/>first level?"}
    Q1 -- "No (confused)" --> DROP1["Drops at Tutorial<br/><i>~5% of installs</i>"]
    Q2 -- "Yes" --> Q3{"Claims first<br/>reward?"}
    Q2 -- "No (too hard)" --> DROP2["Drops at First Level<br/><i>~8% of installs</i>"]
    Q3 -- "Yes" --> DONE["FTUE Complete<br/><i>~82% of installs</i>"]
    Q3 -- "No (loses interest)" --> DROP3["Drops Before Reward<br/><i>~5% of installs</i>"]

    classDef drop fill:#F44336,stroke:#C62828,color:#fff
    classDef pass fill:#4CAF50,stroke:#2E7D32,color:#fff
    class DROP1,DROP2,DROP3 drop
    class DONE pass
```

### Decision 2: Does the player make a first purchase?

The "payer conversion" funnel determines which monetization path a player takes:

- **Whale (0.5-2%)**: Spends > $100 lifetime. Receives VIP treatment, exclusive offers, premium cosmetics.
- **Dolphin (3-8%)**: Spends $10-100 lifetime. Regular purchaser of battle passes and bundles.
- **Minnow (5-10%)**: Spends $1-10 lifetime. Occasional impulse purchases.
- **Free (80-90%)**: Never spends. Monetized through ads and engagement (contributes to social features, leaderboards).

### Decision 3: Does the player return on Day 7?

D7 retention is the strongest early predictor of long-term engagement. Players who return on D7 are 3-5x more likely to become D30 retained.

The Economy Agent and LiveOps Agent are the primary levers:
- Economy ensures the player has meaningful goals to return for (upgrade they are saving toward, daily reward streak).
- LiveOps ensures there is fresh content (new event starting, limited-time challenge).
- Push notifications from the Monetization Agent remind players of these reasons to return.

## Agent Responsibility Map

```mermaid
graph LR
    subgraph JourneyStages["Journey Stage -> Responsible Agent"]
        S1["Install + FTUE"] --> A1["UI Agent"]
        S2["Core Loop"] --> A2["Mechanics + Difficulty"]
        S3["Rewards + Spending"] --> A3["Economy Agent"]
        S4["Ads + IAP"] --> A4["Monetization Agent"]
        S5["Retention Hooks"] --> A5["LiveOps Agent"]
        S6["Optimization"] --> A6["AB Testing + Analytics"]
        S7["Content + Polish"] --> A7["Asset Agent"]
    end
```

Every stage is measurable via the Analytics Agent's `StandardEvents` taxonomy (see [Shared Interfaces](../Verticals/00_SharedInterfaces.md)). The AB Testing Agent continuously runs experiments to optimize conversion at each decision point.
