# Asset Request Template

Standardized request for sourcing a visual, audio, or other asset. The Asset Agent fulfills these requests. All requests align with the `AssetRequest` and `AssetRef` interfaces from Shared Interfaces. Any agent can submit an asset request.

---

## How to Use

1. Copy this template into a new file named `AssetReq_<GameName>_<RequestName>.md`.
2. Fill in every **(required)** field. Provide as much detail as possible in the description for accurate sourcing.
3. Validate against the rules in the **Validation Rules** section.
4. The Asset Agent determines the sourcing channel if not specified, but a preference helps prioritize.

---

## Template

### Metadata

| Field | Value |
|-------|-------|
| **Spec Version** | 1.0 |
| **Request ID** | _(required)_ Unique identifier, snake_case |
| **Requested By** | _(required)_ Agent or person name |
| **Date Created** | _(required)_ ISO 8601 date |
| **Status** | _(required)_ `open` / `in_progress` / `delivered` / `rejected` |

### Asset Identity

| Field | Value |
|-------|-------|
| **Request Name** | _(required)_ Human-readable name for this asset |
| **Asset Type** | _(required)_ `sprite` / `texture` / `mesh` / `animation` / `audio` / `font` |
| **Description** | _(required)_ Detailed description of what the asset should look/sound like. Include colors, mood, style, composition, and any key elements. Minimum 30 characters. |

### Sourcing

| Field | Value |
|-------|-------|
| **Preferred Channel** | _(optional)_ `AI_generated` / `purchased` / `artist_commissioned` / `any` (default: `any`) |
| **License Requirement** | _(optional)_ e.g., `royalty_free`, `commercial_use`, `exclusive` (default: `commercial_use`) |

### Constraints

| Field | Value |
|-------|-------|
| **Max Resolution** | _(optional)_ `{ width: number, height: number }` in pixels |
| **Max File Size (KB)** | _(optional)_ Maximum file size in kilobytes |
| **Format** | _(optional)_ Acceptable formats, e.g., `["png", "webp"]`, `["ogg", "mp3"]` |
| **Frame Count** | _(optional, animation only)_ Number of frames |
| **Duration (seconds)** | _(optional, audio/animation only)_ Length |
| **Loopable** | _(optional, audio/animation only)_ `true` / `false` |

### Priority and Context

| Field | Value |
|-------|-------|
| **Priority** | _(required)_ `critical` / `high` / `medium` / `low` |
| **Target Game** | _(required)_ Game name this asset is for |
| **Usage Context** | _(required)_ Where this asset appears (e.g., "level background", "main menu", "character select screen") |
| **Deadline** | _(optional)_ ISO 8601 date by which the asset is needed |

### Style Reference

_(optional but strongly recommended)_ Provide a link, path, or written description of the desired visual/audio style.

```
[Link to reference image/audio, or describe the style in detail]
```

### Delivery

_(filled by Asset Agent upon completion)_

| Field | Value |
|-------|-------|
| **Asset ID** | _(filled on delivery)_ Unique asset ID for `AssetRef` |
| **File Path** | _(filled on delivery)_ Relative path in game bundle |
| **Actual Resolution** | _(filled on delivery)_ |
| **Actual File Size (KB)** | _(filled on delivery)_ |
| **Actual Format** | _(filled on delivery)_ |
| **Fallback Asset ID** | _(filled on delivery, optional)_ |

---

## Validation Rules

1. **Request ID** must be unique, snake_case, no longer than 64 characters.
2. **Asset Type** must be one of the six allowed values.
3. **Description** must be at least 30 characters.
4. **Priority** must be one of the four allowed values.
5. **Target Game** must match an existing GameSpec.
6. **Usage Context** must be non-empty.
7. **Max Resolution**, if provided, must have positive width and height.
8. **Max File Size**, if provided, must be a positive integer.
9. **Format**, if provided, must be a non-empty list of recognized file extensions.
10. **Frame Count** and **Duration** apply only to `animation` and `audio` types respectively.
11. On delivery, **Asset ID** must conform to `AssetRef.assetId` format and **File Path** must be a valid relative path.

---

## Completed Example

### Metadata

| Field | Value |
|-------|-------|
| **Spec Version** | 1.0 |
| **Request ID** | jungle_dash_bg_jungle_theme |
| **Requested By** | UI Agent |
| **Date Created** | 2026-04-09 |
| **Status** | open |

### Asset Identity

| Field | Value |
|-------|-------|
| **Request Name** | Jungle Theme Background |
| **Asset Type** | sprite |
| **Description** | A parallax-ready jungle background for the main runner gameplay screen. Lush green canopy in the foreground fading to misty blue-green mountains in the back. Includes hanging vines, colorful tropical birds perched on branches, and shafts of golden sunlight breaking through the foliage. Cartoon 2D style consistent with the Jungle Dash art direction. Three distinct parallax layers: foreground foliage, midground trees, distant mountains. |

### Sourcing

| Field | Value |
|-------|-------|
| **Preferred Channel** | AI_generated |
| **License Requirement** | commercial_use |

### Constraints

| Field | Value |
|-------|-------|
| **Max Resolution** | `{ width: 2048, height: 1024 }` |
| **Max File Size (KB)** | 500 |
| **Format** | `["png", "webp"]` |
| **Frame Count** | n/a |
| **Duration (seconds)** | n/a |
| **Loopable** | n/a |

### Priority and Context

| Field | Value |
|-------|-------|
| **Priority** | critical |
| **Target Game** | Jungle Dash |
| **Usage Context** | Main runner gameplay screen background. Visible during all levels. Scrolls horizontally via parallax at three different speeds. |
| **Deadline** | 2026-04-20 |

### Style Reference

```
Reference the art style of Angry Birds 2 jungle levels: saturated greens, warm highlights,
rounded organic shapes, and a slightly whimsical tone. Avoid photorealism. Colors should
pop on mobile screens. See also: the Jungle Dash GameSpec theme description for narrative
context.
```

### Delivery

| Field | Value |
|-------|-------|
| **Asset ID** | _(pending)_ |
| **File Path** | _(pending)_ |
| **Actual Resolution** | _(pending)_ |
| **Actual File Size (KB)** | _(pending)_ |
| **Actual Format** | _(pending)_ |
| **Fallback Asset ID** | _(pending)_ |

---

## Related Documents

- [Shared Interfaces](../Verticals/00_SharedInterfaces.md) -- `AssetRef`, `AssetRequest`
- [Game Spec Template](./GameSpec_Template.md) -- Art style and theme context
- [Event Definition Template](./EventDefinition_Template.md) -- Events list required assets
- [Mechanic Module Template](./MechanicModule_Template.md) -- Mechanics may require specific assets
