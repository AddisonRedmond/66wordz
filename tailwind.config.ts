import { type Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#9462C6",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // ...
  ],
} satisfies Config;
