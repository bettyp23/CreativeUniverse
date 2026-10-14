"use client";

import { useEffect } from "react";
import { useUniverse } from "./store";
import { isSectionId, type SectionId } from "./sections";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Keeps the focused world in sync with the URL hash (#dev, #ai, #lab, #about),
 * so the browser back button and shared links work, and Escape returns home.
 */
export function useHashNavigation() {
  const setActive = useUniverse((s) => s.setActive);
  const setAbout = useUniverse((s) => s.setAbout);

  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace("#", "");
      setActive(isSectionId(h) ? h : null);
      setAbout(h === "about");
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [setActive, setAbout]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const { active, about, focusProject, preview } = useUniverse.getState();
      if (e.key !== "Escape" || focusProject) return;
      // Close the gallery preview first, then the world.
      if (preview) useUniverse.getState().setPreview(null);
      else if (active || about) goTo(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

function setHash(hash: string | null) {
  try {
    if (hash) window.location.hash = hash;
    else history.pushState(null, "", window.location.pathname + window.location.search);
  } catch {
    /* sandboxed frames may block history; state still updates below */
  }
}

/** Fly to a world (or back home with null). */
export function goTo(id: SectionId | null) {
  const { active, about, setActive, setAbout } = useUniverse.getState();
  if (active === id && !about) return;
  setHash(id);
  setAbout(false);
  setActive(id);
}

/** Open the About panel over the universe view. */
export function openAbout() {
  setHash("about");
  useUniverse.getState().setActive(null);
  useUniverse.getState().setAbout(true);
}

/**
 * Fly the camera to a project's artifact. <Experience/> then fades the screen
 * and opens the project's page.
 */
export function openProject(slug: string) {
  if (useUniverse.getState().focusProject) return;
  useUniverse.getState().setPreview(null);
  useUniverse.getState().setFocusProject(slug);
}
