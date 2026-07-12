# UI Robustness — density, font scaling, image memory

## Pixel density (1x/2x/3x)

```js
import { PixelRatio, StyleSheet } from "react-native";

// Snap to physical pixel grid — prevents blurry sub-pixel anti-aliasing
const crisp = PixelRatio.roundToNearestPixel(1.5);

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth, // thinnest renderable line on ANY density
    borderColor: "#e1e4e8",
  },
});
```

- dp/pt are density-independent; RN handles scaling. Hairline vs `1` matters on low-DPI Androids.
- Request correctly sized images per density (`@2x/@3x` or CDN width params) — never downscale 4K in memory.

## Font scaling / accessibility (the 200% question)

```jsx
<Text
  allowFontScaling={true}          // respect user setting (default)
  maxFontSizeMultiplier={1.3}      // cap where layout would break
>
```

- Prefer `minHeight` over `height`, let containers grow, test at 200%.
- `numberOfLines` + `ellipsizeMode` for constrained rows; never fixed-height text boxes.
- Answer shape: "Respect scaling by default, cap only where layout integrity breaks, design rows to grow."

## Image memory (OOM on image-heavy lists)

- Decoded bitmap cost = width × height × 4 bytes — a 4000×3000 photo ≈ 48MB RAM regardless of file size.
- Fixes: explicit dimensions + `resizeMode`, CDN-resized URLs, WebP, `react-native-fast-image`/`expo-image` (native caching), virtualization windows ([list-virtualization.md](list-virtualization.md)), prefetch next page thumbnails only.
- **My angle:** Multi-Image on PLP cards = selective rendering to match PDP quality without loading every variant — see [../../03-stories/multi-image.md](../../03-stories/multi-image.md).

## Yoga engine (one-liner)

Flexbox implemented in C++ — computes layout cross-platform, applied to native views (UIView/Android View). Same mental model as web flexbox minus CSS cascade.

## Designer hands you a perf-hostile Figma (50 hi-res images)

1. Quantify the cost (my overlay: memory + FPS with real data)
2. Propose equivalent-intent alternatives: progressive loading, blur-up placeholders, virtualized carousel
3. Agree on a performance budget up front — trade-offs explicit, not adversarial
