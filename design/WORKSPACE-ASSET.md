# Approved workspace artwork

The current hero uses the user's approved `design/hero-workspace-reference.png`. The original is retained unchanged. No replacement illustration was generated and no objects were redrawn.

## Prepared asset

- Public file: `public/images/hero/workspace-v1.webp`
- Dimensions: **1109 × 684 pixels**; preserve this aspect ratio when positioning interactions.
- Size: **194,500 bytes** (approximately 190 KiB).
- Source crop: left **665**, top **96**, width **1109**, height **684**, from the 1774 × 887 reference. The right and bottom coordinates are exclusive: 1774 and 780.
- Encoded with the existing Sharp dependency: WebP quality 94, alpha quality 100, effort 6. No resizing, retouching, sharpening, or replacement imagery was used.

The crop excludes the screenshot's navigation and the Featured Work divider. A nonrectangular left alpha mask removes the overlapping “that make” headline while retaining the workspace's handwritten annotation, plants, books, and desk. It does not synthesize missing pixels.

The mask's left boundary is linearly interpolated through these **original source-image coordinates**, written as `(y, x)`:

```text
(96, 765), (288, 765), (304, 825), (355, 825),
(380, 755), (450, 710), (600, 665), (780, 665)
```

For each cropped pixel, alpha is the product of three smoothstep fades: 18 pixels inward from that left boundary, 8 pixels inward from the top edge, and 18 pixels inward from the bottom edge. Smoothstep is `t * t * (3 - 2 * t)` after clamping `t` to `[0, 1]`. RGB values come from the source crop; only transparency and WebP encoding change them. The asset was inspected composited over the portfolio's `#F7F5EF` background to verify that no headline, navigation, paragraph, or button fragments remain.

## Interaction alignment

The following coordinates are percentages of the **complete 1109 × 684 asset**, not of the browser viewport. The image and hotspots must share one aspect-ratio-preserving coordinate container and any scene transforms. Do not use `object-fit: cover` to independently crop the visible scene.

| Object | Percentage coordinates |
| --- | --- |
| Laptop screen | Polygon: `(35.26, 42.69)`, `(68.62, 39.47)`, `(72.23, 70.61)`, `(38.59, 75.00)` |
| Notebook | Polygon: `(15.51, 79.68)`, `(29.58, 76.02)`, `(43.01, 88.01)`, `(22.81, 92.40)` |
| Mug including handle | Bounding box: left `80.1`, top `57.4`, width `14.5`, height `18.5` |
| Steam origin | Approximately `(85.3, 57.5)`, above the cup opening |

These are visual alignment guides; the component may use inset hit areas and additional visible controls to keep touch targets accessible at small sizes.

## Flattened-image limitations

The laptop screen, notebook, mug, camera, plants, books, Nepal postcard, light, and handwritten annotations are all baked into this one asset. The scene can move as a whole, but these objects are not independent visual layers. In particular, the postcard remains static relative to the scene. The laptop and notebook open separate real React panels; they do not claim to update the original screen or notebook pixels. Mug steam is an additive CSS/SVG overlay above the existing cup, not a physical mug tilt. Existing baked-in text is preserved as supplied, including small lettering that becomes less readable as the artwork scales down.

## Verification

- `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build` passed.
- `pnpm test:e2e` passed all 25 tests, including 14 existing portfolio tests and 11 workspace tests.
- Screenshot review covered 1440, 1280, 768, 390, and 360 pixels; existing responsive tests additionally checked 1024 pixels. Laptop and notebook panel screenshots are saved in the ignored `artifacts/` folder.
- Checks cover source-aligned hotspots, panel bounds, real preview state updates, keyboard tabs and focus wrapping, close/focus restoration, mug hover/focus/touch, restrained pointer depth, reduced motion, no-JavaScript artwork, asset loading, and horizontal overflow.
- The already optimized WebP is served without another lossy image-optimization pass to preserve the source's small lettering.
