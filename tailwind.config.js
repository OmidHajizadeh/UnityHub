/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        "post-card":
          "radial-gradient(rgb(253, 101, 13), transparent, transparent)",
        auth: 'url("/images/auth-bg.webp")',
      },
      colors: {
        "primary-400": "#963c04",
        "primary-500": "#fd650d",
        "primary-600": "#fc8f50",
        "secondary-500": "#FFB620",
        "off-white": "#D0DFFF",
        red: "#FF5A5A",
        "dark-1": "#000000",
        "dark-2": "#09090A",
        "dark-3": "#101012",
        "dark-4": "#1F1F22",
        "light-1": "#FFFFFF",
        "light-2": "#EFEFEF",
        "light-3": "#7878A3",
        "light-4": "#5C5C7B",
        destructive: "#290a04",
      },
      screens: {
        xs: "480px",
      },
      width: {
        420: "420px",
        465: "465px",
      },
      fontFamily: {
        iranyekan: ["IranYekan", "sans"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    fontWeight: {
      thin: "100",
      ultraLight: "200",
      light: "300",
      normal: "normal",
      medium: "500",
      semibold: "600",
      bold: "bold",
      extraBold: "800",
      black: "900",
      extraBlack: "950",
      heavy: "1000",
    },
  },
  plugins: [require("tailwindcss-animate")],
};
