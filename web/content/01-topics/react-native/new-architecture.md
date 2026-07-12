# RN New Architecture — JSI, Fabric, TurboModules

## Old vs new

```
OLD (The Bridge):
[ JS Thread ] -> JSON.stringify -> [ async message queue ] -> JSON.parse -> [ Native ]
  * async only, serialization overhead, batched — jank under load

NEW (JSI):
[ JS Thread ] <====== direct C++ host object references ======> [ Native ]
  * synchronous access possible, no JSON serialization, shared memory
```

- **JSI** — C++ layer letting JS hold references to native "host objects" and call them directly. Engine-agnostic (Hermes/JSC).
- **TurboModules** — native modules on JSI: lazy-loaded (faster startup), sync calls when needed, typed via Codegen.
- **Fabric** — new renderer: C++ shadow tree, concurrent React support, layout can be computed synchronously → fewer "flash of empty" frames.
- **Codegen** — generates typed C++ bindings from typed JS specs at build time.

## Talking points

- The old bridge's cost wasn't just latency — it was **serialization CPU + batching delays** during scroll (many onScroll events → queue pressure → dropped frames).
- Hermes: bytecode precompilation → faster TTI, lower memory. Pairs with lazy TurboModule init.
- **My angle:** perf overlay's native modules used the classic `NativeModules`/`NativeEventEmitter` pattern with batching (FPS payload every ~500ms instead of per-frame) precisely to avoid bridge spam. On new arch, that becomes a JSI/TurboModule with near-zero call cost — the batching design still applies for event volume.

## Native layer basics I can discuss

- iOS: Swift module + `RCT_EXTERN_MODULE` ObjC bridge file, CocoaPods for deps.
- Android: Java/Kotlin `ReactContextBaseJavaModule`, registered via a Package, Gradle for deps.
- When to go native: hardware/OS APIs (Choreographer, CADisplayLink, BatteryManager), perf-critical loops, existing native SDKs.

Docs: https://reactnative.dev/architecture/overview
