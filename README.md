# Junrey Ducay — Developer Portfolio

A responsive, animated portfolio built with React, TypeScript, Vite, Tailwind CSS v4's official Vite plugin, Motion for React, and Lucide icons. Static hosting only; no backend, database, or contact form.

## Run locally

Use Node 22.13+ on the Node 22 line, or Node 24+. A current Node 22 release is recommended.

```sh
cd ducjunreyPortfolio
npm ci
npm run dev
```

Open the Local URL printed by Vite. To validate and preview production output:

```sh
npm run lint
npm run test
npm run build
npx playwright install chromium
npm run test:browser
npm run preview
```

This workstation originally had Node 22.9. A newer Node 22 runtime was installed in the ignored `.tools/` directory without changing the system installation. For PowerShell on this workstation, if Node has not been updated:

```powershell
$env:PATH = (Join-Path $PWD '.tools\node_modules\node\bin') + ';' + $env:PATH
& '.\.tools\node_modules\node\bin\node.exe' 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' run dev
```

Use the same command with `run build` or `run lint` as needed. The `.tools` runtime is not committed or required in CI.

## Edit content

| File                     | Content                                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| `src/data/personal.ts`   | Name, introduction, about paragraphs, email, phone number, social URLs, profile photo    |
| `src/data/experience.ts` | Employers, titles, dates, responsibilities, timeline                                     |
| `src/data/skills.ts`     | Skill categories and technologies; no ratings                                            |
| `src/data/projects.ts`   | Typed project content, roles, features, outcomes, screenshots, optional source/demo URLs |
| `src/data/navigation.ts` | Section navigation                                                                       |
| `src/styles/globals.css` | Theme tokens, layouts, responsive styles                                                 |
| `index.html`             | Title, description, Open Graph and Twitter metadata                                      |

Email, phone, GitHub, and LinkedIn are configured in `src/data/personal.ts`. The contact actions open the visitor's email or phone app; the copy button uses the clipboard and provides a visible success or failure message. Clipboard access requires HTTPS or localhost. No contact information is sent to a server by this website.

The Projects section contains 13 showcases based on the supplied application screenshots: JUMEX POS and store management, Abiso shipping and order management, task management, business document management, the Office Boost Outlook add-in, invoice approvals, fleet management, configurable FAQs, ADC and seven20 intranets, GIBA web parts, an app launcher, and account notifications. Related screens are grouped in each project's details gallery; repeat captures do not create extra cards. Descriptions use simple English to explain the work, the problem, and what users can do. They focus on visible functionality and supplied development experience without invented performance statistics or public demo links. Abiso uses PHP, as confirmed by the owner; no unconfirmed framework or database is listed.

Add a photo to `public/images/profile/` and set `personal.photo` to a path such as `images/profile/junrey.webp`. Use a compressed portrait, and update its alt text. Without a photo, the monogram graphic is displayed.

Project visuals use the original screenshots in `public/images/projects/`. Card framing uses CSS; originals remain intact for the detail galleries and enlarged image view. Edit paths, alt text, gallery captions, tools, and case-study details in `src/data/projects.ts`. Paths are relative to `public/` and automatically include the configured base path. Set optional `githubUrl` and `demoUrl` only for verified, public URLs.

`ProjectCarousel.tsx` shows three projects on desktop (1024px and wider), two on tablets, and one below 700px. It advances every six seconds, with smooth scrolling and a fade when wrapping. Visitors can swipe, use the navigation arrows or pagination, or use arrow/Home/End keys within the carousel. Autoplay pauses during hover, keyboard focus, open details, hidden tabs, and offscreen viewing; reduced-motion preferences disable autoplay and transition effects. The layout lives in `src/styles/project-carousel.css`, imported directly by `src/main.tsx`.

JUMEX lists the owner-confirmed React/Vite/Material UI frontend, Node.js/Express backend on Render, Firebase services, IndexedDB, browser storage, React Router, REST/Fetch, and SheetJS stack in its details. `cardTechnologies` selects a short set of badges for the carousel while `technologies` retains the full list. Its optional `architecture` content explains the store screens, checkout API, offline pending sales, and cloud records under “How it works.” Other project cards and details keep their existing content structure.

## Enable the CV download

1. Add your PDF at `public/resume/Junrey_Ducay_CV.pdf`.
2. Restart the dev server or rebuild the website.

Vite checks for the file at startup/build time. The download becomes enabled automatically; the missing-file state has no download URL. The PDF is included in the static build. Do not commit confidential personal information you do not want publicly downloadable.

## GitHub Pages

The application and `package.json` are in the **repository root**, alongside `.github/workflows/deploy.yml`. The workflow installs, checks, builds, and uploads `dist/` from that root.

1. Create or choose your GitHub repository and push this workspace to its `main` branch. If the default branch has another name, update the workflow trigger.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. In **Actions**, run **Deploy portfolio to GitHub Pages**, or push a change on `main`.
4. The workflow installs from the lockfile, lints, runs unit tests, builds, and runs the production browser checks before uploading `dist/` and deploying. Its `github-pages` environment and deployment result display the public URL. A failed check prevents deployment.

