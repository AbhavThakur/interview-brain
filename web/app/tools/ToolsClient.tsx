"use client";

import { useState, useMemo } from "react";

// Latency Hierarchy Dataset
const LATENCY_ITEMS = [
  {
    name: "L1 Cache Reference",
    timeNs: 0.5,
    raw: "0.5 ns",
    human: "1 sec",
    category: "CPU / Hardware",
    desc: "Fastest memory on chip, 32-64 KB per core",
  },
  {
    name: "Branch Mispredict",
    timeNs: 5,
    raw: "5 ns",
    human: "10 sec",
    category: "CPU / Hardware",
    desc: "CPU pipeline flush after conditional jump miss",
  },
  {
    name: "L2 Cache Reference",
    timeNs: 7,
    raw: "7 ns",
    human: "14 sec",
    category: "CPU / Hardware",
    desc: "Larger on-die cache, 256 KB - 1 MB",
  },
  {
    name: "Mutex Lock / Unlock",
    timeNs: 25,
    raw: "25 ns",
    human: "50 sec",
    category: "Concurrency",
    desc: "OS thread synchronization primitive",
  },
  {
    name: "Main Memory (RAM) Reference",
    timeNs: 100,
    raw: "100 ns",
    human: "3.3 mins",
    category: "Memory",
    desc: "DRAM fetch over memory bus",
  },
  {
    name: "Compress 1KB with Snappy",
    timeNs: 2000,
    raw: "2,000 ns (2 µs)",
    human: "1.1 hours",
    category: "Compute",
    desc: "Lightweight CPU compression algorithm",
  },
  {
    name: "Send 1KB over 1 Gbps Network",
    timeNs: 10000,
    raw: "10,000 ns (10 µs)",
    human: "5.5 hours",
    category: "Network",
    desc: "Local rack top-of-rack Ethernet switch",
  },
  {
    name: "Read 1MB Sequentially from Memory",
    timeNs: 250000,
    raw: "250,000 ns (250 µs)",
    human: "5.8 days",
    category: "Memory",
    desc: "High-bandwidth sequential DRAM burst",
  },
  {
    name: "SSD Random Read (NVMe)",
    timeNs: 150000,
    raw: "150,000 ns (150 µs)",
    human: "3.5 days",
    category: "Storage",
    desc: "Flash page read without mechanical seek",
  },
  {
    name: "Datacenter Roundtrip Ping",
    timeNs: 500000,
    raw: "500,000 ns (0.5 ms)",
    human: "1.9 weeks",
    category: "Network",
    desc: "Intra-region AWS/GCP availability zone ping",
  },
  {
    name: "Read 1MB Sequentially from SSD",
    timeNs: 1000000,
    raw: "1,000,000 ns (1 ms)",
    human: "3.8 weeks",
    category: "Storage",
    desc: "Sequential flash streaming (~1 GB/s)",
  },
  {
    name: "HDD Mechanical Disk Seek",
    timeNs: 10000000,
    raw: "10,000,000 ns (10 ms)",
    human: "9 months",
    category: "Storage",
    desc: "Physical actuator arm seek to cylinder",
  },
  {
    name: "Cross-Continental Ping (SF -> NYC)",
    timeNs: 40000000,
    raw: "40,000,000 ns (40 ms)",
    human: "3.1 years",
    category: "Network",
    desc: "Speed of light in fiber optic glass (~3,000 miles)",
  },
  {
    name: "Trans-Atlantic Ping (SF -> London)",
    timeNs: 150000000,
    raw: "150,000,000 ns (150 ms)",
    human: "11.8 years",
    category: "Network",
    desc: "Subsea cable WAN round-trip",
  },
];

