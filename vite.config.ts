import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import type { Connect } from "vite";
import { defineConfig, loadEnv } from "vite";
import { handleNode } from "./server/http.ts";
import { setEnvPassword } from "./server/store.ts";

const apiRoutes = new Set([
  "/api/visits",
  "/api/leads",
  "/api/admin",
  "/api/social",
  "/api/facebook-callback",
  "/api/instagram-callback",
  "/api/instagram-deauthorize",
  "/api/instagram-data-deletion",
  "/api/tiktok-callback",
]);

function siteDataPlugin(): Connect.NextHandleFunction {
  return (req, res, next) => {
    const url = req.url?.split("?")[0] ?? "";
    // Proxy only signed image URLs: /media/tiktok/<sig>/<payload>.jpg
    // Leave verification files like /media/tiktok/tiktokXXXX.txt to Vite static (public/).
    const isTikTokImageProxy = /^\/media\/tiktok\/[^/]+\/.+\.(jpg|jpeg|png|webp)$/i.test(url);
    if (!apiRoutes.has(url) && !isTikTokImageProxy) {
      next();
      return;
    }
    void handleNode(req as IncomingMessage, res as ServerResponse, url);
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, "");
  const pass = (key: string) => {
    if (env[key]) process.env[key] = env[key];
  };
  pass("MONGODB_URI");
  pass("META_APP_ID");
  pass("META_APP_SECRET");
  pass("META_GRAPH_VERSION");
  pass("BASE_URL");
  pass("SESSION_SECRET");
  pass("ALLOWED_FACEBOOK_USER_ID");
  pass("META_LOGIN_CONFIG_ID");
  pass("FACEBOOK_APP_ID");
  pass("FACEBOOK_APP_SECRET");
  pass("FACEBOOK_PAGE_ID");
  pass("FACEBOOK_PAGE_ACCESS_TOKEN");
  pass("INSTAGRAM_APP_ID");
  pass("INSTAGRAM_APP_SECRET");
  pass("INSTAGRAM_REDIRECT_URI");
  pass("ALLOWED_INSTAGRAM_USER_ID");
  pass("TIKTOK_CLIENT_KEY");
  pass("TIKTOK_CLIENT_SECRET");
  pass("TIKTOK_REDIRECT_URI");
  pass("MEDIA_PROXY_SECRET");
  pass("OPENAI_API_KEY");
  pass("OPENAI_MODEL");
  setEnvPassword(env.ADMIN_PASSWORD || "mmproperty");

  return {
    server: {
      host: true,
      // Allow ngrok / tunnel hosts while testing Facebook OAuth locally.
      allowedHosts: [".ngrok-free.app", ".ngrok.io", ".ngrok.app", "localhost", "127.0.0.1"],
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
