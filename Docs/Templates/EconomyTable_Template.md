# Economy Table Template

Full economy configuration for a game. The Economy Agent produces this table and all other agents reference it for currency names, faucet/sink balances, energy systems, and pass configurations. All currency types align with the `CurrencyType`, `CurrencyAmount`, and `Price` interfaces from Shared Interfaces.

---

## How to Use

1. Copy this template into a new file named `EconomyTable_<GameName>.md`.
2. Fill in every **(required)** field. Design faucets and sinks to balance over a target player lifetime.
3. Validate against the rules in the **Validation Rules** section.
4. The Economy Agent will tune multipliers; this table provides the baseline configuration.

---

## Template

### Metadata

| Field | Value |
|-------|-------|
| **Spec Version** | 1.0 |
| **Game Name** | _(required)_ Must match a GameSpec |
| **Author** | _(required)_ |
| **Date Created** | _(required)_ ISO 8601 date |
| **Status** | _(required)_ `draft` / `review` / `approved` |

### Basic Currency

| Field | Value |
|-------|-------|
| **Currency Name** | _(required)_ Display name (e.g., "Coins", "Gold") |
| **Currency Icon** | _(required)_ Asset reference or emoji placeholder |
| **Starting Balance** | _(required)_ Amount granted to new players |

### Premium Currency

| Field | Value |
|-------|-------|
| **Currency Name** | _(required)_ Display name (e.g., "Gems", "Diamonds") |
| **Currency Icon** | _(required)_ Asset reference or emoji placeholder |
| **Starting Balance** | _(required)_ Amount granted to new players |

### Faucet Table (Sources of Currency)

Each row is a source that grants currency to the player.

| Source Name | Currency Type | Amount | Frequency | Notes |
|-------------|---------------|--------|-----------|-------|
| _(required)_ | `basic` / `premium` | _(required)_ positive int | _(required)_ e.g., per_level, per_day, one_time | _(optional)_ |
| _(add rows)_ | | | | |

### Sink Table (Destinations for Currency)

Each row is a destination where the player spends currency.

| Sink Name | Currency Type | Cost | Category | Notes |
|-----------|---------------|------|----------|-------|
| _(required)_ | `basic` / `premium` | _(required)_ positive int | _(required)_ e.g., upgrade, cosmetic, consumable, unlock | _(optional)_ |
| _(add rows)_ | | | | |

### Energy System

_(optional)_ Omit this section entirely if the game has no energy mechanic.

| Field | Value |
|-------|-------|
| **Energy Name** | _(required if section present)_ Display name (e.g., "Lives", "Hearts") |
| **Max Energy** | _(required)_ Maximum capacity |
| **Regen Rate** | _(required)_ Units regenerated per minute |
| **Regen Cap** | _(optional)_ Max energy from regen alone (may differ from Max Energy) |
| **Refill Cost (Premium)** | _(required)_ Premium currency cost for full refill |
| **Energy Per Action** | _(required)_ Energy consumed per level/action |

### Pass Configuration

_(optional)_ Omit this section if the game has no battle/season pass.

| Field | Value |
|-------|-------|
| **Pass Name** | _(required if section present)_ Display name |
| **Duration (days)** | _(required)_ How long the pass lasts |
| **Tier Count** | _(required)_ Number of tiers in the pass |
| **Premium Pass Price** | _(required)_ `Price` object: type, amount, currency |
| **Free Track Rewards** | _(required)_ Summary of total free rewards across all tiers |
| **Premium Track Rewards** | _(required)_ Summary of total premium rewards across all tiers |

### Reward Tier Multipliers

Maps `RewardTier` to economy multipliers per the Difficulty-Economy contract.

| Reward Tier | Basic Currency Multiplier | XP Multiplier | Item Drop Chance |
|-------------|---------------------------|---------------|------------------|
| easy | _(required)_ | _(required)_ | _(required)_ 0.0-1.0 |
| medium | _(required)_ | _(required)_ | _(required)_ |
| hard | _(required)_ | _(required)_ | _(required)_ |
| very_hard | _(required)_ | _(required)_ | _(required)_ |
| extreme | _(required)_ | _(required)_ | _(required)_ |

---

## Validation Rules

