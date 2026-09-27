import type { IncomingMessage, ServerResponse } from "node:http";
import { dispatch } from "./store.js";

function send(res: ServerResponse, status: number, payload: unknown) {
  if (res.writableEnded) return;
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
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

export async function handleNode(req: IncomingMessage & { body?: unknown }, res: ServerResponse, pathname: string) {
  try {
    const result = await dispatch({
      method: req.method ?? "GET",
      pathname,
      headers: req.headers,
      body: parseBody(await readBody(req)),
    });
    send(res, result.status, result.body);
  } catch {
    send(res, 500, { ok: false, error: "storage" });
  }
}
