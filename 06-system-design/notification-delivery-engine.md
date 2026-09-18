---
title: Notification Delivery Engine (Push, SMS, Email)
category: distributed-systems
difficulty: Senior
tags: [HLD, Push Notifications, Kafka, FCM, APNS, Rate Limiting, Priority Queue]
---

# Notification Delivery Engine (Push, SMS, Email)

Design a high-throughput, fault-tolerant notification platform capable of dispatching **100M+ notifications daily** (iOS APNS, Android FCM, SMS, Email, In-App) with sub-second latency for transactional alerts and controlled batching for promotional campaigns.

---

## 1. Functional & Non-Functional Requirements

### Functional Requirements
1. **Multi-Channel Dispatch**: Support Push (APNS/FCM), SMS (Twilio/Gupshup), Email (SendGrid), and WebSockets/In-App.
2. **Prioritization**: Instant priority for OTPs, fraud alerts, and order confirmations (< 500ms); bulk asynchronous queueing for marketing blasts.
3. **User Preferences & Do-Not-Disturb (DND)**: Respect quiet hours (e.g. 10 PM - 7 AM local time), opt-outs per channel, and frequency caps (max 3 promotional pushes/day).
4. **Deduplication**: Prevent duplicate notifications if client triggers retries within 60 seconds.

### Non-Functional Requirements
- **High Availability**: 99.99% uptime for transactional pipelines.
- **Low Latency**: P99 delivery to gateway (APNS/FCM) within 500ms for high-priority alerts.
- **At-Least-Once Delivery**: No dropped alerts; idempotency keys to ensure exactly-once end-user rendering.
- **Horizontal Scalability**: Scale consumers elastically during Flash sales or breaking news.

---

## 2. High-Level Architecture Diagram

```text
[ Microservices ]
  (Orders, Auth, Marketing)
           │
           ▼
[ API Gateway & Auth ]
           │ (REST / gRPC + Idempotency Key)
           ▼
[ Notification Ingestion Service ]
   ├── Deduplication Cache (Redis SETNX key:ttl 60s)
   ├── User Preference & Consent Validator (Postgres / Redis Cache)
   └── Route by Priority / Channel
           │
     ┌─────┴─────────────────────────┐
     ▼                               ▼
[ Kafka: High-Priority ]       [ Kafka: Promotional / Bulk ]
  (OTPs, Security, Order State)   (Discounts, News, Re-engagement)
     │                               │
     ▼                               ▼
[ Worker Fleet: Push ]         [ Worker Fleet: Batch / Email ]
   ├── Rate Limiter (Redis Token Bucket per Device/Provider)
   ├── Template Engine & Personalization
   └── 3rd-Party Gateway Dispatchers
        ├── APNS HTTP/2 Client (Apple)
        ├── FCM v1 HTTP/2 Client (Google)
        ├── SMS Aggregator (Twilio)
        └── Email Gateway (SES / SendGrid)
           │
           ▼
[ Delivery Tracking & Analytics Engine ] (Kafka -> ClickHouse / Prometheus)
```

---

## 3. Core Data Model & Schema

```sql
-- User Notification Preferences
CREATE TABLE user_notification_settings (
    user_id UUID PRIMARY KEY,
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    quiet_hours_start TIME,   -- e.g. 22:00
    quiet_hours_end TIME,     -- e.g. 07:00
    timezone VARCHAR(50) DEFAULT 'UTC',
    max_promos_per_day INT DEFAULT 3
);

-- Device Registry
CREATE TABLE user_devices (
    device_id VARCHAR(128) PRIMARY KEY,
    user_id UUID NOT NULL,
    platform VARCHAR(10) CHECK (platform IN ('ios', 'android', 'web')),
    device_token TEXT NOT NULL,
    app_version VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Ledger (Audit & Idempotency)
CREATE TABLE notification_ledger (
    id UUID PRIMARY KEY,
    idempotency_key VARCHAR(64) UNIQUE,
    user_id UUID NOT NULL,
    channel VARCHAR(20) NOT NULL,
    priority VARCHAR(10) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('queued', 'sent', 'delivered', 'failed', 'suppressed')),
    retry_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 4. Deep Dive: Key Engineering Challenges

### A. Preventing Thundering Herd & Gateway Rate Limits
APNS and FCM impose strict connection limits and per-app quotas:
- **Persistent HTTP/2 Multiplexing**: Maintain warm connection pools to APNS and FCM rather than creating TCP connections per push.
- **Distributed Token Bucket Rate Limiting**: Redis clusters track outbound requests per provider token to prevent 429 Too Many Requests.

### B. User Quiet Hours & Timezone Handling
```python
def should_suppress_for_quiet_hours(user_settings, now_utc):
    user_tz = pytz.timezone(user_settings.timezone)
    local_time = now_utc.astimezone(user_tz).time()
    
    if user_settings.quiet_hours_start < user_settings.quiet_hours_end:
        return user_settings.quiet_hours_start <= local_time <= user_settings.quiet_hours_end
    else: # Crosses midnight
        return local_time >= user_settings.quiet_hours_start or local_time <= user_settings.quiet_hours_end
```

---

## 5. Failure Modes & Recovery
- **APNS Token Invalidation (`BadDeviceToken` 410)**: Worker immediately publishes an `InvalidateTokenEvent` to mark `is_active = false` in `user_devices`.
- **Downstream Provider Outage (e.g., Twilio degrades)**: Circuit breaker trips after 5% failure threshold, falling back to secondary SMS aggregator (e.g. AWS SNS or Gupshup).
