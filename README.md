# Coast · Next.js template

A coastal architectural starter with generous space, Newsreader and Inter typography, and a **Chalk & Cobalt** palette: chalk, cobalt, pale lavender, and muted coral. Its forms borrow from the light and sculptural rhythm of Jørn Utzon’s Sydney Opera House.

Includes a landing page, a live design-system page, and a getting-started guide. Neutral branding and original geometric artwork make it ready for a new project.

## Start

Use **Node.js 24** and npm.

```sh
npm ci
npm run dev
```

Open the address printed by Next.js on the computer running it. To use another port:

```sh
npm run dev -- --hostname 0.0.0.0 --port 3002
```

For a hosted preview, import your copy into Vercel. A remote workspace’s loopback address is accessible only inside that workspace; use its forwarded URL when viewing from another device.

## Customize your site

Click **Customize UI** on the hosted site or while running `npm run dev`.

- Edit all light and dark colors with a picker or a six-digit hex value.
- Select display and body fonts, adjust the spacing scale, and change corner radii.
- Preview changes immediately across components and the design-system samples. A local browser draft survives reloads.
- **Save tokens locally** writes `src/design-system/tokens.json` and regenerates `src/styles/tokens.css`. Next.js refreshes the page. The project directory must be writable.
- **Download JSON** and **Copy JSON** export the draft. Replace the token JSON with an export and run `npm run brand` to apply it and refresh icons.
- **Reset preview** restores the current project tokens. It does not undo an already saved change; use Git to restore an earlier version.

The public editor exports a starter kit and opens GitHub’s fork page. **Save tokens locally** is available only in development. The `/api/dev/tokens` endpoint returns **404 in production**, including token reads. Development writes require a same-origin JSON request and a validated document of at most 32 KiB. Fonts are limited to bundled and system fonts.

Saving updates live UI tokens. Run `npm run brand` after choosing a final palette to update installed app icons, manifests, and the social image. Previously installed apps may retain icons until their next browser update.

## Make it your own

| File                            | Purpose                                             |
| ------------------------------- | --------------------------------------------------- |
| `src/config/site.json`          | Site name, short name, repository URL               |
| `src/design-system/tokens.json` | Both palettes, fonts, spacing, corner radii         |
| `src/styles/globals.css`        | Responsive layout and component styles              |
| `src/components/site/mark.tsx`  | On-page geometric mark                              |
| `scripts/generate-icons.mjs`    | Matching favicon, app icons, social card, manifests |
| `messages/{en,es,it}.json`      | English, Spanish, and Italian copy                  |
| `src/components/ui/`            | Button, card, input, arrow                          |
| `src/app/[locale]/`             | Localized App Router pages                          |

```sh
npm run brand     # Regenerate tokens + brand assets after editing their sources
npm run messages  # Verify all locales have matching, nonempty translation keys
```

Generated `tokens.css` is committed for immediate development startup. Edit its JSON source rather than the CSS file. The build regenerates tokens and checks translations. Local fonts and their licenses are included; runtime font downloads are unnecessary.

## Languages and themes

English is the fallback. Spanish uses `/es` and Italian `/it`; English uses unprefixed routes. `next-intl` detects the browser language on the first visit and remembers the language picker in a `NEXT_LOCALE` cookie. The picker keeps the current page. Change routing behavior in `src/i18n/routing.ts` and add matching message files when adding languages.

`next-themes` uses the system theme initially and remembers an explicit choice. Light and dark palettes share semantic CSS variables such as `--background`, `--primary`, `--surface-alt`, and `--ring`.

## Checks

```sh
npx playwright install --with-deps chromium  # Once, if Chromium is not installed
npm run lint
npm run typecheck
npm test                                     # Production build + Playwright
npm run test:e2e                              # Reuse a completed production build
npm run test:ui
```

Playwright runs desktop and mobile browser flows against production and development servers on ports **3200 and 3201**. Checks cover localization, theme persistence, functional examples, layout overflow, icons, offline public pages, the configurator, export, saving, and production restrictions. Token writer tests use a temporary directory; browser save tests preserve the checked-in palette. Tests prefer `/usr/bin/chromium` if present, or `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, then Playwright’s browser installation.

Husky runs lint on commit and the full test command on push. Conventional Commits are checked on commit. CI repeats lint, types, and Playwright and uploads failure artifacts.

## Deployment

Vercel can import this repository with its standard Next.js preset. `vercel.json` uses a clean npm install and the production build. Set the optional `NEXT_PUBLIC_SITE_URL` to your canonical HTTPS origin when using a custom domain. Vercel’s environment hostname is used when this variable is absent. No credentials are needed for the starter.

For a Node host:

```sh
npm ci
npm run build
npm run start -- --hostname 0.0.0.0 --port 3000
```

Use a single build before starting the production server. The public configurator exports settings locally; production cannot write to the project filesystem.

## App services and offline behavior

This is a UI starter. Add your project’s authentication, database, authorization, and service integrations when needed. A form on the design-system page demonstrates local interaction and explicitly sends no information.

Serwist precaches public assets and supports revisiting public pages offline. APIs and `/login` or `/account` routes always use the network. **Before adding private pages, extend the network-only matcher in `src/sw.ts` to cover every private route**, and avoid caching user data. Development disables the service worker. Development and production use Webpack because the installed Serwist integration supports it.

Current stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4, `next-intl`, `next-themes`, Serwist, ESLint flat config, and Playwright. ESLint 9 matches the React plugin’s peer range in this dependency set.

## Use as a GitHub template

If you own the repository, enable **Settings → General → Template repository**. Then choose **Use this template → Create a new repository** on GitHub, choose your visibility, and customize the files above. Template copies do not inherit the source’s Git history.

## License

MIT; see [LICENSE.txt](LICENSE.txt). Bundled font licenses are in `public/fonts/`.

## Public customization and GitHub handoff

The configurator is now available on production deployments. **Save & fork on GitHub** opens GitHub's fork page and downloads `coast-starter.zip`. Download and fork are separate actions: settings are never silently committed to a GitHub repository.

In the fork, run `npm ci`, then `npm run customize -- /path/to/coast-starter.zip`. This validates the archive, applies tokens, site name, logo, and avatar, and generates the favicon (ICO/SVG), Apple icon, PWA/maskable icons, and social image from your logo. Review, commit, and push, then import your fork into Vercel. Enter your fork URL in the editor for direct Codespaces and Vercel import links. Forking works without GitHub's template flag.

Artwork accepts PNG/JPEG/WebP under 2 MB, with a 4096-pixel dimension limit, and is rasterized locally. Artwork is held in memory; choose it again after refreshing. Optional resumes accept pasted text or `.txt`/`.md` files and produce a `PERSONALIZE.md` brief for your chosen coding agent. No AI API is invoked. The resume is not persisted to browser storage or uploaded; it is included only in the downloaded kit. The brief is excluded from Git by default. PDF parsing and automatic agent execution are not included.

The local file-save endpoint remains development-only; production always returns 404. Public Save exports a kit and opens GitHub. No production file writes or GitHub tokens are needed. A tighter automatic commit/PR flow would require a GitHub App with installation permissions; it is not simulated here.

### Fork directly from the site

The homepage's primary **Fork on GitHub** action and the navigation link open GitHub's native `/fork` screen. Visitors sign in to their own GitHub account if needed, choose an owner and repository name, and create their copy. No configurator, resume, or kit download is required. The separate customization flow remains available when someone wants to carry their preview settings into their fork. Fork links are translated in English, Spanish, and Italian.
