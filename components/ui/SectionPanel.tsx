"use client";

import { useEffect, useRef, useState } from "react";
import { sections, sectionById, type SectionId } from "@/lib/sections";
import { useUniverse } from "@/lib/store";
import { goTo } from "@/lib/useNavigation";
import { sectionViews } from "@/components/sections";

/**
 * The glass panel that opens once the camera has flown into a world.
 * It keeps the last world rendered while it fades out, so leaving feels smooth.
 */
export function SectionPanel() {
  const active = useUniverse((s) => s.active);
  const [shown, setShown] = useState<SectionId | null>(null);
  const [open, setOpen] = useState(false);
  const backRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (active) {
      setShown(active);
      // Let the camera travel a little before the panel arrives.
      const t = setTimeout(() => setOpen(true), 450);
      return () => clearTimeout(t);
    }
    setOpen(false);
    const t = setTimeout(() => setShown(null), 600);
    return () => clearTimeout(t);
  }, [active]);

  useEffect(() => {
    if (open) backRef.current?.focus({ preventScroll: true });
  }, [open, shown]);

  if (!shown) return null;
  const section = sectionById(shown);
  const View = sectionViews[shown];
  const idx = sections.findIndex((s) => s.id === shown);
  const next = sections[(idx + 1) % sections.length];

  return (
    <section
      className="panel"
      data-open={open}
      aria-labelledby="panel-title"
      style={{ "--node": section.color, "--accent": section.accent } as React.CSSProperties}
    >
      <div className="panel__scroll" key={shown}>
        <button ref={backRef} className="panel__back" onClick={() => goTo(null)}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to the universe
        </button>

        <header className="panel__header">
          <h2 id="panel-title" className="panel__title">{section.title}</h2>
          <p className="panel__tagline">{section.tagline}</p>
          <p className="panel__desc">{section.description}</p>
        </header>

        <View />

        <footer className="panel__footer">
          <button
            className="panel__next"
            style={{ "--next": next.color } as React.CSSProperties}
            onClick={() => goTo(next.id)}
          >
            <span className="panel__next-label">Next world</span>
            <span className="panel__next-title">{next.title}</span>
          </button>
          <span className="panel__esc">Press Esc to zoom out</span>
        </footer>
      </div>
    </section>
  );
}
