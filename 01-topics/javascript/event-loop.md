# Event Loop & Concurrency

JS is single-threaded. Async work is coordinated by the event loop across two queues.

```
[ CALL STACK ]        <- sync code executes here first
      |
      v  (when stack empties, event loop checks:)
[ MICROTASK QUEUE ]   <- Promise.then, queueMicrotask, MutationObserver
      |                  DRAINED ENTIRELY before moving on
      v
[ MACROTASK QUEUE ]   <- setTimeout, setInterval, I/O, UI events
                         ONE task, then back to microtasks
```

## The classic output question

```js
console.log("1"); // sync
setTimeout(() => console.log("2"), 0); // macrotask
Promise.resolve().then(() => console.log("3")); // microtask
console.log("4"); // sync

// Output: 1 → 4 → 3 → 2
```

Why: sync first (1, 4) → microtask queue drained (3) → one macrotask (2).

## Talking points

- `setTimeout(fn, 0)` is never 0ms — it waits for the stack + all microtasks.
- A long `.then` chain can starve rendering: microtasks are drained _completely_ before the browser/RN can paint or handle the next macrotask.
- **React Native angle:** the JS thread runs its own event loop. Blocking it delays `onScroll` handlers, touch responses, and bridge/JSI callbacks — UI thread may keep animating (native-driven) while JS is frozen. This is exactly why JS-based FPS counters lie → see [native-fps-anr.md](../performance/native-fps-anr.md).

## Related

- Starvation demo: `while(true) Promise.resolve().then(...)` freezes everything; `setTimeout` recursion does not.
- Jake Archibald "In The Loop": https://www.youtube.com/watch?v=8aGhZQkoFbQ
- MDN event loop: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop
