/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("./colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        black: colors.black,
        blue: colors.blue,
        cyan: colors.cyan,
        yellow: colors.yellow,
        red: colors.red,
        orange: colors.orange,
        grey: colors.grey,
        white: colors.white,
        teal: colors.teal,
        green: colors.green,
        purple: colors.purple,
        social: colors.social,
      },
      backgroundImage: {
        "curvy-shape": "url('/curvy-shape-img.png')",
        "curvy-shape-dark": "url('/curvy-shape-dark-img.png')",
        // ✅ MODERN: Updated landing gradient - vibrant to sophisticated
        "landing-bg": "linear-gradient(135deg, #ffffff 0%, #f0f9ff 25%, #e0f2fe 50%, #0ea5e9 75%, #0369a1 100%)",
        "landing-bg-dark": "linear-gradient(135deg, #0c1423 0%, #0f172a 25%, #0f1729 50%, #164e63 75%, #0c4a6e 100%)",
        // ✅ MODERN: Premium gradients for cards and sections
        "gradient-premium": "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        "gradient-premium-dark": "linear-gradient(135deg, #0f172a 0%, #1a1f35 100%)",
        "gradient-brand": "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
        "gradient-brand-dark": "linear-gradient(135deg, #0369a1 0%, #0891b2 100%)",
        "gradient-accent": "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)",
        "search-patients": "url('/search_patients.png')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        // ✅ MODERN: Professional shadow system
        "sm-modern": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "modern": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "md-modern": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "lg-modern": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "xl-modern": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.3)",
        "glow-blue": "0 0 20px rgba(14, 165, 233, 0.3)",
        "glow-purple": "0 0 20px rgba(139, 92, 246, 0.3)",
      },
      textShadow: {
        "landing-highlight": "2px 2px 4px rgba(0, 0, 0, 0.3)",
        "landing-highlight-dark": "2px 2px 4px rgba(255, 255, 255, 0.3)",
      },
      fontFamily: {
        sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
        // ✅ MODERN: Added display font for headings
        display: ["Inter", "Montserrat", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        // ✅ MODERN: Better typography scale
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1.2" }],
      },
      screens: {
        "3xl": "1536px",
        "2xl": "1400px",
        xl: "1400px",
        lg: "1024px",
        md: "768px",
        sm: "640px",
        xs: "480px",
        xxs: "400px",
      },
      animation: {
        spark: "spark 1.5s linear infinite",
        "pulse-custom": "pulse 2s infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        fadeIn: "fadeIn 1.5s ease-in-out",
        fadeInLeft: "fadeInLeft 1.5s ease-in-out forwards",
        maintain: "maintain 2s linear infinite",
        rotate: "rotate 2s linear infinite",
        blink: "blink 0.7s infinite",
        float: "float 3s ease-in-out infinite",
        "float-delayed": "float 3.5s ease-in-out 0.1s infinite",
        "float-slow": "float 4s ease-in-out 0.2s infinite",
        progressFill: "progressFill 2s linear forwards",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
        spark: {
          "0%": {
            maxWidth: "0%",
          },
          "100%": {
            maxWidth: "100%",
          },
        },
        pulse: {
          "0%, 100%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.1)",
            opacity: "1",
          },
        },
        float: {
          "0%, 100%": { 
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        maintain: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-360deg)" },
        },
        progressFill: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      zIndex: {
        "-1": "-1",
        50: "50",
        1000: "1000",
        1050: "1050",
        9999: "9999", // Ensure the modal is on top
      },
    },
  },
  plugins: [require("tailwind-scrollbar"), require("tailwindcss-textshadow")],
};