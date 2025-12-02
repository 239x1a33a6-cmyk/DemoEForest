#!/usr/bin/env bash
set -euo pipefail

echo "This script helps create a Vercel token and set GitHub Actions secrets for automatic deploys."

if ! command -v vercel >/dev/null 2>&1; then
  echo "vercel CLI not found. Install it with: npm i -g vercel" >&2
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) not found. Install it from https://cli.github.com/" >&2
  exit 1
fi

read -rp "Enter a name for the token (e.g. CI token): " TOKEN_NAME
echo "Creating Vercel token (you may be prompted to log in)..."
VERCEL_TOKEN=$(vercel token create "$TOKEN_NAME" 2>/dev/null || true)
if [ -z "$VERCEL_TOKEN" ]; then
  echo "Failed to create token non-interactively. Try running: vercel token create '$TOKEN_NAME'" >&2
  exit 1
fi

echo "Vercel token created. Setting GitHub secrets..."

read -rp "Enter GitHub repo (owner/repo) to set secrets in (default: current repo): " GITHUB_REPO
GITHUB_REPO=${GITHUB_REPO:-$(basename "$(git rev-parse --show-toplevel)" )}

read -rp "Enter Vercel project name (as shown in Vercel dashboard): " VERCEL_PROJECT
read -rp "Enter Vercel org id (you can find via 'vercel projects inspect <project>' or dashboard): " VERCEL_ORG_ID

echo "Setting secrets in GitHub repo: $GITHUB_REPO"
echo "$VERCEL_TOKEN" | gh secret set VERCEL_TOKEN --repo "$GITHUB_REPO" --body -
echo "$VERCEL_ORG_ID" | gh secret set VERCEL_ORG_ID --repo "$GITHUB_REPO" --body -

# get project id
VERCEL_PROJECT_ID=$(vercel projects inspect "$VERCEL_PROJECT" --token "$VERCEL_TOKEN" --output json 2>/dev/null | jq -r '.id' || true)
if [ -z "$VERCEL_PROJECT_ID" ]; then
  echo "Could not determine project id automatically. Please run 'vercel projects inspect <project> --token <token>' to find the project id and set VERCEL_PROJECT_ID manually." >&2
else
  echo "$VERCEL_PROJECT_ID" | gh secret set VERCEL_PROJECT_ID --repo "$GITHUB_REPO" --body -
fi

echo "Done. GitHub secrets set (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID if found)."
echo "Remember to set these secrets for the repository in GitHub if the script couldn't detect the repo automatically."
