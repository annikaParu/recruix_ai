import { NavLink } from "react-router-dom";
import { Briefcase, Bookmark, Send, BarChart3, Settings, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

const navItemClasses =
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors";

export function Sidebar({ open, onClose }: Props) {
  const { user } = useAuth();
  const initials =
    user?.user_metadata?.full_name
      ?.split(" ")
      .map((p: string) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } transition-transform`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-sky-400 text-xs font-bold text-white shadow-lg shadow-blue-500/40">
              R
            </div>
            <div>
              <div className="font-heading text-sm font-semibold tracking-tight">
                Recruix.ai
              </div>
              <div className="text-[11px] text-slate-400">
                Your AI-Powered Career Copilot
              </div>
            </div>
          </div>
          <button className="md:hidden text-slate-400" onClick={onClose}>
            ✕
          </button>
        </div>

        <nav className="mt-6 space-y-1 text-slate-300">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${navItemClasses} ${
                isActive
                  ? "bg-blue-600/90 text-white shadow-sm shadow-blue-500/40"
                  : "hover:bg-slate-800/80"
              }`
            }
            onClick={onClose}
          >
            <Briefcase size={16} />
            <span>Recommended Jobs</span>
          </NavLink>
          <NavLink
            to="/saved"
            className={({ isActive }) =>
              `${navItemClasses} ${
                isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800/80"
              }`
            }
            onClick={onClose}
          >
            <Bookmark size={16} />
            <span>Saved Jobs</span>
          </NavLink>
          <NavLink
            to="/applied"
            className={({ isActive }) =>
              `${navItemClasses} ${
                isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800/80"
              }`
            }
            onClick={onClose}
          >
            <Send size={16} />
            <span>Applied Jobs</span>
          </NavLink>
          <NavLink
            to="/insights"
            className={({ isActive }) =>
              `${navItemClasses} ${
                isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800/80"
              }`
            }
            onClick={onClose}
          >
            <BarChart3 size={16} />
            <span>Insights</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${navItemClasses} ${
                isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800/80"
              }`
            }
            onClick={onClose}
          >
            <Settings size={16} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="mt-auto flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3 text-xs text-slate-200">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-[11px] font-semibold text-slate-100">
              {initials}
            </div>
            <div>
              <div className="text-xs font-medium">
                {user?.user_metadata?.full_name || "User"}
              </div>
              <div className="text-[10px] text-slate-400">
                {user?.email || "signed in"}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-300">
                <Star size={10} className="fill-emerald-300 text-emerald-300" />
                <span>Pro</span>
              </div>
            </div>
          </div>
          <button className="rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-200 hover:border-blue-500 hover:text-blue-300">
            Switch
          </button>
        </div>
      </aside>
    </>
  );
}

