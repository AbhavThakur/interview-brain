---
title: Distributed Rate Limiter (Token Bucket vs Sliding Window)
category: distributed-systems
difficulty: Senior
tags: [HLD, Redis, Lua, Sliding Window, Token Bucket, API Gateway, Throttling]
---

# Distributed Rate Limiter (Token Bucket vs Sliding Window)

Design a global, multi-region distributed rate-limiting middleware capable of protecting public APIs against DDoS, credential stuffing, and resource exhaustion at **500,000+ requests per second**.

---

## 1. Algorithm Comparison Matrix

| Algorithm | Mechanism | Pros | Cons | Best For |
| :--- | :--- | :--- | :--- | :--- |
| **Token Bucket** | Tokens refill at constant rate $r$; consumed per request. | Bursty traffic permitted up to capacity $B$; memory-efficient. | Prone to token starvation during prolonged bursts. | General API protection & AWS/Stripe tiers |
| **Leaky Bucket** | Requests queue in FIFO bucket and leak at constant rate. | Perfectly smooth traffic output; prevents downstream spikes. | Drops requests immediately when queue is full; high latency. | Payment processing / egress webhook throttling |
| **Sliding Window Log** | Store timestamps of all requests in Redis sorted set. | Mathematically 100% precise; zero window border boundary burst. | Memory overhead $O(N)$ high if traffic spikes. | High-security auth / login endpoints |
| **Sliding Window Counter** | Weighted sum of previous window counter + current window. | Extremely low memory ($O(1)$) with 99.5% accuracy. | Minor approximation error for boundary transitions. | High-throughput tier (Cloudflare / Kong) |

---

## 2. High-Performance Sliding Window Counter (Redis Lua Script)

To execute atomic rate-limiting checks without network round-trip race conditions, we use a single atomic Redis Lua script:

```lua
-- KEYS[1]: rate limit key, e.g. "rate:user_123:minute"
-- ARGV[1]: window size in milliseconds (e.g. 60000)
-- ARGV[2]: max allowed requests (e.g. 100)
-- ARGV[3]: current timestamp in milliseconds

local key = KEYS[1]
local window = tonumber(ARGV[1])
local limit = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local clearBefore = now - window

-- 1. Remove timestamps older than current window
redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)

-- 2. Count requests in current window
local currentRequests = redis.call('ZCARD', key)

if currentRequests < limit then
    -- 3. Add current timestamp with unique value (timestamp as score and member)
    redis.call('ZADD', key, now, now .. ':' .. math.random(1000, 9999))
    redis.call('PEXPIRE', key, window)
    return {1, limit - currentRequests - 1} -- Allowed, Remaining
else
    return {0, 0} -- Denied, 0 Remaining
end
```

---

## 3. Architecture & Multi-Region Topology

```text
[ Global Anycast IP ]
         │
         ▼
[ Regional Cloudflare / Envoy Edge Gateways ]
  ├── Local In-Memory Cache (L1: 100ms micro-cache for banned IPs)
  └── Regional Redis Cluster (L2: Distributed Sliding Window)
         │ (Asynchronous sync of global blacklists)
         ▼
[ Origin Backend Services ]
```

---

## 4. HTTP Headers Specification (RFC 6585)

When rate limit is exceeded, return `HTTP 429 Too Many Requests`:
```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 34
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1726661434

{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please retry in 34 seconds."
}
```
