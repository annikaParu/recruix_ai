import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { Toast } from "../../components/Toast";

const STATUS_COLORS: Record<string, string> = {
  Submitted: "bg-primary text-white",
  "Under Review": "bg-amber-100 text-amber-800",
  Interview: "bg-bg-teal text-accent",
  Rejected: "bg-red-100 text-red-700",
  Offer: "bg-green-100 text-green-700",
};

interface Application {
  id: string;
  company: string;
  job_title: string;
  applied_at: string;
  status: string;
}

export function AutoApplyPage() {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [minMatch, setMinMatch] = useState(85);
  const [jobTypes, setJobTypes] = useState<Set<string>>(new Set(["Full-time"]));
  const [locations, setLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [salaryMin, setSalaryMin] = useState(0);
  const [excludedCompanies, setExcludedCompanies] = useState<string[]>([]);
  const [excludedCompanyInput, setExcludedCompanyInput] = useState("");
  const [excludedKeywords, setExcludedKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState({ today: 0, week: 0, total: 0, successRate: 0 });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const loadSettings = async () => {
    if (!user?.id) return;
    const { data } = await supabase.from("autoapply_settings").select("*").eq("id", user.id).single();
    if (data) {
      setEnabled(!!data.enabled);
      setMinMatch(data.min_match ?? 85);
      setJobTypes(new Set((data.job_types as string[]) || ["Full-time"]));
      setSalaryMin(data.min_salary ?? 0);
      setExcludedCompanies((data.excluded_companies as string[]) || []);
      setExcludedKeywords((data.excluded_keywords as string[]) || []);
    }
  };

  const loadApplications = async () => {
    if (!user?.id) return;
    const { data } = await supabase.from("applications").select("*").eq("user_id", user.id).eq("auto_applied", true);
    if (data?.length) {
      setApplications(
        data.map((r) => ({
          id: r.id,
          company: (r.job_data as { company?: string })?.company || "Unknown",
          job_title: (r.job_data as { title?: string })?.title || r.job_id,
          applied_at: r.applied_at,
          status: r.status || "Submitted",
        }))
      );
    } else {
      setApplications([]);
    }
  };

  useEffect(() => {
    loadSettings();
    loadApplications();
  }, [user?.id]);

  useEffect(() => {
    const today = new Date().toDateString();
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const todayCount = applications.filter((a) => new Date(a.applied_at).toDateString() === today).length;
    const weekCount = applications.filter((a) => new Date(a.applied_at).getTime() >= weekAgo).length;
    setStats({
      today: todayCount,
      week: weekCount,
      total: applications.length,
      successRate: applications.length ? Math.round((applications.filter((a) => a.status === "Offer" || a.status === "Interview").length / applications.length) * 100) : 0,
    });
  }, [applications]);

  const toggleEnabled = async () => {
    const next = !enabled;
    setEnabled(next);
    if (user?.id) {
      await supabase.from("autoapply_settings").upsert({
        id: user.id,
        enabled: next,
        updated_at: new Date().toISOString(),
      });
    }
  };

  const savePreferences = async () => {
    if (!user?.id) return;
    await supabase.from("autoapply_settings").upsert({
      id: user.id,
      enabled,
      min_match: minMatch,
      job_types: [...jobTypes],
      min_salary: salaryMin,
      excluded_companies: excludedCompanies,
      excluded_keywords: excludedKeywords,
      updated_at: new Date().toISOString(),
    });
    setToast({ message: "Preferences saved!", type: "success" });
  };

  const addLocation = () => {
    if (!locationInput.trim()) return;
    setLocations((s) => [...s, locationInput.trim()]);
    setLocationInput("");
  };
  const addExcludedCompany = () => {
    if (!excludedCompanyInput.trim()) return;
    setExcludedCompanies((s) => [...s, excludedCompanyInput.trim()]);
    setExcludedCompanyInput("");
  };
  const addExcludedKeyword = () => {
    if (!keywordInput.trim()) return;
    setExcludedKeywords((s) => [...s, keywordInput.trim()]);
    setKeywordInput("");
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-xl font-semibold text-text-primary">Auto Apply</h1>
      <p className="text-sm text-text-secondary">
        Let Recruix apply to matching jobs automatically using your profile and resume
      </p>

      {/* Status card */}
      <div className="rounded-card border bg-bg-card p-4" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleEnabled}
              className={`relative h-10 w-16 rounded-full transition ${enabled ? "bg-accent" : "bg-gray-200"}`}
            >
              <span className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow transition ${enabled ? "left-7" : "left-1"}`} />
            </button>
            <span className="font-medium text-text-primary">{enabled ? "Active — Recruix is applying to jobs" : "Paused"}</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-text-muted">Applied Today</p>
            <p className="text-lg font-semibold text-text-primary">{stats.today}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">This Week</p>
            <p className="text-lg font-semibold text-text-primary">{stats.week}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Total Applied</p>
            <p className="text-lg font-semibold text-text-primary">{stats.total}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Success Rate</p>
            <p className="text-lg font-semibold text-text-primary">{stats.successRate}%</p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-card border bg-bg-card p-4" style={{ borderColor: "var(--border)" }}>
        <h2 className="mb-4 font-semibold text-text-primary">Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-secondary">Minimum match score: {minMatch}%</label>
            <input type="range" min={70} max={99} value={minMatch} onChange={(e) => setMinMatch(Number(e.target.value))} className="mt-1 w-full" />
          </div>
          <div>
            <label className="text-sm text-text-secondary">Job types</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {["Full-time", "Part-time", "Contract", "Internship"].map((t) => (
                <label key={t} className="flex items-center gap-2">
                  <input type="checkbox" checked={jobTypes.has(t)} onChange={() => setJobTypes((s) => (s.has(t) ? new Set([...s].filter((x) => x !== t)) : new Set([...s, t])))} />
                  {t}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Preferred locations (press Enter)</label>
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLocation())}
              placeholder="e.g. Remote, NYC"
              className="mt-1 w-full rounded-button border border-border px-3 py-2 text-sm"
            />
            <div className="mt-1 flex flex-wrap gap-1">
              {locations.map((l) => (
                <span key={l} className="rounded-full bg-bg-badge px-2 py-0.5 text-xs">
                  {l} <button type="button" onClick={() => setLocations((s) => s.filter((x) => x !== l))}>×</button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Salary minimum ($)</label>
            <input type="number" value={salaryMin || ""} onChange={(e) => setSalaryMin(Number(e.target.value) || 0)} placeholder="0" className="mt-1 w-full rounded-button border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm text-text-secondary">Companies to exclude (press Enter)</label>
            <input
              type="text"
              value={excludedCompanyInput}
              onChange={(e) => setExcludedCompanyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addExcludedCompany())}
              placeholder="Company name"
              className="mt-1 w-full rounded-button border border-border px-3 py-2 text-sm"
            />
            <div className="mt-1 flex flex-wrap gap-1">
              {excludedCompanies.map((c) => (
                <span key={c} className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700">
                  {c} <button type="button" onClick={() => setExcludedCompanies((s) => s.filter((x) => x !== c))}>×</button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Keywords to exclude from titles (press Enter)</label>
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addExcludedKeyword())}
              placeholder="e.g. Senior, Lead"
              className="mt-1 w-full rounded-button border border-border px-3 py-2 text-sm"
            />
            <div className="mt-1 flex flex-wrap gap-1">
              {excludedKeywords.map((k) => (
                <span key={k} className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700">
                  {k} <button type="button" onClick={() => setExcludedKeywords((s) => s.filter((x) => x !== k))}>×</button>
                </span>
              ))}
            </div>
          </div>
          <button type="button" onClick={savePreferences} className="rounded-button bg-accent px-4 py-2 text-sm font-semibold text-white">
            Save preferences
          </button>
        </div>
      </div>

      {/* Auto applied jobs table */}
      <div className="rounded-card border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <h2 className="border-b bg-bg-card p-4 font-semibold text-text-primary" style={{ borderColor: "var(--border)" }}>Auto Applied Jobs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-bg-page" style={{ borderColor: "var(--border)" }}>
                <th className="p-3 text-left text-text-muted">Company</th>
                <th className="p-3 text-left text-text-muted">Job Title</th>
                <th className="p-3 text-left text-text-muted">Applied At</th>
                <th className="p-3 text-left text-text-muted">Status</th>
                <th className="p-3 text-left text-text-muted">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-text-muted">
                    No auto-applied jobs yet. Enable Auto Apply above and jobs will appear here as Recruix applies for you.
                  </td>
                </tr>
              ) : (
                applications.map((a) => (
                  <tr key={a.id} className="border-b" style={{ borderColor: "var(--border-light)" }}>
                    <td className="p-3 font-medium text-text-primary">{a.company}</td>
                    <td className="p-3 text-text-secondary">{a.job_title}</td>
                    <td className="p-3 text-text-muted">{new Date(a.applied_at).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[a.status] || "bg-gray-100"}`}>{a.status}</span>
                    </td>
                    <td className="p-3">
                      <button type="button" className="text-sm font-medium text-primary hover:underline">View Application</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
