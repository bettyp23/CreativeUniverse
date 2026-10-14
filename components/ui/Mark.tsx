import { useId } from "react";

/** The site mark: a small constellation of connected dots. Also used for the favicon (app/icon.svg). */
export function Mark({ size = 24, className }: { size?: number; className?: string }) {
  const id = useId();
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id={id} x1="3" y1="20" x2="21" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5b8cff" />
          <stop offset="0.45" stopColor="#c26bff" />
          <stop offset="0.75" stopColor="#ff5fa2" />
          <stop offset="1" stopColor="#ff9a4d" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${id})`} strokeWidth="1.2" strokeLinecap="round" opacity="0.8">
        <path d="M4 18 8.5 9 14 13 19.5 5M14 13l4 6" fill="none" />
      </g>
      <g fill={`url(#${id})`}>
        <circle cx="4" cy="18" r="1.7" />
        <circle cx="8.5" cy="9" r="1.7" />
        <circle cx="14" cy="13" r="1.7" />
        <circle cx="18" cy="19" r="1.5" />
        <circle cx="19.5" cy="5" r="2.4" />
      </g>
    </svg>
  );
}
