# AI Code Review Bot

An AI-powered GitHub App that automatically reviews pull requests with inline comments — checking for security vulnerabilities, missing tests, anti-patterns, and performance issues.

## Features

- **Inline PR Comments** — Comments on specific lines, not just a summary
- **4 Review Checks** — Security, test coverage, code style, performance
- **RAG Context** — Understands your codebase by indexing changed files + their imports
- **Re-review on Push** — Automatically re-reviews when author pushes new commits
- **Usage Dashboard** — Track all reviews, issues found, severity breakdown
- **Stripe Paywall** — Free tier (5/mo), Pro ($15/mo), Team ($49/mo)

## Architecture

```
GitHub PR opened/updated
        ↓
Next.js webhook (/api/webhooks/github)
        ↓
Verify signature → Fetch PR diff + file context (Octokit)
        ↓
RAG: embed changed files + imports → search Supabase for context
        ↓
OpenAI gpt-4o: analyze diff → structured inline comments (JSON)
        ↓
Post inline comments to GitHub PR
        ↓
Save review record to Supabase → update dashboard
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Auth | Clerk |
| AI Model | OpenAI gpt-4o |
| Embeddings | text-embedding-3-small |
| Database | Supabase (Postgres + pgvector) |
| ORM | Drizzle ORM + drizzle-kit |
| Data Fetching | TanStack Query (React Query v5) |
| Payments | Stripe |
| GitHub Integration | Octokit + GitHub App |
| UI | shadcn/ui + Tailwind CSS |
| Animations | Framer Motion + React Three Fiber |
| Deployment | Vercel |

## Pricing

| Plan | Price | Reviews/mo | Checks |
|------|-------|-----------|--------|
| Free | $0 | 5 | Style checks only |
| Pro | $15/mo | Unlimited | Security + Tests + Style + Performance |
| Team | $49/mo | Unlimited | Everything + Multi-repo + Custom rules |

## Local Development

### Prerequisites
- Node.js 18+
- Supabase CLI
- Stripe CLI
- GitHub App registered (see setup below)
- [smee.io](https://smee.io) for local webhook proxy

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/ai-code-review-bot
cd ai-code-review-bot
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and fill in all values:
```bash
cp .env.example .env.local
```
See `CLAUDE.md` for full list of required variables.

> **Note:** No Supabase JS keys needed. Drizzle connects directly via `DATABASE_URL` (Postgres connection string from Supabase → Settings → Database → URI).

### 3. Supabase Setup
```bash
npx supabase start
npx supabase db push
```

### 4. GitHub App Setup
1. Go to GitHub → Settings → Developer Settings → GitHub Apps → New GitHub App
2. Set webhook URL to your smee.io proxy URL during development
3. Permissions needed:
   - Pull requests: Read & Write
   - Contents: Read
   - Metadata: Read
4. Subscribe to events: `pull_request`, `pull_request_review_comment`
5. Download private key → paste into `GITHUB_APP_PRIVATE_KEY` env var

### 5. Run Locally
```bash
# Terminal 1 — Next.js
npm run dev

# Terminal 2 — Stripe webhook listener
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 3 — GitHub webhook proxy
smee --url https://smee.io/your-channel --target http://localhost:3000/api/webhooks/github
```

App runs at `http://localhost:3000`

## Database Schema

```sql
-- Users (synced from Clerk)
users: id, clerk_id, email, tier (free|pro|team), reviews_used_this_month

-- GitHub installations
installations: id, user_id, installation_id, account_login

-- Reviews
reviews: id, user_id, repo, pr_number, pr_title, status, created_at

-- Review comments
review_comments: id, review_id, file_path, line_number, type (security|test|style|perf), body, severity

-- Document embeddings (RAG)
documents: id, installation_id, repo, file_path, content, embedding (vector 1536)
```

## Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Add all environment variables in Vercel dashboard
4. Update GitHub App webhook URL to your Vercel production URL
5. Update Stripe webhook endpoint to production URL

## Project Structure

```
/
├── CLAUDE.md                 ← AI assistant guidelines
├── README.md                 ← this file
├── docs/
│   ├── todo.md               ← step-by-step build checklist
│   └── lessons.md            ← lessons learned during development
├── src/
│   ├── app/                  ← Next.js App Router pages + API routes
│   ├── components/           ← UI components
│   └── lib/                  ← utility functions (github, openai, rag, stripe, supabase)
└── supabase/migrations/      ← database schema
```

## Contributing

See `docs/todo.md` for current build status and next steps.
