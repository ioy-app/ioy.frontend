import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      optimize: {
        minify: true
      }
    })
  ],
  root: "./",
  build: {
    outDir: "./app/"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react-transition-group": "react-transition-group/esm"
    }
  },
  server: {
    port: 8080,
    host: '0.0.0.0',
    proxy: {
      "/api": {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
});