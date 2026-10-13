# Story: Performance Debug Library & Perf Sentinel (Signature Tooling)

> **Context:** Built from scratch at Best Buy · In-app, zero-config performance observability suite for React Native & Native platforms  
> **Key Numbers:** 84 merged PRs context · 3 device tiers · 200-request / 30KB network cap · 500ms batched bridge emission · Director recognition Q4 FY26

---

## STAR (60-second spoken version)

- **S (Situation):** Performance debates on the enterprise mobile team were subjective and unscientific. Regressions slipped into production because profiling required tethered desktop machines (Android Studio, Xcode Instruments, Flipper), and JS-based FPS meters gave false 60-FPS readings when the UI thread was janking.
- **T (Task):** Architect an in-app, zero-setup performance monitoring package and native bridge that developers and QA could run on physical devices anywhere to capture live frame rate, memory, TTID/TTFD, and network calls without adding observer overhead.
- **A (Action):** Designed a 4-tier modular system:
  1. **Native OS Bridges:** `FrameRateNativeModule.java` (Android Choreographer vsync hooks calculating drops when frame duration exceeds 1.5× budget) and `FrameRateNativeModule.swift` (`CADisplayLink`).
  2. **TypeScript Bridge Wrapper:** `FrameRateNative.ts` batched emission into a 500ms sliding window over `NativeEventEmitter`—preventing bridge spam.
  3. **In-App Overlay & Network Panel:** `PerformanceDebugOverlay.tsx` and `useNetworkMonitor.ts` instrumenting JS `fetch`/XHR with development filters, a 200-call buffer ceiling, and 30KB payload truncation.
  4. **Telemetry & Benchmark Mode:** `SentryPerformanceReporter.ts` reporting session threshold violations, and a companion **Perf Sentinel** dashboard comparing run captures across builds.
- **R (Result):** Standardized across the Consumer App fleet. Converted performance conversations from speculation to hard data, enabled the AMQ work that delivered 1.7s faster first clicks, and earned Director-level recognition in Q4 FY26.

---

## Whiteboard Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│               LAYER 1: REACT NATIVE OVERLAY (PerformanceDebugOverlay)  │
│  • Collapsible HUD (Minimized on app open)                            │
│  • Live FPS / Dropped Frames  • Memory Budget (RSS/Heap)              │
│  • TTID / TTFD Load Timers    • useNetworkMonitor (200 req / 30KB cap)│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Declarative Hooks API
┌───────────────────────────────────▼────────────────────────────────────┐
│               LAYER 2: TYPESCRIPT BRIDGE WRAPPER                       │
│  • FrameRateNative.ts · PerformanceMetricsNative.ts                    │
│  • 500ms sliding throttle buffer (Zero per-frame bridge traffic)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Native EventEmitter / JSI
┌───────────────────────────────────▼────────────────────────────────────┐
│               LAYER 3: NATIVE OS PLATFORM MODULES                      │
│   ┌────────────────────────────────┐ ┌───────────────────────────────┐ │
│   │ Android (FrameRateNativeModule)│ │ iOS (FrameRateNativeModule)   │ │
│   │ • Choreographer frame callback │ │ • CADisplayLink vsync loop    │ │
│   │ • Dropped = duration > 1.5x    │ │ • mach task_info (RAM/CPU)    │ │
│   │ • onTrimMemory monitoring      │ │ • Thermal state sampling      │ │
│   └────────────────────────────────┘ └───────────────────────────────┘ │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Session Reporting & Exports
┌───────────────────────────────────▼────────────────────────────────────┐
│               LAYER 4: EXPORT PIPELINE & PERF SENTINEL                 │
│  • SentryPerformanceReporter (Session violation tags & breadcrumbs)    │
│  • Pass A JSON exports → Perf Sentinel companion dashboard comparison │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions I Defend in Interviews

1. **Native Vsync vs. JS-Thread FPS:**
   - *Why:* If the JavaScript thread is blocked running heavy calculations or un-memoized renders, a JavaScript `requestAnimationFrame` counter freezes and stops ticking, failing to record whether the native compositor was actually dropping frames. Native Choreographer and CADisplayLink hook directly into the hardware vsync signal.
2. **Eliminating the Observer Effect:**
   - Telemetry must not slow down the app it monitors. We enforced a strict **500ms sliding-window throttle** for bridge emissions, truncated network bodies over 30KB, and kept the HUD minimized on app startup.
3. **Hardware-Tiered Thresholds (High / Mid / Low):**
   - Flagging memory at 350MB on a low-end Android phone causes alert fatigue; expecting 60 FPS on thermal-throttled budget devices is unrealistic. We partitioned budgets: High (350MB / 60 FPS), Mid (300MB / 55 FPS), Low (250MB / 45 FPS).
4. **JS Fetch/XHR Interception Limits:**
   - Instrumented JavaScript networking directly via `useNetworkMonitor.ts`, deliberately scoping out native image binary streams and WebSockets to protect memory footprint while giving 95% of API debugging visibility.

---

## Rapid-Fire Interview Follow-ups

- **Why build custom instead of using Datadog or Dynatrace SDKs directly?**
  - Enterprise APM SDKs provide aggregated back-end dashboards for DevOps, but they don't provide an in-app interactive HUD for developers and QA testing a build on their phone in the hallway. Our library provided real-time on-device feedback with deep links to Sentry sessions.
- **How was bridge overhead validated?**
  - Validated by comparing CPU traces with the overlay active vs disabled in Android Studio Profiler; verified that batching telemetry to 500ms kept bridge CPU load under 0.8%.
- **Key files in the codebase:**
  - `components/performance-debug/src/components/PerformanceDebugOverlay.tsx`
  - `components/performance-debug/src/hooks/useNetworkMonitor.ts`
  - `android/app/src/main/java/com/bestbuy/android/application/reactnative/FrameRateNativeModule.java`
  - `ios/Bestbuy/React Native/FrameRateNativeModule.swift`
  - `components/performance-debug/src/utils/SentryPerformanceReporter.ts`
