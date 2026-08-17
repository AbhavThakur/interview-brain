---
title: "Distributed Systems Core Concepts & Architecture Handbook"
category: "distributed-backend"
difficulty: "Senior / Staff"
tags: ["system-design", "cap-theorem", "caching", "sharding", "replication", "consistency"]
---

# Distributed Systems Core Concepts & Architecture Handbook

The foundational concepts, theorems, and trade-offs that underpin every scalable software architecture.

---

## 1. Performance vs. Scalability

* **Performance:** How fast a system processes a single unit of work (minimizing response time / latency).
* **Scalability:** How well a system can handle increasing workload by adding resources (hardware, nodes, memory) without degrading performance.
* *A service is scalable if doubling the workload and doubling resources keeps response times constant.*

---

## 2. Latency vs. Throughput

* **Latency:** The time required to perform an action or receive data ($ms$, $\mu s$).
* **Throughput:** The number of actions or operations executed per unit time ($\text{QPS}$, $\text{MB/s}$).
* *Aim for maximum throughput with acceptable latency.*

---

## 3. CAP Theorem & PACELC Theorem

In any distributed data store with network partitioning:

```
                  ┌──────────────────────┐
                  │      Consistency     │
                  │ (All nodes see same  │
                  │   data at same time) │
                  └──────────┬───────────┘
                             │
                      CAP Triangle
                             │
     ┌───────────────────────┴───────────────────────┐
     │                                               │
┌────┴─────────────────┐                   ┌─────────┴────────────┐
│     Availability     │                   │ Partition Tolerance  │
│ (Every request gets a│                   │(System functions even│
│ non-error response)  │                   │if msgs are dropped)  │
└──────────────────────┘                   └──────────────────────┘
```

* **CP (Consistency + Partition Tolerance):** If a partition occurs, reject or wait for writes to guarantee consistency (e.g., HBase, Spanner, MongoDB with strict write concerns).
* **AP (Availability + Partition Tolerance):** If a partition occurs, accept writes on all reachable nodes; allow temporary data divergence / eventual consistency (e.g., Cassandra, DynamoDB, CouchDB).
* **PACELC Theorem Extension:**
  * **If Partition (P):** Choose between **Availability (A)** vs **Consistency (C)**.
  * **Else (E):** Choose between **Latency (L)** vs **Consistency (C)**.

---

## 4. Consistency Patterns

| Consistency Model | Behavior | Use Case |
| :--- | :--- | :--- |
| **Strong Consistency** | Every subsequent read immediately reflects the latest write. Requires distributed locking / consensus (2PC, Raft). | Financial ledgers, stock trades, seat bookings. |
| **Eventual Consistency** | Given enough time without new writes, all replicas converge to the same state. High availability. | Social media feeds, video view counts, DNS records. |
| **Read-After-Write (Causal)** | A user is guaranteed to see their own updates immediately, while others may see them eventually. | User editing their profile, adding a comment. |

---

## 5. Availability Patterns (Redundancy & Failover)

### Active-Passive Failover (Master-Standby)
* Heartbeats monitor the active master server. If it dies, the standby takes over the active IP address.
* *Tradeoff:* Standby hardware is idle during normal operations; risk of failover lag.

### Active-Active Failover (Multi-Master)
* Both servers actively process traffic, balancing load.
* *Tradeoff:* Requires distributed conflict resolution if both servers write to the same record concurrently.

---

## 6. Caching Strategies & Write Policies

```
[Application] ───(1. Read Cache)───► [Cache (Redis)]
      │                                     │
(3. Write Cache on Miss)              (Miss / Hit)
      │                                     │
      └─────────(2. Query DB on Miss)───────► [Database]
```

### Write Policies Comparison:

| Policy | How It Works | Pros & Cons |
| :--- | :--- | :--- |
| **Cache-Aside (Lazy Loading)** | App checks cache $\rightarrow$ if miss, loads from DB $\rightarrow$ writes to cache for next time. | Resilient to cache crashes, but cache misses pay extra latency penalty. |
| **Write-Through** | App writes data to cache $\rightarrow$ cache writes synchronously to DB. | High data consistency; write latency is higher because 2 writes occur. |
| **Write-Back (Write-Behind)** | App writes to cache $\rightarrow$ cache immediately acknowledges $\rightarrow$ batches async writes to DB. | Ultra-low write latency, but data loss risk if cache crashes before flushing to DB. |
| **Write-Around** | App writes directly to DB, bypassing cache. Cache is only populated on subsequent reads. | Prevents cache pollution for data that isn't immediately read back. |

---

## 7. Database Scaling: Sharding vs. Replication

* **Replication (Master-Slave):** 1 Primary for Writes, $N$ Replicas for Reads. Perfect for 90:10 read-heavy workloads.
* **Vertical Scaling:** Upgrading CPU, RAM, NVMe SSDs on a single machine. Hit hardware ceiling quickly.
* **Horizontal Sharding:** Distributing rows across multiple databases based on a **Shard Key**:
  * **Hash-Based Sharding:** $\text{Shard ID} = \text{hash}(\text{user\_id}) \pmod N$. Uniform distribution, but adding new shards requires rehashing (solve with **Consistent Hashing**).
  * **Range-Based Sharding:** Shard 1 (A–M), Shard 2 (N–Z). Can cause uneven hotspotting.
