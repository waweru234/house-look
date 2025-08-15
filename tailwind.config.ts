import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0000FF", // Vibrant Cyan
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#F5F5F5", // Whitesmoke
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "#FF4D4D", // Coral Red
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F0F8FF", // AliceBlue
          foreground: "#6B7280", // Cool Gray
        },
        accent: {
          DEFAULT: "#F0F8FF", // AliceBlue
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
        // HouseLook Extended Gen-Z Color Palette
        houselook: {
          // Primary Colors (Existing)
          cyan: "#0000FF", // Vibrant Cyan - Primary accent
          whitesmoke: "#F5F5F5", // Light background
          aliceblue: "#F0F8FF", // Soft background
          black: "#000000", // Main text
          white: "#FFFFFF", // Pure white

          // Supporting Colors for Better Contrast & Gen Z Appeal
          teal: "#008B8B", // Deep Teal - Hover states, buttons
          darkGray: "#333333", // Dark Gray - Text
          coolGray: "#6B7280", // Cool Gray - Placeholders/labels
          indigo: "#6F00FF", // Indigo Accent - Highlights, modern touch

          // Additional Gen Z Colors
          lightGray: "#9CA3AF", // Light Gray - Subtle elements
          success: "#10B981", // Emerald Green - Success states
          error: "#FF4D4D", // Coral Red - Error states
          warning: "#F59E0B", // Amber - Warning states
          info: "#3B82F6", // Blue - Info states

          // Modern Gradients
          gradientPrimary: "linear-gradient(135deg, #0000FF 0%, #008B8B 100%)",
          gradientSecondary: "linear-gradient(135deg, #6F00FF 0%, #0000FF 100%)",
          gradientNeutral: "linear-gradient(135deg, #F0F8FF 0%, #F5F5F5 100%)",
        },
      },
      borderRadius: {
        lg: "1rem", // Modern rounded corners
        md: "0.75rem",
        sm: "0.5rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0, 0, 0, 0.08)",
        "soft-lg": "0 8px 24px rgba(0, 0, 0, 0.12)",
        "soft-xl": "0 12px 32px rgba(0, 0, 0, 0.16)",
        "cyan-glow": "0 0 20px rgba(0, 255, 255, 0.3)",
        "indigo-glow": "0 0 20px rgba(111, 0, 255, 0.3)",
      },
      fontFamily: {
        sans: ["var(--font-noto-serif)", "system-ui", "sans-serif"],
        heading: ["var(--font-bebas-neue)", "system-ui", "sans-serif"],
        display: ["var(--font-rowdies)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "professional-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "professional-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "professional-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(0, 255, 255, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 255, 255, 0.8)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-shift": "gradient-shift 4s ease infinite",
        "professional-float": "professional-float 3s ease-in-out infinite",
        "professional-pulse": "professional-pulse 2s ease-in-out infinite",
        "professional-glow": "professional-glow 2s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #0000FF 0%, #008B8B 100%)",
        "gradient-secondary": "linear-gradient(135deg, #6F00FF 0%, #0000FF 100%)",
        "gradient-neutral": "linear-gradient(135deg, #F0F8FF 0%, #F5F5F5 100%)",
        "gradient-success": "linear-gradient(135deg, #10B981 0%, #059669 100%)",
        "gradient-professional": "linear-gradient(135deg, #F0F8FF 0%, #FFFFFF 50%, #F5F5F5 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
