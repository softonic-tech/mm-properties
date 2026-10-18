/**
 * TikTok Login Kit + Content Posting API (PULL_FROM_URL).
 * Supports VIDEO posts (/v2/post/publish/video/init/) and
 * PHOTO posts  (/v2/post/publish/content/init/, media_type=PHOTO).
 *
 * Env: TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, BASE_URL
 * Photo URLs must be on a domain verified under TikTok "URL properties".
 * Use /media/tiktok/... proxy for inmoenter images (see tiktok-property.ts).
 */

import type { SocialConfig } from "./social.js";

function publicOrigin(fallback = "https://mmproperty.io") {
  const base = (process.env.BASE_URL ?? "").trim().replace(/\/$/, "");
  return base || fallback.replace(/\/$/, "");
}

const TIKTOK_API = "https://open.tiktokapis.com/v2";
const TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const TIKTOK_AUTH_URL = "https://www.tiktok.com/v2/auth/authorize/";
const TIKTOK_SCOPES = ["user.info.basic", "video.upload", "video.publish"].join(",");

const TIKTOK_PHOTO_MAX = 35;
const TIKTOK_PHOTO_TITLE_MAX = 90;
const TIKTOK_PHOTO_DESC_MAX = 4000;
const TIKTOK_VIDEO_TITLE_MAX = 2200;

const CREATOR_POSTING_BLOCKED = new Set([
  "spam_risk_too_many_posts",
  "spam_risk_user_banned_from_posting",
  "reached_active_user_cap",
]);

const TIKTOK_ERROR_HINTS: Record<string, string> = {
  url_ownership_unverified:
    "TikTok has not verified the domain hosting these photos. Verify BASE_URL under URL properties (use /media/tiktok proxy), or verify the image host directly.",
  unaudited_client_can_only_post_to_private_accounts:
    "Your app is not audited yet — use privacy_level SELF_ONLY or a private TikTok account.",
  privacy_level_option_mismatch:
    "privacy_level must be one of the privacy_level_options from /creator_info/query/.",
  spam_risk_too_many_posts: "This creator has hit the daily API post cap.",
  spam_risk_too_many_pending_share: "Too many pending drafts in the TikTok inbox.",
  spam_risk_user_banned_from_posting: "This TikTok account is banned from posting.",
  reached_active_user_cap: "Your app hit its daily quota of active publishing users.",
  scope_not_authorized: "Reconnect TikTok so video.publish / video.upload are granted.",
  access_token_invalid: "TikTok access token is invalid. Reconnect TikTok.",
  rate_limit_exceeded: "Rate limited — about 6 requests per minute per token.",
  app_version_check_failed: "MEDIA_UPLOAD needs TikTok app 31.8+.",
  invalid_param: "TikTok rejected a parameter. Check photo URLs, cover index and privacy level.",
};

function env(name: string) {
  return (process.env[name] ?? "").trim();
}

function clientKey() {
  return env("TIKTOK_CLIENT_KEY") || env("TIKTOK_CLIENT_ID");
}

function clientSecret() {
  return env("TIKTOK_CLIENT_SECRET");
}

export function tiktokAppReady() {
  return Boolean(clientKey() && clientSecret());
}

export function tiktokRedirectUri(origin?: string) {
  const override = env("TIKTOK_REDIRECT_URI").replace(/\/$/, "");
  if (override) return override;
  return `${publicOrigin(origin)}/tiktok-callback.html`;
}

export function resolveTikTok(config: SocialConfig) {
  const openId = (config.tiktokOpenId || "").trim();
  const accessToken = (config.tiktokAccessToken || "").trim();
  if (!openId || !accessToken) return null;
  return {
    openId,
    username: (config.tiktokUsername || "").trim(),
    accessToken,
    refreshToken: (config.tiktokRefreshToken || "").trim(),
    tokenExpiresAt: (config.tiktokTokenExpiresAt || "").trim(),
    scope: (config.tiktokScope || "").trim(),
  };
}