The workflow reads `base_path` and `base_url` from GitHub's Configure Pages action, so it supports a user/organization root domain, a repository subpath, and a configured custom domain without assuming your username or repository name. Configure any custom domain in GitHub Pages settings first. If you change a Pages setting without a source change, manually rerun the workflow.

For builds outside GitHub Actions, copy `.env.example` to `.env.local` and set:

```dotenv
# Root site or custom domain
VITE_BASE_PATH=/
VITE_SITE_URL=https://YOUR_DOMAIN
```

Or for a repository site:

```dotenv
VITE_BASE_PATH=/YOUR_REPOSITORY/
VITE_SITE_URL=https://YOUR_USERNAME.github.io/YOUR_REPOSITORY
```

Always include leading and trailing slashes in `VITE_BASE_PATH`. `VITE_SITE_URL` is the full public URL without a trailing slash. It enables absolute social-image and canonical URLs. Rebuild after changes. All navigation uses section anchors, so no SPA rewrite is needed.

The included `public/images/social-preview.png` is an editable sharing image. Replace it with your preferred 1200×630 PNG/JPEG before launch. Without a public site URL, metadata uses a base-relative placeholder image; GitHub Actions supplies the full URL automatically.

References: [Vite's official Pages deployment guide](https://vite.dev/guide/static-deploy.html#github-pages), [Tailwind's official Vite integration](https://tailwindcss.com/docs/installation/using-vite), [Motion's React installation guide](https://motion.dev/docs/react-installation).

## Accessibility and behavior

The hero's compact AI tools carousel sits between the experience count and scroll cue; on mobile it uses the next row of the same footer. It shows the 20 requested AI tools in order, each with one 18px logo and an 11px name. Logos are served locally. Autoplay advances one item every 2.4 seconds with a 0.58-second transition and loops in either direction. Viewers can use the previous/next arrows, keyboard arrows, and native touch swiping. Autoplay pauses on hover, keyboard focus, when offscreen, and in hidden tabs; reduced-motion preferences disable autoplay and make manual navigation immediate. Edit the AI list in `src/data/aiTools.ts`, behavior in `src/components/ui/TechnologyCarousel.tsx`, and layout in `src/styles/technology-carousel.css`. Logo sources and license notices are documented in `public/images/ai-tools/ASSETS.md`. The separate skills orbit continues to use `src/data/technologies.ts` and its existing technology logos.

Semantic sections, a skip link, visible focus rings, meaningful image alternatives, keyboard-accessible controls, and a native modal dialog are included. The dialog traps focus, closes with Escape, and restores focus to its opening button. Navigation tracks the visible section. Mobile navigation closes after selection or Escape. The saved theme is applied before React loads and gracefully handles unavailable storage. Dark is the default.

Tablet screens use a stacked hero to keep the editor clear of the introduction. The project dialog has a sticky title and close control, and mobile navigation scrolls within short landscape screens. A stable scrollbar gutter prevents the background from shifting when a dialog opens. Loading and running states are shown in the editor's Run control; complete text output is also available to screen readers.

`npm run test:browser` starts a production preview on port 4175 and checks both themes, 14 widths from 320px to 2560px, heading clipping, hero overlap, accessibility, real JavaScript/TypeScript/Python/SQL execution, input limits, timeout recovery, all 13 project galleries, keyboard focus, mobile/landscape navigation, and result animation lifecycle. It requires a completed build and Playwright Chromium (`npx playwright install chromium`). Set `BROWSER_CHANNEL=msedge` to use an installed Microsoft Edge browser instead, or `TEST_URL` to check an already running preview. A failure screenshot is saved in the ignored `test-results/` directory. The browser checks also run in the Pages workflow using its repository base path.

Motion uses the visitor's reduced-motion preference; CSS transitions and smooth scrolling also respect it. Project images are lazy-loaded. The hero illustrations use HTML/CSS and icons rather than a heavy image or 3D dependency.

`src/hooks/useReducedMotion.ts` subscribes to device preference changes with `useSyncExternalStore`. Changing reduced motion while the page is open immediately stops autoplay, canvas, GSAP, and Motion animations and settles the result text, without requiring a reload.

React and animation libraries are built into separate, hashed chunks so content updates can reuse cached libraries. Python, SQL, and TypeScript runtimes remain separate and are requested only when visitors run those languages.

The result headline follows the [WELCOME GIF reference](https://i.pinimg.com/originals/b9/ab/f0/b9abf0a0feb3219f56a51448d8ffae2c.gif): stationary letter strokes progressively erase, hold blank for 0.6 seconds, then draw back in reverse order. The source has 100 frames at 40 ms each; its erase and redraw take approximately one second each. The visible result inherits the exact font family, weight, size, and spacing of **Business applications.** `AnimatedResult.tsx` uses GSAP to animate SVG stroke masks over the native text, with mask paths in `src/lib/strokeGlyphs.ts`. Each letter eases continuously through its full stroke sequence, with a light feather on the moving mask edge that returns to zero at both ends. Complete text stays sharp. Masks initialize before paint to prevent flashes during result changes. Other Unicode characters use a clipping reveal. Text remains selectable and accessible as a single result. One transition plays only after each completed code execution, including repeated results and errors. Going offscreen or changing tabs settles the result; returning does not replay it. Reduced-motion preferences show results directly. GSAP contexts clean up every timeline and its inline styles.

The greeting has a small meteor that approaches from the upper left, lands on the last letter of the name, and sends a gentle ripple backward through the letters before they settle. Each completed automatic or visitor-written code run schedules one meteor flight two seconds later, including errors and repeated outputs. Starting another run cancels a pending launch and starts a fresh countdown when that run finishes. Flights pause offscreen and in hidden tabs, and are disabled for reduced motion. Launch timing lives in `src/components/ui/MeteorName.tsx`; its flight, impact, and colors live in `src/styles/name-meteor.css`.

The hero editor automatically types, executes, and displays the output of five standalone JavaScript examples about business technology impact. The first example starts at line eleven so its first result appears quickly. Small glowing planets keep orbiting the editor. The headline stays still while code types or runs, then erases the previous result and draws the new one when execution completes. Errors use the same effect with **Every idea starts with a first draft.** in the headline and only **Compiled Error** below the editor, without runtime details. The examples do not connect to real enterprise systems or claim project outcomes. Edit the snippets and technology labels in `src/data/workflowVisual.ts`, the timing in `src/components/ui/AnimatedResult.tsx`, and the lettering styles in `src/styles/result-animation.css`. Reduced-motion preferences show the first completed example without a typewriter loop; visitors can still use the interactive editor.

Select **Write your code with me** to enter the editor. JavaScript, TypeScript, Python, and SQL run locally in disposable browser workers. Use **Run** or **Ctrl/⌘ + Enter**, then the return-to-autoplay control to resume the five examples. Each language keeps its own draft in memory for the current page session. Nothing is uploaded or stored in a backend. Output is rendered as plain text, not HTML. There is no TypeScript footer label, filename title, or pause button.

The editor is limited to **12 lines**, **42 characters per line**, and **515 characters total**; oversized edits are rejected with the **Compiled Error** label. Output is capped at 2,000 characters. Runtime startup has a 60-second timeout, and execution has a 5-second timeout; runaway code terminates its worker instead of blocking the page. Failures use the generic error headline and label; runtime details are hidden. The input uses normal Tab navigation, and mobile editing expands the editor to avoid the decorative illustration's scale.

Language support is for standalone snippets: JavaScript supports console output and top-level `await`/`return`; TypeScript is transpiled to JavaScript using Sucrase (without static type checking); Python uses Pyodide with its standard library; SQL uses a fresh in-memory SQLite database per run. Extra npm/Python packages, persistent databases, and DOM applications are outside this small editor's scope. Python, SQL, and TypeScript runtime files load only on use. The Python runtime is self-hosted from the build's `runtimes/python/` directory, so it needs no CDN or compiler-service account. The build contains about 13.5 MB of Python runtime assets, which are not part of the initial page download. `src/lib/pythonAssets.ts` provides the explicit runtime files for both dev and production; keep them in the Pages upload.

Implementation references: [Pyodide browser workers](https://pyodide.org/en/stable/usage/webworker.html), [Pyodide self-hosted Vite assets](https://pyodide.org/en/stable/usage/working-with-bundlers.html), [Sucrase](https://github.com/alangpierce/sucrase), [sql.js](https://sql.js.org/).

The full hero section also has an independent universe background in `src/components/ui/HeroUniverse.tsx` and `src/styles/hero-universe.css`. In dark mode, its generated nebula texture drifts behind the existing illustration. Light mode uses soft lavender/cyan cloud gradients, blue stars, a white editor, and a matching syntax palette. Independent light layers and a canvas starfield capped at 30fps (fewer stars on mobile) keep the scene alive. There are no on-screen pause controls. Offscreen, hidden-tab, and reduced-motion states stop continuous animation. The text area stays readable in both themes. The optimized dark-mode texture and generation notes are in `public/images/backgrounds/`; the lossless source is in `src/assets/hero-nebula-source.png` and is excluded from the deployed build.

## Structure

```text
public/            Favicon, profile/project visuals, sharing image, resume
src/components/   Layout, UI, cards, reusable animations
src/sections/     Hero, About, Experience, Skills, Projects, Contact
src/data/         Editable portfolio content
src/hooks/        Persistent theme preference
src/types/        Shared TypeScript interfaces
src/lib/          Animation variants and asset helpers
src/styles/       Tailwind import, theme tokens, responsive styles
```

Dependency versions are resolved in `package-lock.json`. TypeScript 6.0 is used because the current TypeScript ESLint integration does not yet support TypeScript 7. Avoid forcing peer dependency resolutions.
