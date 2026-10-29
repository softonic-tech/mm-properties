/**
 * Facebook Page posting + Instagram Login posting, OAuth, and AI caption helpers.
 * Facebook: META_APP_ID / META_APP_SECRET (or FACEBOOK_*), Page token in social.json.
 * Instagram: INSTAGRAM_APP_ID / INSTAGRAM_APP_SECRET (API setup with Instagram login).
 * Instagram uses its own OAuth + graph.instagram.com — no Facebook Page link required.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { prepareInstagramImageUrls } from "./instagram-media.js";

export type SocialTopic = {
  id: string;
  label: string;
  title: string;
  meta: string;
  area: string;
  image: string;
  href: string;
};

export type FacebookPage = {
  id: string;
  name: string;
  accessToken: string;
};

export type SocialConfig = {
  pageId: string;
  pageName: string;
  pageToken: string;
  pages: FacebookPage[];
  connectedAt: string;
  lastError?: string;
  facebookUserId?: string;
  /** Instagram Login (separate from Facebook Page). */
  instagramUserId?: string;
  instagramUsername?: string;
  instagramToken?: string;
  instagramTokenExpiresAt?: string;
  instagramConnectedAt?: string;
  instagramLastError?: string;
  /** TikTok Login Kit + Content Posting. */
  tiktokOpenId?: string;
  tiktokUsername?: string;
  tiktokAccessToken?: string;
  tiktokRefreshToken?: string;
  tiktokTokenExpiresAt?: string;
  tiktokScope?: string;
  tiktokConnectedAt?: string;
  tiktokLastError?: string;
};

function allowedIds(...envNames: string[]) {
  return envNames
    .flatMap((name) => env(name).split(","))
    .map((id) => id.trim())
    .filter(Boolean);
}

const SITE = "https://mmproperty.io";
/** Listing page includes the contact sidebar (call / WhatsApp / inquiry) — preferred CTA target. */
const CONTACT_URL = `${SITE}/contact`;
const WHATSAPP_URL = "https://wa.me/34653223015";
// business_management is required for /me/accounts once a Page is linked to a Meta Business portfolio.
const SCOPES = [
  "public_profile",
  "pages_show_list",
  "pages_read_engagement",
  "pages_manage_posts",
  "business_management",
].join(",");
const IG_SCOPES = [
  "instagram_business_basic",
  "instagram_business_content_publish",
  "instagram_business_manage_comments",
  "instagram_business_manage_messages",
  "instagram_business_manage_insights",
].join(",");

const topics: SocialTopic[] = [
  {
    id: "higueron",
    label: "El Higuerón apartment",
    title: "Flat for sale in El Higuerón (Fuengirola)",
    meta: "116 m² · 2 bed · 495.000 €",
    area: "Fuengirola",
    image: `${SITE}/listings/higueron.jpg`,
    href: `${SITE}/homes`,
  },
  {
    id: "fuengirola",
    label: "Fuengirola apartment",
    title: "Flat for sale in Fuengirola",
    meta: "123 m² · 3 bed · 1.051.500 €",
    area: "Fuengirola",
    image: `${SITE}/listings/fuengirola.jpg`,
    href: `${SITE}/homes`,
  },
  {
    id: "mijas-pueblo",
    label: "Mijas Pueblo villa",
    title: "Villa for sale in Mijas Pueblo",
    meta: "4 bed · 1.965.000 €",
    area: "Mijas",
    image: `${SITE}/listings/mijas-pueblo.jpg`,
    href: `${SITE}/homes`,
  },
  {
    id: "monteros",
    label: "Alto de los Monteros",
    title: "Flat for sale in Alto de los Monteros",
    meta: "125 m² · 3 bed · 835.000 €",
    area: "Marbella",
    image: `${SITE}/listings/monteros.jpg`,
    href: `${SITE}/homes`,
  },
  {
    id: "monteros-two",
    label: "Monteros 2-bed",
    title: "Flat for sale in Alto de los Monteros",
    meta: "98 m² · 2 bed · 530.000 €",
    area: "Marbella",
    image: `${SITE}/listings/monteros-2.jpg`,
    href: `${SITE}/homes`,
  },
  {
    id: "mijas-aguila",
    label: "Cerrado del Águila",
    title: "Flat for sale in Cerrado del Águila",
    meta: "117 m² · 3 bed · 425.000 €",
    area: "Mijas",
    image: `${SITE}/listings/mijas-aguila.jpg`,
    href: `${SITE}/homes`,
  },
  {
    id: "general",
    label: "General Costa del Sol",
    title: "Homes for sale and rent on the Costa del Sol",
    meta: "Apartments, villas and new builds · Benalmádena office",
    area: "Costa del Sol",
    image: `${SITE}/media/costa-marbella.jpg`,
    href: `${SITE}/homes`,
  },
];

/** Strip trailing punctuation Instagram may include in tappable URL ranges. */
function cleanCaptionUrls(text: string) {
  return text.replace(/(https?:\/\/[^\s<]+?)([),.!?;:]+)(?=\s|$)/g, "$1");
}

/**
 * Keep Instagram/Facebook captions on mmproperty.io (not .es).
 * Listing URL = property page with contact sidebar.
 * Talk CTA = WhatsApp so “Talk with M&M Property” opens a real chat (not a random web page).
 */
