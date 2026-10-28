/**
 * Instagram feed/carousel needs aspect ratio between 4:5 and 1.91:1.
 * Listing photos are often taller or wider, so we re-serve a center-cropped
 * 1:1 JPEG via /media/instagram/<sig>/<payload>.jpg for Graph to fetch.
 */
import crypto from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import sharp from "sharp";

const PROXY_PATH = "/media/instagram";
const PROXY_HOST_ALLOWLIST = ["mmproperty.inmoenter.com", "mmproperty.io", "www.mmproperty.io"];
const OUTPUT_SIZE = 1080;

function publicOrigin(fallback = "https://mmproperty.io") {
  const base = (process.env.BASE_URL ?? "").trim().replace(/\/$/, "");
  // Instagram's crawler must reach a stable public host — skip dead/local tunnels.
  if (base && !/ngrok|localhost|127\.0\.0\.1/i.test(base)) return base;
  return fallback;
}

function proxySecret() {
  return (
    (process.env.MEDIA_PROXY_SECRET ?? "").trim() ||
    (process.env.SESSION_SECRET ?? "").trim() ||
    (process.env.META_APP_SECRET ?? "").trim() ||
    "dev-only-insecure-secret"
  );
}

function signUrl(rawUrl: string) {
  return crypto.createHmac("sha256", proxySecret()).update(`ig:${rawUrl}`).digest("hex").slice(0, 32);
}

export function instagramPhotoProxyUrl(rawUrl: string) {
  const clean = rawUrl.trim();
  if (!clean || clean.includes("/media/instagram/")) return clean;
  const encoded = Buffer.from(clean, "utf8").toString("base64url");
  return `${publicOrigin()}${PROXY_PATH}/${signUrl(clean)}/${encoded}.jpg`;
}

export function prepareInstagramImageUrls(urls: string[]) {
  return [...new Set(urls.map((url) => instagramPhotoProxyUrl(url)).filter((url) => /^https:\/\//i.test(url)))];
}

export function matchInstagramMediaPath(pathname: string) {
  const match = pathname.match(/^\/media\/instagram\/([^/]+)\/(.+)$/);
  if (!match) return null;
  return { sig: match[1], payload: match[2] };
}

export async function handleInstagramMediaProxy(
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string,
): Promise<boolean> {
  const matched = matchInstagramMediaPath(pathname);
  if (!matched || (req.method !== "GET" && req.method !== "HEAD")) return false;

  try {
    const payload = matched.payload.replace(/\.(jpg|jpeg|png|webp)$/i, "");
    const rawUrl = Buffer.from(payload, "base64url").toString("utf8");
    const expected = signUrl(rawUrl);
    const left = Buffer.from(matched.sig);
    const right = Buffer.from(expected);
    if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) {
      res.statusCode = 403;
      res.end("Bad signature");
      return true;
    }

    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:" || !PROXY_HOST_ALLOWLIST.includes(parsed.hostname)) {
      res.statusCode = 403;
      res.end("Host not allowed");
      return true;
    }

    const upstream = await fetch(rawUrl, { redirect: "follow" });
    if (!upstream.ok) {
      res.statusCode = 502;
      res.end("Upstream image unavailable");
      return true;
    }

    const contentType = upstream.headers.get("content-type") || "";
    if (contentType && !contentType.startsWith("image/")) {
      res.statusCode = 415;
      res.end("Not an image");
      return true;
    }

    const source = Buffer.from(await upstream.arrayBuffer());
    const cropped = await sharp(source)
      .rotate()
      .resize(OUTPUT_SIZE, OUTPUT_SIZE, { fit: "cover", position: "centre" })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();

    res.statusCode = 200;
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("Content-Length", String(cropped.length));
    if (req.method === "HEAD") {
      res.end();
      return true;
    }
    res.end(cropped);
    return true;
  } catch (caught) {
    console.error("[instagram-proxy]", caught instanceof Error ? caught.message : caught);
    res.statusCode = 500;
    res.end("Proxy error");
    return true;
  }
}
