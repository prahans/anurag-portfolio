# Portfolio assets

## Developer illustration

- Runtime asset: `public/images/hero/developer-v1.webp`
- Dimensions: 1536 × 1024, RGBA WebP with genuine transparency.
- Created with the built-in image generation tool for this portfolio. This is an illustrative character, not a photograph of Anurag.
- Original generated PNG remains in the generator's output directory; the optimized, independently usable WebP is included in this repository.
- The character, chair, laptop, desk and desk objects form one replaceable foreground asset. Notes, wall lighting, and the mountain photograph are separate page elements.
- Replace the configured `heroCharacterSrc` in `data/site.ts` with a new transparent asset using a similar 3:2 composition. Keep a little space around the hair and desk edges.

### Generation prompt

```text
Use case: stylized-concept.
Asset type: transparent cutout hero illustration for a warm cream creative developer portfolio; standalone reusable man-and-workspace asset, not a website screenshot.
Primary request: A warm, polished editorial semi-realistic digital painting of an approachable Nepali male developer around 24 years old sitting at a warm wooden desk. Mature adult proportions, naturally masculine features, short well-groomed beard, dark slightly wavy textured hair, thoughtful calm friendly expression, casual charcoal sweater. He is seated in a simple charcoal desk chair, turned three-quarters toward an open unbranded laptop to the viewer's right, holding a ceramic coffee mug in one hand naturally. Include the desk, an open notebook and pen, small stack of books, and one small leafy potted plant toward the left of the desk. These objects form one coherent isolated foreground scene.
Composition: landscape 3:2 asset, person centered slightly right, face and torso prominent in upper middle, laptop in lower right, desk and small objects in lower third. Show the complete tabletop and all scene objects with breathing room at the sides, no abrupt cropping of face, hair, hands, objects or desk ends. Waist-up seated view; desk legs need not be shown. The bottom of the wood desk can finish in a delicate painterly brush edge.
Style: detailed, sophisticated painterly illustration, near-realistic facial anatomy, subtle brush texture, warm natural window light from upper left, appealing soft shadows within objects, earthy wood and green plants, dark sweater. High quality editorial art, warm and professional.
Scene/backdrop: genuinely transparent alpha background around all foreground objects. NO room, NO wall, NO window, NO surrounding floor, NO mountain photograph, NO floating notes, NO lettering, NO website layout, NO text or logo. The portfolio will add all background elements separately.
Avoid: childish anime, chibi, exaggerated muscles, arrogant expression, plastic 3D rendering, photoreal identity claim, heavy outline, harsh cutout borders, opaque background, fake checkerboard background.
```

## Nepal mountain photograph

- Runtime asset: `public/images/hero/nepal-mountains.jpg`
- Photographer: Raimond Klavins.
- Subject: Annapurna, Narchyang, Nepal.
- Source: https://unsplash.com/photos/a-mountain-with-snow-eiXfqzMUAQg
- Image source: https://images.unsplash.com/photo-1668966780138-8575556b2b8f
- License: https://unsplash.com/license (free commercial and noncommercial use; no permission required).
- Downloaded as a 900-pixel-wide JPEG for the decorative mountain postcard. No remote image request is required at runtime.

## Design reference

`design/Warm Minimal Developer Portfolio.png` is retained as the approved visual reference. It is not used as a flattened page background or permanent cropped hero image.
