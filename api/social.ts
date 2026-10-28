import type { IncomingMessage, ServerResponse } from "node:http";
import { handleNode } from "../server/http.js";

// Instagram carousel waits for each container — needs generous headroom.
export const config = { maxDuration: 120 };

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await handleNode(req, res, "/api/social");
}
