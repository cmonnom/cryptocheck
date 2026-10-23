import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default [
  { ignores: ["dist/"] },
  js.configs.recommended,
  ...pluginVue.configs["flat/vue2-essential"],
  prettierRecommended,
  {
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "vue/multi-word-component-names": "off",
    },
  },
  {
    files: ["*.config.js"],
    languageOptions: { globals: { ...globals.node } },
  },
];
