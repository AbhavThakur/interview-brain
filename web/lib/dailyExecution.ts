import { GRIND_75_PROBLEMS, GrindProblem } from './grind75Data';
import { TOP_30_BEHAVIORAL_QUESTIONS, BehavioralQuestion } from './behavioralData';

export interface DailyCodingTask {
  problem: GrindProblem;
  isCompleted: boolean;
  status: 'todo' | 'attempted' | 'solved' | 'review';
  practiceUrl: string;
  leetcodeUrl: string;
}

export interface DailySystemDesignTask {
  id: string;
  title: string;
  category: string;
  focusArea: string;
  keyDiscussionPoints: string[];
  url: string;
}

export interface DailyBehavioralTask {
  question: BehavioralQuestion;
  targetPrinciple: string;
  suggestedFramework: 'STAR' | 'CAR' | 'XYZ';
  url: string;
}

export interface DailyExecutionPlan {
  dayOfWeek: string;
  formattedDate: string;
  totalEstimatedMinutes: number;
  coding: DailyCodingTask;
  systemDesign: DailySystemDesignTask;
  behavioral: DailyBehavioralTask;
  completedCount: number;
}

// Curated high-impact system design blueprints to rotate across weekdays
const CORE_SYSTEM_DESIGN_BLUEPRINTS = [
  {
    id: 'in-app-observability-anr-monitoring',
    title: 'In-App Observability & ANR Monitoring SDK',
    category: 'Mobile / Infrastructure',
    focusArea: 'Watchdog Threads & Batched Telemetry',
    keyDiscussionPoints: [
      'Choreographer & CADisplayLink frame drop detection',
      'SIGQUIT signal handlers and native crash unwinding',
      'Zero-allocation telemetry ring buffer with GZIP backoff sync'
    ],
    url: '/system-design#in-app-observability-anr-monitoring'
  },
  {
    id: 'offline-first-sqlite-bidirectional-sync',
    title: 'Offline-First SQLite Architecture & Conflict Sync',
    category: 'Data / Distributed Mobile',
    focusArea: 'Event Sourcing & Vector Clocks',
    keyDiscussionPoints: [
      'Append-only mutation journal with deterministic idempotency keys',
      'Three-way diff merge with Last-Write-Wins vs application-level resolver',
      'SQLite write ahead logging (WAL mode) and background worker isolation'
    ],
    url: '/system-design#offline-first-sqlite-bidirectional-sync'
  },
  {
    id: 'real-time-location-quadtree-tracking',
    title: 'Uber/Lyft Real-Time Geospatial Driver Dispatch',
    category: 'High-Level Distributed Systems',
    focusArea: 'Geo-Hashing & QuadTrees',
    keyDiscussionPoints: [
      'Spatial indexing: Google S2 vs Uber H3 hexagonal hierarchical cells',
      'WebSocket connection termination at Envoy with Redis Pub/Sub',
      'Driver heartbeat deduplication and Kalman filter GPS smoothing'
    ],
    url: '/system-design#real-time-location-quadtree-tracking'
  },
  {
    id: 'upi-payment-gateway-idempotency',
    title: 'PhonePe/Razorpay Distributed Payment Gateway',
    category: 'Fintech & Resiliency',
    focusArea: 'Distributed Transactions & 2PC / Sagas',
    keyDiscussionPoints: [
      'Strict idempotency locks using Redis SETNX with database commit tokens',
      'Dual-entry accounting ledger with double-entry immutability',
      'Dead-letter queues (DLQ) with exponential jitter reconciliation polling'
    ],
    url: '/system-design#upi-payment-gateway-idempotency'
  },
  {
    id: 'high-concurrency-notification-feed',
    title: 'Fan-Out Notification & Real-time Activity Feed',
    category: 'HLD Architecture',
    focusArea: 'Fan-Out on Write vs Fan-Out on Read',
    keyDiscussionPoints: [
      'Hybrid fan-out for celebrity accounts vs standard followers',
      'Tiered caching: Redis Sorted Sets for active users + Cassandra cold storage',
      'Rate-limiting token bucket per user at API Gateway layer'
    ],
    url: '/system-design#high-concurrency-notification-feed'
  },
  {
    id: 'chunked-resumable-media-uploader',
    title: 'Resumable Chunked Media Uploader SDK (S3/Cloudflare)',
    category: 'Mobile / Storage',
    focusArea: 'Multipart Uploads & Network Flakiness',
    keyDiscussionPoints: [
      'TUS protocol implementation with checksum validation per 4MB chunk',
      'Concurrent chunk worker pool with dynamic bandwidth backoff',
      'Background execution guarantees on iOS (BGProcessingTask) and Android WorkManager'
    ],
    url: '/system-design#chunked-resumable-media-uploader'
  },
  {
    id: 'low-latency-live-chat-engine',
    title: 'Slack / Discord High-Throughput Chat Engine',
    category: 'Real-time Messaging',
    focusArea: 'WebSockets & Message Ordering',
    keyDiscussionPoints: [
      'Snowflake ID generation for strict monotonically increasing message sequences',
      'Read receipts and delivery acknowledgments with Kafka consumer groups',
      'Local client cache optimistic updates with rollback on network failure'
    ],
    url: '/system-design#low-latency-live-chat-engine'
  }
];

