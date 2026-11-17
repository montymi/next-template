# Activate template.montymi.com

The visitor flow is **customize → Continue with GitHub → Create my fork**. Both actions save the latest preview automatically. The site is configured for these public URLs:

| Setting                | Value                                              |
| ---------------------- | -------------------------------------------------- |
| Canonical site URL     | `https://template.montymi.com`                     |
| OAuth app homepage     | `https://template.montymi.com`                     |
| Authorization callback | `https://template.montymi.com/api/github/callback` |

## One-time GitHub setup

[Create the GitHub OAuth app with these URLs filled in](https://github.com/settings/applications/new?name=Coast%20website%20forks&url=https%3A%2F%2Ftemplate.montymi.com&callback_url=https%3A%2F%2Ftemplate.montymi.com%2Fapi%2Fgithub%2Fcallback&description=Let%20visitors%20fork%20this%20website%20with%20their%20saved%20design%20configuration.). GitHub requires the owner to create the app while signed in; this is not an API operation the website can perform.

Then run:

```sh
npm run github:setup -- https://template.montymi.com
```

Enter the Client ID and generated client secret in the terminal. The secret is hidden; it is never printed. The command creates a random session key and writes a Git-ignored `.env.local` with private file permissions. Keep credentials out of chat and Git.

## Connect the existing repository to Vercel

Open https://vercel.com/new. Under **Import Git Repository**, find **montymi/next-template** and click **Import**. Choose the Next.js framework and deploy with **main** as the production branch. This creates a Vercel project connected to the existing GitHub repository. Subsequent pushes to main deploy automatically.

If the Vercel project already exists, use its **Settings → Git** to connect `montymi/next-template`, and check that its production branch tracks `main`. Grant Vercel’s GitHub integration access to this repository if it is missing from the import list. Add `template.montymi.com` under the project’s Domains settings.

Use the repository list on the New Project page. The external-repository clone wizard creates another GitHub repository and is not the import flow described here.

## Enable on the hosting project

Set these values in the hosting project’s environment settings:

- `NEXT_PUBLIC_SITE_URL=https://template.montymi.com`
- `GITHUB_CALLBACK_URL=https://template.montymi.com/api/github/callback`
- `GITHUB_CLIENT_ID`: the OAuth app’s Client ID
- `GITHUB_CLIENT_SECRET`: its client secret
- `GITHUB_SESSION_SECRET`: the random session key in `.env.local`

Redeploy after setting them. Local environment files are not automatically installed on Vercel. This session has not been given deployment credentials, so publishing or editing Vercel environment settings requires access to that project.

## Verify activation

1. Visit `https://template.montymi.com/api/github/status`; it should report `configured: true` without exposing credentials.
2. Change the design and upload a logo. Click **Continue with GitHub**; authorize the app.
3. Confirm that the design and proposed repository name survive sign-in. Click **Create my fork**.
4. Confirm the resulting repository contains the customization commit and that its Vercel deployment generates matching icons.

Use a GitHub account other than `montymi` for the visitor test: GitHub cannot fork the source repository into its current owner’s account. Revoke test authorization from GitHub’s Authorized OAuth Apps when finished if desired.
