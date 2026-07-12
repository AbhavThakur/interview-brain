# Performance Metrics Vocabulary — TTID / TTFD / TTI + tiered thresholds

## The three headline metrics

| Metric                             | Definition                   | User perception      |
| ---------------------------------- | ---------------------------- | -------------------- |
| **TTID** (Time to Initial Display) | Skeleton/first frame appears | "App is responding"  |
| **TTFD** (Time to Full Display)    | Real content rendered        | "I can use this now" |
| **TTI** (Time to Interactive)      | Scroll/tap actually works    | "It's fully usable"  |

- **TTFD − TTID gap** = API + data processing + render time → this is where you optimize.
- Official Android definitions: https://developer.android.com/topic/performance/vitals/launch-time
- Web analogue (TTI): https://web.dev/articles/tti

## Device-tier thresholds (from my perf library)

| Metric        | High-end | Mid-range | Low-end |
| ------------- | -------- | --------- | ------- |
| TTID          | < 2.5s   | < 3.5s    | < 5.0s  |
| TTFD          | < 3.5s   | < 4.5s    | < 6.0s  |
| FPS           | ≥ 58     | ≥ 50      | ≥ 45    |
| Memory (warn) | 350MB    | 300MB     | 250MB   |
| Cold start    | < 2.0s   | < 2.5s    | < 3.0s  |

Tiers: high ≈ iPhone 15/16 Pro, S24 Ultra (~30% users) · mid ≈ iPhone 14/15, S23 (~50%) · low ≈ iPhone 12/13, Galaxy A (~20%).

**Why tiered:** one global budget = constant false alarms on low-end → alert fatigue → tool ignored. Auto-detect tier, judge each device by its own bar.

## FPS bands

60 = smooth · 50-59 = acceptable · 30-49 = visible jank · <30 = choppy. Frame budget 16.67ms.

## Other signals worth naming

Re-render counts, scroll-session FPS (min/avg/max, drops), network waterfall (op names, >1s flagged), memory-leak growth %, interaction timings (filter/sort/pagination), battery/thermal/low-power context (a 5%-battery thermally-throttled benchmark isn't comparable to a plugged-in one).
