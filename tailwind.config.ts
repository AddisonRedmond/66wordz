import { type Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        custom: {
          primary: "#9462C6",
          secondary: "#B987EB",
          accent: "#9D4BEF",
          match: "#219C90",
          "partial-match": "#FFD23F",
          "no-match": "#686D76",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // ...
  ],
} satisfies Config;
