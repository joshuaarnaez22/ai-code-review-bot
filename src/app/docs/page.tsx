"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Shield,
  TestTube,
  Paintbrush,
  Zap,
  Check,
  Copy,
  Github,
  ChevronRight,
  BookOpen,
  Rocket,
  Settings,
  Layers,
  BarChart3,
  HelpCircle,
} from "lucide-react"
import { LogoWithText } from "@/components/Logo"
import { ThemeToggle } from "@/components/ThemeToggle"

// ─── Types ─────────────────────────────────────────────────────────────────────

interface NavSection {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

const NAV_SECTIONS: NavSection[] = [
  { id: "overview",      label: "Overview",       icon: BookOpen   },
  { id: "quickstart",    label: "Quick Start",    icon: Rocket     },
  { id: "configuration", label: "Configuration",  icon: Settings   },
  { id: "check-types",   label: "Check Types",    icon: Layers     },
  { id: "limits",        label: "Plans & Limits", icon: BarChart3  },
  { id: "faq",           label: "FAQ",            icon: HelpCircle },
]

// ─── Code block ───────────────────────────────────────────────────────────────

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-950 font-mono text-[12px]">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-white/[0.12]" />
          <div className="h-2 w-2 rounded-full bg-white/[0.12]" />
          <div className="h-2 w-2 rounded-full bg-white/[0.12]" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-widest text-white/25">{lang}</span>
          <button
            onClick={copy}
            aria-label="Copy code"
            className="flex cursor-pointer items-center gap-1.5 rounded px-2 py-0.5 text-[10px] text-white/30 transition-colors duration-150 hover:bg-white/[0.06] hover:text-white/70"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto px-5 py-4 leading-relaxed text-white/65">
        <code>{code}</code>
      </pre>
    </div>
  )
}

// ─── Step ─────────────────────────────────────────────────────────────────────

function Step({
  n,
  title,
  children,
}: {
  n: number
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-bold text-indigo-500 mt-0.5">
        {n}
      </div>
      <div className="flex-1 pb-8">
        <h4 className="mb-2 text-sm font-semibold text-foreground">{title}</h4>
        <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </div>
  )
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <div className="mb-6 border-b border-border pb-4">
      <h2
        id={id}
        className="scroll-mt-24 text-xl font-bold tracking-tight text-foreground"
      >
        {title}
      </h2>
    </div>
  )
}

// ─── Check type mini card ─────────────────────────────────────────────────────

