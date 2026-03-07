import js from "@eslint/js";
import globals from "globals";
import eslint from '@eslint/js';
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		plugins: { js },
		extends: [
      "js/recommended"
    ],
		rules: {
			"no-console": "warn",
			"semi": "error",
      "no-unused-expressions": "error"
		},
		languageOptions: {
			globals: globals.browser,
		},
	},
  eslint.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
]);
