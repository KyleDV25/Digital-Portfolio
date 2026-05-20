import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        void: "#060606",
        ink: "#0f0f0f",
        ash: "#1a1a1a",
        smoke: "#2d2d2d",
        ghost: "#bbbbbb",
        paper: "#e8e3db",
        chalk: "#f5f0e8",
        volt: "#CAFF00",
        plasma: "#BF00FF",
        ice: "#00FFEE",
        blood: "#FF0035",
        ember: "#FF6B00",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "Impact", "sans-serif"],
        mono: ["var(--font-mono)", "Courier New", "monospace"],
        body: ["var(--font-barlow)", "sans-serif"],
        label: ["var(--font-label)", "monospace"],
      },
      fontSize: {
        "10xl": ["10rem", { lineHeight: "0.9" }],
        "11xl": ["12rem", { lineHeight: "0.85" }],
        "12xl": ["15rem", { lineHeight: "0.82" }],
        "fluid-hero": ["clamp(5rem,15vw,18rem)", { lineHeight: "0.85" }],
        "fluid-xl": ["clamp(2.5rem,6vw,8rem)", { lineHeight: "0.9" }],
        "fluid-lg": ["clamp(1.5rem,3.5vw,4rem)", { lineHeight: "1.1" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "128": "32rem",
        "160": "40rem",
      },
      letterSpacing: {
        tightest: "-0.06em",
        tighter: "-0.04em",
        widest: "0.35em",
        ultra: "0.5em",
      },
      animation: {
        "glitch-1": "glitch1 0.3s infinite steps(2, end)",
        "glitch-2": "glitch2 0.3s infinite steps(2, end)",
        "scan": "scan 3s linear infinite",
        "flicker": "flicker 0.15s infinite",
        "marquee": "marquee 20s linear infinite",
        "marquee-reverse": "marqueeReverse 20s linear infinite",
        "pulse-neon": "pulseNeon 2s ease-in-out infinite",
        "cursor-blink": "cursorBlink 1s step-end infinite",
        "static-noise": "staticNoise 0.08s steps(1) infinite",
      },
      keyframes: {
        glitch1: {
          "0%, 100%": { clipPath: "inset(0 0 90% 0)", transform: "translate(-4px)" },
          "50%": { clipPath: "inset(40% 0 50% 0)", transform: "translate(4px)" },
        },
        glitch2: {
          "0%, 100%": { clipPath: "inset(60% 0 0 0)", transform: "translate(4px)" },
          "50%": { clipPath: "inset(10% 0 80% 0)", transform: "translate(-4px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marqueeReverse: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        pulseNeon: {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.7", filter: "brightness(1.5)" },
        },
        cursorBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        staticNoise: {
          "0%": { backgroundPosition: "0 0" },
          "10%": { backgroundPosition: "-5% -10%" },
          "20%": { backgroundPosition: "-15% 5%" },
          "30%": { backgroundPosition: "7% -25%" },
          "40%": { backgroundPosition: "20% 25%" },
          "50%": { backgroundPosition: "-25% 10%" },
          "60%": { backgroundPosition: "15% 5%" },
          "70%": { backgroundPosition: "0 15%" },
          "80%": { backgroundPosition: "25% 35%" },
          "90%": { backgroundPosition: "-10% 10%" },
          "100%": { backgroundPosition: "0 0" },
        },
      },
      backgroundImage: {
        "noise": "url('/noise.svg')",
        "grid-volt": "linear-gradient(rgba(202,255,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(202,255,0,0.04) 1px, transparent 1px)",
        "scanlines": "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
      },
      backgroundSize: {
        "grid": "60px 60px",
      },
      boxShadow: {
        "neon-volt": "0 0 20px rgba(202,255,0,0.4), 0 0 60px rgba(202,255,0,0.2)",
        "neon-plasma": "0 0 20px rgba(191,0,255,0.4), 0 0 60px rgba(191,0,255,0.2)",
        "neon-ice": "0 0 20px rgba(0,255,238,0.4), 0 0 60px rgba(0,255,238,0.2)",
        "neon-blood": "0 0 20px rgba(255,0,53,0.4), 0 0 60px rgba(255,0,53,0.2)",
      },
      screens: {
        "3xl": "1800px",
      },
    },
  },
  plugins: [],
};

export default config;
