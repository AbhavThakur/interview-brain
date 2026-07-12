# Q&A Bank — JavaScript

## Q: User types rapidly in a search box — how do you prevent UI freeze while not spamming the API?

**Tags:** debounce, event-loop · **Asked at:** expected (Zerodha prep)

Controlled input updates immediately — typing must never lag. The API call is debounced ~300ms so the network fires only after a pause. In-flight requests get cancelled with AbortController so out-of-order responses can't clobber newer results. The results list is virtualized with memoized rows. Key React detail: the debounced function must have a stable identity — `useMemo(() => debounce(fn, 300), [])` — otherwise every render creates a fresh debounce and the timer state is lost. Full code: [../01-topics/javascript/debounce-throttle.md](../01-topics/javascript/debounce-throttle.md)

## Q: What's the output — and why? `console.log(1); setTimeout(()=>console.log(2)); Promise.resolve().then(()=>console.log(3)); console.log(4);`

**Tags:** event-loop · **Asked at:** expected

1 → 4 → 3 → 2. Sync code runs first on the call stack (1, 4). When the stack empties, the event loop drains the ENTIRE microtask queue (Promise callbacks → 3) before taking ONE macrotask (setTimeout → 2). Follow-up trap: microtask starvation — endlessly chaining `.then` blocks rendering; setTimeout recursion doesn't.

## Q: Explain execution context in an arrow function vs a standard function.

**Tags:** this, arrow-functions · **Asked at:** expected (Zerodha prep)

A standard function gets its own `this` and `arguments`, determined by HOW it's called — method call, plain call, `call/apply/bind`, or `new`. An arrow function has no own `this` — it captures the enclosing scope's `this` lexically at definition time, and `bind/call/apply` cannot rebind it, nor can it be a constructor. Practical gotcha: arrow as an object method — `this` won't be the object. Table: [../01-topics/javascript/prototypes-this-arrow.md](../01-topics/javascript/prototypes-this-arrow.md)

## Q: How do stale closures cause bugs in React hooks, and how do you fix them?

**Tags:** closures, hooks · **Asked at:** expected

Every render creates new functions closing over that render's state. An effect with `[]` deps traps the FIRST render's values — the classic `setInterval(() => setCount(count + 1))` counts 0→1 forever. Fixes in order of preference: functional updates (`setCount(c => c+1)`), a ref as a mutable box kept current by a small effect, or correct deps if restarting the effect is acceptable. And always clean up timers/subscriptions in the effect return — that's also the memory-leak defense. Code: [../01-topics/javascript/closures-stale-state.md](../01-topics/javascript/closures-stale-state.md)

## Q: Write debounce from scratch.

**Tags:** debounce, closures · **Asked at:** expected

Closure over a `timeoutId`; each call clears the pending timer and schedules a new one; `func.apply(this, args)` preserves context and arguments. [Code](../01-topics/javascript/debounce-throttle.md). Mention the difference from throttle (rate-limit vs run-after-quiet) and the React identity trap.
