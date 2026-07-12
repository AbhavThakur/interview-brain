# Native FPS Measurement & ANR Detection

## Why JS-based FPS counters lie

A JS `requestAnimationFrame` counter measures **JS thread liveness**, not painted frames.
When the JS thread blocks, the counter freezes too — it can't report the jank it's causing.
Native-driven animations keep running, so the screen may even look "fine" while JS is dead.

## Native FPS (the trustworthy way)

- **Android — `Choreographer`**: vsync frame callbacks; timestamp every frame.
- **iOS — `CADisplayLink`**: display-refresh callback; same idea.
- Frame time > 2× the expected interval (16.67ms @60Hz) ⇒ counted as dropped.
- Overhead ≈ a couple of timestamp comparisons per frame; only active when tracking started.
- **Batch results to JS** (~500ms payloads) instead of per-frame events — never spam the bridge.
- Validation: numbers match Xcode Instruments / Android GPU profiler.

```
[ RN overlay UI ] <- NativeEventEmitter (batched ~500ms)
        ^
[ FrameRateNativeModule (Swift/Java) ]
        ^
[ CADisplayLink / Choreographer ]  <- actual vsync
```

## ANR / frozen-main-thread detection (watchdog pattern)

Background thread posts a heartbeat task to the main `Looper` (Android) / main queue (iOS) and
times execution. Exceeds threshold ⇒ main thread is blocked ⇒ record freeze duration + timestamp.
Same principle as Android system ANR detection (5s input-dispatch rule) and Sentry AppHang.

## Other native metrics + platform APIs (name-drop list)

| Metric              | iOS                                                                              | Android                                                                     |
| ------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Memory              | `mach task_info`, `didReceiveMemoryWarningNotification`                          | `Debug.MemoryInfo`, `ActivityManager`, `ComponentCallbacks2.onTrimMemory()` |
| Battery / low power | `UIDevice`, `ProcessInfo.isLowPowerModeEnabled`                                  | `BatteryManager`, `PowerManager.isPowerSaveMode`                            |
| Thermal             | `ProcessInfo.thermalState`                                                       | PowerManager thermal APIs                                                   |
| Cold start          | native process-start timestamp → JS calls `markReactReady()`; delta = cold start | same                                                                        |

## "Doesn't the observer change what it observes?" (trap question)

Yes — so: FPS on native vsync callbacks (near-zero cost), heavy overlay UI renders only when expanded,
batched event emission, debug/AdHoc builds only behind a feature flag, and the overlay component
opts out of React Compiler (`'use no memo'`) due to Animated/PanResponder ref patterns.

Links: Choreographer https://developer.android.com/reference/android/view/Choreographer ·
CADisplayLink https://developer.apple.com/documentation/quartzcore/cadisplaylink ·
ANRs https://developer.android.com/topic/performance/vitals/anr
