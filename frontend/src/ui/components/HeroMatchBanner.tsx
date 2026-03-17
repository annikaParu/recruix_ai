export function HeroMatchBanner() {
  return (
    <div
      className="mb-4 rounded-card border-2 p-4 md:px-6 md:py-4"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">Smart match</p>
          <p className="mt-1 font-heading text-lg font-semibold text-text-primary md:text-xl">
            98% Match — Based on your profile and activity
          </p>
          <p className="mt-1 text-xs text-text-secondary md:text-sm">
            Recruix continuously learns from your applications, views, and saved jobs to surface
            roles you&apos;re most likely to land.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-button border-2 px-4 py-2 text-xs font-semibold transition hover:bg-bg-hero"
          style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
        >
          Update preferences
        </button>
      </div>
    </div>
  );
}
