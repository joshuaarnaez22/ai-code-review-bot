"use client"

import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { ArrowRight, Github, Shield, TestTube, Zap, Paintbrush } from "lucide-react"

// Dynamically import 3D canvas — avoids SSR WebGL crash
const Hero3D = dynamic(() => import("@/components/landing/Hero3D").then((m) => m.Hero3D), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
})

const AGENT_NODES = [
  { icon: Shield, label: "Security", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  { icon: TestTube, label: "Tests", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  { icon: Paintbrush, label: "Style", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { icon: Zap, label: "Performance", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
}

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#080810] text-white">
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-indigo-500" />
          <span className="font-semibold tracking-tight">ReviewBot</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/sign-in"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Sign in
          </a>
          <a
            href="/sign-up"
            className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-indigo-500"
          >
            Get started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-20 pt-10 md:flex-row md:gap-0 md:px-12 md:pt-0 lg:px-24">
        {/* Left — text */}
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            AI-Powered Code Reviews
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Ship better code.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Automatically.
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-5 max-w-md text-base leading-relaxed text-zinc-400 md:text-lg"
          >
            Install once. Every pull request gets instant AI review — inline comments
            on security issues, missing tests, anti-patterns, and performance problems.
          </motion.p>

          {/* Agent badges */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start"
          >
            {AGENT_NODES.map(({ icon: Icon, label, color, bg }) => (
              <span
                key={label}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${bg} ${color}`}
              >
                <Icon className="h-3 w-3" />
                {label}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#"
              className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold transition-all hover:bg-indigo-500 hover:gap-3"
            >
              <Github className="h-4 w-4" />
              Install on GitHub
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/sign-up"
              className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              View dashboard
            </a>
          </motion.div>

          <motion.p
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-4 text-xs text-zinc-600"
          >
            Free for 5 reviews/month · No credit card required
          </motion.p>
        </div>

        {/* Right — 3D canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[360px] w-full md:h-[560px] md:flex-1"
        >
          <Hero3D />

          {/* Floating node labels */}
          {AGENT_NODES.map(({ label, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
              className={`absolute rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm ${bg} ${color} ${
                i === 0 ? "left-[15%] top-[20%]" :
                i === 1 ? "right-[18%] top-[30%]" :
                i === 2 ? "left-[20%] bottom-[28%]" :
                "right-[15%] bottom-[22%]"
              }`}
            >
              {label}
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  )
}
