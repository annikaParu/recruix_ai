import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { JOB_CATEGORIES } from "../data/mockJobs";
import { Toast } from "../../components/Toast";

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [preferredCategories, setPreferredCategories] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      const { data } = await supabase.from("profiles").select("preferred_categories, target_field").eq("id", user.id).single();
      if (data?.preferred_categories?.length) {
        setPreferredCategories(new Set(data.preferred_categories as string[]));
      } else if (data?.target_field) {
        setPreferredCategories(new Set([data.target_field as string]));
      } else if ((user as { user_metadata?: { target_field?: string } }).user_metadata?.target_field) {
        setPreferredCategories(new Set([(user as { user_metadata?: { target_field?: string } }).user_metadata!.target_field!]));
      }
      setLoading(false);
    };
    load();
  }, [user?.id]);

  const toggleCategory = (cat: string) => {
    setPreferredCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await supabase.from("profiles").upsert({
        id: user.id,
        preferred_categories: [...preferredCategories],
        updated_at: new Date().toISOString(),
      });
      setToast({ message: "Preferences saved! Your job feed will update.", type: "success" });
    } catch {
      setToast({ message: "Failed to save.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-lg font-semibold text-text-primary">Settings</h1>
      <p className="text-sm text-text-secondary">
        Tune your profile and preferences so Recruix can surface the best possible matches.
      </p>
      <form
        className="mt-2 space-y-4 rounded-card border p-4 text-xs"
        style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
        onSubmit={(e) => { e.preventDefault(); handleSave(); }}
      >
        <div>
          <span className="text-[11px] font-medium text-text-secondary block mb-2">
            Roles &amp; fields I&apos;m interested in
          </span>
          <p className="text-[11px] text-text-muted mb-2">
            Select all that apply. Only jobs in these categories will appear in your recommended feed.
          </p>
          {loading ? (
            <p className="text-text-muted">Loading...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {JOB_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    preferredCategories.has(cat)
                      ? "bg-accent text-white"
                      : "border-2 border-border bg-bg-card text-text-secondary hover:bg-bg-hero"
                  }`}
                  style={!preferredCategories.has(cat) ? { borderColor: "var(--border)" } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-[11px] font-medium text-text-secondary">Target titles</span>
            <input
              className="w-full rounded-button border-2 bg-bg-card px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ borderColor: "var(--border)" }}
              placeholder="e.g. Senior Software Engineer, Staff ML Engineer"
            />
          </label>
          <label className="space-y-1">
            <span className="text-[11px] font-medium text-text-secondary">Preferred locations</span>
            <input
              className="w-full rounded-button border-2 bg-bg-card px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ borderColor: "var(--border)" }}
              placeholder="e.g. Remote, SF Bay Area, New York"
            />
          </label>
        </div>
        <label className="space-y-1">
          <span className="text-[11px] font-medium text-text-secondary">Skills you want to use</span>
          <input
            className="w-full rounded-button border-2 bg-bg-card px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ borderColor: "var(--border)" }}
            placeholder="e.g. Python, React, product strategy"
          />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[11px] text-text-muted">
            Your role preferences are saved to your account and used to personalize job recommendations.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-button bg-accent px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="rounded-button border-2 border-red-300 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
