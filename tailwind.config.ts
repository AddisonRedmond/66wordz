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
          pink: "#f64db2",
          match: "#00DFA2",
          "partial-match": "#F6FA70",
          "no-match": "#545B77",
          green: "#059212",
          red: "#DF2E38",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // ...
  ],
} satisfies Config;
