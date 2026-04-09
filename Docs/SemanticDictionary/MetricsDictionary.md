# Metrics Dictionary

Precise definitions for mobile gaming KPIs used across the AI Game Engine. Every metric referenced in any document must be defined here with its formula.

> **For domain term definitions, see [Glossary.md](Glossary.md).**

---

## Engagement Metrics

### DAU (Daily Active Users)
**Formula:** Count of unique users who opened the app at least once in a calendar day.
**Granularity:** Daily.
**Used by:** Analytics, AB Testing, LiveOps.

### WAU (Weekly Active Users)
**Formula:** Count of unique users who opened the app at least once in a rolling 7-day window.
**Granularity:** Daily (rolling).
**Used by:** Analytics.

### MAU (Monthly Active Users)
**Formula:** Count of unique users who opened the app at least once in a rolling 30-day window.
**Granularity:** Daily (rolling).
**Used by:** Analytics, business reporting.

### DAU/MAU Ratio (Stickiness)
**Formula:** `DAU / MAU` on a given day.
**Target:** > 0.20 for casual games, > 0.30 for mid-core.
**Interpretation:** Higher = players return more frequently.

### Session Length
**Formula:** Time from app open (foreground) to app close (background), in seconds.
**Aggregation:** Median per day (mean is skewed by outliers).
**Target:** 5-15 minutes for casual, 15-30 minutes for mid-core.

### Sessions Per Day
**Formula:** Count of sessions per user per calendar day.
**Aggregation:** Mean across active users.
**Target:** 3-6 sessions/day for casual.

### Session Interval
**Formula:** Time between end of session N and start of session N+1, in hours.
**Used by:** Economy (energy regeneration tuning), LiveOps (notification timing).

### Playtime Per Day
**Formula:** Sum of all session lengths for a user in a calendar day, in minutes.
**Aggregation:** Median across active users.

---

## Retention Metrics

### D-N Retention (Day N Retention)
**Formula:** `Users active on day N after install / Users installed on day 0`, per cohort.
**Key days:** D1, D3, D7, D14, D30, D60, D90.
**Targets:**

| Day | Casual Target | Mid-Core Target |
|-----|--------------|-----------------|
| D1 | > 40% | > 35% |
| D3 | > 25% | > 20% |
| D7 | > 15% | > 12% |
| D14 | > 10% | > 8% |
| D30 | > 6% | > 5% |

### Rolling Retention
**Formula:** Percentage of a cohort that was active on day N **or any day after**.
**Interpretation:** Always >= D-N retention. Better reflects long-term engagement.

### Churn Rate
**Formula:** `1 - (DAU on day T / DAU on day T-1)`, smoothed over 7 days.
**Alternate:** Percentage of D7 cohort with no session in the last 14 days.

### Resurrection Rate
**Formula:** Users who were churned (no session in 14+ days) and returned, as percentage of churned users.
**Used by:** LiveOps (win-back campaigns), AB Testing (re-engagement experiments).

---

## Monetization Metrics

### ARPU (Average Revenue Per User)
**Formula:** `Total revenue in period / Total active users in period`.
**Granularity:** Daily, weekly, monthly.
**Includes:** IAP + ad revenue.

### ARPPU (Average Revenue Per Paying User)
**Formula:** `Total IAP revenue in period / Count of users who made at least one purchase in period`.
**Granularity:** Monthly.
**Interpretation:** How much payers spend. Does NOT include ad revenue.

### ARPDAU (Average Revenue Per Daily Active User)
**Formula:** `Total revenue on day T / DAU on day T`.
**Target:** $0.05-0.15 for casual, $0.15-0.50 for mid-core.

### Conversion Rate (Payer Conversion)
**Formula:** `Users who made at least one IAP / Total users`, for a cohort over a period.
**Target:** 2-5% of D30 cohort for casual.

### LTV (Lifetime Value)
**Formula:** Predicted total revenue a user will generate over their entire lifecycle.
**Estimation methods:**
- Simple: `ARPDAU * Predicted Lifetime Days`
- Cohort-based: Sum of daily ARPU for the cohort's retention curve
- Predictive: ML model using early behavior signals

### LTV/CPI Ratio
**Formula:** `LTV / CPI`.
**Target:** > 1.0 (profitable), > 1.5 (healthy margin).

### CPI (Cost Per Install)
**Formula:** `Total acquisition spend / Total installs`.
**Granularity:** Per campaign, per channel, per geo.

### ROAS (Return on Ad Spend)
**Formula:** `Revenue from acquired users / Acquisition cost`, measured at D7, D30, D90.
**Target:** D30 ROAS > 100% (breakeven), D90 ROAS > 150%.

### IAP Revenue Per Session
**Formula:** `Total IAP revenue / Total sessions` in a period.
**Used by:** Economy (purchase pressure tuning).

---

## Ad Metrics

### Ad Revenue Per DAU
**Formula:** `Total ad revenue on day T / DAU on day T`.
**Breakdown:** By ad format (banner, interstitial, rewarded).

### Ad Impressions Per Session
**Formula:** `Total ad impressions / Total sessions` in a period.
**Breakdown:** By format.
**Limits:** See [EthicalGuardrails.md](../Verticals/03_Monetization/EthicalGuardrails.md) for caps.

