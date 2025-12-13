import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
    {
        ignores: ["dist/**", "node_modules/**", "coverage/**"]
    },
    {
        files: ["**/*.{js,mjs,cjs,ts}"]
    },
    {
        languageOptions: {
            globals: globals.node,
            ecmaVersion: 2022,
            sourceType: "module"
        }
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }],
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        }
    }
];
