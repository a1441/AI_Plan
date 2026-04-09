# Economy Vertical — Interfaces

> **Owner:** Economy Agent
> **Version:** 1.0
> **Status:** Draft

This document defines the public API surface of the Economy vertical. All cross-vertical communication uses these interfaces. No direct internal method calls are permitted across vertical boundaries.

See [SharedInterfaces](../00_SharedInterfaces.md) for base types (`CurrencyType`, `CurrencyAmount`, `RewardBundle`, `Price`, `PlayerContext`).

---

## Currency API

The Currency API is the single entry point for all earn and spend operations. Every transaction is validated server-side before being applied.

```typescript
interface ICurrencyService {
  /**
   * Returns the player's current balance for all currency types.
   */
  getBalance(playerId: string): Promise<WalletSnapshot>;

  /**
   * Awards currency to a player. Source must be a registered faucet.
   * Returns the updated balance.
   * @throws InvalidFaucetError if source is not in FaucetConfig
   * @throws AmountError if amount <= 0 or non-integer
   */
  earn(params: EarnParams): Promise<WalletSnapshot>;

  /**
   * Deducts currency from a player. Sink must be a registered sink.
   * Returns the updated balance.
   * @throws InsufficientFundsError if balance < amount
   * @throws InvalidSinkError if sink is not in SinkConfig
   * @throws AmountError if amount <= 0 or non-integer
   */
  spend(params: SpendParams): Promise<WalletSnapshot>;

  /**
   * Checks if the player can afford a given price without executing the transaction.
   */
  canAfford(playerId: string, price: Price): Promise<boolean>;

  /**
   * Converts premium currency to basic currency at the configured exchange rate.
   * Basic-to-premium conversion is NOT supported (forces IAP).
   * @throws ConversionDisabledError if premium-to-basic conversion is off
   */
  convert(params: ConvertParams): Promise<WalletSnapshot>;
}

interface EarnParams {
  playerId: string;
  currency: CurrencyAmount;
  source: FaucetSource;
  context?: {
    levelId?: string;
    eventId?: string;
    rewardTier?: RewardTier;
  };
}

interface SpendParams {
  playerId: string;
  currency: CurrencyAmount;
  sink: SinkDestination;
  context?: {
    itemId?: string;
    upgradeId?: string;
  };
}

interface ConvertParams {
  playerId: string;
  fromType: 'premium';           // Only premium -> basic allowed
  toType: 'basic';
  amount: number;                // Amount of premium to convert
}

interface WalletSnapshot {
  playerId: string;
  balances: Record<CurrencyType, number>;
  lastTransaction: TransactionRecord;
  timestamp: ISO8601;
}

interface TransactionRecord {
  transactionId: string;
  type: 'earn' | 'spend' | 'convert';
  currency: CurrencyAmount;
  source?: FaucetSource;
  sink?: SinkDestination;
  balanceBefore: number;
  balanceAfter: number;
  timestamp: ISO8601;
}

type FaucetSource =
  | 'level_complete'
  | 'daily_login'
  | 'daily_login_streak'
  | 'achievement'
  | 'free_gift'
  | 'rewarded_ad'
  | 'event_reward'
  | 'challenge_complete'
  | 'tournament_reward'
  | 'iap_purchase'
  | 'pass_reward'
  | 'starter_bundle'
  | 'win_back_bonus'
  | 'conversion_premium_to_basic';

type SinkDestination =
  | 'upgrade'
  | 'unlock'
  | 'retry'
  | 'continue'
  | 'skin_purchase'
  | 'effect_purchase'
  | 'theme_purchase'
  | 'energy_refill'
  | 'speed_up'
  | 'skip_level'
  | 'pass_purchase'
  | 'shop_item';
```

---

## Reward Distribution API

Handles complex reward bundles that may include multiple currencies, items, and XP. Called by the game runtime when a reward-triggering event fires.