export interface DailyExecutionOptions {
  difficultyFilter?: 'All' | 'Easy' | 'Medium' | 'Hard';
  shuffleOffset?: number;
  customDate?: Date;
}

export function getDailyExecutionPlan(
  codingStatus: Record<string, string> = {},
  completedTasksToday: string[] = [],
  options?: DailyExecutionOptions | Date
): DailyExecutionPlan {
  const opts: DailyExecutionOptions =
    options instanceof Date ? { customDate: options } : options || {};

  const now = opts.customDate || new Date();
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = dayNames[now.getDay()];
  
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  // Calculate day-of-year index for deterministic daily rotations
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // 1. CODING: Filter by difficulty preference if specified
  const diffFilter = opts.difficultyFilter || 'All';
  const pool = diffFilter === 'All'
    ? GRIND_75_PROBLEMS
    : GRIND_75_PROBLEMS.filter((p) => p.difficulty === diffFilter);

  const fallbackPool = pool.length > 0 ? pool : GRIND_75_PROBLEMS;

  // Find candidate problems not solved
  let eligible = fallbackPool.filter((p) => {
    const status = codingStatus[p.id];
    return !status || status === 'todo';
  });

  // If all in pool are started or solved, check for review or attempted
  if (eligible.length === 0) {
    eligible = fallbackPool.filter((p) => {
      const status = codingStatus[p.id];
      return status === 'review' || status === 'attempted';
    });
  }

  // If still empty (all solved), use entire fallback pool
  if (eligible.length === 0) {
    eligible = fallbackPool;
  }

  // Apply shuffle offset
  const offset = Math.abs(opts.shuffleOffset || 0) % (eligible.length || 1);
  const selectedProblem = eligible[offset] || fallbackPool[0];

  const currentStatus = (codingStatus[selectedProblem.id] as 'todo' | 'attempted' | 'solved' | 'review') || 'todo';
  const isProblemCompleted = completedTasksToday.includes('daily-problem') || currentStatus === 'solved';

  // 2. SYSTEM DESIGN: Day-of-week rotation through core high-impact architectures
  const systemDesignBlueprint = CORE_SYSTEM_DESIGN_BLUEPRINTS[now.getDay() % CORE_SYSTEM_DESIGN_BLUEPRINTS.length];

  // 3. BEHAVIORAL: Rotates deterministically through the Top 30 behavioral questions
  const behavioralQuestion = TOP_30_BEHAVIORAL_QUESTIONS[dayOfYear % TOP_30_BEHAVIORAL_QUESTIONS.length];

  const codingTask: DailyCodingTask = {
    problem: selectedProblem,
    isCompleted: isProblemCompleted,
    status: currentStatus,
    practiceUrl: `/coding#${selectedProblem.id}`,
    leetcodeUrl: selectedProblem.leetcodeUrl
  };

  const systemDesignTask: DailySystemDesignTask = {
    ...systemDesignBlueprint
  };

  const behavioralTask: DailyBehavioralTask = {
    question: behavioralQuestion,
    targetPrinciple: behavioralQuestion.principle,
    suggestedFramework: 'STAR',
    url: `/stories#${behavioralQuestion.id}`
  };

  const completedCount = [
    isProblemCompleted,
    completedTasksToday.includes('daily-concept'),
    completedTasksToday.includes('daily-quiz')
  ].filter(Boolean).length;

  return {
    dayOfWeek,
    formattedDate,
    totalEstimatedMinutes: 90, // 45m Coding + 30m System Design + 15m Behavioral
    coding: codingTask,
    systemDesign: systemDesignTask,
    behavioral: behavioralTask,
    completedCount
  };
}
