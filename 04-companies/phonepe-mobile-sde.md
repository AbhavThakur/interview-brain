# Company Interview Dossier — PhonePe (Bengaluru)

> **Target Role:** Software Engineer / Senior Software Engineer — React Native (SDE-2 / SDE-3)  
> **Location:** Bengaluru, India (Office / Hybrid)  
> **Key Focus:** Extreme scale (500M+ registered users, 45M+ daily transactions), micro-frontends, sub-16ms UI responsiveness, offline security, and native bridge performance.

---

## 1. Interview Process Breakdown

### Round 1: Machine Coding / React Native Deep Dive (90 Mins)
- **Format:** Live coding in React Native + TypeScript with clean architectural separation.
- **Typical Problems:**
  1. Build an offline-first transaction feed with local search, pull-to-refresh, status filters, and cached icons.
  2. Implement an animated bottom-sheet payment modal using `react-native-reanimated` with gesture velocity snap points.
  3. Build a debounced search bar with request cancellation (preventing race conditions).
- **Evaluation Criteria:** Code modularity, custom hooks, typed props, edge cases (network failure, empty states), virtualization (`FlatList`/`FlashList`), no unnecessary re-renders.

### Round 2: Mobile System Design (HLD & LLD) (60 Mins)
- **Typical Questions:**
  1. *"Design PhonePe's QR Scanner & Payment Flow"* (Camera frame extraction, offline intent verification, idempotent payment dispatch).
  2. *"Design a Low-Latency Notification & Transaction Sync Engine"* (WebSocket reconnects, SQLite/WatermelonDB sync, push notification payload decryption).
  3. *"Design an In-App Mobile Observability SDK"* (Exactly your Best Buy Debug Library!).
- **Key Talking Points:** JSI vs Old Bridge, TurboModules, memory pooling, crash-free session budgets, Hermes bytecode compilation.

### Round 3: Technical Leadership & Past Projects Deep Dive (60 Mins)
- **Focus:** Your Best Buy scale, the 3-layer Performance Debug SDK, AMQ feature architecture, and the RN 0.59 → 0.69 migration at Impelsys.
- **Expect Deep Questions On:**
  - *"How did you prevent the performance debug library from dropping frames?"* &rarr; Answer: 500ms batched bridge emission, `CADisplayLink`/`Choreographer` native decoupling.
  - *"How did you achieve a 1.7s drop in first-click latency?"* &rarr; Answer: Category clustering, lazy product carousels, batched telemetry.
  - *"How do you handle bridge bottlenecks vs JSI?"* &rarr; Answer: C++ HostObjects, zero JSON serialization overhead.

### Round 4: Cultural & Leadership Fit (30-45 Mins)
- Conflict resolution between product deadlines and technical debt, handling production hotfixes under pressure (your 4-day OTA release story).

---

## 2. Abhav's High-Leverage Differentiators for PhonePe
1. **Fintech Scale Experience:** You already understand high-reliability production systems (Best Buy Top-25 US App, 99.85%+ crash-free rate).
2. **Native iOS & Android Mastery:** PhonePe's mobile app is a hybrid container. Your ability to write Swift (`CADisplayLink`) and Java (`Choreographer`, `Looper` ANR) sets you apart from purely JavaScript developers.
3. **Obsolescence Migration Track Record:** Your RN 0.59 → 0.69 overhaul proves you can manage heavy framework migrations without downtime.
