'use client';

import { useState } from 'react';
import { useProgress, CustomPlanData, PlanMilestone } from '@/lib/useProgress';

interface PlanWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFocus?: string;
}

interface FocusOption {
  id: string;
  title: string;
  badge: string;
  emoji: string;
  desc: string;
  matchingTrack: string;
}

const FOCUS_OPTIONS: FocusOption[] = [
  {
    id: 'system-design',
    title: 'System Design Mastery (LLD & HLD)',
    badge: 'Zero to Architect',
    emoji: '📐',
    desc: 'Master OOP, SOLID, GoF design patterns, machine coding, distributed systems, and back-of-envelope capacity math.',
    matchingTrack: 'system-design-mastery'
  },
  {
    id: 'sde2',
    title: 'SDE-2 Fullstack & Feature Ownership',
    badge: 'Mid-Level',
    emoji: '🚀',
    desc: 'Balanced pathway: frontend virtualization, microservices, LLD patterns, and medium LeetCode algorithms.',
    matchingTrack: 'sde2-fullstack'
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms (Grind 75)',
    badge: 'Coding Specialist',
    emoji: '🔥',
    desc: 'High-frequency LeetCode patterns: two pointers, sliding window, binary trees, dynamic programming, and graphs.',
    matchingTrack: 'sde2-fullstack'
  },
  {
    id: 'sde3',
    title: 'SDE-3 / Staff Principal Architect',
    badge: 'Staff / L6+',
    emoji: '👑',
    desc: 'Massive scale, multi-region active-active, consensus (Raft), PACELC tradeoffs, and Staff-level RFCs.',
    matchingTrack: 'sde3-staff-architect'
  },
  {
    id: 'sde1',
    title: 'Campus to SDE-1 Graduate Fast-Track',
    badge: 'Foundations',
    emoji: '🎓',
    desc: 'Core CS fundamentals (OS, Networks, DBMS), Arrays, Strings, Trees, and entry-level STAR behavioral stories.',
    matchingTrack: 'sde1-foundations'
  },
  {
    id: 'sprint',
    title: '14-Day Emergency Interview Sprint',
    badge: 'Crash Sprint',
    emoji: '⚡',
    desc: 'Short-timeline high-yield preparation: top 20 algorithmic patterns, system design cheatsheets, and audio podcasts.',
    matchingTrack: 'crash-sprint-14d'
  }
];

const LEVEL_OPTIONS = [
  {
    id: 'beginner' as const,
    title: 'Complete Beginner (Level 0)',
    emoji: '🟢',
    desc: 'Never designed an architecture or taken tech interviews before. Start with intuitive visualizers & step-by-step principles.'
  },
  {
    id: 'intermediate' as const,
    title: 'Intermediate (1–3 Years Experience)',
    emoji: '🟡',
    desc: 'Comfortable writing code and basic SQL, but need structured frameworks for LLD machine coding and HLD scaling.'
  },
  {
    id: 'senior' as const,
    title: 'Senior / Staff (4+ Years Experience)',
    emoji: '🔴',
    desc: 'Deepening architectural judgment, trade-offs, failure modes, high-concurrency LLD, and multi-region resilience.'
  }
];

const TIME_OPTIONS = [
  {
    id: '15m' as const,
    title: '15–20 Mins / Day (Micro-Learning)',
    emoji: '⏱️',
    desc: 'Bite-sized flashcards, fast-recall cheat sheets, in-browser sandboxes, and NotebookLM commute podcasts.'
  },
  {
    id: '60m' as const,
    title: '1 Hour / Day (Balanced Standard)',
    emoji: '📅',
    desc: 'Structured 30-day pacing: 1 architectural concept or pattern + 1 hands-on problem / sandbox per day.'
  },
  {
    id: '120m' as const,
    title: '2+ Hours / Day (Intensive Fast-Track)',
    emoji: '🚀',
    desc: 'Deep-dive sprint: live machine coding rounds, complete capacity calculations, and full case study design.'
  }
];