1. **Currency Names** must be non-empty and unique (basic != premium).
2. **Starting Balances** must be non-negative integers.
3. **Faucet amounts** must all be positive integers.
4. **Sink costs** must all be positive integers.
5. **Energy Max** must be >= 1 if energy system is present.
6. **Regen Rate** must be > 0 if energy system is present.
7. **Refill Cost** must be a positive integer.
8. **Pass Duration** must be between 1 and 90 days.
9. **Reward Tier Multipliers** must be in ascending order from easy to extreme.
10. **Item Drop Chance** must be between 0.0 and 1.0 inclusive.
11. The total daily faucet output (across all sources) should exceed the minimum daily sink cost to avoid hard-blocking free players.

---

## Completed Example

### Metadata

| Field | Value |
|-------|-------|
| **Spec Version** | 1.0 |
| **Game Name** | Garden Merge |
| **Author** | Priya Kapoor |
| **Date Created** | 2026-04-09 |
| **Status** | approved |

### Basic Currency

| Field | Value |
|-------|-------|
| **Currency Name** | Petals |
| **Currency Icon** | `asset:icon_petal_gold` |
| **Starting Balance** | 500 |

### Premium Currency

| Field | Value |
|-------|-------|
| **Currency Name** | Dewdrops |
| **Currency Icon** | `asset:icon_dewdrop_blue` |
| **Starting Balance** | 25 |

### Faucet Table

| Source Name | Currency Type | Amount | Frequency | Notes |
|-------------|---------------|--------|-----------|-------|
| Merge completion | basic | 10 | per_merge | Base reward per successful merge |
| Daily login | basic | 100 | per_day | Escalates over 7-day streak |
| Daily login (premium) | premium | 5 | per_day | Days 5+ of streak only |
| Level complete | basic | 50 | per_level | Before tier multiplier |
| Rewarded ad | basic | 75 | per_view | Max 5/day |
| Achievement unlock | premium | 10 | one_time | Per achievement |
| Garden milestone | basic | 200 | one_time | Per garden expansion tier |

### Sink Table

| Sink Name | Currency Type | Cost | Category | Notes |
|-----------|---------------|------|----------|-------|
| Speed boost (1 hr) | basic | 150 | consumable | Speeds all merge timers |
| Garden plot unlock | basic | 500 | unlock | Each successive plot costs 1.5x more |
| Premium seed | premium | 15 | consumable | Guaranteed rare merge result |
| Cosmetic planter | premium | 30 | cosmetic | Decorative only |
| Extra merge slot | basic | 300 | upgrade | Permanent, max 3 purchases |
| Energy refill | premium | 10 | consumable | Full energy restore |

### Energy System

| Field | Value |
|-------|-------|
| **Energy Name** | Sunshine |
| **Max Energy** | 20 |
| **Regen Rate** | 0.33 (1 per 3 minutes) |
| **Regen Cap** | 20 |
| **Refill Cost (Premium)** | 10 Dewdrops |
| **Energy Per Action** | 1 per merge attempt |

### Pass Configuration

| Field | Value |
|-------|-------|
| **Pass Name** | Garden Pass |
| **Duration (days)** | 30 |
| **Tier Count** | 30 |
| **Premium Pass Price** | `{ type: "real_money", amount: 499, currency: "USD" }` |
| **Free Track Rewards** | 1500 Petals, 10 Dewdrops, 3 cosmetic items |
| **Premium Track Rewards** | 5000 Petals, 60 Dewdrops, 1 exclusive garden theme, 8 cosmetic items |

### Reward Tier Multipliers

| Reward Tier | Basic Currency Multiplier | XP Multiplier | Item Drop Chance |
|-------------|---------------------------|---------------|------------------|
| easy | 1.0 | 1.0 | 0.05 |
| medium | 1.5 | 1.3 | 0.12 |
| hard | 2.5 | 1.8 | 0.25 |
| very_hard | 3.5 | 2.5 | 0.40 |
| extreme | 5.0 | 3.5 | 0.60 |

---

## Related Documents

- [Shared Interfaces](../Verticals/00_SharedInterfaces.md) -- `CurrencyType`, `CurrencyAmount`, `Price`, `RewardTier`, `RewardTierConfig`
- [Game Spec Template](./GameSpec_Template.md) -- Monetization tier drives economy shape
- [Level Definition Template](./LevelDefinition_Template.md) -- Rewards reference this table
- [Ad Placement Template](./AdPlacement_Template.md) -- Ad rewards tie into faucet table
- [Event Definition Template](./EventDefinition_Template.md) -- Event reward budgets
