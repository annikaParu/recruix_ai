import { motion } from "framer-motion";
import { Bookmark, X, Sparkles, ExternalLink } from "lucide-react";
import type { Job } from "../../types/jobs";

function daysSincePosted(dateString: string | undefined): number {
  if (!dateString) return 0;
  return Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000);
}

interface Props {
  job: Job;
  saved: boolean;
  onToggleSaved: () => void;
  onNotInterested: () => void;
  onClick: () => void;
}

function formatPostedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function formatFullDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

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
  const label = lower.includes("linkedin")
    ? "via LinkedIn"
    : lower.includes("indeed")
      ? "via Indeed"
      : lower.includes("glassdoor")
        ? "via Glassdoor"
        : lower.includes("ziprecruiter")
          ? "via ZipRecruiter"
          : `via ${source}`;
  return (
    <span className={`rounded-full px-2 py-0.5 text-[8px] font-semibold ${style}`} title={`Job from ${source}`}>
      {label}
    </span>
  );
}

function MatchRing({ value }: { value: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width="90" height="90" className="block">
      <circle cx="45" cy="45" r={radius} stroke="rgba(255,255,255,0.15)" strokeWidth="6" fill="none" />
      <motion.circle
        cx="45"
        cy="45"
        r={radius}
        stroke="var(--accent)"
        strokeWidth="6"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8 }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        className="fill-white text-lg font-bold"
      >
        {value}%
      </text>
    </svg>
  );
}

export function JobCard({ job, saved, onToggleSaved, onNotInterested, onClick }: Props) {
  const postedAgo = job.postedAgo || formatPostedAt(job.postedAt);
  const daysOld = daysSincePosted(job.postedAt);
  const isStale = daysOld > 21;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="group relative cursor-pointer overflow-hidden rounded-card border bg-bg-card p-4 shadow-sm transition hover:border-primary/50"
      style={{ borderColor: "var(--border)" }}
      onClick={onClick}
    >
      {isStale && (
        <div
          className="mb-2 rounded-button px-2 py-1 text-[10px] font-medium"
          style={{ background: "#fef3c7", color: "#92400e" }}
        >
          ⚠ This job was posted {daysOld} days ago — may be filled
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 text-xs text-text-muted">
            <span
              title={job.postedAt ? `Posted on ${formatFullDate(job.postedAt)}` : undefined}
              className={daysOld > 30 ? "font-medium text-amber-600" : ""}
            >
              {daysOld > 30 && "⚠ "}
              {postedAgo}
            </span>
            <SourceBadge source={job.source} />
          </div>
        </div>
      </div>
      <div className="mt-2 grid gap-3 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)]">
        <div className="space-y-2">
          <div className="flex gap-3">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt=""
                className="h-12 w-12 shrink-0 rounded-lg object-contain bg-bg-badge"
              />
            ) : (
              <div
                className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white ${job.logoColor || "bg-emerald-500"}`}
              >
                {job.company
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-heading text-sm font-bold text-text-primary md:text-[15px]">
                {job.title}
              </h3>
              <p className="text-xs text-text-secondary">
                {job.company}
                {job.industryStage ? ` · ${job.industryStage}` : ""}
              </p>
            </div>
          </div>
          <div className="grid gap-1 text-xs text-text-secondary md:grid-cols-2">
            <div>📍 {job.location}</div>
            <div>🕐 {job.type === "internship" ? "Internship" : job.type}</div>
            <div>💰 {job.salary}</div>
            <div>🏠 {job.workplace}</div>
            <div>🎓 {job.experienceLabel || job.years || "—"}</div>
          </div>
          {(job.applicantCount || job.isEarlyApplicant) && (
            <p className="text-[10px]" style={{ color: "var(--accent)" }}>
              {job.applicantCount || (job.isEarlyApplicant ? "Be an early applicant" : "")}
            </p>
          )}
          <div className="mt-1 flex flex-wrap gap-1.5">
            {(job.tags || []).slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2 py-0.5 text-[10px]"
                style={{ background: "var(--bg-badge)", color: "var(--primary)" }}
              >
                {tag}
              </span>
            ))}
            {(job.tags?.length ?? 0) > 4 && (
              <span
                className="rounded-full px-2 py-0.5 text-[10px]"
                style={{ background: "var(--bg-purple)", color: "var(--secondary)" }}
              >
                +{(job.tags?.length ?? 0) - 4}
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-button border px-2.5 py-1 text-text-muted transition hover:bg-border-light hover:text-text-secondary"
              style={{ borderColor: "var(--border)" }}
              onClick={(e) => {
                e.stopPropagation();
                onNotInterested();
              }}
            >
              <X size={12} />
              <span>Not Interested</span>
            </button>
            <button
              type="button"
              className={`inline-flex items-center gap-1 rounded-button px-2.5 py-1 transition ${
                saved
                  ? "bg-bg-teal text-accent"
                  : "border border-border bg-bg-card text-text-secondary hover:bg-border-light"
              }`}
              style={saved ? {} : { borderColor: "var(--border)" }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSaved();
              }}
            >
              <Bookmark size={12} className={saved ? "fill-accent text-accent" : ""} />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-button border-2 px-2.5 py-1 font-medium transition hover:bg-bg-hero"
              style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <Sparkles size={12} />
              <span>✦ ASK ARIA</span>
            </button>
            {job.applyUrl ? (
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1 rounded-button px-3 py-1.5 text-xs font-bold text-white transition hover:opacity-90"
                style={{ background: "var(--accent)" }}
                onClick={(e) => e.stopPropagation()}
                title={`Opens on ${job.source || "job board"} website`}
              >
                Apply Now
                <ExternalLink size={12} />
              </a>
            ) : (
              <button
                type="button"
                className="ml-auto inline-flex items-center gap-1 rounded-button px-3 py-1.5 text-xs font-bold text-white transition hover:opacity-90"
                style={{ background: "var(--accent)" }}
                onClick={(e) => e.stopPropagation()}
              >
                APPLY NOW
              </button>
            )}
          </div>
        </div>
        <div
          className="flex items-center justify-center rounded-card px-3 py-4 text-center"
          style={{ background: "#312E81" }}
        >
          <div>
            <MatchRing value={job.match} />
            <p className="mt-1 text-[10px] font-semibold text-white">STRONG MATCH</p>
            {job.h1bStatus && <p className="mt-1 text-[10px] text-white/80">✓ {job.h1bStatus}</p>}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
