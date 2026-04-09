# Mechanic Module Template

Defines a new core mechanic type for the engine. The Core Mechanics Agent implements mechanics conforming to the `IMechanic` interface from Shared Interfaces. This template captures the game design intent so the agent can produce a working mechanic module.

---

## How to Use

1. Copy this template into a new file named `Mechanic_<MechanicName>.md`.
2. Fill in every **(required)** field. The difficulty parameters section is critical for the Difficulty Agent.
3. Validate against the rules in the **Validation Rules** section.
4. The mechanic must implement `IMechanic` from Shared Interfaces. The **IMechanic Mapping Notes** section documents how this design maps to that interface.

---

## Template

### Metadata

| Field | Value |
|-------|-------|
| **Spec Version** | 1.0 |
| **Mechanic Name** | _(required)_ Unique name, PascalCase |
| **Author** | _(required)_ |
| **Date Created** | _(required)_ ISO 8601 date |
| **Status** | _(required)_ `draft` / `review` / `approved` |

### Classification

| Field | Value |
|-------|-------|
| **Genre** | _(required)_ e.g., casual, hyper-casual, mid-core, arcade |
| **Mechanic Type Key** | _(required)_ snake_case key used in `MechanicConfig.mechanicType` |
| **Complexity** | _(optional)_ `simple` / `moderate` / `complex` (default: `moderate`) |

### Reference Games

| # | Game Title | Mechanic Aspect to Reference |
|---|------------|------------------------------|
| 1 | _(required)_ | _(required)_ |
| 2 | _(optional)_ | _(optional)_ |
| 3 | _(optional)_ | _(optional)_ |

### Core Loop

_(required)_ Describe the fundamental gameplay loop in 3-6 steps. This is what the player repeats every session.

```
1. [Step 1]
2. [Step 2]
3. [Step 3]
...
```

### Input Model

_(required)_ Define which gestures/inputs the player uses.

| Gesture | Action | Context |
|---------|--------|---------|
| _(required, at least one)_ | _(required)_ What it does | _(optional)_ When it applies |
| _(add rows)_ | | |

### Scoring Formula

_(required)_ Define how points are calculated.

```
[Formula or pseudocode describing score calculation]
```

### Difficulty Parameters

Each parameter maps to a `ParamDefinition` in `IMechanic.getAdjustableParams()`. The Difficulty Agent tunes these per level.

| Parameter Name | Type | Min | Max | Default | Description |
|----------------|------|-----|-----|---------|-------------|
| _(required, at least 2)_ | `int` / `float` | _(required)_ | _(required)_ | _(required)_ | _(required)_ |
| _(add rows)_ | | | | | |

### Win Conditions

_(required)_ List all possible win conditions for levels using this mechanic.

| Condition ID | Description | Parameters |
|-------------|-------------|------------|
| _(required, at least one)_ | _(required)_ | _(optional)_ Configurable thresholds |
| _(add rows)_ | | |

### Lose Conditions

_(required)_ List all possible lose conditions.

| Condition ID | Description | Parameters |
|-------------|-------------|------------|
| _(required, at least one)_ | _(required)_ | _(optional)_ Configurable thresholds |
| _(add rows)_ | | |

### IMechanic Mapping Notes

_(required)_ Document how this mechanic design maps to the `IMechanic` interface.

| IMechanic Method/Event | Implementation Notes |
|------------------------|---------------------|
| `init(config)` | _(required)_ What setup occurs |
| `start()` | _(required)_ What begins |
| `pause() / resume()` | _(required)_ Pause behavior |
| `dispose()` | _(required)_ Cleanup notes |
| `setDifficultyParams()` | _(required)_ Which params are adjustable mid-level vs. level-start only |
| `onLevelComplete` | _(required)_ When and how this fires |
| `onPlayerDied` | _(required)_ Death/failure semantics |
| `onScoreChanged` | _(required)_ Score update frequency |
| `onCurrencyEarned` | _(required)_ In-level currency earn triggers |

---

## Validation Rules

1. **Mechanic Name** must be PascalCase, no spaces, 3-30 characters.
2. **Mechanic Type Key** must be snake_case and unique across all mechanics.
3. **Core Loop** must have between 3 and 6 steps.
4. **Input Model** must have at least one gesture entry.
5. **Difficulty Parameters** must have at least 2 entries.
6. For each parameter: **Min** < **Default** < **Max** (or Min <= Default <= Max).
7. Parameter **Type** must be `int` or `float`.
8. **Win Conditions** and **Lose Conditions** must each have at least one entry.
9. **IMechanic Mapping Notes** must have entries for all listed methods/events.
10. **Reference Games** must have at least one entry.

---

## Completed Example

### Metadata