export function clearTikTokLogin(config: SocialConfig): SocialConfig {
  return {
    ...config,
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

export function tiktokStatusFields(config: SocialConfig) {
  const tt = resolveTikTok(config);
  return {
    tiktok: Boolean(tt),
    tiktokOauth: tiktokAppReady(),
    tiktokUsername: tt?.username || "",
    tiktokOpenId: tt?.openId ? "connected" : "",
    tiktokConnectedAt: config.tiktokConnectedAt || "",
    tiktokRedirectUri: tiktokRedirectUri(),
    tiktokLastError: config.tiktokLastError || "",
    tiktokMediaPrefix: `${publicOrigin()}/media/tiktok/`,
  };
}

export function buildTikTokAuthUrl(origin: string, state: string) {
  const params = new URLSearchParams({
    client_key: clientKey(),
    redirect_uri: tiktokRedirectUri(origin),
    response_type: "code",
    scope: TIKTOK_SCOPES,
    state,
  });
  console.log("[tiktok] authorize redirect_uri=", tiktokRedirectUri(origin));
  return `${TIKTOK_AUTH_URL}?${params}`;
}

async function refreshTikTokToken(refreshToken: string) {
  if (!refreshToken) throw new Error("No TikTok refresh token available.");
  const body = new URLSearchParams({
    client_key: clientKey(),
    client_secret: clientSecret(),
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = (await response.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
    error?: string;
    error_description?: string;
  };
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "TikTok token refresh failed.");
  }
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    expiresIn: Number(data.expires_in || 86400),
    scope: String(data.scope || ""),
  };
}

export async function ensureValidTikTokToken(config: SocialConfig) {
  const tt = resolveTikTok(config);
  if (!tt) throw new Error("TikTok is not connected. Use Connect TikTok in Admin → Social.");

  const now = Date.now();
  const buffer = 5 * 60 * 1000;
  const expiresAt = tt.tokenExpiresAt ? new Date(tt.tokenExpiresAt).getTime() : 0;
  if (expiresAt && expiresAt > now + buffer) {
    return { accessToken: tt.accessToken, config };
  }
  if (!tt.refreshToken) {
    throw new Error("TikTok token expired. Reconnect TikTok in Admin → Social.");
  }

  const refreshed = await refreshTikTokToken(tt.refreshToken);
  const next: SocialConfig = {
    ...config,
    tiktokAccessToken: refreshed.accessToken,
    tiktokRefreshToken: refreshed.refreshToken,
    tiktokTokenExpiresAt: new Date(Date.now() + refreshed.expiresIn * 1000).toISOString(),
    tiktokScope: refreshed.scope || config.tiktokScope,
    tiktokLastError: "",
  };
  return { accessToken: refreshed.accessToken, config: next };
}

async function exchangeTikTokCode(code: string, origin: string) {
  const body = new URLSearchParams({
    client_key: clientKey(),
    client_secret: clientSecret(),
    code,
    grant_type: "authorization_code",
    redirect_uri: tiktokRedirectUri(origin),
  });
  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = (await response.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    open_id?: string;
    scope?: string;
    error?: string;
    error_description?: string;
  };
  if (!response.ok || !data.access_token || !data.open_id) {
    throw new Error(data.error_description || data.error || "Could not exchange TikTok code.");
  }
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || "",
    expiresIn: Number(data.expires_in || 86400),
    openId: data.open_id,
    scope: String(data.scope || ""),
  };
}

async function fetchTikTokProfile(accessToken: string) {
  const fields = "open_id,union_id,avatar_url,display_name,username";
  const response = await fetch(`${TIKTOK_API}/user/info/?fields=${encodeURIComponent(fields)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = (await response.json()) as {
    data?: { user?: { open_id?: string; display_name?: string; username?: string } };
    error?: { code?: string; message?: string };
  };
  if (!response.ok || (data.error?.code && data.error.code !== "ok")) {
    throw new Error(data.error?.message || "Could not load TikTok profile.");
  }
  const user = data.data?.user || {};
  return {
    openId: String(user.open_id || "").trim(),
    username: String(user.username || user.display_name || "").trim(),
  };
}

export async function completeTikTokOAuth(code: string, origin: string, current: SocialConfig) {
  if (!tiktokAppReady()) {
    throw new Error("Set TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET first.");
  }
  const tokens = await exchangeTikTokCode(code, publicOrigin(origin));
  let username = "";
  try {
    const profile = await fetchTikTokProfile(tokens.accessToken);
    username = profile.username;
  } catch (caught) {
    console.warn("[tiktok] profile lookup failed:", caught instanceof Error ? caught.message : caught);
  }

  return {
    ...current,
    tiktokOpenId: tokens.openId,
    tiktokUsername: username,
    tiktokAccessToken: tokens.accessToken,
    tiktokRefreshToken: tokens.refreshToken,
    tiktokTokenExpiresAt: new Date(Date.now() + tokens.expiresIn * 1000).toISOString(),
    tiktokScope: tokens.scope,
    tiktokConnectedAt: new Date().toISOString(),
    tiktokLastError: "",
  };
}

export async function getTikTokCreatorInfo(config: SocialConfig) {
  const { accessToken, config: next } = await ensureValidTikTokToken(config);
  const response = await fetch(`${TIKTOK_API}/post/publish/creator_info/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: "{}",
  });
  const payload = (await response.json()) as {
    data?: {
      creator_username?: string;
      privacy_level_options?: string[];
      comment_disabled?: boolean;
      duet_disabled?: boolean;
      stitch_disabled?: boolean;
      max_video_post_duration_sec?: number;
    };
    error?: { code?: string; message?: string };
  };
  const errorCode = payload.error?.code || "";
  if (errorCode && errorCode !== "ok") {
    return {
      ok: false,
      canPost: !CREATOR_POSTING_BLOCKED.has(errorCode),
      error: payload.error?.message || errorCode,
      config: next,
      privacyLevelOptions: [] as string[],
    };
  }
  const data = payload.data || {};
  return {
    ok: true,
    canPost: true,
    config: next,
    username: data.creator_username || next.tiktokUsername || "",
    privacyLevelOptions: data.privacy_level_options || [],
    commentDisabled: Boolean(data.comment_disabled),
    duetDisabled: Boolean(data.duet_disabled),
    stitchDisabled: Boolean(data.stitch_disabled),
    maxVideoPostDurationSec: data.max_video_post_duration_sec,
  };
}

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

