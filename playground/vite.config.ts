import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: "playground",
  plugins: [react()],
  resolve: {
    alias: {
      "liquid-glass-fx/react": path.resolve(__dirname, "../src/react/index.ts"),
      "liquid-glass-fx": path.resolve(__dirname, "../src/index.ts"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});

