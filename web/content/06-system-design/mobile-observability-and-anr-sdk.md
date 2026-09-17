---
title: In-App Observability & ANR Monitoring SDK
category: mobile-frontend
difficulty: Senior / SDE-3
tags: [react-native, mobile, telemetry, sentry, dynatrace, cadisplaylink, choreographer, anr]
---

# Mobile System Design — In-App Observability & ANR Monitoring SDK

> **Context:** Architectural blueprint for designing a zero-overhead, production-grade mobile telemetry and performance observability SDK for React Native and native platforms (iOS & Android). Based on production engineering at Best Buy scale (~13.3k daily installs).

---

## 1. Requirements & Constraints

### Functional Requirements
1. **Real-time Native FPS & Frame Drop Tracking:** Measure 60/120 Hz display refresh rates directly from the OS compositor, differentiating between JS-thread stalls and UI-thread hitching.
2. **ANR (Application Not Responding) Watchdog:** Detect main-thread freezes (>5000ms on Android, >250ms frame drops) and capture thread stack traces.
3. **Screen Performance Lifecycle (TTID / TTFD):** Automatically or declaratively capture Time-to-Initial-Display (skeleton) and Time-to-Full-Display (interactive data).
4. **Memory & Thermal Context:** Continuously sample low-memory warnings (`onTrimMemory`, Darwin `task_info`), device thermal throttling states, and battery level.
5. **Dual Export Pipeline:** Seamless, 1-tap or batch ingestion into enterprise telemetry collectors (Sentry, Dynatrace, Datadog).

### Non-Functional Requirements & Performance Budgets
- **CPU Overhead:** < 1.5% extra CPU consumption during continuous active monitoring.
- **Memory Footprint:** < 5 MB resident memory pool in the client app.
- **Bridge Congestion:** **Zero frame drops caused by the SDK itself.** Must NEVER emit events over the React Native bridge per frame.
- **Offline / Resilience:** Ring-buffer storage in memory with disk fallback during network dropouts; drop oldest events if buffer exceeds 2MB.

---

## 2. High-Level Architecture (3-Layer Model)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LAYER 1: REACT / TS UI LAYER                    │
│  [ Reducer-Driven Draggable HUD ]   [ useScreenTTFD / useScrollPerf ]  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Hooks API
┌───────────────────────────────────▼────────────────────────────────────┐
│                    LAYER 2: TYPESCRIPT BRIDGE WRAPPER                  │
│   FrameRateNative.ts  ·  PerformanceMetricsNative.ts  ·  ANRWatchdog.ts│
│   ------------------------------------------------------------------   │
│   • Batching Window: 500ms sliding throttle buffer                     │
│   • Typed Events via NativeEventEmitter (Aggregated Payloads Only)     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Native Bridge / JSI
┌───────────────────────────────────▼────────────────────────────────────┐
│                    LAYER 3: NATIVE OS RUNTIME MODULES                  │
│   ┌───────────────────────────────┐ ┌────────────────────────────────┐ │
│   │         iOS (Swift/C)         │ │         Android (Java/C++)     │ │
│   │  • CADisplayLink Render Loop  │ │  • Choreographer Frame Callback│ │
│   │  • mach task_info (RAM/CPU)   │ │  • onTrimMemory Lifecycle      │ │
│   │  • ProcessInfo Thermal State  │ │  • Looper Main-Thread Watchdog │ │
│   └───────────────────────────────┘ └────────────────────────────────┘ │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Batched Telemetry Export
┌───────────────────────────────────▼────────────────────────────────────┐
│             LAYER 4: EXGESTION & DUAL REPORTING (Sentry + Dynatrace)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Deep Dive: Low-Level Native Modules

