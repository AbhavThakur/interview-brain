export interface SyllabusTopic {
  id: string;
  name: string;
  description: string;
  learnLink?: string;
  practiceLink?: string;
  deepLink?: string;
  linkLabel?: string;
  sandboxLink?: string;
  sandboxLabel?: string;
  tags?: string[];
}

export interface SyllabusStage {
  id: string;
  stageNumber: number;
  title: string;
  emoji: string;
  badge: string;
  description: string;
  whyItMatters: string;
  topics: SyllabusTopic[];
}

export const COMPREHENSIVE_SYLLABUS: SyllabusStage[] = [
  {
    id: 'stage-1-dsa-structures',
    stageNumber: 1,
    title: 'Data Structures Mastery',
    emoji: '🧱',
    badge: 'Foundation',
    description: 'The foundation of all algorithmic problem solving. Master memory layout, access times, insertion/deletion overhead, and trade-offs for all 13 primary data structures.',
    whyItMatters: 'Every coding round begins by identifying the optimal data structure to represent input states in minimal time and space.',
    topics: [
      {
        id: 'ds-array',
        name: 'Arrays & Dynamic Arrays (ArrayList / Vector)',
        description: 'Contiguous memory, cache locality, prefix sums, circular arrays, and two-pointer traversal techniques.',
        deepLink: '/grind75',
        linkLabel: 'Practice in Grind 75',
        sandboxLink: 'https://visualgo.net/en/array',
        sandboxLabel: 'VisuAlgo Array Sandbox ⚡',
        tags: ['O(1) Access', 'Prefix Sums', 'Two Pointers']
      },
      {
        id: 'ds-string',
        name: 'Strings & String Matching',
        description: 'Immutable vs mutable strings, StringBuilder, ASCII/Unicode char arrays, frequency counts, and anagram verification.',
        deepLink: '/grind75',
        linkLabel: 'Practice Strings',
        sandboxLink: 'https://regex101.com/',
        sandboxLabel: 'Regex101 Debugger ⚡',
        tags: ['Frequency Maps', 'Sliding Window', 'Palindromes']
      },
      {
        id: 'ds-linkedlist',
        name: 'Linked Lists (Singly, Doubly & Circular)',
        description: 'Pointer manipulation, dummy head nodes, fast/slow Floyd cycle detection, in-place reversal, and LRU cache doubly-linked lists.',
        deepLink: '/cheatsheets',
        linkLabel: 'Corner Cases & Invariants',
        sandboxLink: 'https://pythontutor.com/',
        sandboxLabel: 'Python Tutor Pointer Visualizer ⚡',
        tags: ['Floyd Cycle', 'Dummy Head', 'In-Place Reversal']
      },
      {
        id: 'ds-stack',
        name: 'Stacks & Monotonic Stacks',
        description: 'LIFO structure, parenthesis matching, infix to postfix, expression evaluation, and Next Greater Element using Monotonic Stacks.',
        deepLink: '/grind75',
        linkLabel: 'Practice Stacks',
        sandboxLink: 'https://visualgo.net/en/stack',
        sandboxLabel: 'VisuAlgo Stack Sandbox ⚡',
        tags: ['LIFO', 'Monotonic Stack', 'Valid Parentheses']
      },
      {
        id: 'ds-queue',
        name: 'Queues, Deque & Circular Buffers',
        description: 'FIFO structure, double-ended queues (Deque), BFS level-order queue, and Sliding Window Maximum.',
        deepLink: '/grind75',
        linkLabel: 'Practice Queues',
        sandboxLink: 'https://visualgo.net/en/queue',
        sandboxLabel: 'VisuAlgo Queue Sandbox ⚡',
        tags: ['FIFO', 'Deque', 'BFS Queue']
      },
      {
        id: 'ds-trees',
        name: 'Binary Trees & Tree Traversals',
        description: 'Inorder, Preorder, Postorder, Level-order BFS, tree height, maximum diameter, and Lowest Common Ancestor (LCA).',
        deepLink: '/grind75',
        linkLabel: 'Practice Trees',
        sandboxLink: 'https://visualgo.net/en/bst',
        sandboxLabel: 'VisuAlgo Tree Visualizer ⚡',
        tags: ['Traversals', 'LCA', 'Recursion']
      },
      {
        id: 'ds-bst',
        name: 'Binary Search Trees (BST) & Self-Balancing Trees',
        description: 'BST invariants (left < root < right), BST validation with min/max bounds, insertion, deletion, and AVL / Red-Black Tree concepts.',
        deepLink: '/cheatsheets',
        linkLabel: 'BST Validation Rules',
        sandboxLink: 'https://visualgo.net/en/avl',
        sandboxLabel: 'VisuAlgo AVL Tree Rotations ⚡',
        tags: ['BST Invariants', 'Boundary Validation', 'Inorder Sort']
      },
      {
        id: 'ds-heap',
        name: 'Heaps & Priority Queues',
        description: 'Min-Heap and Max-Heap, binary heap array representation, heapify in O(N), Top-K Frequent Elements, and K-Way Merge.',
        deepLink: '/grind75',
        linkLabel: 'Practice Heaps',
        sandboxLink: 'https://visualgo.net/en/heap',
        sandboxLabel: 'VisuAlgo Binary Heap Sandbox ⚡',
        tags: ['Top-K Elements', 'O(log N)', 'K-Way Merge']
      },
      {
        id: 'ds-hashing',
        name: 'Hash Tables & Hash Maps',
        description: 'Hash functions, collision resolution (Chaining vs Open Addressing), load factors, rehashing, and O(1) lookups.',
        deepLink: '/qa',
        linkLabel: 'Review Hash Bank',
        tags: ['O(1) Lookup', 'Collisions', 'Two Sum']
      },
      {
        id: 'ds-graphs',
        name: 'Graphs (Adjacency Matrix & Adjacency List)',
        description: 'Directed vs Undirected graphs, weighted graphs, cycle detection, topological sorting, and connected components.',
        deepLink: '/grind75',
        linkLabel: 'Practice Graphs',
        sandboxLink: 'https://visualgo.net/en/graphds',
        sandboxLabel: 'VisuAlgo Graph Traversal ⚡',
        tags: ['Adjacency List', 'Topological Sort', 'Cycle Detection']
      },
      {
        id: 'ds-matrix',
        name: '2D Matrices & Grid Graphs',
        description: 'Row-major vs column-major traversal, spiral order traversal, matrix rotation, and grid BFS/DFS flood fill.',
        deepLink: '/grind75',
        linkLabel: 'Practice Matrix Grid',
        tags: ['Grid BFS/DFS', 'Spiral Traversal', 'Number of Islands']
      },
      {
        id: 'ds-trie',
        name: 'Trie (Prefix Tree)',
        description: 'Prefix search, autocomplete dictionary implementation, word break with Trie, and bitwise XOR tries.',
        deepLink: '/coding',
        linkLabel: 'View Trie Matrix',
        sandboxLink: 'https://visualgo.net/en/trie',
        sandboxLabel: 'VisuAlgo Trie Sandbox ⚡',
        tags: ['Prefix Search', 'Autocomplete', 'Dictionary']
      },
      {
        id: 'ds-dsu',
        name: 'Disjoint Set Union (DSU / Union-Find)',
        description: 'Disjoint set data structure, path compression, union by rank, and cycle detection in undirected graphs.',
        deepLink: '/coding',
        linkLabel: 'View DSU Practice',
        sandboxLink: 'https://visualgo.net/en/ufds',
        sandboxLabel: 'VisuAlgo Union-Find Sandbox ⚡',
        tags: ['Union-Find', 'Path Compression', 'Connected Components']
      }
    ]
  },
  {
    id: 'stage-2-algorithms',
    stageNumber: 2,
    title: 'Algorithms & Complexity Paradigms',
    emoji: '⚡',
    badge: 'Core Problem Solving',
    description: 'Systematic algorithmic patterns for optimizing time and space complexities from exponential brute force to linear and logarithmic solutions.',
    whyItMatters: 'Top product companies evaluate your ability to recognize algorithmic patterns quickly and write bug-free code under 20–30 minutes.',
    topics: [
      {
        id: 'algo-asymptotic',
        name: 'Asymptotic Analysis & Big-O Notation',
        description: 'Time and space complexity formulas, Big-O, Big-Omega, Big-Theta, and Master Theorem for recursion.',
        deepLink: '/cheatsheets',
        linkLabel: 'View Big-O Cheat Sheet',
        sandboxLink: '/tools',
        sandboxLabel: 'Interactive Latency & Complexity Tool ⚡',
        tags: ['Big-O', 'Space Complexity', 'Master Theorem']
      },
      {
        id: 'algo-searching',
        name: 'Searching & Binary Search Variants',
        description: 'Standard Binary Search, search in rotated sorted array, find first and last occurrence, and Binary Search on Answer Space.',
        deepLink: '/grind75',
        linkLabel: 'Practice Binary Search',
        sandboxLink: 'https://visualgo.net/en/sorting',
        sandboxLabel: 'VisuAlgo Search & Sort ⚡',
        tags: ['O(log N)', 'Rotated Array', 'Answer Space']
      },
      {
        id: 'algo-sorting',
        name: 'Sorting Algorithms (QuickSort, MergeSort, HeapSort)',
        description: 'Divide and conquer sorting, stability, in-place vs extra memory, non-comparison sorts (Counting Sort, Radix Sort).',
        deepLink: '/cheatsheets',
        linkLabel: 'Sorting Complexities',
        sandboxLink: 'https://visualgo.net/en/sorting',
        sandboxLabel: 'VisuAlgo Animated Sorts ⚡',
        tags: ['MergeSort O(N log N)', 'QuickSort', 'Stability']
      },
      {
        id: 'algo-two-pointers',
        name: 'Two Pointers & Sliding Window',
        description: 'Opposite directional pointers, fast-slow pointers, fixed window size, dynamic expanding/shrinking sliding window.',
        deepLink: '/grind75',
        linkLabel: 'Practice Two Pointers',
        tags: ['Sliding Window', 'Two Pointers', 'O(N) Optimization']
      },
      {
        id: 'algo-greedy',
        name: 'Greedy Algorithms',
        description: 'Locally optimal choice for global optimum, Interval Scheduling / Meeting Rooms, Gas Station, and Huffman Coding.',
        deepLink: '/grind75',
        linkLabel: 'Practice Greedy in Grind 75',
        tags: ['Intervals', 'Meeting Rooms', 'Greedy Choice']
      },
      {
        id: 'algo-dp',
        name: 'Dynamic Programming (1D, 2D & Knapsack)',
        description: 'Overlapping subproblems, optimal substructure, memoization (top-down), tabulation (bottom-up), Climbing Stairs, Coin Change, and 0/1 Knapsack.',
        deepLink: '/grind75',
        linkLabel: 'Practice DP in Grind 75',
        sandboxLink: 'https://algorithm-visualizer.org/',
        sandboxLabel: 'Algorithm Visualizer DP ⚡',
        tags: ['Memoization', 'Tabulation', 'Knapsack']
      },
      {
        id: 'algo-backtracking',
        name: 'Backtracking & Recursion Tree',
        description: 'State space tree exploration, pruning, Subsets, Permutations, Combination Sum, and N-Queens problem.',
        deepLink: '/grind75',
        linkLabel: 'Practice Backtracking',
        sandboxLink: 'https://pythontutor.com/',
        sandboxLabel: 'Python Tutor Call-Stack ⚡',
        tags: ['Recursion Tree', 'Pruning', 'Subsets & Permutations']
      },
      {
        id: 'algo-graph-algos',
        name: 'Graph Algorithms (Dijkstra, BFS/DFS, TopoSort)',
        description: 'Shortest path with Dijkstra, topological sorting with Kahn\'s algorithm, Tarjan\'s strongly connected components, and Kruskal\'s MST.',
        deepLink: '/grind75',
        linkLabel: 'Practice Graph Algos',
        sandboxLink: 'https://visualgo.net/en/sssp',
        sandboxLabel: 'VisuAlgo Dijkstra Visualizer ⚡',
        tags: ['Dijkstra', 'Kahn Algorithm', 'Topological Sort']
      }
    ]
  },
  {
    id: 'stage-3-oops',
    stageNumber: 3,
    title: 'Object-Oriented Programming (OOP) & Design',
    emoji: '🏛️',
    badge: 'Software Architecture',
    description: 'Object-oriented programming paradigms, modular software design, SOLID principles, and GoF design patterns.',
    whyItMatters: 'Evaluates your code extensibility, separation of concerns, and readiness for Low-Level Design (LLD) machine coding rounds.',
    topics: [
      {
        id: 'oop-pillars',
        name: 'The 4 Pillars of OOP',
        description: 'Encapsulation (data hiding), Abstraction (interfaces/abstract classes), Inheritance (reusability), and Polymorphism (compile-time overloading vs runtime overriding).',
        deepLink: '/qa',
        linkLabel: 'View OOP Q&A Solutions',
        tags: ['Encapsulation', 'Polymorphism', 'Abstraction']
      },
      {
        id: 'oop-solid',
        name: 'SOLID Design Principles',
        description: 'Single Responsibility, Open/Closed Principle, Liskov Substitution, Interface Segregation, and Dependency Inversion.',
        deepLink: '/system-design',
        linkLabel: 'View SOLID & LLD Guide',
        tags: ['SOLID', 'Dependency Injection', 'Clean Code']
      },
      {
        id: 'oop-gof-patterns',
        name: 'GoF Design Patterns (Creational, Structural, Behavioral)',
        description: 'Strategy Pattern, Observer Pattern, Factory Method, Decorator Pattern, and Singleton with thread safety.',
        deepLink: '/system-design',
        linkLabel: 'View GoF TypeScript Blueprints',
        tags: ['Strategy', 'Observer', 'Factory', 'Decorator']
      },
      {
        id: 'oop-machine-coding',
        name: 'Low-Level Design (LLD) Machine Coding Practice',
        description: 'Design Parking Lot, Design Snake & Ladder, Design Rate Limiter class structure, and Tic-Tac-Toe.',
        deepLink: '/system-design',
        linkLabel: 'View Machine Coding Framework',
        sandboxLink: 'https://mermaid.live/',
        sandboxLabel: 'Mermaid Class Diagrammer ⚡',
        tags: ['Parking Lot', 'LLD', 'Class Diagrams']
      }
    ]
  },
  {
    id: 'stage-4-core-cs',
    stageNumber: 4,
    title: 'Core Computer Science Subjects (OS, CN, DBMS)',
    emoji: '💻',
    badge: 'Fundamentals',
    description: 'Theoretical and practical fundamentals of how Operating Systems execute code, Computer Networks transmit data, and Databases persist state.',
    whyItMatters: 'Essential for technical screening rounds and answering low-level systems questions asked by Google, Microsoft, and Amazon.',
    topics: [
      {
        id: 'cs-os',
        name: '4.1 Operating Systems (OS)',
        description: 'Processes vs Threads, Context Switching, CPU Scheduling algorithms, Process Synchronization (Mutex, Semaphores, Deadlock avoidance with Banker\'s Algorithm), and Virtual Memory & Paging.',
        deepLink: '/cheatsheets',
        linkLabel: 'View OS & Concurrency Sheets',
        tags: ['Processes vs Threads', 'Virtual Memory', 'Mutex/Semaphore']
      },
      {
        id: 'cs-cn',
        name: '4.2 Computer Networks (CN)',
        description: 'OSI 7-Layer and TCP/IP Models, TCP 3-Way Handshake vs UDP, HTTP 1.1 / HTTP/2 / HTTP/3 & WebSockets, DNS Resolution lifecycle, and SSL/TLS Handshake.',
        deepLink: '/qa',
        linkLabel: 'View Network Q&As',
        tags: ['TCP 3-Way Handshake', 'OSI Layers', 'DNS Flow']
      },
      {
        id: 'cs-dbms',
        name: '4.3 DBMS & Relational SQL',
        description: 'ACID properties, Database Normalization (1NF to BCNF), B+ Tree Indexing internals, SQL Joins, and Transaction Isolation Levels (Dirty reads, Phantom reads, Repeatable Read).',
        deepLink: '/resources',
        linkLabel: 'View Database & SQL Guides',
        sandboxLink: 'https://www.drawdb.app/',
        sandboxLabel: 'drawDB Schema Designer ⚡',
        tags: ['ACID', 'B+ Tree Indexing', 'Normalization', 'Isolation Levels']
      }
    ]
  },
  {
    id: 'stage-5-system-design',
    stageNumber: 5,
    title: 'System Design & High-Level Scalability (HLD)',
    emoji: '📐',
    badge: 'Architecture',
    description: 'Architecting distributed systems that scale to millions of users with high availability, low latency, and fault tolerance.',
    whyItMatters: 'The defining interview round for SDE-2, SDE-3, and Staff Engineers at FAANG and top product unicorns.',
    topics: [
      {
        id: 'sd-framework',
        name: 'The 4-Step 45-Minute HLD Interview Framework',
        description: 'Scope requirements -> Capacity estimation & SLA math -> High-level architecture -> Deep dive into bottlenecks & failure modes.',
        deepLink: '/system-design',
        linkLabel: 'View 4-Step HLD Blueprint',
        sandboxLink: '/tools',
        sandboxLabel: 'Capacity Estimator & Latency Tool ⚡',
        tags: ['4-Step Framework', 'Capacity Sizing', '45-Min Allocation']
      },
      {
        id: 'sd-distributed-concepts',
        name: 'Distributed Systems Handbook (CAP, PACELC, Sharding, Caching)',
        description: 'CAP Theorem, PACELC, Strong vs Eventual Consistency, Cache-aside vs Write-through, Database Sharding keys, and Master-Slave replication.',
        deepLink: '/system-design',
        linkLabel: 'View Distributed Systems Handbook',
        tags: ['CAP Theorem', 'PACELC', 'Sharding', 'Redis Caching']
      },
      {
        id: 'sd-case-studies',
        name: 'High-Frequency Case Studies (TinyURL, Twitter Feed, Web Crawler)',
        description: 'End-to-end case studies covering Base62 vs KGS, Fan-out on write vs read, Bloom filters, and URL Frontier queues.',
        deepLink: '/system-design',
        linkLabel: 'Explore Case Studies',
        sandboxLink: 'https://excalidraw.com/',
        sandboxLabel: 'Excalidraw Whiteboard ⚡',
        tags: ['TinyURL', 'Twitter Timeline', 'Web Crawler']
      },
      {
        id: 'sd-audio-podcast',
        name: 'NotebookLM Audio Podcast Grounding',
        description: 'Generate 15-minute 2-host conversational podcasts of system design trade-offs to listen during commutes.',
        deepLink: '/notebooklm',
        linkLabel: 'Launch NotebookLM Studio',
        tags: ['Audio Overview', 'Commute Podcast', 'AI Grounding']
      }
    ]
  },
  {
    id: 'stage-6-software-engineering',
    stageNumber: 6,
    title: 'Software Engineering & Developer Practices',
    emoji: '🛠️',
    badge: 'Engineering Excellence',
    description: 'Professional development workflows: SDLC, automated testing, Git branching strategies, CI/CD pipelines, and observability.',
    whyItMatters: 'Demonstrates to hiring managers that you write maintainable, production-ready code and thrive in collaborative engineering teams.',
    topics: [
      {
        id: 'se-sdlc',
        name: 'Software Development Life Cycle (SDLC & Agile)',
        description: 'Agile methodologies, Scrum sprints, Kanban flow, sprint planning, retrospective ceremonies, and code review etiquette.',
        deepLink: '/stories',
        linkLabel: 'View Team Workflows in Stories',
        tags: ['Agile & Scrum', 'Code Review', 'Sprint Planning']
      },
      {
        id: 'se-testing',
        name: 'Software Testing (Unit, Integration, E2E & TDD)',
        description: 'Test Pyramid, Test-Driven Development (TDD), mocking vs stubbing, boundary value analysis, and code coverage.',
        deepLink: '/resources',
        linkLabel: 'View Testing Best Practices',
        tags: ['Unit Testing', 'TDD', 'Mocking']
      },
      {
        id: 'se-git',
        name: 'Version Control (Git Branching, Rebase vs Merge)',
        description: 'Git flow, trunk-based development, resolving merge conflicts, git rebase vs merge, and semantic versioning.',
        deepLink: '/cheatsheets',
        linkLabel: 'View Developer Cheat Sheets',
        sandboxLink: 'https://learngitbranching.js.org/',
        sandboxLabel: 'Learn Git Branching Sandbox ⚡',
        tags: ['Git Rebase', 'Trunk-Based', 'Semantic Versioning']
      },
      {
        id: 'se-cicd',
        name: 'CI/CD Pipelines & Release Engineering',
        description: 'Continuous Integration with GitHub Actions, blue-green deployments, canary releases, and feature flags.',
        deepLink: '/resources',
        linkLabel: 'View 33+ Engineering Blogs',
        tags: ['GitHub Actions', 'Canary Release', 'Feature Flags']
      }
    ]
  },
  {
    id: 'stage-7-managerial',
    stageNumber: 7,
    title: 'Managerial & Technical Leadership Round',
    emoji: '👔',
    badge: 'Leadership',
    description: 'Technical conflict resolution, driving velocity, mentoring engineers, managing tech debt, and handling impossible deadlines.',
    whyItMatters: 'Determines your final engineering level (SDE-2 vs SDE-3 / Staff) and compensation band in the Hiring Committee.',
    topics: [
      {
        id: 'mgr-conflict',
        name: 'Technical Disagreements & Influence Without Authority',
        description: 'How to disagree and commit, backing architectural proposals with data, and resolving team impasses.',
        deepLink: '/stories',
        linkLabel: 'Open STAR Conflict Wizard',
        tags: ['Conflict Resolution', 'Data-Driven', 'Influence']
      },
      {
        id: 'mgr-techdebt',
        name: 'Tech Debt Mitigation & Refactoring Strategy',
        description: 'Pitching tech debt refactoring to product managers, measuring ROI, and incremental strangler fig migrations.',
        deepLink: '/stories',
        linkLabel: 'View Tech Debt STAR Stories',
        tags: ['Tech Debt', 'Strangler Fig', 'Product Alignment']
      },
      {
        id: 'mgr-mentorship',
        name: 'Mentorship & Engineering Team Velocity',
        description: 'Onboarding new hires, writing architectural RFCs, and establishing engineering documentation standards.',
        deepLink: '/stories',
        linkLabel: 'View Leadership Stories',
        tags: ['Mentorship', 'RFCs', 'Team Velocity']
      }
    ]
  },
  {
    id: 'stage-8-hr-behavioral',
    stageNumber: 8,
    title: 'HR Round, Cultural Fit & Salary Negotiation',
    emoji: '🤝',
    badge: 'Closing the Offer',
    description: 'Mastering the final HR screen, Google X-Y-Z behavioral storytelling, avoiding common interview mistakes, and offer negotiation.',
    whyItMatters: 'Translates strong technical performance into a top-of-band job offer and helps you vet the company culture.',
    topics: [
      {
        id: 'hr-star-rubric',
        name: 'The FAANG STAR Rubric & Google X-Y-Z Formula',
        description: 'Situation (15%), Task (15%), Action (50%), Result (20%) + "Accomplished [X], as measured by [Y], by doing [Z]".',
        deepLink: '/stories',
        linkLabel: 'Open Interactive STAR Builder',
        tags: ['STAR Rubric', 'Google X-Y-Z', 'Quantified Metrics']
      },
      {
        id: 'hr-amazon-lps',
        name: 'Top 30 FAANG Questions Mapped to Amazon 16 LPs',
        description: 'Customer Obsession, Ownership, Bias for Action, Dive Deep, Earn Trust, and Deliver Results.',
        deepLink: '/stories',
        linkLabel: 'View Top 30 FAANG Bank',
        tags: ['Amazon 16 LPs', 'Customer Obsession', 'Ownership']
      },
      {
        id: 'hr-reverse-interview',
        name: 'Reverse Interview: High-Signal Questions to Ask',
        description: 'Green flags and red flags to look for when interviewing your future engineering manager and peers.',
        deepLink: '/stories',
        linkLabel: 'Open Reverse Interview Hub',
        tags: ['Reverse Interview', 'Green Flags', 'Culture Vetting']
      },
      {
        id: 'hr-mistakes-negotiation',
        name: '12 Common Interview Mistakes & Offer Negotiation',
        description: 'Passive "we" language traps, rambling without metrics, and standard equity / base salary negotiation scripts.',
        deepLink: '/stories',
        linkLabel: 'View Behavioral Guide',
        tags: ['Salary Negotiation', 'Common Mistakes', 'Offer Strategy']
      }
    ]
  }
];
