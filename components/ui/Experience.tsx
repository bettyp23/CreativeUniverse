"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { prefersReducedMotion, useHashNavigation } from "@/lib/useNavigation";
import { useUniverse } from "@/lib/store";
import { projectPath } from "@/lib/projects";
import { Nav } from "./Nav";
import { NodeLabels } from "./NodeLabels";
import { Hero } from "./Hero";
import { SectionPanel } from "./SectionPanel";
import { AboutPanel } from "./AboutPanel";
import { GalleryViewer } from "./GalleryViewer";

// WebGL only runs in the browser.
const UniverseScene = dynamic(() => import("@/components/universe/UniverseScene"), {
  ssr: false,
});

export default function Experience() {
  useHashNavigation();
  const router = useRouter();
  const active = useUniverse((s) => s.active);
  const focusProject = useUniverse((s) => s.focusProject);

  // Coming back from a project page: clear the fade and the camera target.
  useEffect(() => {
    useUniverse.getState().setFocusProject(null);
    const t = setTimeout(() => useUniverse.getState().setWarp(false), 120);
    return () => clearTimeout(t);
  }, []);

  // Opening a project: the camera flies to its artifact, the screen fades, then the page opens.
  useEffect(() => {
    if (!focusProject) return;
    const path = projectPath(focusProject);
    router.prefetch(path);
    const reduced = prefersReducedMotion();
    const fade = setTimeout(() => useUniverse.getState().setWarp(true), reduced ? 0 : 750);
    const go = setTimeout(() => router.push(path), reduced ? 150 : 1200);
    return () => {
      clearTimeout(fade);
      clearTimeout(go);
    };
  }, [focusProject, router]);

  return (
    <main className="experience" data-focused={!!active} data-leaving={!!focusProject}>
      <div className="scene-layer">
        <UniverseScene />
      </div>
      <div className="veil" aria-hidden />
      <NodeLabels />
      <Nav />
      <Hero />
      <SectionPanel />
      <AboutPanel />
      <GalleryViewer />
    </main>
  );
}
