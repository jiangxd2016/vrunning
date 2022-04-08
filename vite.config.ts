import * as Path from "path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${Path.resolve(__dirname, "src")}/`,
    },
  },
  
  plugins: [
    Vue({
      reactivityTransform: true,
    }),
  ],
});
