"use client";

import { site } from "@/lib/site";
import { sections } from "@/lib/sections";
import { useUniverse } from "@/lib/store";
import { goTo } from "@/lib/useNavigation";

export function Hero() {
  const active = useUniverse((s) => s.active);
  const arrived = useUniverse((s) => s.arrived);

  return (
    <section
      className="hero"
      data-visible={!active && arrived}
      aria-hidden={!!active}
      inert={active ? true : undefined}
    >
      <h1 className="hero__heading">{site.hero.heading}</h1>
      <p className="hero__body">{site.hero.body}</p>
      <div className="hero__actions">
        <button className="cta" onClick={() => goTo(sections[0].id)}>
          <span className="cta__glow" aria-hidden />
          {site.hero.cta}
        </button>
        <span className="hero__hint">{site.hero.hint}</span>
      </div>
    </section>
  );
}
