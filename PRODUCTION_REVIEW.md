# Production review — 26 October 2026

The portfolio is ready for public deployment based on the checks below. The CV is intentionally pending. This review updated local files; it did not commit, push, or publish the site.

## Fixes

- Corrected GitHub Pages paths: the app, lockfile, and `dist/` are at the repository root. Pushes to `main` now trigger deployment.
- Added a production browser check before the workflow uploads and deploys the site. Failed checks prevent deployment.
- Removed the tablet hero/editor overlap and checked responsive breakpoints from 320px to 2560px in both themes.
- Fixed light-theme editor text contrast and allowed long skill names to wrap.
- Added live reduced-motion subscriptions across Motion, GSAP, canvas, and autoplay timers. A device setting change immediately settles the headline and stops continuous animations.
- Fixed canceled automatic code execution during React development Strict Mode initialization.
- Improved mobile editor invitation tap targets, readable 16px textarea input, loading/running feedback, and screen-reader output.
- Kept project close controls visible while scrolling, preserved focus on close, and prevented background scrollbar shifts.
- Made short landscape navigation scrollable and closed the mobile menu when visitors click or focus outside it.
- Separated React and animation libraries into reusable cached chunks. The build completes without the previous large JavaScript chunk warning; optional language runtimes still load only on use.

## Verification

- Production build, ESLint, and all unit tests pass.
- The saved `npm run test:browser` suite passes in Microsoft Edge/Chromium.
- Both themes pass automated accessibility scans at phone, tablet, and desktop widths.
- Fourteen widths from 320px to 2560px have no horizontal page overflow, clipped headings, or hero/editor overlap.
- JavaScript, TypeScript, Python, and SQL execute real browser-worker code. Drafts, keyboard shortcuts, validation, escaped output, syntax errors, timeout termination, recovery, and returning to autoplay work.
- All 13 project dialogs and their galleries load, enlarge images, trap focus, close with Escape, and return focus to their trigger.
- Result erasing, blank hold, drawing, repeated runs, offscreen settling, Unicode output, live reduced motion, all five automatic examples, and hidden-page shutdown were checked.
- A separate `/Portfolio/` production build passed runtime, gallery, and navigation checks, with correct absolute sharing and canonical URLs.
- `npm audit --omit=dev` reported zero known production vulnerabilities.

## Publish

1. Commit the intended portfolio files and push them to the repository's `main` branch.
2. In GitHub **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. Run **Deploy portfolio to GitHub Pages**, or let the push trigger it. The deployment result supplies the public URL.

The workflow determines the base path and public URL from GitHub Pages, including configured custom domains. See `README.md` for other static hosts and local validation commands.

When the CV is ready, add `public/resume/Junrey_Ducay_CV.pdf` and rebuild. Until then, the download stays disabled and has no broken URL.
