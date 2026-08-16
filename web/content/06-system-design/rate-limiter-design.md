---
title: Distributed API Rate Limiter Design
category: distributed-backend
difficulty: Mid / Senior
tags: [rate-limiting, redis, algorithms, security, api-gateway]
---

# Distributed API Rate Limiter Design

## Purpose & Use Cases
* Protect internal services from Denial of Service (DoS) attacks and brute force.
* Enforce monetization tiers (e.g. Free: 100 req/min, Enterprise: 10,000 req/min).
* Prevent cascading failure in microservices.

---

## 1. Algorithm Comparison Matrix

| Algorithm | Mechanism | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **Token Bucket** | Tokens refill at fixed rate $r$ up to capacity $b$. Requests consume 1 token. | Handles bursty traffic smoothly; memory efficient. | Tuning refill rate and capacity parameters. |
| **Leaky Bucket** | Requests enter FIFO queue and leak out at fixed rate. | Smooth, constant output rate. | Bursty traffic is delayed/dropped if queue is full. |
| **Sliding Window Log** | Keeps sorted timestamp set per user. Deletes timestamps older than window. | 100% accurate; no boundary spikes. | High memory footprint ($O(N)$ timestamps in Redis Sorted Set). |
| **Sliding Window Counter** | Blends count from previous window and current window weighted by overlap %. | Very memory efficient ($O(1)$); low calculation cost. | Approximation error ($\approx 0.05\%$), but negligible for API limits. |

---

## 2. Distributed Architecture with Redis + Lua Scripts

```
[Incoming Client Request]
            │
            ▼
    [API Gateway / Reverse Proxy]
            │
    (Execute Atomic Lua Script)
            │
            ▼
     [Redis Cluster]
     - Key: rate_limit:{user_id_or_ip}:{endpoint}
     - Check current count < limit
            │
      ┌─────┴─────┐
      ▼           ▼
[Allowed (200)]  [HTTP 429 Too Many Requests]
                 - Header: Retry-After: 30
                 - Header: X-RateLimit-Remaining: 0
```

### Why Lua Script in Redis?
* Standard `GET` then `INCR` in Redis creates a **Race Condition** between concurrent requests.
* Redis executes Lua scripts as a single **atomic operation**, preventing race conditions without needing distributed locks.
