import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@src": resolve(__dirname, "src"),
    },
  },
  server: {
    port: Number(process.env.PORT) || 8080,
    open: true,
  },
});
