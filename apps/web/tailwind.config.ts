import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "rgba(255,255,255,0.04)",
          hover: "rgba(255,255,255,0.07)",
          border: "rgba(255,255,255,0.08)",
        },
      },
      backgroundImage: {
        mesh: "radial-gradient(ellipse at 15% 25%, rgba(99,102,241,0.18) 0%, transparent 55%), radial-gradient(ellipse at 85% 10%, rgba(139,92,246,0.14) 0%, transparent 50%), radial-gradient(ellipse at 55% 85%, rgba(16,185,129,0.09) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(2,8,23,1) 0%, rgba(2,8,23,0.97) 100%)",
        "hero-glow": "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139,92,246,0.22) 0%, transparent 100%)",
        "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
