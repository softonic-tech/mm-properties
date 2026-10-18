import type { IncomingMessage, ServerResponse } from "node:http";
import { handleTikTokMediaProxy } from "../server/tiktok-property.js";

export const config = { maxDuration: 30 };

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const host = req.headers.host || "localhost";
    const url = new URL(req.url || "/", `http://${host}`);
    const sig = url.searchParams.get("sig") || "";
    const payload = url.searchParams.get("payload") || "";
    const pathname = sig && payload ? `/media/tiktok/${sig}/${payload}` : url.pathname;
    const handled = await handleTikTokMediaProxy(req, res, pathname);
    if (!handled) {
      res.statusCode = 404;
      res.end("Not found");
    }
  } catch {
    res.statusCode = 500;
    res.end("Proxy error");
  }
}
