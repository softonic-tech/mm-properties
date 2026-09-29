import { useId } from "react";

export function InstagramMark({ className = "size-12" }: { className?: string }) {
  const raw = useId();
  const id = `ig-${raw.replace(/:/g, "")}`;

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <radialGradient id={id} cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="10%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill={`url(#${id})`} />
      <rect x="13" y="13" width="22" height="22" rx="7" fill="none" stroke="#fff" strokeWidth="2.4" />
      <circle cx="24" cy="24" r="5.2" fill="none" stroke="#fff" strokeWidth="2.4" />
      <circle cx="32.2" cy="15.6" r="1.7" fill="#fff" />
    </svg>
  );
}

export function FacebookMark({ className = "size-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect width="48" height="48" rx="12" fill="#0866FF" />
      <path
        fill="#fff"
        d="M26.6 16.4h3.2V11.4h-3.2c-3.6 0-6.4 2.9-6.4 6.6v3H16.8v4.4h3.4V36.6h4.6V25.4h3.5l.7-4.4h-4.2v-2.4c0-1 .6-1.6 1.8-1.6z"
      />
    </svg>
  );
}
