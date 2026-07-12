# Memoization Traps — when NOT to memo

Memoization is not free: memory (stores previous props/values) + CPU (shallow compare every render).

## When it's WORTH it

- Heavy leaf components (ProductCard with images) re-rendering from parent state churn
- Expensive computations (sorting/filtering big arrays)
- Stabilizing references passed to memoized children or effect deps

## When it's WASTE (or harm)

- Cheap components — compare cost ≈ render cost
- Props change every render anyway (inline objects/arrays/lambdas) — compare always fails, pure overhead
- `useMemo` for primitive calculations
- `useCallback` on handlers passed to non-memoized children

## The inline-prop killer

```jsx
// React.memo(Row) is USELESS here — new style object + lambda every render
<Row style={{ padding: 8 }} onPress={() => select(item.id)} />

// Fix: hoist style (StyleSheet.create), stabilize callback (useCallback + id arg)
```

## Interview line

"I profile first — React DevTools highlight-renders or my overlay's re-render counter — then memo the proven hot paths. Memoizing everything adds memory pressure on low-end devices for zero win. With React Compiler coming, manual memo becomes mostly legacy; note the compiler opt-out `'use no memo'` exists for heavy ref-based components — my overlay uses it because of Animated/PanResponder ref patterns."
