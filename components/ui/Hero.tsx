"use client";

import { site } from "@/lib/site";
import { sections } from "@/lib/sections";
import { useUniverse } from "@/lib/store";
import { goTo, openAbout } from "@/lib/useNavigation";

export function Hero() {
  const active = useUniverse((s) => s.active);
  const arrived = useUniverse((s) => s.arrived);
  const about = useUniverse((s) => s.about);
  const hidden = !!active || about;

  return (
    <section
      className="hero"
      data-visible={!hidden && arrived}
      aria-hidden={hidden}
      inert={hidden ? true : undefined}
    >
      <p className="hero__eyebrow">{site.hero.eyebrow}</p>
      <h1 className="hero__heading">{site.hero.heading}</h1>
      <p className="hero__body">{site.hero.body}</p>
      <div className="hero__actions">
        <button className="cta" onClick={() => goTo(sections[0].id)}>
          {site.hero.cta}
        </button>
        <button className="pill-link" onClick={openAbout}>
          {site.hero.secondary}
        </button>
      </div>
    </section>
  );
}
