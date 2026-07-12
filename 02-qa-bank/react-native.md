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
