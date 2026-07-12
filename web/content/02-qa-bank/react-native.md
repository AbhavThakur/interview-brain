# Q&A Bank — React Native

## Q: Walk me through architecting a complex, data-heavy screen from scratch — loading states, error boundaries, data fetching.

**Tags:** architecture, plp · **Asked at:** expected (Zerodha prep)

I'd describe it as layers. Data: a query layer (React Query/Apollo-style) owning fetch, cache, retry, and pagination — the screen consumes states, it doesn't manage them. UI states as an explicit union: skeleton on first load, content, inline error with retry, empty state — no boolean soup. Rendering: virtualized list with tuned window/batch props, memoized rows, image sizing discipline. Errors: an error boundary around the screen for render crashes, plus per-section fallbacks so one failed module doesn't kill the page. Instrumentation from day one: TTID/TTFD marks and scroll FPS — on my team the perf overlay made that a one-line hook. That's how PLP at Best Buy is structured — skeleton → first data → content visible → interactive, each phase measured.

## Q: Why not just use Flipper or React DevTools instead of building your own perf tool?

**Tags:** perf-library, build-vs-buy · **Asked at:** expected

Those require a tethered dev machine and a debug build. We needed QA, PMs, and engineers to trigger measurement **in-app on real field devices** — AdHoc builds in real network conditions — and catch regressions before release sign-off. Plus screen-specific thresholds by device tier and dashboards (Dynatrace/Sentry) instead of one-off local sessions. DevTools shows re-renders; it can't tell you TTFD regressed 400ms on low-end Androids since last release.

## Q: Tune a FlatList for a 10,000-item list — what exactly do you set and why?

**Tags:** flatlist, virtualization · **Asked at:** expected

`getItemLayout` for O(1) layout (no dynamic measurement, instant scrollToIndex), `windowSize` down from default 21 to ~5 (memory vs blank-fling trade-off), `maxToRenderPerBatch` ~8 (less JS-thread blocking), `removeClippedSubviews` on Android, `initialNumToRender` just enough to fill the screen. Rows: `React.memo`, stable callbacks, fixed image dimensions. And I'd contrast FlashList's recycling model — reusing mounted views instead of mount/unmount. Details: [../01-topics/react-native/list-virtualization.md](../01-topics/react-native/list-virtualization.md)

## Q: Explain the old bridge vs JSI — why is the new architecture faster?

**Tags:** jsi, new-architecture · **Asked at:** expected

Old bridge: every JS↔native call serialized to JSON, queued async, parsed on the other side — serialization CPU plus batching latency, which is exactly what janked heavy scroll. JSI replaces that with C++ host objects JS can reference directly — no serialization, sync calls possible. TurboModules add lazy loading (startup win); Fabric gives a C++ shadow tree with sync layout capability; Codegen generates the typed bindings. My overlay batched native FPS events every 500ms specifically to avoid bridge spam — on JSI that cost model changes, but batching high-frequency events is still right. [../01-topics/react-native/new-architecture.md](../01-topics/react-native/new-architecture.md)

## Q: When would you NOT use React.memo/useMemo?

**Tags:** memoization · **Asked at:** expected

When the compare cost rivals the render cost (cheap components), when props change every render anyway (inline objects/lambdas — the compare always fails, pure overhead), and for trivial computations. Memo has real memory cost — cached previous props on low-end devices add pressure. I profile first (re-render counter in my overlay), then memo proven hot paths like ProductCards. [../01-topics/react-native/memoization-traps.md](../01-topics/react-native/memoization-traps.md)

## Q: How do you keep a layout from breaking at 200% system font size?

**Tags:** accessibility, ui · **Asked at:** expected

Respect scaling by default (`allowFontScaling`), cap only where layout integrity genuinely breaks (`maxFontSizeMultiplier={1.3}`), design rows with `minHeight` instead of fixed `height` so containers grow, `numberOfLines` + ellipsize for constrained rows, and actually test at 200%. [../01-topics/react-native/ui-density-a11y-images.md](../01-topics/react-native/ui-density-a11y-images.md)

## Q: Designer hands you a Figma that loads 50 high-res images at once. What do you do?

**Tags:** collaboration, images · **Asked at:** expected

