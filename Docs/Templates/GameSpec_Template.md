# Game Spec Template

The input document to the entire AI Engine pipeline. Every game begins as a Game Spec. Agents consume this specification to generate mechanics, economy, monetization, LiveOps, difficulty curves, and UI.

---

## How to Use

1. Copy this template into a new file named `GameSpec_<GameName>.md`.
2. Fill in every **(required)** field. Optional fields improve output quality but are not blocking.
3. Validate against the rules in the **Validation Rules** section below.
4. Submit the completed spec as the pipeline input. All downstream agents read from this document.

---

## Template

### Metadata

| Field | Value |
|-------|-------|
| **Spec Version** | 1.0 |
| **Author** | _(required)_ |
| **Date Created** | _(required)_ ISO 8601 date |
| **Last Updated** | _(optional)_ ISO 8601 date |
| **Status** | _(required)_ `draft` / `review` / `approved` |

### Core Identity

| Field | Value |
|-------|-------|
| **Game Name** | _(required)_ Unique, marketable title |
| **Genre** | _(required)_ e.g., casual, hyper-casual, mid-core, simulation |
| **Mechanic Type** | _(required)_ `runner` / `merge` / `pvp` / `puzzle` / `tapper` / `idle` / `match3` / `builder` / other |
| **Theme Description** | _(required)_ 2-4 sentences describing the visual and narrative theme |
| **Art Style** | _(required)_ e.g., cartoon 2D, low-poly 3D, pixel art, realistic, hand-drawn |

### Audience

| Field | Value |
|-------|-------|
| **Target Age Range** | _(required)_ e.g., 8-12, 13-17, 18-35, 35+ |
| **Player Type** | _(required)_ `casual` / `mid-core` / `hardcore` |
| **Primary Platform** | _(optional)_ `iOS` / `Android` / `both` (default: `both`) |

### Monetization

| Field | Value |
|-------|-------|
| **Monetization Tier** | _(required)_ `ad-supported` / `IAP-focused` / `hybrid` |
| **Session Length Target** | _(required)_ Duration in seconds (e.g., 180 for 3 min) |
| **Sessions Per Day Target** | _(optional)_ Expected daily sessions (default: 3) |

### Reference Games

List 1-3 existing games that capture the intended feel. At least one is required.

| # | Game Title | What to Borrow |
|---|------------|----------------|
| 1 | _(required)_ | _(required)_ Brief note on what aspect to reference |
| 2 | _(optional)_ | _(optional)_ |
| 3 | _(optional)_ | _(optional)_ |

### Special Requirements

_(optional)_ Free-form section for anything not covered above: accessibility needs, localization targets, platform-specific constraints, seasonal launch timing, IP considerations, etc.

```
[Write special requirements here, or leave blank]
```

---

## Validation Rules

1. **Game Name** must be non-empty and no longer than 40 characters.
2. **Mechanic Type** must match one of the recognized types or declare `other` with a description.
3. **Target Age Range** must be a valid range where min < max, both positive integers.
4. **Session Length Target** must be between 30 and 1800 seconds (30 seconds to 30 minutes).
5. **Monetization Tier** must be one of the three allowed values.
6. **Reference Games** must include at least one entry with both title and note filled.
7. **Theme Description** must be between 20 and 500 characters.
8. **Art Style** must be non-empty.

---

## Completed Example

### Metadata

| Field | Value |
|-------|-------|
| **Spec Version** | 1.0 |
| **Author** | Alex Chen |
| **Date Created** | 2026-04-09 |
| **Last Updated** | 2026-04-09 |
| **Status** | approved |

### Core Identity

| Field | Value |
|-------|-------|
| **Game Name** | Jungle Dash |
| **Genre** | casual |
| **Mechanic Type** | runner |
| **Theme Description** | A vibrant jungle adventure where the player is a young explorer sprinting through ancient temple ruins, leaping over vines, sliding under fallen trees, and collecting golden relics scattered along overgrown paths. |
| **Art Style** | cartoon 2D |

### Audience

| Field | Value |
|-------|-------|
| **Target Age Range** | 8-35 |
| **Player Type** | casual |
| **Primary Platform** | both |

### Monetization

| Field | Value |
|-------|-------|
| **Monetization Tier** | hybrid |
| **Session Length Target** | 180 |
| **Sessions Per Day Target** | 4 |

### Reference Games

| # | Game Title | What to Borrow |
|---|------------|----------------|
| 1 | Subway Surfers | Endless runner feel, swipe controls, power-up system |
| 2 | Temple Run | Theme of ancient ruins, obstacle variety |
| 3 | Crossy Road | Monetization approach, short session loop |

### Special Requirements

```
- Must support offline play for the core runner loop.
- Localize for EN, ES, PT-BR, JA at launch.
- Target 60 FPS on devices from 2021 onward.
- No loot boxes or gacha mechanics (COPPA-adjacent audience).
```

---

## Related Documents

- [Shared Interfaces](../Verticals/00_SharedInterfaces.md) -- Core data types referenced by all templates
- [Level Definition Template](./LevelDefinition_Template.md) -- Define levels for the game
- [Economy Table Template](./EconomyTable_Template.md) -- Economy configuration
- [Mechanic Module Template](./MechanicModule_Template.md) -- Mechanic definition
- [System Overview](../Architecture/SystemOverview.md) -- Pipeline architecture
- [Data Contracts](../Pipeline/DataContracts.md) -- Agent I/O schemas
