import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import fs from "node:fs";
import type { IncomingHttpHeaders } from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

type Bucket = "visits.json" | "leads.json" | "settings.json" | "admin.json";
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
    for (const name of ["settings.json", "admin.json"] as const) {
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
