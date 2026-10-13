# Story: Total Member Pricing & Reactive Cart State Synchronization on PLP

> **Context:** Integrating Best Buy Total / Plus membership pricing into the Product List Page · Jira PLP-2913 / PLP-2291 / PR #36385  
> **Key Numbers:** Reactive cart-to-PLP synchronization with zero page reload · Typed SKU validation guarding against unknown membership types · Integrated dual-add-to-cart membership flow

---

## STAR (60-second spoken version)

- **S (Situation):** Best Buy offers exclusive member pricing to paid members (My Best Buy Plus / Total). When a user added a membership or discounted product to their cart on the mobile app, the Product List Page (PLP) continued to display non-member pricing until a hard refresh or navigation reset occurred, confusing customers and depressing membership conversions.
- **T (Task):** Build a reactive synchronization bridge between the shopping cart and the PLP price loader so that adding or altering a membership SKU in the cart immediately updates the visible price experience across all search cards with zero race conditions or stale state.
- **A (Action):**
  1. **Typed Membership Guard:** In `PriceLoader.tsx`, created a strict validator mapping `PMEM2` and `PMEM3` cart SKUs to internal paid membership types while safely guarding against unknown SKU types.
  2. **Reactive Customer Variable:** Observed cart state mutations and propagated changes directly to Apollo Client's reactive customer store.
  3. **Keyed Remounting Mechanism:** Incremented a dynamic `reloadKey` on price updates, triggering `PriceExperienceLoader` to re-fetch and render updated member pricing without tearing down the parent list.
  4. **Fulfillment & Availability Resilience:** Resolved modal scrolling bugs (`PLP-2291`) and store-pickup selection edge cases (`PLP-3130`) to ensure pickup availability matched the selected store.
- **R (Result):** Delivered real-time member price updates across the entire mobile catalog upon cart mutation. Eradicated price discrepancy tickets and smoothed the multi-item membership purchase funnel.

---

## Technical Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER ACTION: ADD MEMBERSHIP TO CART             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Cart mutation response
┌───────────────────────────────────▼────────────────────────────────────┐
│                    TYPED SKU VALIDATOR & GUARD                         │
│   • Map PMEM2 (Plus) & PMEM3 (Total) to internal membership enum       │
│   • Guard: Unknown SKU values safely ignored without throwing         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Validated Membership Status
┌───────────────────────────────────▼────────────────────────────────────┐
│                    REACTIVE CUSTOMER STATE UPDATE                      │
│   • Update customer reactive variable (Apollo Client / MMKV)           │
│   • Customer ref pattern prevents stale callback closures              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Trigger Component Refresh
┌───────────────────────────────────▼────────────────────────────────────┐
│                    KEYED PriceExperienceLoader REMOUNT                 │
│   • Increment reloadKey in PriceLoader.tsx                             │
│   • Remounts only the pricing sub-tree across visible UPC cards        │
│   • Parent ProductListFlatList retains exact scroll position           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions I Defend in Interviews

1. **Why Use a Keyed Remount Instead of Manual State Mutation?**
   - The pricing engine (`PriceExperienceLoader`) encapsulates complex discount rules, bundle promotions, and financing calculations. Trying to manually patch prices in local state causes sync drift. Forcing a keyed remount of the pricing loader re-runs the canonical business rules cleanly.
2. **Preventing Stale Closure Traps in React Native:**
   - In rapid add-to-cart sequences, callback functions can capture outdated cart snapshots. We used a stable `customerRef` to ensure async responses always checked the latest active membership state.
3. **Safe Guarding Unknown SKUs:**
   - E-commerce platforms frequently run promotional pilot SKUs. If the cart returns an experimental membership code, the mapper deliberately falls back to standard pricing rather than guessing an invalid tier.

---

## Key Files in Repositories
- Pricing & Cart Sync: `components/sku-list/src/components/unifiedPromoPLP/PriceLoader.tsx`
- Availability Modal: `components/sku-list/src/components/unifiedPromoPLP/AvailabilityModal.tsx`
- PR Reference: `consumerAppNext #36385`, `PLP-2913`
