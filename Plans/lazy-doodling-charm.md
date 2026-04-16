# Core Loop Page — Redesign Suggestions

## Context

The Core Loop page (Step 1 of the pitch) currently shows a 4-card horizontal pipeline: **Prompt → Web Prototype → Refinement → Game Engine**. Each card expands in place to reveal methodology and prompt/prototype content. The Block Blast demo auto-plays inside a 200px phone frame, with a refined (dark + gold) variant in the Refinement card.

The structure works. But visually all four cards carry equal weight, the connectors are static `→` glyphs, the "wow" moment (the playing phone) is buried behind a click, and the page stops at the Engine card without landing a payoff. The pitch narrative — *one sentence becomes a real mobile game in hours* — is implicit, not sold.

These suggestions are grouped by theme and ranked by impact on "pop" and "pitch strength." Pick the ones that resonate; they are additive, not all-or-nothing.

---

## Suggestions (ranked by pitch impact)

### A. Lead with the outcome (highest ROI)

Right now the page opens with eyebrow `STEP 1` + heading `Core Loop`. That's a table-of-contents title, not a pitch.

**Proposal:** Replace with a results-forward hero line directly under the heading:

> **Core Loop** &nbsp;·&nbsp; *One sentence → playable web prototype → polished feel → shippable mobile build. Hours, not months.*

- Adds a sub-headline element under `.step-heading` (new class `.step-lede`)
- Sets the frame before the pipeline renders
- Reinforces the "why should the board care" in one breath

**Files:** `index.html` line 30 (insert sibling), `styles.css` (new `.step-lede` rule near line 117)

---

### B. Number the steps + signature color per stage

Right now every card has the same blue icon, same neutral container. Nothing tells the eye *this is step 2 of 4*.

**Proposal:**
1. Add a small numbered badge to each card header: `01`, `02`, `03`, `04` — monospace, top-right of card
2. Tint each stage with a signature accent hue on the icon + number badge only (keep cards white):
   - 01 Prompt → Carry1st blue (current)
   - 02 Web Prototype → teal/cyan (fresh, builder)
   - 03 Refinement → purple (matches the refined phone gradient — earned connection)
   - 04 Game Engine → amber/gold (ships = success color)
3. Card borders stay neutral; only the icon color and badge color change, preserving the clean light aesthetic

**Why it helps:** The eye travels left-to-right through a chromatic journey. Also makes it obvious that Refinement's purple phone *belongs to stage 3* — the color callback lands.

**Files:** `index.html` (add `.pipeline-num` span inside each card), `styles.css` (new color-coded rules, ~20 lines)

---

### C. Replace static `→` with flowing pipeline connectors

The arrows are 1.1rem grey glyphs that read as punctuation, not flow.

**Proposal:** Replace `.pipeline-connector` with a thin 2px gradient rule that fades between the adjacent stage colors, with a soft animated shimmer that loops left-to-right every 6–8s. On hover of any card, all connectors brighten briefly.

- Visually conveys "data/work flows through here"
- Matches the color journey from suggestion B
- Subtle — doesn't distract from the cards

**Fallback if the shimmer feels too much:** Just use static gradient lines. The gradient alone is a big improvement over `→`.

**Files:** `styles.css` `.pipeline-connector` rule (lines 196–205), plus `@keyframes` for the shimmer

---

### D. Promote the phone demo — don't hide it

The refined Block Blast phone is the single most persuasive element on the page. It's currently hidden behind a button click and rendered at 200px.

Two options, pick one:

**D1. Always-on featured phone (higher impact):** Show the refined phone in a *fifth column* to the right of the Engine card — it's the payoff. Playing continuously. The refinement card still has its own button for the comparison, but the pitch ends with "this is what the pipeline produces."

**D2. Auto-reveal on page load:** Keep the current layout, but on initial render auto-expand just the Refinement prototype (not the prompt) so the bot is already playing when the deck opens. Other cards stay collapsed.

**Recommendation:** D2 is a one-line change in `app.js` and preserves the current structure. D1 is stronger visually but changes the 4-card architecture.

**Files:** `app.js` (toggle call in `DOMContentLoaded` for D2); `index.html` + `styles.css` restructure for D1

---

### E. Make it a LOOP, not a line

The name is "Core **Loop**" but the visualization is purely linear. There's an implicit feedback cycle (Engine feedback → back to Prompt/Refinement) that the Engine methodology copy mentions but the visual never shows.

**Proposal:** Add a subtle curved return arrow from under the Engine card, swooping back to the Prompt or Refinement card. Labeled "Feedback" or "Iterate" in tiny caps. Dashed or low-opacity so it's present but not noisy.

**Why it helps:** Justifies the name, shows that this is a *system that improves itself*, and communicates that one run isn't the end — it's a spin of a flywheel.

