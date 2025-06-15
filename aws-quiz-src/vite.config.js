import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  base: "/Certifications/aws-quiz/",
  build: {
    outDir: resolve(__dirname, "../docs/aws-quiz"),
    emptyOutDir: true
  },
  plugins: [react()]
});
