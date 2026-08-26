export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  type: 'coding' | 'system-design' | 'cheatsheet' | 'behavioral' | 'notebooklm' | 'reading';
  deepLink: string;
  linkLabel: string;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  weekLabel: string;
  description: string;
  tasks: RoadmapTask[];
}

export interface CareerTrack {
  id: string;
  title: string;
  badge: string;
  emoji: string;
  targetAudience: string;
  durationWeeks: string;
  weeklyDedication: string;
  description: string;
  phases: RoadmapPhase[];
}

export const CAREER_TRACKS: CareerTrack[] = [
  {
    id: 'sde3-staff-architect',
    title: 'SDE-3 / Staff Principal Architect Pathway',
    badge: 'Staff / L6+ (8–12 Wks)',
    emoji: '👑',
    targetAudience: 'Senior Engineers targeting SDE-3, Lead, Staff, and Principal Architect roles at FAANG / Tier-1 Tech.',
    durationWeeks: '8–12 Weeks',
    weeklyDedication: '12–16 hrs/week',
    description: 'Master massive-scale multi-region active-active distributed architecture, high-concurrency LLD, observability (OpenTelemetry), FinOps infrastructure sizing, and Staff-level technical RFC leadership.',
    phases: [
      {
        id: 'sde3-phase-1',
        title: 'Phase 1: High-Concurrency Low-Level Design & Concurrency',
        weekLabel: 'Week 1 – 3',
        description: 'Thread safety, lock-free data structures, connection pooling, and extensible GoF design patterns under load.',
        tasks: [
          {
            id: 'sde3-p1-t1',
            title: 'Master GoF Creational & Behavioral Patterns with Concurrency',
            description: 'Implement thread-safe Singleton, Strategy, Observer, and Decorator patterns with mutexes and atomic operations.',
            estimatedMinutes: 45,
            type: 'system-design',
            deepLink: '/system-design',
            linkLabel: 'Open LLD & GoF Patterns'
          },
          {
            id: 'sde3-p1-t2',
            title: 'Concurrency, Optimistic vs Pessimistic Locking & Deadlocks',
            description: 'Study database row locks (SELECT FOR UPDATE), distributed Redis Redlock algorithm, and 2PC vs Sagas.',
            estimatedMinutes: 40,
            type: 'system-design',
            deepLink: '/system-design',
            linkLabel: 'View Distributed Systems Handbook'
          },
          {
            id: 'sde3-p1-t3',
            title: 'Defensive Corner Cases: Integer Overflows & Skewed Tree Failures',
            description: 'Review algorithmic failure modes under enterprise load across HashMaps, Heap allocations, and DP states.',
            estimatedMinutes: 25,
            type: 'cheatsheet',
            deepLink: '/cheatsheets',
            linkLabel: 'Open Corner Cases Matrix'
          }
        ]
      },
      {
        id: 'sde3-phase-2',
        title: 'Phase 2: Multi-Region Distributed Systems & Consistency Models',
        weekLabel: 'Week 4 – 6',
        description: 'Multi-datacenter active-active replication, Raft consensus, PACELC tradeoffs, and sharding hotspots.',
        tasks: [
          {
            id: 'sde3-p2-t1',
            title: 'CAP & PACELC Theorem Deep Dive (Dynamo vs Spanner)',
            description: 'Master linearizable consistency, eventual consistency with vector clocks, and Google Spanner TrueTime API.',
            estimatedMinutes: 45,
            type: 'system-design',
            deepLink: '/system-design',
            linkLabel: 'View Distributed Systems Guide'
          },
          {
            id: 'sde3-p2-t2',
            title: 'Massive Scale Case Study: Distributed Web Crawler with SimHash',
            description: 'URL Frontier politeness queues, Bloom filter deduplication, and DNS resolution caching architecture.',
            estimatedMinutes: 45,
            type: 'system-design',
            deepLink: '/system-design',
            linkLabel: 'View Web Crawler Blueprint'
          },
          {
            id: 'sde3-p2-t3',
            title: 'Massive Scale Case Study: Twitter Timeline Hybrid Fan-Out',
            description: 'Fan-out on Write vs Fan-out on Read, Redis ZSET timelines, and celebrity fallback mechanisms.',
            estimatedMinutes: 40,
            type: 'system-design',
            deepLink: '/system-design',
            linkLabel: 'View Twitter Timeline Blueprint'
          }
        ]
      },
      {
        id: 'sde3-phase-3',
        title: 'Phase 3: Resiliency, FinOps & Production Observability',
        weekLabel: 'Week 7 – 9',
        description: 'Disaster recovery (RTO/RPO), circuit breakers, OpenTelemetry distributed tracing, and infrastructure cost math.',
        tasks: [
          {
            id: 'sde3-p3-t1',
            title: 'System Latency Numbers & FinOps Capacity Math',
            description: 'Calculate egress network bandwidth costs, RAM vs NVMe SSD costs, and 100k QPS cluster sizing.',
            estimatedMinutes: 30,
            type: 'cheatsheet',
            deepLink: '/cheatsheets',
            linkLabel: 'View Latency Numbers'
          },
          {
            id: 'sde3-p3-t2',
            title: 'Resiliency Patterns: Circuit Breaker, Bulkhead & Chaos Engineering',
            description: 'Study Netflix Hystrix/Resilience4j patterns, rate limiting token buckets, and graceful degradation.',
            estimatedMinutes: 35,
            type: 'system-design',
            deepLink: '/system-design',
            linkLabel: 'View Architecture Blueprints'
          },
          {
            id: 'sde3-p3-t3',
            title: 'Generate 15-Min Staff Architecture Podcast in NotebookLM',
            description: 'Listen to 2-host audio breakdowns of SDE-3 trade-offs and capacity bottlenecks on the go.',
            estimatedMinutes: 15,
            type: 'notebooklm',
            deepLink: '/notebooklm',
            linkLabel: 'Launch NotebookLM AI Hub'
          }
        ]
      },
      {
        id: 'sde3-phase-4',
        title: 'Phase 4: Staff Leadership, Technical RFCs & Hiring Bar Raiser',
        weekLabel: 'Week 10 – 12',
        description: 'Influence without authority, driving org-wide architecture decisions, 5-Whys incident post-mortems, and Amazon 16 LPs.',
        tasks: [
          {
            id: 'sde3-p4-t1',
            title: 'Draft 3 Staff-Level STAR Stories (Multi-Team Impact & RFCs)',
            description: 'Structure stories demonstrating Org-wide tech debt reduction, cross-team conflict resolution, and architectural pivots.',
            estimatedMinutes: 45,
            type: 'behavioral',
            deepLink: '/stories',
            linkLabel: 'Open STAR Story Wizard'
          },
          {
            id: 'sde3-p4-t2',
            title: 'FAANG Staff / Bar Raiser Mock Grilling in NotebookLM',
            description: 'Run the ruthless Bar Raiser prompt in NotebookLM to cross-examine your design decisions with zero hallucinations.',
            estimatedMinutes: 30,
            type: 'notebooklm',
            deepLink: '/notebooklm',
            linkLabel: 'Open Bar Raiser Prompt'
          },
          {
            id: 'sde3-p4-t3',
            title: 'Reverse Interview Strategy: Leadership & Culture Vetting',
            description: 'Prepare high-signal questions to ask Directors and Principal Engineers about autonomy, budget, and engineering morale.',
            estimatedMinutes: 20,
            type: 'behavioral',
            deepLink: '/stories',
            linkLabel: 'Open Reverse Interview Guide'
          }
        ]
      }
    ]
  },
  {
    id: 'sde2-fullstack',
    title: 'SDE-2 / Senior Fullstack Pathway',
    badge: 'Comprehensive (6–8 Wks)',
    emoji: '🚀',
    targetAudience: 'Working engineers preparing for Mid-Level & Senior Product Company interviews.',
    durationWeeks: '6–8 Weeks',
    weeklyDedication: '8–12 hrs/week',
    description: 'The complete end-to-end curriculum balancing core algorithmic patterns, High-Level Distributed Architecture, Low-Level Design (LLD), and FAANG behavioral storytelling.',
    phases: [
      {
        id: 'sde2-phase-1',
        title: 'Phase 1: Algorithmic Pattern Foundations',
        weekLabel: 'Week 1 – 2',
        description: 'Master core LeetCode patterns with linear time complexities before tackling advanced graphs or DP.',
        tasks: [
          {
            id: 'sde2-p1-t1',
            title: 'Master Two Pointers & Sliding Window Patterns',
            description: 'Solve Two Sum, 3Sum, and Longest Substring Without Repeating Characters in Grind 75.',
            estimatedMinutes: 45,
            type: 'coding',
            deepLink: '/grind75',
            linkLabel: 'Open Grind 75 Planner'
          },
          {
            id: 'sde2-p1-t2',
            title: 'Review Defensive Corner Cases Checklist (Arrays & Linked Lists)',
            description: 'Study empty array blunders, integer overflow boundaries, and dummy head pointer techniques.',
            estimatedMinutes: 20,
            type: 'cheatsheet',
            deepLink: '/cheatsheets',
            linkLabel: 'Open Corner Cases Matrix'
          },
          {
            id: 'sde2-p1-t3',
            title: 'Stack & Fast/Slow Pointer Invariants',
            description: 'Complete Valid Parentheses, Min Stack, and Linked List Cycle with Floyd\'s cycle detection.',
            estimatedMinutes: 45,
            type: 'coding',
            deepLink: '/grind75',
            linkLabel: 'Open Grind 75'
          }
        ]
      },
      {
        id: 'sde2-phase-2',
        title: 'Phase 2: Trees, Graphs & Backtracking',
        weekLabel: 'Week 3 – 4',
        description: 'Conquer non-linear data structures: BFS level-order traversal, DFS cycle detection, and Top-K min heaps.',
        tasks: [
          {
            id: 'sde2-p2-t1',
            title: 'Binary Tree Validations & Lowest Common Ancestor',
            description: 'Invert Binary Tree, Validate BST (min/max boundary propagation), and Lowest Common Ancestor.',
            estimatedMinutes: 60,
            type: 'coding',
            deepLink: '/grind75',
            linkLabel: 'Practice Trees in Grind 75'
          },
          {
            id: 'sde2-p2-t2',
            title: 'Graph Traversals: Number of Islands & Clone Graph',
            description: 'Master 2D grid matrix BFS/DFS flood fills and tracking visited states to prevent infinite loops.',
            estimatedMinutes: 60,
            type: 'coding',
            deepLink: '/grind75',
            linkLabel: 'Practice Graphs in Grind 75'
          },
          {
            id: 'sde2-p2-t3',
            title: 'Generate Commute Audio Podcast for Graph & Heap Intuitions',
            description: 'Use the NotebookLM pack to listen to conversational breakdowns of graph trade-offs while traveling.',
            estimatedMinutes: 15,
            type: 'notebooklm',
            deepLink: '/notebooklm',
            linkLabel: 'Launch NotebookLM AI Hub'
          }
        ]
      },
      {
        id: 'sde2-phase-3',
        title: 'Phase 3: System Design, HLD & LLD Patterns',
        weekLabel: 'Week 5 – 6',
        description: 'Transition to architectural thinking: 4-step HLD framework, capacity sizing math, and GoF patterns.',
        tasks: [
          {
            id: 'sde2-p3-t1',
            title: 'Master the 4-Step System Design Interview Framework',
            description: 'Learn the exact 45-minute whiteboard allocation (Scoping -> HLD -> Core Deep Dive -> Scale & Bottlenecks).',
            estimatedMinutes: 30,
            type: 'system-design',
            deepLink: '/system-design',
            linkLabel: 'View 4-Step HLD Framework'
          },
          {
            id: 'sde2-p3-t2',
            title: 'Case Study Deep-Dive: Scalable URL Shortener (TinyURL)',
            description: 'Study Base62 encoding vs Key Generation Service (KGS) and 100:1 read caching architecture.',
            estimatedMinutes: 30,
            type: 'system-design',
            deepLink: '/system-design',
            linkLabel: 'View TinyURL Architecture'
          },
          {
            id: 'sde2-p3-t3',
            title: 'Case Study Deep-Dive: Twitter News Feed & Timeline Architecture',
            description: 'Master Fan-out on Write vs Fan-out on Read and the hybrid model for high-follower celebrities.',
            estimatedMinutes: 30,
            type: 'system-design',
            deepLink: '/system-design',
            linkLabel: 'View Twitter Feed Architecture'
          },
          {
            id: 'sde2-p3-t4',
            title: 'Low-Level Design (LLD) & GoF Patterns Playbook',
            description: 'Study Strategy, Observer, Factory, and Decorator patterns with TypeScript machine coding examples.',
            estimatedMinutes: 35,
            type: 'system-design',
            deepLink: '/system-design',
            linkLabel: 'View LLD & Design Patterns'
          }
        ]
      },
      {
        id: 'sde2-phase-4',
        title: 'Phase 4: STAR Stories, Bar Raiser & Reverse Interview',
        weekLabel: 'Week 7 – 8',
        description: 'Lock in your behavioral stories, eliminate passive language, and prepare high-signal questions for interviewers.',
        tasks: [
          {
            id: 'sde2-p4-t1',
            title: 'Draft 3 High-Impact Project STAR Stories',
            description: 'Use the interactive STAR Story Builder with Google\'s X-Y-Z formula helper to quantify metrics.',
            estimatedMinutes: 45,
            type: 'behavioral',
            deepLink: '/stories',
            linkLabel: 'Open STAR Story Wizard'
          },
          {
            id: 'sde2-p4-t2',
            title: 'Review Top 30 FAANG Behavioral Questions & Amazon 16 LPs',
            description: 'Prepare answers for technical conflict, impossible deadlines, and production outage post-mortems.',
            estimatedMinutes: 30,
            type: 'behavioral',
            deepLink: '/stories',
            linkLabel: 'View Top 30 FAANG Bank'
          },
          {
            id: 'sde2-p4-t3',
            title: 'Select Your Top 5 Reverse Interview Questions',
            description: 'Choose high-signal questions to ask your interviewers regarding tech debt, on-call health, and leveling.',
            estimatedMinutes: 15,
            type: 'behavioral',
            deepLink: '/stories',
            linkLabel: 'Open Reverse Interview Hub'
          }
        ]
      }
    ]
  },
  {
    id: 'crash-sprint-14d',
    title: '14-Day Crash Sprint (Interview in 2 Weeks)',
    badge: 'High Velocity (2 Wks)',
    emoji: '⚡',
    targetAudience: 'Candidates with interviews scheduled in the next 1–2 weeks needing maximum ROI.',
    durationWeeks: '2 Weeks (14 Days)',
    weeklyDedication: '15–20 hrs/week',
    description: 'High-density, ruthlessly prioritized crash sprint focusing exclusively on high-frequency Blind 25 patterns, the 4-step HLD framework, and rapid STAR story calibration.',
    phases: [
      {
        id: 'crash-phase-1',
        title: 'Week 1: High-Yield DSA & Fast Recall',
        weekLabel: 'Days 1 – 7',
        description: 'Lock in the top 25 most repeated algorithmic patterns and memorize critical edge cases.',
        tasks: [
          {
            id: 'crash-p1-t1',
            title: 'Grind 75 Week 1 & 2 High-Frequency Core',
            description: 'Solve Two Sum, Valid Parentheses, Merge Two Sorted Lists, Best Time to Buy Stock, and Binary Search.',
            estimatedMinutes: 60,
            type: 'coding',
            deepLink: '/grind75',
            linkLabel: 'Launch Grind 75'
          },
          {
            id: 'crash-p1-t2',
            title: 'Memorize Algorithmic Corner Cases & Defensive Checklist',
            description: 'Review the 6-category defensive matrix for arrays, linked lists, trees, and dynamic programming.',
            estimatedMinutes: 25,
            type: 'cheatsheet',
            deepLink: '/cheatsheets',
            linkLabel: 'Open Corner Cases Sheet'
          },
          {
            id: 'crash-p1-t3',
            title: 'Active Recall Flashcards (Spaced Repetition Drill)',
            description: 'Review 20 fast-recall flashcards covering JavaScript quirks, React 19 performance, and Big-O.',
            estimatedMinutes: 15,
            type: 'cheatsheet',
            deepLink: '/quiz',
            linkLabel: 'Launch Flashcards'
          }
        ]
      },
      {
        id: 'crash-phase-2',
        title: 'Week 2: System Design & Behavioral Polish',
        weekLabel: 'Days 8 – 14',
        description: 'Master the 4-step HLD whiteboard structure, review Twitter/TinyURL, and finalize 3 STAR stories.',
        tasks: [
          {
            id: 'crash-p2-t1',
            title: 'Memorize System Design Latency Numbers & Capacity Math',
            description: 'Learn L1 vs RAM vs SSD latencies and 100M daily request to QPS conversion formulas.',
            estimatedMinutes: 20,
            type: 'cheatsheet',
            deepLink: '/cheatsheets',
            linkLabel: 'Open Latency Numbers Sheet'
          },
          {
            id: 'crash-p2-t2',
            title: 'Study 4-Step HLD Framework + Twitter Timeline Blueprint',
            description: 'Understand the standard 45-min whiteboard timeline and hybrid fan-out caching.',
            estimatedMinutes: 40,
            type: 'system-design',
            deepLink: '/system-design',
            linkLabel: 'Open System Design Hub'
          },
          {
            id: 'crash-p2-t3',
            title: 'Draft 2 STAR Stories with Google X-Y-Z Metrics',
            description: 'Structure 1 technical accomplishment story and 1 production conflict story.',
            estimatedMinutes: 30,
            type: 'behavioral',
            deepLink: '/stories',
            linkLabel: 'Open STAR Story Wizard'
          }
        ]
      }
    ]
  },
  {
    id: 'frontend-mobile',
    title: 'Frontend & Mobile Specialist Pathway',
    badge: 'Specialist (4–6 Wks)',
    emoji: '📱',
    targetAudience: 'Frontend, React, React Native, and Web Platform Engineers.',
    durationWeeks: '4–6 Weeks',
    weeklyDedication: '8–10 hrs/week',
    description: 'Deep dive into JavaScript engine internals, Event Loop execution order, React 19 Fiber reconciliation, mobile list virtualization, and DOM machine coding.',
    phases: [
      {
        id: 'fe-phase-1',
        title: 'Phase 1: JavaScript Engine & Web Platform Mechanics',
        weekLabel: 'Week 1 – 2',
        description: 'Microtasks vs Macrotasks, requestAnimationFrame, closure scopes, and prototype inheritance.',
        tasks: [
          {
            id: 'fe-p1-t1',
            title: 'Master JS Engine & Event Loop Execution Priority',
            description: 'Solve the output order quiz: Synchronous -> Microtasks -> Render -> Macrotasks.',
            estimatedMinutes: 25,
            type: 'cheatsheet',
            deepLink: '/cheatsheets',
            linkLabel: 'View JS Event Loop Sheet'
          },
          {
            id: 'fe-p1-t2',
            title: 'Lydia Hallie\'s Advanced JavaScript Questions Collection',
            description: 'Practice tricky scoping, hoisting, coercion, and `this` binding interview puzzles.',
            estimatedMinutes: 45,
            type: 'reading',
            deepLink: '/resources',
            linkLabel: 'Open Lydia Hallie JS Bank'
          },
          {
            id: 'fe-p1-t3',
            title: 'BFE.dev / JavaScript30 Machine Coding Challenges',
            description: 'Build debounce, throttle, deep clone, and EventEmitter from scratch in Vanilla JS.',
            estimatedMinutes: 60,
            type: 'reading',
            deepLink: '/resources',
            linkLabel: 'Open JS30 & BFE.dev'
          }
        ]
      },
      {
        id: 'fe-phase-2',
        title: 'Phase 2: React 19, Virtualization & Mobile Architecture',
        weekLabel: 'Week 3 – 4',
        description: 'React Fiber reconciliation, Context performance traps, and Mobile list recycling.',
        tasks: [
          {
            id: 'fe-p2-t1',
            title: 'Study React 19 & React Native Performance Matrix',
            description: 'Learn why inline JSX functions drop frames and how FlashList recycles native views.',
            estimatedMinutes: 30,
            type: 'cheatsheet',
            deepLink: '/cheatsheets',
            linkLabel: 'View React Perf Sheet'
          },
          {
            id: 'fe-p2-t2',
            title: 'Mobile List Virtualization Blueprint (FlatList vs FlashList)',
            description: 'Deep dive into cell recycling, estimatedItemSize, and windowSize tuning.',
            estimatedMinutes: 30,
            type: 'system-design',
            deepLink: '/system-design',
            linkLabel: 'View Mobile Virtualization Blueprint'
          },
          {
            id: 'fe-p2-t3',
            title: 'Offline-First Mobile Architecture with SQLite & CRDTs',
            description: 'Study outbox sync patterns, optimistic UI updates, and conflict resolution.',
            estimatedMinutes: 30,
            type: 'system-design',
            deepLink: '/system-design',
            linkLabel: 'View Offline Sync Blueprint'
          }
        ]
      }
    ]
  },
  {
    id: 'backend-ai',
    title: 'Backend, Distributed Systems & AI Pathway',
    badge: 'Architecture (6–8 Wks)',
    emoji: '🤖',
    targetAudience: 'Backend, Distributed Systems, ML/AI Engineers, and Cloud Architects.',
    durationWeeks: '6–8 Weeks',
    weeklyDedication: '10–14 hrs/week',
    description: 'Master distributed consensus (Raft), CAP/PACELC theorems, PostgreSQL query optimization, Kafka event streaming, and modern LLM / ML System Design.',
    phases: [
      {
        id: 'be-phase-1',
        title: 'Phase 1: Databases, Caching & Event Streaming',
        weekLabel: 'Week 1 – 3',
        description: 'PostgreSQL indexing, MVCC, Redis data structures, and Apache Kafka topic partitioning.',
        tasks: [
          {
            id: 'be-p1-t1',
            title: 'Study Distributed Systems Core Concepts Handbook',
            description: 'Master CAP Theorem, PACELC, Consistency Models, and Availability Patterns.',
            estimatedMinutes: 35,
            type: 'system-design',
            deepLink: '/system-design',
            linkLabel: 'View Distributed Systems Handbook'
          },
          {
            id: 'be-p1-t2',
            title: 'PostgreSQL Internals & Query Optimization (EXPLAIN ANALYZE)',
            description: 'Deep dive into B-Trees, GIN indexes, MVCC, row locks, and Write-Ahead Logs (WAL).',
            estimatedMinutes: 30,
            type: 'reading',
            deepLink: '/resources',
            linkLabel: 'Open PostgreSQL Resources'
          },
          {
            id: 'be-p1-t3',
            title: 'Redis University & Confluent Kafka Architecture Guides',
            description: 'Study Redis Sorted Sets, Streams, Lua scripts, and Kafka exactly-once semantics.',
            estimatedMinutes: 40,
            type: 'reading',
            deepLink: '/resources',
            linkLabel: 'Open Backend Resources'
          }
        ]
      },
      {
        id: 'be-phase-2',
        title: 'Phase 2: High-Level Distributed Case Studies & AI Systems',
        weekLabel: 'Week 4 – 6',
        description: 'Design massive-scale web crawlers, rate limiters, and Machine Learning training/inference pipelines.',
        tasks: [
          {
            id: 'be-p2-t1',
            title: 'Case Study: Distributed Web Crawler (Google / Bing)',
            description: 'URL Frontier politeness queues, Bloom Filters for deduplication, and SimHash fingerprinting.',
            estimatedMinutes: 40,
            type: 'system-design',
            deepLink: '/system-design',
            linkLabel: 'View Web Crawler Blueprint'
          },
          {
            id: 'be-p2-t2',
            title: 'Distributed Rate Limiter Design (Token Bucket + Redis Lua)',
            description: 'Master sliding window counters, token bucket algorithms, and atomic Redis Lua execution.',
            estimatedMinutes: 30,
            type: 'system-design',
            deepLink: '/system-design',
            linkLabel: 'View Rate Limiter Blueprint'
          },
          {
            id: 'be-p2-t3',
            title: 'Chip Huyen ML System Design & Andrej Karpathy LLMs',
            description: 'Study vector database indexing (HNSW), feature stores (Feast), and transformer architectures.',
            estimatedMinutes: 45,
            type: 'reading',
            deepLink: '/resources',
            linkLabel: 'Open AI & ML Resources'
          }
        ]
      }
    ]
  },
  {
    id: 'sde1-foundations',
    title: 'Campus to SDE-1 / Graduate Fast Track',
    badge: 'Foundations (4–6 Wks)',
    emoji: '🎓',
    targetAudience: 'University grads, bootcamp students, and early-career developers entering the tech industry.',
    durationWeeks: '4–6 Weeks',
    weeklyDedication: '10–12 hrs/week',
    description: 'Master core CS fundamentals, Big-O analysis, Grind 75 foundational 40 problems, Object-Oriented Design (OOD), and entry-level behavioral interview etiquette.',
    phases: [
      {
        id: 'sde1-phase-1',
        title: 'Phase 1: Big-O & Essential Data Structures',
        weekLabel: 'Week 1 – 2',
        description: 'Array manipulations, HashMaps, Two-Pointer technique, and Big-O time/space tradeoffs.',
        tasks: [
          {
            id: 'sde1-p1-t1',
            title: 'Two Sum & Contains Duplicate (Arrays & HashMaps)',
            description: 'Learn trading O(N) space for O(N) time vs brute-force O(N^2) comparison.',
            estimatedMinutes: 30,
            type: 'coding',
            deepLink: '/grind75',
            linkLabel: 'Open Grind 75 Foundations'
          },
          {
            id: 'sde1-p1-t2',
            title: 'Valid Palindrome & Valid Anagram (Strings & Two Pointers)',
            description: 'Master ASCII character arrays, pointer convergence, and character frequency maps.',
            estimatedMinutes: 30,
            type: 'coding',
            deepLink: '/grind75',
            linkLabel: 'Practice String Patterns'
          },
          {
            id: 'sde1-p1-t3',
            title: 'Fast-Recall Flashcards: Big-O & Data Structure Complexities',
            description: 'Drill average vs worst case search, insert, and delete times across Array, LinkedList, BST, and Heap.',
            estimatedMinutes: 15,
            type: 'cheatsheet',
            deepLink: '/quiz',
            linkLabel: 'Open Flashcards Drill'
          }
        ]
      },
      {
        id: 'sde1-phase-2',
        title: 'Phase 2: Recursion, Trees & Resume STAR Stories',
        weekLabel: 'Week 3 – 4',
        description: 'Binary tree traversals (Inorder/Preorder/Postorder), recursion base cases, and college project stories.',
        tasks: [
          {
            id: 'sde1-p2-t1',
            title: 'Maximum Depth of Binary Tree & Invert Tree',
            description: 'Understand recursive stack frame mechanics and base condition termination.',
            estimatedMinutes: 35,
            type: 'coding',
            deepLink: '/grind75',
            linkLabel: 'Practice Trees in Grind 75'
          },
          {
            id: 'sde1-p2-t2',
            title: 'Structure 2 Academic / Capstone Project STAR Stories',
            description: 'Quantify personal technical contribution in team projects using Google X-Y-Z formula.',
            estimatedMinutes: 30,
            type: 'behavioral',
            deepLink: '/stories',
            linkLabel: 'Open STAR Story Wizard'
          },
          {
            id: 'sde1-p2-t3',
            title: 'Top 10 Junior Behavioral Questions & Reverse Questions',
            description: 'Prepare answers for "Tell me about a time you had to learn a new framework quickly".',
            estimatedMinutes: 20,
            type: 'behavioral',
            deepLink: '/stories',
            linkLabel: 'Open Behavioral Hub'
          }
        ]
      }
    ]
  }
];

