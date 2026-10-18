/**
 * Turn a property record into a TikTok photo post.
 *
 * Why the proxy:
 *   TikTok PULL_FROM_URL requires verified domain/prefix. Listing images live on
 *   mmproperty.inmoenter.com, so we re-serve them via https://<BASE_URL>/media/tiktok/...
 *   Verify that prefix in TikTok → URL properties.
 *
 * Env: BASE_URL, MEDIA_PROXY_SECRET (falls back to TIKTOK_CLIENT_SECRET)
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { SocialConfig } from "./social.js";
import { publishTikTokPhotos } from "./tiktok.js";

const PROXY_PATH = "/media/tiktok";
const PROXY_HOST_ALLOWLIST = ["mmproperty.inmoenter.com", "mmproperty.io", "www.mmproperty.io"];
const DEFAULT_PHOTO_COUNT = 10;

const SKIPPED_LABELS = ["house plan", "plano", "plan"];
const LABEL_PRIORITY = [
  "facade",
  "pool",
  "terrace",
  "living room",
  "kitchen",
  "dining room",
  "bedroom",
  "bathroom",
  "common area",
];

export type PropertyImage = {
  url: string;
  label?: string;
  labels?: Record<string, string>;
};

/** Accepts both feed-shaped and app-normalized property records. */
export type PropertyLike = {
  id?: string | number;
  ref?: string;
  title?: string;
  titles?: Record<string, string>;
  type?: string;
  operation?: string;
  price?: number;
  currency?: string;
  priceLabel?: string;
  beds?: number;
  baths?: number;
  builtArea?: number;
  built?: number;
  terraceArea?: number;
  town?: string;
  city?: string;
  province?: string;
  country?: string;
  description?: string;
  descriptions?: Record<string, string>;
  url?: string;
  images?: PropertyImage[];
  image?: string;
  pool?: boolean;
  newBuild?: boolean;
  parkingSpaces?: number;
};

function publicOrigin(fallback = "https://mmproperty.io") {
  const base = (process.env.BASE_URL ?? "").trim().replace(/\/$/, "");
  return base || fallback;
}

function proxySecret() {
  return (
    (process.env.MEDIA_PROXY_SECRET ?? "").trim() ||
    (process.env.TIKTOK_CLIENT_SECRET ?? "").trim() ||
    (process.env.SESSION_SECRET ?? "").trim() ||
    "dev-only-insecure-secret"
  );
}

function signUrl(rawUrl: string) {
  return crypto.createHmac("sha256", proxySecret()).update(rawUrl).digest("hex").slice(0, 32);
}

export function tiktokPhotoProxyUrl(rawUrl: string) {
  const clean = rawUrl.trim();
  const encoded = Buffer.from(clean, "utf8").toString("base64url");
  return `${publicOrigin()}${PROXY_PATH}/${signUrl(clean)}/${encoded}.jpg`;
}

export function matchTikTokMediaPath(pathname: string) {
  const match = pathname.match(/^\/media\/tiktok\/([^/]+)\/(.+)$/);
  if (!match) return null;
  return { sig: match[1], payload: match[2] };
}

export async function handleTikTokMediaProxy(
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string,
): Promise<boolean> {
  const matched = matchTikTokMediaPath(pathname);
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

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) {
      res.statusCode = 415;
      res.end("Not an image");
      return true;
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.statusCode = 200;
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("Content-Length", String(buffer.length));
    if (req.method === "HEAD") {
      res.end();
      return true;
    }
    res.end(buffer);
    return true;
  } catch (caught) {
    console.error("[tiktok-proxy]", caught instanceof Error ? caught.message : caught);
    res.statusCode = 500;
    res.end("Proxy error");
    return true;
  }
}

function labelOf(image: PropertyImage) {
  return String(image.labels?.en || image.label || "").toLowerCase().trim();
}

export function selectPropertyPhotos(property: PropertyLike, limit = DEFAULT_PHOTO_COUNT) {
  let images = (property.images || []).filter(
    (image) => image?.url && !SKIPPED_LABELS.some((skip) => labelOf(image).includes(skip)),
  );
  if (!images.length && property.image) {
    images = [{ url: property.image, label: "Facade" }];
  }

  const ranked = [...images].sort((a, b) => {
    const rankA = LABEL_PRIORITY.indexOf(labelOf(a));
    const rankB = LABEL_PRIORITY.indexOf(labelOf(b));
    return (rankA === -1 ? 99 : rankA) - (rankB === -1 ? 99 : rankB);
  });

  return ranked.slice(0, Math.min(limit, 35)).map((image) => image.url);
}

