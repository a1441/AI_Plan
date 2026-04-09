# Data Contracts

Schema definitions for every inter-agent artifact in the pipeline. Each contract defines the shape of data that flows between agents, with required/optional fields, validation rules, and example snippets.

All contracts build on the shared types defined in [SharedInterfaces](../Verticals/00_SharedInterfaces.md).

---

## Contract Summary

| Contract | Producer | Consumers | Phase |
|----------|----------|-----------|-------|
| `GameSpec` | External input | UI, Mechanics, Asset agents | Entry |
| `ShellConfig` | UI Agent (01) | Economy, Monetization agents | Phase 1 |
| `MechanicConfig` | Mechanics Agent (02) | Economy, Difficulty, LiveOps agents | Phase 1 |
| `EconomyTable` | Economy Agent (04) | Monetization, LiveOps agents | Phase 2 |
| `DifficultyProfile` | Difficulty Agent (05) | Economy Agent | Phase 2 |
| `MonetizationPlan` | Monetization Agent (03) | Analytics Agent | Phase 3 |
| `EventCalendar` | LiveOps Agent (06) | Analytics Agent, Asset Agent | Phase 4 |
| `AssetManifest` | Asset Agent (09) | UI, Mechanics, LiveOps agents | Phase 4 |
| `EventTaxonomy` | Analytics Agent (08) | AB Testing Agent | Phase 5 |
| `ExperimentPlan` | AB Testing Agent (07) | Economy, Difficulty, Monetization agents | Phase 5 |

---

## GameSpec (Pipeline Input)

The starting specification that describes the game to build. Provided by the user or a higher-level planning system.

```typescript
interface GameSpec {
  // Required fields
  id: string;                          // Unique pipeline run identifier
  genre: string;                       // "runner", "merge", "puzzle", "pvp", "idle", "match3"
  mechanicType: string;                // Specific variant: "endless_runner", "merge_chain", etc.
  theme: ThemeBrief;                   // Art direction and mood
  audience: AudienceProfile;           // Target demographic
  monetizationTier: MonetizationTier;  // How aggressively to monetize

  // Optional fields
  referenceGames?: string[];           // Inspirations: ["Subway Surfers", "Candy Crush"]
  artStyle?: string;                   // "pixel_art", "stylized_3d", "flat_2d", "realistic"
  assetBudget?: number;                // Max spend on asset generation/purchase in cents
  platforms?: ('ios' | 'android')[];   // Target platforms (default: both)
  locale?: string;                     // Primary locale (default: "en-US")
  constraints?: PipelineConstraints;   // Overrides for timing, quality, etc.
}

interface ThemeBrief {
  mood: string;                        // "energetic", "relaxing", "spooky", "cute"
  setting: string;                     // "cyberpunk_city", "fantasy_forest", "underwater"
  colorPalette: string;                // "neon", "pastel", "earth_tones", "monochrome"
}

interface AudienceProfile {
  ageRange: string;                    // "4-8", "13-35", "18+"
  region: string;                      // "global", "na", "eu", "apac"
  casualLevel: 'hyper_casual' | 'casual' | 'mid_casual' | 'midcore' | 'hardcore';
}

type MonetizationTier = 'free' | 'light' | 'mid' | 'heavy';

interface PipelineConstraints {
  maxPipelineTimeSeconds?: number;     // Override default timeout
  skipAgents?: string[];               // Agents to skip (use defaults)
  qualityLevel?: 'draft' | 'production'; // Draft skips human-review gates
}
```

**Validation rules:**
- `genre` must be one of the supported genres
- `monetizationTier` = `'free'` disables IAP and ad agents
- If `audience.ageRange` includes under-13, COPPA constraints are auto-applied
- `assetBudget` defaults to 10000 (cents) if not specified

**Example:**
```json
{
  "id": "run_20260409_001",
  "genre": "runner",
  "mechanicType": "endless_runner",
  "theme": { "mood": "energetic", "setting": "cyberpunk_city", "colorPalette": "neon" },
  "audience": { "ageRange": "13-35", "region": "global", "casualLevel": "mid_casual" },
  "monetizationTier": "mid",
  "referenceGames": ["Subway Surfers", "Temple Run 2"],
  "artStyle": "stylized_3d",
  "assetBudget": 5000
}
```

