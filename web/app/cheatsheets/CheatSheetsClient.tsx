'use client';

import { useState } from 'react';

type SheetTab = 'dsa-patterns' | 'js-event-loop' | 'react-perf' | 'system-design-numbers';

export default function CheatSheetsClient() {
  const [activeTab, setActiveTab] = useState<SheetTab>('dsa-patterns');

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
            Fast Recall
          </span>
          <span className="text-xs text-foreground/40 font-mono">
            Pre-Interview Quick Reference
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Interactive Cheat Sheets</h1>
        <p className="text-foreground/60 mt-1 max-w-2xl text-sm">
          High-density reference tables for 5-minute pre-interview warmups: algorithmic pattern recognition, JS engine order, React performance traps, and system sizing numbers.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('dsa-patterns')}
          className={`text-xs font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'dsa-patterns'
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'bg-white/5 text-foreground/70 hover:bg-white/10 hover:text-foreground'
          }`}
        >
          🧠 DSA Pattern Recognition Matrix
        </button>
        <button
          onClick={() => setActiveTab('js-event-loop')}
          className={`text-xs font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'js-event-loop'
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'bg-white/5 text-foreground/70 hover:bg-white/10 hover:text-foreground'
          }`}
        >
          ⚡ JavaScript Engine & Event Loop
        </button>
        <button
          onClick={() => setActiveTab('react-perf')}
          className={`text-xs font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'react-perf'
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'bg-white/5 text-foreground/70 hover:bg-white/10 hover:text-foreground'
          }`}
        >
          ⚛️ React & React Native Performance
        </button>
        <button
          onClick={() => setActiveTab('system-design-numbers')}
          className={`text-xs font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'system-design-numbers'
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'bg-white/5 text-foreground/70 hover:bg-white/10 hover:text-foreground'
          }`}
        >
          📐 System Design Numbers & Sizing
        </button>
      </div>

      {/* Sheet Content */}
      <div className="glass-card p-6 md:p-8">
        
        {/* TAB 1: DSA Pattern Recognition */}
        {activeTab === 'dsa-patterns' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-primary">DSA Pattern Recognition Matrix</h2>
              <p className="text-xs text-foreground/60 mt-1">
                How to immediately identify the optimal algorithmic approach from the problem statement keywords.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-foreground/40 uppercase font-semibold text-[10px] tracking-wider">
                    <th className="py-3 px-4">Problem Keyword / Characteristic</th>
                    <th className="py-3 px-4">Algorithmic Pattern</th>
                    <th className="py-3 px-4">Optimal Time / Space</th>
                    <th className="py-3 px-4">Key Trick / Mental Model</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-semibold text-foreground">Contiguous subarray with min/max sum/length or target condition</td>
                    <td className="py-3 px-4 text-primary font-medium">Sliding Window (Dynamic / Fixed)</td>
                    <td className="py-3 px-4 font-mono text-foreground/70">O(N) / O(1)</td>
                    <td className="py-3 px-4 text-foreground/80">Expand `right` pointer to include elements; shrink `left` pointer as soon as window violates invariant.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-semibold text-foreground">Sorted array + Pair searching / Palindrome / In-place partitioning</td>
                    <td className="py-3 px-4 text-primary font-medium">Two Pointers (Inward or Same-Direction)</td>
                    <td className="py-3 px-4 font-mono text-foreground/70">O(N) / O(1)</td>
                    <td className="py-3 px-4 text-foreground/80">If sum &lt; target, move left pointer right; if sum &gt; target, move right pointer left.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-semibold text-foreground">Find Top K largest/smallest elements in stream</td>
                    <td className="py-3 px-4 text-primary font-medium">Min-Heap of size K (or Max-Heap)</td>
                    <td className="py-3 px-4 font-mono text-foreground/70">O(N log K) / O(K)</td>
                    <td className="py-3 px-4 text-foreground/80">Maintain a Min-Heap of size K. When heap size &gt; K, pop the smallest element.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-semibold text-foreground">Cycle detection in Linked List or Array with limited numbers</td>
                    <td className="py-3 px-4 text-primary font-medium">Fast & Slow Pointers (Floyd&apos;s Cycle)</td>
                    <td className="py-3 px-4 font-mono text-foreground/70">O(N) / O(1)</td>
                    <td className="py-3 px-4 text-foreground/80">Slow pointer moves 1 step, fast pointer moves 2 steps. If they meet, cycle exists.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-semibold text-foreground">Next Greater Element / Daily Temperatures / Stock Span</td>
                    <td className="py-3 px-4 text-primary font-medium">Monotonic Stack (Decreasing / Increasing)</td>
                    <td className="py-3 px-4 font-mono text-foreground/70">O(N) / O(N)</td>
                    <td className="py-3 px-4 text-foreground/80">Push indices onto stack; pop elements whenever current value breaks monotonic order.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-semibold text-foreground">Find shortest path in unweighted graph / Level-by-level tree traversal</td>
                    <td className="py-3 px-4 text-primary font-medium">Breadth-First Search (BFS) with Queue</td>
                    <td className="py-3 px-4 font-mono text-foreground/70">O(V + E) / O(V)</td>
                    <td className="py-3 px-4 text-foreground/80">Queue with `visited` set. The first time you reach the target node is guaranteed to be shortest path.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-semibold text-foreground">Maximum/Minimum profit, subset sum, overlapping subproblems</td>
                    <td className="py-3 px-4 text-primary font-medium">Dynamic Programming (1D / 2D / Knapsack)</td>
                    <td className="py-3 px-4 font-mono text-foreground/70">O(N * W) / O(N)</td>
                    <td className="py-3 px-4 text-foreground/80">Define state: `dp[i]` = optimal answer for prefix `i`. Formulate transition and base case.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-semibold text-foreground">Generate all permutations / combinations / subsets / Sudoku</td>
                    <td className="py-3 px-4 text-primary font-medium">Backtracking with DFS</td>
                    <td className="py-3 px-4 font-mono text-foreground/70">O(2^N) or O(N!)</td>
                    <td className="py-3 px-4 text-foreground/80">Choice $\rightarrow$ Explore (recurse) $\rightarrow$ Un-choose (backtrack state).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: JS Engine & Event Loop */}
        {activeTab === 'js-event-loop' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-primary">JavaScript Engine & Event Loop Execution Order</h2>
              <p className="text-xs text-foreground/60 mt-1">
                The exact execution priority of synchronous code, microtasks, rendering, and macrotasks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-card p-4 border-l-4 border-l-green-400">
                <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider block">Priority 1 (Immediate)</span>
                <h3 className="font-bold text-sm mt-1">Synchronous Call Stack</h3>
                <p className="text-xs text-foreground/70 mt-2">
                  All synchronous JS code executes immediately on the main thread till the call stack is completely empty.
                </p>
                <code className="text-[11px] block mt-2 text-foreground/50 bg-black/30 p-1.5 rounded">
                  console.log(), for loop, fn()
                </code>
              </div>

              <div className="glass-card p-4 border-l-4 border-l-blue-400">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Priority 2 (High Priority)</span>
                <h3 className="font-bold text-sm mt-1">Microtask Queue</h3>
                <p className="text-xs text-foreground/70 mt-2">
                  Runs immediately after synchronous execution, draining ALL pending microtasks before moving on.
                </p>
                <code className="text-[11px] block mt-2 text-foreground/50 bg-black/30 p-1.5 rounded">
                  Promise.then(), queueMicrotask(), MutationObserver
                </code>
              </div>

              <div className="glass-card p-4 border-l-4 border-l-purple-400">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Priority 3 (Per Frame)</span>
                <h3 className="font-bold text-sm mt-1">Render / Animation</h3>
                <p className="text-xs text-foreground/70 mt-2">
                  Browser calculates layout, style, composite and runs frame callbacks (if time permits in the frame budget).
                </p>
                <code className="text-[11px] block mt-2 text-foreground/50 bg-black/30 p-1.5 rounded">
                  requestAnimationFrame(), Layout/Paint
                </code>
              </div>

              <div className="glass-card p-4 border-l-4 border-l-orange-400">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">Priority 4 (Background)</span>
                <h3 className="font-bold text-sm mt-1">Macrotask Queue</h3>
                <p className="text-xs text-foreground/70 mt-2">
                  Takes ONE macrotask from queue, executes it, then immediately checks if new microtasks were enqueued.
                </p>
                <code className="text-[11px] block mt-2 text-foreground/50 bg-black/30 p-1.5 rounded">
                  setTimeout(), setInterval(), setImmediate(), I/O
                </code>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-foreground mb-2">Classic Interview Quiz: Guess the output order</h4>
              <pre className="text-xs font-mono bg-black/40 p-3 rounded-lg text-primary-dark overflow-x-auto">
{`console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3')).then(() => console.log('4'));
queueMicrotask(() => console.log('5'));
console.log('6');

// OUTPUT ORDER:
// 1 -> 6 -> 3 -> 5 -> 4 -> 2`}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: React & RN Performance */}
        {activeTab === 'react-perf' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-primary">React 19 & React Native Performance Matrix</h2>
              <p className="text-xs text-foreground/60 mt-1">
                Common performance traps and their modern architectural remedies.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-foreground/40 uppercase font-semibold text-[10px] tracking-wider">
                    <th className="py-3 px-4">Performance Trap</th>
                    <th className="py-3 px-4">Why It Destroys Performance</th>
                    <th className="py-3 px-4">Senior Architectural Fix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-semibold text-red-400">Anonymous functions & object literals in JSX props</td>
                    <td className="py-3 px-4 text-foreground/70">Creates a new reference on every render, invalidating `React.memo` for all children.</td>
                    <td className="py-3 px-4 text-foreground/90">Use `useCallback`, `useMemo`, or pass primitive IDs and select data locally in the child.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-semibold text-red-400">Context API for high-frequency updates</td>
                    <td className="py-3 px-4 text-foreground/70">Any update in React Context triggers re-renders across all consuming components, even if they only care about 1 property.</td>
                    <td className="py-3 px-4 text-foreground/90">Split Context into granular slices or use selector-based state managers (Zustand, Jotai).</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-semibold text-red-400">React Native JS Thread Gestures</td>
                    <td className="py-3 px-4 text-foreground/70">Sending 120 touch events per second across the asynchronous bridge drops frames during heavy JS computation.</td>
                    <td className="py-3 px-4 text-foreground/90">Use `react-native-reanimated` with `useAnimatedStyle` running synchronous worklets on the UI Thread.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-semibold text-red-400">Unbounded List Rendering</td>
                    <td className="py-3 px-4 text-foreground/70">Mapping 500 items in a ScrollView instantiates hundreds of native views, exhausting RAM and freezing layout engine.</td>
                    <td className="py-3 px-4 text-foreground/90">Use `@shopify/flash-list` with `estimatedItemSize` for native cell recycling.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: System Design Numbers */}
        {activeTab === 'system-design-numbers' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-primary">System Design Numbers & Back-of-the-Envelope Math</h2>
              <p className="text-xs text-foreground/60 mt-1">
                Standard latency numbers and sizing formulas every engineer should quote during architecture rounds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Latency Table */}
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Latency Numbers Every Programmer Must Know</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-foreground/70">L1 CPU Cache Reference</span>
                    <span className="font-mono text-green-400">0.5 ns</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-foreground/70">L2 CPU Cache Reference</span>
                    <span className="font-mono text-green-400">7 ns</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-foreground/70">Main RAM Memory Reference</span>
                    <span className="font-mono text-green-400">100 ns</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-foreground/70">Read 1 MB sequentially from Memory</span>
                    <span className="font-mono text-blue-400">3,000 ns (3 µs)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-foreground/70">SSD Random Read</span>
                    <span className="font-mono text-blue-400">150 µs</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-foreground/70">Same-Datacenter Network Roundtrip</span>
                    <span className="font-mono text-yellow-400">500 µs (0.5 ms)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-foreground/70">HDD Seek (Magnetic Disk)</span>
                    <span className="font-mono text-orange-400">10 ms</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-foreground/70">Transatlantic Network RTT (US to Europe)</span>
                    <span className="font-mono text-red-400">150 ms</span>
                  </div>
                </div>
              </div>

              {/* Sizing Rules of Thumb */}
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Capacity & QPS Rules of Thumb</h3>
                <div className="space-y-3 text-xs text-foreground/80 leading-relaxed">
                  <div className="bg-black/30 p-2.5 rounded-lg">
                    <strong className="text-primary block">Daily Requests to QPS Conversion:</strong>
                    <p className="text-[11px] text-foreground/60 mt-1">
                      1 Day = 86,400 seconds $\approx 100,000$ seconds (for mental math).
                      <br />• 1 Million requests/day $\approx$ <strong>12 QPS</strong>
                      <br />• 100 Million requests/day $\approx$ <strong>1,200 QPS</strong> (Peak: $\sim$3,000 QPS)
                    </p>
                  </div>

                  <div className="bg-black/30 p-2.5 rounded-lg">
                    <strong className="text-primary block">Storage Sizing Rule:</strong>
                    <p className="text-[11px] text-foreground/60 mt-1">
                      • 100M active users $\times$ 1 KB profile = <strong>100 GB</strong> (fits in RAM of a single Redis instance).
                      <br />• 10M chat messages/day $\times$ 2 KB = <strong>20 GB/day</strong> $\rightarrow$ 7.3 TB/year.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
