# Event Definition Template

Defines a single LiveOps event. The LiveOps Agent generates events using this format. Events map to the `IEvent`, `EventConfig`, and `EventMilestone` interfaces from Shared Interfaces. UI Agent renders the event using the `IEvent` contract.

---

## How to Use

1. Copy this template into a new file named `Event_<GameName>_<EventName>.md`.
2. Fill in every **(required)** field. Design milestones to distribute the reward budget across achievable tiers.
3. Validate against the rules in the **Validation Rules** section.
4. Events emit `event_entered`, `event_milestone`, and `event_completed` analytics events per the standard taxonomy.

---

## Template

### Metadata

| Field | Value |
|-------|-------|
| **Spec Version** | 1.0 |
| **Game Name** | _(required)_ Must match a GameSpec |
| **Event ID** | _(required)_ Unique identifier, snake_case |
| **Author** | _(required)_ |
| **Date Created** | _(required)_ ISO 8601 date |
| **Status** | _(required)_ `draft` / `scheduled` / `live` / `concluded` |

### Event Identity

| Field | Value |
|-------|-------|
| **Event Name** | _(required)_ Player-facing display name |
| **Event Type** | _(required)_ `seasonal` / `challenge` / `limited_offer` / `mini_game` / `daily_challenge` |
| **Theme** | _(required)_ Visual theme description (colors, motifs, mood) |
| **Description** | _(required)_ 1-3 sentences explaining the event to the player |

### Schedule

| Field | Value |
|-------|-------|
| **Start Date/Time** | _(required)_ ISO 8601 datetime with timezone |
| **End Date/Time** | _(required)_ ISO 8601 datetime with timezone |
| **Duration (days)** | _(auto-derived)_ Calculated from start and end |
| **Recurrence** | _(optional)_ `none` / `annual` / `monthly` / `weekly` (default: `none`) |

### Milestones

Each milestone defines a progress threshold and its reward. Milestones must be in ascending order by requirement.

| Milestone ID | Name | Requirement (progress) | Reward: Currencies | Reward: Items | Reward: XP |
|-------------|------|------------------------|-------------------|---------------|------------|
| _(required)_ | _(required)_ | _(required)_ positive int | _(required)_ `CurrencyAmount[]` | _(optional)_ `ItemReward[]` | _(optional)_ int |
| _(add rows)_ | | | | | |

### Reward Budget

Total rewards available across all milestones. Must equal or exceed the sum of individual milestone rewards.

| Field | Value |
|-------|-------|
| **Total Basic Currency** | _(required)_ Sum across milestones |
| **Total Premium Currency** | _(required)_ Sum across milestones |
| **Total Items** | _(required)_ Count of unique items |
| **Total XP** | _(required)_ Sum across milestones |

### Targeting

| Field | Value |
|-------|-------|
| **Eligible Segments** | _(optional)_ `PlayerContext.segments` filters; omit for all players |
| **Minimum Player Level** | _(optional)_ Minimum level to see this event (default: 1) |
| **Slot Target** | _(required)_ Which UI slot this event occupies (e.g., "main_event", "side_challenge", "daily") |

### Required Assets

List all assets that must be created or sourced before the event can go live.

| Asset Name | Asset Type | Description | Priority |
|------------|-----------|-------------|----------|
| _(required, at least one)_ | `sprite` / `texture` / `animation` / `audio` / `font` | _(required)_ | `critical` / `high` / `medium` / `low` |
| _(add rows)_ | | | |

---

## Validation Rules

1. **Event ID** must be unique, snake_case, no longer than 64 characters.
2. **Event Type** must be one of the five allowed values.
3. **Start Date/Time** must be before **End Date/Time**.
4. **Duration** must be between 1 and 90 days.
5. **Milestones** must have at least 2 entries, in ascending order by requirement.
6. **Milestone requirements** must be positive integers with no duplicates.
7. **Reward Budget** totals must equal or exceed the sum of all milestone rewards.
8. **Slot Target** must be non-empty and reference a valid UI slot.
9. **Required Assets** must have at least one entry.
10. All `CurrencyAmount` values must be positive integers with a valid `CurrencyType`.

---

## Completed Example

### Metadata

| Field | Value |
|-------|-------|
| **Spec Version** | 1.0 |
| **Game Name** | Garden Merge |
| **Event ID** | winter_wonderland_2026 |
| **Author** | Priya Kapoor |
| **Date Created** | 2026-04-09 |
| **Status** | scheduled |

### Event Identity

| Field | Value |
|-------|-------|
| **Event Name** | Winter Wonderland |
| **Event Type** | seasonal |
| **Theme** | Snowy garden landscape with frosted flowers, icicle decorations, soft blue and white palette, gentle snowfall particle effects |
| **Description** | Transform your garden into a winter paradise! Merge special snowflake items to unlock exclusive frost-themed decorations and earn bonus Dewdrops before the snow melts. |

### Schedule

| Field | Value |
|-------|-------|
| **Start Date/Time** | 2026-12-15T00:00:00Z |
| **End Date/Time** | 2026-12-31T23:59:59Z |
| **Duration (days)** | 17 |
| **Recurrence** | annual |

### Milestones

| Milestone ID | Name | Requirement | Reward: Currencies | Reward: Items | Reward: XP |
|-------------|------|-------------|-------------------|---------------|------------|
| ww_m1 | First Frost | 50 | 100 Petals | snowflake_seed:1 | 50 |
| ww_m2 | Snow Blanket | 150 | 250 Petals | frost_planter:1 | 100 |
| ww_m3 | Ice Garden | 350 | 500 Petals, 10 Dewdrops | ice_fountain:1 | 200 |
| ww_m4 | Blizzard Master | 600 | 1000 Petals, 25 Dewdrops | winter_gazebo:1 | 300 |
| ww_m5 | Winter Crown | 1000 | 2000 Petals, 50 Dewdrops | winter_crown_tree:1, exclusive_badge:1 | 500 |

### Reward Budget

| Field | Value |
|-------|-------|
| **Total Basic Currency** | 3850 Petals |
| **Total Premium Currency** | 85 Dewdrops |
| **Total Items** | 6 unique items |
| **Total XP** | 1150 |

### Targeting

| Field | Value |
|-------|-------|
| **Eligible Segments** | All players (no segment filter) |
| **Minimum Player Level** | 5 |
| **Slot Target** | main_event |

### Required Assets

| Asset Name | Asset Type | Description | Priority |
|------------|-----------|-------------|----------|
| winter_bg | texture | Snowy garden background, 1920x1080, soft blue gradient with falling snow | critical |
| snowflake_items | sprite | Sprite sheet for 5 snowflake merge tiers, 128x128 each | critical |
| frost_planter | sprite | Decorative frosted planter, 256x256 | high |
| ice_fountain | sprite | Animated ice fountain decoration, 256x256, 8 frames | high |
| winter_bgm | audio | Gentle winter ambient loop, 90 sec, .ogg | medium |
| snow_particle | animation | Snowfall particle effect overlay | medium |

---

## Related Documents

- [Shared Interfaces](../Verticals/00_SharedInterfaces.md) -- `IEvent`, `EventConfig`, `EventMilestone`, `RewardBundle`
- [Economy Table Template](./EconomyTable_Template.md) -- Currency names and reward budget alignment
- [Asset Request Template](./AssetRequest_Template.md) -- Use to formally request listed assets
- [Game Spec Template](./GameSpec_Template.md) -- Game context
