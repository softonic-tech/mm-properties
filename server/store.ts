import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import fs from "node:fs";
import type { IncomingHttpHeaders } from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildFacebookAuthUrl,
  buildInstagramAuthUrl,
  clearInstagramLogin,
  completeFacebookOAuth,
  completeInstagramOAuth,
  configFromManualToken,
  createOAuthState,
  facebookAppReady,
  facebookRedirectUri,
  generateSocialPost,
  instagramAppReady,
  instagramRedirectUri,
  parseSocialConfig,
  publishFacebook,
  publishInstagram,
  refreshInstagramTokenIfNeeded,
  selectFacebookPage,
  socialStatus,
  verifyOAuthState,
  type SocialConfig,
} from "./social.js";
import {
  buildTikTokAuthUrl,
  clearTikTokLogin,
  completeTikTokOAuth,
  getTikTokCreatorInfo,
  publishToTikTok,
  tiktokAppReady,
  tiktokRedirectUri,
  tiktokStatusFields,
} from "./tiktok.js";
import { loadPropertyById, publishPropertyToTikTok } from "./tiktok-property.js";

function socialPayload(config: SocialConfig) {
  return { ...socialStatus(config), ...tiktokStatusFields(config) };
}

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, "../data");
const tempDir = path.join(os.tmpdir(), "mm-admin");

type Locale = "en" | "es" | "nl" | "sv" | "de";

function asLocale(value: unknown): Locale {
  return value === "es" || value === "nl" || value === "sv" || value === "de" ? value : "en";
}

export type Visit = {
  id: string;
  at: string;
  locale: Locale;
  visitorId: string;
  path: string;
  referrer: string;
  source: string;
  landing: boolean;
  language: string;
  country: string;
  device: string;
  utm: string;
  bot: boolean;
};

export type Lead = {
  email: string;
  name: string;
  phone: string;
  note: string;
  joinedAt: string;
  path: string;
  source: string;
  locale: Locale;
};

export type Settings = {
  tracking: boolean;
  retain: number;
};

export type AdminPayload = {
  leads: Lead[];
  visits: Visit[];
  settings: Settings;
  storage: "atlas" | "file" | "blob" | "temporary";
};

type Bucket = "visits.json" | "leads.json" | "settings.json" | "admin.json" | "social.json";
type Stored = { _id?: string; [key: string]: unknown };
type MongoClient = import("mongodb").MongoClient;
type Db = import("mongodb").Db;

let envPassword = process.env.ADMIN_PASSWORD || "mmproperty";
let queue: Promise<unknown> = Promise.resolve();

export function setEnvPassword(password: string) {
  envPassword = password || "mmproperty";
}