export function finalizeSocialCaption(message: string, listingLink = "") {
  const link = listingLink.trim();
  let text = cleanCaptionUrls(String(message ?? ""))
    .replace(/https?:\/\/(?:www\.)?mmproperty\.es\S*/gi, (url) => {
      if (/^https?:\/\/(?:www\.)?mmproperty\.es\/?(?:en\/?)?$/i.test(url)) return `${SITE}/`;
      if (link && /^https:\/\//i.test(link)) return link;
      return CONTACT_URL;
    })
    // Old captions pointed “Talk with…” at /contact — swap to WhatsApp chat.
    .replace(
      /((?:Talk with|Talk to|Habla con|Kontakt zu|Neem contact op met|Kontakta)\s+M&M Property[:\s]*)(https?:\/\/mmproperty\.io\/contact\/?)/gi,
      `$1${WHATSAPP_URL}`,
    )
    .trim();

  if (link && /^https:\/\//i.test(link) && !text.includes(link)) {
    text = `${text}\n\n${link}`.trim();
  }
  if (!text.includes(WHATSAPP_URL) && !/wa\.me\/34653223015/i.test(text)) {
    text = `${text}\n\nTalk with M&M Property: ${WHATSAPP_URL}`.trim();
  }
  return cleanCaptionUrls(text);
}

function env(name: string) {
  return (process.env[name] ?? "").trim();
}

function envAny(...names: string[]) {
  for (const name of names) {
    const value = env(name);
    if (value) return value;
  }
  return "";
}

function appId() {
  return envAny("META_APP_ID", "FACEBOOK_APP_ID");
}

function appSecret() {
  return envAny("META_APP_SECRET", "FACEBOOK_APP_SECRET");
}

function graphVersion() {
  const raw = envAny("META_GRAPH_VERSION", "FACEBOOK_GRAPH_VERSION") || "v26.0";
  return raw.startsWith("v") ? raw : `v${raw}`;
}

function graphBase() {
  return `https://graph.facebook.com/${graphVersion()}`;
}

function igGraphBase() {
  return `https://graph.instagram.com/${graphVersion()}`;
}

function dialogBase() {
  return `https://www.facebook.com/${graphVersion()}/dialog/oauth`;
}

function instagramAppId() {
  return envAny("INSTAGRAM_APP_ID", "IG_APP_ID");
}

function instagramAppSecret() {
  return envAny("INSTAGRAM_APP_SECRET", "IG_APP_SECRET");
}

/** Prefer BASE_URL (ngrok / production) so redirect_uri always matches Meta settings. */
export function publicOrigin(fallback = SITE) {
  const base = env("BASE_URL").replace(/\/$/, "");
  return base || fallback.replace(/\/$/, "");
}

export function emptySocialConfig(): SocialConfig {
  return {
    pageId: "",
    pageName: "",
    pageToken: "",
    pages: [],
    connectedAt: "",
    lastError: "",
    facebookUserId: "",
    instagramUserId: "",
    instagramUsername: "",
    instagramToken: "",
    instagramTokenExpiresAt: "",
    instagramConnectedAt: "",
    instagramLastError: "",
    tiktokOpenId: "",
    tiktokUsername: "",
    tiktokAccessToken: "",
    tiktokRefreshToken: "",
    tiktokTokenExpiresAt: "",
    tiktokScope: "",
    tiktokConnectedAt: "",
    tiktokLastError: "",
  };
}

export function parseSocialConfig(raw: string | null): SocialConfig {
  if (!raw) return emptySocialConfig();
  try {
    const value = JSON.parse(raw) as Partial<SocialConfig>;
    const pages = Array.isArray(value.pages)
      ? value.pages
          .map((page) => ({
            id: String(page?.id ?? "").trim(),
            name: String(page?.name ?? "").trim(),
            accessToken: String(page?.accessToken ?? "").trim(),
          }))
          .filter((page) => page.id && page.accessToken)
      : [];
    return {
      pageId: String(value.pageId ?? "").trim(),
      pageName: String(value.pageName ?? "").trim(),
      pageToken: String(value.pageToken ?? "").trim(),
      pages,
      connectedAt: String(value.connectedAt ?? "").trim(),
      lastError: String(value.lastError ?? "").trim(),
      facebookUserId: String(value.facebookUserId ?? "").trim(),
      instagramUserId: String(value.instagramUserId ?? "").trim(),
      instagramUsername: String(value.instagramUsername ?? "").trim(),
      instagramToken: String(value.instagramToken ?? "").trim(),
      instagramTokenExpiresAt: String(value.instagramTokenExpiresAt ?? "").trim(),
      instagramConnectedAt: String(value.instagramConnectedAt ?? "").trim(),
      instagramLastError: String(value.instagramLastError ?? "").trim(),
      tiktokOpenId: String(value.tiktokOpenId ?? "").trim(),
      tiktokUsername: String(value.tiktokUsername ?? "").trim(),
      tiktokAccessToken: String(value.tiktokAccessToken ?? "").trim(),
      tiktokRefreshToken: String(value.tiktokRefreshToken ?? "").trim(),
      tiktokTokenExpiresAt: String(value.tiktokTokenExpiresAt ?? "").trim(),
      tiktokScope: String(value.tiktokScope ?? "").trim(),
      tiktokConnectedAt: String(value.tiktokConnectedAt ?? "").trim(),
      tiktokLastError: String(value.tiktokLastError ?? "").trim(),
    };
  } catch {
    return emptySocialConfig();
  }
}

export function facebookAppReady() {
  return Boolean(appId() && appSecret());
}

export function instagramAppReady() {
  return Boolean(instagramAppId() && instagramAppSecret());
}

export function resolveFacebookCreds(config: SocialConfig) {
  if (config.pageId && config.pageToken) {
    return { pageId: config.pageId, pageToken: config.pageToken, pageName: config.pageName, source: "db" as const };
  }
  const pageId = env("FACEBOOK_PAGE_ID");
  const pageToken = env("FACEBOOK_PAGE_ACCESS_TOKEN");
  if (pageId && pageToken) {
    return { pageId, pageToken, pageName: "Env page", source: "env" as const };
  }
  return null;
}

export function aiReady() {
  return Boolean(env("OPENAI_API_KEY"));
}

export function listTopics() {
  return topics.map(({ id, label, title, meta, area }) => ({ id, label, title, meta, area }));
}

export function resolveInstagram(config: SocialConfig) {
  const userId = (config.instagramUserId || "").trim();
  const token = (config.instagramToken || "").trim();
  if (!userId || !token) return null;
  return {
    userId,
    username: (config.instagramUsername || "").trim(),
    accessToken: token,
  };
}

export function socialStatus(config: SocialConfig) {
  const creds = resolveFacebookCreds(config);
  const ig = resolveInstagram(config);
  return {
    ok: true,
    facebook: Boolean(creds),
    instagram: Boolean(ig),
    oauth: facebookAppReady(),
    instagramOauth: instagramAppReady(),
    ai: aiReady(),
    topics: listTopics(),
    pageId: creds?.pageId ? "connected" : "",
    pageName: creds?.pageName || "",
    source: creds?.source || "",
    connectedAt: config.connectedAt || "",
    pages: config.pages.map((page) => ({ id: page.id, name: page.name })),
    selectedPageId: config.pageId || "",
    hasToken: Boolean(creds?.pageToken),
    instagramUserId: ig?.userId ? "connected" : "",
    instagramUsername: ig?.username || "",
    instagramConnectedAt: config.instagramConnectedAt || "",
    redirectUri: facebookRedirectUri(),
    instagramRedirectUri: instagramRedirectUri(),
    instagramDeauthorizeUri: instagramDeauthorizeUri(),
    instagramDataDeletionUri: instagramDataDeletionUri(),
    instagramAppId: instagramAppId() ? "set" : "",
    lastError: config.lastError || "",
    instagramLastError: config.instagramLastError || "",
  };
}

function stateSecret() {
  return envAny("SESSION_SECRET", "META_APP_SECRET", "FACEBOOK_APP_SECRET", "ADMIN_PASSWORD") || "mmproperty";
}

export function createOAuthState() {
  const exp = String(Date.now() + 15 * 60 * 1000);
  const sig = createHmac("sha256", stateSecret()).update(exp).digest("hex").slice(0, 40);
  return Buffer.from(`${exp}.${sig}`).toString("base64url");
}

export function verifyOAuthState(state: string) {
  try {
    const raw = Buffer.from(state, "base64url").toString("utf8");
    const [exp, sig] = raw.split(".");
    if (!exp || !sig) return false;
    if (Date.now() > Number(exp)) return false;
    const expected = createHmac("sha256", stateSecret()).update(exp).digest("hex").slice(0, 40);
    const left = Buffer.from(sig);
    const right = Buffer.from(expected);
    return left.length === right.length && timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

export function facebookRedirectUri(origin?: string) {
  const base = publicOrigin(origin || SITE);
  // Static HTTPS page (works with ngrok). Completes OAuth via POST to the API.
  return `${base}/facebook-callback.html`;
}

export function instagramRedirectUri(origin?: string) {
  const override = env("INSTAGRAM_REDIRECT_URI").replace(/\/$/, "");
  if (override) return override;
  const base = publicOrigin(origin || SITE);
  // API callback (GET) — easier for Meta Business login URI validation than .html.
  return `${base}/api/instagram-callback`;
}

export function instagramDeauthorizeUri(origin?: string) {
  return `${publicOrigin(origin || SITE)}/api/instagram-deauthorize`;
}

export function instagramDataDeletionUri(origin?: string) {
  return `${publicOrigin(origin || SITE)}/api/instagram-data-deletion`;
}

export function buildFacebookAuthUrl(origin: string, state: string) {
  const params = new URLSearchParams({
    client_id: appId(),
    redirect_uri: facebookRedirectUri(origin),
    state,
    response_type: "code",
  });
  const configId = env("META_LOGIN_CONFIG_ID");
  // Login for Business configs use config_id instead of scope.
  if (configId) params.set("config_id", configId);
  else params.set("scope", SCOPES);
  return `${dialogBase()}?${params}`;
}

export function buildInstagramAuthUrl(origin: string, state: string) {
  const redirectUri = instagramRedirectUri(origin);
  const params = new URLSearchParams({
    client_id: instagramAppId(),
    redirect_uri: redirectUri,
    response_type: "code",
    scope: IG_SCOPES,
    state,
  });
  // Match Meta's Instagram Business Login embed URL host.
  console.log("[instagram] authorize redirect_uri=", redirectUri, "client_id=", instagramAppId());
  return `https://www.instagram.com/oauth/authorize?${params}`;
}

/** Save a Page token from Graph API Explorer / a working test app. */
export function configFromManualToken(input: {
  pageId: string;
  pageToken: string;
  pageName?: string;
}): SocialConfig {
  const pageId = input.pageId.trim();
  const pageToken = input.pageToken.trim();
  const pageName = (input.pageName || "Facebook Page").trim();
  if (!/^\d{5,30}$/.test(pageId)) {
    throw new Error("Page ID should be a numeric Facebook Page id.");
  }
  if (pageToken.length < 20) {
    throw new Error("Page access token looks too short.");
  }
  return {
    pageId,
    pageName,
    pageToken,
    pages: [{ id: pageId, name: pageName, accessToken: pageToken }],
    connectedAt: new Date().toISOString(),
    lastError: "",
  };
}

export function clearInstagramLogin(config: SocialConfig): SocialConfig {
  return {
    ...config,
    instagramUserId: "",
    instagramUsername: "",
    instagramToken: "",
    instagramTokenExpiresAt: "",
    instagramConnectedAt: "",
    instagramLastError: "",
  };
}

async function exchangeCode(code: string, origin: string) {
  const params = new URLSearchParams({
    client_id: appId(),
    client_secret: appSecret(),
    redirect_uri: facebookRedirectUri(origin),
    code,
  });
  const response = await fetch(`${graphBase()}/oauth/access_token?${params}`);
  const data = (await response.json()) as { access_token?: string; error?: { message?: string } };
  if (!response.ok || !data.access_token) {
    throw new Error(data.error?.message || "Could not exchange Facebook code.");
  }
  return data.access_token;
}

async function longLivedUserToken(shortToken: string) {
  const params = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: appId(),
    client_secret: appSecret(),
    fb_exchange_token: shortToken,
  });
  const response = await fetch(`${graphBase()}/oauth/access_token?${params}`);
  const data = (await response.json()) as { access_token?: string };
  return data.access_token || shortToken;
}

async function assertAllowedUser(userToken: string) {
  const allowed = allowedIds("ALLOWED_FACEBOOK_USER_IDS", "ALLOWED_FACEBOOK_USER_ID");
  if (!allowed.length) return;
  const response = await fetch(`${graphBase()}/me?fields=id&access_token=${encodeURIComponent(userToken)}`);
  const data = (await response.json()) as { id?: string; error?: { message?: string } };
  if (!response.ok || !data.id) {
    throw new Error(data.error?.message || "Could not verify the Facebook user.");
  }
  if (!allowed.includes(data.id)) {
    throw new Error(
      `This Facebook account (${data.id}) is not on ALLOWED_FACEBOOK_USER_IDS. ` +
        `Meta App Roles alone are not enough while that env is set — add this ID, or remove ALLOWED_FACEBOOK_USER_ID(S) from Vercel so any Admin/Developer/Tester can connect.`,
    );
  }
}

function mapPages(rows: { id?: string; name?: string; access_token?: string }[] | undefined): FacebookPage[] {
  return (rows ?? [])
    .map((page) => ({
      id: String(page.id ?? "").trim(),
      name: String(page.name ?? "Page").trim(),
      accessToken: String(page.access_token ?? "").trim(),
    }))
    .filter((page) => page.id && page.accessToken);
}

type GraphError = { message?: string; type?: string; code?: number; error_subcode?: number; fbtrace_id?: string };

async function facebookPermissions(userToken: string) {
  try {
    const response = await fetch(`${graphBase()}/me/permissions?access_token=${encodeURIComponent(userToken)}`);
    const data = (await response.json()) as {
      data?: { permission?: string; status?: string }[];
      error?: GraphError;
    };
    if (!response.ok || data.error) {
      console.warn("[facebook] permissions lookup failed", data.error || { status: response.status });
      return [];
    }
    return (data.data ?? []).map((row) => ({
      permission: String(row.permission || ""),
      status: String(row.status || ""),
    }));
  } catch (caught) {
    console.warn("[facebook] permissions lookup error", caught instanceof Error ? caught.message : caught);
    return [];
  }
}

function summarizePageRows(rows: { id?: string; name?: string; access_token?: string }[] | undefined) {
  return (rows ?? []).map((page) => ({
    id: String(page.id ?? "").trim(),
    name: String(page.name ?? "").trim(),
    hasToken: Boolean(String(page.access_token ?? "").trim()),
  }));
}

export async function fetchFacebookPages(userToken: string): Promise<FacebookPage[]> {
  const permissions = await facebookPermissions(userToken);
  const granted = permissions.filter((row) => row.status === "granted").map((row) => row.permission);
  const declined = permissions.filter((row) => row.status === "declined").map((row) => row.permission);
  console.log("[facebook] token permissions", {
    granted,
    declined,
    need: ["pages_show_list", "pages_manage_posts", "business_management"],
    missing: ["pages_show_list", "pages_manage_posts", "business_management"].filter(
      (scope) => !granted.includes(scope),
    ),
  });

  const params = new URLSearchParams({
    fields: "id,name,access_token",
    access_token: userToken,
  });
  const response = await fetch(`${graphBase()}/me/accounts?${params}`);
  const data = (await response.json()) as {
    data?: { id?: string; name?: string; access_token?: string }[];
    error?: GraphError;
  };
  const rawAccounts = summarizePageRows(data.data);
  console.log("[facebook] /me/accounts", {
    http: response.status,
    ok: response.ok,
    error: data.error || null,
    rawCount: rawAccounts.length,
    pages: rawAccounts,
    usableWithToken: rawAccounts.filter((page) => page.hasToken).length,
  });
  if (response.ok && !data.error) {
    const pages = mapPages(data.data);
    if (pages.length > 0) return pages;
    if (rawAccounts.length > 0) {
      console.warn(
        "[facebook] Pages returned but none had access_token — usually missing pages_manage_posts or Page role too low",
      );
    }
  }

  // Fallback used by some Login-for-Business apps.
  const nested = new URLSearchParams({
    fields: "accounts{id,name,access_token}",
    access_token: userToken,
  });
  const nestedRes = await fetch(`${graphBase()}/me?${nested}`);
  const nestedData = (await nestedRes.json()) as {
    accounts?: { data?: { id?: string; name?: string; access_token?: string }[] };
    error?: GraphError;
  };
  const nestedRows = summarizePageRows(nestedData.accounts?.data);
  console.log("[facebook] /me?fields=accounts fallback", {
    http: nestedRes.status,
    ok: nestedRes.ok,
    error: nestedData.error || null,
    rawCount: nestedRows.length,
    pages: nestedRows,
    usableWithToken: nestedRows.filter((page) => page.hasToken).length,
  });
  const pages = mapPages(nestedData.accounts?.data);
  if (pages.length > 0) return pages;

  const message = data.error?.message || nestedData.error?.message || "Could not load Facebook Pages.";
  const detail =
    rawAccounts.length > 0 || nestedRows.length > 0
      ? " Pages were listed but without usable Page tokens."
      : " Graph returned zero Pages for this user.";
  throw new Error(
    `${message}${detail} Grant Page access (pages_show_list / pages_manage_posts) and make sure this user is a Page admin.`,
  );
}

export async function completeFacebookOAuth(code: string, origin: string): Promise<SocialConfig> {
  const shortToken = await exchangeCode(code, publicOrigin(origin));
  const userToken = await longLivedUserToken(shortToken);
  await assertAllowedUser(userToken);
  const meRes = await fetch(`${graphBase()}/me?fields=id,name&access_token=${encodeURIComponent(userToken)}`);
  const me = (await meRes.json()) as { id?: string; name?: string; error?: GraphError };
  console.log("[facebook] oauth user", {
    id: me.id || null,
    name: me.name || null,
    error: me.error || null,
    redirectUri: facebookRedirectUri(origin),
  });
  const pages = await fetchFacebookPages(userToken);
  if (pages.length === 0) {
    throw new Error("No Facebook Pages found. Make sure this Facebook user is a Page admin.");
  }
  console.log(
    "[facebook] usable pages",
    pages.map((page) => ({ id: page.id, name: page.name })),
  );
  const selected = pages[0];
  return {
    pageId: selected.id,
    pageName: selected.name,
    pageToken: selected.accessToken,
    pages,
    connectedAt: new Date().toISOString(),
    lastError: "",
    facebookUserId: String(me.id || "").trim(),
  };
}

async function exchangeInstagramCode(code: string, origin: string) {
  const body = new URLSearchParams({
    client_id: instagramAppId(),
    client_secret: instagramAppSecret(),
    grant_type: "authorization_code",
    redirect_uri: instagramRedirectUri(origin),
    code,
  });
  const response = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = (await response.json()) as {
    access_token?: string;
    user_id?: string | number;
    permissions?: string;
    data?: { access_token?: string; user_id?: string | number }[];
    error_message?: string;
    error_type?: string;
    error?: { message?: string };
  };
  const short =
    data.access_token ||
    data.data?.[0]?.access_token ||
    "";
  const userId = String(data.user_id ?? data.data?.[0]?.user_id ?? "").trim();
  if (!response.ok || !short) {
    throw new Error(
      data.error?.message || data.error_message || "Could not exchange Instagram authorization code.",
    );
  }
  return { accessToken: short, userId };
}

async function longLivedInstagramToken(shortToken: string) {
  const params = new URLSearchParams({
    grant_type: "ig_exchange_token",
    client_secret: instagramAppSecret(),
    access_token: shortToken,
  });
  // Meta docs use GET; some stacks require POST — try GET then POST.
  const getRes = await fetch(`${igGraphBase()}/access_token?${params}`);
  const getData = (await getRes.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: { message?: string };
  };
  if (getRes.ok && getData.access_token) {
    return { accessToken: getData.access_token, expiresIn: Number(getData.expires_in) || 60 * 24 * 3600 };
  }

  const postRes = await fetch(`${igGraphBase()}/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const postData = (await postRes.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: { message?: string };
  };
  if (postRes.ok && postData.access_token) {
    return { accessToken: postData.access_token, expiresIn: Number(postData.expires_in) || 60 * 24 * 3600 };
  }

  // Fall back to short-lived token rather than failing the whole connect.
  return { accessToken: shortToken, expiresIn: 3600 };
}

async function fetchInstagramProfile(accessToken: string) {
  const params = new URLSearchParams({
    fields: "user_id,username,account_type",
    access_token: accessToken,
  });
  const response = await fetch(`${igGraphBase()}/me?${params}`);
  const data = (await response.json()) as {
    user_id?: string | number;
    id?: string | number;
    username?: string;
    error?: { message?: string };
  };
  if (!response.ok || data.error) {
    throw new Error(data.error?.message || "Could not load the Instagram profile.");
  }
  const userId = String(data.user_id ?? data.id ?? "").trim();
  if (!userId) throw new Error("Instagram did not return a user id.");
  return {
    userId,
    username: String(data.username ?? "").trim(),
  };
}

export async function completeInstagramOAuth(
  code: string,
  origin: string,
  current: SocialConfig,
): Promise<SocialConfig> {
  if (!instagramAppReady()) {
    throw new Error("Set INSTAGRAM_APP_ID and INSTAGRAM_APP_SECRET first.");
  }
  const exchanged = await exchangeInstagramCode(code, publicOrigin(origin));
  const longLived = await longLivedInstagramToken(exchanged.accessToken);
  const profile = await fetchInstagramProfile(longLived.accessToken);
  const userId = profile.userId || exchanged.userId;
  if (!userId) throw new Error("Instagram login did not return a user id.");

  const allowed = allowedIds("ALLOWED_INSTAGRAM_USER_IDS", "ALLOWED_INSTAGRAM_USER_ID");
  if (allowed.length && !allowed.includes(userId)) {
    throw new Error(
      `This Instagram account (${userId}) is not allowed. Add it to ALLOWED_INSTAGRAM_USER_IDS or clear that variable.`,
    );
  }

  const expiresAt =
    longLived.expiresIn > 0
      ? new Date(Date.now() + longLived.expiresIn * 1000).toISOString()
      : "";

  return {
    ...current,
    instagramUserId: userId,
    instagramUsername: profile.username,
    instagramToken: longLived.accessToken,
    instagramTokenExpiresAt: expiresAt,
    instagramConnectedAt: new Date().toISOString(),
    instagramLastError: "",
  };
}

/** Refresh Instagram long-lived token when it expires within 7 days. */
export async function refreshInstagramTokenIfNeeded(config: SocialConfig): Promise<SocialConfig> {
  const token = (config.instagramToken || "").trim();
  if (!token) return config;

  const expiresAt = Date.parse(config.instagramTokenExpiresAt || "");
  const needsRefresh = !Number.isFinite(expiresAt) || expiresAt - Date.now() < 7 * 24 * 60 * 60 * 1000;
  if (!needsRefresh) return config;

  const params = new URLSearchParams({
    grant_type: "ig_refresh_token",
    access_token: token,
  });
  const response = await fetch(`${igGraphBase()}/refresh_access_token?${params}`);
  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: { message?: string };
  };
  if (!response.ok || !data.access_token) {
    console.warn("[instagram] token refresh skipped:", data.error?.message || response.status);
    return config;
  }
  return {
    ...config,
    instagramToken: data.access_token,
    instagramTokenExpiresAt:
      data.expires_in && data.expires_in > 0
        ? new Date(Date.now() + data.expires_in * 1000).toISOString()
        : config.instagramTokenExpiresAt,
  };
}

function findTopic(id: string) {
  return topics.find((item) => item.id === id) ?? topics[topics.length - 1];
}

function topicFromInput(input: Record<string, unknown>): SocialTopic {
  const raw = input.property;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const property = raw as Record<string, unknown>;
    const title = String(property.title ?? "").trim();
    const image = String(property.image ?? "").trim();
    const href = String(property.href ?? "").trim();
    if (title && (image || href)) {
      return {
        id: String(property.id ?? "listing").trim() || "listing",
        label: title.slice(0, 80),
        title,
        meta: String(property.meta ?? "").trim().slice(0, 160),
        area: String(property.area ?? "").trim().slice(0, 80) || "Costa del Sol",
        image: image || `${SITE}/media/costa-marbella.jpg`,
        href: href || `${SITE}/homes`,
      };
    }
  }
  return findTopic(String(input.topicId ?? "general"));
}

function baseHashtags(topic: SocialTopic, locale: string) {
  const areaTag = topic.area.replace(/\s+/g, "");
  const shared = ["#MMProperty", "#CostadelSol", `#${areaTag}`, "#SpainRealEstate", "#PropertyForSale"];
  if (locale === "es") return [...shared, "#Inmobiliaria", "#ViviendaEspaña", "#Marbella", "#Fuengirola"].join(" ");
  if (locale === "de") return [...shared, "#Immobilien", "#Spanien", "#WohnungKaufen"].join(" ");
  if (locale === "nl") return [...shared, "#Vastgoed", "#Spanje", "#WoningKopen"].join(" ");
  if (locale === "sv") return [...shared, "#Fastigheter", "#Spanien", "#Bostad"].join(" ");
  return [...shared, "#Marbella", "#LuxuryHomes", "#NewBuild"].join(" ");
}

function templatePost(topic: SocialTopic, locale: string, tone: string) {
  const soft = tone === "soft";
  let caption: string;
  if (locale === "es") {
    caption = soft
      ? `${topic.title}\n\n${topic.meta}\n\nEn M&M Property te acompañamos desde la primera visita hasta el notario. Oficina en Benalmádena.\n\nVer propiedad: ${topic.href}\nHabla con M&M Property: ${WHATSAPP_URL}`
      : `Nueva oportunidad en ${topic.area} 🏡\n\n${topic.title}\n${topic.meta}\n\nVer propiedad: ${topic.href}\nHabla con M&M Property: ${WHATSAPP_URL}`;
  } else if (locale === "de") {
    caption = soft
      ? `${topic.title}\n\n${topic.meta}\n\nM&M Property begleitet Sie von der ersten Besichtigung bis zum Notar. Büro in Benalmádena.\n\nObjekt ansehen: ${topic.href}\nKontakt zu M&M Property: ${WHATSAPP_URL}`
      : `Neues Angebot in ${topic.area} 🏡\n\n${topic.title}\n${topic.meta}\n\nObjekt ansehen: ${topic.href}\nKontakt zu M&M Property: ${WHATSAPP_URL}`;
  } else if (locale === "nl") {
    caption = soft
      ? `${topic.title}\n\n${topic.meta}\n\nM&M Property begeleidt u van de eerste bezichtiging tot de notaris. Kantoor in Benalmádena.\n\nBekijk woning: ${topic.href}\nNeem contact op met M&M Property: ${WHATSAPP_URL}`
      : `Nieuwe woning in ${topic.area} 🏡\n\n${topic.title}\n${topic.meta}\n\nBekijk woning: ${topic.href}\nNeem contact op met M&M Property: ${WHATSAPP_URL}`;
  } else if (locale === "sv") {
    caption = soft
      ? `${topic.title}\n\n${topic.meta}\n\nM&M Property följer dig från första visningen till notarien. Kontor i Benalmádena.\n\nSe bostaden: ${topic.href}\nKontakta M&M Property: ${WHATSAPP_URL}`
      : `Nytt objekt i ${topic.area} 🏡\n\n${topic.title}\n${topic.meta}\n\nSe bostaden: ${topic.href}\nKontakta M&M Property: ${WHATSAPP_URL}`;
  } else {
    caption = soft
      ? `${topic.title}\n\n${topic.meta}\n\nM&M Property walks you from the first viewing to the notary. Office in Benalmádena.\n\nView listing: ${topic.href}\nTalk with M&M Property: ${WHATSAPP_URL}`
      : `New listing on the Costa del Sol 🏡\n\n${topic.title}\n${topic.meta}\n\nView listing: ${topic.href}\nTalk with M&M Property: ${WHATSAPP_URL}`;
  }
  return { caption, hashtags: baseHashtags(topic, locale), source: "template" as const };
}

async function openaiPost(topic: SocialTopic, locale: string, tone: string, notes: string) {
  const key = env("OPENAI_API_KEY");
  if (!key) return null;

  const language =
    locale === "es"
      ? "Spanish"
      : locale === "de"
        ? "German"
        : locale === "nl"
          ? "Dutch"
          : locale === "sv"
            ? "Swedish"
            : "English";

  const prompt = `Write a social media caption for M&M Property (Facebook and Instagram), a Costa del Sol real estate agency in Benalmádena, Spain.
Language: ${language}
Tone: ${tone === "soft" ? "warm and professional" : "engaging and sales-ready"}
Property: ${topic.title}
Details: ${topic.meta}
Area: ${topic.area}
Listing link (include once — opens the property page): ${topic.href}
"Talk with / Contact M&M Property" CTA must use this WhatsApp URL only: ${WHATSAPP_URL}
Never use mmproperty.es. Never use ${CONTACT_URL} for the talk CTA.
Do not put punctuation immediately after URLs.
Extra notes from agent: ${notes || "none"}

Return JSON only with keys:
- caption: post body without hashtags (listing link then WhatsApp talk link near the end, no more than 900 characters)
- hashtags: one string of 6 to 10 relevant hashtags separated by spaces`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env("OPENAI_MODEL") || "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You write concise real-estate social captions for Facebook and Instagram. Reply with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) return null;
  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const raw = data.choices?.[0]?.message?.content ?? "";
  try {
    const parsed = JSON.parse(raw) as { caption?: string; hashtags?: string };
    const caption = String(parsed.caption ?? "").trim().slice(0, 1800);
    const hashtags = String(parsed.hashtags ?? baseHashtags(topic, locale)).trim().slice(0, 400);
    if (!caption) return null;
    return { caption, hashtags, source: "ai" as const };
  } catch {
    return null;
  }
}

export async function generateSocialPost(input: Record<string, unknown>) {
  const topic = topicFromInput(input);
  const locale = ["en", "es", "de", "nl", "sv"].includes(String(input.locale))
    ? String(input.locale)
    : "en";
  const tone = String(input.tone) === "soft" ? "soft" : "sales";
  const notes = String(input.notes ?? "").trim().slice(0, 400);

  const ai = await openaiPost(topic, locale, tone, notes);
  const draft = ai ?? templatePost(topic, locale, tone);

  return {
    ok: true,
    topic: {
      id: topic.id,
      label: topic.label,
      title: topic.title,
      meta: topic.meta,
      area: topic.area,
    },
    locale,
    tone,
    caption: draft.caption,
    hashtags: draft.hashtags,
    message: `${draft.caption}\n\n${draft.hashtags}`.trim(),
    source: draft.source,
    image: topic.image,
    link: topic.href,
  };
}

/** Cap keeps carousel publish inside serverless time limits. */
const MAX_SOCIAL_PHOTOS = 6;

function collectImageUrls(input: Record<string, unknown>, limit = MAX_SOCIAL_PHOTOS) {
  const fromList = Array.isArray(input.images)
    ? input.images.map((item) => String(item ?? "").trim()).filter((url) => /^https:\/\//i.test(url))
    : [];
  const single = String(input.image ?? "").trim();
  if (single && /^https:\/\//i.test(single) && !fromList.includes(single)) fromList.unshift(single);
  return [...new Set(fromList)].slice(0, Math.max(1, Math.min(limit, MAX_SOCIAL_PHOTOS)));
}

export async function publishFacebook(input: Record<string, unknown>, config: SocialConfig) {
  const creds = resolveFacebookCreds(config);
  if (!creds) {
    return {
      ok: false,
      error: "Facebook is not connected. Use Connect Facebook in Admin → Social.",
    };
  }

  const message = String(input.message ?? "").trim().slice(0, 2200);
  if (message.length < 8) return { ok: false, error: "Write a longer post before publishing." };

  const link = String(input.link ?? "").trim().slice(0, 500);
  const images = collectImageUrls(input);
  const withPhoto = input.withPhoto === true && images.length > 0;

  if (withPhoto && images.length > 1) {
    const mediaIds: string[] = [];
    for (const url of images) {
      const upload = new URLSearchParams({
        url,
        published: "false",
        access_token: creds.pageToken,
      });
      const uploadRes = await fetch(`${graphBase()}/${encodeURIComponent(creds.pageId)}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: upload,
      });
      const uploadData = (await uploadRes.json()) as { id?: string; error?: { message?: string } };
      if (!uploadRes.ok || uploadData.error || !uploadData.id) {
        return {
          ok: false,
          error: uploadData.error?.message || `Facebook photo upload failed (${uploadRes.status}).`,
        };
      }
      mediaIds.push(uploadData.id);
    }

    const feed = new URLSearchParams();
    feed.set("message", message);
    feed.set("access_token", creds.pageToken);
    mediaIds.forEach((id, index) => {
      feed.set(`attached_media[${index}]`, JSON.stringify({ media_fbid: id }));
    });
    const feedRes = await fetch(`${graphBase()}/${encodeURIComponent(creds.pageId)}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: feed,
    });
    const feedData = (await feedRes.json()) as { id?: string; error?: { message?: string } };
    if (!feedRes.ok || feedData.error) {
      return {
        ok: false,
        error: feedData.error?.message || `Facebook multi-photo post failed (${feedRes.status}).`,
      };
    }
    return {
      ok: true,
      id: feedData.id || "",
      mode: "album",
      photos: mediaIds.length,
      pageName: creds.pageName,
    };
  }

  const endpoint = withPhoto
    ? `${graphBase()}/${encodeURIComponent(creds.pageId)}/photos`
    : `${graphBase()}/${encodeURIComponent(creds.pageId)}/feed`;

  const body = new URLSearchParams();
  body.set("access_token", creds.pageToken);
  if (withPhoto) {
    body.set("url", images[0]);
    body.set("caption", message);
  } else {
    body.set("message", message);
    if (/^https:\/\//i.test(link)) body.set("link", link);
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = (await response.json()) as { id?: string; post_id?: string; error?: { message?: string } };

  if (!response.ok || data.error) {
    return {
      ok: false,
      error: data.error?.message || `Facebook returned ${response.status}.`,
    };
  }

  return {
    ok: true,
    id: data.id || data.post_id || "",
    mode: withPhoto ? "photo" : "feed",
    photos: withPhoto ? 1 : 0,
    pageName: creds.pageName,
  };
}

async function waitForInstagramContainer(creationId: string, accessToken: string, label = "media") {
  let lastCode = "";
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const params = new URLSearchParams({
      fields: "status_code,status",
      access_token: accessToken,
    });
    const response = await fetch(`${igGraphBase()}/${encodeURIComponent(creationId)}?${params}`);
    const data = (await response.json()) as {
      status_code?: string;
      status?: string;
      error?: { message?: string };
    };
    if (!response.ok || data.error) {
      throw new Error(data.error?.message || `Instagram ${label} check failed (${response.status}).`);
    }
    const code = String(data.status_code || "").toUpperCase();
    lastCode = code || lastCode;
    if (code === "FINISHED" || code === "PUBLISHED") {
      // Brief settle time — publishing immediately after FINISHED often returns Media ID unavailable.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return;
    }
    if (code === "ERROR" || code === "EXPIRED") {
      throw new Error(data.status || `Instagram ${label} status: ${code}`);
    }
    await new Promise((resolve) => setTimeout(resolve, attempt < 3 ? 1200 : 2000));
  }
  throw new Error(
    `Instagram is still processing the ${label}${lastCode ? ` (${lastCode})` : ""}. Try again in a moment.`,
  );
}

async function createInstagramImageContainer(
  userId: string,
  accessToken: string,
  imageUrl: string,
  options: { caption?: string; carouselItem?: boolean; wait?: boolean } = {},
) {
  const body = new URLSearchParams({
    image_url: imageUrl,
    access_token: accessToken,
  });
  if (options.carouselItem) body.set("is_carousel_item", "true");
  else body.set("media_type", "IMAGE");
  if (options.caption) body.set("caption", options.caption);
  const response = await fetch(`${igGraphBase()}/${encodeURIComponent(userId)}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = (await response.json()) as { id?: string; error?: { message?: string } };
  if (!response.ok || data.error || !data.id) {
    throw new Error(data.error?.message || `Instagram media create failed (${response.status}).`);
  }
  if (options.wait !== false) await waitForInstagramContainer(data.id, accessToken, "photo");
  return data.id;
}

async function publishInstagramContainer(userId: string, accessToken: string, creationId: string) {
  await waitForInstagramContainer(creationId, accessToken, "container");

  const attempt = async () => {
    const publishBody = new URLSearchParams({
      creation_id: creationId,
      access_token: accessToken,
    });
    const publishRes = await fetch(`${igGraphBase()}/${encodeURIComponent(userId)}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: publishBody,
    });
    const publishData = (await publishRes.json()) as {
      id?: string;
      error?: { message?: string; code?: number; error_subcode?: number };
    };
    return { publishRes, publishData };
  };

  let { publishRes, publishData } = await attempt();
  const unavailable = /media id is not available/i.test(publishData.error?.message || "");
  if ((!publishRes.ok || publishData.error) && unavailable) {
    console.warn("[instagram] publish too early, waiting and retrying…");
    await waitForInstagramContainer(creationId, accessToken, "container-retry");
    ({ publishRes, publishData } = await attempt());
  }

  if (!publishRes.ok || publishData.error) {
    throw new Error(publishData.error?.message || `Instagram publish failed (${publishRes.status}).`);
  }
  return publishData.id || "";
}

async function assertInstagramImageReachable(url: string) {
  try {
    const response = await fetch(url, { method: "GET", redirect: "follow" });
    if (!response.ok) {
      throw new Error(`Cropped image URL returned ${response.status}. Check BASE_URL /media/instagram deploy.`);
    }
    const type = response.headers.get("content-type") || "";
    if (type && !type.startsWith("image/")) {
      throw new Error("Cropped image URL did not return an image. Check /media/instagram routing.");
    }
  } catch (caught) {
    if (caught instanceof Error && caught.message.startsWith("Cropped")) throw caught;
    throw new Error(
      `Cannot reach Instagram image URL (${url.slice(0, 80)}…). Ensure production BASE_URL is https://mmproperty.io.`,
    );
  }
}

export async function publishInstagram(input: Record<string, unknown>, config: SocialConfig) {
  const ig = resolveInstagram(config);
  if (!ig) {
    return {
      ok: false,
      error: "Instagram is not connected. Use Connect Instagram in Admin → Social.",
    };
  }

  const message = String(input.message ?? "").trim().slice(0, 2200);
  if (message.length < 8) return { ok: false, error: "Write a longer caption before publishing." };

  const rawImages = collectImageUrls(input);
  // Crop to 1:1 via /media/instagram so Graph accepts every listing photo.
  const images = prepareInstagramImageUrls(rawImages);
  if (!images.length) {
    return {
      ok: false,
      error: "Instagram requires a public https image URL. Enable Include photo and set Image URL.",
    };
  }

  console.log("[instagram] publish start", {
    photos: images.length,
    user: ig.username || ig.userId,
    sample: images[0],
  });

  try {
    await assertInstagramImageReachable(images[0]);

    let creationId = "";
    let mode: "photo" | "carousel" = "photo";

    if (images.length === 1) {
      creationId = await createInstagramImageContainer(ig.userId, ig.accessToken, images[0], {
        caption: message,
      });
    } else {
      mode = "carousel";
      // Sequential create+wait is slower but avoids Meta "Media ID is not available" races.
      const childIds: string[] = [];
      for (const [index, url] of images.entries()) {
        console.log("[instagram] carousel item", index + 1, "/", images.length);
        childIds.push(
          await createInstagramImageContainer(ig.userId, ig.accessToken, url, {
            carouselItem: true,
            wait: true,
          }),
        );
      }

      const carouselBody = new URLSearchParams({
        media_type: "CAROUSEL",
        children: childIds.join(","),
        caption: message,
        access_token: ig.accessToken,
      });
      const carouselRes = await fetch(`${igGraphBase()}/${encodeURIComponent(ig.userId)}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: carouselBody,
      });
      const carouselData = (await carouselRes.json()) as { id?: string; error?: { message?: string } };
      if (!carouselRes.ok || carouselData.error || !carouselData.id) {
        console.error("[instagram] carousel create failed", carouselData.error || carouselRes.status);
        return {
          ok: false,
          error: carouselData.error?.message || `Instagram carousel create failed (${carouselRes.status}).`,
        };
      }
      creationId = carouselData.id;
    }

    const publishedId = await publishInstagramContainer(ig.userId, ig.accessToken, creationId);
    console.log("[instagram] published", { id: publishedId, mode, photos: images.length });
    return {
      ok: true,
      id: publishedId,
      mode,
      photos: images.length,
      username: ig.username,
    };
  } catch (caught) {
    console.error("[instagram] publish error", caught instanceof Error ? caught.message : caught);
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "Instagram media processing failed.",
    };
  }
}

export function selectFacebookPage(config: SocialConfig, pageId: string): SocialConfig | null {
  const page = config.pages.find((item) => item.id === pageId);
  if (!page) return null;
  return {
    ...config,
    pageId: page.id,
    pageName: page.name,
    pageToken: page.accessToken,
  };
}
