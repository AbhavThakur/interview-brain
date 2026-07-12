# Q&A Bank — Performance

## Q: How did you calculate real-time FPS without causing performance degradation yourself?

**Tags:** perf-library, fps, native · **Asked at:** expected (Zerodha prep)

JS-based FPS counters lie — they measure JS-thread liveness, not painted frames. So I wrote native modules: `Choreographer` frame callbacks on Android, `CADisplayLink` on iOS. Each vsync I compare timestamps against the expected frame interval; anything over ~2× counts as dropped. Overhead is a couple of timestamp comparisons per frame, tracking only runs when explicitly started, and results are BATCHED to JS every ~500ms instead of per-frame bridge events. Validated against Xcode Instruments and the GPU profiler — the numbers match. [../01-topics/performance/native-fps-anr.md](../01-topics/performance/native-fps-anr.md)

## Q: How do you detect an ANR / frozen UI thread from inside the app?

**Tags:** anr, native · **Asked at:** expected

Watchdog pattern: a background thread posts a heartbeat to the main Looper (Android) / main queue (iOS) and times how long it takes to execute. Over threshold ⇒ the main thread is blocked ⇒ record freeze duration and timestamp. Same principle as Android's system ANR detection (5s input-dispatch rule) and Sentry's AppHang.

## Q: Why device-tiered thresholds instead of one global performance budget?

**Tags:** thresholds, perf-library · **Asked at:** expected

~20% of our users are on low-end devices. Judge a Galaxy A-series by iPhone-Pro budgets and you get constant false alarms → alert fatigue → the tool gets ignored. We auto-detect tier and set budgets per tier — TTFD 3.5s/4.5s/6s, FPS ≥58/50/45, memory 350/300/250MB. Alerts stay meaningful on flagships AND low-end regressions still get caught.

## Q: Doesn't the measurement tool itself change what it measures?

**Tags:** perf-library, trap-question · **Asked at:** expected

Yes — that shaped the design. FPS runs on native vsync callbacks (near-zero cost), heavy overlay UI renders only when expanded, events are batched not streamed, everything is debug/AdHoc-gated behind a feature flag, and the overlay opts out of the React Compiler (`'use no memo'`) because of its Animated/PanResponder ref patterns. We also cross-checked overlay-on vs overlay-off runs in Instruments to confirm negligible impact.

## Q: How do you validate that your metrics are actually correct?

**Tags:** perf-library, validation · **Asked at:** expected

Three ways: cross-validate against platform tools (Instruments, Android GPU profiling), compare native timestamps against known scripted interactions, and check repeatability across runs on the same device state. We also record battery/thermal/low-power context with every session — a 5%-battery thermally-throttled run isn't comparable to a plugged-in one, and marking that context is what makes benchmark history trustworthy.

## Q: Your AMQ analytics increased events — how did you avoid throttling the network / JS thread?

**Tags:** amq, batching · **Asked at:** expected

Batching queue with a debounce pattern: instead of firing an event per product impression while scrolling, we queued IDs and flushed one batched payload every ~2 seconds (and on backgrounding), yielding the JS thread back to rendering. That was part of how AMQ hit 1.7s faster first-click while ADDING analytics coverage.

## Q: Walk me through TTID vs TTFD vs TTI — and where you optimize.

**Tags:** metrics · **Asked at:** expected

TTID = skeleton visible ("app responds"), TTFD = real content rendered ("I can use this"), TTI = interaction actually works. The TTFD−TTID gap is API + processing + render — that's the optimization zone: API latency, payload size, progressive loading, render cost. On PLP we instrumented all three with a one-line hook and phase-level breakdown (nav→mount→data→visible→interactive). [../01-topics/performance/metrics-vocabulary.md](../01-topics/performance/metrics-vocabulary.md)

## Q: How did you get engineers to actually adopt the perf tool?

**Tags:** perf-library, adoption · **Asked at:** expected

Adoption is a UX problem — a tool nobody integrates measures nothing. Three levels: Level 0 = zero lines (global tracking: network, memory, duration on every screen automatically), Level 1 = one line (`useScreenTTFD`) adds TTID/TTFD/TTI, Level 2 = full integration (scroll FPS + benchmarks) for critical screens only. Most screens stop at Level 1, and that was the point.
