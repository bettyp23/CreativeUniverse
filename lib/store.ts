import { create } from "zustand";
import type { SectionId } from "./sections";

interface UniverseState {
  /** The world the camera is focused on, or null for the full universe view. */
  active: SectionId | null;
  hovered: SectionId | null;
  /** True once the opening fly-in has finished. */
  arrived: boolean;
  /** True while the About panel is open. */
  about: boolean;
  /** Project artifact under the pointer, shown with a title tooltip. */
  hoveredProject: string | null;
  /** Project the camera is flying to just before its page opens. */
  focusProject: string | null;
  /** The full-screen fade used between the universe and project pages. */
  warp: boolean;
  /** Web design open in the gallery's preview window. */
  preview: string | null;
  setActive: (id: SectionId | null) => void;
  setHovered: (id: SectionId | null) => void;
  setArrived: (v: boolean) => void;
  setAbout: (v: boolean) => void;
  setHoveredProject: (slug: string | null) => void;
  setFocusProject: (slug: string | null) => void;
  setWarp: (v: boolean) => void;
  setPreview: (slug: string | null) => void;
}

export const useUniverse = create<UniverseState>((set) => ({
  active: null,
  hovered: null,
  arrived: false,
  about: false,
  hoveredProject: null,
  focusProject: null,
  warp: false,
  preview: null,
  setActive: (active) => set({ active, hovered: null, preview: null }),
  setHovered: (hovered) => set({ hovered }),
  setArrived: (arrived) => set({ arrived }),
  setAbout: (about) => set({ about }),
  setHoveredProject: (hoveredProject) => set({ hoveredProject }),
  setFocusProject: (focusProject) => set({ focusProject, hoveredProject: null }),
  setWarp: (warp) => set({ warp }),
  setPreview: (preview) => set({ preview }),
}));