const CURATED_SANDBOXES = [
  {
    name: "drawDB",
    badge: "SQL & Schema ERD",
    emoji: "🗄️",
    desc: "Interactive database diagram editor with instant SQL DDL export (PostgreSQL, MySQL, SQLite).",
    url: "https://www.drawdb.app/",
    gradient: "from-blue-500/20 to-cyan-500/20",
    tags: ["Schema", "ERD", "SQL", "LLD"],
  },
  {
    name: "Algorithm Visualizer",
    badge: "Code Execution",
    emoji: "⚡",
    desc: "Interactive platform tracing code execution with animated recursion trees, graphs, and DP tables.",
    url: "https://algorithm-visualizer.org/",
    gradient: "from-amber-500/20 to-orange-500/20",
    tags: ["Algorithms", "Code", "Step-by-Step"],
  },
  {
    name: "VisuAlgo",
    badge: "Trees & Graphs",
    emoji: "🌳",
    desc: "Animated visualizations for BST, AVL, Segment Trees, Union-Find, Max Flow, and Dijkstra.",
    url: "https://visualgo.net/",
    gradient: "from-emerald-500/20 to-teal-500/20",
    tags: ["Trees", "Graphs", "Rotations"],
  },
  {
    name: "Python Tutor",
    badge: "Memory & Stack",
    emoji: "🧠",
    desc: "Visualizes pointer manipulation, recursion call stacks, and heap memory line-by-line.",
    url: "https://pythontutor.com/",
    gradient: "from-indigo-500/20 to-purple-500/20",
    tags: ["Memory", "Stack Frames", "Pointers"],
  },
  {
    name: "Excalidraw",
    badge: "System Design Canvas",
    emoji: "🎨",
    desc: "The industry-standard virtual whiteboard for live FAANG architectural system design rounds.",
    url: "https://excalidraw.com/",
    gradient: "from-pink-500/20 to-rose-500/20",
    tags: ["Whiteboard", "HLD", "Architecture"],
  },
  {
    name: "Mermaid Live",
    badge: "Markdown Diagrams",
    emoji: "📐",
    desc: "Render professional system architecture, sequence diagrams, and flowcharts from plain markdown.",
    url: "https://mermaid.live/",
    gradient: "from-purple-500/20 to-blue-500/20",
    tags: ["Sequence", "State", "Markdown"],
  },
  {
    name: "Regex101",
    badge: "Regex Debugger",
    emoji: "🔍",
    desc: "Real-time regular expression tester with syntax breakdown and catastrophic backtracking warnings.",
    url: "https://regex101.com/",
    gradient: "from-red-500/20 to-orange-500/20",
    tags: ["Regex", "Parsing", "String Matching"],
  },
  {
    name: "IT-Tools",
    badge: "Dev Swiss Knife",
    emoji: "🛠️",
    desc: "Client-side JWT inspector, UUID generator, SQL formatter, text diffs, and hash workbench.",
    url: "https://it-tools.tech/",
    gradient: "from-sky-500/20 to-indigo-500/20",
    tags: ["JWT", "Diff", "Hash", "UUID"],
  },
  {
    name: "SQLBolt",
    badge: "Interactive SQL",
    emoji: "📊",
    desc: "Interactive step-by-step SQL tutorials with in-browser query execution and immediate feedback.",
    url: "https://sqlbolt.com/",
    gradient: "from-teal-500/20 to-emerald-500/20",
    tags: ["SQL", "Queries", "Joins"],
  },
  {
    name: "Learn Git Branching",
    badge: "Visual Git",
    emoji: "🌿",
    desc: "Gamified sandbox for mastering Git rebasing, cherry-picking, HEAD pointers, and merge strategies.",
    url: "https://learngitbranching.js.org/",
    gradient: "from-green-500/20 to-lime-500/20",
    tags: ["Git", "Rebase", "Branching"],
  },
  {
    name: "DevDocs.io",
    badge: "Fast API Docs",
    emoji: "📖",
    desc: "Offline-capable unified documentation search combining 100+ API reference manuals in one fast UI.",
    url: "https://devdocs.io/",
    gradient: "from-cyan-500/20 to-blue-500/20",
    tags: ["Documentation", "API", "Offline"],
  },
  {
    name: "CyberChef",
    badge: "Cyber Workbench",
    emoji: "🔐",
    desc: "In-browser workbench for encoding, decoding, hashing, crypto, and complex data pipeline recipes.",
    url: "https://gchq.github.io/CyberChef/",
    gradient: "from-violet-500/20 to-purple-500/20",
    tags: ["Crypto", "Base64", "Hashing"],
  },
];

