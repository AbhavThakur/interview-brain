---
title: Real-Time Chat & Notification System Architecture
category: fullstack-distributed
difficulty: Senior / Staff
tags: [real-time, websockets, push-notifications, redis, scaling]
---

# Real-Time Chat & Notification System Architecture

## Requirements & Scale
* **Scale:** 10 Million Daily Active Users (DAU), 50,000 concurrent online connections per server cluster.
* **Latency:** Sub-100ms message delivery between active clients.
* **Guarantees:** At-least-once delivery, deterministic ordering, offline fallback via Push Notifications (APNs / FCM).

---

## 1. System Architecture Diagram

```
[Client App (Online)]  ──(Persistent WSS)──┐
                                           │
[Client App (Background)] (No WSS)         ▼
                                   [WebSocket Gateway] ──(Publish)──> [Redis Pub/Sub]
                                           │                                │
                                           ▼                                ▼
                                  [Chat Service API] ─────────> [Message Storage (Cassandra/Scylla)]
                                           │
                                    (User Offline?)
                                           │
                                           ▼
                                 [Push Notification Service (FCM/APNs)]
```

---

## 2. Deep Dive: Key Components

### A. Connection Layer (WebSocket Gateway)
* Maintains stateful, duplex TCP/WebSocket connections (`wss://`).
* Uses an in-memory **Session Map** (`UserId -> ConnectionSocketId`).
* Heartbeat / Ping-Pong protocol every 30s to detect broken connections (e.g. subway tunnels).

### B. Message Routing & Distributed Broker (Redis Pub/Sub or Kafka)
* When User A sends a message to User B:
  1. WebSocket Gateway #1 receives message from User A.
  2. Gateway #1 publishes payload to `channel:user_b`.
  3. WebSocket Gateway #2 (which holds User B's open socket) receives the event from Redis and pushes it down User B's socket.
  4. If User B is offline (no active socket), the message is enqueued into **Push Notification Queue** (APNs/FCM).

### C. Message Storage
* **Read/Write pattern:** Extremely heavy write load + sequential chronological reads (`get latest 50 messages where conversation_id = X`).
* **Storage Choice:** Wide-column NoSQL (Cassandra / ScyllaDB) or PostgreSQL partitioned by `conversation_id`.
* **Primary Key Schema:** `(conversation_id, message_id DESC)` where `message_id` is a time-sortable KSUID or Snowflake ID.

---

## 3. Critical Interview Edge Cases
1. **Message Ordering:** Never rely on client timestamps. Use server Snowflake IDs or incremental per-conversation sequence numbers.
2. **Reconnection Storms:** When 100k users regain connectivity (e.g. WiFi reconnect), stagger reconnects with exponential backoff and random jitter.
3. **Read Receipts & Typing Indicators:** Do not persist typing indicators to database! Send them as ephemeral, non-persisted Redis Pub/Sub events directly.
