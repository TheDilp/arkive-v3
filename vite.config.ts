import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "@honkhonk/vite-plugin-svgr";
import htmlPurge from "vite-plugin-html-purgecss";
export default defineConfig({
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ["decorators-legacy", "classProperties"],
        },
      },
    }),
    svgr(),
  ],
});
