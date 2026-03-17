import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { JOB_CATEGORIES } from "../data/mockJobs";

const EXPERIENCE_OPTIONS = ["Intern/New Grad", "Entry Level", "Mid Level", "Senior", "Lead/Staff"];
const WORK_SETTINGS = ["Remote", "Hybrid", "On-site"] as const;

interface Props {
  open: boolean;
  onClose: () => void;
  initialField: string;
  initialExperience: string;
  initialLocation: string;
  initialWorkSetting: string;
  onSave: (prefs: {
    targetField: string;
    experienceLevel: string;
    preferredLocation: string;
    workSetting: string;
  }) => Promise<void>;
}

export function PreferencesModal({
  open,
  onClose,
  initialField,
  initialExperience,
  initialLocation,
  initialWorkSetting,
  onSave,
}: Props) {
  const [targetField, setTargetField] = useState(initialField);
  const [experienceLevel, setExperienceLevel] = useState(initialExperience);
  const [preferredLocation, setPreferredLocation] = useState(initialLocation);
  const [workSetting, setWorkSetting] = useState(initialWorkSetting);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        targetField: targetField || "Software Engineer",
        experienceLevel,
        preferredLocation,
        workSetting,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-card border bg-bg-card p-6 shadow-xl"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold text-text-primary">Set your job preferences</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-button p-1.5 text-text-muted transition hover:bg-bg-badge hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">What field are you targeting?</label>
                <select
                  value={targetField || ""}
                  onChange={(e) => setTargetField(e.target.value)}
                  className="w-full rounded-button border-2 bg-bg-card px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  style={{ borderColor: "var(--border)" }}
                >
                  <option value="">Select a field</option>
                  <option value="Software Engineer">Software Engineer</option>
                  {JOB_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Experience level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full rounded-button border-2 bg-bg-card px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  style={{ borderColor: "var(--border)" }}
                >
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Preferred location</label>
                <input
                  type="text"
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  placeholder="e.g. Remote, San Francisco, United States"
                  className="w-full rounded-button border-2 bg-bg-card px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2">Remote / Hybrid / On-site</label>
                <div className="flex flex-wrap gap-2">
                  {WORK_SETTINGS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWorkSetting(w)}
                      className={`rounded-button px-3 py-2 text-xs font-medium transition ${
                        workSetting === w
                          ? "bg-accent text-white"
                          : "border-2 bg-bg-card text-text-secondary hover:bg-bg-hero"
                      }`}
                      style={workSetting !== w ? { borderColor: "var(--border)" } : {}}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-button bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
              >
                {saving ? "Saving…" : "Save & find my jobs"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