| Field | Value |
|-------|-------|
| **Spec Version** | 1.0 |
| **Mechanic Name** | Tapper |
| **Author** | Jordan Wu |
| **Date Created** | 2026-04-09 |
| **Status** | approved |

### Classification

| Field | Value |
|-------|-------|
| **Genre** | hyper-casual |
| **Mechanic Type Key** | tapper |
| **Complexity** | simple |

### Reference Games

| # | Game Title | Mechanic Aspect to Reference |
|---|------------|------------------------------|
| 1 | Piano Tiles | Lane-based tapping with increasing speed |
| 2 | Tap Tap Dash | Rhythm and timing, one-tap simplicity |
| 3 | Cookie Clicker | Satisfying tap feedback loop, multiplier escalation |

### Core Loop

```
1. Targets appear on screen in defined lanes/zones.
2. Player taps targets before they expire or leave the screen.
3. Successful taps earn points; combos multiply score.
4. Misses or wrong taps reduce health/lives.
5. Speed and target density increase over time.
6. Level ends on win condition (score target) or lose condition (health depleted).
```

### Input Model

| Gesture | Action | Context |
|---------|--------|---------|
| Single tap | Hit target | Tap on a target in any lane |
| Long press | Charge tap | Hold on a charge target for bonus points |
| Double tap | Burst mode | Tap rapidly on burst targets (2 taps in 0.3s) |

### Scoring Formula

```
base_points = target_type_value  (normal=10, charge=25, burst=15 per tap)
combo_multiplier = min(combo_streak * 0.1 + 1.0, 5.0)
time_bonus = max(0, (time_limit - elapsed) * 2)
level_score = sum(base_points * combo_multiplier) + time_bonus
```

### Difficulty Parameters

| Parameter Name | Type | Min | Max | Default | Description |
|----------------|------|-----|-----|---------|-------------|
| spawnRate | float | 0.5 | 5.0 | 1.5 | Targets spawned per second |
| targetLifetime | float | 0.5 | 4.0 | 2.0 | Seconds before a target expires |
| laneCount | int | 2 | 6 | 3 | Number of active lanes |
| chargeTargetRatio | float | 0.0 | 0.4 | 0.1 | Proportion of targets that are charge type |
| burstTargetRatio | float | 0.0 | 0.3 | 0.05 | Proportion of targets that are burst type |
| speedRampRate | float | 0.0 | 0.5 | 0.1 | How much spawnRate increases per 10 seconds |
| maxHealth | int | 1 | 10 | 3 | Misses allowed before losing |

### Win Conditions

| Condition ID | Description | Parameters |
|-------------|-------------|------------|
| score_target | Player reaches a target score | `targetScore: int` |
| survival_time | Player survives for a set duration | `survivalSeconds: int` |
| clear_all | Player clears all spawned targets in a finite wave | `waveSize: int` |

### Lose Conditions

| Condition ID | Description | Parameters |
|-------------|-------------|------------|
| health_depleted | Player misses too many targets | `maxHealth` (from difficulty params) |
| time_expired | Timer runs out before win condition met | `timeLimit: int` |

### IMechanic Mapping Notes

| IMechanic Method/Event | Implementation Notes |
|------------------------|---------------------|
| `init(config)` | Creates lane layout, loads target sprites per theme, initializes health to `maxHealth`, resets combo counter |
| `start()` | Begins target spawning at `spawnRate`, starts level timer |
| `pause() / resume()` | Freezes all target timers and spawn clock; resume restores exact state |
| `dispose()` | Destroys all active target objects, clears event subscriptions, releases sprite references |
| `setDifficultyParams()` | `spawnRate`, `targetLifetime`, and `speedRampRate` are adjustable mid-level. `laneCount` and `maxHealth` are level-start only. |
| `onLevelComplete` | Fires when any win condition is met. Payload includes final score, stars (1-3 based on score thresholds), and elapsed time. |
| `onPlayerDied` | Fires when `health_depleted` or `time_expired`. Cause string is the condition ID. |
| `onScoreChanged` | Fires on every successful tap with the delta and new total. |
| `onCurrencyEarned` | Fires on combo milestones (10x, 25x, 50x streak) granting bonus basic currency. |

---

## Related Documents

- [Shared Interfaces](../Verticals/00_SharedInterfaces.md) -- `IMechanic`, `MechanicConfig`, `ParamDefinition`, `MechanicState`, `LevelCompletePayload`
- [Game Spec Template](./GameSpec_Template.md) -- Mechanic type referenced in game spec
- [Level Definition Template](./LevelDefinition_Template.md) -- Levels reference mechanic parameters
- [Slot Architecture](../Architecture/SlotArchitecture.md) -- How mechanic integrates into the shell
