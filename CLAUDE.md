# CLAUDE.md — AI Code Review Bot

## Project
AI-powered GitHub App that automatically reviews pull requests with inline comments.
Checks for security issues, missing tests, anti-patterns, and performance problems.

## Stack
| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) — uses `proxy.ts` not `middleware.ts` |
| Auth | Clerk |
| AI | OpenAI gpt-4o + text-embedding-3-small |
| DB | Supabase (Postgres + pgvector) |
| ORM | Drizzle ORM + drizzle-kit |
| Payments | Stripe |
| GitHub | Octokit + GitHub App |
| UI | shadcn/ui + Tailwind + Framer Motion + React Three Fiber |
| Data Fetching | TanStack Query (React Query v5) |
| Deploy | Vercel |

## Project Structure
```
/
├── CLAUDE.md
├── README.md
├── docs/
│   ├── todo.md           ← step-by-step checklist (work from here)
│   └── lessons.md        ← update after every correction
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   └── page.tsx          ← landing page
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx
│   │   │   └── reviews/[id]/page.tsx
│   │   └── api/
│   │       ├── webhooks/
│   │       │   ├── github/route.ts
│   │       │   └── stripe/route.ts
│   │       └── review/route.ts
│   ├── components/
│   │   ├── ui/               ← shadcn components
│   │   ├── landing/          ← Hero3D, Features, Pricing
│   │   └── dashboard/        ← ReviewList, ReviewCard, Stats
│   └── lib/
│       ├── github.ts         ← Octokit helpers
│       ├── openai.ts         ← review prompt + parser
│       ├── rag.ts            ← embed + search
│       ├── stripe.ts         ← checkout + webhooks
│       └── db/
│           ├── index.ts      ← Drizzle client
│           └── schema.ts     ← all table definitions
├── supabase/
│   └── migrations/           ← schema files
└── .env.local                ← never commit this
```

## Environment Variables
```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# OpenAI
OPENAI_API_KEY=

# Database (Supabase Postgres — direct connection for Drizzle)
DATABASE_URL=                    # Settings → Database → Connection string → URI

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=
NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID=

# GitHub App
GITHUB_APP_ID=
GITHUB_APP_PRIVATE_KEY=
GITHUB_WEBHOOK_SECRET=
NEXT_PUBLIC_GITHUB_APP_NAME=
```

## Pricing Tiers
| Plan | Price | Reviews/mo | Checks |
|------|-------|-----------|--------|
| Free | $0 | 5 | Style only |
| Pro | $15/mo | Unlimited | All 4 checks + inline comments |
| Team | $49/mo | Unlimited | All 4 + multi-repo + custom rules + priority |

## Review Checks
- **Security** — injection, exposed secrets, insecure patterns
- **Tests** — untested functions, missing edge case coverage
- **Style** — naming, complexity, dead code, anti-patterns
- **Performance** — N+1 queries, unnecessary re-renders, memory leaks

---

## Workflow Orchestration

### 1. Plan Node Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `docs/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

---

## Task Management

1. **Plan First**: Write plan to `docs/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `docs/todo.md`
6. **Capture Lessons**: Update `docs/lessons.md` after corrections

---

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
- **No Over-Engineering**: Don't add features not asked for. YAGNI ruthlessly.
- **Security Always**: Verify webhook signatures. Never expose secrets. Validate all input.
