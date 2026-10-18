import { useEffect, useMemo, useState } from "react";
import { loadProperties, propertyHref, propertyTitle, type Property } from "@/lib/properties";
import { SITE_URL } from "@/lib/seo";

type SocialTopic = {
  id: string;
  label: string;
  title: string;
  meta: string;
  area: string;
};

type SocialStatus = {
  ok: boolean;
  facebook: boolean;
  instagram: boolean;
  tiktok: boolean;
  oauth: boolean;
  instagramOauth: boolean;
  tiktokOauth: boolean;
  ai: boolean;
  topics: SocialTopic[];
  pageName: string;
  pages: { id: string; name: string }[];
  selectedPageId: string;
  hasToken: boolean;
  instagramUsername: string;
  tiktokUsername: string;
  lastError: string;
  instagramLastError: string;
  tiktokLastError: string;
};

type Phase = "idle" | "connecting" | "generating" | "posting" | "posted" | "error";
type BannerTone = "info" | "working" | "success" | "error";

type Props = {
  password: string;
  onAuthFail: () => void;
};

export function AdminSocialPanel({ password, onAuthFail }: Props) {
  const [social, setSocial] = useState<SocialStatus | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [bannerTone, setBannerTone] = useState<BannerTone>("info");
  const [bannerTitle, setBannerTitle] = useState("");
  const [message, setMessage] = useState("");
  const [catalog, setCatalog] = useState<Property[]>([]);
  const [propertyQuery, setPropertyQuery] = useState("");
  const [propertyPage, setPropertyPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [postLocale, setPostLocale] = useState("en");
  const [tone, setTone] = useState<"sales" | "soft">("sales");
  const [notes, setNotes] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [postLink, setPostLink] = useState(`${SITE_URL}/`);
  const [postImage, setPostImage] = useState(`${SITE_URL}/media/costa-marbella.jpg`);
  const [postVideo, setPostVideo] = useState("");
  const [tiktokPrivacy, setTiktokPrivacy] = useState("SELF_ONLY");
  const [withPhoto, setWithPhoto] = useState(true);
  const [postFacebook, setPostFacebook] = useState(true);
  const [postInstagram, setPostInstagram] = useState(true);
  const [genSource, setGenSource] = useState("");

  const busy = phase === "connecting" || phase === "generating" || phase === "posting";

  const showBanner = (nextTone: BannerTone, title: string, text: string, nextPhase: Phase = "idle") => {
    setBannerTone(nextTone);
    setBannerTitle(title);
    setMessage(text);
    setPhase(nextPhase);
  };

  const loadSocial = async () => {
    const response = await fetch("/api/social", { headers: { "x-admin-password": password } });
    if (response.status === 401) {
      onAuthFail();
      return;
    }
    if (!response.ok) return;
    setSocial((await response.json()) as SocialStatus);
  };

  useEffect(() => {
    void loadSocial();
    void loadProperties().then(setCatalog);

    const params = new URLSearchParams(window.location.search);
    const fb = params.get("fb");
    const ig = params.get("ig");
    const tt = params.get("tt");
    const msg = params.get("msg");
    if (fb === "connected" || ig === "connected" || tt === "connected") {
      showBanner("success", "Connected", msg || "Account connected.");
    }
    if (fb === "error" || ig === "error" || tt === "error") {
      showBanner("error", "Error", msg || "Connection failed.", "error");
    }
    if (fb || ig || tt) window.history.replaceState({}, "", "/admin");
  }, [password]);

  const selectedProperty = useMemo(
    () => catalog.find((item) => item.id === selectedPropertyId) ?? null,
    [catalog, selectedPropertyId],
  );

  const filteredCatalog = useMemo(() => {
    const needle = propertyQuery.trim().toLowerCase();
    if (!needle) return catalog;
    return catalog.filter((item) =>
      [item.ref, item.id, item.title, item.city, item.type, item.priceLabel, ...Object.values(item.titles)]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [catalog, propertyQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredCatalog.length / pageSize));
  const currentPage = Math.min(propertyPage, totalPages);
  const pagedCatalog = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCatalog.slice(start, start + pageSize);
  }, [filteredCatalog, currentPage, pageSize]);

  useEffect(() => {
    setPropertyPage(1);
  }, [propertyQuery, pageSize]);

  function propertyPayload(property: Property) {
    const title = propertyTitle(property, postLocale);
    const meta = [
      property.built ? `${property.built} m²` : "",
      property.beds ? `${property.beds} bed` : "",
      property.baths ? `${property.baths} bath` : "",
      property.priceLabel,
    ]
      .filter(Boolean)
      .join(" · ");
    return {
      id: property.id,
      title,
      meta,
      area: property.city || "Costa del Sol",
      image: property.image,
      href: `${SITE_URL}${propertyHref(property)}`,
    };
  }

  function chooseProperty(property: Property | null) {
    setSelectedPropertyId(property?.id ?? "");
    if (!property) {
      setPostLink(`${SITE_URL}/`);
      setPostImage(`${SITE_URL}/media/costa-marbella.jpg`);
      return;
    }
    const payload = propertyPayload(property);
    setPostLink(payload.href);
    setPostImage(payload.image);
  }

  const socialCall = async (body: Record<string, unknown>) => {
    const response = await fetch("/api/social", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify(body),
    });
    const payload = (await response.json()) as Record<string, unknown>;
    if (response.status === 401) {
      onAuthFail();
      return null;
    }
    if (!response.ok || payload.ok === false) {
      showBanner("error", "Error", String(payload.error || "Request failed."), "error");
      return null;
    }
    return payload;
  };

  const connect = async (network: "facebook" | "instagram" | "tiktok") => {
    const action =
      network === "facebook"
        ? "facebook-connect"
        : network === "instagram"
          ? "instagram-connect"
          : "tiktok-connect";
    showBanner("working", "Connecting", `Opening ${network}…`, "connecting");
    const result = await socialCall({ action });
    if (!result) return;
    const url = String(result.url || "");
    if (!url) {
      showBanner("error", "Error", "Login URL was empty.", "error");
      return;
    }
    window.location.href = url;
  };

  const disconnect = async (network: "facebook" | "instagram" | "tiktok") => {
    const label = network === "facebook" ? "Facebook" : network === "instagram" ? "Instagram" : "TikTok";
    if (!window.confirm(`Disconnect ${label}?`)) return;
    showBanner("working", "Working", `Disconnecting ${label}…`, "connecting");
    const action =
      network === "facebook"
        ? "facebook-disconnect"
        : network === "instagram"
          ? "instagram-disconnect"
          : "tiktok-disconnect";
    const result = await socialCall({ action });
    if (!result) return;
    setSocial(result as unknown as SocialStatus);
    showBanner("info", "Disconnected", `${label} disconnected.`);
  };

  const selectPage = async (pageId: string) => {
    const result = await socialCall({ action: "facebook-select-page", pageId });
    if (!result) return;
    setSocial(result as unknown as SocialStatus);
    showBanner("info", "Page", `Using ${String(result.pageName || pageId)}.`);
  };

  const generatePost = async () => {
    showBanner("working", "Generating", "Writing caption…", "generating");
    const result = await socialCall({
      action: "generate",
      topicId: selectedProperty ? "listing" : "general",
      locale: postLocale,
      tone,
      notes,
      ...(selectedProperty ? { property: propertyPayload(selectedProperty) } : {}),
    });
    if (!result) return;
    setCaption(String(result.caption ?? ""));
    setHashtags(String(result.hashtags ?? ""));
    if (result.link) setPostLink(String(result.link));
    if (result.image) setPostImage(String(result.image));
    setGenSource(String(result.source || "ai"));
    showBanner("success", "Draft ready", "Edit the caption, then post.");
  };

  const publishNow = async () => {
    const messageText = `${caption.trim()}\n\n${hashtags.trim()}`.trim();
    if (messageText.length < 8) {
      showBanner("error", "Error", "Write or generate a caption first.", "error");
      return;
    }
    if (!postFacebook && !postInstagram) {
      showBanner("error", "Error", "Choose Facebook and/or Instagram.", "error");
      return;
    }
    if (postFacebook && !social?.facebook) {
      showBanner("error", "Error", "Connect Facebook first.", "error");
      return;
    }
    if (postInstagram && !social?.instagram) {
      showBanner("error", "Error", "Connect Instagram first.", "error");
      return;
    }
    if (postInstagram && (!withPhoto || !/^https:\/\//i.test(postImage.trim()))) {
      showBanner("error", "Error", "Instagram needs a public https image.", "error");
      return;
    }

    const targets = [
      postFacebook ? "Facebook" : null,
      postInstagram ? "Instagram" : null,
    ].filter(Boolean);
    showBanner("working", "Posting", `Posting to ${targets.join(" & ")}…`, "posting");

    const result = await socialCall({
      action: "publish-now",
      message: messageText,
      image: postImage.trim(),
      link: postLink.trim(),
      withPhoto,
      facebook: postFacebook,
      instagram: postInstagram,
    });
    if (!result) return;

    const fb = result.facebook as { ok?: boolean; error?: string } | undefined;
    const ig = result.instagram as { ok?: boolean; error?: string; username?: string } | undefined;
    const parts: string[] = [];
    if (postFacebook) parts.push(fb?.ok ? "Facebook posted" : `Facebook failed: ${fb?.error || "error"}`);
    if (postInstagram) {
      parts.push(
        ig?.ok
          ? `Instagram posted${ig.username ? ` (@${ig.username})` : ""}`
          : `Instagram failed: ${ig?.error || "error"}`,
      );
    }
    if (result.ok) showBanner("success", "Posted", parts.join(" · "), "posted");
    else showBanner("error", "Error", parts.join(" · "), "error");
    await loadSocial();
  };

  const publishTikTok = async () => {
    const messageText = `${caption.trim()}\n\n${hashtags.trim()}`.trim();
    if (!social?.tiktok) {
      showBanner("error", "Error", "Connect TikTok first.", "error");
      return;
    }
    if (messageText.length < 8) {
      showBanner("error", "Error", "Write a caption first.", "error");
      return;
    }
    const hasVideo = /^https:\/\//i.test(postVideo.trim());
    if (!selectedProperty && !hasVideo) {
      showBanner("error", "Error", "Select a property or paste a TikTok video URL.", "error");
      return;
    }
    showBanner("working", "Posting", "Posting to TikTok…", "posting");
    const result = await socialCall({
      action: "publish-tiktok",
      message: messageText,
      title: caption.trim().split("\n")[0] || "",
      privacyLevel: tiktokPrivacy,
      locale: postLocale,
      ...(selectedProperty && !hasVideo
        ? { propertyId: selectedProperty.id }
        : { videoUrl: postVideo.trim() }),
    });
    if (!result) return;
    showBanner(
      "success",
      "Posted",
      String(result.message || `Posted to TikTok${result.id ? ` · ${String(result.id)}` : ""}.`),
      "posted",
    );
    await loadSocial();
  };

  return (
    <div className="mt-8 space-y-5">
      {message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            bannerTone === "error"
              ? "border-[#f0b4b4]/40 bg-[#f0b4b4]/10 text-[#f0b4b4]"
              : bannerTone === "success"
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                : bannerTone === "working"
                  ? "border-amber-300/30 bg-amber-300/10 text-amber-100"
                  : "border-white/10 bg-white/[0.04] text-foreground-muted"
          }`}
        >
          <p className="text-[10px] tracking-[0.16em] uppercase opacity-80">{bannerTitle || "Status"}</p>
          <p className="mt-1">{message}</p>
        </div>
      ) : null}

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02]">
        <div className="border-b border-white/10 px-5 py-4 md:px-6">
          <p className="text-[11px] tracking-[0.18em] text-foreground-subtle uppercase">Step 1 · Connect</p>
          <h2 className="mt-1 font-serif text-2xl">Accounts</h2>
        </div>

        <div className="divide-y divide-white/10">
          {(
            [
              {
                key: "facebook" as const,
                label: "Facebook Page",
                ready: Boolean(social?.oauth),
                connected: Boolean(social?.facebook && social.hasToken),
                detail: social?.facebook ? social.pageName || "Connected" : social?.oauth ? "Not connected" : "Missing env keys",
                color: "bg-[#1877f2]",
              },
              {
                key: "instagram" as const,
                label: "Instagram",
                ready: Boolean(social?.instagramOauth),
                connected: Boolean(social?.instagram),
                detail: social?.instagram
                  ? social.instagramUsername
                    ? `@${social.instagramUsername}`
                    : "Connected"
                  : social?.instagramOauth
                    ? "Not connected"
                    : "Missing env keys",
                color: "bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af]",
              },
              {
                key: "tiktok" as const,
                label: "TikTok",
                ready: Boolean(social?.tiktokOauth),
                connected: Boolean(social?.tiktok),
                detail: social?.tiktok
                  ? social.tiktokUsername
                    ? `@${social.tiktokUsername}`
                    : "Connected"
                  : social?.tiktokOauth
                    ? "Not connected"
                    : "Missing env keys",
                color: "bg-black",
              },
            ] as const
          ).map((row) => (
            <div key={row.key} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-6">
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${row.connected ? "bg-emerald-400" : "bg-white/30"}`} />
                <div>
                  <p className="text-[11px] tracking-[0.16em] text-foreground-subtle uppercase">{row.label}</p>
                  <p className="mt-1 text-sm text-foreground">{row.detail}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {row.connected ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void disconnect(row.key)}
                    className="h-10 cursor-pointer rounded-full border border-white/20 px-5 text-[11px] tracking-[0.12em] uppercase transition hover:border-white/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busy || !row.ready}
                    onClick={() => void connect(row.key)}
                    className={`h-10 cursor-pointer rounded-full px-5 text-[11px] font-semibold tracking-[0.12em] text-white uppercase shadow-md transition hover:brightness-110 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 ${row.color}`}
                  >
                    {phase === "connecting" ? "Connecting…" : "Connect"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {social?.pages && social.pages.length > 1 ? (
          <div className="border-t border-white/10 px-5 py-4 md:px-6">
            <label className="block text-[11px] tracking-[0.16em] text-foreground-subtle uppercase">
              Facebook Page
              <select
                value={social.selectedPageId}
                onChange={(event) => void selectPage(event.target.value)}
                disabled={busy}
                className="mt-2 w-full max-w-md rounded-full border border-white/15 bg-black/20 px-4 py-2.5 text-sm tracking-normal text-foreground normal-case outline-none"
              >
                {social.pages.map((page) => (
                  <option key={page.id} value={page.id} className="bg-[#14161a]">
                    {page.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}

        {(social?.lastError || social?.instagramLastError || social?.tiktokLastError) && (
          <p className="border-t border-white/10 px-5 py-3 text-sm text-[#f0b4b4] md:px-6">
            {social.lastError || social.instagramLastError || social.tiktokLastError}
          </p>
        )}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-foreground-subtle uppercase">Step 2 · Property</p>
            <h2 className="mt-1 font-serif text-2xl md:text-3xl">Choose a listing</h2>
          </div>
          <p className="text-sm text-foreground-muted">
            {filteredCatalog.length === catalog.length
              ? `${catalog.length} properties`
              : `${filteredCatalog.length} of ${catalog.length} properties`}
          </p>
        </div>
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={propertyQuery}
              onChange={(event) => setPropertyQuery(event.target.value)}
              placeholder="Search by town, ref, title, price…"
              className="h-11 w-full rounded-full border border-white/15 bg-black/20 px-4 text-sm outline-none sm:max-w-md"
            />
            <button
              type="button"
              onClick={() => chooseProperty(null)}
              className={`h-11 shrink-0 cursor-pointer rounded-full border px-4 text-[11px] font-semibold tracking-[0.12em] uppercase transition hover:bg-white/10 ${
                !selectedPropertyId
                  ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-100"
                  : "border-white/15 text-foreground-muted"
              }`}
            >
              {!selectedPropertyId ? "✓ General brand post" : "General brand post"}
            </button>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-[11px] tracking-[0.12em] text-foreground-subtle uppercase">
            Per page
            <select
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value) || 12)}
              className="h-10 cursor-pointer rounded-full border border-white/15 bg-black/20 px-3 text-sm tracking-normal text-foreground normal-case outline-none"
            >
              <option value={12} className="bg-[#14161a]">12</option>
              <option value={24} className="bg-[#14161a]">24</option>
              <option value={48} className="bg-[#14161a]">48</option>
            </select>
          </label>
        </div>

        {selectedProperty ? (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-400/35 bg-emerald-400/10 px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-base font-bold text-black">
              ✓
            </span>
            <div className="min-w-0">
              <p className="text-[10px] tracking-[0.16em] text-emerald-200/80 uppercase">Selected listing</p>
              <p className="truncate text-sm text-foreground">
                {propertyTitle(selectedProperty, postLocale)}
                {selectedProperty.ref ? ` · Ref ${selectedProperty.ref}` : ""}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-foreground-muted">
            Click a property card to select it — a green tick will appear on the image.
          </p>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {catalog.length === 0 ? (
            <p className="text-sm text-foreground-muted sm:col-span-2 xl:col-span-3">Loading properties…</p>
          ) : pagedCatalog.length === 0 ? (
            <p className="text-sm text-foreground-muted sm:col-span-2 xl:col-span-3">No properties match that search.</p>
          ) : (
            pagedCatalog.map((item) => {
              const active = selectedPropertyId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseProperty(item)}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl border text-left transition duration-200 ${
                    active
                      ? "border-emerald-400/70 bg-emerald-400/10 shadow-[0_0_0_1px_rgba(52,211,153,0.35)]"
                      : "border-white/10 bg-black/10 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-black/20"
                  }`}
                >
                  <div className="relative aspect-[16/10] bg-white/5">
                    <img
                      src={item.image}
                      alt=""
                      className={`absolute inset-0 h-full w-full object-cover transition duration-200 ${
                        active ? "brightness-90" : "group-hover:scale-[1.03]"
                      }`}
                    />
                    {active ? (
                      <span className="absolute inset-0 bg-emerald-500/15" />
                    ) : (
                      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                    )}
                    <span
                      className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold shadow-lg transition ${
                        active
                          ? "scale-100 bg-emerald-400 text-black"
                          : "scale-90 bg-black/45 text-white/70 opacity-0 group-hover:opacity-100"
                      }`}
                      aria-hidden
                    >
                      ✓
                    </span>
                    {active ? (
                      <span className="absolute bottom-3 left-3 rounded-full bg-emerald-400 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-black uppercase">
                        Selected
                      </span>
                    ) : null}
                  </div>
                  <div className="px-4 py-3">
                    <span className="block text-[11px] tracking-[0.14em] text-foreground-subtle uppercase">
                      {item.city || item.type} · Ref {item.ref}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-sm font-medium">
                      {propertyTitle(item, postLocale)}
                    </span>
                    {item.priceLabel ? (
                      <span className="mt-1 block text-xs text-foreground-muted">{item.priceLabel}</span>
                    ) : null}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {filteredCatalog.length > 0 ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <p className="text-xs text-foreground-subtle">
              Showing {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filteredCatalog.length)} of {filteredCatalog.length}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPropertyPage((page) => Math.max(1, page - 1))}
                className="h-9 cursor-pointer rounded-full border border-white/15 px-4 text-[11px] tracking-[0.12em] uppercase transition hover:border-white/35 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter((page) => {
                  if (totalPages <= 7) return true;
                  if (page === 1 || page === totalPages) return true;
                  return Math.abs(page - currentPage) <= 1;
                })
                .reduce<(number | "…")[]>((acc, page, index, list) => {
                  if (index > 0) {
                    const prev = list[index - 1];
                    if (typeof prev === "number" && page - prev > 1) acc.push("…");
                  }
                  acc.push(page);
                  return acc;
                }, [])
                .map((item, index) =>
                  item === "…" ? (
                    <span key={`gap-${index}`} className="px-1 text-foreground-subtle">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPropertyPage(item)}
                      className={`h-9 min-w-9 cursor-pointer rounded-full border px-3 text-[11px] tracking-[0.08em] transition ${
                        item === currentPage
                          ? "border-white/40 bg-white text-black"
                          : "border-white/15 text-foreground-muted hover:border-white/35 hover:bg-white/10"
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPropertyPage((page) => Math.min(totalPages, page + 1))}
                className="h-9 cursor-pointer rounded-full border border-white/15 px-4 text-[11px] tracking-[0.12em] uppercase transition hover:border-white/35 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
        <p className="text-[11px] tracking-[0.18em] text-foreground-subtle uppercase">Step 3 · Write & post</p>
        <h2 className="mt-1 font-serif text-2xl md:text-3xl">Caption</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="block text-[11px] tracking-[0.16em] text-foreground-subtle uppercase">
            Language
            <select
              value={postLocale}
              onChange={(event) => setPostLocale(event.target.value)}
              className="mt-2 w-full rounded-full border border-white/15 bg-black/20 px-4 py-2.5 text-sm tracking-normal normal-case outline-none"
            >
              <option value="en" className="bg-[#14161a]">English</option>
              <option value="es" className="bg-[#14161a]">Spanish</option>
              <option value="de" className="bg-[#14161a]">German</option>
              <option value="nl" className="bg-[#14161a]">Dutch</option>
              <option value="sv" className="bg-[#14161a]">Swedish</option>
            </select>
          </label>
          <label className="block text-[11px] tracking-[0.16em] text-foreground-subtle uppercase">
            Tone
            <select
              value={tone}
              onChange={(event) => setTone(event.target.value === "soft" ? "soft" : "sales")}
              className="mt-2 w-full rounded-full border border-white/15 bg-black/20 px-4 py-2.5 text-sm tracking-normal normal-case outline-none"
            >
              <option value="sales" className="bg-[#14161a]">Sales</option>
              <option value="soft" className="bg-[#14161a]">Soft / warm</option>
            </select>
          </label>
          <label className="block text-[11px] tracking-[0.16em] text-foreground-subtle uppercase">
            Notes for AI
            <input
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Sea views, pool…"
              className="mt-2 w-full rounded-full border border-white/15 bg-black/20 px-4 py-2.5 text-sm tracking-normal normal-case outline-none"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => void generatePost()}
            className="h-11 cursor-pointer rounded-full bg-white px-6 text-[11px] font-semibold tracking-[0.14em] text-black uppercase shadow-md transition hover:bg-white/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {phase === "generating" ? "Generating…" : "Generate with AI"}
          </button>
          {genSource ? (
            <span className="self-center text-[10px] tracking-[0.14em] text-foreground-subtle uppercase">
              {genSource === "ai" ? "AI draft" : "Template draft"}
            </span>
          ) : null}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="space-y-4">
            <label className="block text-[11px] tracking-[0.16em] text-foreground-subtle uppercase">
              Caption
              <textarea
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                rows={8}
                className="mt-2 w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm tracking-normal normal-case outline-none"
              />
            </label>
            <label className="block text-[11px] tracking-[0.16em] text-foreground-subtle uppercase">
              Hashtags
              <textarea
                value={hashtags}
                onChange={(event) => setHashtags(event.target.value)}
                rows={2}
                className="mt-2 w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm tracking-normal normal-case outline-none"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-[11px] tracking-[0.16em] text-foreground-subtle uppercase">
                Link
                <input
                  value={postLink}
                  onChange={(event) => setPostLink(event.target.value)}
                  className="mt-2 w-full rounded-full border border-white/15 bg-black/20 px-4 py-2.5 text-sm tracking-normal normal-case outline-none"
                />
              </label>
              <label className="block text-[11px] tracking-[0.16em] text-foreground-subtle uppercase">
                Image URL
                <input
                  value={postImage}
                  onChange={(event) => setPostImage(event.target.value)}
                  className="mt-2 w-full rounded-full border border-white/15 bg-black/20 px-4 py-2.5 text-sm tracking-normal normal-case outline-none"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground-muted">
                <input
                  type="checkbox"
                  checked={withPhoto}
                  onChange={(e) => setWithPhoto(e.target.checked)}
                  className="cursor-pointer"
                />
                Include photo
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground-muted">
                <input
                  type="checkbox"
                  checked={postFacebook}
                  disabled={!social?.facebook}
                  onChange={(e) => setPostFacebook(e.target.checked)}
                  className="cursor-pointer disabled:cursor-not-allowed"
                />
                Facebook
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground-muted">
                <input
                  type="checkbox"
                  checked={postInstagram}
                  disabled={!social?.instagram}
                  onChange={(e) => setPostInstagram(e.target.checked)}
                  className="cursor-pointer disabled:cursor-not-allowed"
                />
                Instagram
              </label>
            </div>
          </div>

          <aside className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="px-1 text-[10px] tracking-[0.16em] text-foreground-subtle uppercase">Preview</p>
            {postImage ? (
              <img src={postImage} alt="" className="mt-2 aspect-[4/3] w-full rounded-xl object-cover" />
            ) : (
              <div className="mt-2 flex aspect-[4/3] items-center justify-center rounded-xl bg-white/5 text-xs text-foreground-subtle">
                No image
              </div>
            )}
            <p className="mt-3 line-clamp-6 whitespace-pre-wrap px-1 text-xs text-foreground-muted">
              {caption || "Your caption will appear here."}
            </p>
          </aside>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
          <button
            type="button"
            disabled={busy || !caption.trim()}
            onClick={() => void publishNow()}
            className="h-12 min-w-[12rem] cursor-pointer rounded-full bg-white px-8 text-[11px] font-semibold tracking-[0.16em] text-black uppercase shadow-lg transition hover:bg-white/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40"
          >
            {phase === "posting" ? "Posting…" : "Post now"}
          </button>
          <button
            type="button"
            disabled={
              busy ||
              !caption.trim() ||
              !social?.tiktok ||
              (!selectedProperty && !/^https:\/\//i.test(postVideo.trim()))
            }
            onClick={() => void publishTikTok()}
            className="h-12 cursor-pointer rounded-full border border-white/20 bg-black px-6 text-[11px] font-semibold tracking-[0.14em] text-white uppercase shadow-md transition hover:border-white/40 hover:bg-[#111] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Post to TikTok
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-[11px] tracking-[0.16em] text-foreground-subtle uppercase">
            TikTok video URL (optional)
            <input
              value={postVideo}
              onChange={(event) => setPostVideo(event.target.value)}
              placeholder="Leave empty to post property photos"
              className="mt-2 w-full rounded-full border border-white/15 bg-black/20 px-4 py-2.5 text-sm tracking-normal normal-case outline-none"
            />
          </label>
          <label className="block text-[11px] tracking-[0.16em] text-foreground-subtle uppercase">
            TikTok privacy
            <select
              value={tiktokPrivacy}
              onChange={(event) => setTiktokPrivacy(event.target.value)}
              className="mt-2 w-full rounded-full border border-white/15 bg-black/20 px-4 py-2.5 text-sm tracking-normal normal-case outline-none"
            >
              <option value="SELF_ONLY" className="bg-[#14161a]">Self only</option>
              <option value="MUTUAL_FOLLOW_FRIENDS" className="bg-[#14161a]">Friends</option>
              <option value="FOLLOWER_OF_CREATOR" className="bg-[#14161a]">Followers</option>
              <option value="PUBLIC_TO_EVERYONE" className="bg-[#14161a]">Public</option>
            </select>
          </label>
        </div>
      </section>
    </div>
  );
}
