# Closures & the React Stale-State Trap

A closure captures variables from its lexical scope. In React, every render creates NEW
functions closing over THAT render's state. Effects with `[]` deps trap the first render's values.

## The trap + the fix

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count); // mutable box outside render cycle

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    const timer = setInterval(() => {
      // BAD:  setCount(count + 1)            -> closure traps count at 0 forever
      // GOOD: setCount(c => c + 1)           -> functional update, no closure needed
      // ALSO: setCount(countRef.current + 1) -> ref always reads latest
    }, 1000);
    return () => clearInterval(timer); // cleanup = no leak
  }, []);
}
```

**Preferred order of fixes:** functional update `setCount(c => c+1)` → ref pattern → adding deps (restarts interval each tick — usually wrong).

## Closures & memory leaks

- A closure keeps its ENTIRE captured scope alive — a tiny callback referencing one field of a huge object retains the whole object.
- Common RN leaks: listeners/subscriptions not removed in effect cleanup, timers not cleared, stale navigation callbacks.
- In my perf library, memory-leak detection watches heap growth % across interactions — steady growth after repeated filter/sort = retained closures/subscriptions.

## Related

- MDN closures: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
- [event-loop.md](event-loop.md) · [../performance/native-fps-anr.md](../performance/native-fps-anr.md)
