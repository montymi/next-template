# Portfolio handoff: Montymi Template

Prepared November 17, 2026. This document is for the developer or coding agent updating Michael Montanaro’s portfolio. It contains project copy, integration guidance, evidence, and publishing checks. It does not authorize publishing the portfolio or changing its deployment settings.

## Project identity

| Field                    | Value                                                    |
| ------------------------ | -------------------------------------------------------- |
| Portfolio title          | Montymi Template                                         |
| UI/design-system name    | Coast                                                    |
| Suggested portfolio slug | `montymi-template`                                       |
| Category                 | Developer tools / design systems                         |
| Repository               | https://github.com/montymi/next-template                 |
| Demo URL                 | https://template.montymi.com                             |
| Target deployment        | Vercel, connected to GitHub `main`                       |
| Suggested role wording   | Product direction and AI-assisted full-stack development |
| Content record           | [portfolio-project.json](portfolio-project.json)         |

The owner reported deployment to Vercel. The custom domain’s DNS and a real GitHub OAuth authorization/fork have not been independently verified from this workspace: its network proxy blocks access to the custom domain. Verify the demo URL and authenticated flow before publishing live-demo claims. Do not present a mocked test as a real GitHub fork.

## Ready-to-use project card

**Title:** Montymi Template

**Eyebrow:** A configurable starting point for your next website

**Short description:** Customize a coastal design system in your browser, preserve your configuration in a GitHub fork, and deploy a website you own.

**Expanded description:** A Next.js starter that connects visual customization with repository ownership. Its live editor controls colors, typography, spacing, and brand assets, while the GitHub integration carries the saved configuration into a new fork. It includes localized pages, light and dark themes, PWA support, and Playwright checks.

**Primary action:** Explore the demo → https://template.montymi.com

**Secondary action:** View source → https://github.com/montymi/next-template

**Tags:** Next.js, TypeScript, React, Tailwind CSS, design systems, GitHub OAuth, Playwright, PWA.

Do not add user counts, conversion rates, time-saved percentages, revenue, or Lighthouse scores. Those have not been measured.

## Case-study copy

### The problem

A starter repository can save setup time while still leaving people to edit design tokens, replace artwork, generate icons, and work out deployment. A visual preview is useful only if the resulting repository preserves the choices made in that preview.

### The approach

I shaped Montymi Template around a simple journey: customize the site in the browser, continue with GitHub, and create a fork containing the saved configuration. The visual foundation uses an architectural coastal style, with generous space, Newsreader and Inter typography, and coordinated light and dark palettes. The default Chalk & Cobalt palette draws on the sculptural forms and light of Jørn Utzon’s Sydney Opera House.

### The implementation

The configurator uses a shared, validated token schema to drive the preview and exported CSS. A browser snapshot retains the chosen design and artwork through GitHub sign-in. Server-side OAuth handling keeps access tokens out of client JavaScript, and the fork workflow applies configuration files and artwork together in one Git commit. Existing repositories are rejected rather than overwritten, and branch updates are never forced.

Logo uploads feed the favicon, Apple touch icon, PWA icons, maskable icon, and social image generator. Repository builds regenerate those assets from the selected brand configuration. The deployment handoff directs users to import their existing fork into Vercel, preserving the repository they already created.

### The result

The project combines an editable design system with a working starter repository and a guided ownership handoff. It includes responsive pages in English, Spanish, and Italian, browser-saved configuration, three palette presets, JSON import/export, and tested interaction flows. The GitHub integration is implemented and covered by mocked integration tests; a live authorization and fork should be demonstrated before claiming the complete production journey has been independently verified.

This first-person copy is a draft for Michael’s review. Implementation was AI-assisted. Confirm role wording before publishing; do not infer sole authorship, a team size, client involvement, or a delivery duration.

## Features and exact scope

| Capability            | What is implemented                                                                 | Practical limit                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Live design editor    | Colors, local/system fonts, spacing, radii, name, logo, avatar                      | Does not generate arbitrary page layouts or edit all page copy                                     |
| Palette presets       | Chalk & Cobalt, Sage & Linen, Clay & Ink; matching light/dark colors                | Presets preserve the user’s fonts, layout, and artwork; they are starting points                   |
| Token portability     | Validated JSON import, JSON export, ZIP starter kit                                 | Token JSON does not contain artwork or resume text                                                 |
| Artwork               | Raster previews, replacement/removal, validation, long-filename handling            | PNG/JPEG/WebP, 2 MB input limit, 4096-pixel maximum input dimension; resized locally               |
| GitHub handoff        | Save automatically, authorize, fork, create one configuration commit                | Requires the owner’s OAuth app and visitor consent; requests `public_repo` scope                   |
| Repository protection | Ownership checks, name conflict rejection, non-forced branch updates, retry receipt | Not a general-purpose GitHub editor or private-repository integration                              |
| Brand assets          | ICO/SVG favicon, Apple icon, PWA/maskable icons, social image                       | Assets regenerate at build/startup; installed clients may retain cached icons                      |
| Localization          | English, Spanish, and Italian pages, locale preference                              | Configurator labels are currently English                                                          |
| Theme/offline         | Remembered theme choice; revisiting public pages offline                            | API and auth traffic use the network; not a native mobile application                              |
| Resume input          | Local text/Markdown input and an exported agent brief                               | No automated AI generation, PDF parser, or resume publishing; excluded from automatic GitHub forks |
| Deployment            | Vercel configuration and existing-repository import guidance                        | Hosting access, OAuth credentials, and DNS remain owner configuration                              |

