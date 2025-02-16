/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  // @ts-ignore
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    // Disable specific TypeScript rules causing errors
    "@typescript-eslint/require-await": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/no-unsafe-argument": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/restrict-template-expressions": "warn",
    "@typescript-eslint/consistent-indexed-object-style": "warn",
    "@typescript-eslint/no-misused-promises": "warn",
    "@typescript-eslint/no-floating-promises": "warn",
    "@typescript-eslint/no-redundant-type-constituents": "warn",
    "@typescript-eslint/non-nullable-type-assertion-style": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "warn",
  },
};

module.exports = config;
