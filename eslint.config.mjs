import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

// File / function size limits for the app codebase.
const sizeLimits = {
  "max-lines": ["error", { max: 250, skipBlankLines: true, skipComments: true }],
  "max-lines-per-function": [
    "error",
    { max: 50, skipBlankLines: true, skipComments: true, IIFEs: true },
  ],
  complexity: ["error", 10],
  "max-params": ["error", 3],
  "max-depth": ["error", 3],
};

const hexColour = "/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b/";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  prettier,
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "coverage/**",
    "mockups/**",
    "next-env.d.ts",
    "src/types/database.ts",
  ]),
  {
    rules: {
      ...sizeLimits,
      "no-console": "error",
      eqeqeq: ["error", "always"],
      "prefer-const": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              // Allow `@/features/<name>/server` so client barrels stay free of server-only code.
              group: ["@/features/*/*", "!@/features/*/server"],
              message:
                "Import other features through their index.ts (e.g. '@/features/league'), or '@/features/<name>/server' for server-only exports.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/theme/**", "src/config/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: `Literal[value=${hexColour}]`,
          message: "Use a theme token from src/theme instead of a hex colour.",
        },
        {
          selector: `TemplateElement[value.raw=${hexColour}]`,
          message: "Use a theme token from src/theme instead of a hex colour.",
        },
      ],
    },
  },
  {
    files: ["src/**/components/**/*.tsx", "src/ui/**/*.tsx"],
    rules: {
      "max-lines": ["error", { max: 200, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "tests/**"],
    rules: {
      "max-lines-per-function": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    files: ["src/lib/logger.ts", "scripts/**"],
    rules: { "no-console": "off" },
  },
]);