## Technical structure and evidence

| Area                               | Source                                                            |
| ---------------------------------- | ----------------------------------------------------------------- |
| App Router pages                   | `src/app/[locale]/`                                               |
| Design source and presets          | `src/design-system/tokens.json`, `src/design-system/presets.json` |
| Token validation/CSS generation    | `src/design-system/format.mjs`                                    |
| Configurator, artwork, and presets | `src/components/dev/`                                             |
| Saved browser snapshot             | `src/lib/github/saved.ts`                                         |
| OAuth/session handling             | `src/lib/github/auth.ts`, `src/app/api/github/`                   |
| Atomic configuration commit        | `src/lib/github/fork.ts`                                          |
| Asset generator                    | `scripts/generate-icons.mjs`                                      |
| Manual starter importer            | `scripts/apply-starter.mjs`                                       |
| Owner activation guide             | `docs/owner-setup.md`                                             |
| Browser and policy checks          | `tests/`, `playwright.config.ts`                                  |

The GitHub token is encrypted in an HttpOnly, SameSite session cookie. It is not persisted in the browser’s readable storage or committed to the repository. Saved preview data is in IndexedDB; resume content remains in memory and is excluded from automatic forks. These are implementation details, not claims of a security audit or certification.

Validation for this handoff: lint, TypeScript, production build, and **42 passing Playwright checks** (November 17, 2026 snapshot). The new palette/import flow is exercised on desktop and mobile alongside the existing checks. GitHub service responses are mocked in the automated integration checks. Update this dated count when the suite changes. This document deliberately makes no performance or production-uptime claims.

## Visual assets

All images below are actual captures of the local app using the public, neutral Coast artwork. They contain no OAuth credentials, personal resume, or private family-site assets. They are evidence of the interface, not proof that the hosted OAuth integration is active.

| Source asset                                    | Suggested portfolio destination                             | Suggested alt text                                                                               |
| ----------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `docs/portfolio-assets/overview-desktop.png`    | `/images/projects/montymi-template/overview-desktop.png`    | Montymi Template’s coastal landing page with cobalt architectural forms and editorial typography |
| `docs/portfolio-assets/overview-mobile.png`     | `/images/projects/montymi-template/overview-mobile.png`     | The Coast starter’s responsive landing page on a phone-sized viewport                            |
| `docs/portfolio-assets/configurator-detail.png` | `/images/projects/montymi-template/configurator-detail.png` | Live configurator showing palette presets and brand customization controls                       |

Use the desktop overview as the project-card cover with its crop positioned at the top, so the hero remains visible. Preserve the full image’s aspect ratio in the case study. Include the configurator detail in the case study to explain the project’s distinguishing interaction. The configurator image is a crop of the real editor region; the mobile image is a full-page capture.

## Portfolio implementation brief

1. Inspect the portfolio repository’s `AGENTS.md`, content schema, project card, routing, image conventions, and theme before editing it.
2. Add one project using the existing components and route conventions. Suggested slug: `montymi-template`. Treat the provided JSON as a content record, not a required new schema or framework.
3. Copy only the three screenshots listed above to the portfolio’s normal public image directory. Give images accurate alt text and responsive dimensions. Prefer the site’s existing image component and lazy-load case-study images below the fold.
4. Use the project-card copy above and adapt the case-study sections to the portfolio’s voice. Keep the project’s architectural visual style in screenshots; the surrounding page should follow the portfolio’s existing design system.
5. Include clearly labeled demo and source links. Verify the demo URL before publishing it as live. If unavailable, keep the source link and mark the demo pending rather than presenting it as verified.
6. Keep scope claims accurate: no automatic AI website generation, verified production OAuth flow, private-repository support, adoption metrics, or full accessibility certification should be implied.
7. Run that repository’s appropriate checks. Review desktop/mobile layout and keyboard navigation. Do not copy `.env.local`, session keys, uploaded resumes, or any ignored local configuration into the portfolio.
8. Provide a reviewable change and a preview. Publishing or deploying the portfolio itself is outside this handoff’s authorization.

### Suggested page structure

- Project title, short description, demo/source actions.
- Desktop overview image.
- Problem and approach.
- Configurator detail and the design-to-repository workflow.
- Implementation choices: shared token schema, durable browser snapshot, GitHub commit boundary, generated assets.
- Validation and current limits.
- Source link and next steps.

## Best next improvements

The small improvements included with this handoff are palette presets, JSON import, and an inline “Why GitHub?” explanation.

Next, prioritize these in order:

1. **Verify one real visitor journey.** Finish OAuth/domain configuration if needed, then test from a non-owner GitHub account through the resulting fork and deployment. This is the strongest remaining proof point.
2. **Translate the configurator.** The main pages have three locales; bringing the editor labels into those same message files removes a visible inconsistency.
3. **Add a focused contrast check.** Show text/background and primary-button contrast ratios while users change colors. Describe it as a check of those pairs, not an accessibility certification.
4. **Explain the journey on the landing page.** A short three-step walkthrough or authentic recording will make the configurator’s value easier to understand before authorization.

Avoid adding more integrations, AI promises, analytics claims, or a large template catalog before proving the core journey with real users.
