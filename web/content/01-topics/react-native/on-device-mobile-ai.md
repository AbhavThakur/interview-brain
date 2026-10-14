# On-Device Mobile AI & Edge ML for React Native (2025–2026)

> **The Trend:** The industry is rapidly shifting from pure cloud API calls (OpenAI/Anthropic) to **On-Device AI and Edge Inference**. Companies prioritize local models for **zero latency, zero cloud inference cost, 100% offline functionality, and strict privacy compliance (HIPAA / GDPR)**.

---

## 1. The Mobile AI Stack

```
┌─────────────────────────────────────────────────────────────┐
│                 React Native Application Layer              │
│       React Hooks • Streaming Tokens • Worklet Callbacks    │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSI Direct C++ Pointers
┌──────────────────────────────┴──────────────────────────────┐
│        ExecuTorch / MediaPipe / ONNX Runtime Mobile         │
├──────────────────────────────┬──────────────────────────────┤
│          iOS Layer           │        Android Layer         │
│ • Apple Neural Engine (ANE)  │ • NPU Accelerators (Qualcomm)│
│ • CoreML / MLX Runtimes      │ • Vulkan / XNNPACK Shaders   │
│ • Metal Performance Shaders  │ • Android NNAPI              │
└──────────────────────────────┴──────────────────────────────┘
```

---

## 2. Core Frameworks to Know

### A. ExecuTorch (`react-native-executorch`)
* **What it is:** Meta’s official PyTorch edge runtime, maintained for React Native in partnership with **Software Mansion**.
* **How it works:** Compiles PyTorch models into `.pte` (PyTorch Exported) binaries optimized specifically for mobile hardware accelerators.
* **Capabilities:** Runs local SLMs (Small Language Models like **Llama 3.2 1B & 3B**), text embedding models, and audio classification directly in the app.
* **React Native API:** Provides hooks like `useLLM()` that emit token streams synchronously via JSI without choking the JS event loop.

### B. Google MediaPipe
* **What it is:** The gold standard for **real-time on-device computer vision and audio tasks**.
* **Key Use Cases:** Hand tracking, 468-point face mesh, pose estimation, object detection, and background segmentation.
* **React Native Integration:** Paired with `react-native-vision-camera` and **Frame Processors (Worklets)**. Video frames are intercepted at the native buffer level (YUV/RGBA), fed into C++ MediaPipe tasks, and rendered as real-time canvas overlays without passing bulky video frames across the JavaScript bridge.

### C. Hardware Acceleration Layers
* **iOS (Apple Neural Engine - ANE):** Dedicated silicon on A14+ and M-series chips offering up to 35+ TOPS (Trillion Operations Per Second) at near-zero battery drain.
* **Android (XNNPACK & Vulkan):** Fallback CPU matrix engines (XNNPACK) and GPU shader compute (Vulkan) for diverse Android chipsets (Snapdragon, MediaTek, Exynos).

---

## 3. The 3 Architectural Constraints Every Engineer Must Solve

### 1. The RAM & Low Memory Killer (LMK) Budget
* **The Problem:** An unquantized 7B model takes ~14 GB of RAM — guaranteed instant crash on mobile.
* **The Solution:** **4-bit and 8-bit Quantization (INT4 / INT8 / Q4_K_M)**.
  * *Llama 3.2 1B (INT4):* Consumes ~800 MB to 1.1 GB of RAM.
  * *Llama 3.2 3B (INT4):* Consumes ~2.2 GB to 2.5 GB of RAM.
* **Engineering Guardrail:** Always query `Platform.constants` or `DeviceInfo.getTotalMemory()` before downloading or instantiating a model. If a budget device has `< 4 GB RAM`, prevent downloading 3B models.

### 2. Thread Isolation (Zero UI Jank)
* **The Problem:** If token generation or tensor matrix multiplication runs on the JavaScript thread, all UI touch events and 120Hz scroll animations freeze completely.
* **The Solution:** Inference loops run in a detached native C++ background thread or a React Native Worklet. Generated tokens are pushed into a thread-safe ring buffer and dispatched to React state in batches (every 50–100ms) to prevent re-render cascades.

### 3. Hybrid Routing (Edge-First Architecture)
* **The Blueprint:**
  ```
  User Query ──► [On-Device SLM (Llama 3.2 1B)]
                        │
                  Can solve with high confidence?
                  ├── YES ──► Output instantly (<15ms latency, 0 cloud cost)
                  └── NO  ──► Delegate to Cloud Frontier LLM (Claude / GPT-4)
  ```
* **Why Companies Love This:** Cuts cloud LLM API bills by **60% to 80%** because 70% of routine app queries (formatting, autocompletion, local search, sentiment) do not require a massive cloud model.

---

## 4. Senior Interview Talking Points

#### Q: "How would you architect an AI feature in React Native that summarizes user documents while maintaining privacy and low latency?"
> *"I would adopt a hybrid, edge-first architecture using `react-native-executorch` with a 4-bit quantized Llama 3.2 1B model (`.pte` format). The document text is passed directly through JSI to the native model on a background C++ thread, keeping the UI at 60/120 FPS. On iOS, inference targets the Apple Neural Engine via CoreML, and on Android it utilizes Vulkan GPU acceleration. Because the document never leaves the device, it provides zero cloud API costs, works offline, and guarantees strict privacy compliance (HIPAA/GDPR). If the user asks for multi-document synthesis beyond the local context window, the app prompts for permission to route to a secure cloud endpoint."*

#### Q: "What are the trade-offs of running local computer vision (MediaPipe) in React Native?"
> *"The key challenge is frame pipeline latency. Passing raw image base64 strings or bitmaps over the React Native bridge causes severe memory pressure and GC pauses. The optimal pattern is using `react-native-vision-camera` with C++ Frame Processors (Worklets). The native camera buffer is accessed directly in C++, evaluated by MediaPipe's lightweight model in <10ms, and only high-level coordinate arrays (e.g., bounding boxes or landmark points) are reflected back into React state or Skia canvas."*
