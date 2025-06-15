import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  base: "/Certifications/aws-sysops-quiz/",
  build: {
    outDir: resolve(__dirname, "../docs/aws-sysops-quiz"),
    emptyOutDir: true
  },
  plugins: [react()]
});
