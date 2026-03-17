import { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: Props) {
  return (
    <div className="flex min-h-screen items-stretch bg-bg-page">
      {/* Left branding panel — 60% */}
      <div
        className="relative hidden w-[60%] flex-col overflow-hidden md:flex"
        style={{ background: "var(--primary)" }}
      >
        <div className="relative flex-1 px-10 py-8">
          <div className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white"
              style={{ background: "var(--secondary)" }}
            >
              R
            </div>
            <div>
              <div className="font-heading text-sm font-semibold text-white">Recruix.ai</div>
              <div className="text-[11px] text-white/70">Your AI-Powered Career Copilot</div>
            </div>
          </div>

          <div className="mt-14 max-w-xl space-y-4">
            <h1 className="font-heading text-3xl font-semibold leading-tight text-white md:text-4xl">
              Welcome back
            </h1>
            <p className="text-sm text-white/90">
              Get matched to jobs that fit your skills, experience, and goals — automatically.
            </p>
            <ul className="space-y-2 text-sm text-white/90">
              <li className="flex items-center gap-2">
                <span style={{ color: "var(--accent)" }}>✓</span> AI-matched jobs updated daily
              </li>
              <li className="flex items-center gap-2">
                <span style={{ color: "var(--accent)" }}>✓</span> One-click autofill applications
              </li>
              <li className="flex items-center gap-2">
                <span style={{ color: "var(--accent)" }}>✓</span> Your AI copilot ready to help
              </li>
            </ul>
          </div>

          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-indigo-400/40 blur-3xl" />
            <div className="absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-purple-400/30 blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pointer-events-none absolute bottom-10 right-12 w-64 rounded-card border p-3 text-xs backdrop-blur"
            style={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.95)" }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
              96% match
            </p>
            <p className="mt-1 font-heading text-sm font-semibold">AI Engineer · Google</p>
            <p className="mt-1 text-[11px] opacity-90">
              Strong match on Python, distributed systems, and LLM deployment.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right form panel — 40% */}
      <div className="flex w-full items-center justify-center px-4 py-8 md:w-[40%] md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md rounded-card border bg-bg-card p-6 shadow-lg"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="mb-5 space-y-1">
            <h2 className="font-heading text-xl font-semibold text-text-primary">{title}</h2>
            <p className="text-sm text-text-secondary">{subtitle}</p>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