const WEAKNESS_OPTIONS = [
  {
    id: 'lld',
    title: 'Low-Level Design (LLD) & Machine Coding',
    emoji: '🏛️',
    desc: 'OOP pillars, SOLID principles, GoF design patterns, UML class diagrams, and Parking Lot / Elevator rounds.'
  },
  {
    id: 'hld',
    title: 'High-Level Design (HLD) & Capacity Math',
    emoji: '🌐',
    desc: '4-step interview framework, back-of-the-envelope math, database sharding, caching strategies, and CAP/PACELC.'
  },
  {
    id: 'dsa',
    title: 'Algorithmic Patterns & Corner Cases',
    emoji: '🧩',
    desc: 'Graph BFS/DFS, dynamic programming memoization, binary tree traversals, and handling integer overflows.'
  },
  {
    id: 'behavioral',
    title: 'Behavioral & Leadership STAR Stories',
    emoji: '🗣️',
    desc: 'Google X-Y-Z formula, Amazon Leadership Principles, and navigating difficult technical disagreements.'
  }
];

export default function PlanWizardModal({ isOpen, onClose, defaultFocus }: PlanWizardModalProps) {
  const { saveCustomPlan, setActiveTrack } = useProgress();
  const [step, setStep] = useState<number>(1);
  const [selectedFocus, setSelectedFocus] = useState<string>(defaultFocus || 'system-design');
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'senior'>('beginner');
  const [selectedTime, setSelectedTime] = useState<'15m' | '60m' | '120m'>('60m');
  const [selectedWeakness, setSelectedWeakness] = useState<string>('lld');

  if (!isOpen) return null;

  const handleGeneratePlan = () => {
    const focusObj = FOCUS_OPTIONS.find(f => f.id === selectedFocus) || FOCUS_OPTIONS[0];

    // Synthesize tailored milestones based on selections
    const milestones: PlanMilestone[] = [];

    if (selectedFocus === 'system-design') {
      if (selectedWeakness === 'lld') {
        milestones.push(
          {
            id: 'plan-sd-1',
            title: 'Master SOLID Principles with Practical Code Examples',
            subtitle: 'Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation & Dependency Inversion.',
            estimatedMinutes: 35,
            category: 'lld',
            deepLink: '/system-design',
            linkLabel: 'Read SOLID & LLD Guide',
            completed: false
          },
          {
            id: 'plan-sd-2',
            title: 'Creational & Behavioral GoF Patterns (Strategy, Observer, Factory)',
            subtitle: 'Implement extensible strategy pattern and decoupled observer pub-sub mechanisms.',
            estimatedMinutes: 40,
            category: 'lld',
            deepLink: '/system-design',
            linkLabel: 'Open GoF Patterns Guide',
            completed: false
          },
          {
            id: 'plan-sd-3',
            title: 'Visual UML Class Modeling in Mermaid Live',
            subtitle: 'Quickly draft class diagrams, inheritance trees, and interfaces before coding.',
            estimatedMinutes: 20,
            category: 'tools',
            deepLink: '/tools',
            linkLabel: 'Open Mermaid Live',
            toolRecommendation: { name: 'Mermaid Live Sandbox', url: 'https://mermaid.live/', isExternal: true },
            completed: false
          },
          {
            id: 'plan-sd-4',
            title: 'Design a Multi-Floor Parking Lot (Machine Coding Classic)',
            subtitle: 'Apply Factory & Strategy patterns to spot allocation, ticket issuance, and fee calculation.',
            estimatedMinutes: 50,
            category: 'lld',
            deepLink: '/system-design',
            linkLabel: 'Open Machine Coding Framework',
            completed: false
          },
          {
            id: 'plan-sd-5',
            title: 'Model Relational Schemas in drawDB Sandbox',
            subtitle: 'Design entities, foreign keys, and indexes visually and export clean SQL DDL.',
            estimatedMinutes: 25,
            category: 'tools',
            deepLink: '/tools',
            linkLabel: 'Launch drawDB Sandbox',
            toolRecommendation: { name: 'drawDB Sandbox', url: 'https://www.drawdb.app/', isExternal: true },
            completed: false
          },
          {
            id: 'plan-sd-6',
            title: 'The 4-Step 45-Minute HLD Interview Master Framework',
            subtitle: 'Scope requirements -> Capacity estimation -> High-level diagram -> Deep dive into bottlenecks.',
            estimatedMinutes: 30,
            category: 'hld',
            deepLink: '/system-design',
            linkLabel: 'Open 4-Step HLD Protocol',
            completed: false
          },
          {
            id: 'plan-sd-7',
            title: 'Interactive Back-of-the-Envelope Capacity Estimator',
            subtitle: 'Calculate QPS, storage, bandwidth, and cache RAM requirements in seconds.',
            estimatedMinutes: 25,
            category: 'tools',
            deepLink: '/tools',
            linkLabel: 'Launch Capacity Planner',
            toolRecommendation: { name: 'Capacity Planner Tool', url: '/tools', isExternal: false },
            completed: false
          },
          {
            id: 'plan-sd-8',
            title: 'Case Study: Distributed Rate Limiter (Token Bucket + Redis Lua)',
            subtitle: 'Sliding window logs vs token bucket algorithm with atomic concurrency control.',
            estimatedMinutes: 40,
            category: 'hld',
            deepLink: '/system-design',
            linkLabel: 'Open Rate Limiter Blueprint',
            completed: false
          }
        );
      } else {
        // HLD or general focus
        milestones.push(
          {
            id: 'plan-sd-h1',
            title: 'The 4-Step 45-Minute HLD Interview Protocol',
            subtitle: 'Time allocation and framework for structuring ambiguous architecture questions.',
            estimatedMinutes: 30,
            category: 'hld',
            deepLink: '/system-design',
            linkLabel: 'Open 4-Step HLD Blueprint',
            completed: false
          },
          {
            id: 'plan-sd-h2',
            title: 'Back-of-the-Envelope Capacity Estimator & Latency Visualizer',
            subtitle: 'Memorize latency orders of magnitude and practice DAU/QPS storage calculations.',
            estimatedMinutes: 30,
            category: 'tools',
            deepLink: '/tools',
            linkLabel: 'Launch In-Browser Tools',
            toolRecommendation: { name: 'Capacity Planner & Latency Tool', url: '/tools', isExternal: false },
            completed: false
          },
          {
            id: 'plan-sd-h3',
            title: 'Distributed Systems Core Concepts (CAP, PACELC, Sharding, Caching)',
            subtitle: 'Master linearizable consistency, eventual consistency, and consistent hashing with virtual nodes.',
            estimatedMinutes: 45,
            category: 'hld',
            deepLink: '/system-design',
            linkLabel: 'Open Distributed Handbook',
            completed: false
          },
          {
            id: 'plan-sd-h4',
            title: 'Case Study: URL Shortener (TinyURL / Bitly) & Key Generation Service',
            subtitle: 'Base62 encoding, pre-generated unique keys via Redis/Zookeeper, and horizontal read scaling.',
            estimatedMinutes: 40,
            category: 'hld',
            deepLink: '/system-design',
            linkLabel: 'Open TinyURL Blueprint',
            completed: false
          },
          {
            id: 'plan-sd-h5',
            title: 'SOLID Principles & GoF Strategy & Observer Patterns',
            subtitle: 'Ensure your low-level code matches your high-level architectural design.',
            estimatedMinutes: 35,
            category: 'lld',
            deepLink: '/system-design',
            linkLabel: 'Open GoF Patterns Guide',
            completed: false
          },
          {
            id: 'plan-sd-h6',
            title: 'Case Study: Twitter / Newsfeed Timeline Architecture',
            subtitle: 'Fan-out on write (push) vs fan-out on read (pull) for celebrity accounts.',
            estimatedMinutes: 45,
            category: 'hld',
            deepLink: '/system-design',
            linkLabel: 'Open Twitter Timeline Blueprint',
            completed: false
          },
          {
            id: 'plan-sd-h7',
            title: 'Generate 15-Minute Audio Podcasts with Google NotebookLM',
            subtitle: 'Export architecture grounding packs to listen to 2-host conversational podcasts during commutes.',
            estimatedMinutes: 15,
            category: 'notebooklm',
            deepLink: '/notebooklm',
            linkLabel: 'Open NotebookLM Studio',
            completed: false
          }
        );
      }
    } else if (selectedFocus === 'dsa') {
      milestones.push(
        {
          id: 'plan-dsa-1',
          title: 'Arrays & HashMaps: Two Sum & Contains Duplicate',
          subtitle: 'Learn space-time tradeoff O(N) HashMap vs O(N^2) brute force.',
          estimatedMinutes: 30,
          category: 'coding',
          deepLink: '/grind75',
          linkLabel: 'Solve in Grind 75',
          toolRecommendation: { name: 'VisuAlgo Array Sandbox', url: 'https://visualgo.net/en/array', isExternal: true },
          completed: false
        },
        {
          id: 'plan-dsa-2',
          title: 'Two Pointers & Sliding Window: Valid Palindrome & Best Time to Buy Stock',
          subtitle: 'Converging pointers, sliding window boundaries, and tracking running minimums.',
          estimatedMinutes: 35,
          category: 'coding',
          deepLink: '/grind75',
          linkLabel: 'Open Grind 75 Planner',
          completed: false
        },
        {
          id: 'plan-dsa-3',
          title: 'Algorithmic Corner Cases & Fast-Recall Flashcards',
          subtitle: 'Review integer overflows, empty input traps, and skewed tree invariants.',
          estimatedMinutes: 20,
          category: 'cheatsheet',
          deepLink: '/cheatsheets',
          linkLabel: 'Open Corner Cases Sheet',
          completed: false
        },
        {
          id: 'plan-dsa-4',
          title: 'Binary Trees: Maximum Depth & Invert Binary Tree',
          subtitle: 'Master recursive stack frame mechanics and tree DFS traversals.',
          estimatedMinutes: 35,
          category: 'coding',
          deepLink: '/grind75',
          linkLabel: 'Solve Tree Problems',
          toolRecommendation: { name: 'VisuAlgo BST Sandbox', url: 'https://visualgo.net/en/bst', isExternal: true },
          completed: false
        },
        {
          id: 'plan-dsa-5',
          title: 'Graphs: Number of Islands (BFS / DFS Matrix Traversal)',
          subtitle: 'Learn connected component traversal and visited cell tracking.',
          estimatedMinutes: 45,
          category: 'coding',
          deepLink: '/grind75',
          linkLabel: 'Practice Graph Patterns',
          completed: false
        },
        {
          id: 'plan-dsa-6',
          title: 'Dynamic Programming: Climbing Stairs & Coin Change',
          subtitle: 'Bottom-up tabulation vs top-down memoization for optimal substructure.',
          estimatedMinutes: 45,
          category: 'coding',
          deepLink: '/grind75',
          linkLabel: 'Practice DP in Grind 75',
          completed: false
        }
      );
    } else {
      // General SDE-2, SDE-3, SDE-1, or Sprint
      milestones.push(
        {
          id: 'plan-gen-1',
          title: 'Master Core Architecture & LLD Design Patterns',
          subtitle: 'SOLID principles, Strategy & Observer patterns, and modular interface design.',
          estimatedMinutes: 35,
          category: 'lld',
          deepLink: '/system-design',
          linkLabel: 'Open System Design Hub',
          completed: false
        },
        {
          id: 'plan-gen-2',
          title: 'High-Frequency Algorithmic Patterns in Grind 75',
          subtitle: 'Solve top array, two-pointer, and tree problems with optimal Big-O.',
          estimatedMinutes: 40,
          category: 'coding',
          deepLink: '/grind75',
          linkLabel: 'Open Grind 75 Planner',
          completed: false
        },
        {
          id: 'plan-gen-3',
          title: 'Explore Back-of-the-Envelope Capacity Estimator & Latency Tool',
          subtitle: 'Quickly size read/write QPS and compare L1 vs RAM vs SSD latencies.',
          estimatedMinutes: 25,
          category: 'tools',
          deepLink: '/tools',
          linkLabel: 'Launch Dev Tools',
          completed: false
        },
        {
          id: 'plan-gen-4',
          title: 'Draft 2 Impactful STAR Stories with Google X-Y-Z Formula',
          subtitle: 'Accomplished [X] as measured by [Y] by doing [Z] for technical depth.',
          estimatedMinutes: 30,
          category: 'behavioral',
          deepLink: '/stories',
          linkLabel: 'Open STAR Story Wizard',
          completed: false
        },
        {
          id: 'plan-gen-5',
          title: 'Distributed System Case Study (Rate Limiter or TinyURL)',
          subtitle: 'Learn end-to-end component layout, caching layers, and database sharding.',
          estimatedMinutes: 40,
          category: 'hld',
          deepLink: '/system-design',
          linkLabel: 'View Case Study',
          completed: false
        },
        {
          id: 'plan-gen-6',
          title: 'Listen to 15-Min NotebookLM Audio Overview Podcast',
          subtitle: 'Grounding pack converted to conversational audio for commute revision.',
          estimatedMinutes: 15,
          category: 'notebooklm',
          deepLink: '/notebooklm',
          linkLabel: 'Open NotebookLM Studio',
          completed: false
        }
      );
    }

    const newPlan: CustomPlanData = {
      id: `plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      primaryFocus: selectedFocus,
      focusTitle: focusObj.title,
      experienceLevel: selectedLevel,
      dailyTime: selectedTime,
      primaryWeakness: selectedWeakness,
      title: `${focusObj.title} (${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)})`,
      summary: `Tailored ${selectedTime} daily routine focusing on ${selectedWeakness.toUpperCase()} with interactive sandboxes and verified checklists.`,
      milestones
    };

    saveCustomPlan(newPlan, focusObj.matchingTrack);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#11141b] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient background glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center text-lg">
              🎯
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">
                  Diagnostic & Plan Builder
                </span>
                <span className="text-[11px] text-foreground/40 font-mono">
                  Step {step} of 4
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Personalize Your Interview Study Plan
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-foreground/60 hover:text-white flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-primary' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="flex flex-col gap-4">
          {step === 1 && (
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  1. What is your primary learning goal?
                </h3>
                <p className="text-xs text-foreground/60 mt-0.5">
                  Choose the path that matches what you want to master first.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {FOCUS_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedFocus(opt.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                      selectedFocus === opt.id
                        ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/20 ring-1 ring-primary'
                        : 'bg-white/[0.03] border-white/10 text-foreground/80 hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{opt.emoji}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedFocus === opt.id ? 'bg-primary text-white' : 'bg-white/5 text-foreground/50'
                      }`}>
                        {opt.badge}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-foreground mt-0.5">{opt.title}</h4>
                    <p className="text-[11px] text-foreground/60 leading-relaxed line-clamp-2">
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  2. Where are you starting from?
                </h3>
                <p className="text-xs text-foreground/60 mt-0.5">
                  We customize the depth and sequencing according to your level.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 pt-1">
                {LEVEL_OPTIONS.map(lvl => (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      selectedLevel === lvl.id
                        ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/20 ring-1 ring-primary'
                        : 'bg-white/[0.03] border-white/10 text-foreground/80 hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{lvl.emoji}</span>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">{lvl.title}</h4>
                      <p className="text-xs text-foreground/60 leading-relaxed">{lvl.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  3. How much time can you spend daily?
                </h3>
                <p className="text-xs text-foreground/60 mt-0.5">
                  We pace your milestones so you prepare consistently without burnout.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 pt-1">
                {TIME_OPTIONS.map(time => (
                  <button
                    key={time.id}
                    onClick={() => setSelectedTime(time.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      selectedTime === time.id
                        ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/20 ring-1 ring-primary'
                        : 'bg-white/[0.03] border-white/10 text-foreground/80 hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{time.emoji}</span>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">{time.title}</h4>
                      <p className="text-xs text-foreground/60 leading-relaxed">{time.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  4. What specific skill do you want to improve most?
                </h3>
                <p className="text-xs text-foreground/60 mt-0.5">
                  We will prioritize this skill at the very beginning of your roadmap.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {WEAKNESS_OPTIONS.map(w => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWeakness(w.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                      selectedWeakness === w.id
                        ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/20 ring-1 ring-primary'
                        : 'bg-white/[0.03] border-white/10 text-foreground/80 hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{w.emoji}</span>
                      <h4 className="text-xs font-bold text-foreground">{w.title}</h4>
                    </div>
                    <p className="text-[11px] text-foreground/60 leading-relaxed">
                      {w.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
          {step > 1 ? (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-foreground/70 transition-all"
            >
              &larr; Back
            </button>
          ) : (
            <span className="text-[11px] text-foreground/40">Zero signup needed · Stored locally</span>
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-primary/25 transition-all"
            >
              Next Step &rarr;
            </button>
          ) : (
            <button
              onClick={handleGeneratePlan}
              className="bg-gradient-to-r from-primary via-purple-600 to-primary-dark hover:from-primary-dark hover:to-purple-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center gap-1.5"
            >
              <span>🚀 Generate My Custom Plan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
