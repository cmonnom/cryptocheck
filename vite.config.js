import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";

export default defineConfig({
  plugins: [vue()],
  base: "./",
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      // Vuetify's prebuilt bundle require()s "vue", which would otherwise pull
      // in Vue's CommonJS build alongside the ESM one (two Vue instances).
      { find: /^vue$/, replacement: "vue/dist/vue.runtime.esm.js" },
    ],
  },
});
