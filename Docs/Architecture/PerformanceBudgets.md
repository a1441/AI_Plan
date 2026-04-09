# Performance Budgets

Hard constraints for mobile game performance. These budgets constrain all 9 verticals — no agent can produce output that violates them.

## Target Devices

| Tier | Android | iOS | Market Share |
|------|---------|-----|-------------|
| **Minimum** | Snapdragon 460 / 2GB RAM | iPhone 8 / A11 | Bottom 15% |
| **Target** | Snapdragon 6-series / 4GB RAM | iPhone 11 / A13 | Middle 60% |
| **High-end** | Snapdragon 8-series / 8GB RAM | iPhone 14+ / A16 | Top 25% |

All budgets are defined for the **Target** tier. Minimum tier gets reduced settings (lower texture resolution, fewer particles, simplified shaders).

## Frame Rate

| Context | Target | Hard Floor |
|---------|--------|-----------|
| Gameplay (core mechanic) | 60 fps | 30 fps |
| UI transitions | 60 fps | 30 fps |
| Loading screens | N/A | N/A |
| Background (menus) | 30 fps | 20 fps |

**Rule:** Frame time budget = 16.67ms at 60fps. Mechanic updates, rendering, and UI combined must complete within this budget on target devices.

## Memory

| Category | Budget |
|----------|--------|
| **Total app memory** | < 400 MB (target), < 250 MB (minimum) |
| Textures | < 150 MB |
| Audio | < 50 MB |
| Mesh/Animation | < 50 MB |
| Game state | < 20 MB |
| UI framework | < 30 MB |
| SDK overhead (ads, analytics) | < 50 MB |
| Headroom | 50 MB |

**Rule:** If memory exceeds 400 MB on target devices, the game will be killed by the OS on lower-end devices. Asset Agent must ensure texture and audio assets fit within budget.

## Download Size

| Metric | Budget |
|--------|--------|
| **Initial download** | < 100 MB (Play Store OBB limit for non-AAB) |
| **Post-install assets** | < 200 MB additional |
| **Total installed size** | < 500 MB |

**Rule:** Keep initial download small for conversion. Large assets load on-demand via addressables/CDN.

## Battery

| Metric | Budget |
|--------|--------|
| **Session drain** | < 5% per 15-minute session on target device |
| **Background drain** | Near zero (no background processing unless syncing) |

**Rules:**
- No continuous GPS or camera access
- Minimize wake locks
- Batch analytics events (send every 30-60 seconds, not per event)
- Reduce frame rate when app is partially obscured

## Network

| Metric | Budget |
|--------|--------|
| **Gameplay data per session** | < 50 KB |
| **Analytics batch** | < 10 KB per batch (every 60 seconds) |
| **Asset download speed** | Graceful degradation on 3G (1 Mbps) |
| **Offline capability** | Core gameplay fully playable offline |

**Rules:**
- Core mechanic MUST work without network
- Economy syncs when online, queues transactions when offline
- Ad requests fail gracefully (show nothing, not a crash)
- Save data syncs to cloud when available, local-first always

## Startup Time

| Metric | Budget |
|--------|--------|
| **Cold start to interactive** | < 3 seconds on target device |
| **Warm start (from background)** | < 1 second |
| **Loading between levels** | < 2 seconds |

**Rules:**
- Loading screen must appear within 1 second (splash → loading)
- Defer non-critical initialization (analytics, ads, cloud sync) to after first frame
- Preload next level assets during current level

## Draw Calls & Rendering

| Metric | Budget |
|--------|--------|
| **Draw calls per frame** | < 100 (target), < 50 (minimum) |
| **Triangle count per frame** | < 100K (target), < 50K (minimum) |
| **Texture atlas count** | < 4 per scene |
| **Shader variants** | < 20 |

**Rules:**
- Use texture atlasing to reduce material count
- Use GPU instancing for repeated objects
- Use LOD groups for 3D objects
- Static batch all non-moving geometry
- Keep shader complexity low — no real-time shadows on minimum tier

## Audio

| Metric | Budget |
|--------|--------|
| **Concurrent audio sources** | < 8 |
| **Music format** | Compressed (OGG/AAC), streaming |
| **SFX format** | Compressed, loaded into memory |
| **Total audio memory** | < 50 MB |

## Impact on Verticals

| Vertical | Key Constraint |
|----------|---------------|
| **UI** | Screen transitions < 16ms. No heavy animations on minimum tier. |
| **Core Mechanics** | Game logic + rendering < 16ms per frame. Mechanic must define LOD-reducible complexity. |
| **Monetization** | Ad SDK initialization deferred. Ad load failure = graceful skip, not crash. |
| **Economy** | Local-first storage. Cloud sync is best-effort. |
| **Difficulty** | Level complexity bounded by draw call and triangle budgets. |
| **LiveOps** | Event assets downloaded in background, not blocking gameplay. |
| **AB Testing** | Config fetched at startup, cached locally. Stale config = last-known-good. |
| **Analytics** | Batched sends. No per-event network calls. |
| **Assets** | Textures fit in 150MB budget. 3D models within triangle limits. Audio within 50MB. |

## Related Documents

- [System Overview](SystemOverview.md) — Architecture context
- [Asset Spec](../Verticals/09_Assets/Spec.md) — Asset budget implications
- [Core Mechanics Spec](../Verticals/02_CoreMechanics/Spec.md) — Rendering budget per mechanic
- [Vision](../01_Vision.md) — Mobile-first constraint
