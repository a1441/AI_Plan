# Ad Placement Template

Defines an ad placement rule. The Monetization Agent generates ad placements conforming to the `IAdUnit` interface from Shared Interfaces. Each placement specifies when an ad appears, how often, what reward it grants (if rewarded), and ethical compliance checks.

---

## How to Use

1. Copy this template into a new file named `AdPlacement_<GameName>_<PlacementName>.md`.
2. Fill in every **(required)** field. Rewarded ads must define a reward; other formats must not.
3. Validate against the rules in the **Validation Rules** section.
4. Placements emit `ad_requested` and `ad_watched` analytics events per the standard taxonomy.

---

## Template

### Metadata

| Field | Value |
|-------|-------|
| **Spec Version** | 1.0 |
| **Game Name** | _(required)_ Must match a GameSpec |
| **Placement ID** | _(required)_ Unique identifier, snake_case |
| **Author** | _(required)_ |
| **Date Created** | _(required)_ ISO 8601 date |
| **Status** | _(required)_ `draft` / `review` / `approved` / `disabled` |

### Placement Identity

| Field | Value |
|-------|-------|
| **Placement Name** | _(required)_ Human-readable name |
| **Ad Format** | _(required)_ `interstitial` / `rewarded` / `banner` |
| **Description** | _(optional)_ When and why this ad appears |

### Trigger

| Field | Value |
|-------|-------|
| **Trigger Event** | _(required)_ The game event that causes this ad to show (e.g., `level_complete`, `main_menu_open`, `revive_offered`) |
| **Trigger Condition** | _(optional)_ Additional condition (e.g., "only if level >= 3", "only on loss") |
| **Player Initiated** | _(required)_ `true` if the player opts in (rewarded), `false` if system-triggered |

### Frequency Controls

| Field | Value |
|-------|-------|
| **Frequency Cap (per hour)** | _(required)_ Maximum impressions per hour, 0 = unlimited |
| **Frequency Cap (per session)** | _(required)_ Maximum impressions per session, 0 = unlimited |
| **Frequency Cap (per day)** | _(optional)_ Maximum impressions per day, 0 = unlimited |
| **Cooldown (seconds)** | _(required)_ Minimum seconds between impressions of this placement |
| **First Impression Delay** | _(optional)_ Seconds after session start before first eligible show (default: 0) |

### Reward Configuration

_(required for `rewarded` format; must be omitted for `interstitial` and `banner`)_

| Field | Value |
|-------|-------|
| **Reward Currency Type** | _(required)_ `basic` / `premium` |
| **Reward Amount** | _(required)_ Positive integer |
| **Reward Multiplier Event** | _(optional)_ If applicable, event that doubles the reward (e.g., "watch second ad") |

### Fallback Behavior

_(required)_ What happens if the ad fails to load.

| Field | Value |
|-------|-------|
| **Fallback Action** | _(required)_ `skip` / `retry_once` / `show_alternative` / `grant_partial_reward` |
| **Fallback Detail** | _(optional)_ Additional context (e.g., "grant 50% reward on failure", "show house ad") |

### Segment Overrides

_(optional)_ Override frequency or reward for specific player segments.

| Segment | Override Field | Override Value | Reason |
|---------|---------------|----------------|--------|
| _(optional)_ | _(optional)_ | _(optional)_ | _(optional)_ |
| _(add rows)_ | | | |

### Ethical Compliance Checklist

_(required)_ All items must be checked before approval.

| # | Requirement | Compliant? |
|---|------------|------------|
| 1 | Ad does not interrupt active gameplay (only shown during natural breaks) | _(required)_ `yes` / `no` |
| 2 | Rewarded ads are always opt-in, never forced | _(required)_ `yes` / `no` |
| 3 | Ad frequency does not exceed platform guidelines (e.g., Apple/Google) | _(required)_ `yes` / `no` |
| 4 | Children's audience: compliant with COPPA/GDPR-K if target age < 13 | _(required)_ `yes` / `no` / `n/a` |
| 5 | Close/skip button is clearly visible and functional | _(required)_ `yes` / `no` |
| 6 | No deceptive patterns (fake close buttons, misleading rewards) | _(required)_ `yes` / `no` |
| 7 | Ad content filtering enabled for audience age range | _(required)_ `yes` / `no` |

