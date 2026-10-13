# Creative Universe

An interactive 3D personal homepage built with Next.js, React Three Fiber and Three.js.
Three glowing worlds orbit a central core; clicking one flies the camera in and opens its content.

## Run it

```bash
npm install
npm run dev      # live preview at http://localhost:3000
npm run build    # static site in /out, ready for any host
```

## Where to change things

| What | File |
| --- | --- |
| Your name and hero text | `lib/site.ts` |
| World titles, colours, positions and the projects listed in each | `lib/sections.ts` |
| What each world shows when opened | `components/sections/DevProjects.tsx`, `AIStudio.tsx`, `InnovationLab.tsx` |
| Colours, type and layout | `app/globals.css` |

## How it fits together

- `components/universe/` holds the 3D scene: `Starfield`, `Constellation`, `OrbitRings`, `Core`, the three `WorldNode`s and `CameraRig`, which animates the camera between views.
- `components/ui/` holds the interface over the scene: `Nav`, `Hero`, `NodeLabels` and `SectionPanel`.
- `lib/store.ts` keeps which world is open. `lib/useNavigation.ts` syncs it with the URL (`#dev`, `#ai`, `#lab`), so the browser back button and shared links work and Escape zooms out.
- Phones get a tighter layout (`portraitPosition` in `lib/sections.ts`) and a bottom-sheet panel.
- Reduced-motion settings shorten every transition; slow devices automatically drop bloom and resolution.

## Deploying to GitHub Pages

`next.config.mjs` uses static export with relative asset paths, so the `/out` folder works from
`username.github.io/repo-name`. Push the repo, then either upload `/out` with the GitHub Pages
Action for Next.js or deploy the repo on Vercel or Netlify with no extra setup.
