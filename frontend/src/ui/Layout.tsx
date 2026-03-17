import { ReactNode } from "react";
import { IconSidebar } from "./components/IconSidebar";
import { BottomNav } from "./components/BottomNav";

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-page text-text-primary">
      {/* Sidebar – fixed at 70px on the left */}
      <IconSidebar />

      {/* Main area – starts AFTER sidebar on md+ (margin-left via .dashboard-main) */}
      <div className="dashboard-main flex min-h-screen min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top nav bar – spans full width of main content */}
        <header
          className="flex items-center justify-between border-b px-4 py-3 md:px-6"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
        >
          <span className="font-heading text-sm font-semibold tracking-tight text-text-primary">
            Recruix.ai
          </span>
          <span className="text-xs text-text-muted">Dashboard</span>
        </header>

        {/* Scrollable content below nav */}
        <main className="flex-1 min-w-0 overflow-y-auto px-3 py-4 pb-20 md:px-6 md:py-6 md:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom nav – only on small screens */}
      <BottomNav />
    </div>
  );
}
