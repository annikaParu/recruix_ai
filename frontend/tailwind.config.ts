import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "var(--primary)", dark: "var(--primary-dark)" },
        secondary: "var(--secondary)",
        accent: { DEFAULT: "var(--accent)", dark: "var(--accent-dark)" },
        "bg-page": "var(--bg-page)",
        "bg-card": "var(--bg-card)",
        "bg-hero": "var(--bg-hero)",
        "bg-badge": "var(--bg-badge)",
        "bg-purple": "var(--bg-purple)",
        "bg-teal": "var(--bg-teal)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        border: { DEFAULT: "var(--border)", light: "var(--border-light)" },
        brand: {
          50: "#f4f5ff",
          100: "#e3e6ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca"
        }
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        button: "8px",
        pill: "20px",
      },
    }
  },
  plugins: []
};

export default config;

