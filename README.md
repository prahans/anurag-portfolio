# Anurag Panuhar — Creative Developer Portfolio

A warm, editorial portfolio for a full-stack developer based in Nepal. The homepage follows the approved [design reference](design/Warm%20Minimal%20Developer%20Portfolio.png): cream tones, expressive serif typography, handwritten details, a layered illustrated workspace, and compact project, About, Skills, and Contact sections.

The application stays in the existing root-level App Router. The design reference is preserved and is not used as a flattened page background.

## Stack

- Next.js 16.4.3, React 19.3.0, and TypeScript
- Tailwind CSS v4 theme tokens plus component CSS
- Motion for React for restrained, reduced-motion-aware reveals
- Lucide React icons
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

## Replace the developer illustration

1. Add a transparent PNG or WebP to `public/images/hero/`.
2. Set `site.heroCharacterSrc` in `data/site.ts` to its public path, such as `/images/hero/developer-v2.webp`.
3. Update `heroCharacterAlt` to describe the new illustration.
4. Check the composition on desktop and mobile. A 3:2 asset, similar to the included 1536 × 1024 image, fits the existing slot. Leave room around the head and desk edges and preserve genuine alpha transparency.

`components/ui/HeroArtwork.tsx` owns the image slot. The character, chair, laptop, desk, and tabletop objects are grouped in the current foreground illustration; replacing this asset replaces that group. The mountain postcard, handwritten notes, and window lighting remain separate elements and do not require layout changes. `mountainImageSrc` configures the Nepal photograph independently.

The generated figure is an illustrative representation, not Anurag's real photograph. The exact generation prompt and the licensed Annapurna photograph attribution are recorded in [design/ASSETS.md](design/ASSETS.md).

## Verification

Final verification results will be recorded here after the implementation review. Required checks are ESLint, `tsc --noEmit`, and the production build. Browser review should cover 360, 390, 768, 1024, 1280, and 1440-pixel viewports, including navigation, image loading, typography, overflow, and reduced motion.

## Current limitations

- Project names, descriptions, technologies, and previews remain editable placeholders until real project content is supplied.
- Only the supplied GitHub profile is configured; there is no contact form or email delivery backend.
- The illustration is newly generated, so the pose and workspace details differ from the flattened reference. The character and desk objects are grouped within a single replaceable asset.
- Skill marks use simple text fallbacks where a brand icon is not included; no proficiency claims are made.
- Dark mode and an introduction video are omitted because neither is configured.
- Fonts require network access on an uncached build. No runtime remote image service is required for the included local assets.

This repository change is a local implementation; it does not create a deployment or publish to GitHub.
