# Story: Universal Product Card (UPC) Migration, LCP Priority & Visibility

> **Context:** Cross-platform Product Card unification across Web and Mobile App at Best Buy · Jira PLP-3922 / PLP-4000 / PLP-4001 / PLP-4250 / PLP-4742  
> **Key Numbers:** Unified shared card architecture across Web & App · First-image vs. Lazy-image LCP signals · Feature-flagged rollback safety · Preserved 100% legacy card parity

---

## STAR (60-second spoken version)

- **S (Situation):** Best Buy's search results had fragmented, divergent product-card implementations across web (`plp` repo) and mobile app (`consumerAppNext` repo). Every feature addition (ratings, pickup badges, swatch variations) required duplicate engineering, caused inconsistent LCP performance, and led to conflicting impression analytics between platforms.
- **T (Task):** Migrate both web and mobile app product lists to a shared **Universal Product Card (UPC)** component architecture, ensuring zero regression in legacy card parity, improving image loading priority for LCP, and fixing impression visibility attribution.
- **A (Action):**
  1. **Component Composition:** Built modular wrappers (`vertical-product-grid-item.tsx` and `ProductListItemContent.tsx`) composing image, title, variations, and pricing behind error and suspense boundaries.
  2. **Context-Specific Variation Gates:** Implemented logic to intelligently suppress SKU variations during vehicle facet queries, ambiguous search (AMQ), and promotional hero pages.
  3. **LCP Image Priority & Timing Signals:** Instrumented `upc-product-image.tsx` to distinguish between above-the-fold lead images (high fetch priority) and below-the-fold lazy images, capturing dedicated first-image and first-lazy-image timing signals for analytics.
  4. **Impression Visibility Tracking:** Introduced a unique `visibilityKey` coupled with stable product indexes, ensuring product view events only fired when items genuinely entered the viewport, eliminating re-order index drift.
  5. **Rollout Discipline:** Managed deployment through staged feature flags (`PLP-41395` and `PLP-41602`); tested legacy card parity across pre-holiday releases (`PLP-5025`).
- **R (Result):** Successfully unified product cards across platforms. Streamlined future feature development into a single shared component standard, eliminated analytics impression misattributions, and established precise LCP telemetry across web and mobile.

---

## Architectural Card Composition

```
┌────────────────────────────────────────────────────────────────────────┐
│             VERTICAL PRODUCT GRID ITEM (vertical-product-grid-item)    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 1. UPC PRODUCT IMAGE (upc-product-image.tsx)                     │  │
│  │    • Priority LCP lead image vs. Lazy-loaded image timing        │  │
│  │    • Visibility observer with unique visibilityKey for analytics │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 2. TITLE, ATTRIBUTES & RATINGS (upc-sku-title.tsx)               │  │
│  │    • Brand, descriptive title, review count & star links         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 3. SKU VARIATIONS (upc-sku-variations.tsx)                       │  │
│  │    • Swatch preview (Color / Storage / Size)                     │  │
│  │    • GATED: Hidden for vehicle facets, AMQ clusters, & promos    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 4. COMMERCE & PRICING WRAPPER (PriceLoader.tsx)                  │  │
│  │    • Standard vs. Total Member Pricing display                   │  │
│  │    • Fulfillment badges (Store Pickup / Delivery Today)          │  │
│  │    • Context-aware Add-to-Cart & Availability Modal trigger      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Design Decisions I Defend in Interviews

1. **Why Separate First-Image Timing from Impression Visibility?**
   - *LCP Priority* measures when the browser/app decodes the lead visual asset (pure rendering performance).
   - *Impression Visibility* measures when a card dwells in the viewport for user consideration (analytics/business signal). Mixing them corrupts both metrics; separating them enabled clear optimization.
2. **Context-Specific Variation Gating:**
   - On ambiguous search clusters or vehicle parts fitment pages, showing 10 swatches per card blows up the DOM node count and distracts the customer. The card wrapper conditionally renders swatches based on query metadata.
3. **Safe Feature-Flagged Migration:**
   - Major component rewrites on high-traffic e-commerce pages risk conversion drops. We ran the new UPC card in parallel with the legacy card behind remote config flags, allowing instant rollback and seamless A/B validation.

---

## Key Files in Repositories
- Web Card: `product-list-web-ui/src/features/upc-product-list-item/vertical-product-grid-item.tsx`
- Image & Priority: `product-list-web-ui/src/features/product-image/upc-product-image.tsx`
- Swatch Variations: `product-list-web-ui/src/features/product-variations/upc-sku-variations.tsx`
- App Implementation: `components/sku-list/src/components/unifiedPromoPLP/ProductListItemContent.tsx`
