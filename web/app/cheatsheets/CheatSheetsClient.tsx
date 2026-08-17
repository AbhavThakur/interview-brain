'use client';

import { useState } from 'react';

type SheetTab = 'dsa-patterns' | 'corner-cases' | 'lld-design-patterns' | 'js-event-loop' | 'react-perf' | 'system-design-numbers';

interface SheetNavOption {
  id: SheetTab;
  title: string;
  emoji: string;
  subtitle: string;
  category: string;
}

const SHEET_OPTIONS: SheetNavOption[] = [
  {
    id: 'dsa-patterns',
    title: 'DSA Pattern Matrix',
    emoji: '🧠',
    subtitle: 'Keyword to optimal algorithm mapping',
    category: 'Algorithms'
  },
  {
    id: 'corner-cases',
    title: 'Corner Cases & Blunders',
    emoji: '⚠️',
    subtitle: 'Defensive checks for all data structures',
    category: 'Algorithms'
  },
  {
    id: 'lld-design-patterns',
    title: 'LLD & Design Patterns',
    emoji: '🏛️',
    subtitle: 'Strategy, Observer, Factory & SOLID',
    category: 'Architecture'
  },
  {
    id: 'js-event-loop',
    title: 'JS Engine & Event Loop',
    emoji: '⚡',
    subtitle: 'Microtasks vs Render vs Macrotasks',
    category: 'Web & JS'
  },
  {
    id: 'react-perf',
    title: 'React & RN Performance',
    emoji: '⚛️',
    subtitle: 'Memoization, Context & FlashList',
    category: 'Web & JS'
  },
  {
    id: 'system-design-numbers',
    title: 'System Design Math',
    emoji: '📐',
    subtitle: 'Latency numbers & QPS sizing formulas',
    category: 'Architecture'
  }
];

