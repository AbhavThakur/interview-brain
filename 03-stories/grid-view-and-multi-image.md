# Story: Grid View & List/Grid Toggle

> End-to-end across iOS + Android · with XD, Product, QA, Backend

## STAR (30-second spoken version)

- **S** — PLP was list-only; product wanted a modern, content-dense grid without hurting scroll performance.
- **T** — Lead Grid View + a seamless List/Grid toggle from scratch, cross-platform.
- **A** — Single data pipeline, two presentation modes: `numColumns` switching with re-virtualization handling, per-mode item layouts (`getItemLayout` per type), image sizing per cell density, toggle state preserved across navigation/sessions. Collaborated with XD on density trade-offs, QA on device matrix.
- **R** — Shipped consistent on both platforms; became the foundation Multi-Image built on.

## Technical talking points

- Toggling `numColumns` forces list re-render — handled with a `key` change and preserved scroll anchor to avoid jarring jumps.
- Grid cells = smaller images but MORE simultaneously visible → memory math changes; tuned window sizes per mode using perf overlay numbers.
- Toggle architecture kept renderItem pure per mode — no conditional soup inside one megacomponent.

# Story: Multi-Image on PLP Cards

## STAR (30-second spoken version)

- **S** — PDP had rich imagery; PLP cards showed one image — inconsistent experience, product wanted parity without tanking the list.
- **T** — Selective multi-image rendering on cards matching PDP quality, iOS + Android, no OOM risk.
- **A** — Selective loading: only near-viewport cards fetch secondary images; explicit dimensions + CDN-sized variants; cache discipline via fast-image; measured with overlay memory tracking on low-end tier.
- **R** — PDP-consistent experience with stable memory profile across the device matrix.

Related topic: [../01-topics/react-native/ui-density-a11y-images.md](../01-topics/react-native/ui-density-a11y-images.md)
