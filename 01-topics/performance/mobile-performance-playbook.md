# Senior Mobile Performance Engineering Playbook (2025–2026)

> **The Market Reality:** Anyone can stitch npm packages together and build a CRUD screen. Senior and Staff engineers are paid top tier because they know how to measure, isolate, and eliminate performance bottlenecks under real production constraints.

---

## 1. The Core Performance Metrics Matrix

| Metric | Target (P95) | Platform APIs / Tools | Root Causes of Failure |
| :--- | :--- | :--- | :--- |
| **TTID (Time to Initial Display)** | `< 1.2s` (Cold) | Android `reportFullyDrawn()`, iOS `dyld` timestamp | Bloated initial JS bundle, synchronous TurboModule init, deep component trees |
| **TTFD (Time to Full Display)** | `< 2.5s` (Cold) | Custom Telemetry, Sentry Performance, Dynatrace | Waterfall network requests, blocking main-thread JSON parsing |
| **Frame Budget (60Hz vs 120Hz)**| `16.6ms` (60Hz)<br>`8.3ms` (120Hz ProMotion) | Android `Choreographer`, iOS `CADisplayLink`, Perfetto | Inline function allocations during scroll, bridge queue traffic, unmemoized styles |
| **ANR / Main Thread Hitch** | `0.0%` (>5s freeze)<br>`< 0.1%` (>200ms hitch) | Android `Looper` Watchdog, iOS AppHang, Sentry | Heavy regex on main thread, synchronous disk I/O (AsyncStorage vs MMKV), complex layout passes |
| **Native Memory RSS** | `< 250MB` (Low tier)<br>`< 600MB` (Flagship) | Android `Debug.MemoryInfo`, Linux RSS, Apple `task_info` | Bitmap leaks, uncompressed cache images, retain cycles in native event listeners |

---

## 2. Startup Optimization: The Cold Launch Pipeline

```
App Icon Click
      │
      ▼
1. Native OS Init (OS Process Fork, Dynamic Linker `dyld` / Linux `zygote`)
      │ ⚡ Optimization: Pre-warming, minimal AppDelegate/Application subclass logic
      ▼
2. JavaScript Engine Init (Hermes bytecode memory map)
      │ ⚡ Optimization: Hermes pre-compiled bytecode (`.hbc`), avoid parsing plain JS strings
      ▼
3. TurboModules Lazy Loading
      │ ⚡ Optimization: Never initialize native modules eagerly; load on first JSI invocation
      ▼
4. Initial UI Mount (TTID)
      │ ⚡ Optimization: Render skeletal structure without waiting for remote network payloads
      ▼
5. Data Fetch & State Hydration (TTFD)
      │ ⚡ Optimization: Local cache hydration (MMKV) before network query response
```

### Android Baseline Profiles (AOT Compilation)
* **What it is:** A file of hot-path classes and methods embedded directly in the APK/AAB release.
* **Why it matters:** Eliminates Android Runtime (ART) Just-In-Time (JIT) compilation pauses during cold start. Pre-compiles critical launch journeys into machine code ahead-of-time (AOT), reducing cold startup time by **20% to 35%**.

---

## 3. The 120Hz Display Reality: The 8.3ms Frame Budget

Modern flagships (iPhone ProMotion, Samsung Galaxy 120Hz AMOLED) run at **120 frames per second**. 

$$ \text{Frame Budget} = \frac{1000\text{ ms}}{120\text{ frames}} \approx 8.33\text{ ms} $$

If any JavaScript or layout computation blocks the thread for more than **8.3ms**, the display drops a frame, resulting in a visible "hitch".

### How to Stay Under 8.3ms:
1. **FlashList Virtualization:** Reuses views across scroll boundaries instead of constantly allocating new native views (FlatList).
2. **Reanimated & UI Thread Animations:** Run animations directly on the UI thread or render thread via worklets, completely immune to JavaScript thread saturation.
3. **Selective Memoization (`React.memo` & `useMemo`):** Only memoize components where props equality checks (`prevProps === nextProps`) are cheaper than re-rendering children. Avoid over-memoizing trivial text nodes.

---

## 4. Diagnostics & Tooling Cheat Sheet

### A. Android Perfetto (`ui.perfetto.dev`)
* **When to use:** When you suspect native scheduler delays, Choreographer frame drops, or high kernel CPU utilization.
* **What to inspect:**
  * Find the `mqt_js` (React Native JavaScript thread) track: Is it constantly pegged at 100%?
  * Look at the `RenderThread` and `Choreographer#doFrame` slices: Are they exceeding 8.3ms / 16.6ms?
  * Inspect `ion_total` and graphics buffers for bitmap memory spikes.

### B. Android Studio Profiler
* **Heap Dumps:** Filter by "Retained Size". Check if unmounted activities or large `byte[]` arrays (decoded bitmaps) are still referenced.
* **Native Allocations:** Track C++ memory allocations in Hermes and TurboModules that do not show up in the Dalvik heap.

### C. Apple Instruments (Xcode)
* **Time Profiler:** Invert call tree and hide system libraries to identify JavaScript and native C++ bottlenecks.
* **Allocations & Leaks:** Look for `ARC` retain cycles where closures hold strong references to `self`.

---

## 5. Senior Interview Rapid-Fire Answers

#### Q: "How do you distinguish between a JS thread bottleneck and a Native UI thread bottleneck?"
> *"I inspect the frame metrics: if the native FPS (via Choreographer or CADisplayLink) remains locked at 60/120 FPS during a gesture or scroll, but touch responses or state updates feel sluggish, the bottleneck is on the JavaScript thread. Conversely, if the JS thread is idle but animations stutter during view transitions, the UI thread or RenderThread is blocked by complex layout recalculations, unoptimized shadow passes, or heavy image decoding."*

#### Q: "How does the New Architecture (Fabric + JSI) fundamentally improve list scrolling performance?"
> *"In the legacy architecture, layout calculation and view mounting happened asynchronously across the bridge queue. During high-speed flings, the bridge saturated, and users saw blank white tiles while waiting for native views to mount. Fabric runs layout calculation and view mutation synchronously on the C++ layer via JSI, allowing concurrent priority rendering and instantaneous view recycling without message queue serialization latency."*
