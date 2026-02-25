# Todo — AI Code Review Bot

> Work through these one at a time. Each task has a clear verify step before moving on.
> Mark `[x]` when done. Update `lessons.md` if anything goes wrong.

---

## Phase 1: Project Setup

- [ ] **Task 1 — Init Next.js project**
  - Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir`
  - Install core: `npm install @clerk/nextjs openai stripe @octokit/rest framer-motion three @react-three/fiber @react-three/drei`
  - Install Drizzle: `npm install drizzle-orm postgres` + `npm install -D drizzle-kit`
  - Install TanStack Query: `npm install @tanstack/react-query @tanstack/react-query-devtools`
  - Install shadcn: `npx shadcn@latest init`
  - Verify: `npm run dev` → app loads at localhost:3000 with no errors

- [ ] **Task 2 — Configure Clerk auth + TanStack Query provider**
  - Create Clerk app at clerk.com → copy keys to `.env.local`
  - Wrap `src/app/layout.tsx` with `<ClerkProvider>`
  - Add `<QueryClientProvider>` (TanStack) inside ClerkProvider in layout
  - Create `src/app/sign-in/[[...sign-in]]/page.tsx` and `sign-up` equivalent
  - Add middleware: `src/middleware.ts` to protect `/dashboard` routes
  - Verify: Visit localhost:3000/dashboard → redirects to /sign-in → sign up works → redirects to /dashboard, TanStack Devtools visible

- [ ] **Task 3 — Set up Supabase + Drizzle**
  - Create Supabase project → copy **only** the direct DB connection string (`DATABASE_URL`) to `.env.local`
  - (Supabase URL/anon key/service role key are NOT needed — Drizzle connects via Postgres directly)
  - Enable pgvector: run `create extension vector` in Supabase SQL editor
  - Create `drizzle.config.ts` pointing to `DATABASE_URL`
  - Create `src/lib/db/schema.ts` with all 5 tables using Drizzle schema syntax
  - Create `src/lib/db/index.ts` as the Drizzle client (`drizzle(postgres(url))`)
  - Run: `npx drizzle-kit push` to apply schema to Supabase
  - Verify: Tables visible in Supabase dashboard → `users`, `installations`, `reviews`, `review_comments`, `documents`

- [ ] **Task 4 — Create .env.example**
  - Copy `.env.local` keys (without values) into `.env.example`
  - Add `.env.local` to `.gitignore`
  - Verify: `.env.example` committed, `.env.local` not tracked by git

---

## Phase 2: Landing Page UI

- [ ] **Task 5 — Build 3D hero section**
  - Create `src/components/landing/Hero3D.tsx` using React Three Fiber
  - Animated floating code review visualization (orbiting nodes/particles)
  - Add headline, sub-headline, and "Install on GitHub" CTA button
  - Verify: 3D animation renders at localhost:3000, no WebGL errors in console

- [ ] **Task 6 — Build features section**
  - Create `src/components/landing/Features.tsx`
  - 4 feature cards (Security, Tests, Style, Performance) with icons
  - Framer Motion: cards animate in on scroll (`useInView` + `motion.div`)
  - Verify: Scroll down → cards animate into view one by one

- [ ] **Task 7 — Build pricing section**
  - Create `src/components/landing/Pricing.tsx`
  - 3 pricing cards: Free / Pro ($15) / Team ($49) with perk lists
  - Highlight Pro card as "Most Popular"
  - Verify: 3 cards render correctly, Free card has no payment button

- [ ] **Task 8 — Connect Stripe Checkout**
  - Create Stripe products + prices in Stripe dashboard → add price IDs to `.env.local`
  - Create `src/app/api/checkout/route.ts` → creates Stripe Checkout session
  - Wire "Upgrade to Pro" and "Upgrade to Team" buttons to hit this endpoint
  - Verify: Click "Upgrade to Pro" → redirects to Stripe test checkout page

- [ ] **Task 9 — Handle Stripe webhooks**
  - Create `src/app/api/webhooks/stripe/route.ts`
  - On `checkout.session.completed`: update user tier in Supabase `users` table
  - Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe` locally
  - Verify: Complete a test payment → check Supabase `users` table → tier updated to `pro`

---

## Phase 3: Dashboard UI

- [ ] **Task 10 — Build dashboard layout**
  - Create `src/app/(dashboard)/layout.tsx` with sidebar nav + Clerk `<UserButton />`
  - Sidebar links: Overview, Reviews, Settings
  - Verify: Dashboard layout renders, UserButton shows signed-in user, sign out works

- [ ] **Task 11 — Build reviews list page**
  - Create `src/app/(dashboard)/dashboard/page.tsx`
  - Stats row: total reviews, issues found, PRs this month
  - Table/list of recent reviews (repo, PR title, date, status, issue count)
  - Show empty state when no reviews yet
  - Verify: Page renders empty state correctly, no console errors

- [ ] **Task 12 — Build review detail page**
  - Create `src/app/(dashboard)/reviews/[id]/page.tsx`
  - Show PR info (title, repo, author) at top
  - List all inline comments grouped by file
  - Color-coded severity badges (critical/warning/info)
  - Verify: Page renders with hardcoded mock data (real data comes in Task 25)

---

## Phase 4: GitHub App

- [ ] **Task 13 — Register GitHub App**
  - Go to GitHub → Settings → Developer Settings → GitHub Apps → New
  - Permissions: Pull requests (R+W), Contents (R), Metadata (R)
  - Events: `pull_request`, `pull_request_review_comment`
  - Webhook URL: paste your smee.io channel URL (for local dev)
  - Download private key → add to `.env.local` as `GITHUB_APP_PRIVATE_KEY`
  - Verify: App appears in GitHub Developer Settings with correct permissions

