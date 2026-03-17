import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import type { Job } from "../../types/jobs";

const SOURCE_STYLES: Record<string, string> = {
  linkedin: "bg-[#0A66C2] text-white",
  indeed: "bg-[#2557a7] text-white",
  glassdoor: "bg-[#0CAA41] text-white",
  ziprecruiter: "bg-purple-600 text-white",
};

function SourceBadge({ source }: { source?: string }) {
  if (!source) return null;
  const lower = source.toLowerCase();
  const style = SOURCE_STYLES[Object.keys(SOURCE_STYLES).find((k) => lower.includes(k)) || ""] || "bg-primary text-white";
  const label = lower.includes("linkedin") ? "via LinkedIn" : lower.includes("indeed") ? "via Indeed" : lower.includes("glassdoor") ? "via Glassdoor" : lower.includes("ziprecruiter") ? "via ZipRecruiter" : `via ${source}`;
  return <span className={`rounded-full px-2 py-0.5 text-[8px] font-semibold ${style}`}>{label}</span>;
}

interface Props {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}

export function JobDetailPanel({ job, open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && job && (
        <motion.aside
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l bg-bg-card px-4 py-4 shadow-2xl md:py-6"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Job details
              </p>
              <h2 className="mt-1 font-heading text-base font-semibold text-text-primary">
                {job.title}
              </h2>
              <p className="text-xs text-text-secondary">
                {job.company} · {job.location} · {job.workplace}
              </p>
              <div className="mt-1.5">
                <SourceBadge source={job.source} />
              </div>
            </div>
            <button
              type="button"
              className="rounded-button border-2 p-1.5 text-text-muted transition hover:bg-border-light hover:text-text-primary"
              style={{ borderColor: "var(--border)" }}
              onClick={onClose}
            >
              <X size={14} />
            </button>
          </div>
          {job.applyUrl ? (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-button py-2.5 text-sm font-bold text-white transition hover:opacity-90"
              style={{ background: "var(--accent)" }}
              title={`Opens on ${job.source || "job board"} website`}
            >
              Apply now
              <ExternalLink size={14} />
            </a>
          ) : (
            <button
              type="button"
              className="mt-4 w-full rounded-button py-2.5 text-sm font-bold text-white transition hover:opacity-90"
              style={{ background: "var(--accent)" }}
            >
              Apply now
            </button>
          )}

          <div className="mt-5 space-y-4 overflow-y-auto text-xs text-text-secondary">
            <section>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Overview
              </h3>
              <p className="mt-1 text-text-secondary">{job.description}</p>
            </section>
            <section>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Responsibilities
              </h3>
              <ul className="mt-1 list-disc space-y-1 pl-4">
                {(job.responsibilities || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Requirements
              </h3>
              <ul className="mt-1 list-disc space-y-1 pl-4">
                {(job.requirements || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                AI summary
              </h3>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-text-secondary">
                <li>
                  Strong alignment with your recent activity in{" "}
                  <span className="font-medium text-text-primary">{job.category || "this role"}</span>.
                </li>
                <li>High overlap with your saved skills and preferred tech stack.</li>
                <li>Compensation and location preferences are within your target range.</li>
              </ul>
            </section>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
