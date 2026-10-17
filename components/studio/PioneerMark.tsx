import { useId } from "react";

/** The three faces of the Pioneer Digital "P", in a 100×100 box. */
const P_FACES = [
  "M2 21 L28 2 H86 L72 21 Z",
  "M72 21 L86 2 Q99 2 99 15 Q99 22 94 27 L62 58 H36 L38.5 48 H49 Z",
  "M24 21 H45 L36 58 L37 75 L12 96 V58 Z",
];

const GRADIENT = ["#4DA3FF", "#8B7CFF", "#FF4D8B", "#FF6A3D"];

interface Props {
  size?: number;
  className?: string;
  /** "black" is the solid monochrome version for light backgrounds. */
  tone?: "gradient" | "black";
}

/** The Pioneer Digital mark: a folded-ribbon "P". */
export function PioneerMark({ size = 28, className, tone = "gradient" }: Props) {
  const id = useId();
  const black = tone === "black";
  return (
    <svg className={className} width={size} height={size} viewBox="-4 -4 108 108" aria-hidden>
      {!black && (
        <defs>
          <linearGradient id={id} x1="2" y1="80" x2="100" y2="40" gradientUnits="userSpaceOnUse">
            {GRADIENT.map((c, i) => (
              <stop key={c} offset={[0, 0.42, 0.72, 1][i]} stopColor={c} />
            ))}
          </linearGradient>
        </defs>
      )}
      <g fill={black ? "#171717" : `url(#${id})`}>
        {P_FACES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {/* Light catches the top faces; shadow where the ribbon turns under. */}
      <path d={P_FACES[0]} fill="#fff" opacity={black ? 0.14 : 0.1} />
      <path d="M72 21 L86 2 Q99 2 99 15 Q99 22 94 27 Z" fill="#fff" opacity={black ? 0.22 : 0.14} />
      <path d="M24 21 H45 L36 58 H12 Z" fill="#000" opacity="0.22" />
      <path d="M36 58 L37 75 L12 96 Z" fill="#000" opacity="0.2" />
    </svg>
  );
}

/** Mark plus the spaced-out PIONEER / DIGITAL wordmark. */
export function PioneerLogo({ size = 30, tone }: { size?: number; tone?: Props["tone"] }) {
  return (
    <span className="pioneer-logo">
      <PioneerMark size={size} tone={tone} />
      <span className="pioneer-logo__word">
        <span className="pioneer-logo__name">Pioneer</span>
        <span className="pioneer-logo__sub">Digital</span>
      </span>
    </span>
  );
}
