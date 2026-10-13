# Metrics Inventory — Every Defensible Number I Can Cite

> Single source of truth for all verified engineering metrics and impact. Update when milestones ship. Use 2–3 targeted metrics per interview round.

---

## Best Buy (Oct 2025 – Oct 2026, SDE-2, Search / PLP & Consumer App)
**Repositories:** `bby-corp/consumerAppNext` (React Native mobile app) and `bby-corp/plp` (Web & Mobile PLP UI)  
**GitHub Identity:** `Abhav-Thakur-A3100515_bestbuy`

| Metric / Artifact | Context & Technical Detail | Best Used For |
| :--- | :--- | :--- |
| **84 Authored PRs Merged** | Target-repository authored merged PRs across `consumerAppNext` & `plp` (103 substantive commits across period) | Delivery consistency, velocity |
| **6 Feature Clusters Led** | Perf Debug / Perf Sentinel, Native Profiling, UPC product card, Search/Filters/Lists, Commerce/Fulfillment, Analytics/Observability | Senior ownership, broad domain reach |
| **88–96% First-Load Delay Before Mount** | Pass A profiling on Galaxy S25+ proved delay was navigation-to-mount bottleneck, not render time | Evidence-based performance investigation |
| **94–96% Late Frames JS-Bound** | Pass B Perfetto trace on Pixel 7a proved ~95% JS thread saturation during active scrolling, ruling out native GPU limits | Native vs JS thread root-cause analysis |
| **1.4GB → 1.7GB Process RSS with 48–115MB Java Heap** | Proved memory growth (+25%) was native/graphics allocations (image buffers, textures), not Java heap leaks | Memory architecture, deep debugging |
| **1.7s Faster First-Click** | AMQ — lazy-loaded carousels + debounced analytics batching | Core user experience, performance lift |
| **12% Tap Lift & 23% "Shop All" Lift** | AMQ engagement gains proved via A/B cohorts and feature-flagged rollout | Direct customer & business impact |
| **10% → 100% Phased Rollout** | Safe production deployment with staged kill switches and automated telemetry alerts | Risk mitigation & release discipline |
| **3 Device-Tier Thresholds** | High/Mid/Low budgets (TTFD 3.5s/4.5s/6s, FPS ≥58/50/45, Memory 350MB/300MB/250MB) | Eliminating alert fatigue on low-end fleet |
| **Zero Per-Frame Bridge Traffic** | 500ms sliding throttle buffer for native FPS & memory telemetry; zero frame drops caused by the monitoring SDK itself | React Native bridge optimization |
| **200 Requests / 30KB Truncation** | In-app network panel buffer cap with dev-request filtering and payload size limits to protect device memory | Tooling UX & observer effect mitigation |
| **Typed Membership SKU Guard** | `PMEM2`/`PMEM3` cart validation updating customer reactive state to trigger keyed `PriceExperienceLoader` remount on PLP | Commerce state integrity, race condition safety |
| **Desktop 3 / Mobile 2 Pill Cap** | Quick-filter transformation rules: caps groups at 3 (desktop) or 2 (mobile), max 10 total; normalizes mismatched facet fields | Responsive UX & query correctness |
| **6 Verified Architectural PR Reviews** | Peer code reviews across Add-to-cart telemetry, Show More progressive loading, UPC pricing wrappers, and attributes | Technical leadership & code bar |
| **Director Recognition Q4 FY26** | Cross-team adoption of in-app Performance Debug Library and Perf Sentinel companion | Engineering excellence, cross-functional impact |
| **Hackathon Winner FY26** | Best Buy Innovation Week | Innovation & initiative |

---

## Technical Problem-Solving Matrix (Mapping Numbers to Leadership Principles)

| Interview Theme / LP | Best Story to Anchor | Key Metric / Technical Proof |
| :--- | :--- | :--- |
| **Dive Deep / Problem Solving** | Android Native Profiling & Perfetto Runbook | Disproved Java heap leak hypothesis; showed 1.7GB RSS was native graphics memory; measured 95% JS thread saturation in Perfetto. |
| **Deliver Results / Ownership** | Performance Debug Overlay & Perf Sentinel | Shipped standalone monitoring package with native Swift/Java bridges, in-app HUD, Sentry reporting, and automated comparison scripts. |
| **Customer Obsession** | Ambiguous Query (AMQ) Search & Lazy Carousels | 1.7s faster first click, 12% tap lift, 23% "Shop All" lift on highest-volume mobile query surfaces. |
| **Bias for Action / Quality** | Universal Product Card (UPC) Migration | Unified fragmented web/app card components; instrumented first-image vs lazy-image LCP signals; guarded with feature flags. |
| **Earn Trust / Collaboration** | Total Member Pricing on PLP & Show More Reviews | Bridged cart team with search team; built typed SKU mapper; approved 6+ high-impact peer architecture PRs. |

---

## Earlier Career Summary

| Metric / Achievement | Context |
| :--- | :--- |
| **RN Version Upgrade & Native Modules** | Impelsys — Modernized core mobile libraries, bridged TurboModules |
| **FCM Push Notification Infrastructure** | Impelsys — Architected background push token refresh and re-engagement messaging |
| **3 Production Apps Shipped Solo** | ClinicSpots, StockPe, SkyGoal (Play Store & App Store, 2021–2022) |
| **5+ Years Mobile / Fullstack Experience** | Enterprise e-commerce, banking/fintech, and healthcare architectures |
