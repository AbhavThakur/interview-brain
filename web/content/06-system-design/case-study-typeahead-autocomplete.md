---
title: "System Design: Real-Time Typeahead & Search Autocomplete"
category: "fullstack-distributed"
difficulty: "Senior / Staff"
tags: ["system-design", "trie", "typeahead", "search", "caching", "streaming"]
---

# System Design: Real-Time Typeahead & Search Autocomplete

> **Target Problem:** Design a real-time search suggestion / autocomplete service (like Google Search, Amazon product search, or Netflix title search) that returns the top 5–10 relevant query suggestions as the user types each character.

---

## 1. Requirements & System Constraints

### Functional Requirements
1. **Real-time Suggestions:** As the user types a prefix (e.g., `re...`), return top 5–10 most relevant search suggestions.
2. **Ranking / Relevance:** Suggestions ranked by popularity (historical query frequency), personalization, and recency.
3. **Multi-language Support:** Handle Unicode characters and case-insensitive matching.

### Non-Functional Requirements
1. **Ultra-Low Latency:** P99 response time **$< 30\text{ ms}$** (since this fires on every keystroke).
2. **High Availability:** 99.99% uptime. Suggestions are a non-critical UX enhancement; failures must degrade gracefully without blocking searches.
3. **High Throughput / Scalability:** 
   * $5\text{ Billion queries/day}$ across 500M Daily Active Users.
   * Average keystrokes per search = $4$ queries.
   * Total Query Requests/day = $5\text{ Billion} \times 4 = 20\text{ Billion requests/day}$.
   * Average QPS: $\frac{20\text{ Billion}}{86,400\text{ s}} \approx 230,000\text{ QPS}$.
   * Peak QPS ($2.5\times$ multiplier): **$\sim 575,000\text{ QPS}$**.

---

## 2. High-Level Architecture Diagram

```
                                  Client (Mobile App / Web)
                                             │
                       (1. Keystroke after 200ms debounce)
                                             ▼
                                     Global Edge CDN
                                (Edge Caching of Top Prefixes)
                                             │ (CDN Cache Miss)
                                             ▼
                                     API Gateway / L7 LB
                               (Rate Limiting & SSL Termination)
                                             │
                      ┌──────────────────────┴──────────────────────┐
                      ▼                                             ▼
           Typeahead Query Service                      Query Ingestion Logger
            (Stateless Read Nodes)                      (Asynchronous Analytics)
                      │                                             │
         ┌────────────┴────────────┐                                ▼
         ▼                         ▼                           Kafka Cluster
Prefix Memory Cache       Distributed Trie Cache              (Raw Query Stream)
(Redis Cluster Top 1M)    (In-Memory Trie Nodes)                    │
                                   ▲                                ▼
                                   │                        Apache Flink / Spark
                          (Read-Only Snapshot)             (Aggregate Frequencies)
                                   │                                │
                           Trie Build Service ◄────────────── Trie DB (Cassandra)
                        (Generates New Trie Graph)           (Historical Frequencies)
```

---

## 3. Core Data Structure: The Prefix Trie with Top-K Caching

A standard Trie traversal takes $O(P + N)$ where $P = \text{length of prefix}$ and $N = \text{number of matching child nodes}$. 

For a busy search engine, traversing all child nodes at runtime and sorting them on the fly will **exceed the 30ms latency budget**.

### Optimization: Precomputed Top-K at Every Trie Node

Every node in the Trie stores:
1. `character`: Current character.
2. `children`: Map of outgoing child pointers ($a \dots z, 0 \dots 9$).
3. `topSuggestions`: Precomputed list of the **Top 5–10 query strings with their frequency scores**.

```
                        (Root)
                      /        \
                    [a]        [r]
                                 │
                                [e] -> topSuggestions: ["react", "reddit", "resume", "recipes"]
                               /   \
                             [a]   [d] -> topSuggestions: ["reddit", "redfin", "red bull"]
                             /
                           [c]
                           /
                         [t] -> topSuggestions: ["react", "react native", "react 19"]
```

### Time Complexity with Precomputed Top-K:
* **Lookup Time:** $O(L)$, where $L$ is the length of the prefix typed so far (typically $L \le 15$).
* Finding the top 5 suggestions is instantaneous ($O(1)$) once the prefix node is reached.

---

## 4. Storage & Memory Sizing Calculations

