---
title: "System Design Case Study: Distributed Web Crawler (Google / Bing)"
category: "distributed-backend"
difficulty: "Staff / Principal"
tags: ["system-design", "case-study", "web-crawler", "bloom-filter", "url-frontier"]
---

# System Design Case Study: Distributed Web Crawler (Google / Bing)

Designing a robust, distributed web crawler capable of fetching, parsing, and indexing billions of web pages per month with politeness policies and duplicate detection.

---

## 1. Requirements & Core Challenges

### Functional Requirements
1. **HTML Fetching:** Given a list of seed URLs, download web page contents.
2. **Link Extraction:** Parse HTML, extract all hyperlinks (`<a href="...">`), and append new unseen URLs to the crawl queue.
3. **Storage:** Store cleaned text and metadata for search engine indexing.

### Non-Functional Requirements
* **Scalability:** Crawl $1\text{ Billion pages/month}$ ($\approx 400\text{ pages/sec}$).
* **Politeness:** Do not overload target web servers with high-frequency requests. Obey `robots.txt`.
* **Deduplication:** Never re-crawl identical URLs or duplicate content (prevent spider traps).
* **Fault Tolerance:** Handle broken HTML, slow DNS timeouts, and dead servers gracefully.

---

## 2. High-Level Crawler Architecture

```mermaid
graph TD
    A[Seed URLs] --> B[URL Frontier]
    B --> C[DNS Resolver & Cache]
    C --> D[Fetcher Workers Pool]
    D --> E[HTML Parser]
    E --> F{Content Seen Before?}
    F -- Yes (Duplicate) --> G[Discard]
    F -- No --> H[Store in Document Store]
    E --> I[URL Filter & Normalizer]
    I --> J{URL Visited Before? (Bloom Filter)}
    J -- No --> B
    J -- Yes --> K[Discard]
```

---

## 3. Core Architectural Components

### A. The URL Frontier (Priority + Politeness Queues)
A naive FIFO queue will bombard a single host (e.g. `nytimes.com`) with 10,000 requests/sec, causing rate limiting or IP bans.
* **Politeness Queues:** Maintain a separate queue for each target host domain (`host_id`). A worker thread only fetches 1 URL from a host queue every $N$ seconds.
* **Priority Queues:** Assign priority scores based on PageRank, freshness, and update frequency.

```
Incoming URLs ──► [Priority Queues (F1, F2, F3)] ──► [Host Queues (B1: nytimes, B2: wikipedia, B3: github)] ──► [Fetcher]
```

---

### B. Duplicate Detection with Bloom Filters

* Testing whether a URL (e.g. `https://example.com/page-123`) has been crawled across 10 Billion pages requires massive memory if using a hash set ($\sim 10\text{B} \times 100\text{ bytes} = 1\text{ TB RAM}$).
* **Bloom Filter Solution:**
  * Space-efficient probabilistic data structure.
  * Uses $K$ independent hash functions over a bit array of size $M$.
  * **Zero False Negatives:** If Bloom Filter says "URL not visited", it is 100% guaranteed not visited.
  * Memory footprint: Requires only **~1.2 GB of RAM** to index 1 Billion URLs with $< 1\%$ false positive rate!

---

### C. Content Fingerprinting (SimHash)
* Many web pages have different URLs but identical or near-identical text (e.g. syndicated news articles or duplicate pages with tracking query parameters).
* Use **SimHash** or **MinHash** to generate a 64-bit fingerprint of the document text. If Hamming distance between two fingerprints $\le 3$, mark as duplicate and skip storage.

---

## 4. Key Metrics & Failure Mitigations

1. **DNS Resolution Bottleneck:** DNS lookups take 20–200ms. Maintain an in-memory **DNS Cache** with long TTLs to avoid hitting public DNS resolvers on every request.
2. **Spider Traps:** Infinite URL loops (e.g. `example.com/calendar/next/next/next...`). Mitigate by setting a maximum URL path depth (e.g. $\le 8$ levels) and limiting maximum pages fetched per host.
3. **Robots.txt Cache:** Download and cache `robots.txt` per host domain in Redis with a 24-hour TTL before issuing any scrape requests.
