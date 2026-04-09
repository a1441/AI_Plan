# Level Definition Template

Defines a single level within a game. The Difficulty Agent and Core Mechanics Agent consume these definitions to produce playable content. Each level maps to a `DifficultyScore` and `RewardTier` from the shared interfaces.

---

## How to Use

1. Copy this template into a new file named `Level_<GameName>_<LevelNumber>.md`.
2. Fill in every **(required)** field. Mechanic-specific parameters vary by game type.
3. Validate against the rules in the **Validation Rules** section.
4. The `difficulty_score` drives reward tier via the `DIFFICULTY_REWARD_MAP` in Shared Interfaces.

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

### Level Identity

| Field | Value |
|-------|-------|
| **Level Number** | _(required)_ Positive integer, sequential |
| **Level Name** | _(optional)_ Display name shown to player |
| **Difficulty Score** | _(required)_ Integer 1-10 (`DifficultyScore`) |
| **Reward Tier** | _(auto-derived)_ Determined by `DIFFICULTY_REWARD_MAP` |
| **Special Type** | _(optional)_ `tutorial` / `boss` / `event` / `bonus` / `none` (default: `none`) |

### Time and Pacing

| Field | Value |
|-------|-------|
| **Time Limit (seconds)** | _(required)_ 0 = no time limit; positive integer otherwise |
| **Estimated Play Time (seconds)** | _(optional)_ Expected completion time for average player |

### Mechanic-Specific Parameters

Define parameters as key-value pairs. These correspond to `ParamDefinition` entries from `IMechanic.getAdjustableParams()`.

| Parameter Name | Type | Value | Description |
|----------------|------|-------|-------------|
| _(required)_ | `int` / `float` | _(required)_ | _(required)_ |
| _(add rows as needed)_ | | | |

### Win Condition

_(required)_ Describe the condition the player must meet to complete the level.

```
[e.g., "Reach 2000 meters without dying"]
```

### Lose Condition

_(required)_ Describe the condition(s) that cause the player to fail.

```
[e.g., "Collide with 3 obstacles OR time expires"]
```

### Rewards

| Field | Value |
|-------|-------|
| **Basic Currency Amount** | _(required)_ Base amount before tier multiplier |
| **XP Granted** | _(required)_ Base XP before tier multiplier |
| **Item Drops** | _(optional)_ List of `ItemReward` entries: `itemId:quantity` |
| **Star Thresholds** | _(optional)_ 1-star / 2-star / 3-star score thresholds |

### Special Conditions

_(optional)_ Notes on tutorial popups, boss behavior, event ties, or other unique aspects of this level.

```
[Write special conditions here, or leave blank]
```

---

## Validation Rules

1. **Level Number** must be a positive integer. No gaps in the sequence per game.
2. **Difficulty Score** must be an integer between 1 and 10 inclusive.
3. **Time Limit** must be 0 or a positive integer. Maximum 600 seconds.
4. **Mechanic-Specific Parameters** must each fall within the `min`/`max` range defined in the mechanic's `ParamDefinition`.
5. **Win Condition** and **Lose Condition** must both be non-empty.
6. **Basic Currency Amount** must be a positive integer.
7. **XP Granted** must be a non-negative integer.
8. **Star Thresholds**, if provided, must be in ascending order (1-star < 2-star < 3-star).
9. **Reward Tier** must match `DIFFICULTY_REWARD_MAP[difficulty_score]`. Do not set manually.

---

## Completed Example

### Metadata

| Field | Value |
|-------|-------|
| **Spec Version** | 1.0 |
| **Game Name** | Jungle Dash |
| **Author** | Alex Chen |
| **Date Created** | 2026-04-09 |
| **Status** | approved |

### Level Identity

| Field | Value |
|-------|-------|
| **Level Number** | 15 |
| **Level Name** | Temple Gauntlet |
| **Difficulty Score** | 5 |
| **Reward Tier** | hard |
| **Special Type** | none |

### Time and Pacing

| Field | Value |
|-------|-------|
| **Time Limit (seconds)** | 120 |
| **Estimated Play Time (seconds)** | 90 |

### Mechanic-Specific Parameters

| Parameter Name | Type | Value | Description |
|----------------|------|-------|-------------|
| speed | float | 7.5 | Player run speed (meters/sec) |
| enemyCount | int | 4 | Number of active enemies on screen |
| obstacleFrequency | float | 2.0 | Obstacles spawned per second |
| powerUpChance | float | 0.15 | Probability of power-up spawn per segment |
| gapWidth | float | 3.5 | Width of platform gaps in meters |

### Win Condition

```
Reach 2000 meters without dying. Player must survive all obstacle segments and cross the temple gate finish line.
```

### Lose Condition

```
Collide with 3 obstacles (health = 0) OR fall into a gap OR time expires (120 seconds).
```

### Rewards

| Field | Value |
|-------|-------|
| **Basic Currency Amount** | 150 |
| **XP Granted** | 80 |
| **Item Drops** | golden_relic:1, speed_boost:2 |
| **Star Thresholds** | 1-star: 1000 pts / 2-star: 1800 pts / 3-star: 2500 pts |

### Special Conditions

```
- First level with 4 simultaneous enemies; brief tooltip introduces dodge-slide combo.
- Enemy patrol patterns alternate between left-right and circular.
- Background music transitions to faster tempo at 1500 meters.
```

---

## Related Documents

- [Shared Interfaces](../Verticals/00_SharedInterfaces.md) -- `DifficultyScore`, `RewardTier`, `DIFFICULTY_REWARD_MAP`, `ParamDefinition`
- [Game Spec Template](./GameSpec_Template.md) -- The game this level belongs to
- [Economy Table Template](./EconomyTable_Template.md) -- Reward multipliers per tier
- [Mechanic Module Template](./MechanicModule_Template.md) -- Parameter definitions for the mechanic