export default function CheatSheetsClient() {
  const [activeTab, setActiveTab] = useState<SheetTab>('dsa-patterns');

  const currentSheet = SHEET_OPTIONS.find(s => s.id === activeTab) || SHEET_OPTIONS[0];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
            Fast Recall
          </span>
          <span className="text-xs text-foreground/40 font-mono">
            Pre-Interview Quick Reference Docs
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Interactive Cheat Sheets & Cheatsheet Docs</h1>
        <p className="text-foreground/60 mt-1 max-w-2xl text-sm">
          High-density reference tables for 5-minute pre-interview warmups: algorithmic pattern recognition, corner case checklists, LLD design patterns, JS engine mechanics, React performance traps, and system sizing numbers.
        </p>
      </div>

      {/* Mobile / Tablet Tab Bar (Wraps cleanly without cropping) */}
      <div className="lg:hidden flex flex-wrap items-center gap-2">
        {SHEET_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setActiveTab(opt.id)}
            className={`text-xs font-semibold px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === opt.id
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-white/5 text-foreground/70 hover:bg-white/10 hover:text-foreground'
            }`}
          >
            <span>{opt.emoji}</span>
            <span>{opt.title}</span>
          </button>
        ))}
      </div>

      {/* Main Layout with Sticky Left Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sticky Desktop Left Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 border-r border-white/5">
          <div className="flex flex-col gap-6">
            
            <div>
              <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-3">
                Cheat Sheet Modules
              </h3>
              
              <nav className="flex flex-col gap-2">
                {SHEET_OPTIONS.map((opt) => {
                  const isActive = activeTab === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setActiveTab(opt.id)}
                      className={`text-left p-3 rounded-xl border transition-all flex items-start gap-3 group ${
                        isActive
                          ? 'bg-primary/15 border-primary/40 text-white shadow-md'
                          : 'bg-white/[0.02] border-white/5 text-foreground/70 hover:bg-white/5 hover:text-foreground hover:border-white/10'
                      }`}
                    >
                      <span className="text-lg shrink-0 mt-0.5">{opt.emoji}</span>
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold ${isActive ? 'text-primary' : 'text-foreground group-hover:text-primary transition-colors'}`}>
                          {opt.title}
                        </span>
                        <span className="text-[11px] text-foreground/50 leading-tight mt-0.5">
                          {opt.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Fast Tips Card in Sidebar */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-foreground/60 space-y-2">
              <span className="font-bold text-foreground block text-[11px] uppercase tracking-wider text-primary">
                ⚡ Interview Tip
              </span>
              <p className="text-[11px] leading-relaxed">
                Spend 2 mins before every coding problem checking the <strong>Corner Cases Checklist</strong> to prevent preventable bug deductions.
              </p>
            </div>

          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3 flex flex-col gap-6">
          
          <div className="glass-card p-6 md:p-8">
            
            {/* TAB 1: DSA Pattern Recognition */}
            {activeTab === 'dsa-patterns' && (
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🧠</span>
                    <h2 className="text-xl font-bold text-primary">DSA Pattern Recognition Matrix</h2>
                  </div>
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
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: Corner Cases & Defensive Checklist */}
            {activeTab === 'corner-cases' && (
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    <h2 className="text-xl font-bold text-yellow-400">Algorithmic Corner Cases & Defensive Checklist</h2>
                  </div>
                  <p className="text-xs text-foreground/60 mt-1">
                    Top edge cases to test out loud during live coding before submitting your final solution.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Array & Strings */}
                  <div className="glass-card p-5 border-l-4 border-l-cyan-400 flex flex-col gap-2">
                    <h3 className="font-bold text-sm text-cyan-300">📦 Arrays & Strings</h3>
                    <ul className="text-xs text-foreground/80 space-y-1.5 list-disc list-inside">
                      <li><strong>Empty Array / Null:</strong> <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">nums.length === 0</code> or empty string <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">&quot;&quot;</code>.</li>
                      <li><strong>Single Element:</strong> Array with 1 item (e.g. <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">[1]</code>), string with 1 char.</li>
                      <li><strong>Two Elements:</strong> Minimum required for two-pointer or interval overlaps.</li>
                      <li><strong>All Duplicates:</strong> Array with identical elements (e.g. <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">[1, 1, 1, 1]</code>).</li>
                      <li><strong>Negative & Zero Values:</strong> Subarray products, target sums, and division operations.</li>
                      <li><strong>String Whitespaces & Cases:</strong> Leading/trailing spaces, non-alphanumeric chars, uppercase vs lowercase.</li>
                    </ul>
                  </div>

                  {/* Linked Lists */}
                  <div className="glass-card p-5 border-l-4 border-l-purple-400 flex flex-col gap-2">
                    <h3 className="font-bold text-sm text-purple-300">🔗 Linked Lists</h3>
                    <ul className="text-xs text-foreground/80 space-y-1.5 list-disc list-inside">
                      <li><strong>Empty List:</strong> <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">head === null</code>.</li>
                      <li><strong>Single Node List:</strong> <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">head.next === null</code>.</li>
                      <li><strong>Two Nodes List:</strong> Swap pairs, reverse operations.</li>
                      <li><strong>Cycles in List:</strong> Circular reference causing infinite while loops (use fast/slow pointers).</li>
                      <li><strong>Odd vs Even Length:</strong> Finding middle element behavior (<code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">fast !== null &amp;&amp; fast.next !== null</code>).</li>
                      <li><strong>Modifying Head:</strong> Always use a <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">dummyHead</code> when insertion/deletion might alter head.</li>
                    </ul>
                  </div>

                  {/* Binary Trees */}
                  <div className="glass-card p-5 border-l-4 border-l-emerald-400 flex flex-col gap-2">
                    <h3 className="font-bold text-sm text-emerald-300">🌲 Binary Trees & BSTs</h3>
                    <ul className="text-xs text-foreground/80 space-y-1.5 list-disc list-inside">
                      <li><strong>Empty Tree:</strong> <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">root === null</code>.</li>
                      <li><strong>Single Root Node:</strong> No left or right children (both null).</li>
                      <li><strong>Skewed Tree:</strong> Tree degenerates into linked list (all nodes only have right or only left child $\rightarrow$ stack overflow risk).</li>
                      <li><strong>BST Validation:</strong> Subtree values violating ancestor boundaries (carry min/max bounds in recursion).</li>
                      <li><strong>Negative Node Values:</strong> Initializing max path sum to 0 instead of <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">-Infinity</code>.</li>
                    </ul>
                  </div>

                  {/* Graphs & Matrix */}
                  <div className="glass-card p-5 border-l-4 border-l-orange-400 flex flex-col gap-2">
                    <h3 className="font-bold text-sm text-orange-300">🕸️ Graphs & Grid Matrix</h3>
                    <ul className="text-xs text-foreground/80 space-y-1.5 list-disc list-inside">
                      <li><strong>Disconnected Graph:</strong> Multiple isolated components (loop over all vertices 0 to V-1).</li>
                      <li><strong>Cycles in Directed Graph:</strong> Infinite recursion during DFS without 3-state visited tracking.</li>
                      <li><strong>1x1 Matrix / 1xN Matrix:</strong> Single row or single column boundary cases.</li>
                      <li><strong>Start Equals Target:</strong> Flood fill when starting color is already equal to target color.</li>
                      <li><strong>Self-Loops:</strong> Vertex connected directly to itself.</li>
                    </ul>
                  </div>

                  {/* Dynamic Programming & Math */}
                  <div className="glass-card p-5 border-l-4 border-l-red-400 flex flex-col gap-2">
                    <h3 className="font-bold text-sm text-red-300">🔢 Dynamic Programming & Math</h3>
                    <ul className="text-xs text-foreground/80 space-y-1.5 list-disc list-inside">
                      <li><strong>Target is Zero:</strong> Coin change or subset sum with target 0 (base case <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">dp[0] = 0</code> or <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">dp[0] = 1</code>).</li>
                      <li><strong>Integer Overflow:</strong> Sum or product exceeding 32-bit signed integer (<code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">2^31 - 1 = 2147483647</code>).</li>
                      <li><strong>Midpoint Calculation:</strong> Use <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">low + Math.floor((high - low) / 2)</code> instead of <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">(low + high) / 2</code>.</li>
                      <li><strong>Division by Zero:</strong> Checking denominator before modulo or division operations.</li>
                    </ul>
                  </div>

                  {/* Intervals & Heaps */}
                  <div className="glass-card p-5 border-l-4 border-l-yellow-400 flex flex-col gap-2">
                    <h3 className="font-bold text-sm text-yellow-300">⏳ Intervals & Heaps</h3>
                    <ul className="text-xs text-foreground/80 space-y-1.5 list-disc list-inside">
                      <li><strong>Touching Intervals:</strong> Intervals that touch at boundary (e.g. <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">[1, 2]</code> and <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">[2, 3]</code> $\rightarrow$ check if <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">&lt;=</code> or <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">&lt;</code>).</li>
                      <li><strong>Completely Enclosed Interval:</strong> One interval inside another (e.g. <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">[1, 10]</code> and <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">[3, 5]</code>).</li>
                      <li><strong>K Greater than Array Length:</strong> Finding Top K elements when <code className="text-[11px] bg-white/5 px-1 py-0.5 rounded">K &gt; nums.length</code>.</li>
                      <li><strong>Empty Heap Operations:</strong> Popping or peeking an empty priority queue.</li>
                    </ul>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 3: LLD & Design Patterns */}
            {activeTab === 'lld-design-patterns' && (
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏛️</span>
                    <h2 className="text-xl font-bold text-primary">Low-Level Design (LLD) & GoF Patterns Quick Matrix</h2>
                  </div>
                  <p className="text-xs text-foreground/60 mt-1">
                    Classic Gang of Four design patterns and their real-world machine coding applications.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02] text-foreground/40 uppercase font-semibold text-[10px] tracking-wider">
                        <th className="py-3 px-4">Design Pattern</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">When to Apply</th>
                        <th className="py-3 px-4">Real-World Interview Example</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-bold text-foreground">Strategy Pattern</td>
                        <td className="py-3 px-4 text-blue-400 font-mono">Behavioral</td>
                        <td className="py-3 px-4 text-foreground/80">Interchangeable algorithms selected at runtime without `if/else` ladders.</td>
                        <td className="py-3 px-4 text-primary font-medium">Payment gateways (Stripe, PayPal, UPI) / Pricing surge algorithms in ride-sharing.</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-bold text-foreground">Observer / Pub-Sub</td>
                        <td className="py-3 px-4 text-blue-400 font-mono">Behavioral</td>
                        <td className="py-3 px-4 text-foreground/80">1-to-many dependency; notifying multiple components when state changes.</td>
                        <td className="py-3 px-4 text-primary font-medium">EventEmitter in Node.js / Stock price ticker subscribers / React state stores.</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-bold text-foreground">Factory Method</td>
                        <td className="py-3 px-4 text-green-400 font-mono">Creational</td>
                        <td className="py-3 px-4 text-foreground/80">Decoupling object instantiation from business logic.</td>
                        <td className="py-3 px-4 text-primary font-medium">Vehicle factory in Parking Lot / Document parser factory (PDF, CSV, Word).</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-bold text-foreground">Decorator Pattern</td>
                        <td className="py-3 px-4 text-purple-400 font-mono">Structural</td>
                        <td className="py-3 px-4 text-foreground/80">Adding behaviors to objects dynamically without modifying existing classes.</td>
                        <td className="py-3 px-4 text-primary font-medium">API request wrappers with Retry, Logging, and Rate Limiting middleware.</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-bold text-foreground">State Pattern</td>
                        <td className="py-3 px-4 text-blue-400 font-mono">Behavioral</td>
                        <td className="py-3 px-4 text-foreground/80">Object alters its behavior when its internal state changes (Finite State Machine).</td>
                        <td className="py-3 px-4 text-primary font-medium">Vending Machine state (NoCoin $\rightarrow$ HasCoin $\rightarrow$ Dispensing $\rightarrow$ SoldOut) / Order lifecycle.</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-bold text-foreground">Adapter Pattern</td>
                        <td className="py-3 px-4 text-purple-400 font-mono">Structural</td>
                        <td className="py-3 px-4 text-foreground/80">Converting the interface of a legacy/third-party class into another expected interface.</td>
                        <td className="py-3 px-4 text-primary font-medium">Integrating external SMS/Payment SDKs with incompatible payload signatures.</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-bold text-foreground">Singleton</td>
                        <td className="py-3 px-4 text-green-400 font-mono">Creational</td>
                        <td className="py-3 px-4 text-foreground/80">Ensuring a class has only one instance and a global access point.</td>
                        <td className="py-3 px-4 text-primary font-medium">Database connection pool manager / Global configuration registry.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: JS Engine & Event Loop */}
            {activeTab === 'js-event-loop' && (
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <h2 className="text-xl font-bold text-primary">JavaScript Engine & Event Loop Execution Order</h2>
                  </div>
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

            {/* TAB 5: React & RN Performance */}
            {activeTab === 'react-perf' && (
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚛️</span>
                    <h2 className="text-xl font-bold text-primary">React 19 & React Native Performance Matrix</h2>
                  </div>
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

            {/* TAB 6: System Design Numbers */}
            {activeTab === 'system-design-numbers' && (
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📐</span>
                    <h2 className="text-xl font-bold text-primary">System Design Numbers & Back-of-the-Envelope Math</h2>
                  </div>
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

        </main>

      </div>

    </div>
  );
}
