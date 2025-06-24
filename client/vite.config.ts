import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      ".replit.dev",
      ".janeway.replit.dev",
      "368c02d7-60d9-4733-beb8-89df43252c1f-00-227db4x03il5t.janeway.replit.dev"
    ],
  },
  css: {
    postcss: "./postcss.config.js",
  },
});