# Reference Games

## Purpose

This directory maps real, shipped mobile games to the AI Game Engine's 9-vertical framework. The goal is validation: if the framework can fully describe a successful game, it can generate one. If aspects of a game fall outside the verticals, that signals a gap in the architecture.

Each reference game is decomposed into the same 9 verticals defined in the [Shared Interfaces](../Verticals/00_SharedInterfaces.md):

| # | Vertical | What We Map |
|---|----------|-------------|
| 01 | UI | Screens, navigation, HUD, FTUE |
| 02 | Core Mechanics | Gameplay loop, input, scoring |
| 03 | Monetization | IAP, ads, placements |
| 04 | Economy | Currencies, faucets, sinks |
| 05 | Difficulty | Progression curves, challenge scaling |
| 06 | LiveOps | Events, seasonal content, limited offers |
| 07 | AB Testing | Known or likely experiments |
| 08 | Analytics | Key metrics and funnels |
| 09 | Assets | Art style, audio, animation |

## How to Read These Mappings

Each game file follows a consistent structure:

1. **Overview** -- genre, publisher, why this game was chosen.
2. **Vertical Breakdown** -- one section per vertical with bullet-level detail on how the game implements that domain.
3. **Framework Fit** -- what maps cleanly to our verticals vs. what feels awkward or forced.
4. **Lessons for AI Engine** -- concrete takeaways for the framework design.

When reading, ask yourself:

- Does every observable feature of the game land in exactly one vertical?
- Are there features that span multiple verticals uncomfortably?
- Are there features that do not fit any vertical at all?
- Does the vertical boundary feel natural for this game, or does it create artificial seams?

## Reference Games

| Game | Genre | Key Insight |
|------|-------|-------------|
| [Subway Surfers](SubwaySurfers.md) | Endless Runner | Shell+Slot in its purest form; minimal economy, maximal LiveOps |
| [Merge Dragons](MergeDragons.md) | Merge/Puzzle | Dual game spaces (levels + camp); deep item chains; multi-currency economy |
| [Coin Master](CoinMaster.md) | Slot Machine / Social | Social-viral loop as core mechanic; aggressive LiveOps cadence |

## How to Add a New Reference Game

1. **Create a new file** named `GameName.md` in this directory (PascalCase, no spaces).
2. **Copy the structure** from any existing game file -- all 9 vertical sections plus Framework Fit and Lessons.
3. **Fill in every vertical.** If a vertical seems irrelevant to the game, explain why -- that itself is a finding.
4. **Cross-reference** vertical specs using relative paths (e.g., `../Verticals/02_CoreMechanics/MechanicCatalog.md`).
5. **Update the table above** with the new game, its genre, and its key insight.
6. **Choose games that stress-test the framework.** Prioritize games with mechanics or business models that differ from existing references. Good candidates:
   - A competitive PVP game (e.g., Clash Royale)
   - A narrative/story game (e.g., Choices)
   - A simulation game (e.g., SimCity BuildIt)
   - A hyper-casual game (e.g., Flappy Bird)

## Related Documents

- [Shared Interfaces](../Verticals/00_SharedInterfaces.md) -- cross-vertical contracts
- [Core Mechanics Catalog](../Verticals/02_CoreMechanics/MechanicCatalog.md) -- mechanic types and their interfaces
- [Economy Spec](../Verticals/04_Economy/Spec.md) -- currency and balance model
- [LiveOps Spec](../Verticals/06_LiveOps/Spec.md) -- event system architecture
- [Vision](../01_Vision.md) -- project goals and constraints
