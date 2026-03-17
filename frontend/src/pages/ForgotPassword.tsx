import { useState } from "react";
import { Mail } from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";
import { supabase } from "../lib/supabase";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) {
      setMessage("Unable to send reset email. Please try again.");
    } else {
      setMessage("Password reset email sent!");
    }
  };

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email and we'll send you a reset link">
      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <label className="block space-y-1">
          <span className="text-xs text-text-secondary">Email</span>
          <div
            className="flex items-center gap-2 rounded-button border-2 bg-bg-card px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary"
            style={{ borderColor: "var(--border)" }}
          >
            <Mail size={16} style={{ color: "var(--secondary)" }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </div>
        </label>
        {message && <p className="text-xs text-text-secondary">{message}</p>}
        <button
          type="submit"
          className="mt-1 w-full rounded-button py-2.5 text-sm font-bold text-white transition hover:opacity-90"
          style={{ background: "var(--accent)" }}
        >
          Send reset link
        </button>
      </form>
    </AuthLayout>
  );
}
