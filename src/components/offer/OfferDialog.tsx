import { useEffect, useState } from "react";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { useContent } from "@/content/language";

const SEEN_KEY = "mm-offer-seen";

export function OfferDialog() {
  const offer = useContent().offer;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    const timer = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const close = () => {
    sessionStorage.setItem(SEEN_KEY, "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/72 p-5 backdrop-blur-[8px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="offer-title"
        className="offer-dialog relative max-h-[calc(100svh-2.5rem)] w-full max-w-[22.5rem] overflow-y-auto rounded-[1.4rem] border border-white/14 bg-[#101216] px-6 pt-5 pb-6 text-white shadow-[0_28px_80px_rgba(0,0,0,0.55)]"
      >
        <button
          type="button"
          onClick={close}
          aria-label={offer.close}
          className="absolute top-3.5 right-3.5 flex size-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3">
            <path d="M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>

        <img src="/mm-property-logo.png?v=3" alt="" className="h-11 w-auto" />

        <p className="mt-5 text-[10px] tracking-[0.22em] text-[#d7dee6] uppercase">{offer.eyebrow}</p>
        <h2 id="offer-title" className="mt-2 max-w-[16rem] font-serif text-[1.65rem] leading-[1.15] font-medium text-balance">
          {offer.title}
        </h2>
        <p className="mt-3 text-[13px] leading-relaxed text-white/68">{offer.text}</p>

        <div className="mt-5">
          <InquiryForm
            emailOnly
            submitLabel={offer.submit}
            onSaved={() => {
              sessionStorage.setItem(SEEN_KEY, "1");
              window.location.href = offer.href;
            }}
          />
        </div>
      </div>
    </div>
  );
}
