import type { IncomingMessage, ServerResponse } from "node:http";
import { handleNode } from "../server/http.js";

// Carousel uploads need headroom (FB album + IG container processing).
export const config = { maxDuration: 60 };

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await handleNode(req, res, "/api/social");
}
