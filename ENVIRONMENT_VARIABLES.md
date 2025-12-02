# Environment variables used in this repository

This document lists environment variables found in the codebase, where they are referenced, their intended scope (server/client), and recommended usage.

Summary table (key, scope, files / locations, purpose, required?)

- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (client) — used to load Google Maps script and in `app/atlas/PolygonAtlasMap.tsx` and `app/layout.tsx`. Purpose: map tiles / geometry library. Required for Google Maps features. Provide in `.env.local` for development and `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in production build environment.
- JWT_SECRET (server) — `lib/auth.ts`. Purpose: sign/verify JWTs for authentication. Required. Must be kept secret; do NOT commit to git. Use strong random value.
- BCRYPT_ROUNDS (server) — `lib/auth.ts`. Purpose: number of bcrypt hashing rounds (default 12). Optional (default fallback). Store as integer in env.
- ADMIN_SESSION_DURATION (server) — `lib/auth.ts`. Purpose: token/session duration (e.g. "15m"). Optional (has default).
- DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD (server) — `lib/db.ts`, `.env.example`. Purpose: PostgreSQL connection. If `USE_DATABASE` is true, these are required. Keep secrets out of git; use environment-specific values.
- USE_DATABASE (server) — `.env.example`. Purpose: feature toggle to use DB vs local/mock. Optional boolean-like string ("true"/"false").
- STATIC_DATASET_PASSWORD (server) — `app/api/static/auth/route.ts`. Purpose: simple static auth for demo dataset endpoints; defaults to `open123`. Recommend overriding in env for any non-demo deployment.
- NODE_ENV (server) — used in `lib/db.ts` and `lib/prisma.ts` for dev vs production behavior. Standard Node variable. Set to `development` or `production`.

Notes and recommendations

- Server-only variables (do not begin with `NEXT_PUBLIC_`) must never be exposed to client-side code or committed to the repo. Use `.env.local` for developer secrets and your deployment platform's secrets manager for production (Vercel/Netlify/GitHub Actions secrets).
- Client-visible variables must be prefixed with `NEXT_PUBLIC_` and are safe to include in build-time environment variables. Treat them as public keys.
- Add a `.env.example` (already present) with non-secret defaults and document which keys are required for dev and production. Avoid including real secrets in that file.
- Example local setup (.env.local):

  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
  JWT_SECRET=replace-with-a-long-random-secret
  BCRYPT_ROUNDS=12
  ADMIN_SESSION_DURATION=15m
  USE_DATABASE=false

If your environment requires the database, set DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD accordingly.

If you want, I can produce a small script to validate required env keys at startup and fail fast with a clear error message.

---
Generated: 2025-12-02
