const VISITOR_KEY = "mm-visitor";
const LANDED_KEY = "mm-landed";
const RECENT_KEY = "mm-track-recent";
const ORIGIN_KEY = "mm-origin";

function visitorId() {
  const existing = localStorage.getItem(VISITOR_KEY) ?? "";
  if (/^[0-9a-f-]{16,40}$/i.test(existing)) return existing;
  const next = crypto.randomUUID();
  localStorage.setItem(VISITOR_KEY, next);
  return next;
}

function localeNow() {
  const lang = new URLSearchParams(window.location.search).get("lang");
  if (lang === "es" || lang === "en") return lang;
  return localStorage.getItem("mm-locale") === "es" ? "es" : "en";
}

function campaignNow() {
  const params = new URLSearchParams(window.location.search);
  return ["utm_source", "utm_medium", "utm_campaign"]
    .map((key) => params.get(key)?.trim() ?? "")
    .filter(Boolean)
    .join(" / ")
    .slice(0, 160);
}

/** Keep the first referrer for the whole tab, so later pages stay tied to where they arrived from. */
function origin() {
  const saved = sessionStorage.getItem(ORIGIN_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as { referrer?: string; utm?: string };
      return { referrer: parsed.referrer ?? "", utm: parsed.utm ?? "" };
    } catch {
      /* Read it again from this page. */
    }
  }
  const value = { referrer: document.referrer, utm: campaignNow() };
  sessionStorage.setItem(ORIGIN_KEY, JSON.stringify(value));
  return value;
}

/** Record one arrival per browser tab, then each later page in that same visit. */
export function trackPage(path: string) {
  if (path === "/admin") return;
  const landing = sessionStorage.getItem(LANDED_KEY) !== "1";
  if (landing) sessionStorage.setItem(LANDED_KEY, "1");
  const now = Date.now();
  const recent = sessionStorage.getItem(RECENT_KEY) ?? "";
  const [previousPath, previousAt] = recent.split("@");
  if (previousPath === path && now - Number(previousAt) < 4000) return;
  sessionStorage.setItem(RECENT_KEY, `${path}@${now}`);
  const { referrer, utm } = origin();

  void fetch("/api/visits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      visitorId: visitorId(),
      path,
      referrer,
      locale: localeNow(),
      language: navigator.language,
      width: window.innerWidth,
      landing,
      utm,
    }),
    keepalive: true,
  }).catch(() => undefined);
}

/** Details from this visit, attached when someone chooses to leave their contact details. */
export function leadMeta() {
  const { referrer, utm } = origin();
  return {
    visitorId: visitorId(),
    path: window.location.pathname,
    referrer,
    utm,
    locale: localeNow(),
  };
}
