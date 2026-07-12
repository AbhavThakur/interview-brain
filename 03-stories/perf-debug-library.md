# Story: Performance Debug Library (signature project)

> Built from scratch at Best Buy · zero-config observability for the Consumer App
> Numbers: 0/1-line/full adoption levels · 3 device tiers · Dynatrace+Sentry · Director recognition Q4 FY26

## STAR (60-second spoken version)

- **S** — Performance discussions were opinion-based; regressions reached release because measurement required a tethered dev machine (Flipper/DevTools) and JS FPS counters lied under load.
- **T** — Give every engineer/QA trustworthy, in-app, real-device performance measurement with zero setup.
- **A** — Designed a 3-layer system: hooks API → typed TS bridge wrappers → native modules (Swift + Java). Native FPS via CADisplayLink/Choreographer, ANR watchdog via main-thread heartbeat, memory/battery/thermal context, TTID/TTFD/TTI instrumentation, device-tier thresholds, benchmark mode with pass/fail history, one-tap upload to Dynatrace + Sentry.
- **R** — Adopted across the Consumer App; perf conversations moved from assumption to evidence; fed the AMQ work that landed 1.7s faster first-click. Director-level recognition.

## Architecture (whiteboard-ready)

```
[ React overlay UI (reducer-driven, draggable HUD) ]
        ↑ hooks: useScreenTTFD (1 line) · useScreenPerformance · useScrollPerformance
[ TS wrappers: FrameRateNative.ts · PerformanceMetricsNative.ts · ANRWatchdogNative.ts ]
        ↑ NativeEventEmitter — BATCHED payloads (~500ms), never per-frame
[ Native: FrameRateNativeModule.swift/.java · PerformanceMetricsModule · ANRWatchdogModule ]
        ↑ CADisplayLink / Choreographer · task_info / onTrimMemory · Looper heartbeat
```

## Design decisions I can defend

1. **Native FPS, not JS** — JS counters freeze with the thread that's causing jank. Vsync timestamps measure painted frames; matches Instruments.
2. **Device-tier thresholds** — TTFD 3.5/4.5/6s; one global budget = alert fatigue on the ~20% low-end fleet.
3. **Adoption levels (0 / 1 line / ~30 lines)** — adoption is a UX problem; most screens stop at Level 1 by design.
4. **Observer effect handled** — batching, expanded-only UI, debug/AdHoc gating, `'use no memo'` compiler opt-out for the ref-heavy overlay component.
5. **Close the loop** — Dynatrace user-action queries + Sentry tags/transactions so perf correlates with crashes; benchmark history answers "is this PR slower?"

## Rapid follow-ups (15–25s each)

- **Why not an existing SDK?** Telemetry ≠ in-context debug UX. We needed screen-specific diagnostics, custom tiers, on-device QA workflow. Off-the-shelf gave dashboards, not decisions.
- **Overhead?** Tracking only when started; timestamp math per frame; batched emission; heavy UI gated to expanded mode.
- **Hardest part?** Trustworthy FPS. Everything looked 60fps from JS while the UI janked. Native vsync fixed it.
- **Validation?** Instruments/GPU profiler cross-checks, scripted-interaction timestamp comparisons, repeatability runs, device-context tagging (battery/thermal).
- **What next?** CI regression gates on benchmark deltas, per-component render attribution, alert tuning by flow criticality.

Deep-dive topic notes: [../01-topics/performance/native-fps-anr.md](../01-topics/performance/native-fps-anr.md) · [../01-topics/performance/metrics-vocabulary.md](../01-topics/performance/metrics-vocabulary.md)
