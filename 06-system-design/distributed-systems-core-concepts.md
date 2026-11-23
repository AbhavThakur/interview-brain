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

---

## 8. Consistent Hashing & Virtual Nodes (The System Design Standard)

In standard modulo hashing ($\text{server} = \text{hash}(\text{key}) \pmod N$), adding or removing a server invalidates almost $100\%$ of keys, triggering a massive cache stampede / thundering herd problem.

### The Consistent Hashing Ring
* Map both **Servers** and **Keys** to the same 32-bit hash space ($0 \dots 2^{32} - 1$) positioned on a circular ring.
* To locate which server holds key $K$: compute $\text{hash}(K)$ and walk clockwise until you hit the first server node.
* **Adding / Removing a Node:** Only $K/N$ keys need to be remapped on average, instead of all keys!

```
                    [Server 0]
                   /          \
            (Key 3)            [Server 1]
           /                            \
   [Server 3]                           (Key 1)
           \                            /
            (Key 2)            [Server 2]
                   \          /
```

### The Virtual Nodes (VNodes) Optimization
* **The Problem:** Without virtual nodes, servers end up unevenly spaced on the ring, causing hotspotting and non-uniform load distribution.
* **The Solution:** Each physical server is assigned multiple **Virtual Nodes** (e.g., 100–250 vnodes per machine: `ServerA#1`, `ServerA#2` ...).
* **Benefits:**
  1. **Uniform Data Distribution:** Standard deviation of key distribution drops below $5\%$.
  2. **Heterogeneous Hardware:** Powerful servers can be assigned more virtual nodes proportional to their RAM/CPU.
  3. **Graceful Failover:** When a physical server dies, its virtual nodes are spread across the entire ring, preventing a single neighboring server from collapsing under cascade load.

---

## 9. Load Balancing: Layer 4 vs. Layer 7 & Reverse Proxies

```
[Clients] ──► [DNS Geo-Routing] ──► [Layer 4 LB (HAProxy / AWS NLB)]
                                             │ (TCP Passthrough)
                                             ▼
                                    [Layer 7 LB / Reverse Proxy (Envoy / Nginx)]
                                             │ (Inspects HTTP headers, cookies, paths)
                        ┌────────────────────┼────────────────────┐
                        ▼                    ▼                    ▼
                 [/api/users]           [/api/orders]        [/api/stream]
```

### Layer 4 (Transport Layer) vs. Layer 7 (Application Layer):

| Feature | Layer 4 Load Balancing (L4) | Layer 7 Load Balancing (L7) |
| :--- | :--- | :--- |
| **Protocol** | TCP / UDP (Raw socket packets) | HTTP, HTTPS, WebSockets, gRPC |
| **Payload Visibility**| No (Does not inspect or decrypt HTTP body/headers) | Full (Can inspect URLs, cookies, auth headers) |
| **SSL Termination** | No (Transparent TCP passthrough) | Yes (Decrypts TLS, offloading CPU from app servers) |
| **Routing Logic** | Simple IP:Port hashing, Round Robin | Smart path routing (`/api/v1`), A/B test routing, Header injection |
| **Performance** | Extremely high throughput, ultra-low latency | Slightly higher CPU overhead, but maximum routing flexibility |

### Common Load Balancing Algorithms:
* **Round Robin / Weighted Round Robin:** Dispatches requests sequentially; weights balance server capacity.
* **Least Connections:** Routes to the node handling the fewest active connections (best for long-lived WebSockets or streaming).
* **IP Hash:** Computes hash of client IP to guarantee sticky sessions without cookies.

---

## 10. Content Delivery Networks (CDN): Push vs. Pull

A CDN is a globally distributed network of proxy servers that cache content close to end users (Edge Points of Presence - PoPs).

```
                      ┌─────────────────────────────────────────┐
                      │              Edge CDN (PoP)             │
                      │  [Edge Cache Hit] ──► Serve in < 15ms   │
                      └────────────────────┬────────────────────┘
                                           │ (Cache Miss)
                                           ▼
                                [Origin Shield / Core]
                                           │
                                           ▼
                               [Origin Server (S3 / App)]
```

### Push CDN vs. Pull CDN:
* **Pull CDN (Most Common):** The CDN grabs content from the origin server only when the first user requests it. Subsequent users get cache hits.
  * *Best for:* High-traffic sites with heavy catalog size (e-commerce, blogs, news). Content expires via `max-age` TTLs.
* **Push CDN:** Content is pushed directly to CDN storage before any user asks for it (like deploying a static site build).
  * *Best for:* Infrequently updated, critical release assets (app installation packages, software updates, video files).

---

## 11. Communication Protocols: HTTP/2, HTTP/3, WebSockets & gRPC

| Protocol | Transport | Handshake | Multiplexing | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **HTTP/1.1** | TCP | 3-Way TCP + TLS | No (Head-of-Line blocking; needs multiple connections) | Legacy APIs, simple static sites |
| **HTTP/2** | TCP | 3-Way TCP + TLS | Single TCP connection multiplexing binary streams | Standard REST APIs, web apps |
| **HTTP/3 (QUIC)** | UDP | 1-RTT (or 0-RTT) combined crypto + transport | True stream multiplexing; packet loss on 1 stream never blocks others | Mobile apps with spotty network handoffs (Wi-Fi to 5G) |
| **WebSockets** | TCP | HTTP Upgrade $\rightarrow$ Full Duplex TCP | Bi-directional streaming with minimal frame overhead (2 bytes) | Real-time chat, multiplayer gaming, financial order books |
| **Server-Sent Events (SSE)**| TCP (HTTP) | Standard HTTP | One-way server push; automatic reconnection | Stock tickers, LLM token streaming, notifications |
| **gRPC / Protobuf** | HTTP/2 | TCP + TLS | Binary protocol buffers with strict typed schema | Low-latency internal microservice-to-microservice RPCs |