```typescript
interface IRewardService {
  /**
   * Calculates the reward for a completed action based on
   * reward tier, player segment, and active multipliers.
   * Does NOT distribute — call claimReward to apply.
   */
  calculateReward(params: RewardCalcParams): Promise<RewardPreview>;

  /**
   * Distributes a calculated reward to the player's wallet and inventory.
   * Idempotent — calling with the same rewardId is a no-op.
   */
  claimReward(params: RewardClaimParams): Promise<RewardClaimResult>;

  /**
   * Returns the reward table for a specific level or event.
   */
  getRewardTable(context: RewardTableQuery): Promise<RewardTableEntry[]>;
}

interface RewardCalcParams {
  playerId: string;
  trigger: FaucetSource;
  rewardTier: RewardTier;
  context: {
    levelId?: string;
    eventId?: string;
    score?: number;
    stars?: number;              // 0-3 for level completion
    difficulty?: DifficultyScore;
  };
}

interface RewardPreview {
  rewardId: string;              // Unique ID for idempotent claiming
  bundle: RewardBundle;
  multipliers: RewardMultiplier[];
  expiresAt: ISO8601;            // Must claim before this time
}

interface RewardMultiplier {
  source: string;                // "double_coin_event", "pass_bonus", etc.
  factor: number;                // 2.0 = double rewards
  appliesTo: CurrencyType | 'xp' | 'items' | 'all';
}

interface RewardClaimParams {
  playerId: string;
  rewardId: string;
}

interface RewardClaimResult {
  success: boolean;
  bundle: RewardBundle;          // Actual distributed amount (after multipliers)
  wallet: WalletSnapshot;
  reason?: string;               // If success=false, why
}

interface RewardTableQuery {
  type: 'level' | 'event' | 'daily_challenge';
  id: string;                    // levelId, eventId, etc.
}

interface RewardTableEntry {
  trigger: FaucetSource;
  tier: RewardTier;
  baseReward: RewardBundle;
  segmentOverrides?: Record<string, RewardBundle>;
}
```

---

## Time-Gate API

Manages the energy system, cooldown timers, and daily limits that pace the player experience.

```typescript
interface ITimeGateService {
  /**
   * Returns the current energy state for a player.
   */
  getEnergy(playerId: string): Promise<EnergyState>;

  /**
   * Consumes energy for an action. Returns updated state.
   * @throws InsufficientEnergyError if current < cost
   */
  consumeEnergy(params: EnergyConsumeParams): Promise<EnergyState>;

  /**
   * Refills energy to max using currency.
   * @throws InsufficientFundsError if player cannot afford refill cost
   */
  refillEnergy(params: EnergyRefillParams): Promise<EnergyState>;

  /**
   * Checks / updates a cooldown timer.
   */
  getCooldown(playerId: string, cooldownId: string): Promise<CooldownState>;

  /**
   * Checks / updates a daily limit counter.
   */
  getDailyLimit(playerId: string, limitId: string): Promise<DailyLimitState>;

  /**
   * Consumes one use of a daily-limited action.
   * @throws DailyLimitExceededError if no uses remain
   */
  consumeDailyLimit(playerId: string, limitId: string): Promise<DailyLimitState>;
}

interface EnergyState {
  current: number;
  max: number;
  regenRateSeconds: number;      // Seconds per 1 energy point
  nextRegenAt: ISO8601;          // When the next point regenerates
  fullAt: ISO8601;               // When energy will be full (if not consumed)
  refillCost: Price;             // Current refill cost
}

interface EnergyConsumeParams {
  playerId: string;
  cost: number;                  // Energy points to consume (usually 1)
  action: string;                // "play_level", "enter_event", etc.
}

interface EnergyRefillParams {
  playerId: string;
  paymentType: CurrencyType;     // basic or premium
}

interface CooldownState {
  cooldownId: string;
  isReady: boolean;
  remainingSeconds: number;
  readyAt: ISO8601;
  canSkip: boolean;
  skipCost?: Price;
}

interface DailyLimitState {
  limitId: string;
  used: number;
  max: number;
  remaining: number;
  resetsAt: ISO8601;             // Next daily reset (player-local midnight)
}
```

---

## Pass System API

Manages battle passes and season passes: purchase, progress tracking, and reward claiming.

```typescript
interface IPassService {
  /**
   * Returns all currently active passes.
   */
  getActivePasses(): Promise<PassInfo[]>;

  /**
   * Returns a player's progress on a specific pass.
   */
  getPassProgress(playerId: string, passId: string): Promise<PassProgress>;

  /**
   * Purchases the premium track of a pass.
   * @throws AlreadyOwnedError if player already has the premium track
   * @throws InsufficientFundsError if player cannot afford
   */
  purchasePass(playerId: string, passId: string): Promise<PurchaseResult>;

  /**
   * Adds XP to the player's pass progress (called when qualifying actions occur).
   */
  addPassXP(params: PassXPParams): Promise<PassProgress>;

  /**
   * Claims a reward at a specific pass level.
   * @throws LevelNotReachedError if player has not reached this level
   * @throws AlreadyClaimedError if reward was already claimed
   * @throws PremiumRequiredError if reward is on premium track and player hasn't purchased
   */
  claimPassReward(params: PassClaimParams): Promise<RewardClaimResult>;
}

interface PassInfo {
  passId: string;
  type: 'battle_pass' | 'season_pass';
  name: string;
  description: string;
  price: Price;                  // Premium currency cost for premium track
  startAt: ISO8601;
  endAt: ISO8601;
  totalLevels: number;
  freeTrackRewards: PassLevelReward[];
  premiumTrackRewards: PassLevelReward[];
}

interface PassLevelReward {
  level: number;
  reward: RewardBundle;
  track: 'free' | 'premium';
}

interface PassProgress {
  passId: string;
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  hasPremiumTrack: boolean;
  claimedFreeRewards: number[];    // Level numbers claimed
  claimedPremiumRewards: number[]; // Level numbers claimed
  unclaimedRewards: number[];      // Levels reached but not claimed
}

interface PassXPParams {
  playerId: string;
  passId: string;
  xpAmount: number;
  source: string;                // "level_complete", "daily_challenge", etc.
}

interface PassClaimParams {
  playerId: string;
  passId: string;
  level: number;
  track: 'free' | 'premium';
}
```

