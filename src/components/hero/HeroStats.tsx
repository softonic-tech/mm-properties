import { useContent } from "@/content/language";

/**
 * Compact glassy stats — bottom-right of the hero, simple straight row.
 */
export function HeroStats({ compact = false }: { compact?: boolean }) {
  const { stats } = useContent().hero;

  return (
    <div
      data-hero="stats"
      className={compact ? "flex items-stretch gap-2" : "flex items-stretch gap-3"}
      aria-label="Key figures"
    >
      {stats.map((stat) => {
        const className = compact
          ? "min-w-0 flex-1 rounded-xl border border-white/25 px-2 py-2 backdrop-blur-[12px]"
          : "min-w-[8.5rem] rounded-2xl border border-white/25 px-4 py-3 backdrop-blur-[12px]";
        const style = {
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 55%, rgba(255,255,255,0.03) 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 32px rgba(0,0,0,0.25)",
        };
        const valueClass = compact
          ? "text-[12px] leading-snug font-light tracking-tight text-balance text-white sm:text-[14px]"
          : "text-[1.05rem] leading-snug font-light tracking-tight text-balance text-white md:text-[1.25rem]";
        const labelClass = compact
          ? "mt-1 text-[9px] leading-snug tracking-wide text-white/65"
          : "mt-1 max-w-[9rem] text-[10px] leading-snug tracking-wide text-white/65";
        const body = (
          <>
            <p className={valueClass}>{stat.value}</p>
            <p className={labelClass}>{stat.label}</p>
          </>
        );
        if (!stat.href) {
          return (
            <div key={stat.label} data-hero="stat-card" className={className} style={style}>
              {body}
            </div>
          );
        }
        return (
          <a
            key={stat.label}
            href={stat.href}
            data-hero="stat-card"
            className={`${className} transition-transform hover:scale-[1.03]`}
            style={style}
          >
            {body}
          </a>
        );
      })}
    </div>
  );
}
