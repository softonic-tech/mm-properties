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
      {stats.map((stat) => (
        <div
          key={stat.label}
          data-hero="stat-card"
          className={
            compact
              ? "min-w-0 flex-1 rounded-xl border border-white/25 px-2.5 py-2 backdrop-blur-[12px]"
              : "min-w-[7.25rem] rounded-2xl border border-white/25 px-4 py-3 backdrop-blur-[12px]"
          }
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 55%, rgba(255,255,255,0.03) 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 32px rgba(0,0,0,0.25)",
          }}
        >
          <p className={compact ? "text-[15px] leading-tight font-light tracking-tight text-white" : "text-2xl font-light tracking-tight text-white md:text-[1.65rem]"}>
            {stat.value}
          </p>
          <p className={compact ? "mt-1 text-[9px] leading-snug tracking-wide text-white/65" : "mt-1 max-w-[6.5rem] text-[10px] leading-snug tracking-wide text-white/65"}>
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
