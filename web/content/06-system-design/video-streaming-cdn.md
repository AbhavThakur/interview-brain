---
title: Video Streaming & Transcoding Architecture (YouTube / Netflix Scale)
category: distributed-systems
difficulty: Senior
tags: [HLD, Video Streaming, HLS, DASH, CDN, Chunked Upload, Transcoding]
---

# Video Streaming & Transcoding Architecture

Design an elastic video ingestion, adaptive bitrate transcoding, and global CDN delivery architecture capable of serving millions of concurrent streams across varied network bandwidths.

---

## 1. System Requirements & Invariants

1. **Resumable Chunked Upload**: Creators can upload multi-gigabyte 4K master files reliably even over unstable connections.
2. **Adaptive Bitrate Streaming (ABR)**: Automatically adjust video quality (1080p, 720p, 480p, 360p) in real time according to client bandwidth using **HLS (HTTP Live Streaming)** and **DASH**.
3. **Global Sub-Second Playback Initiation**: First frame rendered in < 800ms globally.
4. **Bandwidth Optimization**: Chunk videos into 2-6 second `.ts` or `.m4s` segments indexed by an `.m3u8` master playlist.

---

## 2. Ingestion & Transcoding Pipeline

```text
[ Video Creator ]
       │ (Chunked Resumable Upload via S3 Pre-signed URL)
       ▼
[ S3 Raw Master Bucket ]
       │
       ▼ (S3 Event Notification)
[ SQS Ingestion Queue ]
       │
       ▼
[ Transcoding Orchestrator (Temporal / Step Functions) ]
       │
       ├── Video Analysis: Scene detection, audio track extraction, DRM check
       │
       ▼ (Parallel Job Distribution)
[ GPU Worker Fleet (FFmpeg / NVENC) ]
       ├── Split video into 4-second GOP chunks
       ├── Encode into 1080p, 720p, 480p, 360p (H.264 / AV1)
       └── Generate Master Playlist (.m3u8) & Media Playlists
       │
       ▼
[ S3 Transcoded Egress Bucket ]
       │
       ▼
[ Multi-CDN Distribution (Cloudflare + CloudFront) ]
       │
       ▼
[ End-User Player (ExoPlayer / AVPlayer / Video.js) ]
```

---

## 3. The Master Playlist (.m3u8) Structure

The client fetches the master manifest first, selecting the optimal stream based on initial network probe:

```text
#EXTM3U
#EXT-X-VERSION:6

# 1080p Stream (High Bandwidth)
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080,CODECS="avc1.640028,mp4a.40.2"
1080p/index.m3u8

# 720p Stream (Medium Bandwidth)
#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720,CODECS="avc1.4d401f,mp4a.40.2"
720p/index.m3u8

# 360p Stream (Cellular / Low Bandwidth)
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360,CODECS="avc1.42e01e,mp4a.40.2"
360p/index.m3u8
```

---

## 4. CDN Caching Strategy
- **Manifest Files (`.m3u8`)**: Low TTL (2-5 seconds for live streaming; 1 hour for VOD).
- **Video Chunks (`.m4s` / `.ts`)**: Immutable content-addressed caching. Cache for **30 days** at Edge POPs (`Cache-Control: public, max-age=2592000, immutable`).
