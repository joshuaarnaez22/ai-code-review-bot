"use client"

import { motion } from "framer-motion"
import { ArrowRight, Github, Shield, TestTube, Zap, Paintbrush, GitPullRequest, Circle } from "lucide-react"
import { LogoWithText } from "@/components/Logo"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Features } from "@/components/landing/Features"
import { Pricing } from "@/components/landing/Pricing"

// ─── Data ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "12,400+", label: "PRs reviewed" },
  { value: "< 30s",   label: "avg review time" },
  { value: "4",       label: "check types" },
  { value: "99.9%",   label: "uptime" },
]

const CHECKS = [
  { icon: Shield,     label: "Security",    color: "text-red-500",    bg: "bg-red-500/10 border-red-500/20"    },
  { icon: TestTube,   label: "Tests",       color: "text-green-500",  bg: "bg-green-500/10 border-green-500/20"  },
  { icon: Paintbrush, label: "Style",       color: "text-blue-500",   bg: "bg-blue-500/10 border-blue-500/20"   },
  { icon: Zap,        label: "Performance", color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" },
]

// ─── PR Mockup ────────────────────────────────────────────────────────────────

const CODE_LINES = [
  { n: 20, code: "export async function login(req: Request) {",  comment: null },
  { n: 21, code: "  const token = req.query.token as string",    comment: null },
  { n: 22, code: "  const user  = await db.query(",              comment: null },
  { n: 23, code: "    `SELECT * FROM users WHERE id=${token}`",  comment: { type: "security", severity: "critical", text: "SQL injection — use parameterized queries" } },
  { n: 24, code: "  )",                                          comment: null },
  { n: 25, code: "",                                             comment: null },
  { n: 26, code: "  async function resetPassword(email: string)", comment: { type: "test", severity: "warning", text: "Missing test coverage for error cases" } },
]

const COMMENT_STYLES: Record<string, { dot: string; badge: string; label: string }> = {
  security: { dot: "bg-red-500",    badge: "bg-red-500/10 border-red-500/30 text-red-500",    label: "Security"  },
  test:     { dot: "bg-yellow-500", badge: "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400", label: "Tests" },
}

function PRMockup() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/10 dark:shadow-black/40">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-4 py-3">
        <GitPullRequest className="h-4 w-4 text-green-500" />
        <span className="text-sm font-medium text-foreground">PR #247</span>
        <span className="text-sm text-muted-foreground">feat/user-auth</span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[11px] font-medium text-green-600 dark:text-green-400">
          <Circle className="h-1.5 w-1.5 fill-green-500" />
          open
        </span>
      </div>

      {/* File path */}
      <div className="border-b border-border bg-muted/30 px-4 py-2">
        <span className="font-mono text-xs text-muted-foreground">src/auth/login.ts</span>
      </div>

      {/* Code */}
      <div className="p-0">
        {CODE_LINES.map((line) => (
          <div key={line.n}>
            {/* Code line */}
            <div className={`flex items-start gap-0 font-mono text-xs ${line.comment ? "bg-red-500/5 dark:bg-red-500/5" : ""}`}>
              <span className="w-10 shrink-0 select-none py-1.5 pl-3 pr-2 text-right text-muted-foreground/50">
                {line.n}
              </span>
              <span className="flex-1 py-1.5 pr-4 text-foreground/80">{line.code}</span>
            </div>

            {/* Inline comment */}
            {line.comment && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="mx-3 my-1.5 flex items-start gap-2 rounded-lg border bg-background p-2.5"
                style={{ borderColor: line.comment.type === "security" ? "rgb(239 68 68 / 0.2)" : "rgb(234 179 8 / 0.2)" }}
              >
                <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${COMMENT_STYLES[line.comment.type].dot}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-1.5 py-px text-[10px] font-semibold ${COMMENT_STYLES[line.comment.type].badge}`}>
                      {COMMENT_STYLES[line.comment.type].label}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {line.comment.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-foreground/70">{line.comment.text}</p>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Footer summary */}
      <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            1 critical
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            1 warning
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">reviewed in 18s</span>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5 },
})

export default function LandingPage() {
  return (
    <div className="min-h-screen scroll-smooth bg-background text-foreground">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <LogoWithText />
          <div className="hidden items-center gap-6 md:flex">
            {[
              { label: "Features", href: "#features" },
              { label: "Pricing",  href: "#pricing"  },
              { label: "Docs",     href: "/docs"     },
            ].map(({ label, href }) => (
              <a key={label} href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {label}
              </a>
            ))}
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

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">

          {/* Left — copy */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <motion.div
              {...fadeUp(0)}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              AI-Powered Code Reviews
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl"
            >
              Your AI code reviewer
              <br />
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                that never sleeps.
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground"
            >
              Install once on GitHub. Every pull request gets instant inline review — catching
              security holes, missing tests, anti-patterns, and performance issues automatically.
            </motion.p>

            {/* Check type badges */}
            <motion.div {...fadeUp(0.3)} className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
              {CHECKS.map(({ icon: Icon, label, color, bg }) => (
                <span key={label} className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${bg} ${color}`}>
                  <Icon className="h-3 w-3" />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div {...fadeUp(0.4)} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#"
                className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500"
              >
                <Github className="h-4 w-4" />
                Install on GitHub
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/sign-up"
                className="flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted"
              >
                View dashboard
              </a>
            </motion.div>

            <motion.p {...fadeUp(0.5)} className="mt-4 text-xs text-muted-foreground">
              Free for 5 reviews/month · No credit card required
            </motion.p>

            {/* Stats */}
            <motion.div
              {...fadeUp(0.6)}
              className="mt-10 grid grid-cols-4 gap-4 border-t border-border pt-8"
            >
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-lg font-bold text-foreground">{value}</span>
                  <span className="text-[11px] text-muted-foreground">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — PR mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <PRMockup />
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="border-t border-border" />
      </div>

      <Features />

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="border-t border-border" />
      </div>

      <Pricing />
    </div>
  )
}
