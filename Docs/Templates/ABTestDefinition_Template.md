# A/B Test Definition Template

Defines a single experiment. The A/B Testing Agent uses this to configure experiments, assign player segments, and evaluate results. Metrics reference the `StandardEvents` and `AnalyticsEvent` contracts from Shared Interfaces.

---

## How to Use

1. Copy this template into a new file named `ABTest_<GameName>_<ExperimentName>.md`.
2. Fill in every **(required)** field. Use the If/Then/Because format for the hypothesis.
3. Validate against the rules in the **Validation Rules** section.
4. The experiment emits `experiment_assigned` and `experiment_exposed` analytics events per the standard taxonomy.

---

## Template

### Metadata

| Field | Value |
|-------|-------|
| **Spec Version** | 1.0 |
| **Game Name** | _(required)_ Must match a GameSpec |
| **Experiment ID** | _(required)_ Unique identifier, snake_case |
| **Author** | _(required)_ |
| **Date Created** | _(required)_ ISO 8601 date |
| **Status** | _(required)_ `draft` / `running` / `concluded` / `cancelled` |

### Hypothesis

_(required)_ Write in **If / Then / Because** format.

```
IF: [change being made]
THEN: [expected measurable outcome]
BECAUSE: [reasoning or prior evidence]
```

### Test Parameters

| Field | Value |
|-------|-------|
| **Parameter Being Tested** | _(required)_ The specific config value or feature flag |
| **Parameter Location** | _(optional)_ Where this parameter lives (economy table, ad config, etc.) |
| **Metric to Measure (Primary)** | _(required)_ Single primary success metric |
| **Metric to Measure (Secondary)** | _(optional)_ Additional metrics to observe |

### Variants

| Variant ID | Name | Value | Traffic Allocation (%) |
|------------|------|-------|------------------------|
| control | _(required)_ Control | _(required)_ Current production value | _(required)_ |
| variant_a | _(required)_ | _(required)_ | _(required)_ |
| _(add rows for additional variants)_ | | | |

> Traffic allocations must sum to 100%.

### Sample Size and Duration

| Field | Value |
|-------|-------|
| **Minimum Sample Size (per variant)** | _(required)_ Positive integer |
| **Maximum Duration (days)** | _(required)_ Auto-stop after this many days |
| **Minimum Duration (days)** | _(optional)_ Do not evaluate before this (default: 7) |

### Success Criteria

| Field | Value |
|-------|-------|
| **Success Threshold** | _(required)_ Minimum improvement to declare winner (e.g., "+5%") |
| **Confidence Level** | _(optional)_ Statistical confidence required (default: 95%) |
| **One-Sided or Two-Sided** | _(optional)_ `one-sided` / `two-sided` (default: `two-sided`) |

### Guardrail Metrics

Metrics that must NOT degrade beyond acceptable thresholds, even if the primary metric improves.

| Guardrail Metric | Maximum Acceptable Degradation | Notes |
|------------------|-------------------------------|-------|
| _(required, at least one)_ | _(required)_ e.g., "-2%" | _(optional)_ |
| _(add rows)_ | | |

### Eligible Segments

_(optional)_ If omitted, all players are eligible.

| Segment Dimension | Allowed Values |
|-------------------|----------------|
| _(optional)_ e.g., `lifecycle` | _(optional)_ e.g., `activated`, `engaged`, `loyal` |
| _(add rows)_ | |

---

## Validation Rules

1. **Experiment ID** must be unique, snake_case, and no longer than 64 characters.
2. **Hypothesis** must contain all three sections: IF, THEN, BECAUSE.
3. **Variants** must include exactly one `control` row. Minimum 2 variants total.
4. **Traffic Allocation** percentages must sum to exactly 100.
5. **Minimum Sample Size** must be >= 100 per variant.
6. **Maximum Duration** must be between 1 and 90 days.
7. **Success Threshold** must be a non-zero percentage string (e.g., "+5%", "-3%").
8. **Guardrail Metrics** must have at least one entry.
9. **Primary Metric** should map to a known `StandardEvents` event or derived metric.
10. Segment values must use valid `PlayerContext.segments` values from Shared Interfaces.

---

## Completed Example

### Metadata

| Field | Value |
|-------|-------|
| **Spec Version** | 1.0 |
| **Game Name** | Jungle Dash |
| **Experiment ID** | rewarded_ad_coin_value_q2_2026 |
| **Author** | Marcus Lee |
| **Date Created** | 2026-04-09 |
| **Status** | running |

### Hypothesis

```
IF: We increase the rewarded ad coin payout from 50 to 100 coins
THEN: Rewarded ad watch rate will increase by at least 10%
BECAUSE: Player surveys indicate the current reward feels too low relative to
         the 30-second time investment, and competitor benchmarks show higher
         payouts correlate with higher opt-in rates.
```

### Test Parameters

| Field | Value |
|-------|-------|
| **Parameter Being Tested** | `rewarded_ad_coin_reward` in Ad Placement config |
| **Parameter Location** | [Ad Placement: Post-Level Rewarded](./AdPlacement_Template.md) |
| **Metric to Measure (Primary)** | Rewarded ad watch rate (ad_watched events / ad_requested events) |
| **Metric to Measure (Secondary)** | D7 retention, ARPDAU, coins earned per session |

### Variants

| Variant ID | Name | Value | Traffic Allocation (%) |
|------------|------|-------|------------------------|
| control | Current Payout | 50 coins | 50 |
| variant_a | Double Payout | 100 coins | 50 |

### Sample Size and Duration

| Field | Value |
|-------|-------|
| **Minimum Sample Size (per variant)** | 5000 |
| **Maximum Duration (days)** | 21 |
| **Minimum Duration (days)** | 7 |

### Success Criteria

| Field | Value |
|-------|-------|
| **Success Threshold** | +10% |
| **Confidence Level** | 95% |
| **One-Sided or Two-Sided** | one-sided |

### Guardrail Metrics

| Guardrail Metric | Maximum Acceptable Degradation | Notes |
|------------------|-------------------------------|-------|
| D7 Retention | -1% | Core retention must hold |
| ARPDAU | -3% | Revenue must not tank despite higher faucet |
| IAP Conversion Rate | -2% | Free currency must not cannibalize IAP |

### Eligible Segments

| Segment Dimension | Allowed Values |
|-------------------|----------------|
| lifecycle | activated, engaged, loyal |
| spending | minnow, free |

---

## Related Documents

- [Shared Interfaces](../Verticals/00_SharedInterfaces.md) -- `StandardEvents`, `PlayerContext`, `AnalyticsEvent`
- [Economy Table Template](./EconomyTable_Template.md) -- Parameters often tested live in the economy
- [Ad Placement Template](./AdPlacement_Template.md) -- Ad reward values frequently A/B tested
- [Game Spec Template](./GameSpec_Template.md) -- Game context for the experiment