---

## Validation Rules

1. **Placement ID** must be unique, snake_case, no longer than 64 characters.
2. **Ad Format** must be one of the three allowed values.
3. **Reward Configuration** must be present if and only if format is `rewarded`.
4. **Reward Amount** must be a positive integer.
5. **Frequency Cap (per hour)** must be a non-negative integer.
6. **Frequency Cap (per session)** must be a non-negative integer.
7. **Cooldown** must be a non-negative integer (seconds).
8. **Player Initiated** must be `true` for `rewarded` format.
9. **Fallback Action** must be one of the four allowed values.
10. All **Ethical Compliance Checklist** items must be answered. Any `no` answer blocks approval.
11. Segment override values must reference valid `PlayerContext.segments` dimensions.

---

## Completed Example

### Metadata

| Field | Value |
|-------|-------|
| **Spec Version** | 1.0 |
| **Game Name** | Jungle Dash |
| **Placement ID** | post_level_interstitial |
| **Author** | Marcus Lee |
| **Date Created** | 2026-04-09 |
| **Status** | approved |

### Placement Identity

| Field | Value |
|-------|-------|
| **Placement Name** | Post-Level Interstitial |
| **Ad Format** | interstitial |
| **Description** | Full-screen ad shown after the level results screen, before returning to the map. Appears during a natural transition. |

### Trigger

| Field | Value |
|-------|-------|
| **Trigger Event** | level_complete |
| **Trigger Condition** | Only after levels >= 3 (skip during tutorial levels 1-2) |
| **Player Initiated** | false |

### Frequency Controls

| Field | Value |
|-------|-------|
| **Frequency Cap (per hour)** | 4 |
| **Frequency Cap (per session)** | 3 |
| **Frequency Cap (per day)** | 10 |
| **Cooldown (seconds)** | 120 |
| **First Impression Delay** | 300 |

### Reward Configuration

_(Not applicable -- interstitial format.)_

### Fallback Behavior

| Field | Value |
|-------|-------|
| **Fallback Action** | skip |
| **Fallback Detail** | If ad fails to load, proceed directly to map screen with no delay. |

### Segment Overrides

| Segment | Override Field | Override Value | Reason |
|---------|---------------|----------------|--------|
| spending: whale | Frequency Cap (per session) | 1 | Reduce ad friction for high spenders |
| spending: dolphin | Frequency Cap (per session) | 2 | Moderate reduction for mid spenders |
| lifecycle: new | First Impression Delay | 600 | Longer grace period for new players |

### Ethical Compliance Checklist

| # | Requirement | Compliant? |
|---|------------|------------|
| 1 | Ad does not interrupt active gameplay | yes |
| 2 | Rewarded ads are always opt-in | n/a (interstitial) |
| 3 | Frequency does not exceed platform guidelines | yes |
| 4 | COPPA/GDPR-K compliance | yes (age-gated ad content enabled) |
| 5 | Close/skip button visible | yes |
| 6 | No deceptive patterns | yes |
| 7 | Ad content filtering for audience | yes |

---

## Related Documents

- [Shared Interfaces](../Verticals/00_SharedInterfaces.md) -- `IAdUnit`, `AdResult`, `CurrencyAmount`, `StandardEvents` (ad_requested, ad_watched)
- [Economy Table Template](./EconomyTable_Template.md) -- Ad rewards appear in the faucet table
- [AB Test Definition Template](./ABTestDefinition_Template.md) -- Ad values are frequently A/B tested
- [Game Spec Template](./GameSpec_Template.md) -- Monetization tier drives ad strategy
