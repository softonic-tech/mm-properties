/**
 * Shared section kicker: index, hairline, label.
 * Same size and tracking on every section.
 */
export function SectionEyebrow({
  index,
  label,
  light = false,
}: {
  index: string;
  label: string;
  /** On photography, keep the label in cream instead of the stone accent. */
  light?: boolean;
}) {
  return (
    <p className="flex items-center gap-3 text-[11px] leading-none tracking-[0.22em] uppercase">
      <span className="tabular-nums text-foreground/90">{index}</span>
      <span className="h-px w-8 bg-white/30" aria-hidden="true" />
      <span className={light ? "text-foreground/75" : "text-electric-soft"}>
        {label}
      </span>
    </p>
  );
}
