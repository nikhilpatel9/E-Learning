import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
      "pdfjs-dist/build/pdf.worker.entry": "pdfjs-dist/build/pdf.worker.min.js",
    },
  },
 
});