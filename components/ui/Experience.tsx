"use client";

import dynamic from "next/dynamic";
import { useHashNavigation } from "@/lib/useNavigation";
import { useUniverse } from "@/lib/store";
import { Nav } from "./Nav";
import { NodeLabels } from "./NodeLabels";
import { Hero } from "./Hero";
import { SectionPanel } from "./SectionPanel";

// WebGL only runs in the browser.
const UniverseScene = dynamic(() => import("@/components/universe/UniverseScene"), {
  ssr: false,
});

export default function Experience() {
  useHashNavigation();
  const active = useUniverse((s) => s.active);

  return (
    <main className="experience" data-focused={!!active}>
      <div className="scene-layer">
        <UniverseScene />
      </div>
      <div className="veil" aria-hidden />
      <NodeLabels />
      <Nav />
      <Hero />
      <SectionPanel />
    </main>
  );
}
