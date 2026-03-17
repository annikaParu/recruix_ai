import { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

export function SocialButton({ icon, label, onClick }: Props) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-button border-2 bg-bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-bg-page"
      style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
    >
      <span className="h-4 w-4" style={{ color: "var(--secondary)" }}>{icon}</span>
      <span>{label}</span>
    </motion.button>
  );
}