export const LEVELING_MATRIX = [
  {
    level: 'SDE-1 / Junior (L3 / L4)',
    focus: 'Task Execution & Clean Code',
    dsaExpectation: 'Easy/Medium LeetCode (Arrays, Strings, Trees, HashMaps)',
    systemDesignExpectation: 'Basic API design & relational schema design',
    behavioralExpectation: 'Collaboration, eager to learn, overcoming blockers'
  },
  {
    level: 'SDE-2 / Mid-Level (L4 / L5)',
    focus: 'End-to-End Feature Ownership',
    dsaExpectation: 'Medium LeetCode + Edge cases (Graphs, DP, Heaps, Intervals)',
    systemDesignExpectation: 'HLD + LLD (Caching, Caching invalidation, DB sharding, GoF patterns)',
    behavioralExpectation: 'Technical conflict resolution, driving velocity, mentoring interns'
  },
  {
    level: 'SDE-3 / Lead / Staff (L6 / L7)',
    focus: 'Multi-Team Architecture & Strategy',
    dsaExpectation: 'High-speed optimal pattern matching + concurrency correctness',
    systemDesignExpectation: 'Massive scale (Multi-Region active-active, consensus, Chaos, FinOps)',
    behavioralExpectation: 'Cross-team consensus, technical RFCs, Bar Raiser hiring leadership'
  }
];
