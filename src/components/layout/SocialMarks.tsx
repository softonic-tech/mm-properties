import { useId, type ReactElement } from "react";

type MarkProps = { className?: string };

export function InstagramMark({ className = "size-12" }: MarkProps) {
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

export function FacebookMark({ className = "size-12" }: MarkProps) {
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

export function WhatsAppMark({ className = "size-12" }: MarkProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect width="48" height="48" rx="12" fill="#25D366" />
      <path
        fill="#fff"
        d="M24 11.2c-7 0-12.7 5.6-12.7 12.5 0 2.2.6 4.3 1.7 6.2L11.2 36.8l7.2-1.9c1.8.9 3.8 1.4 5.6 1.4 7 0 12.7-5.6 12.7-12.6S31 11.2 24 11.2zm0 22.9c-1.7 0-3.4-.4-4.9-1.3l-.4-.2-4.3.7.7-4.2-.2-.4a10.3 10.3 0 0 1-1.6-5.5c0-5.7 4.7-10.4 10.7-10.4s10.7 4.7 10.7 10.4-4.7 10.9-10.7 10.9zm5.9-7.8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.1c-.2.2-.8 1-.9 1.2-.2.2-.3.2-.6.1a8.5 8.5 0 0 1-2.5-1.5 9.1 9.1 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6.2-.3c.1-.2.1-.3 0-.5 0-.1-.7-1.6-.9-2.2s-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1.1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.3 13.3 0 0 0 5.1 4.6c.7.3 1.2.5 1.7.6a4 4 0 0 0 1.9.1 3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.5c-.1 0-.3-.1-.6-.3z"
      />
    </svg>
  );
}

export function LinkedInMark({ className = "size-12" }: MarkProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect width="48" height="48" rx="12" fill="#0A66C2" />
      <g transform="translate(10.5 10.5) scale(1.125)">
        <path
          fill="#fff"
          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"
        />
      </g>
    </svg>
  );
}

export function TikTokMark({ className = "size-12" }: MarkProps) {
  const raw = useId();
  const id = `tt-${raw.replace(/:/g, "")}`;

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#25F4EE" />
          <stop offset="45%" stopColor="#000" />
          <stop offset="100%" stopColor="#FE2C55" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="#111" />
      <path
        fill={`url(#${id})`}
        d="M31.2 14.2c1.1 1.9 2.8 3.3 4.8 3.9v3.6c-1.7-.1-3.3-.6-4.8-1.5v7.8c0 4.6-3.7 8.3-8.3 8.3s-8.3-3.7-8.3-8.3 3.7-8.3 8.3-8.3c.4 0 .9 0 1.3.1v3.8c-.4-.1-.8-.2-1.3-.2-2.5 0-4.5 2-4.5 4.6s2 4.6 4.5 4.6 4.5-2 4.5-4.6V12h3.8c0 .8.1 1.5.3 2.2z"
      />
      <path
        fill="#fff"
        d="M30.4 15.4c1.1 1.7 2.6 3 4.4 3.6v2.5c-1.6-.1-3.1-.6-4.4-1.4v8.4c0 4.2-3.4 7.6-7.6 7.6s-7.6-3.4-7.6-7.6 3.4-7.6 7.6-7.6c.4 0 .8 0 1.2.1v2.7a4.9 4.9 0 0 0-1.2-.2c-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9 4.9-2.2 4.9-4.9V12.8h2.7c0 .9.1 1.8.4 2.6z"
      />
    </svg>
  );
}

const MARKS: Record<string, (props: MarkProps) => ReactElement> = {
  Instagram: InstagramMark,
  Facebook: FacebookMark,
  WhatsApp: WhatsAppMark,
  LinkedIn: LinkedInMark,
  TikTok: TikTokMark,
};

export function SocialMark({ label, className }: { label: string; className?: string }) {
  const Mark = MARKS[label];
  if (!Mark) return null;
  return <Mark className={className} />;
}
