# Debounce & Throttle — from scratch (no Lodash)

**Debounce** = run AFTER the calls stop (search box). **Throttle** = run at most once per interval (scroll handler).

```js
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId); // reset if called again
    timeoutId = setTimeout(() => {
      func.apply(this, args); // run after user stops
    }, delay);
  };
}

function throttle(func, interval) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      func.apply(this, args);
    }
  };
}
```

## The React trap

```jsx
// BAD: new debounced fn every render — timer state lost, debounce never fires properly
const search = debounce(apiCall, 500);

// GOOD: stable identity across renders
const search = useMemo(() => debounce(apiCall, 500), []);
// (useCallback(debounce(...), []) works but lint complains — useMemo is cleaner)
```

## The search-box interview answer (freezing UI + API spam)

1. **Controlled input updates immediately** (typing must never lag)
2. **Debounce the API call** ~300ms — network only after pause
3. **Cancel in-flight requests** (AbortController) — prevents out-of-order responses
4. **Keyboard-avoid heavy rendering:** virtualize the results list, memo rows
5. Bonus: cache recent queries; on RN mention `InteractionManager.runAfterInteractions` for post-animation work
