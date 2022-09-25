import viteCompression from "vite-plugin-compression";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ["decorators-legacy", "classProperties"],
        },
      },
    }),
    viteCompression(),
  ],
  build: {
    minify: true,
    rollupOptions: {
      output: {},
    },
  },
});
