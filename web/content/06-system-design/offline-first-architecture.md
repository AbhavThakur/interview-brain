---
title: Offline-First & Data Synchronization Architecture
category: mobile-frontend
difficulty: Senior / Staff
tags: [offline-first, sync, sqlite, crdt, architecture]
---

# Offline-First & Data Synchronization Architecture

## Core Concept
In an **Offline-First** application, the local embedded database (e.g. SQLite, WatermelonDB, IndexedDB) is the **single source of truth for the UI**. The network is treated as an asynchronous data replication channel rather than a blocking dependency.

---

## 1. High-Level Sync Architecture

```
┌────────────────────────────────────────────────────────┐
│                        CLIENT                          │
│                                                        │
│  [UI Components] ──(Read/Write)──> [Local SQLite DB]   │
│                                           │            │
│                                    (Append to Queue)   │
│                                           │            │
│                                           ▼            │
│                                  [Outbox Sync Queue]   │
└───────────────────────────────────────────┬────────────┘
                                            │ (Background Sync)
                                            ▼
┌────────────────────────────────────────────────────────┐
│                        BACKEND                         │
│                                                        │
│  [API Gateway] ──> [Conflict Resolver] ──> [Master DB] │
│                           │                            │
│                     (Delta Stream)                     │
│                           │                            │
│                           ▼                            │
│                  [Client Push Sync]                    │
└────────────────────────────────────────────────────────┘
```

---

## 2. Key Architectural Pillars

### A. Optimistic UI Mutations & Outbox Pattern
1. When a user creates a record (e.g. sends a message or edits a note):
   * Generate a client-side UUID (`id: v4()`) and temporary state (`status: 'pending_sync'`).
   * Write immediately to the local database. UI updates instantaneously (0ms latency).
   * Append mutation operation into the persistent local **Outbox Queue**.
2. A background **Sync Engine** consumes the outbox queue:
   * Batches pending operations and POSTs them to the backend sync endpoint.
   * On HTTP 200: Marks local records as `synced` and removes item from outbox.
   * On Network Error: Retries with exponential backoff and jitter.

### B. Conflict Resolution Strategies

| Strategy | Mechanism | Use Case |
| :--- | :--- | :--- |
| **Last-Write-Wins (LWW)** | Record with the highest server-side timestamp overwrites previous version. | Simple key-value configs, profile bio updates. High risk of silent data loss. |
| **CRDTs (Conflict-Free Replicated Data Types)** | State or operation-based mathematical convergence (e.g., Yjs, Automerge, LWW-Element-Set). | Collaborative rich-text editing, shared lists, document editors. |
| **Three-Way Merge / Operational Transformation (OT)** | Compares Client version, Server version, and Common Ancestor version to produce merged delta. | Git-like versioning, structured document schemas. |
| **Field-Level Diffing** | Only update dirty fields rather than full entity snapshots. | User forms (User A edits email, User B edits phone number $\rightarrow$ both succeed). |

---

## 3. Interview Takeaways
* **Always use client-generated UUIDs:** Never wait for server auto-increment IDs for offline-creatable entities.
* **Delta Sync vs Full Fetch:** Use `last_pulled_at` timestamps or server sequence numbers (WAL stream) so the client only downloads incremental changes rather than whole tables.
* **Idempotency Keys:** Every sync packet must include a unique `client_mutation_id` so duplicate network requests do not duplicate backend database records.