Quantify first — run it with real data and show memory/FPS cost (my overlay made this a 5-minute demo). Then propose alternatives that keep the design intent: progressive/blur-up loading, CDN-resized variants, virtualized carousel, WebP. Then agree a performance budget for the screen so future decisions are pre-negotiated. Data turns it from a taste argument into an engineering discussion — that's how Multi-Image on PLP shipped.

## Q: When would you choose Zustand over Redux Toolkit — and when is plain Context+useReducer enough?

**Tags:** state-management, architecture · **Asked at:** expected (senior)

Context+useReducer is enough for low-frequency, app-wide state (theme, auth, locale) — small value, few consumers. But Context re-renders every consumer on any state change; for high-frequency updates (cart, form state, streaming data) this kills perf. Redux Toolkit adds selectors (surgical re-renders), middleware (thunks, sagas), DevTools, and a predictable action/dispatch model for large teams. Zustand gives you the same surgical selectors with near-zero boilerplate and no Provider wrapper — ideal for mid-size apps or feature-scoped stores. My rule: if the store has >10 actions or multiple engineers touch it, RTK; if it's a self-contained feature store, Zustand; if it's just "pass a value down", Context.

## Q: How do you implement deep linking in a production React Native app — including cold start vs warm resume?

**Tags:** deep-linking, navigation · **Asked at:** expected (senior)

Two flows: **warm** (app is backgrounded, `Linking.addEventListener` fires immediately) and **cold** (app killed, `Linking.getInitialURL()` on mount). For Universal Links (iOS) / App Links (Android) you also need server-side `apple-app-site-association` / `assetlinks.json`. In React Navigation, you configure a `linking` prop with path-to-screen mapping. Gotcha: deep link arrives before navigation is ready → use `isReady` ref guard. For authenticated routes, intercept the deep link in a middleware layer — if the user isn't logged in, stash the target URL and redirect after auth completes. I also log every deep-link resolution (success, failed-match, auth-redirect) to analytics so we catch broken links in the wild.

## Q: The app takes 5+ seconds to become interactive on a mid-range Android. How do you diagnose and fix startup time?

**Tags:** startup, hermes, performance · **Asked at:** expected (senior)

Step 1: Measure — use `adb shell am start -S -W` for cold start time, and `performance.now()` markers for JS init phases. Step 2: Enable Hermes if not already (bytecode compilation → faster parse). Step 3: Profile the JS bundle — `npx react-native-bundle-visualizer` → find heavy dependencies and lazy-load or replace them. Step 4: Defer non-critical initialization — analytics SDKs, feature-flag hydration, and deep-link handling can move to `InteractionManager.runAfterInteractions`. Step 5: Use RAM bundles / inline requires for rarely-used screens. Step 6: Native splash screen (Lottie or static) held until JS signals ready, so perceived startup feels instant even if JS init takes 2s. On Best Buy we shaved 1.2s by lazy-loading three analytics SDKs that were all eagerly initializing at startup.

## Q: Describe your testing strategy for a production React Native app — unit, component, and E2E.

**Tags:** testing, detox, jest · **Asked at:** expected (senior)

Three layers: **Unit** (Jest) for pure business logic, reducers, utils, hooks — fast, 80% of tests live here. **Component** (React Native Testing Library) for UI behavior — render a component, simulate press/type, assert output. I test user-visible behavior, not implementation details. **E2E** (Detox on iOS, or Maestro for cross-platform) for critical user flows: login → search → add to cart → checkout. E2E is slow and flaky, so I keep only 10-15 critical-path tests and run them in CI nightly, not on every PR. Snapshot tests: I avoid them for UI (brittle, massive diffs) but use them for serializable data structures. Coverage target: 70-80% lines for business logic packages, no arbitrary coverage mandate for UI components.

## Q: How do you set up CI/CD and OTA updates for a React Native app?

**Tags:** ci-cd, codepush, fastlane · **Asked at:** expected (senior)

CI: GitHub Actions (or Bitrise/CircleCI) with matrix builds — lint, typecheck, unit tests on every PR; E2E tests nightly. Native builds via Fastlane (both platforms) or EAS Build (Expo). For OTA: CodePush (AppCenter) or EAS Updates for JS-only changes — bypasses store review, lets you hotfix critical bugs in minutes. Key guardrails: OTA updates are version-pinned (a v2.0 JS bundle never loads on a v1.9 native shell), rollback is automatic if crash rate spikes post-update, and the update is downloaded in background then applied on next cold start (never mid-session). Store releases go through staged rollout (1% → 10% → 100%) with crash-rate monitoring between each stage.

