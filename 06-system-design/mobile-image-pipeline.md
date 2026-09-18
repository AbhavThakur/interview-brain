---
title: Mobile Image Loading & Multi-Tier Caching Pipeline (Fresco / Glide / Coil)
category: mobile-frontend
difficulty: Senior
tags: [Mobile System Design, LLD, Android, iOS, React Native, Caching, Bitmaps, OOM]
---

# Mobile Image Loading & Multi-Tier Caching Pipeline

Design an end-to-end image loading, decoding, and caching architecture for high-concurrency mobile feeds (e.g. Instagram / Pinterest / Best Buy PLP) that eliminates Out-Of-Memory (OOM) crashes and delivers smooth 60/120fps scrolling.

---

## 1. The Core Mobile Image Problem
On mobile devices (Android/iOS), downloading an uncompressed 4K image (4032x3024) into memory consumes:
$$	ext{Memory} = 4032 	imes 3024 	imes 4 	ext{ bytes (ARGB\_8888)} pprox 48.7 	ext{ MB!}$$
Displaying just 4 of these in a RecyclerView/FlatList immediately causes an **OOM (Out-Of-Memory)** crash or frame-drop stutter (jank).

---

## 2. Multi-Tier Cache Architecture

```text
[ View / Image Component ]
          │ (Request image URL with Target View Dimensions: e.g. 200x200)
          ▼
[ Memory Cache (L1: LRU Decoded Bitmaps) ] ────► HIT? Return Bitmap immediately (< 2ms)
          │ MISS
          ▼
[ Disk Cache (L2: Encoded JPEG/WebP Chunks) ] ──► HIT? Decode with Downsampling ──► Return (< 20ms)
          │ MISS
          ▼
[ Request Deduplicator (Flight Coalescing) ]
          │ (If URL already in-flight, attach Promise; do not spawn duplicate network call)
          ▼
[ Network Downloader (HTTP/2 with Cancellation) ]
          │
          ├── Write raw bytes to Disk Cache (L2)
          ├── Subsample decode to match Target View Size
          └── Store downsampled bitmap in Memory Cache (L1)
```

---

## 3. Subsampling & Downsampling Logic

Never decode raw source dimensions. Read image metadata (`inJustDecodeBounds = true`), calculate power-of-2 `inSampleSize`, and decode only what the screen can display:

```kotlin
fun decodeSampledBitmap(file: File, reqWidth: Int, reqHeight: Int): Bitmap {
    val options = BitmapFactory.Options().apply {
        inJustDecodeBounds = true
    }
    BitmapFactory.decodeFile(file.absolutePath, options)

    // Calculate inSampleSize
    var inSampleSize = 1
    if (options.outHeight > reqHeight || options.outWidth > reqWidth) {
        val halfHeight = options.outHeight / 2
        val halfWidth = options.outWidth / 2
        while ((halfHeight / inSampleSize) >= reqHeight && (halfWidth / inSampleSize) >= reqWidth) {
            inSampleSize *= 2
        }
    }

    options.inJustDecodeBounds = false
    options.inSampleSize = inSampleSize
    options.inPreferredConfig = Bitmap.Config.RGB_565 // 2 bytes per pixel instead of 4 for thumbnails
    
    return BitmapFactory.decodeFile(file.absolutePath, options)
}
```

---

## 4. Fast Scroll Cancellation & Request Recycling
When a user flings through a feed, list views recycle view holders:
1. **Tag-Based Cancellation**: If a view holder is recycled for item `B` while image `A` is still downloading, immediately cancel image `A`'s HTTP task.
2. **Priority Inversion**: Visible cells have `HIGH` priority; prefetch buffer cells have `LOW` priority.
