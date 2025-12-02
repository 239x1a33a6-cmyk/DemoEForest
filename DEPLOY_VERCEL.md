# Deploying to Vercel

Follow these steps to deploy the project to Vercel. The main Next.js app is in the `dss-atlas/` subfolder — set that as the Root Directory when creating the Vercel project.

1) Create the project on Vercel

- Sign in to Vercel and click "New Project" → "Import Git Repository" → select `239x1a33a6-cmyk/Dss-Forest`.
- In the import settings set:
  - Root Directory: `dss-atlas` (important)
  - Framework Preset: Next.js (should be detected)
  - Install Command: `npm ci`
  - Build Command: `npm run build` (this runs `prebuild` then `next build`)
  - Output Directory: leave default (Vercel handles Next.js)

2) Add Environment Variables

Open Project Settings → Environment Variables and add the following keys (set values from your secrets/production config). For secrets, set them under "Production" and optionally under "Preview" and "Development" as needed.

- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY — (Preview + Production) public API key for Google Maps
- JWT_SECRET — (Production) secret for signing JWTs
- BCRYPT_ROUNDS — (optional) number of bcrypt rounds (default 12)
- ADMIN_SESSION_DURATION — (optional) e.g. `15m`
- USE_DATABASE — `true` or `false` (if using a hosted DB)
- DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD — (only if USE_DATABASE=true)
- STATIC_DATASET_PASSWORD — value to protect static dataset routes (defaults to `open123` locally)

Notes about databases: If you set `USE_DATABASE=true` you must ensure the database is reachable from Vercel (public host or via a private integration). Use managed Postgres (Supabase, Railway, AWS RDS) and set the DB_* values accordingly. Alternatively, set a `DATABASE_URL` if your code expects it.

3) Git LFS considerations

- This repo uses Git LFS for many large assets. Vercel's build system may not fetch LFS objects automatically in all cases. If your build fails due to missing large files (pointer files visible in the build logs), the recommended long-term fix is to host large static assets in object storage (S3, Cloudflare R2, Google Cloud Storage) and update references to load them from that CDN. That will make builds reliable and faster.
- Short-term workarounds (may not work on all Vercel plans):
  - Add a prebuild step that attempts to pull LFS objects: `git lfs install && git lfs pull` — this requires git-lfs to be available in the build image (not guaranteed).
  - If you control the build image (self-hosted builders), ensure git-lfs is installed there.

4) Deploy

- After adding env variables and confirming Root Directory, trigger a new deployment (Vercel will build automatically on push). Monitor the build logs for any LFS or build errors.

5) If build fails due to missing LFS objects

- Move the largest static files into object storage and update the code to fetch them from the storage URL. I can help automate moving files from LFS to S3 and patch code references if you'd like.

6) Helpful extras I can add for you

- Create a GitHub Actions workflow that builds the app and uploads build artifacts to a storage bucket (optional).
- Add a small script to copy important static files from a bucket into `public/` at build time on Vercel.
- Help migrate large assets from the repo/LFS into S3/R2 and update references.

7) Configure GitHub Actions secrets (optional, required for automatic deploy)

To enable automatic deploys from the CI workflow in this repository, add these repository secrets in GitHub (Settings → Secrets → Actions):

- VERCEL_TOKEN — a Personal Token from Vercel (create via https://vercel.com/account/tokens)
- VERCEL_ORG_ID — your Vercel organization ID (find via Vercel dashboard or `vercel projects ls --token $VERCEL_TOKEN`)
- VERCEL_PROJECT_ID — the project ID (find via Vercel dashboard or `vercel projects inspect <project-name> --token $VERCEL_TOKEN`)

Example (using Vercel CLI):

```bash
npm i -g vercel
vercel login
VERCEL_TOKEN=$(vercel token create "CI token")
vercel projects ls --token "$VERCEL_TOKEN"
vercel projects inspect <project-name> --token "$VERCEL_TOKEN" # shows projectId and orgId

# Then set the secrets in GitHub repo settings (or use gh CLI):
gh secret set VERCEL_TOKEN --body "$VERCEL_TOKEN"
gh secret set VERCEL_ORG_ID --body "<org-id>"
gh secret set VERCEL_PROJECT_ID --body "<project-id>"
```

Once those secrets are in place, the CI workflow will deploy to Vercel automatically on successful builds on `main`.

Helper script

You can run a helper script locally to create a Vercel token and set the GitHub Actions secrets (requires `vercel` and `gh` CLIs):

```bash
./scripts/setup-vercel-secrets.sh
```

The script will prompt for the token name, Vercel project name and org id, then store the secrets in the specified GitHub repo.
