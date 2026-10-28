import type { IncomingMessage, ServerResponse } from "node:http";
import { handleInstagramMediaProxy } from "./instagram-media.js";
import { dispatch } from "./store.js";
import { handleTikTokMediaProxy } from "./tiktok-property.js";

type DispatchResult = {
  status: number;
  body?: unknown;
  redirect?: string;
};

function send(res: ServerResponse, status: number, payload: unknown) {
  if (res.writableEnded) return;
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function sendRedirect(res: ServerResponse, location: string, status = 302) {
  if (res.writableEnded) return;
  res.statusCode = status;
  res.setHeader("Location", location);
  res.setHeader("Cache-Control", "no-store");
  res.end();
}

async function readBody(req: IncomingMessage & { body?: unknown }) {
  const method = req.method ?? "GET";
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return "";
  if (typeof req.body === "string") return req.body.slice(0, 20_000);
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return JSON.stringify(req.body).slice(0, 20_000);
  }
  if (req.readableEnded || req.complete) return "";

  return await new Promise<string>((resolve) => {
    const chunks: Buffer[] = [];
    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      resolve(Buffer.concat(chunks).toString("utf8"));
    };
    const timer = setTimeout(done, 2000);
    req.on("data", (chunk) => {
      const block = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      if (chunks.reduce((sum, item) => sum + item.length, 0) + block.length <= 20_000) {
        chunks.push(block);
      }
    });
    req.on("end", () => {
      clearTimeout(timer);
      done();
    });
    req.on("error", () => {
      clearTimeout(timer);
      done();
    });
  });
}

function parseBody(text: string) {
  if (!text) return {};
  try {
    const value = JSON.parse(text) as unknown;
    if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  } catch {
    /* Invalid JSON is an empty command. */
  }
  return {};
}

function queryBody(req: IncomingMessage) {
  try {
    const host = req.headers.host || "localhost";
    const url = new URL(req.url || "/", `http://${host}`);
    return Object.fromEntries(url.searchParams.entries()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function handleNode(req: IncomingMessage & { body?: unknown }, res: ServerResponse, pathname: string) {
  try {
    if (await handleTikTokMediaProxy(req, res, pathname)) return;
    if (await handleInstagramMediaProxy(req, res, pathname)) return;

    const method = req.method ?? "GET";
    const result = (await dispatch({
      method,
      pathname,
      headers: req.headers,
      body: method === "GET" || method === "HEAD" ? queryBody(req) : parseBody(await readBody(req)),
    })) as DispatchResult;
    if (result.redirect) {
      sendRedirect(res, result.redirect, result.status || 302);
      return;
    }
    send(res, result.status, result.body);
  } catch {
    send(res, 500, { ok: false, error: "storage" });
  }
}