---

## Economy Events

The Economy vertical emits the following events via the [Game Event System](../00_SharedInterfaces.md#game-event-system). These feed into [Analytics](../../SemanticDictionary/MetricsDictionary.md) and are consumed by other verticals.

### Events Emitted

```typescript
interface EconomyEvents {
  /**
   * Fired whenever currency is earned.
   * Consumer: Analytics, Monetization (tracks free earning for conversion timing).
   */
  onCurrencyEarned: GameEvent<{
    playerId: string;
    currency: CurrencyAmount;
    source: FaucetSource;
    balanceAfter: number;
    rewardTier?: RewardTier;
  }>;

  /**
   * Fired whenever currency is spent.
   * Consumer: Analytics, Monetization (tracks spending velocity).
   */
  onCurrencySpent: GameEvent<{
    playerId: string;
    currency: CurrencyAmount;
    sink: SinkDestination;
    balanceAfter: number;
    itemId?: string;
  }>;

  /**
   * Fired when a player's wallet hits zero (or near-zero).
   * Consumer: Monetization (trigger soft IAP offer).
   */
  onWalletDepleted: GameEvent<{
    playerId: string;
    currencyType: CurrencyType;
    balanceRemaining: number;
  }>;

  /**
   * Fired when energy reaches zero.
   * Consumer: UI (show refill prompt), Monetization (ad offer).
   */
  onEnergyDepleted: GameEvent<{
    playerId: string;
    refillCost: Price;
    nextFreeRegenAt: ISO8601;
  }>;

  /**
   * Fired when a pass level is reached.
   * Consumer: UI (show reward popup), Analytics.
   */
  onPassLevelUp: GameEvent<{
    playerId: string;
    passId: string;
    newLevel: number;
    unclaimedRewards: number;
  }>;

  /**
   * Fired when inflation or deflation is detected for a segment.
   * Consumer: AB Testing (flag for investigation), Analytics (dashboard alert).
   */
  onEconomyAnomaly: GameEvent<{
    segment: string;
    metric: 'sink_coverage' | 'wallet_growth' | 'earning_velocity';
    value: number;
    expectedRange: { min: number; max: number };
    severity: 'warning' | 'critical';
  }>;

  /**
   * Fired when a spending velocity alert triggers.
   * Consumer: Analytics (flag account), Monetization (pause offers).
   */
  onSpendingVelocityAlert: GameEvent<{
    playerId: string;
    spendLast24h: number;
    segmentMedian: number;
    ratio: number;               // spendLast24h / segmentMedian
  }>;
}
```

### Events Consumed

| Event | Source | Economy Action |
|-------|--------|---------------|
| `onLevelComplete` | Core Mechanics | Calculate and queue reward based on `rewardTier` |
| `onScoreChanged` | Core Mechanics | Update milestone tracking for score-based rewards |
| `onAdComplete` | Monetization | Distribute rewarded-ad currency |
| `onPurchaseComplete` | Monetization | Credit IAP currency to wallet |
| `onMilestoneReached` | LiveOps | Distribute event milestone reward |
| `onExperimentAssigned` | AB Testing | Apply economy variant overrides |

---

## Error Types

```typescript
type EconomyError =
  | InsufficientFundsError
  | InsufficientEnergyError
  | InvalidFaucetError
  | InvalidSinkError
  | AmountError
  | DailyLimitExceededError
  | CooldownNotReadyError
  | AlreadyClaimedError
  | AlreadyOwnedError
  | PremiumRequiredError
  | LevelNotReachedError
  | ConversionDisabledError;

interface EconomyErrorBase {
  code: string;
  message: string;
  playerId: string;
  timestamp: ISO8601;
}

interface InsufficientFundsError extends EconomyErrorBase {
  code: 'INSUFFICIENT_FUNDS';
  currencyType: CurrencyType;
  required: number;
  available: number;
  shortfall: number;
}

interface InsufficientEnergyError extends EconomyErrorBase {
  code: 'INSUFFICIENT_ENERGY';
  required: number;
  available: number;
  nextRegenAt: ISO8601;
}
```

---

## Related Documents

- [Spec](./Spec.md) — Economy design and constraints
- [DataModels](./DataModels.md) — Schema definitions
- [SharedInterfaces](../00_SharedInterfaces.md) — Cross-vertical types
- [AgentResponsibilities](./AgentResponsibilities.md) — What the Economy Agent controls
