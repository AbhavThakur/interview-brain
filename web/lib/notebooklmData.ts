export interface NotebookLMPrompt {
  id: string;
  title: string;
  category: 'audio' | 'system-design' | 'behavioral' | 'dsa' | 'warmup' | 'reverse';
  badge: string;
  emoji: string;
  description: string;
  prompt: string;
  tips: string[];
}

export interface SourcePack {
  id: string;
  title: string;
  emoji: string;
  badge: string;
  description: string;
  targetUse: string;
  fileCount: string;
  downloadParam: string;
  highlights: string[];
}

export const SOURCE_PACKS: SourcePack[] = [
  {
    id: 'pack-system-design',
    title: 'System Design & Distributed Architecture Pack',
    emoji: '📐',
    badge: '11 Blueprints + Primer',
    description: 'Complete HLD framework, Distributed Systems handbook, URL shortener, Twitter feed, Web crawler, GoF design patterns, machine coding blueprints, mobile virtualization, and real-time chat architecture.',
    targetUse: 'Perfect for 45-min System Design mock interviews, tradeoff grilling, and commute Audio Podcasts.',
    fileCount: '11 Architecture Blueprints',
    downloadParam: 'system-design',
    highlights: [
      'The 4-Step HLD Interview Framework with 45-min time allocation',
      'Distributed Systems Handbook (CAP/PACELC, Caching, Sharding, Consistency)',
      'TinyURL, Twitter Timeline, and Distributed Web Crawler deep dives',
      'GoF Design Patterns (Strategy, Observer, Factory, Decorator) with TypeScript'
    ]
  },
  {
    id: 'pack-grind75',
    title: 'Grind 75 & Defensive Corner Cases Pack',
    emoji: '🧠',
    badge: '75 Problems + 6 Checklists',
    description: 'All 75 high-frequency LeetCode algorithmic problems categorized by pattern with time estimates, Ah-Ha mental models, plus the full Corner Cases & Defensive Checklist across Arrays, Linked Lists, Trees, Graphs, DP, and Intervals.',
    targetUse: 'Ideal for Socratic DSA code review, time/space complexity quizzing, and identifying subtle bug injections.',
    fileCount: '75 Problems + Defensive Matrix',
    downloadParam: 'grind75',
    highlights: [
      '75 Curated problems mapped across Blind 75 and NeetCode patterns',
      'Ah-Ha Insights: The single core intuition needed to solve each problem',
      'Complete Algorithmic Corner Cases matrix (Integer overflow, cycle detection, skewed trees)',
      'Subarray / window keyword to optimal algorithm mapping'
    ]
  },
  {
    id: 'pack-behavioral',
    title: 'STAR Stories, FAANG Questions & Reverse Interview Pack',
    emoji: '⭐',
    badge: 'Top 30 Questions + STAR Rubric',
    description: 'Your personal project STAR stories, FAANG 4-step scoring rubric, Google X-Y-Z formula, Top 30 FAANG Behavioral Questions mapped to Amazon 16 Leadership Principles, and Reverse Interview questions with green/red flags.',
    targetUse: 'Use to audit your personal project stories for passive language, missing metrics, and practice behavioral probing.',
    fileCount: '30 FAANG Questions + Reverse Bank',
    downloadParam: 'behavioral',
    highlights: [
      'Top 30 Behavioral Questions mapped to Amazon 16 Leadership Principles',
      'FAANG Behavioral Rubric (Situation 15%, Task 15%, Action 50%, Result 20%)',
      'Reverse Interview Questions (Tech debt, on-call health, promotion transparency)',
      'Google X-Y-Z formula guides for quantifying engineering impact'
    ]
  },
  {
    id: 'pack-master',
    title: 'Interview Brain Unified Master Grounding Binder',
    emoji: '👑',
    badge: 'All-in-One Complete Source',
    description: 'The ultimate unified knowledge base merging all System Design blueprints, Grind 75 insights, 140+ QA Bank solutions, Evergreen Topics, STAR stories, and Company prep sheets into one structured file.',
    targetUse: 'The complete multi-source grounding document for NotebookLM to turn it into your 24/7 personal tech mentor.',
    fileCount: 'Complete Platform Knowledge Base',
    downloadParam: 'master',
    highlights: [
      'All 11 System Design & Architecture blueprints',
      'Grind 75 problems + Complete Corner Cases Matrix',
      '140+ Q&A Bank Solutions (JavaScript, React, Node, SQL, Security)',
      'STAR stories and Top 30 FAANG Behavioral Questions'
    ]
  }
];

