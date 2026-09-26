import type { IncomingMessage, ServerResponse } from "node:http";
import { dispatch } from "./store.ts";

function send(res: ServerResponse, status: number, payload: unknown) {
  if (res.writableEnded) return;
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

async function readBody(req: IncomingMessage & { body?: unknown }) {
  if (typeof req.body === "string") return req.body.slice(0, 20_000);
  if (req.body && typeof req.body === "object") return JSON.stringify(req.body).slice(0, 20_000);

  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const block = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += block.length;
    if (size > 20_000) break;
    chunks.push(block);
  }
  return Buffer.concat(chunks).toString("utf8");
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
    send(res, 500, { ok: false });
  }
}
