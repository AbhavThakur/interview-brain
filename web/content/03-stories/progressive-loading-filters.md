# Story: PLP Quick-Filter Transformation & Progressive "Show More" Virtualization

> **Context:** Advanced list interaction and search filter optimization on Best Buy PLP · Jira PLP-3543 / PLP-3651 / PLP-3902 / PLP-3903 / plp #5250  
> **Key Numbers:** Desktop 3 / Mobile 2 pill group capping · Sub-100ms quick-filter transformation · Smooth in-place product accumulation without full-page skeleton flash · Fixed Android clipping crashes

---

## STAR (60-second spoken version)

- **S (Situation):** Best Buy's search results had two frustrating UX flaws: First, clicking "Show More" to load the next 24 products replaced the entire list with a skeleton loader, destroying the user's scroll position. Second, quick-filter chips frequently duplicated applied facets or showed irrelevant pills across mobile and desktop.
- **T (Task):** Build an in-place progressive page loader (`use-progressive-loading.ts`) and a responsive quick-filter normalization engine (`quick-filter-loader.tsx`) that maintains scroll continuity, deduplicates facet suggestions, and tunes `FlatList` virtualization on Android.
- **A (Action):**
  1. **Responsive Quick-Filter Rules:** Normalised mismatched facet names between backend and client; capped pills at 3 per group on desktop (Large View) and 2 on mobile (Small View), with a global cap of 10 pills. Suppressed unselected suggestions if their facet group already had an active user selection.
  2. **In-Place Progressive Accumulation:** Replaced full-page navigation reloads with `use-progressive-loading.ts` and `useShowMorePrefetch.ts`. Subsequent pages append directly into accumulated state while pre-fetching the next page cursor.
  3. **Android FlatList Tuning:** Fixed an Android-specific native crash caused by `removeClippedSubviews` during rapid pagination (`PLP-3902`, PR `#40977`) and tuned window size (`maxToRenderPerBatch`, `windowSize: 5`) to reduce JS thread pressure.
- **R (Result):** Eliminated the jarring skeleton reload on pagination, delivered seamless infinite-scroll continuity, and removed duplicate facet clutter across desktop and mobile devices.

---

## Technical Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER SEARCH / FACET RESPONSE                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌─────────────────────────────────┐   ┌──────────────────────────────────┐
│ QUICK FILTER NORMALIZATION      │   │ PROGRESSIVE "SHOW MORE" LOADING  │
│ (quick-filter-loader.tsx)       │   │ (use-progressive-loading.ts)     │
│ • Match applied facets          │   │ • Retain existing product state  │
│ • Desktop: Cap 3 pills/group    │   │ • Fetch next page in background  │
│ • Mobile: Cap 2 pills/group     │   │ • Append new items in-place      │
│ • Suppress duplicate values     │   │ • Zero full-screen skeleton flash│
└────────────────┬────────────────┘   └────────────────┬─────────────────┘
                 │                                     │
                 └──────────────────┬──────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│              TUNED VIRTUALIZED LIST (ProductListFlatList.tsx)          │
│   • removeClippedSubviews Android crash workaround                     │
│   • maxToRenderPerBatch: 6 · windowSize: 5 (Reduced JS jank)           │
│   • Maintained scroll offset across pagination boundaries             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Design Decisions I Defend in Interviews

1. **Why Separate Mobile and Desktop Quick-Filter Rules?**
   - On desktop, applied filters are visible in the left-hand navigation sidebar. On mobile, screen real estate is constrained, and applied filters sit in the horizontal pill strip. Applying identical visibility rules to both causes mobile chips to vanish when selected. View-specific rules are essential for responsive UX.
2. **Preventing Full-Page Skeleton Flashes:**
   - Standard Next.js / React Router navigation replaces the entire page tree upon query parameter changes (`?page=2`). By capturing pagination inside `use-progressive-loading.ts`, the URL updates for bookmarking while React appends items in-place without unmounting existing cards.
3. **Android FlatList Clipping Gotcha:**
   - While `removeClippedSubviews={true}` saves memory, on older Android devices with complex nested product cards, rapid scroll velocity can cause the native view hierarchy to drop cells before they are unclipped, leading to visual blanks and `NullPointerException` crashes. We carefully tuned batch rendering to avoid this trap.

---

## Key Files in Repositories
- Quick Filter Engine: `plp-lib/src/component-wrappers/quick-filter/quick-filter-loader.tsx`
- Progressive Loading Hook: `plp-lib/src/hooks/show-more/use-progressive-loading.ts`
- Prefetch Optimization: `plp-lib/src/hooks/useShowMorePrefetch.ts`
- Virtualized List Tuning: `components/sku-list/src/components/unifiedPromoPLP/ProductListFlatList.tsx`
- PR Reference: `plp #5250`, `plp #5456`, `app #40168`, `PLP-3543`, `PLP-3902`