**Files:** `index.html` (SVG overlay below pipeline), `styles.css` (positioning)

---

### F. Fix the Refinement card's button inconsistency

Every other card has `Methodology (green) + [primary action]`. Refinement has `Add prompt (blue) + Show prototype (purple)` — no Methodology. The eye notices.

**Proposal:** Add a Methodology card-expand to Refinement explaining *what you're refining for* — feel, feedback loops, dopamine per action, readability. Keeps the visual rhythm consistent across all four cards.

Methodology content draft:

| Key | Value |
|---|---|
| Feel | Every placement should feel rewarding |
| Feedback | Bursts, pops, sound — dopamine per action |
| Clarity | Playfield reads instantly, no cognitive load |
| Loop | Iterate visuals until the fun is unmistakable |

**Files:** `index.html` lines 108–137 (add methodology button + expand), `app.js` (wire it up with `initCardBtn`)

---

### G. Landing payoff — a closing strip

Page currently ends at the Engine card. No "and then what." The Engine methodology has a hidden footnote about layering more systems, but you have to click to see it.

**Proposal:** Add a thin callout strip *below* the pipeline (full width, neutral light-blue background, one line of centered text):

> **Core loop locked.** &nbsp;Ready to layer economy, progression, monetization, LiveOps. → *Step 2*

- Provides closure for Step 1
- Teases Step 2 (even though Step 2 is a placeholder now)
- Reinforces that this page's work is a foundation, not a standalone feature

**Files:** `index.html` (new `.step-footer` after `.pipeline`), `styles.css` (~15 lines)

---

### H. Alignment & polish pass (small but compounding)

Mechanical tightening to make the page feel more designed:

1. **Card heights equal** — they already stretch via `flex: 1` + `align-items: stretch`, but when one expands and others don't, the non-expanded cards look short. Consider aligning the action-button row to a fixed baseline so icon/title/description take consistent vertical space across cards.
2. **Icon sizing** — icons (✦ ⬡ ↻ ⚙) render at different optical weights because they're different glyphs. Either pick more visually matched glyphs, or normalize via explicit font-size + line-height tuning per icon.
3. **Hover lift only when not expanded** — already handled (line 157), but the 3px translate happens even on the card whose button you just clicked. Suppress hover lift on the whole pipeline while any card is expanded — the composition is more stable.
4. **Typography rhythm** — card descriptions (0.78rem) and button labels (0.72rem) are too close in size. Drop buttons to 0.7rem + tighter letter-spacing to create a cleaner size-step hierarchy.

**Files:** `styles.css` across pipeline-card rules (~10 lines of tweaks)

---

### I. Header punch-up

Header title is *"Building Complete Games with an AI Framework"* — descriptive, not memorable.

**Proposal:** Shorter, sharper:

> **AI Game Engine** &nbsp;·&nbsp; From prompt to mobile build.

Keeps the brand, adds a tagline that lands the pitch in one line. Appears on every step page, so the lede stays consistent.

**Files:** `index.html` line 15

---

## Priority recommendation

If I had to pick 4 to implement for maximum impact-per-effort:

1. **A — Results-forward hero line** (5 min, reframes the whole page)
2. **B — Numbered badges + signature colors per stage** (30 min, biggest visual "pop")
3. **C — Gradient connectors** (20 min, removes the cheapest-looking element on the page)
4. **D2 — Auto-expand refined phone on load** (2 min, surfaces the wow moment immediately)

That combination shifts the page from *diagram* to *pitch* without restructuring the architecture.

---

## Critical files

| File | Role | Lines of interest |
|---|---|---|
| `D:\Claude\AI_Engine\Pitch\index.html` | All pipeline markup | 27–171 (Step 1 section) |
| `D:\Claude\AI_Engine\Pitch\styles.css` | All styling | 117–268 (step + pipeline + expand), 454–670 (phone + refined) |
| `D:\Claude\AI_Engine\Pitch\app.js` | Expand toggles + bot | 19–39 (initCardBtn), 42–77 (phone demos) |

## Verification

After any change:
1. Open `D:\Claude\AI_Engine\Pitch\index.html` in Chrome / via Playwright
2. Confirm the default (all collapsed, unless D2) state looks as designed
3. Click through each card's expand buttons — layout should not shift other cards unexpectedly
4. Confirm the refined phone's bot still auto-plays (clears lines, shows score pops)
5. Take a fresh screenshot for comparison against the current `ss-default.png`

## Out of scope for this pass

- Responsive / mobile layout (the page is pitched on a laptop/projector; defer)
- Step 2–4 content (placeholders stay)
- Rewriting the card copy beyond where noted above
- Changing the Block Blast game mechanics