### Assumptions:
* Total unique search queries tracked: **$100\text{ Million}$**.
* Average query length: **$15\text{ characters}$** ($15\text{ bytes}$).
* Top 5 suggestions stored per node: $5 \times (15\text{ bytes string} + 4\text{ bytes score}) \approx 95\text{ bytes}$.
* Total Trie Nodes: $\sim 300\text{ Million nodes}$.
* Node overhead (pointers + references): $\sim 64\text{ bytes}$ per node.
* **Total In-Memory Size:** $300\text{M} \times (64\text{ bytes} + 95\text{ bytes}) \approx 47.7\text{ GB}$.

> **Key Architectural Insight:** **$48\text{ GB}$ easily fits entirely in RAM** on a single high-memory server (e.g., AWS `r6i.2xlarge` with 64GB RAM). To handle $575,000\text{ QPS}$ and achieve high availability, we replicate the Trie across a cluster of **15–20 read-only replicas** behind a round-robin load balancer.

---

## 5. Partitioning & Sharding Strategy (Scale to Billions)

When queries expand beyond a single machine's RAM:

### Option A: Range-Based Sharding (By Prefix Letter)
* Shard 1: `a - c`, Shard 2: `d - f` ...
* *Failure Mode:* Unbalanced load. In English, queries starting with `s`, `c`, `t` receive $10\times$ more traffic than `q`, `x`, `z`.

### Option B: Consistent Hashing on Query Prefix (Recommended)
* Hash the first 2 characters of the query: $\text{Shard} = \text{hash}(\text{prefix}[0..1]) \pmod N$.
* Distributes `re...`, `te...`, `ma...` uniformly across 64 virtual node partitions.
* Replicas are configured in active-active redundancy with health checks.

---

## 6. Real-Time Ingestion & Offline Trie Updates

Users' search trends change rapidly (breaking news, trending memes, seasonal sales). How do we update frequencies without locking the in-memory Trie?

### The Dual-Pipeline Architecture:
1. **Real-time Logging Pipeline:**
   * When a user searches, the query event is pushed asynchronously to **Apache Kafka**.
   * **Apache Flink / Spark Streaming** consumes the topic, maintaining a rolling 1-hour and 24-hour count of query frequencies using **Count-Min Sketch** and sliding window aggregations.
   * Aggregated frequencies are flushed to **Apache Cassandra / DynamoDB**.

2. **Offline Daily/Hourly Trie Rebuild (Blue/Green Swap):**
   * A background worker pulls the latest frequency table from Cassandra.
   * Constructs a brand-new Trie instance completely offline in memory.
   * Once built, it serializes the Trie into an optimized binary snapshot (stored on S3).
   * Query nodes download the snapshot into a secondary memory buffer and atomically swap the active pointer (**Zero Downtime Blue/Green Memory Pointer Swap**).

---

## 7. Client-Side & Edge Optimizations (Saving 80% Traffic)

1. **Client-Side Debouncing (150ms – 250ms):**
   * Do not fire an HTTP request on every keypress. Wait until the user pauses typing for 200ms.
2. **Local Prefix Caching in Browser / Mobile:**
   * If the user types `rea`, store the results in a local in-memory LRU map.
   * If the user backspaces from `reac` back to `rea`, serve instantly from local memory with zero network delay.
3. **Edge Caching via CDN:**
   * Top 1,000 one-character and two-character prefixes (e.g., `a`, `b`, `in`, `yo`, `ne`) represent **$30\%+$ of all autocomplete traffic**.
   * Set `Cache-Control: public, max-age=3600` on edge CDNs (Cloudflare / Fastly) so requests never hit the origin servers.

---

## 8. Senior Interview Deep-Dive Questions & Answers

#### Q: "How do you handle personal search history mixed with global trending suggestions?"
> *"I implement a hybrid merger at the Query Service layer: The client sends the query with `userId`. The service queries the user's personal recent history cache in Redis ($< 2\text{ms}$) in parallel with the global distributed Trie ($< 5\text{ms}$). The top 2 personal recent searches matching the prefix are prepended to the top 6 global trending suggestions, tagged with an indicator (`history: true`) so the client renders a clock icon next to them."*

#### Q: "What happens if an inappropriate, offensive, or copyrighted phrase becomes trending?"
> *"I incorporate a two-layer filtering mechanism: First, an automated bloom filter and blocklist Trie checked during the offline Trie build phase, ensuring known prohibited terms never enter the precomputed Top-K lists. Second, a dynamic real-time eviction endpoint backed by Redis that immediately suppresses matching queries across all read replicas without waiting for the next full snapshot rebuild."*
