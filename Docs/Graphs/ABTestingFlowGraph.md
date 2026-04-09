# AB Testing Flow Graph

The hypothesis-to-optimization cycle that the AB Testing Agent runs continuously after the initial game build. This is a closed loop: every experiment either produces a winner that gets applied or generates a new hypothesis.

See [System Overview](../Architecture/SystemOverview.md) for how AB Testing fits into the optimization layer and [Shared Interfaces](../Verticals/00_SharedInterfaces.md) for the `AnalyticsEvent` and `PlayerContext` schemas.

## The Core Cycle

```mermaid
graph TD
    HYPO["Generate Hypothesis<br/><i>e.g., 'Increasing level reward<br/>by 20% improves D7 retention'</i>"]

    DESIGN["Design Experiment<br/><i>Define variants, sample size,<br/>duration, success metric</i>"]

    BRANCH{"Experiment<br/>Strategy?"}

    FIXED["Fixed-Split Test<br/><i>50/50 or custom split<br/>Fixed for full duration</i>"]

    BANDIT["Multi-Armed Bandit<br/><i>Dynamic allocation<br/>Shifts traffic to winner</i>"]

    RUN_FIXED["Run Experiment<br/><i>Collect data for<br/>7-30 days</i>"]

    RUN_BANDIT["Run Experiment<br/><i>Continuously reallocate<br/>traffic to best variant</i>"]

    SIG{"Statistically<br/>Significant?<br/><i>p < 0.05</i>"}

    GUARD{"Passes<br/>Guardrails?<br/><i>Revenue not down >5%<br/>Retention not down >3%<br/>Crash rate stable</i>"}

    ALLOCATE["Allocate Winner<br/><i>Roll out winning variant<br/>to 100% of users</i>"]

    APPLY_ECON["Apply to Economy<br/><i>Update earn rates,<br/>costs, sink values</i>"]

    APPLY_DIFF["Apply to Difficulty<br/><i>Update curve shape,<br/>level parameters</i>"]

    APPLY_MON["Apply to Monetization<br/><i>Update pricing,<br/>ad frequency</i>"]

    INCONCLUSIVE["Inconclusive<br/><i>Extend duration or<br/>increase sample size</i>"]

    FAILED["Guardrail Failed<br/><i>Kill experiment<br/>Revert to control</i>"]

    NEW_HYPO["Generate New Hypothesis<br/><i>Based on learnings<br/>from this experiment</i>"]

    %% Main flow
    HYPO --> DESIGN
    DESIGN --> BRANCH

    BRANCH -- "A/B or A/B/C" --> FIXED
    BRANCH -- "Continuous optimization" --> BANDIT

    FIXED --> RUN_FIXED
    BANDIT --> RUN_BANDIT

    RUN_FIXED --> SIG
    RUN_BANDIT --> SIG

    SIG -- "Yes" --> GUARD
    SIG -- "No (need more data)" --> INCONCLUSIVE
    INCONCLUSIVE --> RUN_FIXED
    INCONCLUSIVE --> RUN_BANDIT

    GUARD -- "Yes" --> ALLOCATE
    GUARD -- "No" --> FAILED

    ALLOCATE --> APPLY_ECON
    ALLOCATE --> APPLY_DIFF
    ALLOCATE --> APPLY_MON

    APPLY_ECON --> NEW_HYPO
    APPLY_DIFF --> NEW_HYPO
    APPLY_MON --> NEW_HYPO
    FAILED --> NEW_HYPO

    NEW_HYPO --> HYPO

    %% Styles
    classDef decision fill:#FFC107,stroke:#F57F17,color:#333
    classDef action fill:#4A90D9,stroke:#2C5F8A,color:#fff
    classDef apply fill:#4CAF50,stroke:#2E7D32,color:#fff
    classDef fail fill:#F44336,stroke:#C62828,color:#fff

    class BRANCH,SIG,GUARD decision
    class HYPO,DESIGN,FIXED,BANDIT,RUN_FIXED,RUN_BANDIT,ALLOCATE,INCONCLUSIVE,NEW_HYPO action
    class APPLY_ECON,APPLY_DIFF,APPLY_MON apply
    class FAILED fail
```

## Fixed-Split vs Multi-Armed Bandit

| Property | Fixed-Split A/B | Multi-Armed Bandit |
|----------|----------------|-------------------|
| Traffic allocation | Even split, locked for duration | Dynamic, shifts toward winner |
| Best for | Clear hypothesis, need statistical rigor | Continuous optimization, minimize regret |
| Duration | 7-30 days (fixed) | Ongoing (converges over time) |
| Statistical method | Frequentist (p-value) | Bayesian (Thompson sampling) |
| Risk | 50% of users on losing variant | Small % stay on losing variant |
| Use cases | Pricing changes, major UX changes | Ad frequency, reward amounts, difficulty tuning |

## Guardrail Checks

Every experiment must pass guardrails before the winner is applied:

```mermaid
graph LR
    WIN["Winning Variant<br/>Identified"]

    G1{"Revenue<br/>delta > -5%?"}
    G2{"D1 Retention<br/>delta > -3%?"}
    G3{"D7 Retention<br/>delta > -3%?"}
    G4{"Crash rate<br/>delta < +1%?"}
    G5{"Session length<br/>delta > -10%?"}

    PASS["All Guardrails Pass<br/>-> Allocate Winner"]
    KILL["Any Guardrail Fails<br/>-> Kill Experiment"]

    WIN --> G1
    G1 -- "Pass" --> G2
    G2 -- "Pass" --> G3
    G3 -- "Pass" --> G4
    G4 -- "Pass" --> G5
    G5 -- "Pass" --> PASS

    G1 -- "Fail" --> KILL
    G2 -- "Fail" --> KILL
    G3 -- "Fail" --> KILL
    G4 -- "Fail" --> KILL
    G5 -- "Fail" --> KILL

    classDef guard fill:#FFC107,stroke:#F57F17,color:#333
    classDef pass fill:#4CAF50,stroke:#2E7D32,color:#fff
    classDef fail fill:#F44336,stroke:#C62828,color:#fff

    class G1,G2,G3,G4,G5 guard
    class PASS pass
    class KILL fail
```

## Feedback Targets

The AB Testing Agent sends `ExperimentResults` to three downstream agents:

| Target Agent | What Gets Tuned | Example |
|-------------|----------------|---------|
| **Economy** | Earn rates, sink costs, currency conversion | "Level reward +20% for D0-D3 players" |
| **Difficulty** | Curve shape, level parameters, time limits | "Reduce enemy count by 15% in levels 5-10" |
| **Monetization** | Ad frequency, IAP pricing, offer timing | "Show rewarded ad prompt after 2nd fail, not 1st" |

## Typical Experiment Lifecycle

```mermaid
graph LR
    D0["Day 0<br/>Hypothesis formed"] --> D1["Day 1<br/>Experiment configured"]
    D1 --> D2["Day 2<br/>Traffic split begins"]
    D2 --> D9["Day 9<br/>First significance check"]
    D9 --> D14["Day 14<br/>Guardrail check"]
    D14 --> D15["Day 15<br/>Winner allocated"]
    D15 --> D16["Day 16<br/>Parameters applied"]
    D16 --> D17["Day 17<br/>New hypothesis generated"]

    style D0 fill:#E8E8E8,stroke:#999
    style D15 fill:#4CAF50,stroke:#2E7D32,color:#fff
    style D17 fill:#4A90D9,stroke:#2C5F8A,color:#fff
```

The cycle repeats continuously. A mature game may run 5-15 concurrent experiments across different parameters and player segments.
