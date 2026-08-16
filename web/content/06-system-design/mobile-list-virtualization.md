---
title: Mobile & Large-Scale List Virtualization Architecture
category: mobile-frontend
difficulty: Senior
tags: [react-native, performance, virtualization, memory]
---

# Mobile & Large-Scale List Virtualization Architecture

## Core Problem
Rendering 10,000 items in a mobile or web app with basic mapping causes:
1. **Massive Memory Footprint (OOM crashes):** Each native node holds layout, font metrics, image buffers, and backing views.
2. **Main Thread Blocking (Frame drops / ANR):** Measuring layout coordinates and instantiating native views for thousands of nodes freezes JS/UI threads.

---

## 1. Virtualization Mechanics: FlatList vs FlashList vs RecyclerListView

```
  Viewport (Visible Screen)
┌───────────────────────────────┐
│ [Render Window: Top Buffer]   │ <-- Pre-rendered items (e.g. 5 items above)
├───────────────────────────────┤
│ ┌───────────────────────────┐ │
│ │ Item #12 (Visible)        │ │
│ ├───────────────────────────┤ │
│ │ Item #13 (Visible)        │ │ <-- Active Screen Items
│ ├───────────────────────────┤ │
│ │ Item #14 (Visible)        │ │
│ └───────────────────────────┘ │
├───────────────────────────────┤
│ [Render Window: Bottom Buffer]│ <-- Pre-rendered items (e.g. 5 items below)
└───────────────────────────────┘
```

### FlatList (React Native Default - Windowing)
* **How it works:** Unmounts components outside the `windowSize` bounding box, replacing them with blank placeholder spacing views.
* **Flaw:** Unmounting and recreating React components + Native Views as the user scrolls rapidly causes **blank white flashes** and high garbage collection (GC) pauses.

### FlashList / RecyclerListView (Cell Recycling)
* **How it works:** Instead of destroying views, it keeps a constant pool of $\sim 15-20$ native views.
* When Item #1 scrolls off the top, its native view is **recycled and repositioned** to the bottom for Item #15, simply rebinding the new data object (View Recycling pattern from Android `RecyclerView` / iOS `UICollectionView`).
* **Result:** **5x to 10x performance increase**, zero blank spaces during fast scrolling, minimal GC pressure.

---

## 2. Senior Interview Architectural Checklist

| Optimization Vector | Architectural Strategy | Tradeoff / Pitfall |
| :--- | :--- | :--- |
| **Cell Layout Sizing** | Provide `estimatedItemSize` or exact fixed height per item type. | Inaccurate estimates cause scroll jump / jitter during fast fling. |
| **Image Memory Management** | Use dedicated caching pipelines (e.g. `react-native-fast-image` / Glide / SDWebImage) with downscaled resolution decode. | Full-resolution image decode in list cells leaks tens of megabytes of RAM. |
| **State Decoupling** | Keep cell items purely presentational (`React.memo` with primitive props or ID selectors). Avoid passing root store state into cells. | Passing global state or anonymous arrow function callbacks re-renders all 50 list cells on every keystroke. |
| **Key Extraction** | Always use stable, unique entity IDs (`item.id`). | Using array index as key breaks cell recycling and causes state bleed across recycled views. |

---

## 3. Interview Tradeoff Question & Answer
**Q: How do you handle heterogeneous list items (e.g. text post, video post, ad banner, image carousel) in a virtualized feed?**

> **Answer:**
> 1. Categorize items into distinct `itemType` or `viewType` buckets.
> 2. Maintain separate recycle pools per view type in the recycler engine so an image carousel cell is never recycled into a simple text label (which would cause expensive view reconstruction).
> 3. Provide deterministic height estimates per `itemType` to prevent layout re-measurements.