- [ ] **Task 14 — Build webhook handler**
  - Install: `npm install @octokit/webhooks`
  - Create `src/app/api/webhooks/github/route.ts`
  - Verify webhook signature using `GITHUB_WEBHOOK_SECRET`
  - Handle `pull_request.opened` and `pull_request.synchronize` events → log payload
  - Start smee proxy: `smee --url YOUR_CHANNEL --target http://localhost:3000/api/webhooks/github`
  - Verify: Open a test PR on a repo with app installed → smee shows event received → server logs payload → returns 200

- [ ] **Task 15 — Fetch PR diff with Octokit**
  - Create `src/lib/github.ts` with `getInstallationClient()` and `getPRDiff()` functions
  - `getPRDiff()`: fetch files changed in PR including patch (diff) content
  - Also fetch surrounding file content for context (full file, not just diff)
  - Verify: `console.log` in webhook handler shows full diff for test PR with file paths + patches

---

## Phase 5: AI Review Engine

- [ ] **Task 16 — Build OpenAI review prompt**
  - Create `src/lib/openai.ts`
  - `reviewPRDiff(diff, context)` → sends structured prompt to gpt-4o
  - Prompt instructs: return JSON array of comments `{ file, line, type, severity, body }`
  - Test all 4 check types: security, tests, style, performance
  - Verify: Call function with a sample diff → returns valid JSON array of comments

- [ ] **Task 17 — Parse + validate review output**
  - Add Zod schema to validate the JSON structure from OpenAI
  - Handle cases where model returns malformed JSON (retry once)
  - Ensure `line` numbers are within the PR diff range
  - Verify: Parse function handles both valid and malformed model output without crashing

- [ ] **Task 18 — Post inline comments to GitHub**
  - Add `postReviewComments(octokit, owner, repo, prNumber, comments)` to `src/lib/github.ts`
  - Use `octokit.pulls.createReview()` with `comments` array for inline comments
  - Add a review summary comment at the top
  - Verify: Run end-to-end on a test PR → inline comments appear on correct lines in GitHub

---

## Phase 6: RAG Pipeline

- [ ] **Task 19 — Build embedding util**
  - Add `embed(text: string)` to `src/lib/rag.ts` using `text-embedding-3-small`
  - Add `searchSimilar(query, installationId, limit)` → cosine search in Supabase `documents`
  - Verify: Call `embed("function handleAuth()")` → returns 1536-dimension vector array

- [ ] **Task 20 — Index PR files on open**
  - In webhook handler, on `pull_request.opened`: fetch full content of changed files + their imports
  - Chunk files into ~500 token segments → embed each → upsert into Supabase `documents`
  - Verify: After opening test PR → check Supabase `documents` table → rows inserted with embeddings

- [ ] **Task 21 — Inject RAG context into review prompt**
  - Before calling OpenAI: search `documents` for chunks relevant to the PR diff
  - Inject top 5 chunks as "codebase context" in the system prompt
  - Verify: Console.log shows retrieved context chunks being passed to OpenAI alongside diff

---

## Phase 7: Integration & Limits

- [ ] **Task 22 — Save review results to Supabase**
  - After posting GitHub comments: insert row into `reviews` table
  - Insert each comment into `review_comments` table
  - Verify: After end-to-end test → `reviews` and `review_comments` tables have correct data

- [ ] **Task 23 — Enforce free tier limit**
  - On webhook received: query Supabase for user's `reviews_used_this_month`
  - If free tier + count >= 5: post a GitHub comment explaining limit + link to upgrade
  - Increment `reviews_used_this_month` after each successful review
  - Verify: Simulate 6th review for free user → GitHub gets "upgrade required" comment, no review runs

- [ ] **Task 24 — Re-review on new commits**
  - `pull_request.synchronize` event = new commits pushed to PR
  - Re-run the full review pipeline (clear old bot comments first, post fresh ones)
  - Verify: Push a new commit to an open PR → old bot comments removed → new review posted

- [ ] **Task 25 — Connect dashboard to real data**
  - Replace mock data in dashboard pages with real Supabase queries
  - Reviews list: query `reviews` table filtered by user's Clerk ID
  - Review detail: query `review_comments` for specific review
  - Verify: Dashboard shows real reviews from test PRs

---

## Phase 8: Deploy

- [ ] **Task 26 — Deploy to Vercel**
  - Push repo to GitHub → import project in Vercel dashboard
  - Add all env vars from `.env.local` to Vercel project settings
  - Verify: Production URL loads landing page, sign in works, no env errors in Vercel logs

- [ ] **Task 27 — Switch GitHub App to production**
  - Update GitHub App webhook URL to `https://your-app.vercel.app/api/webhooks/github`
  - Update Stripe webhook endpoint to production URL in Stripe dashboard
  - Verify: Open a real PR on a test repo → inline review comments appear within 30 seconds

---

## Done When
- [ ] Landing page with 3D hero + animations loads
- [ ] Clerk sign up/in works
- [ ] Stripe upgrade flow works (test mode)
- [ ] Install GitHub App on a repo → open PR → inline comments appear
- [ ] Dashboard shows review history
- [ ] Free tier limit enforced

---

## Review Log
_(add notes here as tasks complete)_

| Task | Date | Notes |
|------|------|-------|
| | | |
