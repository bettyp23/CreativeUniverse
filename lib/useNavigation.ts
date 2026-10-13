"use client";

import { useCallback, useEffect } from "react";
import { useUniverse } from "./store";
import { isSectionId, type SectionId } from "./sections";

/**
 * Keeps the focused world in sync with the URL hash (#dev, #ai, #lab), so the
 * browser back button and shared links work, and Escape returns home.
 */
export function useHashNavigation() {
  const setActive = useUniverse((s) => s.setActive);

  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace("#", "");
      setActive(isSectionId(h) ? h : null);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [setActive]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && useUniverse.getState().active) goTo(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

/** Fly to a world (or back home with null). */
export function goTo(id: SectionId | null) {
  const current = useUniverse.getState().active;
  if (current === id) return;
  try {
    if (id) window.location.hash = id;
    else history.pushState(null, "", window.location.pathname + window.location.search);
  } catch {
    /* sandboxed frames may block history; state still updates below */
  }
  useUniverse.getState().setActive(id);
}

export function useGoTo() {
  return useCallback((id: SectionId | null) => goTo(id), []);
}
