# Story: Native Android PLP Profiling & Root-Cause Analysis (Pass A / Pass B Runbook)

> **Context:** Deep performance profiling investigation on Best Buy Android Product List Page (PLP) · Jira PLP-4941 / PLP-5042 / PLP-5043 / PLP-5044  
> **Key Numbers:** 88–96% delay pre-mount · 94–96% late frames JS-bound (~95% JS thread busy) · 1.4GB→1.7GB process memory with only 48–115MB Java heap · 4 controlled test scenarios

---

## STAR (60-second spoken version)

- **S (Situation):** Android PLP was experiencing severe perception lag, sluggish filtering (2.3s–3.7s), and high crash rates on lower-end devices. Engineering discussions were stalled because developers were guessing whether the bottleneck was network latency, React re-renders, native GPU hitches, or Java memory leaks.
- **T (Task):** Lead an objective, data-driven profiling investigation across real hardware (Galaxy S25+ and Pixel 7a) to separate network, JavaScript, native UI, and memory bottlenecks, producing a repeatable runbook and prioritized technical backlog.
- **A (Action):** Architected a **Dual-Pass Profiling Methodology**:
  1. **Pass A (App-Level Telemetry):** Ran 4 fixed search scenarios (S1–S4) on physical Galaxy S25+ with Performance Overlay ON, varying search queries to defeat caching, capturing median TTFD, memory, and filter response.
  2. **Pass B (Native System Traces):** Turned the overlay OFF to eliminate observer perturbation; automated 60-second native Perfetto captures via a custom `capture-trace.sh` CLI and analyzed thread occupancy with `analyze-trace.py` and `compare-runs.py`.
  3. **Root-Cause Isolation:** Proved in Perfetto that **94–96% of late frames were JavaScript-bound** (JS thread was ~95% saturated during scrolling), while native RenderThread was largely waiting. Disproved the "Java heap leak" hypothesis by showing Java heap was tiny (48–115MB) while process RSS ballooned to 1.7GB—proving memory bloat was in native/graphics allocations (un-cached images and texture pools).
- **R (Result):** Converted vague complaints into 7 concrete, prioritized engineering tickets (PLP-5198 memory reduction, PLP-5254 waterfall elimination, PLP-5255–5258 JS thread decoupling). Established the official Best Buy Android Profiling Runbook used across mobile feature teams.

---

## Technical Deep-Dive & Architecture

### Dual-Pass Profiling Execution Model

```
┌────────────────────────────────────────────────────────────────────────┐
│             CONTROLLED LAB SETUP: REAL HARDWARE (Pixel 7a & S25+)      │
│     Metro Server Stopped · Port 8081 Closed · Power-Saving Disabled    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌─────────────────────────────────┐   ┌──────────────────────────────────┐
│ PASS A: APP-LEVEL TELEMETRY     │   │ PASS B: NATIVE SYSTEM TRACING    │
│ • Overlay ON (Real-time HUD)    │   │ • Overlay OFF (Zero Observer Bias│
│ • 4 Scenarios (S1-S4), 3x runs  │   │ • ./capture-trace.sh S2 1        │
│ • Export session JSON           │   │ • 60-sec Perfetto System Trace   │
│ • node compare-captures.cjs     │   │ • analyze-trace.py & ui.perfetto │
└────────────────┬────────────────┘   └────────────────┬─────────────────┘
                 │                                     │
                 └──────────────────┬──────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      OBJECTIVE DATA FINDINGS                           │
│  1. Mount Bottleneck: 88–96% of first-load time happens BEFORE mount.  │
│  2. Thread Saturation: JS thread 95% busy; 94–96% of jank is JS-bound. │
│  3. Memory Truth: Process RSS 1.7GB vs Java Heap 48-115MB (Native/GPU).│
└───────────────────────────────────┬────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     PRIORITIZED REMEDIATION TICKETS                    │
│  • PLP-5198: Native/graphics memory optimization                       │
│  • PLP-5254: Break ParallelQuery → ProductList_Init waterfall          │
│  • PLP-5256: Offload JS rendering after filter response                │
│  • PLP-5258: Unburden JS thread during scroll & pagination             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Quantitative Evidence & Numbers

| Scenario / Observation | Lab Measurement (Galaxy S25+ / Pixel 7a) | Engineering Significance |
| :--- | :--- | :--- |
| **First Load (S1: Nav to First Display)** | 4,186 ms total vs. 44 ms from mount to products (**~99% pre-mount**) | Proved the delay was client navigation setup & API waterfall, not component render speed. |
| **Active Scroll (S2: Thread Saturation)** | JS Thread **~95% busy**; 94–96% of janky frames JS-bound | Definitively ruled out Android RenderThread / GPU bottlenecks; proved React Native bridge & JS re-renders were the culprit. |
| **Filter Response (S3: Facet Selection)** | 2.9s – 3.1s total (1.36s–1.58s network, **1.5s+ JS processing**) | Proved half of filter lag was post-response client data transformation and facet reconciliation. |
| **Memory Growth (S4: Long Session)** | Process RSS grew **1,410MB → 1,625MB → 1,760MB (+25%)** | Java heap was only **48–115MB**; proved memory leak was native bitmap buffers and texture caches, not retained JS/Java objects. |

---

## Interview Questions & Defense

- **Q: Why run Pass B with the performance overlay disabled?**
  - *Answer:* The Heisenberg effect in software performance. Rendering a live draggable HUD with continuous metric sampling introduces its own frame allocations and JS timer callbacks. Turning the overlay off ensures the Perfetto kernel trace reflects purely the product code under test.
- **Q: How did you know the memory bloat was graphics memory and not JavaScript memory leaks?**
  - *Answer:* We compared Android Studio heap dumps with Perfetto process memory mappings. The Java/V8 heap had a retained size of only 9–14MB, and total Java heap peaked at 115MB. However, `vm.rss` was 1.76GB. This pointed directly to the image decoding pipeline (`Fresco` / native bitmap pools) retaining uncompressed ARGB_8888 buffers in native RAM.
- **Q: How did you ensure repeated test runs were statistically valid?**
  - *Answer:* Created `compare-runs.py` which required a minimum of 3 runs per scenario, varied search keywords to avoid HTTP cache hits, computed medians instead of averages, and required a 60% agreement threshold across runs before classifying a thread as a "dominant culprit."
