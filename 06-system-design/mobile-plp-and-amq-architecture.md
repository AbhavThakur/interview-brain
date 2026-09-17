---
title: High-Density Search & Product Listing Feed (AMQ)
category: mobile-frontend
difficulty: Senior / SDE-2
tags: [react-native, mobile, e-commerce, search, amq, virtualization, image-caching]
---

# Mobile System Design — High-Density Search & Product Listing Feed (AMQ)

> **Context:** Architectural design for an enterprise mobile e-commerce Search & Product Listing Page (PLP) featuring Ambiguous Query (AMQ) clustering, viewport-aware image prefetching, and sub-16ms layout toggles. Proven at Best Buy scale (~13.3k daily installs).

---

## 1. The Core Problem
When a user searches an ambiguous query (e.g. *"Apple"* or *"Monitor"*), standard search engines return a generic flat list with high cognitive load. This leads to slow first-click metrics, high bounce rates, and missed conversion.

**Goals:**
- Present semantic category clusters and horizontal sub-carousels above the main vertical feed.
- Cut **Time to First Click (TTFC)** by > 1.5s.
- Maintain **smooth 60 FPS scrolling** with multi-image previews and instant Grid/List view switching without memory spikes or blank cells.

---

## 2. Client Architecture & Data Pipeline

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER SEARCH QUERY: "SONY"                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Debounced Query (300ms)
┌───────────────────────────────────▼────────────────────────────────────┐
│                    API GATEWAY & GRAPHQL RESOLVER                      │
│   • Semantic Category Clusters: [Cameras, Headphones, TVs, Consoles]   │
│   • Product Feeds: Paginated cursor stream with variant thumbnails     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Normalization & Local Cache
┌───────────────────────────────────▼────────────────────────────────────┐
│                     CLIENT DATA STORE (TanStack Query + MMKV)          │
│   • Normalized Entities: Map<ProductId, ProductDetail>                 │
│   • Viewport Prefetch Cache: Next 2 pages buffered in background       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ View State (List vs Grid)
┌───────────────────────────────────▼────────────────────────────────────┐
│                       REACTIVE UI RENDER LAYER                         │
│  ┌─────────────────────────────┐ ┌──────────────────────────────────┐  │
│  │   AMQ Category Header       │ │   Virtualized Product Feed       │  │
│  │   • Horizontal Cluster Chips│ │   • FlashList / MasonryGrid      │  │
│  │   • Lazy Carousel Mount     │ │   • Viewport Intersection Cacher │  │
│  │   • Batched Click Telemetry │ │   • Memoized ProductCard Cells   │  │
│  └─────────────────────────────┘ └──────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Critical Mobile Performance Strategies

### A. Sub-16ms Grid/List View Switching
- **The Pitfall:** Unmounting `FlatList` in list mode and mounting a new `FlatList` in grid mode causes a jarring 200–400ms freeze, blank white flash, and lost scroll position.
- **The Architecture Solution:**
  - Maintain a **single list component instance** (`FlashList` or tuned `FlatList`).
  - Toggle `numColumns` (1 vs 2) with a unified `key` switch, or adjust item style dynamically within a single flexbox cell renderer.
  - Preserve `scrollOffset` via `ref.current.scrollToOffset()` so the user stays at the exact product row they were browsing.

### B. Viewport-Aware Selective Image Rendering
- On a high-density PLP grid, 20 visible product cards loading 3 image variants each = **60 concurrent network image requests**. On budget Android devices, this causes Out-Of-Memory (OOM) crashes and decoder freezes on the main UI thread.
- **Solution:**
  1. Only decode primary thumbnails for cards currently within the active viewport window.
  2. Multi-image variant dots are lazy-evaluated: secondary images are only fetched when the user's thumb hovers/swipes on an individual card.
  3. Disk caching with LRU policy capped at 100MB; downsampled WebP assets via CDN image resizing parameters (`?w=320&q=80`).

### C. Batched Analytics & First-Click Optimization
- AMQ click interactions are high-velocity. Emitting immediate HTTP network requests on every chip tap blocks CPU cycles needed for screen transitions.
- **Solution:** Analytics events are pushed to an in-memory ring buffer and flushed in batches every **2000ms** or upon backgrounding the screen.

---

## 4. Key Metrics Achieved (Best Buy Production Case Study)
- **Interactive First-Click Latency:** Reduced by **1.7 seconds**.
- **User Tap-Through Rate:** Lifted by **+12%**.
- **"Shop All" Category Conversion:** Lifted by **+23%**.
- **Crash-Free Rate:** Maintained at **99.85%+** across 48+ releases.
