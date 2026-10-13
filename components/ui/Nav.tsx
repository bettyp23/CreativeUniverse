"use client";

import { sections } from "@/lib/sections";
import { site } from "@/lib/site";
import { useUniverse } from "@/lib/store";
import { goTo } from "@/lib/useNavigation";

export function Nav() {
  const active = useUniverse((s) => s.active);
  const hovered = useUniverse((s) => s.hovered);
  const setHovered = useUniverse((s) => s.setHovered);

  return (
    <header className="nav">
      <button className="nav__brand" onClick={() => goTo(null)} aria-label={`${site.name}, back to the universe`}>
        <span className="nav__mark" aria-hidden />
        <span>{site.name}</span>
      </button>
      <nav aria-label="Worlds">
        <ul className="nav__links">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                className="nav__link"
                aria-current={active === s.id ? "page" : undefined}
                data-hover={hovered === s.id || undefined}
                style={{ "--node": s.color } as React.CSSProperties}
                onClick={() => goTo(s.id)}
                onPointerEnter={() => !active && setHovered(s.id)}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => !active && setHovered(s.id)}
                onBlur={() => setHovered(null)}
              >
                {s.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
