"use client";

import { sections } from "@/lib/sections";
import { labelRefs } from "@/lib/labelRefs";
import { useUniverse } from "@/lib/store";
import { goTo } from "@/lib/useNavigation";

/**
 * Labels that float under each 3D world. They are real buttons, so they can
 * be clicked or tapped; their position is set every frame by LabelProjector.
 */
export function NodeLabels() {
  const active = useUniverse((s) => s.active);
  const hovered = useUniverse((s) => s.hovered);
  const arrived = useUniverse((s) => s.arrived);
  const about = useUniverse((s) => s.about);
  const setHovered = useUniverse((s) => s.setHovered);

  return (
    <div className="node-labels" aria-hidden>
      {sections.map((s) => (
        <button
          key={s.id}
          tabIndex={-1}
          ref={(el) => {
            labelRefs[s.id] = el;
          }}
          className="node-label"
          data-state={active || about || !arrived ? "hidden" : hovered === s.id ? "hover" : "idle"}
          style={{ "--node": s.color } as React.CSSProperties}
          onClick={() => goTo(s.id)}
          onPointerEnter={() => !active && setHovered(s.id)}
          onPointerLeave={() => setHovered(null)}
        >
          <span className="node-label__dot" />
          <span className="node-label__title">{s.title}</span>
          <span className="node-label__sub">{s.tagline}</span>
        </button>
      ))}
    </div>
  );
}