const CHECK_TYPES = [
  {
    icon: Shield,
    name: "Security",
    color: "text-red-500",
    bg: "bg-red-500/10 border-red-500/20",
    accentRgb: "239,68,68",
    examples: ["SQL injection", "Exposed secrets", "Unsafe auth patterns", "Vulnerable deps"],
  },
  {
    icon: TestTube,
    name: "Tests",
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    accentRgb: "234,179,8",
    examples: ["Zero test coverage", "Missing edge cases", "Silent error paths", "Unchecked promises"],
  },
  {
    icon: Paintbrush,
    name: "Style",
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/20",
    accentRgb: "59,130,246",
    examples: ["High complexity", "Dead code", "Naming issues", "Anti-patterns"],
  },
  {
    icon: Zap,
    name: "Performance",
    color: "text-orange-500",
    bg: "bg-orange-500/10 border-orange-500/20",
    accentRgb: "249,115,22",
    examples: ["N+1 queries", "Render loops", "Missing memoization", "Sync bottlenecks"],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: "-20% 0% -70% 0%", threshold: 0 }
    )

    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Dot grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Nav — same as landing */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <LogoWithText />
          <div className="hidden items-center gap-6 md:flex">
            <a href="/#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="/#pricing"  className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
            <a href="/docs"      className="text-sm text-indigo-500 font-medium">Docs</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a href="/sign-in" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:block">
              Sign in
            </a>
            <a
              href="/sign-up"
              className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Get started
            </a>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <a href="/" className="transition-colors hover:text-foreground">Home</a>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Docs</span>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto flex max-w-6xl gap-12 px-6 pb-24">
        {/* Sidebar */}
        <aside className="hidden w-52 shrink-0 md:block">
          <div className="sticky top-24">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              On this page
            </p>
            <nav className="space-y-0.5">
              {NAV_SECTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors duration-150 ${
                    activeSection === id
                      ? "bg-indigo-500/10 font-medium text-indigo-500"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {label}
                </button>
              ))}
            </nav>

            {/* Quick links */}
            <div className="mt-8 border-t border-border pt-6">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Links
              </p>
              <div className="space-y-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="h-3.5 w-3.5" />
                  GitHub App
                </a>
                <a
                  href="/#pricing"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                  Pricing
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 space-y-16">

          {/* ── Overview ─────────────────────────────────────────────────── */}
          <section id="overview">
            <SectionHeading id="overview" title="Overview" />
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">ReviewBot</strong> is a GitHub App that automatically
                reviews every pull request using GPT-4o. Within 30 seconds of opening a PR, it posts
                inline comments on the exact lines that need attention — no configuration required.
              </p>
              <p>
                It runs four parallel checks on every diff: <strong className="text-foreground">Security</strong>,{" "}
                <strong className="text-foreground">Tests</strong>,{" "}
                <strong className="text-foreground">Style</strong>, and{" "}
                <strong className="text-foreground">Performance</strong>. Results appear as inline
                review comments with severity badges, just like a human reviewer would leave them.
              </p>

              {/* Feature highlight row */}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Install time",   value: "< 2 min"  },
                  { label: "Avg review time", value: "< 30s"   },
                  { label: "Check types",     value: "4 in parallel" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl border border-border bg-muted/30 p-4">
                    <p className="text-lg font-bold text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Quick Start ──────────────────────────────────────────────── */}
          <section id="quickstart">
            <SectionHeading id="quickstart" title="Quick Start" />
            <div className="space-y-0 divide-y divide-border/50">
              <Step n={1} title="Install the GitHub App">
                Click{" "}
                <a href="#" className="font-medium text-indigo-500 underline underline-offset-2 hover:text-indigo-400">
                  Install on GitHub
                </a>{" "}
                and select which repositories ReviewBot can access. You can choose all repos or specific ones.
              </Step>

              <Step n={2} title="Open a pull request">
                Create a pull request on any repo you granted access to. ReviewBot automatically detects
                the webhook event — no additional setup needed.
              </Step>

              <Step n={3} title="See your inline review">
                Within 30 seconds, inline comments appear on the changed lines in your diff. A summary
                comment is posted at the top of the PR listing all issues found.
              </Step>
            </div>

            <div className="mt-2 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3.5">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-indigo-500">Tip:</span> ReviewBot also re-reviews
                when you push new commits to an open PR, so old comments are cleared and replaced with
                fresh results.
              </p>
            </div>
          </section>

          {/* ── Configuration ────────────────────────────────────────────── */}
          <section id="configuration">
            <SectionHeading id="configuration" title="Configuration" />
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              ReviewBot works out of the box with zero config. To customize its behavior, add a{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                .reviewbot.yml
              </code>{" "}
              file to your repository root.
            </p>

            <CodeBlock
              lang=".reviewbot.yml"
              code={`# .reviewbot.yml — place in your repo root (all fields optional)
reviewbot:
  checks:
    security:    true   # SQL injection, secrets, auth issues
    tests:       true   # Coverage gaps, missing edge cases
    style:       true   # Complexity, naming, dead code
    performance: true   # N+1 queries, render loops

  # Minimum severity level to post a comment
  # Options: info | warning | critical
  severity_threshold: warning

  # Paths to skip entirely
  ignore_paths:
    - "*.test.ts"
    - "*.spec.ts"
    - "migrations/**"
    - "dist/**"
    - ".next/**"

  # Optional: describe your codebase for richer context
  context: |
    TypeScript monorepo. Follows Google Style Guide.
    Tests use Vitest. Database is Postgres via Drizzle ORM.
    API routes are Next.js App Router server actions.`}
            />

            <div className="mt-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Config reference</h3>
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Field</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Default</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { field: "checks.*",           default: "true",     desc: "Enable/disable each check type" },
                      { field: "severity_threshold", default: "info",     desc: "Minimum severity to post" },
                      { field: "ignore_paths",       default: "[]",       desc: "Glob patterns to skip" },
                      { field: "context",            default: "—",        desc: "Free-text codebase description" },
                    ].map(({ field, default: def, desc }) => (
                      <tr key={field} className="bg-card">
                        <td className="px-4 py-2.5 font-mono text-[11px] text-foreground/80">{field}</td>
                        <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{def}</td>
                        <td className="px-4 py-2.5 text-[13px] text-muted-foreground">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ── Check Types ──────────────────────────────────────────────── */}
          <section id="check-types">
            <SectionHeading id="check-types" title="Check Types" />
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              All four checks run in parallel on every PR diff. Each produces inline comments with
              exact line numbers and a suggested fix.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {CHECK_TYPES.map(({ icon: Icon, name, color, bg, accentRgb, examples }) => (
                <div
                  key={name}
                  className="relative overflow-hidden rounded-xl border border-border bg-card p-5"
                  style={{
                    boxShadow: `0 0 0 1px rgba(${accentRgb},0.06)`,
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at 80% 15%, rgba(${accentRgb},0.06) 0%, transparent 55%)`,
                    }}
                  />
                  <div
                    className="absolute bottom-4 left-0 top-4 w-[2px] rounded-full"
                    style={{ backgroundColor: `rgba(${accentRgb},0.5)` }}
                  />
                  <div className="relative pl-4">
                    <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg border ${bg}`}>
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <p className={`mb-1 text-sm font-semibold ${color}`}>{name}</p>
                    <ul className="space-y-1">
                      {examples.map((ex) => (
                        <li key={ex} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div
                            className="h-1 w-1 shrink-0 rounded-full"
                            style={{ backgroundColor: `rgba(${accentRgb},0.6)` }}
                          />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Plans & Limits ───────────────────────────────────────────── */}
          <section id="limits">
            <SectionHeading id="limits" title="Plans & Limits" />
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Rate limits apply per GitHub installation. The review count resets on the 1st of each
              calendar month.
            </p>

            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Feature</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Free</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-indigo-500">Pro</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Team</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { feature: "Reviews per month",     free: "5",           pro: "Unlimited",  team: "Unlimited"  },
                    { feature: "All 4 check types",     free: "✓",           pro: "✓",          team: "✓"          },
                    { feature: "Inline GitHub comments",free: "✓",           pro: "✓",          team: "✓"          },
                    { feature: "Private repos",         free: "—",           pro: "✓",          team: "✓"          },
                    { feature: "Priority processing",   free: "—",           pro: "✓",          team: "✓"          },
                    { feature: "Custom config",         free: "—",           pro: "✓",          team: "✓"          },
                    { feature: "Team members",          free: "1",           pro: "1",          team: "Up to 10"   },
                    { feature: "Team analytics",        free: "—",           pro: "—",          team: "✓"          },
                    { feature: "Price",                 free: "$0/mo",       pro: "$15/mo",     team: "$49/mo"     },
                  ].map(({ feature, free, pro, team }) => (
                    <tr key={feature} className="bg-card">
                      <td className="px-4 py-2.5 text-[13px] text-muted-foreground">{feature}</td>
                      <td className="px-4 py-2.5 text-center text-[13px] text-muted-foreground">{free}</td>
                      <td className="px-4 py-2.5 text-center text-[13px] font-medium text-indigo-500">{pro}</td>
                      <td className="px-4 py-2.5 text-center text-[13px] text-muted-foreground">{team}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-center">
              <a
                href="/#pricing"
                className="flex items-center gap-1.5 text-sm font-medium text-indigo-500 transition-colors hover:text-indigo-400"
              >
                View full pricing page
                <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </section>

          {/* ── FAQ ──────────────────────────────────────────────────────── */}
          <section id="faq">
            <SectionHeading id="faq" title="FAQ" />

            <div className="space-y-6">
              {[
                {
                  q: "Which LLM does ReviewBot use?",
                  a: "ReviewBot uses GPT-4o from OpenAI. It sends only the diff (changed lines) and surrounding context — never your full codebase.",
                },
                {
                  q: "How long does a review take?",
                  a: "Typically 15–30 seconds for a normal-sized PR (under 500 changed lines). Larger diffs may take up to 60 seconds.",
                },
                {
                  q: "Can I use ReviewBot on private repositories?",
                  a: "Yes — Pro and Team plans include private repo support. Free tier is limited to public repositories.",
                },
                {
                  q: "How do I stop ReviewBot from reviewing a specific PR?",
                  a: 'Add the label "reviewbot:skip" to the PR before opening it, or add a comment "/reviewbot skip" at any time to suppress further reviews.',
                },
                {
                  q: "Does ReviewBot store my code?",
                  a: "ReviewBot processes diffs in memory and does not store source code. Review results (comments and metadata) are stored in our database for your dashboard.",
                },
                {
                  q: "What happens when I hit the free tier limit?",
                  a: "ReviewBot posts a comment on the PR explaining the limit has been reached and linking to the upgrade page. No review is run for that PR.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="border-b border-border pb-6 last:border-0 last:pb-0">
                  <h4 className="mb-2 text-sm font-semibold text-foreground">{q}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{a}</p>
                </div>
              ))}
            </div>

            {/* Support CTA */}
            <div className="mt-10 rounded-2xl border border-border bg-muted/30 p-6 text-center">
              <p className="mb-1 text-sm font-semibold text-foreground">Still have questions?</p>
              <p className="mb-4 text-sm text-muted-foreground">
                Open an issue on GitHub or reach out via email.
              </p>
              <div className="flex items-center justify-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Github className="h-4 w-4" />
                  GitHub Issues
                </a>
                <a
                  href="/sign-up"
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                >
                  Get started free
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
