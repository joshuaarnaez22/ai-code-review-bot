"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Shield, TestTube, Paintbrush, Zap } from "lucide-react"

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Shield,
    type: "Security",
    severity: "Critical",
    severityColor: "text-red-500",
    severityBg: "bg-red-500/10 border-red-500/25",
    iconBg: "bg-red-500/10 border-red-500/20",
    iconColor: "text-red-500",
    terminalAccent: "text-red-400",
    accentRgb: "239,68,68",
    file: "src/api/users.ts:47",
    title: "Catches vulnerabilities before they ship",
    description:
      "SQL injection, exposed secrets, insecure auth patterns, and unsafe dependencies — caught inline with exact line numbers.",
    finding: "SQL injection via unsanitized `id` param",
    fix: "db.query('SELECT * FROM users WHERE id = $1', [id])",
    stat: "2,340 critical issues caught",
  },
  {
    icon: TestTube,
    type: "Tests",
    severity: "Warning",
    severityColor: "text-yellow-600 dark:text-yellow-400",
    severityBg: "bg-yellow-500/10 border-yellow-500/25",
    iconBg: "bg-yellow-500/10 border-yellow-500/20",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    terminalAccent: "text-yellow-400",
    accentRgb: "234,179,8",
    file: "src/payments/checkout.ts:23",
    title: "Surfaces untested code paths",
    description:
      "Detects functions with zero test coverage, missing edge cases, and error paths that will fail silently in production.",
    finding: "resetPassword() has 0% test coverage",
    fix: "Add tests for expired token, invalid email, and rate limit",
    stat: "5,800 coverage gaps flagged",
  },
  {
    icon: Paintbrush,
    type: "Style",
    severity: "Info",
    severityColor: "text-blue-500",
    severityBg: "bg-blue-500/10 border-blue-500/25",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-500",
    terminalAccent: "text-blue-400",
    accentRgb: "59,130,246",
    file: "src/utils/formatter.ts:12",
    title: "Enforces readable, maintainable code",
    description:
      "High cyclomatic complexity, dead code, inconsistent naming, and anti-patterns that compound into technical debt.",
    finding: "Cyclomatic complexity: 18  (threshold: 10)",
    fix: "Extract into formatCurrency() and parseLocale()",
    stat: "14,200 style issues resolved",
  },
  {
    icon: Zap,
    type: "Performance",
    severity: "Warning",
    severityColor: "text-orange-500",
    severityBg: "bg-orange-500/10 border-orange-500/25",
    iconBg: "bg-orange-500/10 border-orange-500/20",
    iconColor: "text-orange-500",
    terminalAccent: "text-orange-400",
    accentRgb: "249,115,22",
    file: "src/dashboard/page.tsx:89",
    title: "Flags N+1 queries and render bottlenecks",
    description:
      "Database query loops, unnecessary re-renders, missing memoization, and synchronous operations that should be batched.",
    finding: "N+1 query: db.find() called inside .map() loop",
    fix: "Promise.all(ids.map(id => db.find(id))) or findMany()",
    stat: "3,100 perf regressions prevented",
  },
]

// ─── Card ─────────────────────────────────────────────────────────────────────

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[0]
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const Icon = feature.icon
  const rgb = feature.accentRgb

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{
        y: -6,
        boxShadow: `0 20px 48px rgba(${rgb},0.14), 0 0 0 1px rgba(${rgb},0.22)`,
      }}
      className="relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card"
      style={{
        boxShadow: `0 2px 12px rgba(${rgb},0.06), 0 0 0 1px rgba(${rgb},0.08)`,
      }}
    >
      {/* Subtle radial gradient tint — always visible at low opacity */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 85% 15%, rgba(${rgb},0.08) 0%, transparent 55%)`,
        }}
      />

      {/* Left accent bar */}
      <div
        className="absolute bottom-5 left-0 top-5 w-[3px] rounded-full"
        style={{ backgroundColor: `rgba(${rgb},0.65)` }}
      />

      <div className="relative p-6 pl-8">
        {/* Header row */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${feature.iconBg}`}
            >
              <Icon className={`h-5 w-5 ${feature.iconColor}`} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {feature.type}
              </p>
              <p className="font-mono text-[10px] text-muted-foreground/50">
                {feature.file}
              </p>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${feature.severityBg} ${feature.severityColor}`}
          >
            {feature.severity}
          </span>
        </div>

        {/* Title + description */}
        <h3 className="mb-2 text-[15px] font-semibold leading-snug text-foreground">
          {feature.title}
        </h3>
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
          {feature.description}
        </p>

        {/* Terminal diagnostic block — always dark, like an IDE terminal panel */}
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-950">
          {/* macOS-style header bar */}
          <div className="flex items-center justify-between border-b border-white/[0.05] px-3 py-2">
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-white/[0.12]" />
              <div className="h-2 w-2 rounded-full bg-white/[0.12]" />
              <div className="h-2 w-2 rounded-full bg-white/[0.12]" />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/20">
              reviewbot · scan output
            </span>
          </div>
          {/* Output lines */}
          <div className="space-y-1.5 px-3 py-3 font-mono text-[11px] leading-relaxed">
            <p>
              <span className={`font-semibold ${feature.terminalAccent}`}>✗ </span>
              <span className="text-white/55">{feature.finding}</span>
            </p>
            <p>
              <span className="text-white/25">→ </span>
              <span className="text-white/45">{feature.fix}</span>
            </p>
          </div>
        </div>

        {/* Stat */}
        <div className="mt-4 flex items-center gap-2">
          <div
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: `rgba(${rgb},0.75)` }}
          />
          <p className="text-[11px] text-muted-foreground/50">{feature.stat}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function Features() {
  const headingRef = useRef(null)
  const headingInView = useInView(headingRef, { once: true })

  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      {/* Heading */}
      <motion.div
        ref={headingRef}
        initial={{ opacity: 0, y: 16 }}
        animate={headingInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-14 text-center"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
          What we check
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Four categories. Every pull request.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
          ReviewBot runs all four checks in parallel — results inline on your diff
          within 30 seconds of opening a PR.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {FEATURES.map((feature, i) => (
          <FeatureCard key={feature.type} feature={feature} index={i} />
        ))}
      </div>
    </section>
  )
}
