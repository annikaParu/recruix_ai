export function AppliedPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-heading text-lg font-semibold text-text-primary">Applied jobs</h1>
      <p className="text-sm text-text-secondary">
        Track where you are in the process: from first application to final offer.
      </p>
      <div className="grid gap-3 text-xs md:grid-cols-4">
        {["Applied", "Interview", "Offer", "Rejected"].map((column) => (
          <div
            key={column}
            className="rounded-card border p-3"
            style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
          >
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              {column}
            </div>
            <p className="text-[11px] text-text-muted">
              You don&apos;t have any jobs in this column yet.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
