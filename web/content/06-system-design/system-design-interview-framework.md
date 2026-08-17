---
title: "The 4-Step System Design Interview Framework"
category: "distributed-backend"
difficulty: "Senior / Staff"
tags: ["system-design", "framework", "interview-guide", "capacity-planning", "sla"]
---

# The 4-Step System Design Interview Framework

A standardized, senior-level blueprint to navigate any 45–60 minute High-Level Design (HLD) interview without getting stuck or overwhelmed.

---

## ⏱️ Recommended 45-Minute Time Allocation

```mermaid
gantt
    title 45-Minute System Design Interview Breakdown
    dateFormat  mm
    axisFormat  %M m
    section Phase
    Step 1: Scope & Calculations  :00, 08m
    Step 2: High-Level Architecture :08, 15m
    Step 3: Core Component Deep-Dive :15, 30m
    Step 4: Scale, Bottlenecks & Failure Modes :30, 45m
```

---

## 🎯 Step 1: Clarify Requirements & Scope (0 – 8 mins)

Never jump straight into drawing boxes. Define functional vs non-functional constraints and estimate traffic.

### 1. Functional Requirements (What the system MUST do)
* *Limit to 2–3 core features for the interview scope.*
* E.g., for Twitter: (1) Post a tweet, (2) View user timeline & home feed, (3) Follow users. (Explicitly defer search or DMs to phase 2).

### 2. Non-Functional Requirements (System Quality Attributes)
* **Availability vs Consistency:** E.g., High availability with eventual consistency (AP) or strict financial consistency (CP).
* **Latency:** Low latency reads ($p99 < 100\text{ ms}$).
* **Throughput / Scale:** Millions of daily active users (DAU).
* **Durability:** Zero data loss for finalized transactions.

### 3. Back-of-the-Envelope Capacity Estimations

| Metric | Rule of Thumb Formula | Example (100M DAU) |
| :--- | :--- | :--- |
| **Total Daily Requests** | $\text{DAU} \times \text{Avg Actions/Day}$ | $100\text{M} \times 10 = 1\text{ Billion Actions/day}$ |
| **Average QPS** | $\frac{\text{Total Daily Requests}}{100,000\text{ seconds}}$ | $\frac{1,000,000,000}{100,000} = \mathbf{10,000\text{ QPS}}$ |
| **Peak QPS** | $\text{Average QPS} \times 2\text{ to }3$ | $10,000 \times 2.5 = \mathbf{25,000\text{ Peak QPS}}$ |
| **Storage per Year** | $\text{Daily Writes} \times \text{Payload Size} \times 365$ | $100\text{M} \times 2\text{ KB} \times 365 \approx \mathbf{73\text{ TB/year}}$ |
| **Bandwidth (Ingress/Egress)** | $\text{QPS} \times \text{Payload Size}$ | $10,000\text{ QPS} \times 2\text{ KB} = \mathbf{20\text{ MB/second}}$ |

---

## 📐 Step 2: High-Level Architecture (8 – 15 mins)

Sketch the end-to-end data flow from client to data persistence layer.

```
[Mobile / Web Client]
          │
          ▼
   [DNS / Anycast CDN] (Static assets & edge caching)
          │
          ▼
   [API Gateway / L7 Load Balancer] (TLS termination, Rate limiting, Auth)
          │
    ┌─────┴─────────────────────────┐
    ▼                               ▼
[Write Microservice]          [Read Microservice]
    │                               │
    ▼                               ▼
[Message Queue / Kafka]       [Distributed Cache / Redis]
    │                               │
    ▼                               ▼
[Primary SQL / NoSQL DB] ◄─── [Read Replicas / Read Views]
```

### Key Questions to Address in Step 2:
1. **API Signature:** Define 2 primary REST / gRPC endpoints.
   ```http
   POST /api/v1/posts
   Headers: Authorization: Bearer <token>, Idempotency-Key: <uuid>
   Payload: { "content": "Hello world", "media_ids": [] }

   GET /api/v1/feed?cursor=12345&limit=20
   Response: { "items": [...], "next_cursor": "67890" }
   ```
2. **Database Choice:** Relational (PostgreSQL) vs NoSQL (Document/MongoDB vs Wide-Column/Cassandra).

---

## 🔬 Step 3: Core Component Deep-Dive (15 – 30 mins)

Pick the 2 most critical architectural components and design them thoroughly.

### A. Data Modeling & Database Schema
* Identify Primary Keys, Foreign Keys, and Partition / Shard Keys.
* Choose between **Normalization** (eliminates write anomalies) vs **Denormalization** (blazing-fast read queries).

### B. Caching Strategy
* **Cache-Aside (Lazy Loading):** App queries cache $\rightarrow$ if miss, reads DB $\rightarrow$ writes to cache.
* **Cache Eviction:** **LRU** (Least Recently Used) with appropriate TTLs.
* **Cache Invalidation:** Event-driven invalidation via CDC (Change Data Capture) or Pub/Sub on write.

---

## ⚡ Step 4: Scale the Design & Handle Bottlenecks (30 – 45 mins)

Address real-world failure scenarios and scale to 100x traffic.

### 1. Database Bottlenecks & Scaling
* **Read-Heavy Systems:** Add Master-Slave Read Replicas.
* **Write-Heavy Systems:** Horizontal Sharding by `user_id` or Consistent Hashing.
* **Hot Partition / Celebrity Problem:** Dedicated in-memory fan-out queues for super-users.

### 2. Failure Modes & Fault Tolerance
* **What if Primary Database crashes?** Auto-failover with Raft/Paxos consensus.
* **What if Redis Cache crashes?** Circuit Breaker to prevent thundering herd / cache stampede onto database.
* **Network Partitions:** Graceful degradation (serve stale cached content with fallback indicators).
