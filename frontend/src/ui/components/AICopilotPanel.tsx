import { MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Job } from "../../types/jobs";

interface Props {
  activeJob?: Job | null;
  initialPrompt?: string;
}

export function AICopilotPanel({ activeJob, initialPrompt = "" }: Props) {
  const [value, setValue] = useState(initialPrompt);

  return (
    <aside className="flex h-full flex-col bg-bg-card px-3 py-4 text-xs">
      <div
        className="rounded-card border p-3"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-white"
              style={{ background: "var(--primary)" }}
            >
              Aria
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Aria</p>
              <p className="text-[10px] text-text-secondary">Your AI Copilot</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-button border-2 px-2 py-1 text-[10px] transition hover:bg-bg-hero"
            style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
          >
            Quick guide
          </button>
        </div>
        <p className="mt-3 text-xs text-text-secondary">
          Welcome back! Let&apos;s find your next opportunity.
        </p>
        <div className="mt-3 space-y-1.5 text-xs text-text-secondary">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Tasks I can assist you with
          </p>
          <p>🔍 Adjust preferences</p>
          <p>⭐ Top Match jobs</p>
          <p>💬 Ask Aria</p>
        </div>
      </div>

      {activeJob && (
        <div
          className="mt-3 rounded-card border p-3 text-xs"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Job in focus
          </p>
          <p className="font-medium text-text-primary">{activeJob.title}</p>
          <p className="text-[10px] text-text-secondary">{activeJob.company}</p>
        </div>
      )}

      <div className="mt-auto pt-3">
        <div className="mb-1 flex items-center gap-1 text-[10px] text-text-muted">
          <MessageCircle size={12} />
          <span>Ask me anything...</span>
        </div>
        <div
          className="flex items-center gap-2 rounded-button border-2 bg-bg-card px-3 py-2"
          style={{ borderColor: "var(--border)" }}
        >
          <input
            className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
            placeholder="Ask Aria about your matches, resume, or next steps..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            type="button"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white transition hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            <Sparkles size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
