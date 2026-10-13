# ABHAV THAKUR
**Senior React Native & Mobile Platform Engineer (SDE-2 / SDE-3)**  
Bengaluru, India • +91 8544728668 • abhav.thakur25@gmail.com • [Portfolio](https://interview-brain-one.vercel.app) • [LinkedIn](https://linkedin.com) • [GitHub](https://github.com)

---

### PROFESSIONAL SUMMARY
Senior Mobile Platform Engineer with ~5 years of experience architecting enterprise React Native systems for Top-25 US App Store retail applications serving millions of users (Best Buy, ~13.3k daily installs). Specialist in mobile performance foundations, cross-platform native bridge engineering (Swift & Java), and low-level runtime observability (Perfetto, CADisplayLink, Choreographer, main-thread ANR watchdogs). Proven track record of cutting interactive latency by 1.7s, driving +23% engagement lifts, authoring org-wide zero-config profiling SDKs, merging 84+ production PRs across core monorepos, and executing zero-downtime framework migrations (RN 0.59 → 0.69). Recognized with FY26 Hackathon Winner and Director-Level Honors.

---

### TECHNICAL SKILLS
* **Mobile & Frameworks:** React Native (Expert), TypeScript (Strict), React 19, JSI, TurboModules & Fabric (New Architecture), Hermes Engine, Reanimated.
* **Native Platform:** iOS (Swift, Objective-C, CADisplayLink, task_info, CocoaPods, Xcode), Android (Java, Kotlin, Choreographer, Looper, onTrimMemory, Gradle).
* **Architecture & State:** Redux Toolkit, Zustand, TanStack Query, MMKV, TTID/TTFD Instrumentation, Offline-First Sync, REST APIs, GraphQL.
* **Performance & Tooling:** Perfetto, Systrace, Android Studio Profiler, Main-Thread Profiling, ANR Watchdogs, FlashList Virtualization, Sentry, Dynatrace, Xcode Instruments.
* **DevOps & Delivery:** OTA Releases (CodePush / EAS), CI/CD (Fastlane, GitHub Actions), A/B Testing, Feature Flags, Jest, React Native Testing Library.

---

### WORK EXPERIENCE

#### **Software Engineer II (SDE-2) — Best Buy Digital**  
*Nov 2024 – Present | Bengaluru, India*  
*Top-25 US App Store Shopping App · ~13.3k daily installs · Millions of active North American consumers*

* **Mobile Performance Debug & Observability SDK:** Designed and shipped an org-wide 3-layer mobile observability SDK (Swift + Java native modules, typed TS bridge, draggable React HUD). Captured real-time native 60 FPS via `CADisplayLink`/`Choreographer`, main-thread Looper ANR watchdog, and memory/thermal state. Dispatched batched telemetry (~500ms) with a 200-call network ring buffer over `NativeEventEmitter` to eliminate bridge saturation with 1-tap Dynatrace/Sentry upload. Honored with Director-Level Recognition (Q4 FY26).
* **Systems-Level Native Android Profiling (Perfetto):** Spearheaded dual-pass native profiling across flagship and budget devices (Galaxy S25+ & Pixel 7a), diagnosing 88–96% pre-mount latency and 95% JS thread saturation during cold PLP navigations; isolated 1.7 GB process RSS from native graphics pipelines against 48–115 MB Java heap, establishing the team’s mobile memory threshold runbook.
* **Ambiguous Query (AMQ) Architecture:** Architected end-to-end frontend system with category clustering, lazy-loaded product carousels, and batched analytics dispatching. Achieved a **1.7s reduction in first-click latency**, **12% lift in taps**, and **23% lift in "Shop All" engagement** rolled out via feature flags (10% → 100%).
* **Universal Product Card (UPC) & Dynamic Pricing Engine:** Architected unified cross-platform product cards and Total Member Pricing (`PMEM2`/`PMEM3`) across 84 merged PRs in 2 core monorepos (`consumerAppNext` & `plp`). Engineered LCP image priority prefetching and in-place progressive filter loading, achieving sub-16ms layout recalculations and 100% price parity across PLP and Cart with zero skeleton flash.
* **Release Velocity & Production Quality:** Merged **84+ production PRs** sustaining a 99.85%+ crash-free session rate across millions of active North American consumers. Spearheaded an emergency cross-timezone over-the-air hotfix cherry-pick and release in 4 days (vs. 7-day SLA) with 0 rollbacks. Won Best Buy Innovation Week Hackathon (FY26).

---

#### **Software Engineer — Mobile Platform — Impelsys**  
*Jul 2022 – Oct 2024 | Bengaluru, India*  
*EdTech & Healthcare digital publishing platforms with complex offline reader and media synchronization*

* **Major Monorepo Migration (RN 0.59 → 0.69):** Spearheaded greenfield framework overhaul upgrading legacy monorepo from pre-autolinking React Native 0.59 to 0.69. Re-architected native iOS Podfiles and Android Gradle builds, migrated custom native bridge modules to AndroidX standards, and activated Hermes engine—reducing cold launch time by ~25%.
* **Push Notification Infrastructure:** Architected enterprise Firebase Cloud Messaging (FCM) pipelines handling background/killed state intent routing, custom notification channels, and priority dispatching, driving measurable user re-engagement.
* **Runtime Optimization:** Identified high-frequency re-rendering bottlenecks using React DevTools and Flipper; refactored core component trees using selective memoization and decoupled Context providers, resolving critical production ANRs.

---

#### **Mobile Application Developer — ClinicSpots, StockPe & SkyGoal**  
*Jan 2021 – Apr 2022 | Contract & Freelance*

* Greenfielded healthcare Q&A app (ClinicSpots) to Google Play Store with secure JWT auth, telemetry, and encrypted REST APIs.
* Developed stock market simulation app (StockPe) with real-time financial charting, payment gateways, and Firebase Firestore sync.

---

### EDUCATION & KEY HONORS
**VIT University, Chennai** — B.Tech, Electronics, Communication & Media Technology (ECM) | *2018 – 2022*  
*Honors & Community:* Hackathon Winner (Best Buy Innovation Week FY26) • Director-Level Recognition (Q4 FY26) • Tech Speaker: *"Future of React Native: JSI & New Architecture"*
