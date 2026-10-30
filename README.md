# Anurag Panuhar — Creative Developer Portfolio

A warm, editorial portfolio for a full-stack developer based in Nepal. The homepage follows the approved [design reference](design/Warm%20Minimal%20Developer%20Portfolio.png): cream tones, expressive serif typography, handwritten details, a layered illustrated workspace, and compact project, About, Skills, and Contact sections.

The application stays in the existing root-level App Router. The design reference is preserved and is not used as a flattened page background.

## Stack

- Next.js 16.4.3, React 19.3.0, and TypeScript
- Tailwind CSS v4 theme tokens plus component CSS
- Motion for React for restrained, reduced-motion-aware reveals
- Lucide React icons
- Locally hosted technology brand SVGs and a shared GitHub icon
- Playwright for responsive screenshots and navigation checks
- `next/image` for local artwork and project images
- `next/font/google`: Fraunces, Instrument Serif Italic, DM Sans, Caveat, and IBM Plex Mono

## Run locally

Use a Node.js version supported by the installed Next.js release and npm. Keep `package-lock.json`; do not switch package managers.

```bash
npm install
npm run dev
```

Open the Local URL printed by Next.js, normally [http://localhost:3000](http://localhost:3000). For a clean install that exactly follows the lockfile, use `npm ci` instead of `npm install`.

On Windows PowerShell, if execution policy blocks `npm.ps1` or `npx.ps1`, use `npm.cmd` and `npx.cmd` for the same commands; changing execution policy is unnecessary.

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

`start` serves the production build after `build` succeeds. Google Fonts are downloaded during development/build and then served locally by Next.js. The initial build needs access to Google Fonts unless those files are already cached.

## Project structure

```text
app/
  layout.tsx                 Fonts, metadata, viewport, global styles
  page.tsx                   Homepage composition
  globals.css                Tokens, navigation, hero, shared/responsive styles
  icon.svg                   Portfolio icon
components/
  layout/                    Navbar and Footer
  sections/                  Hero, FeaturedWork, About, TechStack, Contact
    sections.css             Styles for the sections below the hero
  ui/                        HeroArtwork, ProjectCard, SectionHeading, Reveal
data/
  site.ts                    Identity, copy, navigation, contact, artwork paths
  projects.ts                Typed configurable project entries
  skills.ts                  Skill names and visual marks
public/images/
  hero/                      Transparent illustration and Nepal photograph
  projects/                  Illustrative SVG concept previews
  skills/                    Local technology icons and license
tests/
  portfolio.spec.ts          Responsive and interaction checks
playwright.config.ts         Headless browser configuration
design/
  Warm Minimal Developer Portfolio.png
  ASSETS.md                  Illustration prompt and photograph provenance
```

Most content is rendered by Server Components. Client behavior is limited to navigation and motion. The navbar has working anchors, active-section indication, a mobile disclosure, and keyboard support. Motion honors `prefers-reduced-motion`; essential server-rendered content remains visible without JavaScript. The footer year uses Nepal's timezone.

Before changing framework behavior, read `AGENTS.md` and the relevant installed documentation in `node_modules/next/dist/docs/`. Keep the generated Next.js instructions intact.

## Edit content and styling

| Change | Location |
| --- | --- |
| Name, role, location, introductory/About/Contact copy | `data/site.ts` |
| Navigation labels and anchors | `data/site.ts` and the corresponding section IDs |
| Hero headline and highlights | `components/sections/Hero.tsx` |
| Section headings and personality cards | Corresponding files in `components/sections/` |
| Colors and reusable Tailwind theme tokens | `:root` and `@theme inline` in `app/globals.css` |
| Fonts and metadata | `app/layout.tsx` |
| Skills | `data/skills.ts` |

The known contact action is [GitHub](https://github.com/prahans). Set `email`, `linkedin`, or `resume` in `data/site.ts` only when real values are available. Undefined contact fields are hidden. The navbar's “Let's Talk” button always scrolls to Contact; it does not depend on an email address.

## Add real projects

Edit the entries in `data/projects.ts`. Each entry supports:

- `id`, `title`, `description`, and `category`
- `technologies`: an array of technology labels
- `image`: local public path, and `imageAlt`: a useful description
- Optional `githubUrl` and `liveUrl`
- `featured`: whether to display the card in Featured Work
- `provisional`: whether to show the “Concept placeholder” label
- `accent`: `lime`, `orange`, or `pink`

Place actual screenshots in `public/images/projects/` and reference them as `/images/projects/your-project.webp`. The current preview frame uses a 420:330 aspect ratio; use a similar image ratio or adjust its framing in `sections.css`. Prefer optimized WebP/AVIF images and meaningful alt text. Set `provisional: false` only after replacing the illustrative content with an actual project. Missing external URLs produce no link or clickable arrow.

The three included entries and SVG previews are explicitly provisional concepts, not screenshots or claims of completed applications.

## Workspace artwork and interactions

The hero uses the approved `design/hero-workspace-reference.png`, cropped and edge-masked into `public/images/hero/workspace-v1.webp`. The 1109 × 684 asset is approximately 190 KiB and retains the original scene. It contains no duplicated navigation or hero copy. The original reference remains unchanged. Crop, mask, and hotspot coordinates are documented in [design/WORKSPACE-ASSET.md](design/WORKSPACE-ASSET.md).

`site.heroWorkspaceSrc` and `heroWorkspaceAlt` in `data/site.ts` configure the asset. `components/ui/HeroArtwork.tsx` and `hero-workspace.css` keep the image and percentage-based hotspots in a shared aspect-ratio container. If the artwork composition changes, update the hotspot coordinates against the new image and repeat responsive checks.

- The laptop opens an accessible dialog with keyboard-operated Code and Preview tabs. The preview's “Add an idea” button updates a local demo counter.
- The notebook opens a short personal note. Both dialogs support close buttons, Escape, backdrop dismissal, contained keyboard focus, and focus restoration.
- The mug has continuously drifting coffee steam and a coffee note on hover, focus, or tap. Escape or an outside tap dismisses the note. The laptop, notebook, and mug remain directly interactive in the artwork, without an extra shortcut row beneath it.
- Entrance, sunlight, and small pointer-depth effects respect reduced motion. The artwork is visible without JavaScript; inactive controls remain hidden.

The postcard and other objects remain part of the flattened artwork. Dialog content does not replace the baked-in screen pixels, and the mug does not physically tilt. The previous portrait and its separate decorations are no longer rendered.

Focused checks live in `tests/workspace.spec.ts`. With the production server running on port 3100, run `pnpm test:e2e`; use `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build` for the other checks.

## Verification

Verified with `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build`. The production page passes 25 Playwright checks covering 360, 390, 768, 1024, 1280, and 1440-pixel viewports, image loading, all five actual font families, horizontal overflow, mobile navigation, contact and project controls, workspace hotspots and panels, keyboard focus, reduced motion, and essential content with JavaScript disabled. No browser console errors were found. Desktop, tablet, and mobile screenshots were inspected against the approved artwork.

To reproduce browser checks, run a production server in one terminal, then the tests in another:

```bash
pnpm build
pnpm start --hostname 127.0.0.1 --port 3100
# In a second terminal:
pnpm test:e2e
```

Tests use a locally installed Chrome by default. Set `PLAYWRIGHT_CHANNEL=msedge` to use Edge, or install Chrome with `npx playwright install chrome` if necessary. Set `PLAYWRIGHT_BASE_URL` for a server at a different address. Successful full-page screenshots are saved in `artifacts/portfolio-{width}.png`; test artifacts are ignored by Git. The in-app preview browser was unavailable, so visual QA used headless Chrome.

## Current limitations

- Project names, descriptions, technologies, and previews remain editable placeholders until real project content is supplied.
- Only the supplied GitHub profile is configured; there is no contact form or email delivery backend.
- Workspace objects and small lettering are baked into the approved flattened image. Objects move together; interactions open separate panels or add steam above the existing mug.
- Skills use local brand icons, with configurable text fallbacks for future entries; no proficiency claims are made.
- Dark mode and an introduction video are omitted because neither is configured.
- Fonts require network access on an uncached build. No runtime remote image service is required for the included local assets.

This repository change is a local implementation; it does not create a deployment or publish to GitHub.
