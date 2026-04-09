# Shared Interfaces

Cross-vertical contracts that all agents must respect. This file is written BEFORE any vertical spec and is READ-ONLY during agent processing. Changes to shared interfaces require updating this file first, then propagating to all affected verticals.

## Why Shared Interfaces Exist

When 9 agents work in parallel, they need pre-agreed contracts at every boundary. Without shared interfaces, the Economy Agent might define rewards as `{ coins: number }` while the Mechanics Agent emits `{ currency: { type: string, amount: number } }`. These mismatches cascade into integration failures.

---

## Core Data Types

```typescript
// Currency
type CurrencyType = 'basic' | 'premium';

interface CurrencyAmount {
  type: CurrencyType;
  amount: number;  // Always positive, always integer
}

interface RewardBundle {
  currencies: CurrencyAmount[];
  items: ItemReward[];
  xp: number;
}

interface ItemReward {
  itemId: string;
  quantity: number;
}

// Pricing
interface Price {
  type: 'basic_currency' | 'premium_currency' | 'real_money';
  amount: number;          // Currency units or cents (real money in smallest unit)
  currency?: string;       // ISO 4217 for real money (e.g., "USD")
}

// Time
type ISO8601 = string;     // "2026-04-09T14:30:00Z"
type DurationSeconds = number;

// Difficulty
type DifficultyScore = number;  // 1-10, integer
type RewardTier = 'easy' | 'medium' | 'hard' | 'very_hard' | 'extreme';

// Player
interface PlayerContext {
  playerId: string;
  segments: {
    spending: 'whale' | 'dolphin' | 'minnow' | 'free';
    lifecycle: 'new' | 'activated' | 'engaged' | 'loyal' | 'at_risk' | 'churned';
    engagement: 'hardcore' | 'regular' | 'casual' | 'weekend_warrior';
  };
  level: number;
  daysSinceInstall: number;
  totalSpend: number;       // Lifetime IAP spend in cents
  sessionCount: number;
}
```

## Difficulty ↔ Economy Contract

The mapping between difficulty scores and economy reward tiers:

```typescript
const DIFFICULTY_REWARD_MAP: Record<DifficultyScore, RewardTier> = {
  1: 'easy', 2: 'easy',
  3: 'medium', 4: 'medium',
  5: 'hard', 6: 'hard',
  7: 'very_hard', 8: 'very_hard',
  9: 'extreme', 10: 'extreme',
};

interface RewardTierConfig {
  tier: RewardTier;
  basicCurrencyMultiplier: number;  // 1.0 for easy, up to 5.0 for extreme
  xpMultiplier: number;
  itemDropChance: number;           // 0.0-1.0
}
```

**Owner:** Economy Agent defines the multipliers. Difficulty Agent maps levels to scores. Both reference this contract.

## Mechanic ↔ Shell Contract (IMechanic)

```typescript
interface IMechanic {
  // Lifecycle
  init(config: MechanicConfig): void;
  start(): void;
  pause(): void;
  resume(): void;
  dispose(): void;

  // Difficulty integration
  setDifficultyParams(params: Record<string, number>): void;
  getAdjustableParams(): ParamDefinition[];

  // State
  getCurrentState(): MechanicState;

  // Events (published by mechanic, consumed by shell)
  readonly events: {
    onLevelStart: GameEvent<{ levelId: string; difficulty: DifficultyScore }>;
    onLevelComplete: GameEvent<LevelCompletePayload>;
    onPlayerDied: GameEvent<{ levelId: string; cause: string }>;
    onScoreChanged: GameEvent<{ score: number; delta: number }>;
    onCurrencyEarned: GameEvent<CurrencyAmount>;
    onPauseRequested: GameEvent<void>;
  };
}

interface MechanicConfig {
  mechanicType: string;        // "runner", "merge", "pvp", etc.
  theme: Theme;                // Visual theme from shell
  initialDifficulty: Record<string, number>;
  levelSequence: LevelConfig[];
}

interface LevelCompletePayload {
  levelId: string;
  score: number;
  stars: number;               // 0-3
  timeSeconds: number;
  difficulty: DifficultyScore;
  rewardTier: RewardTier;
}

interface ParamDefinition {
  name: string;                // e.g., "speed", "enemyCount", "timeLimit"
  type: 'float' | 'int';
  min: number;
  max: number;
  default: number;
  description: string;
}

type MechanicState = 'idle' | 'playing' | 'paused' | 'completed' | 'failed';
```

**Owner:** Core Mechanics Agent implements `IMechanic`. UI Agent consumes it.

## LiveOps ↔ Shell Contract (IEvent)

```typescript
interface IEvent {
  init(config: EventConfig): void;
  start(): void;
  end(): void;
  getProgress(): EventProgress;
  claimReward(milestoneId: string): RewardBundle;

  readonly events: {
    onMilestoneReached: GameEvent<{ milestoneId: string; reward: RewardBundle }>;
    onEventComplete: GameEvent<{ totalProgress: number; totalRewards: RewardBundle }>;
  };
}

interface EventConfig {
  eventId: string;
  type: 'seasonal' | 'challenge' | 'limited_offer' | 'mini_game' | 'daily_challenge';
  name: string;
  startAt: ISO8601;
  endAt: ISO8601;
  theme: Theme;                // Event-specific theme overlay
  milestones: EventMilestone[];
  rewardBudget: RewardBundle;  // Total rewards available
}

interface EventMilestone {
  id: string;
  name: string;
  requirement: number;         // Progress needed
  reward: RewardBundle;
}

interface EventProgress {
  eventId: string;
  currentProgress: number;
  milestonesReached: string[];
  rewardsClaimed: string[];
}
```