function lock<T>(task: () => Promise<T>) {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function sameSecret(left: string, right: string) {
  const a = createHash("sha256").update(left).digest();
  const b = createHash("sha256").update(right).digest();
  return timingSafeEqual(a, b);
}

function blobOn() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function mongoUri() {
  return process.env.MONGODB_URI?.trim() ?? "";
}

type MongoGlobal = typeof globalThis & { __mmMongo?: Promise<MongoClient> };

async function mongoClient() {
  const uri = mongoUri();
  if (!uri) throw new Error("MONGODB_URI is not set");
  const { MongoClient } = await import("mongodb");
  const scope = globalThis as MongoGlobal;
  if (!scope.__mmMongo) {
    scope.__mmMongo = new MongoClient(uri, {
      maxPoolSize: 1,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    })
      .connect()
      .catch((error: unknown) => {
        scope.__mmMongo = undefined;
        throw error;
      });
  }
  return scope.__mmMongo;
}

function collectionName(name: Bucket) {
  if (name === "visits.json") return "visits";
  if (name === "leads.json") return "leads";
  if (name === "settings.json") return "settings";
  if (name === "social.json") return "social";
  return "admin";
}

function docs(database: Db, name: string) {
  return database.collection<Stored>(name);
}

function withoutId(doc: Stored) {
  const copy = { ...doc };
  delete copy._id;
  return copy;
}

let seeded: Promise<void> | null = null;

function ensureAtlas() {
  seeded ??= seedAtlas().catch((error: unknown) => {
    seeded = null;
    throw error;
  });
  return seeded;
}

async function seedAtlas() {
  const client = await mongoClient();
  const database = client.db();
  const meta = docs(database, "meta");
  const claim = await meta.updateOne(
    { _id: "seeded" },
    { $setOnInsert: { ready: false, at: new Date().toISOString() } },
    { upsert: true },
  );
  if (claim.upsertedCount === 0) {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const doc = await meta.findOne({ _id: "seeded" });
      if (doc?.ready === true) return;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    return;
  }

  try {
    for (const name of ["visits.json", "leads.json"] as const) {
      const collection = docs(database, collectionName(name));
      if ((await collection.countDocuments()) > 0) continue;
      const rows = parseList<Stored>(readText(localFile(name))).map(withoutId);
      if (rows.length > 0) await collection.insertMany(rows);
    }
    for (const name of ["settings.json", "admin.json", "social.json"] as const) {
      const collection = docs(database, collectionName(name));
      if (await collection.findOne({ _id: "current" })) continue;
      const text = readText(localFile(name));
      if (!text) continue;
      const value = JSON.parse(text) as Stored;
      delete value._id;
      await collection.insertOne({ _id: "current", ...value });
    }
    await meta.updateOne({ _id: "seeded" }, { $set: { ready: true } });
  } catch (error) {
    await meta.deleteOne({ _id: "seeded" });
    throw error;
  }
}

async function readAtlas(name: Bucket) {
  await ensureAtlas();
  const database = (await mongoClient()).db();
  const collection = docs(database, collectionName(name));
  if (name === "visits.json" || name === "leads.json") {
    const sortKey = name === "leads.json" ? "joinedAt" : "at";
    const docs = await collection.find({}).sort({ [sortKey]: 1 }).toArray();
    return JSON.stringify(docs.map(withoutId));
  }
  const doc = await collection.findOne({ _id: "current" });
  return doc ? JSON.stringify(withoutId(doc)) : null;
}

async function writeAtlas(name: Bucket, text: string) {
  await ensureAtlas();
  const client = await mongoClient();
  const collection = docs(client.db(), collectionName(name));
  if (name === "visits.json" || name === "leads.json") {
    const rows = parseList<Stored>(text).map(withoutId);
    await collection.deleteMany({});
    if (rows.length > 0) await collection.insertMany(rows);
    return;
  }
  const value = JSON.parse(text) as Stored;
  delete value._id;
  await collection.replaceOne({ _id: "current" }, { _id: "current", ...value }, { upsert: true });
}

function localFile(name: Bucket) {
  return path.join(dataDir, name);
}

function tempFile(name: Bucket) {
  return path.join(tempDir, name);
}

function readText(file: string) {
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf8");
}

function writeText(file: string, text: string) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temp, text);
  fs.renameSync(temp, file);
}

async function readBlob(name: Bucket) {
  const { get } = await import("@vercel/blob");
  const result = await get(`mm-admin/${name}`, { access: "private", useCache: false });
  if (!result) return null;
  if (result.statusCode !== 200 || !result.stream) throw new Error("Blob could not be read");
  return new Response(result.stream).text();
}

