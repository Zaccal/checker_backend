import js from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import baseConfig from "@hono/eslint-config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { js, unusedImports },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.node },
  },
  tseslint.configs.recommended,
  baseConfig,
  {
    rules: {
      "no-console": "warn",
    },
  },
  {
    rules: {
      "no-console": "off",
    },
    files: ["./src/index.ts"],
  },
]);
