# Senior Mobile Machine Coding Arsenal (React Native & TypeScript)

> **Context:** The top 4 live machine-coding problems asked in 60–90 minute technical screens at PhonePe, Swiggy, Zepto, Flipkart, and Uber. Includes production-grade TypeScript code, edge-case handling, and performance optimization.

---

## Challenge 1: Debounced Autocomplete Search with Request Cancellation (Race Condition Prevention)

### The Problem
When a user types fast (e.g. *"a"* -> *"ap"* -> *"app"* -> *"apple"*), network latency jitter can cause the response for *"ap"* to return AFTER *"apple"*, overwriting the UI with stale data.

### Production Solution: `useDebouncedSearch.ts`
```typescript
import { useState, useEffect, useRef } from 'react';

export function useDebouncedSearch<T>(
  query: string,
  fetchFn: (q: string, signal: AbortSignal) => Promise<T[]>,
  delay: number = 300
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const handler = setTimeout(async () => {
      // 1. Cancel previous pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 2. Spawn new AbortController
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const results = await fetchFn(query, controller.signal);
        setData(results);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [query, delay]);

  return { data, loading, error };
}
```

---

## Challenge 2: In-Memory Sliding Window Telemetry Batcher (Your Best Buy Buffer)

### The Problem
High-frequency events (scroll FPS, clicks, breadcrumbs) must be logged, but firing an API request on every event causes network congestion, battery drain, and frame drops.

### Production Solution: `SlidingBatchQueue.ts`
```typescript
export class SlidingBatchQueue<T> {
  private queue: T[] = [];
  private timer: NodeJS.Timeout | null = null;
  private readonly maxBatchSize: number;
  private readonly flushIntervalMs: number;
  private readonly onFlush: (batch: T[]) => Promise<void> | void;

  constructor(
    onFlush: (batch: T[]) => Promise<void> | void,
    flushIntervalMs: number = 500,
    maxBatchSize: number = 50
  ) {
    this.onFlush = onFlush;
    this.flushIntervalMs = flushIntervalMs;
    this.maxBatchSize = maxBatchSize;
  }

  public enqueue(item: T): void {
    this.queue.push(item);

    // Immediate flush if batch threshold is reached
    if (this.queue.length >= this.maxBatchSize) {
      this.flush();
      return;
    }

    // Schedule delayed flush
    if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.flushIntervalMs);
    }
  }

  public flush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.queue.length === 0) return;

    const currentBatch = [...this.queue];
    this.queue = [];
    this.onFlush(currentBatch);
  }
}
```

---

## Challenge 3: Type-Safe Publish-Subscribe Event Emitter (Zero Dependencies)

### The Problem
Implement a lightweight decoupled pub-sub event bus in TypeScript without relying on Node's `events` or third-party packages.

### Production Solution: `EventEmitter.ts`
```typescript
type Listener<T = any> = (data: T) => void;

export class TypedEventEmitter<EventMap extends Record<string, any>> {
  private listeners: { [K in keyof EventMap]?: Set<Listener<EventMap[K]>> } = {};

  public on<K extends keyof EventMap>(event: K, listener: Listener<EventMap[K]>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set();
    }
    this.listeners[event]!.add(listener);

    // Return unsubscription lambda
    return () => {
      this.listeners[event]?.delete(listener);
    };
  }

  public emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    this.listeners[event]?.forEach((listener) => {
      try {
        listener(data);
      } catch (e) {
        console.error(`Error in listener for event ${String(event)}:`, e);
      }
    });
  }

  public removeAllListeners<K extends keyof EventMap>(event?: K): void {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }
}
```

---

## Challenge 4: LRU (Least Recently Used) Cache with TTL

```typescript
class LRUNode<K, V> {
  key: K;
  val: V;
  expiry: number;
  prev: LRUNode<K, V> | null = null;
  next: LRUNode<K, V> | null = null;

  constructor(key: K, val: V, ttlMs: number) {
    this.key = key;
    this.val = val;
    this.expiry = Date.now() + ttlMs;
  }
}

export class LRUCache<K, V> {
  private capacity: number;
  private map = new Map<K, LRUNode<K, V>>();
  private head: LRUNode<K, V>;
  private tail: LRUNode<K, V>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.head = new LRUNode(null as any, null as any, 0);
    this.tail = new LRUNode(null as any, null as any, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  public get(key: K): V | null {
    const node = this.map.get(key);
    if (!node) return null;

    if (Date.now() > node.expiry) {
      this.remove(node);
      this.map.delete(key);
      return null;
    }

    // Move to front (Most Recently Used)
    this.moveToFront(node);
    return node.val;
  }

  public set(key: K, val: V, ttlMs: number = 60000): void {
    let node = this.map.get(key);
    if (node) {
      node.val = val;
      node.expiry = Date.now() + ttlMs;
      this.moveToFront(node);
    } else {
      if (this.map.size >= this.capacity) {
        // Evict least recently used (tail.prev)
        const lru = this.tail.prev!;
        this.remove(lru);
        this.map.delete(lru.key);
      }
      node = new LRUNode(key, val, ttlMs);
      this.map.set(key, node);
      this.insertFront(node);
    }
  }

  private moveToFront(node: LRUNode<K, V>): void {
    this.remove(node);
    this.insertFront(node);
  }

  private insertFront(node: LRUNode<K, V>): void {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  private remove(node: LRUNode<K, V>): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }
}
```
