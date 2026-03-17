export function InsightsPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-heading text-lg font-semibold text-text-primary">Insights</h1>
      <p className="text-sm text-text-secondary">
        High-level analytics on your search: match scores, skill gaps, and market trends.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div
          className="rounded-card border p-4 text-xs"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
        >
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Match score over time
          </h2>
          <div className="mt-3 h-32 rounded-lg bg-border-light" />
          <p className="mt-2 text-[11px] text-text-muted">
            Placeholder chart. We&apos;ll show how your matches improve as you refine your profile.
          </p>
        </div>
        <div
          className="rounded-card border p-4 text-xs"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
        >
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Top skills gap
          </h2>
          <div className="mt-3 h-32 rounded-lg bg-border-light" />
          <p className="mt-2 text-[11px] text-text-muted">
            Placeholder chart. Here we&apos;ll highlight skills that appear in roles you like but
            are missing from your profile.
          </p>
        </div>
      </div>
    </div>
  );
}
