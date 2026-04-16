# Pitch Page — Drop Play Test, Expand Game Engine, Equal-Height Cards

## Context

The current pipeline has 5 cards: Prompt → Web Prototype → Refinement → Play Test → Game Engine. The Play Test step is redundant — play-testing happens on real device builds produced by the Game Engine step itself. We want to remove Play Test entirely, then upgrade the Game Engine card to follow the same pattern as Prompt / Web Prototype / Refinement (a green **Methodology** button + a blue/purple **Add prompt** button with expand sections).

The methodology of the Game Engine step: AI translates the refined web prototype into Godot or Unity, compiles to APK/IPA builds, and distributes those to the team for real-device playtesting — feedback flows back into earlier prompts.

Secondary fix: when multiple cards expand, their heights no longer match (the phone-frame cards are tall, the text-only Prompt card is short). This makes the row look uneven. Change the pipeline flex alignment so all cards match the tallest peer.

## Files

| File | Change |
|------|--------|
| `D:\Claude\AI_Engine\Pitch\index.html` | Delete Play Test card + its connector. Upgrade Game Engine card with buttons + two expand sections. |
| `D:\Claude\AI_Engine\Pitch\styles.css` | Flip `.pipeline` to `align-items: stretch`; remove fixed height on `.pipeline-connector` so arrows stretch with cards. |
| `D:\Claude\AI_Engine\Pitch\app.js` | Two new `initCardBtn(...)` calls for the engine buttons — reuses the existing helper at `app.js:19-29`. |

## Changes

### 1. `Pitch/index.html`

**Delete** (lines ~139–147): the Play Test card and its preceding connector arrow:

```html
<div class="pipeline-connector">→</div>

<div class="pipeline-card">
  <div class="pipeline-icon">▶</div>
  <div class="pipeline-name">Play Test</div>
  <div class="pipeline-desc">Verify the core loop is actually fun.</div>
</div>
```

**Replace** the Game Engine card (lines ~149–153) with the full pattern (methodology + prompt buttons, matching Prompt / Refinement cards). Also tighten the description to reflect the new scope:

```html
<div class="pipeline-card" id="engine-card">
  <div class="pipeline-icon">⚙</div>
  <div class="pipeline-name">Game Engine</div>
  <div class="pipeline-desc">AI rebuilds the locked mechanic in Godot or Unity, then compiles real device builds.</div>
  <div class="card-actions">
    <button class="card-btn card-btn--green" id="engine-methodology-btn">Methodology</button>
    <button class="card-btn card-btn--blue" id="engine-prompt-btn">Add prompt</button>
  </div>
  <div class="card-expand" id="engine-methodology-expand">
    <div class="card-expand-inner card-expand-inner--green">
      <div class="card-expand-label">How it works</div>
      <ul class="method-list">
        <li><span class="method-key">Translate</span><span class="method-val">AI regenerates the refined prototype in Godot or Unity</span></li>
        <li><span class="method-key">Build</span><span class="method-val">Compile APK for Android, IPA for iOS — one click</span></li>
        <li><span class="method-key">Playtest</span><span class="method-val">Distribute to the team on real devices</span></li>
        <li><span class="method-key">Iterate</span><span class="method-val">Feedback flows back into prompts at any stage</span></li>
      </ul>
    </div>
  </div>
  <div class="card-expand" id="engine-prompt-expand">
    <div class="card-expand-inner">
      <div class="card-expand-label">Engine prompt</div>
      <p class="card-expand-text">Rebuild the refined web prototype as a native Godot project. Preserve the 8×8 grid, three-piece dealing, row/column clears with burst effects, floating score pops, and the dark polished visual theme. Produce a clean scene graph with reusable components, and set up export presets for Android APK and iOS IPA builds so the team can playtest on real devices.</p>
    </div>
  </div>
</div>
```

The pipeline now reads: Prompt → Web Prototype → Refinement → Game Engine (4 cards, 3 connectors).

### 2. `Pitch/styles.css`

**At `.pipeline` (line 130):** change alignment so all cards match the tallest peer when one expands:

```css
.pipeline {
  display: flex;
  align-items: stretch;   /* was: flex-start */
  gap: 0;
}
```

**At `.pipeline-connector` (line 196):** remove the fixed `height: 260px` so the connector stretches vertically with the cards. The arrow glyph stays centered via the existing `align-items: center` / `justify-content: center` on the connector itself:

```css
.pipeline-connector {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  flex-shrink: 0;
  /* height: 260px;  ← remove */
  font-size: 1.1rem;
  color: rgba(22, 27, 37, 0.18);
  user-select: none;
}
```

No other CSS changes — the existing `.pipeline-card { min-height: 260px }` keeps the collapsed baseline intact, and `stretch` does the matching work automatically.

### 3. `Pitch/app.js`

**Add after line 34** (alongside the existing `initCardBtn` calls):

```javascript
initCardBtn('engine-methodology-btn', 'engine-methodology-expand', 'Methodology', 'Hide');
initCardBtn('engine-prompt-btn',      'engine-prompt-expand',      'Add prompt',  'Hide prompt');
```

The helper at `app.js:19-29` already handles toggle, text swap, and `.expanded` class on the card. No new logic needed.

## Verification

1. Open `file:///D:/Claude/AI_Engine/Pitch/index.html` in a fresh browser.
2. Confirm the pipeline now shows **4 cards**: Prompt → Web Prototype → Refinement → Game Engine. Play Test is gone.
3. Click the green **Methodology** button on the Game Engine card → the Translate / Build / Playtest / Iterate list appears.
4. Click the blue **Add prompt** button on the Game Engine card → the Godot/Unity rebuild prompt appears.
5. Expand **Web Prototype** (phone frame, tall) and **Prompt** (text only, short) simultaneously — both cards should now render the same total height. Every other card in the row should stretch to match the tallest expanded card. The connector arrows should stretch vertically between them with the arrow glyph centered.
6. Collapse everything → cards return to the 260px baseline, still equal height.
