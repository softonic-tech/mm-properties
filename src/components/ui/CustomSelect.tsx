import { useEffect, useId, useRef, useState } from "react";

export type CustomSelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  label?: string;
  ariaLabel?: string;
  className?: string;
  /** Light form fields (homes filters) vs dark glass (header-adjacent). */
  tone?: "light" | "dark";
  size?: "md" | "sm";
};

export function CustomSelect({
  value,
  options,
  onChange,
  label,
  ariaLabel,
  className = "",
  tone = "light",
  size = "md",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const light = tone === "light";
  const triggerClass = light
    ? [
        "flex w-full items-center justify-between gap-2 border bg-white text-left outline-none transition-colors",
        size === "sm" ? "h-9 px-3 text-[13px]" : "h-11 px-3 text-[13px]",
        open
          ? "border-[#c9a227] text-[#1f2937] shadow-[0_0_0_1px_rgba(201,162,39,0.35)]"
          : "border-[#d1d5db] text-[#374151] hover:border-[#c9a227]/70",
      ].join(" ")
    : [
        "flex w-full items-center justify-between gap-2 rounded-full border text-left outline-none transition-colors backdrop-blur-md",
        size === "sm" ? "h-9 px-3 text-[12px]" : "h-11 px-4 text-[13px]",
        open
          ? "border-white/40 bg-white/20 text-white"
          : "border-white/20 bg-white/10 text-white hover:bg-white/20",
      ].join(" ");

  const menuClass = light
    ? "absolute left-0 right-0 z-50 mt-1.5 max-h-60 overflow-auto border border-[#e5e7eb] bg-white p-1 shadow-[0_12px_32px_rgba(15,23,42,0.12)]"
    : "absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-auto rounded-xl border border-white/15 bg-[#14161a]/95 p-1 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl";

  const optionBase = light
    ? "flex w-full items-center rounded-sm px-3 py-2 text-left text-[13px] transition-colors"
    : "flex w-full items-center rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors";

  return (
    <div ref={root} className={`relative ${className}`}>
      {label ? (
        <span className="mb-1.5 block text-[11px] tracking-[0.08em] text-[#6b7280] uppercase">{label}</span>
      ) : null}
      <button
        type="button"
        className={triggerClass}
        aria-label={ariaLabel || label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="min-w-0 flex-1 truncate">{selected?.label ?? ""}</span>
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 shrink-0 transition-transform duration-200 ${
            light ? "text-[#9ca3af]" : "text-white/80"
          } ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path fill="currentColor" d="M2.3 4.2 6 7.8l3.7-3.6.8.8L6 9.4 1.5 5z" />
        </svg>
      </button>

      {open ? (
        <ul id={listId} role="listbox" aria-label={ariaLabel || label} className={menuClass}>
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value || "__empty"} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  className={`${optionBase} ${
                    light
                      ? isSelected
                        ? "bg-[#c9a227]/12 font-medium text-[#8a7018]"
                        : "text-[#374151] hover:bg-[#f9fafb]"
                      : isSelected
                        ? "bg-white/15 text-white"
                        : "text-white/85 hover:bg-white/10"
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  {isSelected ? (
                    <svg viewBox="0 0 16 16" className="ml-2 h-3.5 w-3.5 shrink-0" aria-hidden>
                      <path
                        fill="currentColor"
                        d="M6.4 11.6 3.2 8.4l1.1-1.1 2.1 2.1 5.3-5.3 1.1 1.1z"
                      />
                    </svg>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
