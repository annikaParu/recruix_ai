import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { R } from "../recrux/theme";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: R.bg,
        fontFamily: "var(--font-body)",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <Navbar />
      {children}
    </div>
  );
}
