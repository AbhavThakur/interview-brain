# List Virtualization — FlatList internals & tuning

ScrollView renders everything → OOM on big lists. FlatList windows the render around the viewport.

```jsx
<FlatList
  data={massiveArray}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  // 1. O(1) layout — no dynamic measurement; enables instant scrollToIndex
  getItemLayout={(data, index) => ({ length: 120, offset: 120 * index, index })}
  // 2. Memory window (default 21 "screens" — huge). 5 = 2 above, 2 below, 1 visible
  windowSize={5}
  // 3. Fewer items per render batch = less JS-thread blocking during fast scroll
  maxToRenderPerBatch={8}
  // 4. Detach off-screen views from native hierarchy (big Android memory win)
  removeClippedSubviews={true}
  // 5. First paint size — just enough to fill screen
  initialNumToRender={6}
/>
```

## The senior-level trade-off narrative

- `windowSize` down = memory ↓ but blank areas during fling. Tune per device tier — my perf library measured this per HIGH/MED/LOW tier.
- `getItemLayout` requires fixed heights — for mixed layouts, give height per item type.
- Row components: `React.memo` + stable callbacks; images with explicit dimensions + caching (prevents OOM on image-dense PLPs → see multi-image story).
- **FlashList (Shopify)** contrast: cell RECYCLING (reuse mounted views) vs FlatList virtualization (mount/unmount) → far fewer creations, better scroll perf; requires `estimatedItemSize`, recycled-state discipline.

## Numbers I can cite

Frame budget = 16.67ms @60fps. Blowing it in `renderItem` = dropped frames. My overlay measured scroll FPS min/avg/max + frame drops per scroll session — [../performance/native-fps-anr.md](../performance/native-fps-anr.md).

Docs: https://reactnative.dev/docs/optimizing-flatlist-configuration