**Owner:** LiveOps Agent generates `EventConfig`. UI Agent renders the event UI using `IEvent`.

## Monetization ↔ Shell Contract (IAdUnit, IShopItem)

```typescript
interface IAdUnit {
  load(): Promise<boolean>;
  isReady(): boolean;
  show(): Promise<AdResult>;

  readonly events: {
    onAdComplete: GameEvent<{ watched: boolean; reward?: RewardBundle }>;
    onAdFailed: GameEvent<{ reason: string }>;
  };
}

interface AdResult {
  watched: boolean;
  durationSeconds: number;
  reward?: RewardBundle;
}

interface IShopItem {
  getDisplayInfo(): ShopItemDisplay;
  getPrice(): Price;
  purchase(): Promise<PurchaseResult>;

  readonly events: {
    onPurchaseComplete: GameEvent<{ itemId: string; price: Price }>;
    onPurchaseFailed: GameEvent<{ reason: string }>;
  };
}

interface ShopItemDisplay {
  itemId: string;
  name: string;
  description: string;
  icon: AssetRef;
  badge?: 'new' | 'sale' | 'popular' | 'limited';
  originalPrice?: Price;       // For showing discount
}

type PurchaseResult = { success: true; receipt: string } | { success: false; reason: string };
```

**Owner:** Monetization Agent defines ad placements and shop catalog. UI Agent renders using these interfaces.

## Analytics Event Contract

```typescript
interface AnalyticsEvent {
  name: string;                // Snake_case: "level_complete", "iap_purchase"
  timestamp: ISO8601;
  playerId: string;
  sessionId: string;
  properties: Record<string, string | number | boolean>;
}

// Standard events all verticals must emit
type StandardEvents = {
  // UI
  screen_view: { screen_name: string };
  button_tap: { button_id: string; screen_name: string };

  // Mechanics
  level_start: { level_id: string; difficulty: DifficultyScore };
  level_complete: LevelCompletePayload;
  level_fail: { level_id: string; cause: string; attempt: number };

  // Economy
  currency_earn: CurrencyAmount & { source: string };
  currency_spend: CurrencyAmount & { sink: string; item_id?: string };

  // Monetization
  ad_requested: { format: 'banner' | 'interstitial' | 'rewarded'; placement: string };
  ad_watched: { format: string; placement: string; completed: boolean; reward?: CurrencyAmount };
  iap_initiated: { product_id: string; price: Price };
  iap_completed: { product_id: string; price: Price; receipt: string };
  iap_failed: { product_id: string; reason: string };

  // LiveOps
  event_entered: { event_id: string; event_type: string };
  event_milestone: { event_id: string; milestone_id: string };
  event_completed: { event_id: string };

  // AB Testing
  experiment_assigned: { experiment_id: string; variant_id: string };
  experiment_exposed: { experiment_id: string; variant_id: string };
};
```

**Owner:** Analytics Agent defines the taxonomy. All other agents emit events matching this schema.

## Asset Reference Contract

```typescript
interface AssetRef {
  assetId: string;             // Unique ID in asset library
  type: 'sprite' | 'texture' | 'mesh' | 'animation' | 'audio' | 'font';
  path: string;                // Relative path within game bundle
  fallback?: string;           // Fallback asset ID if primary not found
}

interface AssetRequest {
  requestId: string;
  requestedBy: string;         // Agent name
  type: AssetRef['type'];
  description: string;         // What the asset should look like/sound like
  constraints: {
    maxResolution?: { width: number; height: number };
    maxFileSizeKB?: number;
    format?: string[];         // Acceptable formats
  };
  priority: 'critical' | 'high' | 'medium' | 'low';
}
```

**Owner:** Asset Agent fulfills `AssetRequest`. All other agents submit requests using this format.

## Theme Contract

```typescript
interface Theme {
  id: string;
  name: string;
  palette: {
    primary: string;           // Hex color
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    error: string;
    text: string;
    textSecondary: string;
  };
  typography: {
    heading: FontConfig;
    body: FontConfig;
    caption: FontConfig;
    number: FontConfig;        // For scores, currency amounts
  };
  icons: Record<string, AssetRef>;  // Standard icon set
  animations: {
    screenTransitionMs: number;
    currencyEarnMs: number;
    buttonPressMs: number;
    popupEntryMs: number;
  };
}

interface FontConfig {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
}
```

**Owner:** UI Agent generates the theme. All other agents consume it for visual consistency.

## Game Event System

```typescript
interface GameEvent<T> {
  subscribe(handler: (payload: T) => void): Unsubscribe;
  publish(payload: T): void;
}

type Unsubscribe = () => void;
```

All cross-module communication uses this event pattern. No direct method calls across vertical boundaries.

---

## Related Documents

- [System Overview](../Architecture/SystemOverview.md) — Architecture context
- [Slot Architecture](../Architecture/SlotArchitecture.md) — Slot interface details
- [Event Model](../Architecture/EventModel.md) — Event-driven communication
- [Data Contracts](../Pipeline/DataContracts.md) — Agent I/O schemas
