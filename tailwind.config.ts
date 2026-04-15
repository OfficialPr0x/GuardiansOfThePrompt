import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          deep: "#070412",
          surface: "#0D0A1F",
        },
        cosmic: {
          purple: "#6C2BFF",
          violet: "#B388FF",
        },
        neon: {
          pink: "#FF4FD8",
          blue: "#37C8FF",
        },
        text: {
          primary: "#F5F1FF",
          muted: "#C9BEEA",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "cosmic-gradient": "linear-gradient(to bottom right, #070412, #1A1033, #070412)",
      },
      animation: {
        "drift-slow": "drift 20s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-20px, 10px) scale(1.05)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", filter: "blur(10px) brightness(1)" },
          "50%": { opacity: "1", filter: "blur(15px) brightness(1.2)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
