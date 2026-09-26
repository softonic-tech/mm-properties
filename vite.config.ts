import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import type { Connect } from "vite";
import { defineConfig, loadEnv } from "vite";
import { handleNode } from "./server/http.ts";
import { setEnvPassword } from "./server/store.ts";

const apiRoutes = new Set(["/api/visits", "/api/leads", "/api/admin"]);

function siteDataPlugin(): Connect.NextHandleFunction {
  return (req, res, next) => {
    const url = req.url?.split("?")[0] ?? "";
    if (!apiRoutes.has(url)) {
      next();
      return;
    }
    void handleNode(req as IncomingMessage, res as ServerResponse, url);
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, "");
  if (env.MONGODB_URI) process.env.MONGODB_URI = env.MONGODB_URI;
  setEnvPassword(env.ADMIN_PASSWORD || "mmproperty");

  return {
    server: {
      watch: {
        ignored: ["**/data/**"],
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "site-data",
        configureServer(server: { middlewares: Connect.Server }) {
          server.middlewares.use(siteDataPlugin());
        },
        configurePreviewServer(server: { middlewares: Connect.Server }) {
          server.middlewares.use(siteDataPlugin());
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
      },
    },
  };
});