---

## ShellConfig (UI Agent Output)

The complete UI shell definition: every screen, navigation path, slot position, and visual theme.

```typescript
interface ShellConfig {
  // Required
  screens: ScreenDefinition[];
  navigationGraph: NavigationEdge[];
  currencyBarConfig: CurrencyBarConfig;
  shopSlots: ShopSlot[];
  adSlotPositions: AdSlotPosition[];
  ftueFlow: FTUEStep[];
  theme: Theme;                        // Full theme (see SharedInterfaces)
  toastConfig: ToastConfig;

  // Optional
  deepLinks?: DeepLinkEntry[];
  accessibilityConfig?: AccessibilityConfig;
}

interface ScreenDefinition {
  id: string;                          // "main_menu", "shop", "settings", "gameplay"
  type: 'static' | 'slot' | 'overlay';
  layout: LayoutDescriptor;
  slots?: SlotDefinition[];            // Content slots for other verticals
}

interface NavigationEdge {
  from: string;                        // Screen ID
  to: string;                          // Screen ID
  trigger: string;                     // "button_play", "back", "tab_shop"
  transition: 'push' | 'modal' | 'replace' | 'fade';
}

interface CurrencyBarConfig {
  currencies: Array<{
    type: CurrencyType;
    icon: AssetRef;
    position: 'left' | 'right';
    tapAction: 'open_shop' | 'none';
  }>;
  alwaysVisible: boolean;
  hideOnScreens: string[];             // Screen IDs where bar is hidden
}

interface ShopSlot {
  slotId: string;
  category: 'currency_pack' | 'bundle' | 'daily_deal' | 'cosmetic';
  maxItems: number;
  position: number;                    // Display order
}

interface AdSlotPosition {
  slotId: string;
  screen: string;                      // Screen ID
  format: 'banner' | 'interstitial' | 'rewarded';
  trigger: string;                     // When to show: "on_death", "level_complete", "menu_open"
  position?: 'top' | 'bottom';        // For banners
}

interface FTUEStep {
  stepId: string;
  screen: string;
  highlightElement: string;
  message: string;
  order: number;
  skippable: boolean;
}
```

**Validation rules:**
- `screens` must include at minimum: a main menu, shop, settings, and gameplay slot
- `navigationGraph` must form a connected graph from the main menu
- `theme` must conform to the `Theme` contract from [SharedInterfaces](../Verticals/00_SharedInterfaces.md)
- All `AssetRef` values must have valid `type` and `path` fields
- `ftueFlow` must have at least 3 steps and be ordered sequentially

**Example snippet:**
```json
{
  "screens": [
    { "id": "main_menu", "type": "static", "layout": { "type": "vertical_stack" } },
    { "id": "gameplay", "type": "slot", "layout": { "type": "fullscreen" },
      "slots": [{ "slotId": "mechanic_slot", "acceptsInterface": "IMechanic" }] },
    { "id": "shop", "type": "static", "layout": { "type": "grid" } }
  ],
  "adSlotPositions": [
    { "slotId": "death_rewarded", "screen": "gameplay", "format": "rewarded", "trigger": "on_death" },
    { "slotId": "level_interstitial", "screen": "gameplay", "format": "interstitial", "trigger": "level_complete" }
  ]
}
```

---

## MechanicConfig (Mechanics Agent Output)

The core gameplay module definition: what the player does, how scoring works, and what parameters downstream agents can tune.

