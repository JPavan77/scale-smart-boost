import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/scale-smart-boost/" : "/",
  plugins: [react()],
  server: { host: true },
});
