import type { IncomingMessage, ServerResponse } from "node:http";
import { handleNode } from "../server/http.ts";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return handleNode(req, res, "/api/visits");
}