## Q: How do you handle sensitive data securely in a React Native app?

**Tags:** security, keychain · **Asked at:** expected (senior)

Never store tokens or secrets in AsyncStorage (it's unencrypted on Android). Use `react-native-keychain` or `expo-secure-store` — they delegate to Keychain (iOS) and EncryptedSharedPreferences/Keystore (Android). Auth tokens: short-lived access tokens in memory, refresh tokens in secure storage, silent refresh on 401. Certificate pinning via `TrustKit` (iOS) or network-security-config (Android) to prevent MITM. For API keys: don't ship them in the JS bundle — use a proxy server or `.env` with build-time substitution (never commit `.env` to git). Enable ProGuard (Android) and Bitcode (iOS) for basic obfuscation, and consider Hermes bytecode which is harder to reverse-engineer than plain JS.

## Q: How does React Fiber scheduling work, and how do concurrent features like `useTransition` affect your React Native code?

**Tags:** fiber, concurrent, react-internals · **Asked at:** expected (senior)

Fiber replaced the old synchronous, recursive reconciler with an incremental work loop. Each component instance is a "fiber node" — a unit of work that can be paused, resumed, or aborted. This enables concurrent rendering: React can start rendering an update, yield to a higher-priority update (user input), then resume the original work. `useTransition` marks a state update as non-urgent — React keeps the current UI responsive while computing the new tree in the background. `useDeferredValue` is similar but for derived values. In React Native, this means a heavy re-render (like filtering a 1000-item list) won't block touch responsiveness if wrapped in `startTransition`. Caveat: concurrent features require the New Architecture (Fabric) to fully work in RN, and your components must be pure (no side effects in render).

## Q: How do you implement auth guards in React Navigation — and prevent the flash of the wrong screen?

**Tags:** navigation, auth, architecture · **Asked at:** expected (senior)

The pattern: two top-level stacks (AuthStack, AppStack) conditionally rendered based on auth state — NOT imperative `navigation.navigate('Login')`. This way, React Navigation's declarative model handles stack reset automatically (logging out unmounts the entire AppStack, no stale screens). To prevent flash: show a loading/splash screen while the auth state is being determined (checking secure storage for a refresh token, validating it). Only after that resolves do you render either AuthStack or AppStack. Deep links that arrive during this loading phase get queued. I keep auth state in a lightweight context (not Redux) since it changes infrequently and every screen needs it.

## Q: How would you architect an offline-first feature — say, saving user drafts or form data without network?

**Tags:** offline-first, architecture · **Asked at:** expected (senior)

Layer 1: local persistence (MMKV for key-value, WatermelonDB or SQLite for structured data — never AsyncStorage for anything large or frequently written). Layer 2: an operation queue — user actions are written locally AND appended to a sync queue. Layer 3: a sync manager that flushes the queue when connectivity is detected (`NetInfo` listener). Conflict resolution strategy depends on the domain: last-write-wins for simple fields, operational transform or CRDT for collaborative editing. UI shows local state immediately (optimistic) with a subtle sync indicator. Retry with exponential backoff. Edge cases: partial sync failure (some ops succeed, some fail — need idempotent server endpoints), and queue ordering (don't apply "delete item" before "create item").

## Q: A CocoaPods install fails after adding a new native module. Walk me through your debugging process.

**Tags:** native-debugging, ios, cocoapods · **Asked at:** expected (senior)

Step 1: Read the actual error — it's usually a version conflict, missing spec repo, or minimum deployment target mismatch. Step 2: `pod install --repo-update` to refresh the spec cache. Step 3: Check the new library's `podspec` for its minimum iOS version — if it requires iOS 15 and your app targets iOS 13, that's the conflict. Step 4: Look for duplicate symbol errors — two pods shipping the same C library. Fix with `pod 'X', :modular_headers => true` or exclude the duplicate. Step 5: If it's a Swift pod in an Obj-C project, ensure the bridging header exists. Step 6: Nuclear option: `rm -rf Pods Podfile.lock && pod install` — equivalent of "turn it off and on again". On Android (Gradle): it's usually `minSdkVersion` conflicts, duplicate classes (resolved with `exclude group:`), or Jetifier issues. I always check the library's GitHub Issues before debugging blind — someone's usually hit the same error.