### A. iOS Native Frame Rate Engine (`CADisplayLink`)
```swift
import Foundation
import UIKit

@objc(FrameRateNativeModule)
public class FrameRateNativeModule: RCTEventEmitter {
  private var displayLink: CADisplayLink?
  private var lastTimestamp: CFTimeInterval = 0
  private var frameCount: Int = 0
  private var droppedFrames: Int = 0
  
  @objc public func startMonitoring() {
    DispatchQueue.main.async {
      self.displayLink = CADisplayLink(target: self, selector: #selector(self.onFrame(link:)))
      self.displayLink?.add(to: .main, forMode: .common)
    }
  }
  
  @objc private func onFrame(link: CADisplayLink) {
    if lastTimestamp == 0 {
      lastTimestamp = link.timestamp
      return
    }
    frameCount += 1
    let delta = link.timestamp - lastTimestamp
    let expectedDelta = link.targetTimestamp - link.timestamp
    if delta > (expectedDelta + 0.005) {
      droppedFrames += Int(delta / expectedDelta)
    }
    
    // Emit only when 500ms batch interval completes
    if delta >= 0.5 {
      let fps = Double(frameCount) / delta
      sendEvent(withName: "onFpsBatch", body: ["fps": fps, "dropped": droppedFrames])
      frameCount = 0
      droppedFrames = 0
      lastTimestamp = link.timestamp
    }
  }
}
```

### B. Android Choreographer & Main-Thread ANR Watchdog
```java
public class ANRWatchdogModule extends Thread {
  private static final int CHECK_INTERVAL_MS = 500;
  private static final int ANR_THRESHOLD_MS = 3000;
  private final Handler mainHandler = new Handler(Looper.getMainLooper());
  private volatile boolean isTickReceived = false;

  private final Runnable ticker = () -> isTickReceived = true;

  @Override
  public void run() {
    while (!isInterrupted()) {
      isTickReceived = false;
      mainHandler.post(ticker);
      
      try {
        Thread.sleep(CHECK_INTERVAL_MS);
      } catch (InterruptedException e) {
        break;
      }
      
      // If the main thread failed to execute our runnable within the window:
      if (!isTickReceived) {
        long blockedTime = 0;
        while (!isTickReceived && blockedTime < ANR_THRESHOLD_MS) {
          try {
            Thread.sleep(100);
            blockedTime += 100;
          } catch (InterruptedException e) { break; }
        }
        
        if (!isTickReceived) {
          // Capture Main Thread Stack Trace
          StackTraceElement[] stack = Looper.getMainLooper().getThread().getStackTrace();
          reportANRFreeze(stack, blockedTime);
        }
      }
    }
  }
}
```

---

## 4. Why Typical Approaches Fail (The Senior Interview Defense)

1. **Trap: "Why not just use `requestAnimationFrame` in JS?"**
   - *Defense:* `requestAnimationFrame` only measures the JavaScript thread event loop rate. If the JS thread is idle but the native UI thread is blocked by an image decompression lock or heavy view layout calculation, `rAF` says "60 FPS" while the user experiences frozen stuttering! Conversely, if JS is processing a 200ms Redux state transformation, the native UI thread might still be animating at 60 FPS. `CADisplayLink` + `Choreographer` give the true hardware presentation rate.
2. **Trap: "Why emit events every 500ms instead of every frame?"**
   - *Defense:* Emitting over `NativeEventEmitter` at 60Hz or 120Hz creates 120 JSON bridge crossings per second. On React Native architecture (especially pre-Fabric or on heavy screens), the bridge becomes the bottleneck, meaning the performance monitoring tool itself introduces 10–15% frame drops! Batching into 500ms intervals gives 2 emissions per second—a 98.3% reduction in bridge congestion.
3. **Trap: "What about memory leak profiling?"**
   - *Defense:* In Hermes, call `global.HermesInternal?.getInstrumentedStats()` to track `js_allocated_bytes` and `js_heap_size`. On Android, listen to `ComponentCallbacks2.onTrimMemory(TRIM_MEMORY_RUNNING_CRITICAL)` to dump live component counts.

---

## 5. 60-Second Interview Elevator Pitch
> *"At Best Buy, performance debates between engineering, QA, and product were subjective because measurement previously required tethered dev tools like Flipper. I architected a 3-layer in-app observability SDK: Swift (`CADisplayLink`) and Java (`Choreographer`, `Looper` ANR watchdog) modules capture native hardware frame timing and freezes, emit batched telemetry every 500ms to eliminate bridge congestion, and provide 1-line hooks like `useScreenTTFD` for feature teams. It was adopted across the Consumer App, enabled 1-tap export to Dynatrace and Sentry, and won Director-Level Recognition in Q4."*
