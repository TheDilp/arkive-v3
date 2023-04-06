import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
    },
  },
  // define: {
  //   global: {},
  // },
  esbuild: {
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ["decorators-legacy", "classProperties"],
        },
      },
    }),
  ],
  build: {
    minify: true,
    rollupOptions: {
      output: {},
    },
  },
}));
