import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  base: "/",
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ["color-functions", "global-builtin", "if-function", "import"]
      }
    }
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: false
  },
  server: {
    host: "127.0.0.1",
    port: 5173
  },
  preview: {
    host: "127.0.0.1",
    port: 4173
  }
});
