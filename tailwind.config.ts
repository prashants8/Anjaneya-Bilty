import type { Config } from "tailwindcss";

export default {
  darkMode: ["selector", '[data-mode="dark"]'],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'arc-red': 'var(--arc-red)',
        'arc-red-hover': 'var(--arc-red-hover)',
        'arc-red-print': 'var(--arc-red-print)',
        surface: 'var(--surface)',
        card: 'var(--card)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        secondary: 'var(--secondary)',
        positive: 'var(--positive)',
        warning: 'var(--warning)',
        border: "var(--line)",
        input: "var(--line)",
        ring: "var(--secondary)",
        background: "var(--surface)",
        foreground: "var(--ink)",
        primary: {
          DEFAULT: "var(--arc-red)",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "var(--arc-red)",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "var(--surface)",
          foreground: "var(--ink)",
        },
        popover: {
          DEFAULT: "var(--card)",
          foreground: "var(--ink)",
        },
        sidebar: {
          DEFAULT: "var(--card)",
          foreground: "var(--ink)",
          primary: "var(--secondary)",
          "primary-foreground": "#ffffff",
          accent: "var(--surface)",
          "accent-foreground": "var(--ink)",
          border: "var(--line)",
          ring: "var(--secondary)",
        },
        bilty: {
          header: "var(--secondary)",
          "header-text": "#ffffff",
          "table-header": "var(--secondary)",
          "table-border": "var(--line)",
          highlight: "var(--arc-red)",
          section: "var(--surface)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