```typescript
interface MechanicConfig {
  // Required
  mechanicType: string;
  scoringFormula: ScoringFormula;
  rewardEvents: RewardEventDefinition[];
  adjustableParams: ParamDefinition[];   // From SharedInterfaces
  levelSequence: LevelConfig[];
  inputModel: InputModel;

  // Optional
  powerups?: PowerupDefinition[];
  comboSystem?: ComboConfig;
  tutorialLevels?: LevelConfig[];
}

interface ScoringFormula {
  baseMetric: string;                    // "distance", "matches", "kills", "time_survived"
  multipliers: Array<{
    source: string;                      // "combo", "powerup", "difficulty"
    formula: string;                     // "base * 1.5", "base + bonus * combo_count"
  }>;
  maxScore?: number;
}

interface RewardEventDefinition {
  eventName: string;                     // Must match StandardEvents keys
  trigger: string;                       // "level_complete", "score_threshold", "item_collect"
  payload: Record<string, string>;       // Field name -> type description
  frequency: 'per_level' | 'per_session' | 'per_action' | 'milestone';
}

interface LevelConfig {
  levelId: string;
  difficulty: DifficultyScore;
  params: Record<string, number>;        // ParamDefinition name -> value
  winCondition: WinCondition;
}

interface WinCondition {
  type: 'score_target' | 'survive_time' | 'collect_items' | 'reach_distance' | 'defeat_enemies';
  target: number;
}

interface InputModel {
  type: 'tap' | 'swipe' | 'drag' | 'tilt' | 'virtual_joystick';
  actions: Array<{
    gesture: string;                     // "swipe_up", "tap", "drag_left"
    gameAction: string;                  // "jump", "select", "move_left"
  }>;
}
```

**Validation rules:**
- `adjustableParams` must have at least 1 entry; each must have `min` < `max`
- `rewardEvents` must include at least one event with `trigger: "level_complete"`
- `levelSequence` must have at least 10 levels
- All `difficulty` values must be integers 1-10
- `inputModel.actions` must have at least 1 action

**Example snippet:**
```json
{
  "mechanicType": "endless_runner",
  "scoringFormula": {
    "baseMetric": "distance",
    "multipliers": [{ "source": "combo", "formula": "base * (1 + combo_count * 0.1)" }]
  },
  "adjustableParams": [
    { "name": "speed", "type": "float", "min": 3.0, "max": 20.0, "default": 5.0,
      "description": "Player movement speed in meters per second" },
    { "name": "obstacleFrequency", "type": "float", "min": 0.01, "max": 0.1, "default": 0.02,
      "description": "Obstacles per meter of track" }
  ]
}
```

---

## EconomyTable (Economy Agent Output)

The complete economy definition: currencies, earn rates, costs, time-gates, and reward tables.

```typescript
interface EconomyTable {
  // Required
  currencyDefinitions: CurrencyDefinition[];
  earnRates: EarnRateTable;
  sinks: SinkDefinition[];
  rewardTiers: RewardTierConfig[];      // From SharedInterfaces
  shopCatalog: ShopCatalogEntry[];
  currencyConversionRates: ConversionRate[];

  // Optional
  energySystem?: EnergyConfig;
  timeGates?: TimeGateDefinition[];
  passSystem?: PassConfig;
  dailyLoginRewards?: DailyLoginSchedule;
  monthlyRewardBudget?: number;
}

interface CurrencyDefinition {
  type: CurrencyType;
  name: string;                          // Display name: "Coins", "Gems"
  icon: AssetRef;
  initialBalance: number;
  maxBalance?: number;                   // Cap (optional)
}

interface EarnRateTable {
  perLevel: Record<RewardTier, RewardBundle>;
  perAction: Array<{
    action: string;                      // "daily_login", "ad_watched", "achievement"
    reward: RewardBundle;
  }>;
  dailyCap?: CurrencyAmount;             // Max earnable per day
}

interface SinkDefinition {
  sinkId: string;
  name: string;                          // "Character Skin", "Extra Life", "Speed Boost"
  price: Price;
  category: 'cosmetic' | 'consumable' | 'permanent_upgrade' | 'energy';
  availableInShop: boolean;
}

interface ConversionRate {
  from: CurrencyType;
  to: CurrencyType;
  rate: number;                          // 1 premium = rate * basic
}

interface EnergyConfig {
  maxEnergy: number;
  costPerPlay: number;
  regenRateMinutes: number;              // Minutes per 1 energy unit
  refillPrice: Price;                    // Premium currency price for full refill
}

interface PassConfig {
  type: 'battle_pass' | 'season_pass';
  durationDays: number;
  tiers: number;
  freeRewards: RewardBundle[];
  premiumRewards: RewardBundle[];
  premiumPrice: Price;
}
```

