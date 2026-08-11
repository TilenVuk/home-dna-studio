# Nuveli Studio — Home DNA™

Production website and Home DNA™ discovery experience for **Nuveli Studio**, a Slovenian interior studio focused on complete, custom interior solutions designed around the way people live.

Home DNA™ is Nuveli Studio's methodology for understanding lifestyle, routines, storage requirements, spatial needs and design preferences before creating an interior solution.

## Production

- Website: https://nuvelistudio.com
- Primary production hostname: `nuvelistudio.com`
- `www.nuvelistudio.com` is intended to redirect permanently to the primary hostname.

## What this repository contains

The repository contains the public Nuveli Studio website and the Home DNA™ discovery flow, including:

- marketing website and SEO metadata;
- Home DNA™ guided questionnaire;
- server-side Home DNA™ report generation;
- client-side PDF generation;
- lead/report persistence in Supabase;
- transactional email delivery;
- bot protection and report-rate limiting.

## Architecture

```text
GitHub source
    ↓
Vite / TanStack Start build
    ↓
Cloudflare Worker
    ↓
https://nuvelistudio.com

Home DNA™ report flow
    ↓
Cloudflare Turnstile verification
    ↓
Supabase rate-limit check
    ↓
Google Gemini API
    ↓
Home DNA™ result
    ↓
PDF generation in the browser with jsPDF
    ↓
Resend transactional email
```

GitHub is the source of truth for the application code.

The Lovable editor and Lovable hosting are no longer part of the production deployment workflow. The project still uses `@lovable.dev/vite-tanstack-config` as a build-configuration dependency; it currently provides the TanStack Start, React, Tailwind, Nitro/Cloudflare and related Vite configuration used by this codebase.

## Tech stack

- React 19
- TypeScript
- TanStack Start
- TanStack Router
- TanStack Query
- Vite
- Tailwind CSS 4
- Nitro with Cloudflare target
- Cloudflare Workers
- Cloudflare Turnstile
- Supabase
- Google Gemini API
- Resend
- jsPDF
- Lucide React

## Requirements

- Node.js 20 or newer
- pnpm
- access to the required development or production environment values

## Local development

Install dependencies:

```bash
pnpm install --frozen-lockfile
```

Create the local public environment file:

```bash
cp .env.example .env.local
```

Create the local server-secret file when testing server functionality locally:

```bash
cp .dev.vars.example .dev.vars
```

Start the development server:

```bash
pnpm dev
```

## Public environment variables

`.env.example` defines values that may be bundled into client-side JavaScript:

```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
VITE_TURNSTILE_SITE_KEY=
```

Anything prefixed with `VITE_` must be treated as public. Never place private API keys or service-role credentials in a `VITE_` variable.

## Server-side secrets

`.dev.vars.example` documents the server-side values used by the Cloudflare Worker:

```dotenv
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.6-flash

TURNSTILE_SECRET_KEY=
TURNSTILE_EXPECTED_HOSTNAME=

SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=

HOME_DNA_RATE_LIMIT_SALT=
HOME_DNA_REPORT_RATE_LIMIT_PER_HOUR=5
```

Production secrets must be stored as Cloudflare Worker secrets and must not be committed to Git.

`HOME_DNA_RATE_LIMIT_SALT` should be a random value of at least 32 characters.

## Supabase

The Home DNA™ report protection migration is located at:

```text
supabase/migrations/20260806101500_home_dna_report_protection.sql
```

It provides the database-side rate limiting used before report generation. The implementation stores a one-way SHA-256 hash derived from the requester IP rather than the original IP address.

## Home DNA™ report generation

The production report flow calls Gemini directly from the server-side Cloudflare Worker.

The AI request is limited to relevant Home DNA™ answers such as rooms, lifestyle, style, investment and execution preferences. Contact details, consent information, Turnstile tokens and inspiration links are handled separately and are not intended to be included in the Gemini prompt.

If the Gemini request fails, times out or returns invalid data, the application has a local fallback path so the user can still receive a report.

## Build

Create a production build:

```bash
pnpm build
```

The build generates the Cloudflare Wrangler configuration at:

```text
.output/server/wrangler.json
```

## Deployment to Cloudflare

Run a deployment dry-run first:

```bash
pnpm deploy:cloudflare:dry-run
```

Deploy to production:

```bash
pnpm deploy:cloudflare
```

The deployment scripts are defined in `package.json` and use Wrangler with the generated `.output/server/wrangler.json` configuration.

For the full Cloudflare setup, required Worker secrets, Turnstile configuration and deployment procedure, see:

- [`CLOUDFLARE_DEPLOY.md`](./CLOUDFLARE_DEPLOY.md)

## Security model

Home DNA™ report generation is protected before the Gemini call by two independent controls:

1. **Cloudflare Turnstile** verifies the browser request on the server.
2. **Supabase rate limiting** restricts the number of reports generated for a hashed requester IP during the configured time window.

Additional server-side validation limits accepted fields and input lengths and rejects unexpected request origins.

Never commit:

- `GEMINI_API_KEY`
- `TURNSTILE_SECRET_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `HOME_DNA_RATE_LIMIT_SALT`
- `.env.local`
- `.dev.vars`

## SEO

Public crawl configuration is stored in:

- `public/robots.txt`
- `public/sitemap.xml`

The sitemap currently exposes the main website and the Home DNA™ discovery route under the canonical `https://nuvelistudio.com` hostname.

## Useful scripts

```bash
pnpm dev                         # local development
pnpm build                       # production build
pnpm build:dev                   # development-mode build
pnpm preview                     # preview built application
pnpm lint                        # ESLint
pnpm format                      # Prettier
pnpm deploy:cloudflare:dry-run   # build + Wrangler dry-run
pnpm deploy:cloudflare           # build + deploy to Cloudflare
```

## Repository conventions

- `main` is the production source branch unless a different workflow is explicitly introduced.
- GitHub is the canonical source for code changes.
- Keep secrets outside the repository.
- Use the checked-in lockfile and `pnpm install --frozen-lockfile` for reproducible installs.
- Keep production-domain references canonicalized to `https://nuvelistudio.com`.

## Brand context

Nuveli Studio is positioned as a premium interior studio rather than a traditional furniture manufacturer or carpenter. The Home DNA™ methodology is the central product and conversion concept: spaces and furniture are designed around the customer's lifestyle, habits and real storage needs.

The public brand experience should remain modern, minimal, warm and architecture-led.
