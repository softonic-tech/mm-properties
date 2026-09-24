import { useEffect, useState } from "react";

type Lead = { email: string; joinedAt: string };
type Visit = { id: string; at: string; locale: string };

const PASSWORD_KEY = "mm-admin-password";

function formatWhen(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminPage() {
  const [password, setPassword] = useState(() => sessionStorage.getItem(PASSWORD_KEY) ?? "");
  const [draft, setDraft] = useState("");
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [visits, setVisits] = useState<Visit[] | null>(null);
  const [error, setError] = useState("");

  const load = async (nextPassword: string) => {
    setError("");
    const response = await fetch("/api/admin", {
      headers: { "x-admin-password": nextPassword },
    });
    if (!response.ok) {
      sessionStorage.removeItem(PASSWORD_KEY);
      setLeads(null);
      setError("That password is not correct.");
      return;
    }
    const data = (await response.json()) as { leads: Lead[]; visits: Visit[] };
    sessionStorage.setItem(PASSWORD_KEY, nextPassword);
    setPassword(nextPassword);
    setLeads(data.leads);
    setVisits(data.visits);
  };

  useEffect(() => {
    if (password) void load(password);
  }, [password]);

  return (
    <main className="min-h-svh bg-background px-5 py-10 text-foreground md:px-10">
      <div className="mx-auto max-w-3xl">
        <a href="/" className="text-sm text-foreground-muted">
          ← M&M Property
        </a>
        <h1 className="mt-6 font-serif text-4xl">Admin</h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground-muted">
          People who left an email, and visits to the site. A visit is the time and language only.
        </p>

        {leads === null ? (
          <form
            className="mt-8 flex max-w-sm flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              void load(draft);
            }}
          >
            <label className="text-[11px] tracking-[0.16em] text-foreground-subtle uppercase">
              Password
              <input
                type="password"
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
        ) : (
          <div className="mt-10 space-y-12">
            <section>
              <h2 className="text-lg">Subscribers · {leads.length}</h2>
              {leads.length === 0 ? (
                <p className="mt-3 text-sm text-foreground-muted">No emails yet.</p>
              ) : (
                <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
                  {leads.map((lead) => (
                    <li key={lead.email} className="flex items-baseline justify-between gap-4 py-3 text-sm">
                      <span>{lead.email}</span>
                      <span className="shrink-0 text-foreground-subtle">{formatWhen(lead.joinedAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="text-lg">Visits · {visits?.length ?? 0}</h2>
              {(visits ?? []).length === 0 ? (
                <p className="mt-3 text-sm text-foreground-muted">No visits yet.</p>
              ) : (
                <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
                  {(visits ?? []).map((visit) => (
                    <li key={visit.id} className="flex items-baseline justify-between gap-4 py-3 text-sm">
                      <span className="uppercase">{visit.locale}</span>
                      <span className="text-foreground-subtle">{formatWhen(visit.at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <button
              type="button"
              className="text-sm text-foreground-muted"
              onClick={() => {
                sessionStorage.removeItem(PASSWORD_KEY);
                setPassword("");
                setLeads(null);
              }}
            >
              Lock
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