export const NOTEBOOKLM_PROMPTS: NotebookLMPrompt[] = [
  {
    id: 'prompt-audio-overview',
    title: 'Commute Audio Podcast Optimizer',
    category: 'audio',
    badge: 'Audio Overview',
    emoji: '🎙️',
    description: 'Guides NotebookLM to generate the highest-retention 10-15 minute audio conversation between 2 hosts focusing on core architecture trade-offs.',
    prompt: `Generate an engaging, natural 12-to-15 minute deep dive audio podcast discussing the System Design and Distributed Systems notes in my sources.

Focus the discussion on:
1. The 4-Step System Design Interview Framework and why candidates fail step 1 (scoping).
2. The core architectural trade-offs: Fan-out on Write vs Fan-out on Read in the Twitter Timeline, and Base62 vs Key Generation Service in TinyURL.
3. The most dangerous algorithmic corner cases that lead to candidate rejections.

Make the hosts challenge each other with real-world scenarios and engineering banter.`,
    tips: [
      'Click "Customize" in the Audio Overview panel in NotebookLM and paste this prompt before clicking Generate.',
      'Listen on mobile during your daily commute or morning workout.'
    ]
  },
  {
    id: 'prompt-bar-raiser-system-design',
    title: 'FAANG Staff / Bar Raiser System Design Grilling',
    category: 'system-design',
    badge: 'System Design',
    emoji: '🏛️',
    description: 'Simulates a ruthless 45-minute FAANG Staff / Principal interviewer questioning your design decisions with zero hallucinations.',
    prompt: `Act as an L6/L7 Staff Principal Engineer and Bar Raiser at Amazon / Meta. Based ONLY on the System Design blueprints and Distributed Systems handbook in my uploaded sources, conduct a strict mock interview.

Rules:
1. Pick one architecture scenario from my sources (e.g. Distributed Web Crawler, Twitter News Feed, or Rate Limiter).
2. Ask me ONE challenging question at a time about capacity sizing, bottleneck mitigation, or failure recovery.
3. Wait for my response.
4. After I answer, critique my response on a scale of 1-10, point out missing edge cases or faulty assumptions, and ask a harder follow-up question.
5. Do NOT hallucinate technologies outside our source documents.

Start now by introducing yourself and asking the first architectural question.`,
    tips: [
      'Respond as you would in a live whiteboard session with clear trade-offs.',
      'Quote capacity numbers and latency rules of thumb from the source notes.'
    ]
  },
  {
    id: 'prompt-star-auditor',
    title: 'STAR Story Vulnerability & Passive Language Auditor',
    category: 'behavioral',
    badge: 'Behavioral',
    emoji: '📝',
    description: 'Scans your project stories for passive "we" language, missing metric percentages, and generates hard probing questions.',
    prompt: `Act as a seasoned Senior Engineering Manager on a FAANG Hiring Committee. Analyze all my STAR behavioral stories and project notes in the sources.

Please perform a comprehensive 4-point audit:
1. Passive Language Audit: Flag every sentence where I used "we" or passive voice instead of highlighting my personal technical agency ("I designed", "I benchmarked").
2. Metric & X-Y-Z Scoring: Rate each story on Google's X-Y-Z formula: "Accomplished [X], as measured by [Y], by doing [Z]". Identify any story missing concrete quantified numbers.
3. Amazon Leadership Principle Mapping: Verify which Amazon LP each story best demonstrates.
4. The 3 Hardest Follow-ups: Give me the 3 most aggressive follow-up questions an interviewer will ask to test if I actually wrote the code or designed the system myself.`,
    tips: [
      'Paste your updated personal STAR draft in the chat to get instant scoring.',
      'Use the generated follow-ups to rehearse your answers out loud.'
    ]
  },
  {
    id: 'prompt-corner-case-hunter',
    title: 'Algorithmic Edge Case & Defensive Bug Hunter',
    category: 'dsa',
    badge: 'DSA & Algorithms',
    emoji: '⚡',
    description: 'Tests your defensive coding muscle memory by asking you to find edge cases before revealing solutions.',
    prompt: `Based strictly on the Grind 75 Ah-Ha insights and the Algorithmic Corner Cases Matrix in my source files, act as a Socratic Coding Interviewer.

Present me with 5 rapid algorithmic scenarios one by one across:
- Arrays & Sliding Window
- Binary Trees & BSTs
- Graphs & BFS/DFS
- Dynamic Programming base cases
- Linked Lists with cycles

For each scenario:
1. Describe a problem setup.
2. Ask me to list the top 3 corner cases / edge blunders that would cause a runtime crash or Wrong Answer.
3. Wait for my reply before giving feedback and revealing the next scenario.`,
    tips: [
      'Great for 10-minute warmups before starting daily Grind 75 practice.',
      'Focus on integer overflow, null pointers, and boundary conditions.'
    ]
  },
  {
    id: 'prompt-5min-warmup',
    title: '5-Minute Pre-Interview Rapid-Fire Flash Drill',
    category: 'warmup',
    badge: 'Pre-Interview',
    emoji: '⏱️',
    description: 'Rapid-fire 10-question flash quiz on latency numbers, event loop execution order, and GoF patterns.',
    prompt: `I have an interview in 15 minutes! Act as a high-speed drill coach based on my uploaded Cheat Sheets and Distributed Systems handbook.

Ask me 5 rapid-fire questions covering:
1. Exact latency numbers (L1 vs RAM vs SSD vs Datacenter RTT).
2. JS Event loop execution priority (Sync -> Microtask -> Render -> Macrotask).
3. The right GoF pattern for interchangeable algorithms (Strategy vs State vs Factory).
4. CAP Theorem / PACELC trade-off for social feeds vs financial ledgers.
5. QPS sizing conversion rule of thumb for 100M daily requests.

Ask all 5 questions together, let me answer, then give a quick score and concise corrections.`,
    tips: [
      'Run this drill 15 minutes before every technical screening call.',
      'Boosts confidence and locks in fast-recall muscle memory.'
    ]
  },
  {
    id: 'prompt-reverse-interview-matcher',
    title: 'Reverse Interview Strategy & Question Matcher',
    category: 'reverse',
    badge: 'Reverse Interview',
    emoji: '💬',
    description: 'Recommends the highest-signal questions to ask your interviewers tailored to their role.',
    prompt: `Based on the Reverse Interview Questions guide in my sources, help me prepare my questions for my upcoming interview loop.

I am interviewing with:
- Interviewer 1: Peer SDE-2 (Coding round)
- Interviewer 2: Staff / Principal Engineer (System Design round)
- Interviewer 3: Engineering Manager (Behavioral / Team fit)

For each interviewer, recommend the 2 best, highest-signal questions from my source guide to ask in the final 5-10 minutes, along with the specific Green Flags and Red Flags I should listen for in their answers.`,
    tips: [
      'Prepares you to interview the company and assess work-life balance and tech debt.',
      'Shows interviewers that you think like a senior engineering leader.'
    ]
  }
];
