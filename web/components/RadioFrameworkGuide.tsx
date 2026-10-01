"use client";

import React, { useState } from "react";

export default function RadioFrameworkGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<"R" | "A" | "D" | "I" | "O">(
    "R",
  );

  const steps = [
    {
      key: "R",
      letter: "R",
      title: "Requirements Exploration",
      tag: "0 - 5 mins",
      color: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-300",
      badge: "Step 1: Clarify & Scope",
      summary:
        "Never jump straight to drawing boxes. Uncover implicit requirements, device targets, and performance budgets.",
      bullets: [
        {
          label: "Functional Requirements",
          desc: "What core user journeys must work? (e.g. Infinite feed, offline compose, real-time message notifications).",
        },
        {
          label: "Non-Functional Targets",
          desc: "Core Web Vitals (LCP < 2.5s, FID/INP < 100ms, CLS < 0.1), 60fps smooth scrolling, low-end mobile device constraints.",
        },
        {
          label: "Scale & Traffic",
          desc: "Daily Active Users (DAU), peak read vs write ratio, upload payload limits, network connectivity (3G / offline tolerance).",
        },
        {
          label: "Key Questions to Ask",
          desc: '"Are we building for desktop, mobile web, or hybrid app?", "Do we need offline-first read/write capabilities?", "What is the expected real-time latency?"',
        },
      ],
    },
    {
      key: "A",
      letter: "A",
      title: "Architecture & High-Level Design",
      tag: "5 - 15 mins",
      color:
        "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-300",
      badge: "Step 2: Component & Data Flow",
      summary:
        "Map out the macroscopic client architecture and establish clean separation of concerns.",
      bullets: [
        {
          label: "View Layer (UI)",
          desc: "Component hierarchy, container components vs presentational leaf nodes, reusable design system primitives.",
        },
        {
          label: "State Management Store",
          desc: "Global store (Redux/Zustand), server cache (TanStack Query/RTK Query), and localized form/transient UI state.",
        },
        {
          label: "Data & Network Layer",
          desc: "HTTP client, request interceptors (auth token refresh, retry with exponential backoff), WebSocket connection manager.",
        },
        {
          label: "Client Cache & Storage",
          desc: "IndexedDB for offline documents/drafts, localStorage for user preferences, Memory cache for active session objects.",
        },
      ],
    },
    {
      key: "D",
      letter: "D",
      title: "Data Model & API Design",
      tag: "15 - 25 mins",
      color:
        "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-300",
      badge: "Step 3: State Schemas & Protocols",
      summary:
        "Define clean client state models and network contracts. Normalize state to avoid inconsistent duplicate renders.",
      bullets: [
        {
          label: "Normalized State Shape",
          desc: "Store relational entities normalized as { byId: { [id]: Entity }, allIds: [id1, id2] } instead of deeply nested trees.",
        },
        {
          label: "Protocol Selection",
          desc: "REST (idempotent CRUD), GraphQL (flexible sparse querying, prevents overfetching), WebSockets (two-way real-time), SSE (one-way server push).",
        },
        {
          label: "Pagination Mechanism",
          desc: "Cursor-based pagination (opaque cursor token) for live feeds to prevent duplicate/skipped items vs Offset/limit for static catalogs.",
        },
        {
          label: "Optimistic State Updates",
          desc: "Generate temporary client UUID, update UI instantaneously, rollback or reconcile with server response on settlement.",
        },
      ],
    },
    {
      key: "I",
      letter: "I",
      title: "Interface & Component Breakdown",
      tag: "25 - 35 mins",
      color: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-300",
      badge: "Step 4: UI Hierarchy & States",
      summary:
        "Drill down into the actual component tree, prop signatures, and every possible user interaction state.",
      bullets: [
        {
          label: "Component Tree",
          desc: "E.g., NewsFeed -> FeedVirtualizer -> FeedCard -> [CardHeader, MediaCarousel, ActionButtons, CommentDrawer].",
        },
        {
          label: "Comprehensive State Machine",
          desc: "Design for: Loading (Skeleton screen), Empty (Empty state with CTA), Populated, Error (Inline retry button), Degraded/Offline.",
        },
        {
          label: "Input Handling & Throttling",
          desc: "Debounce search bar queries (300ms) with AbortController on in-flight requests; Throttle scroll/resize events.",
        },
        {
          label: "Accessibility & Keyboard",
          desc: "ARIA role landmarks, roving tabindex for arrow key navigation, focus traps in modals, screen reader announcements.",
        },
      ],
    },
    {
      key: "O",
      letter: "O",
      title: "Optimizations & Deep-Dives",
      tag: "35 - 45 mins",
      color:
        "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-300",
      badge: "Step 5: Performance & Edge Cases",
      summary:
        "This is where senior and staff candidates stand out. Dive deep into bottlenecks, memory leaks, and resilience.",
      bullets: [
        {
          label: "List Virtualization",
          desc: "Render only visible viewport items + buffer rows (react-window / custom virtual list) to cap DOM nodes at ~30 instead of 10,000+.",
        },
        {
          label: "Asset & Bundle Performance",
          desc: "Route-based code splitting, lazy-loaded modals/charts, modern formats (WebP/AVIF), progressive image placeholders (BlurHash).",
        },
        {
          label: "Network Resilience & Offline",
          desc: "ServiceWorker caching strategies (Stale-While-Revalidate, Cache-First for static assets), background sync queue for failed offline mutations.",
        },
        {
          label: "Security & Hardening",
          desc: "DOMPurify sanitization to stop XSS in rich-text, Content Security Policy (CSP), Secure/SameSite cookies, CSRF protection.",
        },
      ],
    },
  ];

  const current = steps.find((s) => s.key === activeStep)!;

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b0e14] via-[#0e131d] to-[#07090e] p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-black font-extrabold flex items-center justify-center text-lg shadow-md shadow-amber-500/20">
            📻
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg text-white tracking-tight">
                RADIO Framework: Frontend & System Design Playbook
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                FAANG Standard
              </span>
            </div>
            <p className="text-xs text-foreground/60 mt-0.5">
              The 5-step structured architecture blueprint used by top engineers
              at Google, Meta, and Netflix to ace 45-minute technical
              interviews.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-xs px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-foreground/80 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 self-start sm:self-auto font-medium"
        >
          <span>
            {isOpen ? "▲ Collapse Guide" : "▼ Expand Complete Playbook"}
          </span>
        </button>
      </div>

      {/* 5-Step Selector Pill Bar (Always Visible) */}
      <div className="grid grid-cols-5 gap-2 mt-4">
        {steps.map((s) => (
          <button
            key={s.key}
            onClick={() => {
              setActiveStep(s.key as "R" | "A" | "D" | "I" | "O");
              setIsOpen(true);
            }}
            className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
              activeStep === s.key && isOpen
                ? `bg-white/10 border-white/30 text-white shadow-lg`
                : "bg-white/[0.02] border-white/5 text-foreground/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="font-extrabold text-sm sm:text-base font-mono block">
              {s.letter}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold truncate max-w-full hidden md:inline">
              {s.title.split(" ")[0]}
            </span>
            <span className="text-[9px] opacity-50 font-mono hidden sm:inline">
              {s.tag}
            </span>
          </button>
        ))}
      </div>

      {/* Expanded Detailed Playbook View */}
      {isOpen && (
        <div className="mt-5 space-y-4 animate-in fade-in duration-200">
          <div
            className={`p-4 rounded-xl border bg-gradient-to-br ${current.color}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10">
                    {current.badge}
                  </span>
                  <span className="text-xs font-mono opacity-70">
                    Allocated Time: {current.tag}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-1">
                  {current.title}
                </h4>
              </div>
              <p className="text-xs opacity-90 max-w-md italic">
                &quot;{current.summary}&quot;
              </p>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {current.bullets.map((b, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-black/40 border border-white/5 flex flex-col gap-1"
                >
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="text-amber-400">✓</span>
                    <span>{b.label}</span>
                  </div>
                  <div className="text-foreground/75 leading-relaxed text-[11px]">
                    {b.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Timing Cheat Sheet */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-foreground/70">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                ⏱️ 45-Min Allocation:
              </span>
              <span className="text-[11px] font-mono text-foreground/60">
                Requirements (5m) &rarr; Architecture (10m) &rarr; Data Model
                (10m) &rarr; Components (10m) &rarr; Optimizations (10m)
              </span>
            </div>
            <span className="text-[11px] text-amber-300/80 font-medium">
              💡 Tip: Always spend the first 5 minutes purely on Requirements
              before writing any code.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
