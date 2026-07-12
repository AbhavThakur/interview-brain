# Story: AMQ — Ambiguous Query (end-to-end ownership)

> Numbers: **1.7s faster first-click · 12% more taps · 23% "Shop All" lift · 10%→100% flagged rollout**

## STAR (45-second spoken version)

- **S** — Ambiguous searches ("apple", "charger") gave users a flat, slow results page; engagement suffered on the highest-traffic surface.
- **T** — Own a full Ambiguous Query experience end-to-end: architecture through rollout.
- **A** — Category clustering UI with lazy-loaded product carousels (off-screen carousels don't mount), analytics batching (queue impressions, flush ~2s — not per-event bridge spam), feature-flagged rollout 10%→100% with A/B measurement.
- **R** — 1.7s faster first-click, 12% more taps, 23% "Shop All" lift. Proved with data, not opinion — the perf library measured the before/after.

## Technical details worth volunteering

- **Lazy carousels:** deferred mounting until near-viewport; first-click path renders only what's visible → the 1.7s win.
- **Analytics batching:** debounced queue flushing one payload per interval instead of 20 calls during a scroll — JS thread yielded back to rendering.
- **Flag discipline:** staged rollout with kill switch; engagement metrics gated each expansion step.

## Follow-ups

- **How measured?** First-click = navigation-intent timestamp delta; A/B cohorts via the flag; dashboards in Dynatrace.
- **What went wrong?** Early carousel version mounted everything — caught by the perf overlay's TTFD + memory numbers before rollout expanded.