**Validation rules:**
- `currencyDefinitions` must include at least one `'basic'` type
- `earnRates.perLevel` must have entries for all `RewardTier` values used in `DifficultyProfile`
- All `Price` amounts must be positive integers
- `currencyConversionRates` must not create arbitrage loops
- `energySystem.regenRateMinutes` must be between 5 and 60
- `shopCatalog` must have at least 1 entry

**Example snippet:**
```json
{
  "currencyDefinitions": [
    { "type": "basic", "name": "Coins", "icon": { "assetId": "icon_coin", "type": "sprite", "path": "ui/icons/coin.png" }, "initialBalance": 100 },
    { "type": "premium", "name": "Gems", "icon": { "assetId": "icon_gem", "type": "sprite", "path": "ui/icons/gem.png" }, "initialBalance": 10 }
  ],
  "currencyConversionRates": [
    { "from": "premium", "to": "basic", "rate": 100 }
  ],
  "energySystem": {
    "maxEnergy": 5,
    "costPerPlay": 1,
    "regenRateMinutes": 20,
    "refillPrice": { "type": "premium_currency", "amount": 10 }
  }
}
```

---

## DifficultyProfile (Difficulty Agent Output)

The difficulty curve: how challenge scales across levels and maps to economy reward tiers.

```typescript
interface DifficultyProfile {
  // Required
  curveType: 'linear' | 'logarithmic' | 'step' | 'sawtooth' | 'custom';
  levelDifficultyMap: LevelDifficultyEntry[];
  rewardTierMapping: Record<DifficultyScore, RewardTier>;  // From SharedInterfaces
  parameterCurves: ParameterCurve[];

  // Optional
  restPoints?: number[];                 // Level indices where difficulty temporarily decreases
  difficultyFloor?: DifficultyScore;     // Minimum difficulty after rest
  adaptiveDifficulty?: AdaptiveDifficultyConfig;
}

interface LevelDifficultyEntry {
  levelId: string;
  levelIndex: number;
  difficulty: DifficultyScore;           // 1-10
  params: Record<string, number>;        // Concrete parameter values for this level
}

interface ParameterCurve {
  paramName: string;                     // Must match a ParamDefinition.name from MechanicConfig
  points: Array<{
    levelIndex: number;
    value: number;
  }>;
  interpolation: 'linear' | 'ease_in' | 'ease_out' | 'step';
}

interface AdaptiveDifficultyConfig {
  enabled: boolean;
  metric: 'win_rate' | 'completion_time' | 'score';
  targetRange: { min: number; max: number };
  adjustmentSpeed: number;               // 0.0-1.0, how fast to adapt
}
```

**Validation rules:**
- `levelDifficultyMap` must have entries for all levels in `MechanicConfig.levelSequence`
- `rewardTierMapping` must cover all 10 difficulty scores (1-10)
- `parameterCurves[].paramName` must reference parameters defined in `MechanicConfig.adjustableParams`
- All parameter values must be within the `min`/`max` range of their `ParamDefinition`
- First 5 levels must have difficulty <= 3 (tutorial zone)

**Example snippet:**
```json
{
  "curveType": "logarithmic",
  "rewardTierMapping": {
    "1": "easy", "2": "easy", "3": "medium", "4": "medium",
    "5": "hard", "6": "hard", "7": "very_hard", "8": "very_hard",
    "9": "extreme", "10": "extreme"
  },
  "parameterCurves": [
    {
      "paramName": "speed",
      "points": [{ "levelIndex": 0, "value": 5.0 }, { "levelIndex": 50, "value": 15.0 }],
      "interpolation": "ease_in"
    }
  ]
}
```

---

## MonetizationPlan (Monetization Agent Output)

Revenue mechanics: IAP catalog, ad placements, and compliance rules.

