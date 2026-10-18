import type { IncomingMessage, ServerResponse } from "node:http";
import { handleNode } from "../server/http.js";

export const config = { maxDuration: 10 };

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await handleNode(req, res, "/api/instagram-deauthorize");
}
