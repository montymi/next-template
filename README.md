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
- Start with Chalk & Cobalt, Sage & Linen, or Clay & Ink. Presets update both palettes while preserving your fonts, layout, and artwork.
- **Import JSON** restores an exported token file after validation; invalid files leave the current preview intact.
- Select display and body fonts, adjust the spacing scale, and change corner radii.
- Preview changes immediately across components and the design-system samples. A local browser draft survives reloads.
- **Continue with GitHub** automatically saves the complete preview (tokens, name, logo, avatar) before sign-in. **Create my fork** saves final edits and commits that version to your new repository.
- **Save tokens locally** (development only) writes `src/design-system/tokens.json` and regenerates `src/styles/tokens.css`. Next.js refreshes the page. The project directory must be writable.
- **Download JSON** and **Copy JSON** export the draft. Replace the token JSON with an export and run `npm run brand` to apply it and refresh icons.
- **Reset preview** restores the current project tokens. It does not undo an already saved change; use Git to restore an earlier version.

The public editor creates a fork containing the saved configuration through GitHub sign-in when the OAuth app is configured. Download starter kit remains a manual fallback. **Save tokens locally** is available only in development. The `/api/dev/tokens` endpoint returns **404 in production**, including token reads. Development writes require a same-origin JSON request and a validated document of at most 32 KiB. Fonts are limited to bundled and system fonts.

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

Generated `tokens.css` is committed for immediate development startup. Edit its JSON source rather than the CSS file. Development startup and the build regenerate tokens, icons, manifests, and the social image; the build also checks translations. Local fonts and their licenses are included; runtime font downloads are unnecessary.

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

Open https://vercel.com/new and choose `montymi/next-template` from **Import Git Repository**. Use the standard Next.js preset and **main** as the production branch. This connects the existing GitHub repository to Vercel; future pushes to main deploy automatically. For an existing Vercel project, connect the repository through its Git settings. `vercel.json` uses a clean npm install and the production build. Set the optional `NEXT_PUBLIC_SITE_URL` to your canonical HTTPS origin when using a custom domain. Vercel’s environment hostname is used when this variable is absent. The site and local customization work without credentials. Automatic configured forks require the GitHub OAuth settings below.

For a Node host:

```sh
npm ci
npm run build
npm run start -- --hostname 0.0.0.0 --port 3000
```

Use a single build before starting the production server. The public configurator saves versions in browser storage and commits them to the visitor’s own GitHub fork; production cannot write to the deployed project filesystem.

## App services and offline behavior

This is a UI starter. Add your project’s authentication, database, authorization, and service integrations when needed. A form on the design-system page demonstrates local interaction and explicitly sends no information.

Serwist precaches public assets and supports revisiting public pages offline. APIs and `/login` or `/account` routes always use the network. **Before adding private pages, extend the network-only matcher in `src/sw.ts` to cover every private route**, and avoid caching user data. Development disables the service worker. Development and production use Webpack because the installed Serwist integration supports it.

Current stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4, `next-intl`, `next-themes`, Serwist, ESLint flat config, and Playwright. ESLint 9 matches the React plugin’s peer range in this dependency set.

## Use as a GitHub template

If you own the repository, enable **Settings → General → Template repository**. Then choose **Use this template → Create a new repository** on GitHub, choose your visibility, and customize the files above. Template copies do not inherit the source’s Git history.

## License

MIT; see [LICENSE.txt](LICENSE.txt). Bundled font licenses are in `public/fonts/`.

## Saved versions → GitHub forks

The homepage opens the configurator. There is one fork action inside it:

1. Customize the colors, type, spacing, name, logo, and avatar.
2. Click **Continue with GitHub**. The latest preview is saved in IndexedDB automatically before sign-in. Artwork survives the redirect. The proposed repository name comes from your site name; **Repository options** lets you change it and retains that choice through sign-in.
3. Authorize the site on GitHub. You return to the same editor with your configuration intact.
4. Click **Create my fork**. Any final edits are saved automatically, then the server creates a fork in your account and applies the configuration in one commit. No source-repository changes are made.
5. Open your repository or follow the Vercel link, then select that existing repository under **Import Git Repository**. Its build regenerates matching favicon, Apple, PWA/maskable, and social assets.

