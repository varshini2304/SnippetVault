# SnippetVault

SnippetVault is a modern code snippet manager for developers. Save, share, and showcase code with a polished dashboard, public profiles, and shareable links.

## Tech Stack

| Tool | Purpose |
| --- | --- |
| Next.js 16 (App Router) | Framework |
| TypeScript (strict) | Type safety |
| TailwindCSS | Styling |
| shadcn/ui | UI components |
| Supabase | Auth + Postgres + Storage |
| TanStack Query v5 | Server state |
| Zustand | UI state |

## Setup

1. Install dependencies
2. Create a Supabase project and enable Email Auth
3. Add env vars (see below)
4. Run migrations and seed data
5. Start the dev server

## Environment Variables

Create `.env.local` with:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only service key |
| `NEXT_PUBLIC_APP_URL` | Base URL for share links |

## Supabase Configuration Notes

- Enable Email Auth in the Supabase dashboard.
- Run `supabase/migrations/001_initial_schema.sql`.
- Run `supabase/seed.sql` to insert starter data.
- Verify RLS policies for snippets and shares are enforced.

## Architecture Decisions

- TanStack Query handles server state, Zustand handles UI state — never mixed.
- All Supabase queries are centralized in `lib/api.ts`.
- Auth is enforced via Next.js middleware (not page checks).
- RLS is the source of truth for security.
- Email lookup for sharing is handled server-side via a service role API route.

## Known Trade-offs

- Sharing by email requires a server route to look up users in auth.users.
- The HTML-to-image export is optimized for visual fidelity over file size.

## Deployment

Deploy on Vercel with the same environment variables as `.env.local`.
