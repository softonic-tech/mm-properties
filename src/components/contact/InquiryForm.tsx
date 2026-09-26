import { useState, type FormEvent } from "react";
import { FusedCtaButton } from "@/components/ui/FusedCtaButton";
import { useContent } from "@/content/language";
import { leadMeta } from "@/lib/track";

const SAVED_KEY = "mm-lead";

type SavedLead = { name: string; email: string; phone: string };

function readSavedLead(): SavedLead {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVED_KEY) ?? "") as Partial<SavedLead>;
    return {
      name: typeof raw.name === "string" ? raw.name : "",
      email: typeof raw.email === "string" ? raw.email : "",
      phone: typeof raw.phone === "string" ? raw.phone : "",
    };
  } catch {
    return { name: "", email: "", phone: "" };
  }
}

const fieldClass =
  "mt-2 w-full border border-white/16 bg-white/[0.04] px-4 text-sm tracking-normal text-white normal-case outline-none placeholder:text-white/30 focus:border-white/40";

export function InquiryForm({
  includeNote = false,
  emailOnly = false,
  roomy = false,
  submitLabel,
  onSaved,
}: {
  includeNote?: boolean;
  emailOnly?: boolean;
  roomy?: boolean;
  submitLabel: string;
  onSaved?: () => void;
}) {
  const offer = useContent().offer;
  const saved = readSavedLead();
  const [name, setName] = useState(saved.name);
  const [phone, setPhone] = useState(saved.phone);
  const [email, setEmail] = useState(saved.email);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "sent" | "error">("idle");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("saving");
    const details = {
      name: emailOnly ? saved.name : name.trim(),
      email: email.trim(),
      phone: emailOnly ? saved.phone : phone.trim(),
    };
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: details.email,
          ...(emailOnly ? {} : { name: details.name, phone: details.phone, note: note.trim() }),
          ...leadMeta(),
        }),
      });
      if (!response.ok) throw new Error("save failed");
      localStorage.setItem(SAVED_KEY, JSON.stringify(details));
      setStatus("sent");
      onSaved?.();
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent" && !onSaved) {
    return (
      <p className="font-serif text-3xl leading-snug text-foreground">{offer.sent}</p>
    );
  }

  const inputClass = `${fieldClass} ${roomy ? "h-12 rounded-2xl" : "rounded-full py-2.5"}`;

  return (
    <form className={`flex flex-col ${roomy ? "gap-5" : "gap-3.5"}`} autoComplete="on" onSubmit={submit}>
      {emailOnly ? null : (
        <>
          <label className="text-[10px] tracking-[0.16em] text-white/50 uppercase">
            {offer.nameLabel}
            <input
              name="name"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={offer.namePlaceholder}
              className={inputClass}
            />
          </label>
          <label className="text-[10px] tracking-[0.16em] text-white/50 uppercase">
            {offer.phoneLabel}
            <input
              name="tel"
              type="tel"
              autoComplete="tel"
              required
              inputMode="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={offer.phonePlaceholder}
              className={inputClass}
            />
          </label>
        </>
      )}
      <label className="text-[10px] tracking-[0.16em] text-white/50 uppercase">
        {offer.emailLabel}
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={offer.placeholder}
          className={inputClass}
        />
      </label>
      {includeNote ? (
        <label className="text-[10px] tracking-[0.16em] text-white/50 uppercase">
          {offer.noteLabel}
          <textarea
            name="note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={offer.notePlaceholder}
            rows={3}
            className={`${fieldClass} resize-none rounded-2xl py-3`}
          />
        </label>
      ) : null}
      {status === "error" ? <p className="text-sm text-white/70">{offer.error}</p> : null}
      <FusedCtaButton type="submit" label={submitLabel} disabled={status === "saving"} />
    </form>
  );
}