export default function ToolsClient() {
  const [activeTab, setActiveTab] = useState<
    "estimator" | "latency" | "utilities" | "sandboxes"
  >("estimator");

  // Estimator State
  const [dau, setDau] = useState<number>(50); // in millions
  const [readsPerUser, setReadsPerUser] = useState<number>(20);
  const [writesPerUser, setWritesPerUser] = useState<number>(2);
  const [readPayloadKb, setReadPayloadKb] = useState<number>(2);
  const [writePayloadKb, setWritePayloadKb] = useState<number>(10);
  const [peakMultiplier, setPeakMultiplier] = useState<number>(2);
  const [retentionYears, setRetentionYears] = useState<number>(5);
  const [replicationFactor, setReplicationFactor] = useState<number>(3);

  // Computed Estimator Metrics
  const estimatorMetrics = useMemo(() => {
    const totalUsers = dau * 1_000_000;
    const SECONDS_PER_DAY = 86400;

    // QPS
    const dailyReads = totalUsers * readsPerUser;
    const avgReadQps = Math.round(dailyReads / SECONDS_PER_DAY);
    const peakReadQps = avgReadQps * peakMultiplier;

    const dailyWrites = totalUsers * writesPerUser;
    const avgWriteQps = Math.round(dailyWrites / SECONDS_PER_DAY);
    const peakWriteQps = avgWriteQps * peakMultiplier;

    // Storage
    const dailyWriteBytes = dailyWrites * writePayloadKb * 1024;
    const dailyStorageGb = dailyWriteBytes / (1024 * 1024 * 1024);
    const yearlyStorageTb = (dailyStorageGb * 365) / 1024;
    const multiYearRawStorageTb = yearlyStorageTb * retentionYears;
    const multiYearReplicatedStorageTb =
      multiYearRawStorageTb * replicationFactor;

    // Bandwidth
    const incomingBytesPerSec =
      (dailyWriteBytes / SECONDS_PER_DAY) * peakMultiplier;
    const incomingMbps = (incomingBytesPerSec * 8) / (1000 * 1000);

    const outgoingBytesPerSec =
      ((dailyReads * readPayloadKb * 1024) / SECONDS_PER_DAY) * peakMultiplier;
    const outgoingMbps = (outgoingBytesPerSec * 8) / (1000 * 1000);

    // RAM / Cache (80/20 Rule: 20% of daily read volume cached)
    const dailyReadVolumeGb = (dailyReads * readPayloadKb) / (1024 * 1024);
    const recommendedCacheGb = dailyReadVolumeGb * 0.2;

    return {
      avgReadQps,
      peakReadQps,
      avgWriteQps,
      peakWriteQps,
      dailyStorageGb: dailyStorageGb.toFixed(1),
      yearlyStorageTb: yearlyStorageTb.toFixed(1),
      multiYearStorageTb: multiYearReplicatedStorageTb.toFixed(1),
      incomingMbps: incomingMbps.toFixed(1),
      outgoingMbps: outgoingMbps.toFixed(1),
      recommendedCacheGb: recommendedCacheGb.toFixed(1),
    };
  }, [
    dau,
    readsPerUser,
    writesPerUser,
    readPayloadKb,
    writePayloadKb,
    peakMultiplier,
    retentionYears,
    replicationFactor,
  ]);

  // Client-Side Utilities State
  const [utilType, setUtilType] = useState<"base64" | "jwt" | "json" | "cron">(
    "base64",
  );
  const [base64Input, setBase64Input] = useState<string>(
    "Hello Interview Brain! 🚀",
  );
  const [base64Output, setBase64Output] = useState<string>("");
  const [base64Mode, setBase64Mode] = useState<"encode" | "decode">("encode");

  const [jwtInput, setJwtInput] = useState<string>(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkNhbmRpZGF0ZSIsInJvbGUiOiJTZW5pb3IgU0RFIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  );
  const [jwtDecoded, setJwtDecoded] = useState<{
    header: unknown;
    payload: unknown;
  } | null>(null);
  const [jwtError, setJwtError] = useState<string>("");

  const [jsonInput, setJsonInput] = useState<string>(
    '{"service":"payment-gateway","qps":4500,"shards":[1,2,3],"active":true}',
  );
  const [jsonFormatted, setJsonFormatted] = useState<string>("");
  const [jsonError, setJsonError] = useState<string>("");

  const [cronExpression, setCronExpression] = useState<string>("*/15 * * * *");

  // Base64 Handler
  const handleBase64Transform = (val: string, mode: "encode" | "decode") => {
    try {
      if (mode === "encode") {
        setBase64Output(btoa(val));
      } else {
        setBase64Output(atob(val));
      }
    } catch {
      setBase64Output("Error: Invalid string for decoding");
    }
  };

  // JWT Decoder Handler
  const handleJwtDecode = (token: string) => {
    setJwtError("");
    try {
      const parts = token.trim().split(".");
      if (parts.length < 2) {
        setJwtError("Invalid JWT format (expected header.payload.signature)");
        setJwtDecoded(null);
        return;
      }
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      setJwtDecoded({ header, payload });
    } catch {
      setJwtError("Failed to parse JWT header or payload");
      setJwtDecoded(null);
    }
  };

  // JSON Formatter Handler
  const handleJsonFormat = (val: string) => {
    setJsonError("");
    try {
      const parsed = JSON.parse(val);
      setJsonFormatted(JSON.stringify(parsed, null, 2));
    } catch (e: unknown) {
      setJsonError(e instanceof Error ? e.message : "Invalid JSON");
      setJsonFormatted("");
    }
  };

  // Humanize Cron
  const cronDescription = useMemo(() => {
    const p = cronExpression.trim().split(/\s+/);
    if (p.length !== 5)
      return "Invalid 5-part cron syntax (minute hour day-of-month month day-of-week)";
    if (cronExpression === "* * * * *")
      return "Runs every minute (60 times an hour)";
    if (cronExpression === "*/5 * * * *") return "Runs every 5 minutes";
    if (cronExpression === "*/15 * * * *") return "Runs every 15 minutes";
    if (cronExpression === "0 * * * *") return "Runs at minute 0 of every hour";
    if (cronExpression === "0 0 * * *")
      return "Runs every day at midnight (00:00)";
    if (cronExpression === "0 12 * * *")
      return "Runs every day at noon (12:00)";
    if (cronExpression === "0 0 * * 0") return "Runs every Sunday at midnight";
    if (cronExpression === "0 0 1 * *")
      return "Runs at midnight on the 1st of every month";
    return `Custom schedule: Min [${p[0]}], Hour [${p[1]}], Day [${p[2]}], Month [${p[3]}], DayOfWeek [${p[4]}]`;
  }, [cronExpression]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
              <span>⚡</span> 100% Free · No Sign Up
            </span>
            <span className="text-xs text-foreground/40 font-mono">
              Zero-Friction Developer Suite
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            In-Browser Developer Tools & Sandboxes
          </h1>
          <p className="text-foreground/60 mt-1 max-w-2xl text-sm">
            Interactive system design capacity calculators, latency hierarchy
            visualizers, client-side data workbenches, and curated instant
            sandboxes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/10 shrink-0 flex-wrap gap-1">
          <button
            onClick={() => setActiveTab("estimator")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "estimator"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <span>📐</span> Capacity Estimator
          </button>
          <button
            onClick={() => setActiveTab("latency")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "latency"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <span>⏱️</span> Latency Hierarchy
          </button>
          <button
            onClick={() => setActiveTab("utilities")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "utilities"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <span>🛠️</span> Private Utilities
          </button>
          <button
            onClick={() => setActiveTab("sandboxes")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "sandboxes"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <span>🚀</span> Instant Sandboxes
          </button>
        </div>
      </div>

      {/* 1. System Design Back-of-the-Envelope Estimator */}
      {activeTab === "estimator" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          {/* Top Explainer */}
          <div className="glass-card p-6 bg-primary/5 border-primary/20">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <span>📐</span> System Design Capacity Planning Formula
            </h2>
            <p className="text-xs text-foreground/70 mt-1">
              Every FAANG System Design round (Twitter, WhatsApp, TinyURL, Uber)
              requires instant back-of-the-envelope calculations. Adjust the
              parameters below to dynamically size QPS, storage clusters,
              bandwidth pipes, and Redis cache sizing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls (5 Cols) */}
            <div className="lg:col-span-5 glass-card p-6 flex flex-col gap-5">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                1. System Scale Parameters
              </h3>

              {/* DAU */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-foreground/80 font-medium">
                    Daily Active Users (DAU)
                  </span>
                  <span className="font-mono font-bold text-primary">
                    {dau} Million
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="500"
                  step="5"
                  value={dau}
                  onChange={(e) => setDau(Number(e.target.value))}
                  className="w-full accent-primary bg-white/10 rounded-lg h-2"
                />
                <div className="flex justify-between text-[10px] text-foreground/40 mt-1">
                  <span>1M (Startup)</span>
                  <span>50M (Twitter)</span>
                  <span>500M (Meta)</span>
                </div>
              </div>

              {/* Reads & Writes Per User */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-foreground/80 font-medium">
                      Reads / User
                    </span>
                    <span className="font-mono font-bold text-cyan-400">
                      {readsPerUser}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={readsPerUser}
                    onChange={(e) => setReadsPerUser(Number(e.target.value))}
                    className="w-full accent-cyan-400 bg-white/10 rounded-lg h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-foreground/80 font-medium">
                      Writes / User
                    </span>
                    <span className="font-mono font-bold text-amber-400">
                      {writesPerUser}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="20"
                    step="0.5"
                    value={writesPerUser}
                    onChange={(e) => setWritesPerUser(Number(e.target.value))}
                    className="w-full accent-amber-400 bg-white/10 rounded-lg h-2"
                  />
                </div>
              </div>

              {/* Payload Sizes */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-foreground/80 block mb-1">
                    Read Payload (KB)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={readPayloadKb}
                    onChange={(e) =>
                      setReadPayloadKb(Math.max(0.1, Number(e.target.value)))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-foreground/80 block mb-1">
                    Write Payload (KB)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={writePayloadKb}
                    onChange={(e) =>
                      setWritePayloadKb(Math.max(0.1, Number(e.target.value)))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Peak Multiplier & Replication */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-foreground/80 block mb-1">
                    Peak Factor
                  </label>
                  <select
                    value={peakMultiplier}
                    onChange={(e) => setPeakMultiplier(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-xs font-mono"
                  >
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2.0x (Standard)</option>
                    <option value={3}>3.0x (Burst)</option>
                    <option value={5}>5.0x (Spike)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-foreground/80 block mb-1">
                    Replication
                  </label>
                  <select
                    value={replicationFactor}
                    onChange={(e) =>
                      setReplicationFactor(Number(e.target.value))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-xs font-mono"
                  >
                    <option value={1}>1x (None)</option>
                    <option value={3}>3x (Master + 2 Replicas)</option>
                    <option value={5}>5x (Geo-Distributed)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-foreground/80 block mb-1">
                    Retention
                  </label>
                  <select
                    value={retentionYears}
                    onChange={(e) => setRetentionYears(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-xs font-mono"
                  >
                    <option value={1}>1 Year</option>
                    <option value={3}>3 Years</option>
                    <option value={5}>5 Years (Standard)</option>
                    <option value={10}>10 Years</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Calculated Output Display (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                2. Live Computed System Capacity Specs
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Read QPS Card */}
                <div className="glass-card p-5 border-cyan-500/20 bg-cyan-500/5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-cyan-400 font-bold mb-2">
                    <span>⚡ READ QPS</span>
                    <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded">
                      Query Per Sec
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-foreground">
                      {estimatorMetrics.avgReadQps.toLocaleString()}
                    </span>
                    <span className="text-xs text-foreground/50">avg QPS</span>
                  </div>
                  <div className="text-xs text-cyan-300 font-mono mt-2 pt-2 border-t border-cyan-500/20 flex justify-between">
                    <span>Peak QPS ({peakMultiplier}x):</span>
                    <strong className="text-white">
                      {estimatorMetrics.peakReadQps.toLocaleString()} QPS
                    </strong>
                  </div>
                </div>

                {/* Write QPS Card */}
                <div className="glass-card p-5 border-amber-500/20 bg-amber-500/5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-2">
                    <span>✍️ WRITE QPS</span>
                    <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded">
                      Ingestion
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-foreground">
                      {estimatorMetrics.avgWriteQps.toLocaleString()}
                    </span>
                    <span className="text-xs text-foreground/50">avg QPS</span>
                  </div>
                  <div className="text-xs text-amber-300 font-mono mt-2 pt-2 border-t border-amber-500/20 flex justify-between">
                    <span>Peak Write ({peakMultiplier}x):</span>
                    <strong className="text-white">
                      {estimatorMetrics.peakWriteQps.toLocaleString()} QPS
                    </strong>
                  </div>
                </div>

                {/* Storage Card */}
                <div className="glass-card p-5 border-purple-500/20 bg-purple-500/5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-purple-400 font-bold mb-2">
                    <span>💾 STORAGE CAPACITY</span>
                    <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded">
                      {retentionYears} Yrs × {replicationFactor}x
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-foreground">
                      {estimatorMetrics.multiYearStorageTb}
                    </span>
                    <span className="text-xs text-foreground/50">TB Total</span>
                  </div>
                  <div className="text-xs text-purple-300 font-mono mt-2 pt-2 border-t border-purple-500/20 flex justify-between">
                    <span>Daily Ingestion:</span>
                    <strong className="text-white">
                      {estimatorMetrics.dailyStorageGb} GB/day
                    </strong>
                  </div>
                </div>

                {/* RAM / Cache Card */}
                <div className="glass-card p-5 border-emerald-500/20 bg-emerald-500/5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-2">
                    <span>🧠 REDIS / MEMCACHED (80/20)</span>
                    <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded">
                      20% Hot Daily Read
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-foreground">
                      {estimatorMetrics.recommendedCacheGb}
                    </span>
                    <span className="text-xs text-foreground/50">GB RAM</span>
                  </div>
                  <div className="text-xs text-emerald-300 font-mono mt-2 pt-2 border-t border-emerald-500/20 flex justify-between">
                    <span>Cluster Sizing:</span>
                    <strong className="text-white">
                      ~
                      {Math.ceil(
                        Number(estimatorMetrics.recommendedCacheGb) / 64,
                      )}
                      x 64GB Nodes
                    </strong>
                  </div>
                </div>
              </div>

              {/* Bandwidth Breakdown */}
              <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span>🌐</span>
                  <span className="text-foreground/70">
                    Peak Ingress Bandwidth:
                  </span>
                  <strong className="font-mono text-amber-400">
                    {estimatorMetrics.incomingMbps} Mbps
                  </strong>
                </div>
                <div className="flex items-center gap-2">
                  <span>📡</span>
                  <span className="text-foreground/70">
                    Peak Egress Bandwidth:
                  </span>
                  <strong className="font-mono text-cyan-400">
                    {estimatorMetrics.outgoingMbps} Mbps
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Latency Hierarchy Visualizer */}
      {activeTab === "latency" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="glass-card p-6 bg-purple-500/5 border-purple-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <span>⏱️</span> Latency Numbers Every Software Engineer Must
                Know
              </h2>
              <p className="text-xs text-foreground/70 mt-1 max-w-3xl">
                Compiled originally by Jeff Dean (Google Fellow) and Peter
                Norvig. To build true architectural intuition, the right-hand
                column scales CPU nanoseconds to human time (where 1 CPU cycle =
                1 second).
              </p>
            </div>
            <a
              href="https://github.com/mtdvio/every-programmer-should-know"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-white/10 hover:bg-white/20 text-white font-semibold px-3 py-1.5 rounded-xl border border-white/10 whitespace-nowrap"
            >
              GitHub Source ↗
            </a>
          </div>

          <div className="overflow-x-auto glass-card rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-foreground/80 font-semibold">
                  <th className="py-3 px-4">Operation</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Actual Latency</th>
                  <th className="py-3 px-4">Human Scale (1 cycle = 1s)</th>
                  <th className="py-3 px-4">Engineering Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {LATENCY_ITEMS.map((item, idx) => (
                  <tr
                    key={item.name}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-foreground flex items-center gap-2">
                      <span className="text-foreground/30 font-mono text-[10px] w-4">
                        {idx + 1}
                      </span>
                      <span>{item.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/5 text-foreground/70 border border-white/10">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-primary whitespace-nowrap">
                      {item.raw}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-amber-400 whitespace-nowrap">
                      {item.human}
                    </td>
                    <td className="py-3 px-4 text-foreground/60 text-[11px]">
                      {item.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. In-Browser Client-Side Utilities */}
      {activeTab === "utilities" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 flex-wrap">
            <button
              onClick={() => setUtilType("base64")}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                utilType === "base64"
                  ? "bg-primary text-white"
                  : "bg-white/5 text-foreground/70 hover:bg-white/10"
              }`}
            >
              Base64 Encoder / Decoder
            </button>
            <button
              onClick={() => {
                setUtilType("jwt");
                handleJwtDecode(jwtInput);
              }}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                utilType === "jwt"
                  ? "bg-primary text-white"
                  : "bg-white/5 text-foreground/70 hover:bg-white/10"
              }`}
            >
              JWT Inspector (Private)
            </button>
            <button
              onClick={() => {
                setUtilType("json");
                handleJsonFormat(jsonInput);
              }}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                utilType === "json"
                  ? "bg-primary text-white"
                  : "bg-white/5 text-foreground/70 hover:bg-white/10"
              }`}
            >
              JSON Formatter & Validator
            </button>
            <button
              onClick={() => setUtilType("cron")}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                utilType === "cron"
                  ? "bg-primary text-white"
                  : "bg-white/5 text-foreground/70 hover:bg-white/10"
              }`}
            >
              Cron Expression Explainer
            </button>
          </div>

          {/* Base64 Tool */}
          {utilType === "base64" && (
            <div className="glass-card p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">
                  Base64 Text Encoder & Decoder
                </h3>
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => {
                      setBase64Mode("encode");
                      handleBase64Transform(base64Input, "encode");
                    }}
                    className={`px-3 py-1 rounded-lg font-bold ${base64Mode === "encode" ? "bg-primary text-white" : "bg-white/5 text-foreground/60"}`}
                  >
                    Encode
                  </button>
                  <button
                    onClick={() => {
                      setBase64Mode("decode");
                      handleBase64Transform(base64Input, "decode");
                    }}
                    className={`px-3 py-1 rounded-lg font-bold ${base64Mode === "decode" ? "bg-primary text-white" : "bg-white/5 text-foreground/60"}`}
                  >
                    Decode
                  </button>
                </div>
              </div>
              <textarea
                value={base64Input}
                onChange={(e) => {
                  setBase64Input(e.target.value);
                  handleBase64Transform(e.target.value, base64Mode);
                }}
                placeholder="Enter text to encode or decode..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-primary"
              />
              <div>
                <label className="text-xs text-foreground/50 block mb-1">
                  Output Result:
                </label>
                <div className="p-3 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-emerald-400 break-all select-all">
                  {base64Output || "Output will appear here..."}
                </div>
              </div>
            </div>
          )}

          {/* JWT Inspector */}
          {utilType === "jwt" && (
            <div className="glass-card p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">
                  Private Client-Side JWT Inspector
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                  🔒 100% Client-Side · Token Never Leaves Browser
                </span>
              </div>
              <textarea
                value={jwtInput}
                onChange={(e) => {
                  setJwtInput(e.target.value);
                  handleJwtDecode(e.target.value);
                }}
                placeholder="Paste JWT Token (header.payload.signature)..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-primary"
              />
              {jwtError && <p className="text-xs text-red-400">{jwtError}</p>}
              {jwtDecoded && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                    <span className="text-xs font-bold text-cyan-400 block mb-2">
                      HEADER: ALGORITHM & TOKEN TYPE
                    </span>
                    <pre className="text-xs font-mono text-foreground/80 overflow-x-auto">
                      {JSON.stringify(jwtDecoded.header, null, 2)}
                    </pre>
                  </div>
                  <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                    <span className="text-xs font-bold text-purple-400 block mb-2">
                      PAYLOAD: DATA CLAIMS
                    </span>
                    <pre className="text-xs font-mono text-emerald-300 overflow-x-auto">
                      {JSON.stringify(jwtDecoded.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* JSON Formatter */}
          {utilType === "json" && (
            <div className="glass-card p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">
                  JSON Formatter & Validator
                </h3>
                <button
                  onClick={() => handleJsonFormat(jsonInput)}
                  className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-3 py-1 rounded-lg"
                >
                  Format JSON
                </button>
              </div>
              <textarea
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  handleJsonFormat(e.target.value);
                }}
                placeholder="Paste raw unformatted JSON..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-primary"
              />
              {jsonError && (
                <p className="text-xs text-red-400 font-mono">
                  Syntax Error: {jsonError}
                </p>
              )}
              {jsonFormatted && (
                <div>
                  <label className="text-xs text-foreground/50 block mb-1">
                    Formatted Output:
                  </label>
                  <pre className="p-4 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto select-all">
                    {jsonFormatted}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Cron Explainer */}
          {utilType === "cron" && (
            <div className="glass-card p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-foreground">
                Cron Schedule Expression Explainer
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="text"
                  value={cronExpression}
                  onChange={(e) => setCronExpression(e.target.value)}
                  placeholder="e.g. */15 * * * *"
                  className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-primary"
                />
                <div className="flex gap-2 flex-wrap text-xs">
                  {["*/5 * * * *", "0 * * * *", "0 0 * * *", "0 0 * * 0"].map(
                    (ex) => (
                      <button
                        key={ex}
                        onClick={() => setCronExpression(ex)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-foreground/70 font-mono text-[11px]"
                      >
                        {ex}
                      </button>
                    ),
                  )}
                </div>
              </div>
              <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                <span className="text-xs text-foreground/40 block mb-1">
                  Human-Readable Translation:
                </span>
                <p className="text-sm font-bold text-emerald-400">
                  {cronDescription}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Instant Zero-Signup Sandboxes Launch Deck */}
      {activeTab === "sandboxes" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="glass-card p-6 bg-emerald-500/5 border-emerald-500/20">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <span>🚀</span> Zero-Signup In-Browser Coding & Design Sandboxes
            </h2>
            <p className="text-xs text-foreground/70 mt-1">
              Curated from NoSignups.net and FMHY. Every tool listed below runs
              entirely in your browser without paywalls, sign-up forms, or
              tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CURATED_SANDBOXES.map((tool) => (
              <div
                key={tool.name}
                className="glass-card p-5 flex flex-col justify-between gap-4 border-white/10 hover:border-primary/40 transition-all hover:scale-[1.02] group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-2xl">{tool.emoji}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-foreground/80 border border-white/10">
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-foreground/65 mt-1.5 leading-relaxed">
                    {tool.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {tool.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] bg-white/5 text-foreground/50 px-2 py-0.5 rounded"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span>✓</span> Zero Sign Up
                  </span>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-primary hover:bg-primary-dark text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                  >
                    <span>Launch</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
