# Targeted Native Fluency for React Native Engineers (Swift & Kotlin)

> **Rule of Thumb:** You do not need to study SwiftUI or Jetpack Compose from scratch to build full native apps. You need **Targeted Native Systems Fluency** — bridging, thread management, memory profiling, and build toolchains.

---

## 1. The 4 Native Pillars Every Senior RN Engineer Must Own

```
┌─────────────────────────────────────────────────────────────────┐
│                       JavaScript / TypeScript                   │
└────────────────────────────────┬────────────────────────────────┘
                                 │ JSI (Direct C++ Memory Pointers)
┌────────────────────────────────┴────────────────────────────────┐
│               TurboModules (C++ / Obj-C / Swift / Kotlin)       │
├────────────────────────────────┬────────────────────────────────┤
│       iOS Runtime              │       Android Runtime          │
│ • CADisplayLink (vsync)        │ • Choreographer (vsync)        │
│ • MainActor / GCD queues       │ • Looper / Handler / MsgQueue  │
│ • task_info (mach memory)      │ • Debug.MemoryInfo / LMK       │
│ • CocoaPods & SPM Linking      │ • Gradle & R8/ProGuard Rules   │
└────────────────────────────────┴────────────────────────────────┘
```

---

## 2. iOS (Swift / Objective-C) Internals for RN

### A. Threading & UI Synchronization
* **The Problem:** Heavy background computations in a native module running on the main queue will stutter animations and block `CADisplayLink`.
* **The Pattern:** Always offload intensive native tasks to a background `DispatchQueue` and only switch to `DispatchQueue.main` (or `@MainActor`) when updating UIKit views or scheduling display link listeners.
```swift
// Swift Native Module example
@objc(BatteryMonitorModule)
class BatteryMonitorModule: NSObject {
  @objc func getThermalState(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .utility).async {
      let state = ProcessInfo.processInfo.thermalState
      let stateString: String
      switch state {
      case .nominal: stateString = "nominal"
      case .fair: stateString = "fair"
      case .serious: stateString = "serious"
      case .critical: stateString = "critical"
      @unknown default: stateString = "unknown"
      }
      resolve(["thermalState": stateString])
    }
  }
}
```

### B. Memory & Leaks (Xcode Instruments)
* **Retain Cycles:** Strong reference cycles inside closures (`self` capture). Always use `[weak self]` in completion handlers and delegate callbacks.
* **Mach Task Memory:** `task_info(mach_task_self(), TASK_BASIC_INFO, ...)` reveals resident memory (RSS). This includes unmanaged native graphics buffers (Metal/OpenGL) that JavaScript cannot see.

### C. Build & Linker Traps
* **Header Search Paths & Bridging Headers:** When Swift code is exposed to Objective-C, you need `<ProjectName>-Swift.h`.
* **Framework Embedding:** "Symbol not found" errors usually mean a dynamic framework was linked but not embedded in the target's build phases.

---

## 3. Android (Kotlin / Java) Internals for RN

### A. The Android Event Loop: Looper & MessageQueue
* **UI Thread:** Android's main thread runs `Looper.loop()`, continuously pulling `Message` objects from a single `MessageQueue`.
* **ANR Rule:** If any task takes **> 5 seconds** (or 200ms during an input event) before yielding the Looper, Android flags an Application Not Responding (ANR).
* **The Watchdog Pattern:** A background handler posts a token to the main `Looper`. If the token isn't processed within 2–5 seconds, the watchdog records a main-thread freeze.

```kotlin
// Android Native Module Watchdog Concept
class AnrWatchdog(private val timeoutMs: Long = 2000L) {
    private val mainHandler = Handler(Looper.getMainLooper())
    @Volatile private var tick = 0
    private var lastTick = 0

    private val ticker = Runnable { tick = (tick + 1) % 10 }

    fun monitor() {
        Thread {
            while (true) {
                lastTick = tick
                mainHandler.post(ticker)
                Thread.sleep(timeoutMs)
                if (tick == lastTick) {
                    // Main thread is blocked!
                    val stackTrace = Looper.getMainLooper().thread.stackTrace
                    logMainThreadFreeze(stackTrace)
                }
            }
        }.start()
    }
}
```

### B. Vsync & Choreographer Frame Timing
* To measure actual native FPS, hook into `Choreographer.getInstance().postFrameCallback(FrameCallback)`.
* Calculate frame delta: `delta = frameTimeNanos - lastFrameTimeNanos`.
* If `delta > 2 * 16.6ms`, mark a dropped frame.

### C. Android Memory: Dalvik Heap vs. Process RSS
* `Runtime.getRuntime().totalMemory()` only measures the JVM/ART heap.
* Bitmaps, native C++ libraries (Hermes, TurboModules), and WebViews live in **Native Allocations & Graphics RSS**.
* **Android LMK (Low Memory Killer):** Uses the Linux kernel `oom_adj_score` to kill apps exceeding system thresholds. Hook into `ComponentCallbacks2.onTrimMemory(level)` to evict in-memory image caches before the OS terminates the process.

### D. Gradle & ProGuard/R8 Code Shrinking
* When migrating to production or enabling R8 shrinking, reflection-based JSI/TurboModule bindings can be stripped.
* **Fix:** Add `-keep` rules in `proguard-rules.pro` for custom native modules and bridge descriptors:
```proguard
-keep class com.myapp.nativemodules.** { *; }
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod *;
}
```

---

## 4. The Modern C++ / JSI Layer

* **JSI (JavaScript Interface):** A unified C++ API that allows JavaScript code to hold a reference to a C++ HostObject and invoke its methods synchronously without JSON serialization over a message queue.
* **Nitro Modules & Margelo:** The newest wave of high-performance libraries (like VisionCamera, Nitro) bypass Java/Obj-C wrappers completely and bind C++ directly to JSI, achieving near-zero invocation overhead.

---

## 5. Curated High-Yield References

1. **Perfetto System Profiler:** https://perfetto.dev/docs/ — Kernel, scheduler, and frame-rendering trace visualizer.
2. **Android Studio Profiler Guide:** https://developer.android.com/studio/profile/memory-profiler — Native memory allocations and heap dumps.
3. **Apple Instruments User Guide:** https://developer.apple.com/documentation/instruments — Time Profiler and Allocations.
4. **React Native C++ TurboModules:** https://reactnative.dev/docs/the-new-architecture/cxx-turbomodules — Official documentation on cross-platform native modules.
5. **Nitro Modules by Marc Rousavy:** https://nitro.margelo.com/ — Modern JSI C++ bridge architecture.
