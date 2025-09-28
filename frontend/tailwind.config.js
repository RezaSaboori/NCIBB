import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "rgb(248, 248, 248)", // gray1
            foreground: "rgb(7, 7, 7)", // gray12
            content1: "rgb(255, 255, 255)",
            primary: {
              DEFAULT: "rgb(0, 136, 255)", // blue
              foreground: "rgb(255, 255, 255)",
            },
            secondary: {
              DEFAULT: "rgb(203, 48, 224)", // purple
              foreground: "rgb(255, 255, 255)",
            },
            success: {
              DEFAULT: "rgb(52, 199, 89)", // green
              foreground: "rgb(255, 255, 255)",
            },
            warning: {
              DEFAULT: "rgb(255, 141, 40)", // orange
              foreground: "rgb(255, 255, 255)",
            },
            danger: {
              DEFAULT: "rgb(255, 56, 60)", // red
              foreground: "rgb(255, 255, 255)",
            },
            gray1: "rgb(248, 248, 248)",
            gray2: "rgb(228, 228, 228)",
            gray3: "rgb(210, 210, 210)",
            gray4: "rgb(190, 190, 190)",
            gray5: "rgb(170, 170, 170)",
            gray6: "rgb(142, 142, 142)",
            gray7: "rgb(107, 107, 107)",
            gray8: "rgb(87, 87, 87)",
            gray9: "rgb(67, 67, 67)",
            gray10: "rgb(47, 47, 47)",
            gray11: "rgb(27, 27, 27)",
            gray12: "rgb(7, 7, 7)",
          },
        },
        dark: {
          colors: {
            background: "rgb(7, 7, 7)", // dark gray1
            foreground: "rgb(248, 248, 248)", // dark gray12
            content1: "rgb(27, 27, 27)",
            primary: {
              DEFAULT: "rgb(0, 145, 255)", // dark blue
              foreground: "rgb(255, 255, 255)",
            },
            secondary: {
              DEFAULT: "rgb(219, 52, 242)", // dark purple
              foreground: "rgb(255, 255, 255)",
            },
            success: {
              DEFAULT: "rgb(48, 209, 88)", // dark green
              foreground: "rgb(255, 255, 255)",
            },
            warning: {
              DEFAULT: "rgb(255, 146, 48)", // dark orange
              foreground: "rgb(255, 255, 255)",
            },
            danger: {
              DEFAULT: "rgb(255, 66, 69)", // dark red
              foreground: "rgb(255, 255, 255)",
            },
            gray1: "rgb(7, 7, 7)",
            gray2: "rgb(27, 27, 27)",
            gray3: "rgb(47, 47, 47)",
            gray4: "rgb(67, 67, 67)",
            gray5: "rgb(87, 87, 87)",
            gray6: "rgb(107, 107, 107)",
            gray7: "rgb(142, 142, 142)",
            gray8: "rgb(170, 170, 170)",
            gray9: "rgb(190, 190, 190)",
            gray10: "rgb(210, 210, 210)",
            gray11: "rgb(228, 228, 228)",
            gray12: "rgb(248, 248, 248)",
          },
        },
      },
    }),
  ],
}