```typescript
interface MonetizationPlan {
  // Required
  iapCatalog: IAPProduct[];
  adPlacements: AdPlacement[];
  complianceRules: ComplianceRule[];
  pricingStrategy: PricingStrategy;

  // Optional
  promotions?: Promotion[];
  noAdConditions?: NoAdCondition[];
  spendingCaps?: SpendingCap[];
}

interface IAPProduct {
  productId: string;
  name: string;
  description: string;
  price: Price;                          // Real money price
  contents: RewardBundle;                // What the player gets
  type: 'consumable' | 'non_consumable' | 'subscription';
  badge?: 'best_value' | 'most_popular' | 'limited';
  maxPurchases?: number;                 // For one-time bundles
}

interface AdPlacement {
  placementId: string;
  slotId: string;                        // References ShellConfig.adSlotPositions
  format: 'banner' | 'interstitial' | 'rewarded';
  frequency: AdFrequency;
  reward?: RewardBundle;                 // For rewarded videos
  networks: string[];                    // Ad network priority: ["admob", "ironsource"]
}

interface AdFrequency {
  maxPerSession: number;
  minIntervalSeconds: number;
  maxPerDay: number;
  cooldownAfterPurchase?: DurationSeconds;
}

interface ComplianceRule {
  ruleId: string;
  type: 'coppa' | 'gdpr' | 'app_store' | 'age_gate' | 'price_transparency';
  condition: string;                     // When the rule applies
  action: string;                        // What to do
}

interface PricingStrategy {
  tier: MonetizationTier;
  firstPurchaseDiscount?: number;        // 0.0-0.5 (percentage off)
  bundleStrategy: 'value_ladder' | 'anchor_high' | 'starter_hook';
}

interface NoAdCondition {
  condition: 'any_iap' | 'subscription_active' | 'premium_user';
  durationDays?: number;                 // Suppress ads for N days after condition met
}

interface SpendingCap {
  segment: string;                       // "minor", "new_player"
  dailyMaxCents: number;
  monthlyMaxCents: number;
}
```

**Validation rules:**
- Every `adPlacement.slotId` must reference an existing `ShellConfig.adSlotPositions[].slotId`
- IAP prices must use standard App Store price tiers ($0.99, $1.99, $2.99, $4.99, $9.99, $19.99, $49.99, $99.99)
- `adFrequency.minIntervalSeconds` must be >= 60 for interstitials
- `adFrequency.maxPerDay` must be <= 10 for rewarded, <= 20 for interstitials
- If `GameSpec.audience.ageRange` includes under-13, `complianceRules` must include a `'coppa'` rule
- All `reward` amounts in IAP products must align with `EconomyTable.currencyConversionRates`

**Example snippet:**
```json
{
  "iapCatalog": [
    {
      "productId": "gem_pack_small",
      "name": "Handful of Gems",
      "description": "100 Gems",
      "price": { "type": "real_money", "amount": 99, "currency": "USD" },
      "contents": { "currencies": [{ "type": "premium", "amount": 100 }], "items": [], "xp": 0 },
      "type": "consumable"
    }
  ],
  "noAdConditions": [
    { "condition": "any_iap", "durationDays": 7 }
  ]
}
```

---

## EventCalendar (LiveOps Agent Output)

Post-launch content schedule: events, challenges, and seasonal content.

```typescript
interface EventCalendar {
  // Required
  events: ScheduledEvent[];
  dailyChallenges: DailyChallengeConfig;

  // Optional
  seasonalThemes?: SeasonalTheme[];
  recurringEvents?: RecurringEventTemplate[];
}

interface ScheduledEvent {
  eventId: string;
  config: EventConfig;                   // From SharedInterfaces (IEvent contract)
  targetSegments?: string[];             // Player segments to target (empty = all)
  priority: number;                      // Display priority when multiple events active
  requiredAssets: AssetRef[];            // Event-specific assets
}

interface DailyChallengeConfig {
  enabled: boolean;
  challengePool: DailyChallenge[];
  maxActivePerDay: number;
  refreshTimeUTC: string;                // "00:00", "12:00"
}

interface DailyChallenge {
  challengeId: string;
  description: string;                   // "Run 2000m without dying"
  requirement: {
    metric: string;                      // "distance", "coins_collected", "levels_completed"
    target: number;
    timeWindowHours: number;             // Must complete within this window
  };
  reward: RewardBundle;
  difficulty: DifficultyScore;
}

interface SeasonalTheme {
  themeId: string;
  name: string;                          // "Winter Wonderland", "Summer Splash"
  startAt: ISO8601;
  endAt: ISO8601;
  themeOverlay: Partial<Theme>;          // Override colors, fonts for the season
  associatedEvents: string[];            // Event IDs that use this theme
}

interface RecurringEventTemplate {
  templateId: string;
  recurrence: 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek?: number;                    // 0 = Sunday, for weekly events
  eventConfigTemplate: Partial<EventConfig>;
}
```