### Ad Fill Rate
**Formula:** `Ad impressions served / Ad requests made`.
**Target:** > 95%. Below this indicates mediation configuration issues.

### eCPM (Effective Cost Per Mille)
**Formula:** `(Ad revenue / Ad impressions) * 1000`.
**Breakdown:** By format, by network, by geo.
**Benchmarks:** Banner $1-3, Interstitial $5-15, Rewarded $10-30 (varies by geo).

### Rewarded Ad Opt-In Rate
**Formula:** `Users who watched a rewarded ad / Users who were offered a rewarded ad`.
**Target:** > 50%. Below this indicates poor reward value or bad placement.

### Ad Engagement Rate
**Formula:** `Users who viewed at least one ad / DAU`.

---

## Economy Metrics

### Currency Earn Rate
**Formula:** Basic currency earned per session, per day, per level.
**Used by:** Economy (faucet tuning), Difficulty (reward tier mapping).

### Currency Spend Rate
**Formula:** Basic currency spent per session, per day.
**Used by:** Economy (sink adequacy check).

### Currency Balance (Median)
**Formula:** Median basic currency balance across active players at end of day.
**Interpretation:** Rising = faucets outpace sinks (inflation risk). Falling = sinks too aggressive (frustration risk).

### Time-to-First-Purchase
**Formula:** Time from install to first IAP, in hours/days.
**Target:** D1-D3 for casual.
**Used by:** Monetization (offer timing), Economy (premium currency pacing).

### Premium Currency Conversion Rate
**Formula:** `Premium currency purchases / Total IAP transactions`.
**Used by:** Economy (premium currency pricing).

### Sink Coverage Ratio
**Formula:** `Total sink value / Total faucet value` over a period.
**Target:** 0.85-0.95 (sinks slightly less than faucets — player accumulates slowly).

---

## Difficulty Metrics

### Level Completion Rate
**Formula:** `Sessions where level N was completed / Sessions where level N was attempted`.
**Target:** 70-85% for casual, 50-70% for mid-core.
**Used by:** Difficulty (curve calibration).

### Level Attempt Count
**Formula:** Average number of attempts before completing level N.
**Target:** 1.2-1.5 for easy levels, 2-3 for hard levels.

### Frustration Index
**Formula:** `Sessions ending on a failed level / Total sessions`.
**Target:** < 20%. Above this indicates difficulty spike.
**Used by:** Difficulty (curve smoothing), Monetization (retry ad placement).

### Flow Score
**Formula:** Composite of completion rate, attempt count, and session-end-on-failure. Indicates whether difficulty matches player skill.
**Interpretation:** High = good flow. Low = too easy or too hard.

---

## AB Testing Metrics

### Statistical Significance
**Formula:** P-value < 0.05 (95% confidence) or P-value < 0.01 (99% confidence).
**Used by:** AB Testing (experiment conclusion criteria).

### Minimum Detectable Effect (MDE)
**Formula:** The smallest effect size the experiment is powered to detect, given sample size and significance level.
**Used by:** AB Testing (experiment design — determines required sample size).

### Sample Size Per Variant
**Formula:** `16 * σ² / MDE²` (simplified for 80% power, α=0.05).
**Used by:** AB Testing (experiment duration estimation).

### Experiment Velocity
**Formula:** Number of experiments concluded per week.
**Target:** > 3 per week across all verticals.

### Win Rate
**Formula:** `Experiments where a variant beat control / Total concluded experiments`.
**Target:** 30-40% (lower is fine — it means you're testing bold hypotheses).

---

## LiveOps Metrics

### Event Participation Rate
**Formula:** `Users who engaged with the event / DAU during event period`.
**Target:** > 40% for major events.

### Event Revenue Uplift
**Formula:** `ARPDAU during event / ARPDAU baseline` (7-day pre-event average).
**Target:** > 1.2x for monetization events.

### Event Retention Impact
**Formula:** `D7 retention of event participants / D7 retention of non-participants`, controlling for cohort.

### Content Freshness Score
**Formula:** Days since last new content (event, level pack, feature). Higher = staler.
**Target:** < 7 days between content drops.

---

## Asset Metrics

### Asset Reuse Rate
**Formula:** `Assets used in 2+ games / Total assets in library`.
**Target:** > 60%.

### Asset Sourcing Cost
**Formula:** Average cost per asset by sourcing channel (AI-generated, purchased, artist-commissioned).
**Used by:** Asset (budget optimization).

### Asset Delivery Time
**Formula:** Time from asset request to delivery, in hours.
**Target:** < 24 hours for AI-generated, < 72 hours for purchased, < 2 weeks for artist.

---

## Related Documents

- [Glossary](Glossary.md) — Domain term definitions
- [KPI Dashboards](../Verticals/08_Analytics/KPIDashboards.md) — Dashboard configurations
- [AB Testing Spec](../Verticals/07_ABTesting/Spec.md) — How experiments use these metrics
- [Economy Spec](../Verticals/04_Economy/Spec.md) — How economy uses these metrics
