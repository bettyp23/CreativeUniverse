"use client";

import { sections } from "@/lib/sections";
import { site } from "@/lib/site";
import { useUniverse } from "@/lib/store";
import { goTo, openAbout } from "@/lib/useNavigation";
import { Mark } from "./Mark";

export function Nav() {
  const active = useUniverse((s) => s.active);
  const about = useUniverse((s) => s.about);
  const hovered = useUniverse((s) => s.hovered);
  const setHovered = useUniverse((s) => s.setHovered);

  return (
    <header className="nav">
      <button className="nav__brand" onClick={() => goTo(null)} aria-label={`${site.name}, back to the universe`}>
        <Mark className="nav__mark" size={26} />
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
                aria-label={s.title}
                onClick={() => goTo(s.id)}
                onPointerEnter={() => !active && setHovered(s.id)}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => !active && setHovered(s.id)}
                onBlur={() => setHovered(null)}
              >
                <span className="nav__full">{s.title}</span>
                <span className="nav__short" aria-hidden>
                  {s.shortTitle}
                </span>
              </button>
            </li>
          ))}
          <li>
            <button
              className="nav__link nav__link--plain"
              aria-current={about ? "page" : undefined}
              onClick={() => (about ? goTo(null) : openAbout())}
            >
              {site.about.title}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