type TikTokError = { code?: string; message?: string };

function describeTikTokError(error: TikTokError | undefined, fallback: string) {
  const code = (error?.code || "").trim();
  if (!code || code === "ok") return error?.message || fallback;
  const hint = TIKTOK_ERROR_HINTS[code];
  const message = (error?.message || "").trim();
  if (hint) return message ? `${hint} (${code}: ${message})` : `${hint} (${code})`;
  return message ? `${message} (${code})` : code;
}

function pickPrivacyLevel(requested: unknown, options: string[]) {
  const asked = String(requested ?? "").trim();
  if (asked) return asked;
  return options.find((item) => item === "SELF_ONLY") || options[0] || "SELF_ONLY";
}

export function normalizeTikTokPhotoUrls(value: unknown): string[] {
  const raw: unknown[] = Array.isArray(value) ? value : value ? [value] : [];
  const out: string[] = [];
  for (const item of raw) {
    let url = "";
    if (typeof item === "string") url = item;
    else if (item && typeof item === "object") url = String((item as { url?: unknown }).url ?? "");
    const trimmed = url.trim();
    if (!/^https:\/\//i.test(trimmed)) continue;
    if (!out.includes(trimmed)) out.push(trimmed);
  }
  return out.slice(0, TIKTOK_PHOTO_MAX);
}

async function pollTikTokPublishStatus(publishId: string, accessToken: string, attempts = 10) {
  let status = "";
  let data: { status?: string; fail_reason?: string; publicly_available_post_id?: string[] } | null = null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const res = await fetch(`${TIKTOK_API}/post/publish/status/fetch/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ publish_id: publishId }),
    });
    const payload = (await res.json()) as {
      data?: { status?: string; fail_reason?: string; publicly_available_post_id?: string[] };
      error?: TikTokError;
    };
    data = payload.data || null;
    status = String(data?.status || "");
    if (status === "PUBLISH_COMPLETE" || status === "FAILED") break;
    await wait(5000);
  }

  return {
    status,
    failReason: data?.fail_reason || "",
    publicId: data?.publicly_available_post_id?.[0] || "",
  };
}

export async function publishTikTokPhotos(input: Record<string, unknown>, config: SocialConfig) {
  const photoUrls = normalizeTikTokPhotoUrls(
    input.photoUrls ?? input.images ?? input.photos ?? input.photo_images,
  );

  if (!photoUrls.length) {
    return {
      ok: false,
      error:
        "TikTok needs at least one public https photo URL. Verify BASE_URL/media/tiktok under URL properties.",
      config,
    };
  }

  const description = String(input.message ?? input.description ?? "")
    .trim()
    .slice(0, TIKTOK_PHOTO_DESC_MAX);
  const title = String(input.title ?? description.split("\n")[0] ?? "")
    .trim()
    .slice(0, TIKTOK_PHOTO_TITLE_MAX);

  if (title.length < 1 && description.length < 1) {
    return { ok: false, error: "Write a caption before posting photos to TikTok.", config };
  }

  let coverIndex = Number(input.coverIndex ?? input.photoCoverIndex ?? 0);
  if (!Number.isInteger(coverIndex) || coverIndex < 0 || coverIndex >= photoUrls.length) {
    coverIndex = 0;
  }

  let working = config;
  let accessToken: string;
  try {
    const ensured = await ensureValidTikTokToken(working);
    accessToken = ensured.accessToken;
    working = ensured.config;
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "TikTok token invalid.",
      config: working,
    };
  }

  const wantsDraft = input.draft === true || input.postMode === "MEDIA_UPLOAD";
  const creator = await getTikTokCreatorInfo(working);
  working = creator.config || working;
  if (!creator.ok && !creator.canPost) {
    return {
      ok: false,
      error: creator.error || "TikTok creator cannot post right now.",
      config: working,
    };
  }

  const privacyOptions = creator.privacyLevelOptions || [];
  const privacyLevel = pickPrivacyLevel(input.privacyLevel, privacyOptions);
  if (!wantsDraft && privacyOptions.length && !privacyOptions.includes(privacyLevel)) {
    return {
      ok: false,
      error: `Invalid privacy level. Allowed: ${privacyOptions.join(", ")}`,
      config: working,
      privacyLevelOptions: privacyOptions,
    };
  }

  const sourceInfo = {
    source: "PULL_FROM_URL",
    photo_images: photoUrls,
    photo_cover_index: coverIndex,
  };

  const initPhotoPost = async (postMode: "DIRECT_POST" | "MEDIA_UPLOAD") => {
    const postInfo =
      postMode === "DIRECT_POST"
        ? {
            title,
            description,
            privacy_level: privacyLevel,
            disable_comment: input.disableComment === true,
            auto_add_music: input.autoAddMusic !== false,
            brand_content_toggle: Boolean(input.brandContentToggle),
            brand_organic_toggle: Boolean(input.brandOrganicToggle),
          }
        : { title, description };

    const res = await fetch(`${TIKTOK_API}/post/publish/content/init/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        post_info: postInfo,
        source_info: sourceInfo,
        post_mode: postMode,
        media_type: "PHOTO",
      }),
    });
    const payload = (await res.json()) as {
      data?: { publish_id?: string };
      error?: TikTokError;
    };
    return { res, payload };
  };

  let publishId = "";
  let mode: "direct" | "draft_inbox" = "direct";
  let directError: TikTokError | undefined;

  if (!wantsDraft) {
    const { res, payload } = await initPhotoPost("DIRECT_POST");
    const code = payload.error?.code || "";
    if (res.ok && payload.data?.publish_id && (!code || code === "ok")) {
      publishId = payload.data.publish_id;
    } else {
      directError = payload.error;
      console.warn("[tiktok] photo direct post failed:", code, payload.error?.message);
    }
  }

  if (!publishId) {
    const { res, payload } = await initPhotoPost("MEDIA_UPLOAD");
    const code = payload.error?.code || "";
    if (!res.ok || !payload.data?.publish_id || (code && code !== "ok")) {
      return {
        ok: false,
        error: describeTikTokError(
          directError || payload.error,
          "TikTok photo init failed. Verify /media/tiktok URL prefix and enable Direct Post if needed.",
        ),
        config: working,
        privacyLevelOptions: privacyOptions,
      };
    }
    publishId = payload.data.publish_id;
    mode = "draft_inbox";
  }

  if (mode === "draft_inbox") {
    return {
      ok: true,
      id: publishId,
      publishId,
      mode,
      photoCount: photoUrls.length,
      username: working.tiktokUsername || "",
      message:
        "Photos sent to the TikTok inbox as a draft. Open the TikTok app to finish posting.",
      config: working,
      privacyLevelOptions: privacyOptions,
    };
  }

  await wait(3000);
  const polled = await pollTikTokPublishStatus(publishId, accessToken);
  if (polled.status === "FAILED") {
    return {
      ok: false,
      error: `TikTok photo publishing failed: ${polled.failReason || "Unknown reason"}`,
      publishId,
      config: working,
      privacyLevelOptions: privacyOptions,
    };
  }

  return {
    ok: true,
    id: polled.publicId || publishId,
    publishId,
    mode,
    status: polled.status,
    photoCount: photoUrls.length,
    coverIndex,
    privacyLevel,
    username: working.tiktokUsername || "",
    message:
      polled.status === "PUBLISH_COMPLETE"
        ? `Photo post published to TikTok (${photoUrls.length} images).`
        : `TikTok photo upload status: ${polled.status || "processing"}.`,
    config: working,
    privacyLevelOptions: privacyOptions,
  };
}