Returning visitors who are already connected can go directly from editing to **Create my fork**. There is no separate save requirement. Downloads, file exports, and developer-only file saves are under **Import or export**. Missing credentials produce an explicit unavailable state and a local-save fallback.

Existing repositories are rejected. A receipt permits retrying a partially completed fork only for the same account, repository, and saved configuration. Branch updates are never forced. Resume text is excluded from automatic forks and saved snapshots. It can be included explicitly in a downloaded kit’s local `PERSONALIZE.md` brief for a coding agent; that file is ignored by Git. No AI service runs automatically.

### Enable GitHub sign-in on a deployment

The guided owner setup starts with:

```sh
npm run github:setup -- https://YOUR-DOMAIN
```

It provides a GitHub registration link with your homepage and callback URL filled in. Create the OAuth app on GitHub, then enter its Client ID and client secret into the terminal (the secret is hidden). The command generates a session key and writes the four variables below to a Git-ignored `.env.local` with private file permissions, preserving unrelated variables. For a Vercel deployment, copy those variables into the project’s environment settings and redeploy. The command does not create the OAuth app or publish a deployment for you. Do not paste secrets into chat.

Create a GitHub OAuth app under **GitHub Settings → Developer settings → OAuth Apps**. Set its Homepage URL to your site and Authorization callback URL to `https://YOUR-DOMAIN/api/github/callback`. Configure these **server-only** environment variables on Vercel or your Node host, then redeploy:

```dotenv
GITHUB_CLIENT_ID=your-oauth-app-client-id
GITHUB_CLIENT_SECRET=your-oauth-app-client-secret
GITHUB_SESSION_SECRET=a-random-secret-of-at-least-32-characters
GITHUB_CALLBACK_URL=https://YOUR-DOMAIN/api/github/callback
```

Generate the session secret with `openssl rand -hex 32`. Never put these credentials in public environment variables or commit them. The OAuth flow requests `public_repo` access, which permits management of public repositories; it does not request private-repository scope. Users approve this on GitHub. A GitHub App with narrower per-repository installation permissions is a possible future replacement.

OAuth uses state and PKCE. Access tokens stay in encrypted, HttpOnly, SameSite cookies with a 30-minute session. They are never returned to client JavaScript. **Disconnect GitHub** clears this site’s session; users can also revoke the app under GitHub’s Authorized OAuth Apps. The API accepts same-origin writes only. Missing credentials produce an explicit unavailable state; the site never silently forks the unconfigured source instead.

For local OAuth development, create a separate OAuth app with callback `http://localhost:3000/api/github/callback`, set matching variables in `.env.local`, and run the development server. Production callbacks require HTTPS. Fork creation uses GitHub’s REST API, so the hosting network must allow `github.com` and `api.github.com`.

Tests cover client redirect recovery and exact saved-snapshot submission with intercepted responses, and server commit creation, ownership, conflict handling, and encrypted-session validation with mocked GitHub calls. A live OAuth authorization and real fork require a configured app and account; they are not claimed by those tests.

### Downloads and manual fallback

**Download starter kit** exports the current preview. In a manually created fork run `npm ci`, then `npm run customize -- /path/to/coast-starter.zip`. This validates the archive, applies the configuration, and regenerates brand assets. Advanced deployment tools accept an existing fork URL for Codespaces and Vercel links. The download workflow does not automatically commit to GitHub.

Artwork accepts PNG/JPEG/WebP under 2 MB, at most 4096 pixels per dimension. It is rasterized and reduced to 512 pixels before saving. Saved versions persist artwork in this browser; unsaved artwork is lost on refresh. The optional resume stays in memory and is never sent by automatic fork creation. PDF parsing is not included.

### Hosted instance: template.montymi.com

The canonical URL is `https://template.montymi.com`, and the registered callback must be `https://template.montymi.com/api/github/callback`. Follow the [exact owner activation steps](docs/owner-setup.md), including the prefilled GitHub app registration link. The GitHub app must be created by its owner and its credentials installed on the hosting project before visitor sign-in is enabled.

## Portfolio handoff

See [the portfolio handoff](docs/portfolio-handoff.md) for ready-to-use project copy, evidence, screenshots, an importable content record, and integration instructions.
