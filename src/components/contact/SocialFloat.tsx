import { SocialMark } from "@/components/layout/SocialMarks";
import { useContent } from "@/content/language";

/**
 * Fixed horizontal dock of brand social marks — bottom-right on every public page.
 */
export function SocialFloat() {
  const { socials } = useContent().contact;

  return (
    <aside
      aria-label="Social media"
      className="pointer-events-none fixed right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 max-w-[calc(100vw-1.5rem)] md:right-5 md:bottom-5"
    >
      <div className="pointer-events-auto flex max-w-full items-center gap-1.5 overflow-x-auto rounded-full border border-white/12 bg-black/45 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-md [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2 sm:p-2 [&::-webkit-scrollbar]:hidden">
        {socials.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={item.label}
            className="social-float-item block size-9 shrink-0 overflow-hidden rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.28)] transition-transform duration-200 hover:scale-110 active:scale-95 sm:size-10 md:size-12"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <SocialMark label={item.label} className="size-full" />
          </a>
        ))}
      </div>
    </aside>
  );
}
