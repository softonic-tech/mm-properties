import { useEffect, useMemo, useState, type ReactNode } from "react";

type Visit = {
  id: string;
  at: string;
  locale: "en" | "es";
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

type Lead = {
  email: string;
  name: string;
  phone: string;
  note: string;
  joinedAt: string;
  path: string;
  source: string;
  locale: "en" | "es";
};

type AdminData = {
  leads: Lead[];
  visits: Visit[];
  settings: { tracking: boolean; retain: number };
  storage: "atlas" | "file" | "blob" | "temporary";
};

type Tab = "overview" | "traffic" | "subscribers" | "settings";

const PASSWORD_KEY = "mm-admin-password";

const storageNote: Record<AdminData["storage"], string> = {
  atlas: "Every landing, subscriber and setting is saved in MongoDB Atlas.",
  file: "Every landing is saved in the data folder on this server.",
  blob: "Every landing is saved in Vercel Blob, so it stays after each deploy.",
  temporary:
    "This server cannot keep a database, so landings disappear when it restarts. Connect a Vercel Blob store and set BLOB_READ_WRITE_TOKEN.",
};

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function dayKey(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function countryName(code: string) {
  if (!code) return "—";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

function sourceLabel(visit: Visit) {
  return visit.source || "Earlier visit";
}

function pageLabel(visit: Visit) {
  return visit.path || "Not recorded";
}

function tally(names: string[]) {
  const counts = new Map<string, number>();
  for (const name of names) counts.set(name, (counts.get(name) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function download(filename: string, rows: string[][]) {
  const text = rows
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function Stat({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
      <p className="text-[11px] tracking-[0.16em] text-foreground-subtle uppercase">{label}</p>
      <p className="mt-2 font-serif text-4xl tabular-nums">{value.toLocaleString()}</p>
      <p className="mt-1 text-sm text-foreground-muted">{note}</p>
    </article>
  );
}

function Meter({ name, count, max }: { name: string; count: number; max: number }) {
  return (
    <div className="grid grid-cols-[minmax(0,8rem)_1fr_2rem] items-center gap-3 text-sm">
      <span className="truncate">{name}</span>
      <span className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <span className="block h-full rounded-full bg-[#d7dee6]" style={{ width: `${max ? (count / max) * 100 : 0}%` }} />
      </span>
      <span className="text-right tabular-nums text-foreground-subtle">{count}</span>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-sm tracking-[0.14em] text-foreground-subtle uppercase">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function AdminPage() {
  const [password, setPassword] = useState(() => sessionStorage.getItem(PASSWORD_KEY) ?? "");
  const [draft, setDraft] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [query, setQuery] = useState("");
  const [landingsOnly, setLandingsOnly] = useState(false);
  const [showBots, setShowBots] = useState(false);
  const [tracking, setTracking] = useState(true);
  const [retain, setRetain] = useState("5000");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async (next: string) => {
    setError("");
    const response = await fetch("/api/admin", { headers: { "x-admin-password": next } });
    if (!response.ok) {
      sessionStorage.removeItem(PASSWORD_KEY);
      setPassword("");
      setData(null);
      setError("That password is not correct.");
      return;
    }
    const payload = (await response.json()) as AdminData;
    sessionStorage.setItem(PASSWORD_KEY, next);
    setPassword(next);
    setData(payload);
  };

  useEffect(() => {
    if (password) void load(password);
  }, [password]);

  useEffect(() => {
    if (!data) return;
    setTracking(data.settings.tracking);
    setRetain(String(data.settings.retain));
  }, [data]);

  const stats = useMemo(() => {
    const visits = data?.visits ?? [];
    const people = visits.filter((visit) => !visit.bot);
    const arrivals = people.filter((visit) => visit.landing);
    const today = dayKey(new Date().toISOString());
    const days = Array.from({ length: 14 }, (_, index) => {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() - (13 - index));
      const key = dayKey(date.toISOString());
      return {
        key,
        label: date.toLocaleDateString(undefined, { day: "numeric" }),
        landings: arrivals.filter((visit) => dayKey(visit.at) === key).length,
      };
    });
    return {
      landings: arrivals.length,
      today: arrivals.filter((visit) => dayKey(visit.at) === today).length,
      views: people.length,
      unique: new Set(people.map((visit) => visit.visitorId || visit.id)).size,
      days,
      sources: tally(arrivals.map(sourceLabel)).slice(0, 6),
      pages: tally(people.map(pageLabel)).slice(0, 6),
      locales: tally(arrivals.map((visit) => (visit.locale === "es" ? "Spanish" : "English"))),
      devices: tally(arrivals.map((visit) => visit.device).filter(Boolean)),
      countries: tally(arrivals.map((visit) => countryName(visit.country)).filter((name) => name !== "—")),
    };
  }, [data]);

  const traffic = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (data?.visits ?? []).filter((visit) => {
      if (!showBots && visit.bot) return false;
      if (landingsOnly && !visit.landing) return false;
      if (!needle) return true;
      return [pageLabel(visit), sourceLabel(visit), visit.referrer, visit.utm, visit.locale, visit.device]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [data, landingsOnly, query, showBots]);

  const subscribers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (data?.leads ?? []).filter(
      (lead) => !needle || `${lead.name} ${lead.phone} ${lead.email} ${lead.note} ${lead.path}`.toLowerCase().includes(needle),
    );
  }, [data, query]);

  const change = async (body: Record<string, unknown>) => {
    setBusy(true);
    setNotice("");
    setError("");
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify(body),
      });
      if (response.status === 401) {
        sessionStorage.removeItem(PASSWORD_KEY);
        setPassword("");
        setData(null);
        setError("That password is not correct.");
        return false;
      }
      if (!response.ok) {
        setError("That could not be saved.");
        return false;
      }
      setData((await response.json()) as AdminData);
      setNotice("Saved.");
      return true;
    } catch {
      setError("The server did not answer.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const lock = () => {
    sessionStorage.removeItem(PASSWORD_KEY);
    setPassword("");
    setData(null);
    setDraft("");
    setNotice("");
  };

  if (!data) {
    return (
      <main className="min-h-svh bg-background px-5 py-10 text-foreground md:px-10">
        <div className="mx-auto max-w-sm">
          <a href="/" className="text-sm text-foreground-muted">
            ← M&M Property
          </a>
          <h1 className="mt-6 font-serif text-4xl">Admin</h1>
          <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
            Traffic, subscribers, and the settings for this site.
          </p>
          {password ? (
            <p className="mt-8 text-sm text-foreground-muted">Opening…</p>
          ) : (
            <form
              className="mt-8 flex flex-col gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                setPassword(draft);
              }}
            >
              <label className="text-[11px] tracking-[0.16em] text-foreground-subtle uppercase">
                Password
                <input
                  type="password"
                  autoComplete="current-password"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  className="mt-2 w-full rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm tracking-normal text-foreground normal-case outline-none"
                />
              </label>
              {error ? <p className="text-sm text-foreground-muted">{error}</p> : null}
              <button
                type="submit"
                className="h-11 rounded-full bg-white text-[11px] font-semibold tracking-[0.14em] text-black uppercase"
              >
                Open
              </button>
            </form>
          )}
        </div>
      </main>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "traffic", label: "Traffic" },
    { id: "subscribers", label: `Subscribers · ${data.leads.length}` },
    { id: "settings", label: "Settings" },
  ];

  return (
    <main className="min-h-svh bg-background px-5 py-8 text-foreground md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <a href="/" className="text-sm text-foreground-muted">
              ← M&M Property
            </a>
            <h1 className="mt-4 font-serif text-4xl">Admin</h1>
          </div>
          <div className="flex gap-4 text-sm text-foreground-muted">
            <button type="button" onClick={() => void load(password)}>
              Refresh
            </button>
            <button type="button" onClick={lock}>
              Lock
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTab(item.id);
                setQuery("");
                setNotice("");
                setError("");
              }}
              className={`h-9 rounded-full px-4 text-[11px] tracking-[0.14em] uppercase ${
                tab === item.id ? "bg-white text-black" : "border border-white/15 text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {error ? <p className="mt-4 text-sm text-foreground-muted">{error}</p> : null}
        {notice ? <p className="mt-4 text-sm text-[#d7dee6]">{notice}</p> : null}

        {tab === "overview" ? (
          <div className="mt-8 space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Stat label="Landings" value={stats.landings} note={`${stats.today.toLocaleString()} today`} />
              <Stat label="People" value={stats.unique} note="A person is counted once" />
              <Stat label="Page views" value={stats.views} note="Landings and later pages" />
              <Stat label="Subscribers" value={data.leads.length} note="Early-access emails" />
            </div>

            <Panel title="Landings, last 14 days">
              <div className="flex h-36 items-end gap-1.5">
                {stats.days.map((day) => {
                  const max = Math.max(1, ...stats.days.map((item) => item.landings));
                  return (
                    <div key={day.key} className="flex h-full min-w-0 flex-1 flex-col justify-end">
                      <div
                        title={`${day.key}: ${day.landings}`}
                        className="w-full rounded-t bg-[#8eb4c4]"
                        style={{ height: `${Math.max(day.landings ? 6 : 2, (day.landings / max) * 100)}%` }}
                      />
                      <span className="mt-2 text-center text-[10px] text-foreground-subtle">{day.label}</span>
                    </div>
                  );
                })}
              </div>
            </Panel>

            <div className="grid gap-5 lg:grid-cols-2">
              <Panel title="Where they came from">
                {stats.sources.length === 0 ? (
                  <p className="text-sm text-foreground-muted">No landings yet.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.sources.map((item) => (
                      <Meter key={item.name} {...item} max={stats.sources[0]?.count ?? 1} />
                    ))}
                  </div>
                )}
              </Panel>
              <Panel title="Pages">
                {stats.pages.length === 0 ? (
                  <p className="text-sm text-foreground-muted">No page views yet.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.pages.map((item) => (
                      <Meter key={item.name} {...item} max={stats.pages[0]?.count ?? 1} />
                    ))}
                  </div>
                )}
              </Panel>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <Panel title="Language">
                <MeterList items={stats.locales} empty="No landings yet." />
              </Panel>
              <Panel title="Device">
                <MeterList items={stats.devices} empty="Device is saved with each new landing." />
              </Panel>
              <Panel title="Country">
                <MeterList items={stats.countries} empty="Country is saved on the live site, when the host sends it." />
              </Panel>
            </div>
          </div>
        ) : null}

        {tab === "traffic" ? (
          <section className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search page, source, or campaign"
                className="h-11 w-full max-w-sm rounded-full border border-white/15 bg-white/5 px-4 text-sm outline-none"
              />
              <label className="flex items-center gap-2 text-sm text-foreground-muted">
                <input type="checkbox" checked={landingsOnly} onChange={(event) => setLandingsOnly(event.target.checked)} />
                Landings only
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground-muted">
                <input type="checkbox" checked={showBots} onChange={(event) => setShowBots(event.target.checked)} />
                Crawlers
              </label>
              <button
                type="button"
                className="text-sm text-foreground-muted"
                onClick={() =>
                  download("traffic.csv", [
                    ["Time", "Kind", "Page", "Source", "Referrer", "Campaign", "Language", "Country", "Device", "Visitor"],
                    ...traffic.map((visit) => [
                      visit.at,
                      visit.landing ? "Landing" : "Page view",
                      pageLabel(visit),
                      sourceLabel(visit),
                      visit.referrer,
                      visit.utm,
                      visit.locale,
                      countryName(visit.country),
                      visit.device,
                      visit.visitorId,
                    ]),
                  ])
                }
              >
                Export
              </button>
            </div>
            <p className="mt-4 text-sm text-foreground-muted">
              {traffic.length.toLocaleString()} {traffic.length === 1 ? "record" : "records"}
            </p>
            {traffic.length === 0 ? (
              <p className="mt-6 text-sm text-foreground-muted">No visits match.</p>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full min-w-[46rem] text-left text-sm">
                  <thead className="text-[11px] tracking-[0.14em] text-foreground-subtle uppercase">
                    <tr>
                      {["When", "Kind", "Page", "From", "Device", ""].map((label) => (
                        <th key={label || "actions"} className="px-4 py-3 font-medium">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {traffic.slice(0, 300).map((visit) => (
                      <tr key={visit.id} className="border-t border-white/10">
                        <td className="px-4 py-3 whitespace-nowrap text-foreground-muted">{formatWhen(visit.at)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{visit.landing ? "Landing" : "Page"}</td>
                        <td className="px-4 py-3">{pageLabel(visit)}</td>
                        <td className="px-4 py-3">
                          <span>{sourceLabel(visit)}</span>
                          {visit.utm ? <span className="mt-1 block text-xs text-foreground-subtle">{visit.utm}</span> : null}
                          {visit.country ? (
                            <span className="mt-1 block text-xs text-foreground-subtle">{countryName(visit.country)}</span>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-foreground-muted">
                          {visit.device || "—"} · {visit.locale.toUpperCase()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            className="text-xs text-foreground-subtle"
                            onClick={() => void change({ action: "delete-visit", id: visit.id })}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {traffic.length > 300 ? (
              <p className="mt-3 text-sm text-foreground-muted">Showing the latest 300. Export includes the full filter.</p>
            ) : null}
          </section>
        ) : null}

        {tab === "subscribers" ? (
          <section className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, phone, or email"
                className="h-11 w-full max-w-sm rounded-full border border-white/15 bg-white/5 px-4 text-sm outline-none"
              />
              <button
                type="button"
                className="text-sm text-foreground-muted"
                onClick={() =>
                  download("subscribers.csv", [
                    ["Name", "Phone", "Email", "Note", "Source", "Page", "Joined"],
                    ...subscribers.map((lead) => [
                      lead.name,
                      lead.phone,
                      lead.email,
                      lead.note,
                      lead.source,
                      lead.path,
                      lead.joinedAt,
                    ]),
                  ])
                }
              >
                Export
              </button>
            </div>
            {subscribers.length === 0 ? (
              <p className="mt-6 text-sm text-foreground-muted">
                No leads yet. Name, phone and email appear here when someone sends the form.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10">
                {subscribers.map((lead) => (
                  <li key={lead.email} className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
                    <span>
                      <span className="block">{lead.name || lead.email}</span>
                      <span className="mt-1 block text-foreground-muted">
                        {lead.phone ? (
                          <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className="hover:text-white">
                            {lead.phone}
                          </a>
                        ) : null}
                        {lead.phone ? " · " : ""}
                        <a href={`mailto:${lead.email}`} className="hover:text-white">
                          {lead.email}
                        </a>
                      </span>
                      {lead.note ? <span className="mt-1 block text-foreground-muted">{lead.note}</span> : null}
                      <span className="mt-1 block text-xs text-foreground-subtle">
                        {formatWhen(lead.joinedAt)}
                        {lead.source ? ` · ${lead.source}` : ""}
                        {lead.path ? ` · ${lead.path}` : ""}
                      </span>
                    </span>
                    <button
                      type="button"
                      className="text-xs text-foreground-subtle"
                      onClick={() => {
                        if (window.confirm(`Remove ${lead.email}?`)) void change({ action: "delete-lead", email: lead.email });
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}

        {tab === "settings" ? (
          <div className="mt-8 grid max-w-xl gap-5">
            <p className="text-sm leading-relaxed text-foreground-muted">{storageNote[data.storage]}</p>
            <p className="text-sm leading-relaxed text-foreground-muted">
              A landing stores the page, the site or campaign they came from, language, device, and country when the host
              sends it. Name, phone and email are saved only when someone sends the form. IP addresses are not stored.
            </p>
            <form
              className="rounded-2xl border border-white/10 p-5"
              onSubmit={(event) => {
                event.preventDefault();
                void change({ action: "save-settings", tracking, retain: Number(retain) });
              }}
            >
              <h2 className="text-sm tracking-[0.14em] text-foreground-subtle uppercase">Tracking</h2>
              <label className="mt-4 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={tracking} onChange={(event) => setTracking(event.target.checked)} />
                Record people who land on the site
              </label>
              <label className="mt-4 block text-[11px] tracking-[0.16em] text-foreground-subtle uppercase">
                Visits to keep
                <input
                  inputMode="numeric"
                  value={retain}
                  onChange={(event) => setRetain(event.target.value.replace(/[^\d]/g, ""))}
                  className="mt-2 w-full rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm tracking-normal text-foreground normal-case outline-none"
                />
              </label>
              <button
                type="submit"
                disabled={busy}
                className="mt-5 h-11 rounded-full bg-white px-6 text-[11px] font-semibold tracking-[0.14em] text-black uppercase"
              >
                Save
              </button>
            </form>

            <form
              className="rounded-2xl border border-white/10 p-5"
              onSubmit={(event) => {
                event.preventDefault();
                if (nextPassword.length < 8) {
                  setNotice("");
                  setError("Use at least 8 characters.");
                  return;
                }
                if (nextPassword !== confirmPassword) {
                  setNotice("");
                  setError("Those passwords do not match.");
                  return;
                }
                void change({ action: "password", password: nextPassword }).then((saved) => {
                  if (!saved) return;
                  sessionStorage.setItem(PASSWORD_KEY, nextPassword);
                  setPassword(nextPassword);
                  setNextPassword("");
                  setConfirmPassword("");
                });
              }}
            >
              <h2 className="text-sm tracking-[0.14em] text-foreground-subtle uppercase">Password</h2>
              <input
                type="password"
                autoComplete="new-password"
                value={nextPassword}
                onChange={(event) => setNextPassword(event.target.value)}
                placeholder="New password"
                className="mt-4 w-full rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none"
              />
              <input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat the password"
                className="mt-3 w-full rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none"
              />
              <button
                type="submit"
                disabled={busy}
                className="mt-5 h-11 rounded-full border border-white/20 px-6 text-[11px] font-semibold tracking-[0.14em] uppercase"
              >
                Change password
              </button>
            </form>

            <div className="rounded-2xl border border-white/10 p-5">
              <h2 className="text-sm tracking-[0.14em] text-foreground-subtle uppercase">Traffic log</h2>
              <p className="mt-3 text-sm text-foreground-muted">Removes every stored visit. Subscribers stay.</p>
              <button
                type="button"
                disabled={busy}
                className="mt-4 text-sm text-foreground-muted"
                onClick={() => {
                  if (window.confirm("Delete every stored visit?")) void change({ action: "clear-visits" });
                }}
              >
                Clear traffic
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function MeterList({ items, empty }: { items: { name: string; count: number }[]; empty: string }) {
  if (items.length === 0) return <p className="text-sm text-foreground-muted">{empty}</p>;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Meter key={item.name} {...item} max={items[0]?.count ?? 1} />
      ))}
    </div>
  );
}