**Validation rules:**
- No two events of the same `type` can overlap in time
- All `EventConfig.rewardBudget` totals over 30 days must not exceed 150% of `EconomyTable.monthlyRewardBudget`
- `dailyChallenges.challengePool` must have at least 7 entries (one week's worth)
- All `requiredAssets` must be submitted as `AssetRequest` to the Asset Agent
- `seasonalThemes` date ranges must not overlap

**Example snippet:**
```json
{
  "events": [
    {
      "eventId": "neon_rush_w1",
      "config": {
        "eventId": "neon_rush_w1",
        "type": "challenge",
        "name": "Neon Rush",
        "startAt": "2026-04-14T00:00:00Z",
        "endAt": "2026-04-21T00:00:00Z",
        "milestones": [
          { "id": "m1", "name": "Warm Up", "requirement": 1000,
            "reward": { "currencies": [{ "type": "basic", "amount": 200 }], "items": [], "xp": 50 } }
        ],
        "rewardBudget": { "currencies": [{ "type": "basic", "amount": 5000 }], "items": [], "xp": 500 }
      },
      "priority": 1,
      "requiredAssets": [{ "assetId": "neon_rush_banner", "type": "sprite", "path": "events/neon_rush/banner.png" }]
    }
  ]
}
```

---

## EventTaxonomy (Analytics Agent Output)

The full instrumentation catalog: every trackable event, funnel, KPI, and dashboard configuration.

```typescript
interface EventTaxonomy {
  // Required
  events: AnalyticsEventDefinition[];
  funnels: FunnelDefinition[];
  kpis: KPIDefinition[];
  dashboards: DashboardConfig[];

  // Optional
  alerts?: AlertRule[];
  segments?: SegmentDefinition[];
  privacyConfig?: PrivacyConfig;
}

interface AnalyticsEventDefinition {
  name: string;                          // Snake_case: "level_complete"
  category: 'gameplay' | 'economy' | 'monetization' | 'liveops' | 'system' | 'social';
  properties: PropertyDefinition[];
  source: string;                        // Agent that emits this event
  sampleRate?: number;                   // 0.0-1.0, for high-frequency events
}

interface PropertyDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  enumValues?: string[];                 // If type is string and constrained
  description: string;
}

interface FunnelDefinition {
  funnelId: string;
  name: string;                          // "Acquisition Funnel", "Purchase Funnel"
  category: 'acquisition' | 'engagement' | 'monetization' | 'retention';
  steps: FunnelStep[];
  expectedConversionRate: number;        // 0.0-1.0 overall funnel conversion
}

interface FunnelStep {
  stepId: string;
  eventName: string;                     // References an AnalyticsEventDefinition.name
  filter?: Record<string, unknown>;      // Optional property filter
  expectedDropoff: number;               // Expected % who don't reach next step
}

interface KPIDefinition {
  kpiId: string;
  name: string;                          // "D1 Retention", "ARPDAU", "Sessions per Day"
  formula: string;                       // "unique_users_day_N / unique_users_day_0"
  granularity: 'hourly' | 'daily' | 'weekly' | 'monthly';
  segments?: string[];                   // Break down by these segments
  target?: { min: number; max: number }; // Expected healthy range
}

interface DashboardConfig {
  dashboardId: string;
  name: string;                          // "Executive", "Engagement", "Monetization", "LiveOps"
  panels: PanelConfig[];
}

interface PanelConfig {
  panelId: string;
  title: string;
  type: 'line_chart' | 'bar_chart' | 'table' | 'metric_card' | 'funnel_chart';
  kpiIds: string[];
  timeRange: 'last_24h' | 'last_7d' | 'last_30d' | 'custom';
}

interface AlertRule {
  alertId: string;
  kpiId: string;
  condition: 'below_min' | 'above_max' | 'anomaly' | 'trend_reversal';
  threshold?: number;
  severity: 'info' | 'warning' | 'critical';
  notifyChannel: string;                 // "email", "slack", "pagerduty"
}
```

**Validation rules:**
- `events` must include all entries from `StandardEvents` in [SharedInterfaces](../Verticals/00_SharedInterfaces.md)
- Every `FunnelStep.eventName` must reference an existing `AnalyticsEventDefinition.name`
- Every `KPIDefinition.kpiId` referenced in `DashboardConfig.panels` must exist
- `funnels` must include at least one of each category: acquisition, engagement, monetization
- `alerts` must not reference non-existent `kpiId` values

**Example snippet:**
```json
{
  "kpis": [
    {
      "kpiId": "d1_retention",
      "name": "D1 Retention",
      "formula": "unique_users_day_1 / unique_users_day_0",
      "granularity": "daily",
      "segments": ["spending", "engagement"],
      "target": { "min": 0.35, "max": 0.55 }
    }
  ],
  "alerts": [
    {
      "alertId": "d1_retention_drop",
      "kpiId": "d1_retention",
      "condition": "below_min",
      "threshold": 0.30,
      "severity": "critical",
      "notifyChannel": "slack"
    }
  ]
}
```

---

## ExperimentPlan (AB Testing Agent Output)

Initial experiments to run post-launch, with variant definitions and success criteria.

```typescript
interface ExperimentPlan {
  // Required
  experiments: Experiment[];
  globalGuardrails: GuardrailMetric[];

  // Optional
  mutualExclusions?: MutualExclusion[];
  launchSequence?: string[];             // Order to start experiments
}

interface Experiment {
  experimentId: string;
  name: string;
  hypothesis: string;                    // "Reducing ad frequency will improve D7 retention"
  parameter: ExperimentParameter;
  variants: Variant[];
  trafficPercent: number;                // % of total users in this experiment
  successMetric: MetricReference;
  guardrailMetrics: MetricReference[];
  minSampleSize: number;
  maxDurationDays: number;
  status: 'draft' | 'ready' | 'running' | 'concluded';
}

interface ExperimentParameter {
  agent: string;                         // "economy", "difficulty", "monetization"
  paramPath: string;                     // "earnRates.perLevel.easy.currencies[0].amount"
  type: 'numeric' | 'categorical' | 'boolean';
}

interface Variant {
  variantId: string;
  name: string;                          // "control", "low_ads", "high_rewards"
  isControl: boolean;
  trafficPercent: number;                // Within the experiment's traffic allocation
  paramValue: unknown;                   // The value for this variant
}

interface MetricReference {
  kpiId: string;                         // References EventTaxonomy.kpis
  direction: 'increase' | 'decrease';    // Which direction is better
  minimumEffect: number;                 // Minimum detectable effect size
}

interface GuardrailMetric {
  kpiId: string;
  threshold: number;                     // Experiment stops if metric crosses this
  direction: 'must_not_decrease' | 'must_not_increase';
}

interface MutualExclusion {
  experimentIds: string[];               // These experiments cannot overlap users
  reason: string;
}
```

**Validation rules:**
- Sum of all `variant.trafficPercent` within an experiment must equal 100
- Each experiment must have exactly 1 variant with `isControl: true`
- `successMetric.kpiId` and all `guardrailMetrics[].kpiId` must exist in `EventTaxonomy.kpis`
- `minSampleSize` must be >= 1000
- `maxDurationDays` must be between 3 and 90
- No two experiments should modify the same `paramPath` unless in `mutualExclusions`
- `trafficPercent` across all concurrent experiments must not exceed 100

**Example snippet:**
```json
{
  "experiments": [
    {
      "experimentId": "exp_ad_frequency_001",
      "name": "Ad Frequency Test",
      "hypothesis": "Showing interstitials every 5th run instead of 3rd will improve D7 retention without hurting ARPDAU",
      "parameter": { "agent": "monetization", "paramPath": "adPlacements[0].frequency.maxPerSession", "type": "numeric" },
      "variants": [
        { "variantId": "control", "name": "Every 3rd run", "isControl": true, "trafficPercent": 50, "paramValue": 3 },
        { "variantId": "treatment", "name": "Every 5th run", "isControl": false, "trafficPercent": 50, "paramValue": 5 }
      ],
      "trafficPercent": 20,
      "successMetric": { "kpiId": "d7_retention", "direction": "increase", "minimumEffect": 0.02 },
      "guardrailMetrics": [{ "kpiId": "arpdau", "direction": "must_not_decrease", "minimumEffect": 0.05 }],
      "minSampleSize": 5000,
      "maxDurationDays": 14,
      "status": "ready"
    }
  ]
}
```

---

## AssetManifest (Asset Agent Output)

The delivered asset catalog: every fulfilled asset with metadata, paths, and fallback references.

```typescript
interface AssetManifest {
  // Required
  assets: DeliveredAsset[];
  totalSizeBytes: number;
  generationMethod: Record<string, number>; // Method -> count: { "ai_generated": 40, "purchased": 10 }

  // Optional
  unfulfilled?: UnfulfilledRequest[];
  atlases?: AtlasDefinition[];
  audioSprites?: AudioSpriteSheet[];
}

interface DeliveredAsset {
  assetId: string;
  type: AssetRef['type'];                // "sprite", "texture", "mesh", "animation", "audio", "font"
  path: string;                          // Relative path in game bundle
  fallback?: string;                     // Fallback asset ID
  resolution?: { width: number; height: number };
  fileSizeBytes: number;
  format: string;                        // "png", "webp", "ogg", "mp3", "ttf"
  source: 'ai_generated' | 'marketplace' | 'template' | 'artist_commissioned';
  requestedBy: string;                   // Agent that submitted the AssetRequest
  tags: string[];                        // "ui", "gameplay", "event", "audio"
}

interface UnfulfilledRequest {
  requestId: string;
  reason: string;                        // "budget_exceeded", "generation_failed", "timeout"
  fallbackUsed: string;                  // Fallback asset ID that was substituted
}

interface AtlasDefinition {
  atlasId: string;
  path: string;
  sprites: Array<{
    assetId: string;
    x: number; y: number;
    width: number; height: number;
  }>;
}
```

**Validation rules:**
- Every `assetId` must be unique
- `totalSizeBytes` must match the sum of all `DeliveredAsset.fileSizeBytes`
- Every `fallback` reference must point to an existing `assetId`
- All `AssetRef` values used across other agent outputs must have a matching `DeliveredAsset`
- `unfulfilled` entries must each have a valid `fallbackUsed` reference
- Total size must be within platform budget (see [QualityGates.md](./QualityGates.md))

**Example snippet:**
```json
{
  "assets": [
    {
      "assetId": "icon_coin",
      "type": "sprite",
      "path": "ui/icons/coin.png",
      "resolution": { "width": 64, "height": 64 },
      "fileSizeBytes": 2048,
      "format": "png",
      "source": "ai_generated",
      "requestedBy": "economy_agent",
      "tags": ["ui", "currency"]
    }
  ],
  "totalSizeBytes": 52428800,
  "generationMethod": { "ai_generated": 45, "marketplace": 12, "template": 3 }
}
```

---

## Contract Versioning

All contracts are versioned alongside the pipeline. When a contract changes:

1. The contract version is incremented
2. A migration path is documented (old schema -> new schema)
3. All producing and consuming agents are updated
4. The `SharedInterfaces` document is updated if the change affects cross-vertical types

```typescript
interface ContractVersion {
  contractName: string;
  version: string;                       // Semver: "1.2.0"
  breakingChange: boolean;
  changelog: string;
}
```

---

## Related Documents

- [Game Creation Pipeline](./GameCreationPipeline.md) -- Pipeline phases
- [Agent Handoffs](./AgentHandoffs.md) -- How artifacts flow between agents
- [Quality Gates](./QualityGates.md) -- Validation rules per gate
- [Error Recovery](./ErrorRecovery.md) -- What happens when contracts are violated
- [Shared Interfaces](../Verticals/00_SharedInterfaces.md) -- Shared type definitions
