import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Connect } from "vite";
import { defineConfig, loadEnv } from "vite";
import path from "node:path";

const dataDir = path.resolve(import.meta.dirname, "data");
const leadsFile = path.join(dataDir, "leads.json");
const visitsFile = path.join(dataDir, "visits.json");

type Lead = { email: string; joinedAt: string };
type Visit = { id: string; at: string; locale: string };

function readJson<T>(file: string, fallback: T): T {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

function writeJson(file: string, value: unknown) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

function readBody(req: IncomingMessage) {
  return new Promise<string>((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(body));
  });
}

function send(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function siteDataPlugin(password: string): Connect.NextHandleFunction {
  return async (req, res, next) => {
    const url = req.url?.split("?")[0];

    if (url === "/api/leads" && req.method === "POST") {
      const email = String(JSON.parse((await readBody(req)) || "{}").email ?? "")
        .trim()
        .toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        send(res, 400, { ok: false });
        return;
      }
      const leads = readJson<Lead[]>(leadsFile, []).filter((lead) => lead.email !== email);
      leads.push({ email, joinedAt: new Date().toISOString() });
      writeJson(leadsFile, leads);
      send(res, 200, { ok: true });
      return;
    }

    if (url === "/api/visits" && req.method === "POST") {
      const locale = String(JSON.parse((await readBody(req)) || "{}").locale ?? "en");
      const visits = readJson<Visit[]>(visitsFile, []);
      visits.push({
        id: `${Date.now()}`,
        at: new Date().toISOString(),
        locale: locale === "en" ? "en" : "es",
      });
      writeJson(visitsFile, visits.slice(-500));
      send(res, 200, { ok: true });
      return;
    }

    if (url === "/api/admin" && req.method === "GET") {
      if (req.headers["x-admin-password"] !== password) {
        send(res, 401, { ok: false });
        return;
      }
      send(res, 200, {
        leads: readJson<Lead[]>(leadsFile, []).slice().reverse(),
        visits: readJson<Visit[]>(visitsFile, []).slice().reverse(),
      });
      return;
    }

    next();
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, "");
  const password = env.ADMIN_PASSWORD || "mmproperty";
  const plugin = {
    name: "site-data",
    configureServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use(siteDataPlugin(password));
    },
    configurePreviewServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use(siteDataPlugin(password));
    },
  };

  return {
    plugins: [react(), tailwindcss(), plugin],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
      },
    },
  };
});
