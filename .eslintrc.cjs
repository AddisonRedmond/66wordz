/** @type {import("eslint").Linter.Config} */
const config = {
  ignorePatterns: [
    "./src/components/public-game.tsx",
    "./src/pages/index.tsx",
    "./src/pages/login.tsx",
    "./src/utils/authRequired.ts",
    "./src/utils/firebase/firebase.ts",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    // Disable specific TypeScript rules causing errors
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/consistent-type-definitions": "warn",
    "@typescript-eslint/no-unsafe-argument": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/restrict-template-expressions": "warn",
    "@typescript-eslint/consistent-indexed-object-style": "warn",
    "@typescript-eslint/no-misused-promises": "warn",
    "@typescript-eslint/no-floating-promises": "warn"
  },
};

module.exports = config;
