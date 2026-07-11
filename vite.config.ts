import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type ProxyOptions } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const upstream = {
    target: env.VITE_IMMICH_SERVER_URL || "http://immich-server:2283/",
    secure: true,
    changeOrigin: true,
    logLevel: "info",
    ws: true,
  };

  const proxy: Record<string, string | ProxyOptions> = {
    "/api": upstream,
  };

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy,
      allowedHosts: true,
    },
  };
});
