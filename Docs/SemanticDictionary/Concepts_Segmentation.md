# Concept: Segmentation

Segmentation is the practice of grouping players by behavior, spending, or lifecycle stage to deliver tailored experiences.

## Why This Matters

A whale and a new player should not see the same economy, the same ads, or the same offers. Treating all players identically leaves money on the table (whales want to spend more) and frustrates casual players (ads they can't escape, prices they can't afford).

Every vertical in the AI Game Engine is segment-aware: Economy adjusts faucet/sink ratios per segment, Monetization adjusts ad frequency and offer pricing, Difficulty can adjust curves, and LiveOps targets events.

## Player Segments

### By Spending Behavior

| Segment | Definition | % of Players | % of Revenue | Key Behavior |
|---------|-----------|-------------|-------------|--------------|
| **Whale** | Spends > $100/month | 1-2% | 40-60% | Buys everything, values exclusivity |
| **Dolphin** | Spends $10-100/month | 5-10% | 20-30% | Selective purchases, value-conscious |
| **Minnow** | Spends $1-10/month | 10-15% | 5-10% | Occasional impulse buys, starter packs |
| **Free Player** | Spends $0 | 70-80% | 0% (ad revenue only) | Ad-supported, may convert over time |

### By Lifecycle Stage

| Segment | Definition | Behavior | Goal |
|---------|-----------|----------|------|
| **New** | D0-D3 | Exploring, learning | Retain through FTUE, hook with core loop |
| **Activated** | D3-D7, completed FTUE | Engaged with core loop | Deepen engagement, introduce monetization |
| **Engaged** | D7-D30, regular sessions | Habitual player | Maximize LTV, introduce LiveOps |
| **Loyal** | D30+, high frequency | Core audience | Sustain with content, maximize monetization |
| **At-Risk** | Session frequency declining | Disengaging | Re-engage with offers, events, notifications |
| **Churned** | No session in 14+ days | Gone | Win-back campaigns, resurrection events |

### By Engagement Pattern

| Segment | Sessions/Day | Session Length | Best Monetization |
|---------|-------------|---------------|-------------------|
| **Hardcore** | 5+ | 15+ min | IAP + Pass |
| **Regular** | 2-4 | 5-15 min | IAP + Ads |
| **Casual** | 1 | 3-5 min | Ads primarily |
| **Weekend Warrior** | 0-1 weekday, 3+ weekend | Variable | Weekend offers |

## Segment-Aware Verticals

### Economy
| Segment | Faucet Adjustment | Sink Adjustment |
|---------|------------------|-----------------|
| New | +50% free faucets (generous start) | -50% sink costs (nothing expensive) |
| Free Player | Standard free faucets, effort faucets (ads) | Standard sinks |
| Minnow | Standard | Standard + affordable premium sinks |
| Dolphin | Standard | Premium sinks + exclusive items |
| Whale | Standard | High-value exclusive sinks, no ceiling |
| Churned | +100% win-back bonus | -30% sink costs (welcome back) |

### Monetization
| Segment | Ad Load | IAP Offers | Offer Pricing |
|---------|---------|-----------|---------------|
| New | None (no ads in first 3 sessions) | Starter bundle only | Low ($0.99-$2.99) |
| Free Player | Full ad load | Conversion-focused (first purchase discount) | Low ($0.99-$4.99) |
| Minnow | Moderate ad load | Value packs, limited bundles | Medium ($4.99-$9.99) |
| Dolphin | Low ad load | Premium bundles, passes | Medium-High ($9.99-$49.99) |
| Whale | Minimal/no ads | Exclusive offers, VIP tiers | High ($49.99-$99.99) |

### Difficulty
| Segment | Curve Adjustment |
|---------|-----------------|
| New | Easier first 10 levels (extended tutorial curve) |
| Hardcore | Steeper curve, harder variants unlocked |
| Casual | Gentler curve, more relief levels |
| At-Risk | Slightly easier (reduce frustration-driven churn) |

### LiveOps
| Segment | Event Targeting |
|---------|----------------|
| New | Simple events, high-reward introductory events |
| Engaged | Full event calendar, competitive events |
| At-Risk | Special "come back" events with bonus rewards |
| Churned | Push notification for major events, win-back offers |

## Segment Assignment

Players are assigned to segments based on observable behavior:

```typescript
interface SegmentAssignment {
  playerId: string;
  spendingSegment: 'whale' | 'dolphin' | 'minnow' | 'free';
  lifecycleSegment: 'new' | 'activated' | 'engaged' | 'loyal' | 'at_risk' | 'churned';
  engagementSegment: 'hardcore' | 'regular' | 'casual' | 'weekend_warrior';
  assignedAt: ISO8601;
  nextReassessment: ISO8601;  // Segments re-evaluated periodically
}
```

**Reassessment frequency:** Daily for lifecycle and engagement segments. Weekly for spending segments (spending patterns are slower to change).

**Promotion/Demotion:** Players move between segments as behavior changes. A free player who makes their first purchase becomes a minnow. An engaged player whose sessions decline becomes at-risk.

## Privacy & Ethics

- Segments are behavioral, not demographic. We don't segment by age, gender, or location (except for legal compliance).
- Segment data stays on the analytics backend. The game client receives only the resulting configuration (ad load, offer pricing), not the segment label.
- Whales are not exploited — spending caps still apply per ethical guardrails.
- Segmentation is transparent in documentation but invisible to players.

## Related Documents

- [Economy Segmentation](../Verticals/04_Economy/Segmentation.md) — Per-segment economy tables
- [Monetization Spec](../Verticals/03_Monetization/Spec.md) — Segment-aware ad and IAP strategy
- [Ethical Guardrails](../Verticals/03_Monetization/EthicalGuardrails.md) — Spending caps per segment
- [Analytics Spec](../Verticals/08_Analytics/Spec.md) — Segment tracking events
- [Glossary: Segment, Whale, Dolphin, Minnow](Glossary.md#segment)
