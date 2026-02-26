"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Check, Zap, Loader2 } from "lucide-react"

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    name: "Free",
    price: 0,
    priceId: null,                                              // no checkout needed
    description: "Get started with AI code reviews. No credit card required.",
    cta: "Get started free",
    highlighted: false,
    perks: [
      "5 reviews per month",
      "All 4 check types",
      "Inline GitHub comments",
      "Public repos only",
    ],
  },
  {
    name: "Pro",
    price: 15,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    description: "For developers who ship daily and need unlimited reviews.",
    cta: "Upgrade to Pro",
    highlighted: true,
    badge: "Most Popular",
    perks: [
      "Unlimited reviews",
      "All 4 check types",
      "Inline GitHub comments",
      "Public + private repos",
      "Priority processing",
      "Detailed review summaries",
      "Email support",
    ],
  },
  {
    name: "Team",
    price: 49,
    priceId: process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID,
    description: "For teams who want consistent code quality across every PR.",
    cta: "Upgrade to Team",
    highlighted: false,
    perks: [
      "Everything in Pro",
      "Up to 10 members",
      "Custom review config",
      "Team analytics dashboard",
      "Priority support",
      "SAML SSO (coming soon)",
    ],
  },
]

// ─── Checkout button ───────────────────────────────────────────────────────────

function CheckoutButton({
  priceId,
  label,
  highlighted,
}: {
  priceId: string
  label: string
  highlighted: boolean
}) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      })

      // Not signed in → send to sign-up
      if (res.status === 401) {
        window.location.href = "/sign-up"
        return
      }

      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      // Keep button re-enabled so user can retry
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60 ${
        highlighted
          ? "bg-indigo-600 text-white hover:bg-indigo-500"
          : "border border-border bg-muted/40 text-foreground hover:bg-muted"
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Redirecting…
        </>
      ) : (
        label
      )}
    </button>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function PricingCard({
  plan,
  index,
}: {
  plan: (typeof PLANS)[0]
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className={`relative ${plan.highlighted ? "md:-translate-y-3" : ""}`}
    >
      {/* Most Popular badge */}
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2">
          <span className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-semibold text-white shadow-lg shadow-indigo-500/40">
            <Zap className="h-3 w-3" />
            {plan.badge}
          </span>
        </div>
      )}

      <motion.div
        whileHover={{ y: -4 }}
        className={`relative h-full cursor-pointer overflow-hidden rounded-2xl border bg-card p-7 transition-shadow duration-300 ${
          plan.highlighted
            ? "border-indigo-500/40 shadow-[0_0_0_1px_rgba(99,102,241,0.25),0_12px_40px_rgba(99,102,241,0.14)]"
            : "border-border hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
        }`}
      >
        {/* Indigo tint on highlighted */}
        {plan.highlighted && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 85% 10%, rgba(99,102,241,0.1) 0%, transparent 55%)",
            }}
          />
        )}

        <div className="relative flex h-full flex-col">
          {/* Header */}
          <div>
            <p className="text-sm font-semibold text-foreground">{plan.name}</p>
            <div className="mt-3 flex items-end gap-1">
              {plan.price === 0 ? (
                <span className="text-4xl font-bold tracking-tight text-foreground">Free</span>
              ) : (
                <>
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    ${plan.price}
                  </span>
                  <span className="mb-1 text-sm text-muted-foreground">/month</span>
                </>
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {plan.description}
            </p>
          </div>

          <div className="my-6 border-t border-border" />

          {/* Perks */}
          <ul className="flex-1 space-y-3">
            {plan.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2.5">
                <Check
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    plan.highlighted ? "text-indigo-500" : "text-muted-foreground/50"
                  }`}
                />
                <span className="text-sm text-muted-foreground">{perk}</span>
              </li>
            ))}
          </ul>

          {/* CTA — free plan = link, paid = checkout button */}
          {plan.priceId ? (
            <CheckoutButton
              priceId={plan.priceId}
              label={plan.cta}
              highlighted={plan.highlighted}
            />
          ) : (
            <a
              href="/sign-up"
              className="mt-8 flex w-full items-center justify-center rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {plan.cta}
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function Pricing() {
  const headingRef = useRef(null)
  const headingInView = useInView(headingRef, { once: true })

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
      <motion.div
        ref={headingRef}
        initial={{ opacity: 0, y: 16 }}
        animate={headingInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
          Pricing
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Start free. Upgrade when ready.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">
          All plans include the full ReviewBot feature set. Upgrade or downgrade
          at any time — no lock-in.
        </p>
      </motion.div>

      <div className="grid items-end gap-5 md:grid-cols-3">
        {PLANS.map((plan, i) => (
          <PricingCard key={plan.name} plan={plan} index={i} />
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground/40">
        All prices in USD · Billed monthly · Cancel any time
      </p>
    </section>
  )
}
