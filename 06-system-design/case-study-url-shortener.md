---
title: "System Design Case Study: Scalable URL Shortener (TinyURL)"
category: "distributed-backend"
difficulty: "Mid to Senior"
tags: ["system-design", "case-study", "tinyurl", "base62", "hashing", "caching"]
---

# System Design Case Study: Scalable URL Shortener (TinyURL)

An end-to-end architectural blueprint for designing a high-throughput, low-latency URL shortening service capable of handling billions of redirects.

---

## 1. Requirements & Scope

### Functional Requirements
1. **Shorten URL:** Given a long URL (e.g. `https://example.com/very-long-path?query=123`), return a unique short alias (e.g. `https://tiny.url/aB3x9Q`).
2. **Redirection:** When a user accesses `https://tiny.url/aB3x9Q`, redirect them with an HTTP 301/302 to the original long URL.
3. **Custom Aliases & Expiration:** Allow users to set custom short links (optional) and specify TTL expiration dates.

### Non-Functional Requirements
* **Ultra-Low Latency:** Redirection must complete in $< 20\text{ ms}$.
* **High Availability:** 99.99% uptime; redirection failure directly breaks external links.
* **Non-Predictable:** Short URLs should not be easily guessable to prevent enumeration attacks.

---

## 2. Capacity Estimations (Back-of-the-Envelope)

* **Traffic Ratio:** Read-heavy system with a 100:1 read-to-write ratio.
* **Writes:** 100 Million new URLs created per month $\approx 40\text{ writes/second}$.
* **Reads:** 10 Billion redirections per month $\approx \mathbf{4,000\text{ read QPS}}$ (Peak: $\sim 10,000\text{ QPS}$).
* **Storage Calculation:**
  * 100M URLs $\times$ 500 bytes per record $\times$ 12 months $\times$ 5 years $\approx \mathbf{3\text{ TB total storage}}$ (Fits easily on modern SSD arrays or distributed NoSQL).
* **Memory (Cache) Sizing:**
  * 80/20 Pareto Rule: Cache top 20% of daily read URLs.
  * Daily reads $= \frac{10\text{B}}{30} \approx 330\text{M requests/day}$.
  * $330\text{M} \times 0.20 \times 500\text{ bytes} \approx \mathbf{33\text{ GB RAM}}$ (Easily fits in a single Redis master node).

---

## 3. Short Link Generation: Base62 vs. Key Generation Service (KGS)

### Why Base62?
Characters: `[0-9, a-z, A-Z]` = $10 + 26 + 26 = 62$ characters.
* A 7-character string in Base62 yields $62^7 \approx \mathbf{3.5\text{ Trillion unique URLs}}$, which easily lasts decades.

```
Unique 64-bit ID (e.g. 11,157,175) ───(Base62 Encode)───► "aB3x9Q"
```

### Approach A: MD5 / SHA-256 Hashing with Collision Resolution
* Hash long URL with MD5 $\rightarrow$ take first 7 characters $\rightarrow$ check DB for collision. If collision exists, append salt and rehash.
* *Drawback:* Expensive database lookups on every collision.

### Approach B: Key Generation Service (KGS) — Recommended
* A dedicated standalone service pre-generates billions of unique 7-character random Base62 keys and stores them in a key-DB.
* When a write request arrives, the web server grabs an unused key from KGS memory, marks it as used, and pairs it with the long URL.
* *Benefit:* Zero hash collisions and instantaneous $O(1)$ writes.

---

## 4. High-Level Architecture Diagram

```
                 [Clients / Web Browsers]
                            │
                            ▼
                     [Anycast DNS / CDN]
                            │
                            ▼
              [L7 Load Balancer / API Gateway]
                            │
         ┌──────────────────┴──────────────────┐
         ▼                                     ▼
 [Write / Create API]                  [Redirect Read API]
         │                                     │
         ├──► [KGS Key Service]                ├──► [Redis Cache (33 GB)]
         │                                     │         │ (Hit / Miss)
         ▼                                     ▼         ▼
  [Database (Write)] ───(Replication)───► [Database (Read Replicas)]
```

---

## 5. Database Schema & HTTP Redirection Codes

### Data Schema (Document / Wide-Column or PostgreSQL)

```sql
CREATE TABLE url_mappings (
    short_hash VARCHAR(7) PRIMARY KEY,
    long_url TEXT NOT NULL,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_expires_at ON url_mappings(expires_at);
```

### HTTP 301 vs. HTTP 302 Redirection:
* **HTTP 301 (Permanent Redirect):** Browser caches the redirect locally. Subsequent clicks never hit our server.
  * *Pros:* Zero server load for repeated clicks.
  * *Cons:* Impossible to collect real-time analytics / click tracking.
* **HTTP 302 (Temporary Redirect):** Browser sends every request through our server before redirecting.
  * *Pros:* Accurate click metrics, geo-analytics, and instant link disabling.
  * *Cons:* Higher server request volume (mitigated with Redis caching).
