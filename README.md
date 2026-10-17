# Creative Universe

An interactive 3D personal homepage built with Next.js, React Three Fiber and Three.js.
Three glowing worlds orbit a central core; clicking one flies the camera in and opens its content.
Every project has its own 3D artifact in the constellation and its own page at `/projects/<slug>/`.

## Run it

```bash
npm install
npm run dev      # live preview at http://localhost:3000
npm run build    # static site in /out, ready for any host
```

## Where to change things

| What | File |
| --- | --- |
| Your name, tagline, hero text, About copy, GitHub and LinkedIn links | `lib/site.ts` |
| Projects: title, line, tags, GitHub/demo links, write-up, screenshots | `lib/projects.ts` |
| Project screenshots | `public/projects/<slug>/` (then list them in `lib/projects.ts`) |
| Web Gallery sites | `lib/projects.ts` entries with `section: "web"`; `demo` is the live URL, `embed` says whether it can show in an iframe |
| World titles, colours and positions | `lib/sections.ts` |
| Artifact palette and spin speed | `components/artifacts/palette.ts` |
| What each world shows when opened | `components/sections/DevProjects.tsx`, `AIStudio.tsx`, `InnovationLab.tsx` |
| Colours, type and layout | `app/globals.css` |

## How it fits together

- `components/universe/` holds the 3D scene: `Starfield`, `Constellation`, `OrbitRings`, `Core`, the three `WorldNode`s and `CameraRig`, which animates the camera between views.
- `components/ui/` holds the interface over the scene: `Nav`, `Hero`, `NodeLabels` and `SectionPanel`.
- `components/artifacts/` holds the project artifacts: AI projects are glowing prisms, software is a structure of connected nodes, and prototypes are wireframes that slowly assemble. All share one material and palette. Hover shows the title; clicking flies the camera to the artifact, fades out (`Warp`) and opens the project page.
- The Web Gallery world (`components/sections/WebGallery.tsx`) shows a card per site. A card opens `components/ui/GalleryViewer.tsx`, a browser-style window with desktop and mobile views. Sites with `embed: true` load live in an iframe. Sites that block framing (`X-Frame-Options: DENY` or `frame-ancestors 'none'`) show a scrollable full-page capture instead (`public/projects/<slug>/full.jpg` and `full-mobile.jpg`), plus a link to the live site. Each card also needs `thumb.jpg`.
- `components/showcase/` is the project page: the artifact as the hero, then the problem, what was built, the tech, screenshots and links. Empty GitHub or demo links are hidden.
- `app/robots.ts`, `app/sitemap.ts` and the metadata in `app/layout.tsx` and `app/projects/[slug]/page.tsx` cover SEO and sharing. `public/og.png` is the 1200×630 share image; the domain is `site.url` in `lib/site.ts`.
- `lib/store.ts` keeps which world is open. `lib/useNavigation.ts` syncs it with the URL (`#dev`, `#ai`, `#lab`, `#about`), so the browser back button and shared links work and Escape zooms out.
- Phones get a tighter layout (`portraitPosition` in `lib/sections.ts`) and a bottom-sheet panel.
- Reduced-motion settings shorten every transition; slow devices automatically drop bloom and resolution.

## Deploying

The site is deployed at `universeoftech.vercel.app`. `npm run build` writes a static site to `/out`;
deploy the repo on Vercel or Netlify (or upload `/out` to any static host) and point the domain at it.
Assets load from the domain root, so project pages work at any depth. If you ever serve the site from
a sub-folder instead, set `NEXT_PUBLIC_ASSET_PREFIX` to that folder when building.