async function writeBlob(name: Bucket, text: string) {
  const { put } = await import("@vercel/blob");
  await put(`mm-admin/${name}`, text, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

export function storageMode(): AdminPayload["storage"] {
  if (mongoUri()) return "atlas";
  if (blobOn()) return "blob";
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.accessSync(dataDir, fs.constants.W_OK);
    return "file";
  } catch {
    return "temporary";
  }
}

async function readRaw(name: Bucket) {
  if (mongoUri()) return readAtlas(name);
  if (blobOn()) {
    const cloud = await readBlob(name);
    if (cloud !== null) return cloud;
    const seeded = readText(localFile(name));
    if (seeded !== null) {
      await writeBlob(name, seeded);
      return seeded;
    }
    return null;
  }
  return readText(localFile(name)) ?? readText(tempFile(name));
}

async function writeRaw(name: Bucket, text: string) {
  if (mongoUri()) {
    await writeAtlas(name, text);
    return;
  }
  if (blobOn()) {
    await writeBlob(name, text);
    return;
  }
  try {
    writeText(localFile(name), text);
  } catch {
    writeText(tempFile(name), text);
  }
}

function parseList<T>(text: string | null): T[] {
  if (!text) return [];
  try {
    const value = JSON.parse(text) as unknown;
    return Array.isArray(value) ? (value as T[]) : [];
  } catch {
    return [];
  }
}

async function readSettings(): Promise<Settings> {
  try {
    const text = await readRaw("settings.json");
    const value = text ? (JSON.parse(text) as Partial<Settings>) : {};
    const retain = Number(value.retain);
    return {
      tracking: value.tracking !== false,
      retain: Number.isFinite(retain) ? Math.min(20000, Math.max(100, Math.round(retain))) : 5000,
    };
  } catch {
    return { tracking: true, retain: 5000 };
  }
}

async function readSocial(): Promise<SocialConfig> {
  return parseSocialConfig(await readRaw("social.json"));
}

async function writeSocial(config: SocialConfig) {
  await writeRaw("social.json", JSON.stringify(config, null, 2));
}

function requestOrigin(headers: IncomingHttpHeaders) {
  const base = (process.env.BASE_URL ?? "").trim().replace(/\/$/, "");
  if (base) return base;
  const forwardedHost = header(headers, "x-forwarded-host");
  const host = forwardedHost || header(headers, "host") || "mmproperty.io";
  const proto =
    header(headers, "x-forwarded-proto") ||
    (host.includes("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host.split(",")[0]?.trim()}`;
}

function adminRedirect(origin: string, query: string) {
  return `${origin}/admin?${query}`;
}

async function readPassword() {
  const text = await readRaw("admin.json");
  if (!text) return envPassword;
  try {
    const saved = String((JSON.parse(text) as { password?: unknown }).password ?? "");
    if (saved.length >= 8) return saved;
  } catch {
    /* The environment password stays in use. */
  }
  return envPassword;
}

function header(headers: IncomingHttpHeaders, name: string) {
  const value = headers[name];
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

function clip(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f]/g, "")
    .trim()
    .slice(0, max);
}

function cleanPath(value: unknown) {
  const next = clip(value, 180).split("?")[0]?.split("#")[0] ?? "";
  if (!next.startsWith("/") || next.startsWith("//")) return "/";
  return /^\/[A-Za-z0-9/_-]*$/.test(next) ? next : "/";
}

function cleanReferrer(value: unknown) {
  const text = clip(value, 500);
  if (!text) return "";
  try {
    const url = new URL(text);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return `${url.origin}${url.pathname}`.slice(0, 300);
  } catch {
    return "";
  }
}

function labelSource(value: string) {
  const known: Record<string, string> = {
    google: "Google",
    bing: "Bing",
    instagram: "Instagram",
    facebook: "Facebook",
    meta: "Facebook",
    twitter: "X",
    x: "X",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    tiktok: "TikTok",
    pinterest: "Pinterest",
    duckduckgo: "DuckDuckGo",
    yahoo: "Yahoo",
    whatsapp: "WhatsApp",
    direct: "Direct",
  };
  const match = known[value.trim().toLowerCase()];
  if (match) return match;
  if (value.includes(".")) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function sourceFrom(referrer: string, utm: string) {
  const campaign = utm.split("/")[0]?.trim();
  if (campaign) return labelSource(campaign.slice(0, 48));
  if (!referrer) return "Direct";
  let host = "";
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "Direct";
  }
  if (
    !host ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "mmproperty.io" ||
    host.endsWith(".vercel.app")
  ) {
    return "Direct";
  }
  const named: [string, string][] = [
    ["google.", "Google"],
    ["bing.", "Bing"],
    ["instagram.", "Instagram"],
    ["facebook.", "Facebook"],
    ["fb.com", "Facebook"],
    ["t.co", "X"],
    ["twitter.", "X"],
    ["x.com", "X"],
    ["linkedin.", "LinkedIn"],
    ["youtube.", "YouTube"],
    ["tiktok.", "TikTok"],
    ["pinterest.", "Pinterest"],
    ["duckduckgo.", "DuckDuckGo"],
    ["yahoo.", "Yahoo"],
    ["whatsapp.", "WhatsApp"],
  ];
  for (const [needle, label] of named) {
    const match = needle.endsWith(".")
      ? host.includes(needle)
      : host === needle || host.endsWith(`.${needle}`);
    if (match) return label;
  }
  return host.slice(0, 48);
}

function deviceFrom(width: number, agent: string) {
  if (width >= 1024) return "Desktop";
  if (width >= 768) return "Tablet";
  if (width > 0) return "Phone";
  if (/ipad|tablet/i.test(agent)) return "Tablet";
  if (/mobi|iphone|android/i.test(agent)) return "Phone";
  return agent ? "Desktop" : "";
}

function isBot(agent: string) {
  return /bot|spider|crawl|slurp|facebookexternalhit|telegrambot|headless/i.test(agent);
}

function countryFrom(headers: IncomingHttpHeaders) {
  const code = (header(headers, "x-vercel-ip-country") || header(headers, "cf-ipcountry")).toUpperCase();
  return /^[A-Z]{2}$/.test(code) && code !== "XX" ? code : "";
}

function normalizeVisit(raw: Partial<Visit>): Visit {
  return {
    id: raw.id || randomUUID(),
    at: raw.at || new Date(0).toISOString(),
    locale: asLocale(raw.locale),
    visitorId: raw.visitorId || raw.id || "",
    path: raw.path || "",
    referrer: raw.referrer || "",
    source: raw.source || "",
    landing: raw.landing !== false,
    language: raw.language || "",
    country: raw.country || "",
    device: raw.device || "",
    utm: raw.utm || "",
    bot: raw.bot === true,
  };
}

function cleanName(value: unknown) {
  const name = clip(value, 80);
  if (name.length < 2) return "";
  return /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u.test(name) ? name : "";
}

function cleanPhone(value: unknown) {
  const phone = clip(value, 24).replace(/[^\d+() .-]/g, "");
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return "";
  return phone;
}

function normalizeLead(raw: Partial<Lead>): Lead | null {
  const email = String(raw.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return {
    email,
    name: raw.name || "",
    phone: raw.phone || "",
    note: raw.note || "",
    joinedAt: raw.joinedAt || new Date(0).toISOString(),
    path: raw.path || "",
    source: raw.source || "",
    locale: asLocale(raw.locale),
  };
}

async function payload(): Promise<AdminPayload> {
  const [leadRows, visitRows, settings] = await Promise.all([
    readRaw("leads.json"),
    readRaw("visits.json"),
    readSettings(),
  ]);
  const leads = parseList<Partial<Lead>>(leadRows)
    .map(normalizeLead)
    .filter((lead): lead is Lead => lead !== null)
    .reverse();
  const visits = parseList<Partial<Visit>>(visitRows).map(normalizeVisit).reverse();
  return { leads, visits, settings, storage: storageMode() };
}

function authorized(headers: IncomingHttpHeaders, password: string) {
  const given = header(headers, "x-admin-password");
  return given.length > 0 && sameSecret(given, password);
}

function json(status: number, body: unknown) {
  return { status, body };
}

async function recordVisit(headers: IncomingHttpHeaders, input: Record<string, unknown>) {
  const settings = await readSettings();
  if (!settings.tracking) return json(200, { ok: true });

  const pathName = cleanPath(input.path);
  if (pathName === "/admin") return json(200, { ok: true });

  const visitorId = /^[0-9a-f-]{16,40}$/i.test(clip(input.visitorId, 40))
    ? clip(input.visitorId, 40)
    : randomUUID();
  const referrer = cleanReferrer(input.referrer);
  const utm = clip(input.utm, 160);
  const agent = header(headers, "user-agent");
  const width = Math.max(0, Math.min(10000, Number(input.width) || 0));
  const visit: Visit = {
    id: randomUUID(),
    at: new Date().toISOString(),
    locale: asLocale(input.locale),
    visitorId,
    path: pathName,
    referrer,
    source: sourceFrom(referrer, utm),
    landing: input.landing === true,
    language: clip(input.language, 24),
    country: countryFrom(headers),
    device: deviceFrom(width, agent),
    utm,
    bot: isBot(agent),
  };

  const visits = parseList<Partial<Visit>>(await readRaw("visits.json"));
  const previous = visits.at(-1);
  const duplicate =
    previous?.visitorId === visit.visitorId &&
    previous.path === visit.path &&
    Math.abs(Date.now() - Date.parse(previous.at ?? "")) < 4000;
  if (!duplicate) {
    visits.push(visit);
    await writeRaw("visits.json", JSON.stringify(visits.slice(-settings.retain), null, 2));
  }
  return json(200, { ok: true });
}

async function recordLead(input: Record<string, unknown>) {
  const email = clip(input.email, 180).toLowerCase();
  const rawName = clip(input.name, 80);
  const rawPhone = clip(input.phone, 24);
  const name = rawName ? cleanName(input.name) : "";
  const phone = rawPhone ? cleanPhone(input.phone) : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { ok: false });
  if ((rawName && !name) || (rawPhone && !phone)) return json(400, { ok: false });
  const leads = parseList<Partial<Lead>>(await readRaw("leads.json"))
    .map(normalizeLead)
    .filter((lead): lead is Lead => lead !== null);
  const existing = leads.find((lead) => lead.email === email);
  const next = leads.filter((lead) => lead.email !== email);
  const referrer = cleanReferrer(input.referrer);
  const utm = clip(input.utm, 160);
  next.push({
    email,
    name: name || existing?.name || "",
    phone: phone || existing?.phone || "",
    note: clip(input.note, 400) || existing?.note || "",
    joinedAt: existing?.joinedAt ?? new Date().toISOString(),
    path: cleanPath(input.path),
    source: sourceFrom(referrer, utm),
    locale: asLocale(input.locale),
  });
  await writeRaw("leads.json", JSON.stringify(next, null, 2));
  return json(200, { ok: true });
}

async function updateAdmin(headers: IncomingHttpHeaders, input: Record<string, unknown>) {
  const password = await readPassword();
  if (!authorized(headers, password)) return json(401, { ok: false });
  const action = clip(input.action, 40);

  if (action === "delete-lead") {
    const email = clip(input.email, 180).toLowerCase();
    const leads = parseList<Partial<Lead>>(await readRaw("leads.json"))
      .map(normalizeLead)
      .filter((lead): lead is Lead => lead !== null && lead.email !== email);
    await writeRaw("leads.json", JSON.stringify(leads, null, 2));
  } else if (action === "delete-visit") {
    const id = clip(input.id, 80);
    const visits = parseList<Partial<Visit>>(await readRaw("visits.json")).filter((visit) => visit.id !== id);
    await writeRaw("visits.json", JSON.stringify(visits, null, 2));
  } else if (action === "clear-visits") {
    await writeRaw("visits.json", "[]");
  } else if (action === "save-settings") {
    const retain = Math.min(20000, Math.max(100, Math.round(Number(input.retain) || 5000)));
    const settings: Settings = { tracking: input.tracking !== false, retain };
    await writeRaw("settings.json", JSON.stringify(settings, null, 2));
    const visits = parseList<Partial<Visit>>(await readRaw("visits.json")).slice(-retain);
    await writeRaw("visits.json", JSON.stringify(visits, null, 2));
  } else if (action === "password") {
    const next = String(input.password ?? "");
    if (next.length < 8 || next.length > 100) return json(400, { ok: false });
    await writeRaw("admin.json", JSON.stringify({ password: next }, null, 2));
  } else {
    return json(400, { ok: false });
  }

  return json(200, await payload());
}

async function route(request: {
  method: string;
  pathname: string;
  headers: IncomingHttpHeaders;
  body: Record<string, unknown>;
}) {
  const { method, pathname, headers, body } = request;

  if (pathname === "/api/visits" && method === "POST") return recordVisit(headers, body);
  if (pathname === "/api/leads" && method === "POST") return recordLead(body);

  if (pathname === "/api/admin" && method === "GET") {
    const password = await readPassword();
    if (!authorized(headers, password)) return json(401, { ok: false });
    return json(200, await payload());
  }

  if (pathname === "/api/admin" && method === "POST") return updateAdmin(headers, body);

  if (pathname === "/api/social" && method === "GET") {
    const password = await readPassword();
    if (!authorized(headers, password)) return json(401, { ok: false });
    return json(200, socialPayload(await readSocial()));
  }

  if (pathname === "/api/social" && method === "POST") {
    const password = await readPassword();
    if (!authorized(headers, password)) return json(401, { ok: false });
    const action = clip(body.action, 40);
    const origin = requestOrigin(headers);

    if (action === "facebook-connect") {
      if (!facebookAppReady()) {
        return json(400, {
          ok: false,
          error: "Set META_APP_ID and META_APP_SECRET (or FACEBOOK_APP_ID / FACEBOOK_APP_SECRET) first.",
          redirectUri: facebookRedirectUri(origin),
        });
      }
      const state = createOAuthState();
      return json(200, {
        ok: true,
        url: buildFacebookAuthUrl(origin, state),
        redirectUri: facebookRedirectUri(origin),
      });
    }

    if (action === "facebook-select-page") {
      const next = selectFacebookPage(await readSocial(), clip(body.pageId, 80));
      if (!next) return json(400, { ok: false, error: "That Facebook Page was not found." });
      await writeSocial(next);
      return json(200, socialPayload(next));
    }

    if (action === "facebook-disconnect") {
      const current = await readSocial();
      const next = {
        ...current,
        pageId: "",
        pageName: "",
        pageToken: "",
        pages: [],
        connectedAt: "",
        lastError: "",
        facebookUserId: "",
      };
      await writeSocial(next);
      return json(200, socialPayload(next));
    }

    if (action === "facebook-save-token") {
      try {
        const current = await readSocial();
        const next = {
          ...current,
          ...configFromManualToken({
            pageId: clip(body.pageId, 40),
            pageToken: clip(body.pageToken, 4000),
            pageName: clip(body.pageName, 120),
          }),
        };
        await writeSocial(next);
        console.log("[facebook] manual page token saved", next.pageId, next.pageName);
        return json(200, socialPayload(next));
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : "Could not save token.";
        return json(400, { ok: false, error: message });
      }
    }

    if (action === "instagram-connect") {
      if (!instagramAppReady()) {
        return json(400, {
          ok: false,
          error: "Set INSTAGRAM_APP_ID and INSTAGRAM_APP_SECRET first.",
          redirectUri: instagramRedirectUri(origin),
        });
      }
      const state = createOAuthState();
      const redirectUri = instagramRedirectUri(origin);
      const url = buildInstagramAuthUrl(origin, state);
      console.log("[instagram-connect] redirect_uri =>", redirectUri);
      console.log("[instagram-connect] authorize url =>", url);
      return json(200, {
        ok: true,
        url,
        redirectUri,
      });
    }

    if (action === "instagram-disconnect") {
      const next = clearInstagramLogin(await readSocial());
      await writeSocial(next);
      return json(200, socialPayload(next));
    }

    if (action === "tiktok-connect") {
      if (!tiktokAppReady()) {
        return json(400, {
          ok: false,
          error: "Set TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET first.",
          redirectUri: tiktokRedirectUri(origin),
        });
      }
      const state = createOAuthState();
      const redirectUri = tiktokRedirectUri(origin);
      const url = buildTikTokAuthUrl(origin, state);
      console.log("[tiktok-connect] redirect_uri =>", redirectUri);
      return json(200, { ok: true, url, redirectUri });
    }

    if (action === "tiktok-disconnect") {
      const next = clearTikTokLogin(await readSocial());
      await writeSocial(next);
      return json(200, socialPayload(next));
    }

    if (action === "tiktok-creator-info") {
      try {
        const result = await getTikTokCreatorInfo(await readSocial());
        if (result.config) await writeSocial(result.config);
        return json(result.ok ? 200 : 400, { ...result, ...socialPayload(await readSocial()) });
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : "TikTok creator info failed.";
        return json(400, { ok: false, error: message });
      }
    }

    if (action === "generate") {
      try {
        return json(200, await generateSocialPost(body));
      } catch {
        return json(500, { ok: false, error: "Could not generate the post." });
      }
    }

    if (action === "publish-facebook") {
      try {
        const result = await publishFacebook(body, await readSocial());
        return json(result.ok ? 200 : 400, result);
      } catch {
        return json(500, { ok: false, error: "Facebook publish failed." });
      }
    }

    if (action === "publish-instagram") {
      try {
        let config = await readSocial();
        config = await refreshInstagramTokenIfNeeded(config);
        await writeSocial(config);
        const result = await publishInstagram(body, config);
        return json(result.ok ? 200 : 400, result);
      } catch {
        return json(500, { ok: false, error: "Instagram publish failed." });
      }
    }

    if (action === "publish-now") {
      try {
        let config = await readSocial();
        config = await refreshInstagramTokenIfNeeded(config);
        await writeSocial(config);
        const message = String(body.message ?? "").trim();
        const image = String(body.image ?? "").trim();
        const link = String(body.link ?? "").trim();
        const withPhoto = body.withPhoto !== false;
        const wantFb = body.facebook !== false;
        const wantIg = body.instagram !== false;
        const results: Record<string, unknown> = { ok: true };
        if (wantFb) {
          const fb = await publishFacebook({ message, image, link, withPhoto }, config);
          results.facebook = fb;
          if (!fb.ok) results.ok = false;
        }
        if (wantIg) {
          const ig = await publishInstagram({ message, image }, config);
          results.instagram = ig;
          if (!ig.ok) results.ok = false;
        }
        return json(results.ok ? 200 : 400, { ...results, ...socialPayload(config) });
      } catch {
        return json(500, { ok: false, error: "Publish failed." });
      }
    }

    if (action === "publish-tiktok") {
      try {
        const config = await readSocial();
        const propertyId = clip(body.propertyId, 40);
        const message = String(body.message ?? "").trim();
        const title = String(body.title ?? "").trim();
        const draft = body.draft === true;
        const privacyLevel = clip(body.privacyLevel, 60);

        let result: Record<string, unknown>;
        if (propertyId) {
          const property = await loadPropertyById(propertyId);
          if (!property) {
            return json(400, { ok: false, error: `Property ${propertyId} was not found.` });
          }
          result = await publishPropertyToTikTok(property, config, {
            lang: clip(body.locale || body.lang, 8) || "en",
            privacyLevel,
            draft,
            title: title || undefined,
            description: message || undefined,
            useProxy: body.useProxy !== false,
            limit: Number(body.limit) > 0 ? Number(body.limit) : 10,
          });
        } else {
          result = await publishToTikTok(body, config);
        }

        if (result.config) await writeSocial(result.config as SocialConfig);
        const { config: _saved, ...payload } = result;
        return json(result.ok ? 200 : 400, payload);
      } catch {
        return json(500, { ok: false, error: "TikTok publish failed." });
      }
    }

    return json(400, { ok: false, error: "Unknown social action." });
  }

  if (pathname === "/api/facebook-callback" && (method === "GET" || method === "POST")) {
    const origin = requestOrigin(headers);
    console.log("[facebook] callback", {
      method,
      origin,
      redirectUri: facebookRedirectUri(origin),
      hasCode: Boolean(body.code),
      hasError: Boolean(body.error || body.error_description),
    });

    const fail = async (message: string) => {
      console.error("[facebook] callback failed:", message);
      const current = await readSocial();
      await writeSocial({ ...current, lastError: message });
      if (method === "POST") return json(400, { ok: false, error: message });
      return {
        status: 302,
        redirect: adminRedirect(origin, `fb=error&tab=social&msg=${encodeURIComponent(message)}`),
      };
    };

    const error = clip(body.error_description || body.error, 300);
    if (error) return fail(error);

    const state = clip(body.state, 400);
    const code = clip(body.code, 4000);
    if (!verifyOAuthState(state)) return fail("Invalid or expired login state. Click Connect Facebook again.");
    if (!code) return fail("Missing Facebook code. Open Admin via your ngrok HTTPS URL, then Connect again.");

    try {
      const current = await readSocial();
      const facebook = await completeFacebookOAuth(code, origin);
      const config = { ...current, ...facebook };
      await writeSocial(config);
      const saved = await readSocial();
      if (!saved.pageToken) return fail("Token was not saved to storage.");
      console.log("[facebook] connected", saved.pageId, saved.pageName);
      if (method === "POST") {
        return json(200, {
          ok: true,
          pageId: saved.pageId,
          pageName: saved.pageName,
        });
      }
      const msg = encodeURIComponent(`Connected ${saved.pageName || "Facebook Page"}`);
      return { status: 302, redirect: adminRedirect(origin, `fb=connected&tab=social&msg=${msg}`) };
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Facebook connect failed";
      return fail(message);
    }
  }

  if (pathname === "/api/instagram-deauthorize" && method === "POST") {
    console.log("[instagram] deauthorize callback received");
    return json(200, { ok: true });
  }

  if (pathname === "/api/instagram-data-deletion" && (method === "GET" || method === "POST")) {
    const origin = requestOrigin(headers);
    const code = randomUUID().replace(/-/g, "").slice(0, 16);
    console.log("[instagram] data deletion callback", code);
    return json(200, {
      url: `${origin}/admin?ig=data-deletion&code=${code}`,
      confirmation_code: code,
    });
  }

  if (pathname === "/api/instagram-callback" && (method === "GET" || method === "POST")) {
    const origin = requestOrigin(headers);
    console.log("[instagram] callback", {
      method,
      origin,
      redirectUri: instagramRedirectUri(origin),
      hasCode: Boolean(body.code),
      hasError: Boolean(body.error || body.error_description || body.error_reason),
    });

    const fail = async (message: string) => {
      console.error("[instagram] callback failed:", message);
      const current = await readSocial();
      await writeSocial({ ...current, instagramLastError: message });
      if (method === "POST") return json(400, { ok: false, error: message });
      return {
        status: 302,
        redirect: adminRedirect(origin, `ig=error&tab=social&msg=${encodeURIComponent(message)}`),
      };
    };

    const error = clip(body.error_description || body.error_reason || body.error, 300);
    if (error) return fail(error);

    const state = clip(body.state, 400);
    const code = clip(body.code, 4000);
    if (!verifyOAuthState(state)) return fail("Invalid or expired login state. Click Connect Instagram again.");
    if (!code) return fail("Missing Instagram code. Open Admin via your ngrok HTTPS URL, then Connect again.");

    try {
      const config = await completeInstagramOAuth(code, origin, await readSocial());
      await writeSocial(config);
      const saved = await readSocial();
      if (!saved.instagramToken) return fail("Instagram token was not saved to storage.");
      console.log("[instagram] connected", saved.instagramUserId, saved.instagramUsername);
      if (method === "POST") {
        return json(200, {
          ok: true,
          userId: saved.instagramUserId,
          username: saved.instagramUsername,
        });
      }
      const msg = encodeURIComponent(
        saved.instagramUsername ? `Connected @${saved.instagramUsername}` : "Instagram connected",
      );
      return { status: 302, redirect: adminRedirect(origin, `ig=connected&tab=social&msg=${msg}`) };
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Instagram connect failed";
      return fail(message);
    }
  }

  if (pathname === "/api/tiktok-callback" && (method === "GET" || method === "POST")) {
    const origin = requestOrigin(headers);
    console.log("[tiktok] callback", {
      method,
      origin,
      redirectUri: tiktokRedirectUri(origin),
      hasCode: Boolean(body.code),
      hasError: Boolean(body.error || body.error_description),
    });

    const fail = async (message: string) => {
      console.error("[tiktok] callback failed:", message);
      const current = await readSocial();
      await writeSocial({ ...current, tiktokLastError: message });
      if (method === "POST") return json(400, { ok: false, error: message });
      return {
        status: 302,
        redirect: adminRedirect(origin, `tt=error&tab=social&msg=${encodeURIComponent(message)}`),
      };
    };

    const error = clip(body.error_description || body.error, 300);
    if (error) return fail(error);

    const state = clip(body.state, 400);
    const code = clip(body.code, 4000);
    if (!verifyOAuthState(state)) return fail("Invalid or expired login state. Click Connect TikTok again.");
    if (!code) return fail("Missing TikTok code. Open Admin via your ngrok HTTPS URL, then Connect again.");

    try {
      const config = await completeTikTokOAuth(code, origin, await readSocial());
      await writeSocial(config);
      const saved = await readSocial();
      if (!saved.tiktokAccessToken) return fail("TikTok token was not saved to storage.");
      console.log("[tiktok] connected", saved.tiktokOpenId, saved.tiktokUsername);
      if (method === "POST") {
        return json(200, {
          ok: true,
          openId: saved.tiktokOpenId,
          username: saved.tiktokUsername,
        });
      }
      const msg = encodeURIComponent(
        saved.tiktokUsername ? `Connected @${saved.tiktokUsername}` : "TikTok connected",
      );
      return { status: 302, redirect: adminRedirect(origin, `tt=connected&tab=social&msg=${msg}`) };
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "TikTok connect failed";
      return fail(message);
    }
  }

  return json(404, { ok: false });
}

export function dispatch(request: {
  method: string;
  pathname: string;
  headers: IncomingHttpHeaders;
  body: Record<string, unknown>;
}) {
  return lock(() => route(request));
}