function formatPrice(property: PropertyLike) {
  if (property.priceLabel) return property.priceLabel;
  const price = Number(property.price || 0);
  if (!price) return "";
  const currency = property.currency === "EUR" || !property.currency ? "€" : `${property.currency} `;
  return `${currency}${price.toLocaleString("en-GB")}`;
}

export function buildPropertyTitle(property: PropertyLike) {
  const beds = property.beds ? `${property.beds}-bed ` : "";
  const type = (property.type || "property").toLowerCase();
  const town = property.town || property.city || property.province || "Spain";
  const price = formatPrice(property);
  const base = `${beds}${type} in ${town}${price ? ` — ${price}` : ""}`;
  return base.slice(0, 90);
}

export function buildPropertyDescription(property: PropertyLike, lang = "en") {
  const price = formatPrice(property);
  const built = property.builtArea || property.built;
  const specs = [
    property.beds ? `${property.beds} bed` : "",
    property.baths ? `${property.baths} bath` : "",
    built ? `${built}m² built` : "",
    property.terraceArea ? `${property.terraceArea}m² terrace` : "",
    property.parkingSpaces ? `${property.parkingSpaces} parking` : "",
    property.pool ? "pool" : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const blurb = String(property.descriptions?.[lang] || property.description || "")
    .split("\n")[0]
    .trim()
    .slice(0, 300);

  const town = (property.town || property.city || "").replace(/\s+/g, "");
  const province = (property.province || "").replace(/\s+/g, "");
  const tags = [
    town ? `#${town}` : "",
    province ? `#${province}` : "",
    "#spain",
    "#costadelsol",
    "#property",
    "#realestate",
    property.newBuild ? "#newbuild" : "",
    "#propertyforsale",
  ].filter(Boolean);

  const ref = property.ref ? `Ref ${property.ref}` : "";

  return [price, specs, blurb, ref, tags.join(" ")].filter(Boolean).join("\n\n").slice(0, 4000);
}

export type PropertyPostOptions = {
  lang?: string;
  limit?: number;
  coverIndex?: number;
  privacyLevel?: string;
  draft?: boolean;
  autoAddMusic?: boolean;
  useProxy?: boolean;
  /** Override title/description with Admin caption when provided. */
  title?: string;
  description?: string;
};

export function buildPropertyPhotoPost(property: PropertyLike, options: PropertyPostOptions = {}) {
  const { lang = "en", limit = DEFAULT_PHOTO_COUNT, useProxy = true } = options;
  const sourceUrls = selectPropertyPhotos(property, limit);
  const photoUrls = useProxy ? sourceUrls.map(tiktokPhotoProxyUrl) : sourceUrls;

  return {
    photoUrls,
    title: (options.title || buildPropertyTitle(property)).slice(0, 90),
    description: (options.description || buildPropertyDescription(property, lang)).slice(0, 4000),
    coverIndex: options.coverIndex ?? 0,
    privacyLevel: options.privacyLevel,
    autoAddMusic: options.autoAddMusic !== false,
    draft: options.draft === true,
  };
}

export async function publishPropertyToTikTok(
  property: PropertyLike,
  config: SocialConfig,
  options: PropertyPostOptions = {},
) {
  const input = buildPropertyPhotoPost(property, options);
  if (!input.photoUrls.length) {
    return {
      ok: false,
      error: `Property ${property.ref || property.id} has no usable images.`,
      config,
    };
  }
  return publishTikTokPhotos(
    {
      photoUrls: input.photoUrls,
      title: input.title,
      description: input.description,
      message: input.description,
      coverIndex: input.coverIndex,
      privacyLevel: input.privacyLevel,
      autoAddMusic: input.autoAddMusic,
      draft: input.draft,
    },
    config,
  );
}

const here = path.dirname(fileURLToPath(import.meta.url));
const propertiesPath = path.resolve(here, "../public/Data/properties.json");

export async function loadPropertyById(id: string): Promise<PropertyLike | null> {
  try {
    const raw = await fs.readFile(propertiesPath, "utf8");
    const data = JSON.parse(raw) as { properties?: PropertyLike[] } | PropertyLike[];
    const list = Array.isArray(data) ? data : data.properties || [];
    const needle = String(id).trim();
    return (
      list.find((item) => String(item.id ?? "") === needle || String(item.ref ?? "") === needle) ||
      null
    );
  } catch (caught) {
    console.error("[tiktok-property] load failed:", caught instanceof Error ? caught.message : caught);
    return null;
  }
}