export async function publishTikTokVideo(input: Record<string, unknown>, config: SocialConfig) {
  const videoUrl = String(input.videoUrl ?? input.video ?? "").trim();
  if (!/^https:\/\//i.test(videoUrl)) {
    return {
      ok: false,
      error: "TikTok needs a public https video URL (PULL_FROM_URL).",
      config,
    };
  }

  const title = String(input.message ?? input.title ?? "").trim().slice(0, TIKTOK_VIDEO_TITLE_MAX);
  if (title.length < 4) {
    return { ok: false, error: "Write a longer caption before posting to TikTok.", config };
  }

  let working = config;
  let accessToken: string;
  try {
    const ensured = await ensureValidTikTokToken(working);
    accessToken = ensured.accessToken;
    working = ensured.config;
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "TikTok token invalid.",
      config: working,
    };
  }

  const creator = await getTikTokCreatorInfo(working);
  working = creator.config || working;
  if (!creator.ok && !creator.canPost) {
    return { ok: false, error: creator.error || "TikTok creator cannot post right now.", config: working };
  }

  const privacyOptions = creator.privacyLevelOptions || [];
  const privacyLevel = pickPrivacyLevel(input.privacyLevel, privacyOptions);
  if (privacyOptions.length && !privacyOptions.includes(privacyLevel)) {
    return {
      ok: false,
      error: `Invalid privacy level. Allowed: ${privacyOptions.join(", ")}`,
      config: working,
      privacyLevelOptions: privacyOptions,
    };
  }

  const initPayload = {
    post_info: {
      title,
      privacy_level: privacyLevel,
      disable_duet: input.disableDuet !== false,
      disable_comment: input.disableComment !== false,
      disable_stitch: input.disableStitch !== false,
      brand_content_toggle: Boolean(input.brandContentToggle),
      brand_organic_toggle: Boolean(input.brandOrganicToggle),
      video_cover_timestamp_ms: 1000,
    },
    source_info: {
      source: "PULL_FROM_URL",
      video_url: videoUrl,
    },
  };

  const initRes = await fetch(`${TIKTOK_API}/post/publish/video/init/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(initPayload),
  });
  const initData = (await initRes.json()) as {
    data?: { publish_id?: string };
    error?: TikTokError;
  };

  if ((!initRes.ok || initData.error?.code) && initData.error?.code !== "ok") {
    const inboxRes = await fetch(`${TIKTOK_API}/post/publish/inbox/video/init/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        source_info: { source: "PULL_FROM_URL", video_url: videoUrl },
      }),
    });
    const inboxData = (await inboxRes.json()) as {
      data?: { publish_id?: string };
      error?: TikTokError;
    };
    if (!inboxRes.ok || !inboxData.data?.publish_id) {
      return {
        ok: false,
        error: describeTikTokError(
          initData.error || inboxData.error,
          "TikTok video init failed. Enable Direct Post and verify the video domain.",
        ),
        config: working,
      };
    }
    return {
      ok: true,
      id: inboxData.data.publish_id,
      mode: "draft_inbox",
      username: working.tiktokUsername || "",
      message: "Video sent to TikTok inbox as a draft.",
      config: working,
      privacyLevelOptions: privacyOptions,
    };
  }

  const publishId = initData.data?.publish_id;
  if (!publishId) {
    return { ok: false, error: "TikTok init failed: missing publish_id.", config: working };
  }

  await wait(3000);
  const polled = await pollTikTokPublishStatus(publishId, accessToken);
  if (polled.status === "FAILED") {
    return {
      ok: false,
      error: `TikTok publishing failed: ${polled.failReason || "Unknown reason"}`,
      config: working,
    };
  }

  return {
    ok:
      polled.status === "PUBLISH_COMPLETE" ||
      polled.status === "PROCESSING_DOWNLOAD" ||
      polled.status === "PROCESSING_UPLOAD",
    id: polled.publicId || publishId,
    publishId,
    mode: "direct",
    status: polled.status,
    username: working.tiktokUsername || "",
    message:
      polled.status === "PUBLISH_COMPLETE"
        ? "Video published to TikTok."
        : `TikTok upload status: ${polled.status || "processing"}.`,
    config: working,
    privacyLevelOptions: privacyOptions,
  };
}

export async function publishToTikTok(input: Record<string, unknown>, config: SocialConfig) {
  const hasPhotos =
    normalizeTikTokPhotoUrls(input.photoUrls ?? input.images ?? input.photos ?? input.photo_images)
      .length > 0;
  const hasVideo = /^https:\/\//i.test(String(input.videoUrl ?? input.video ?? "").trim());

  if (hasPhotos) return publishTikTokPhotos(input, config);
  if (hasVideo) return publishTikTokVideo(input, config);
  return { ok: false, error: "Provide photoUrls (property images) or videoUrl for TikTok.", config };
}
