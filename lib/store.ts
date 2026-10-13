import { create } from "zustand";
import type { SectionId } from "./sections";

interface UniverseState {
  /** The world the camera is focused on, or null for the full universe view. */
  active: SectionId | null;
  hovered: SectionId | null;
  /** True once the opening fly-in has finished. */
  arrived: boolean;
  setActive: (id: SectionId | null) => void;
  setHovered: (id: SectionId | null) => void;
  setArrived: (v: boolean) => void;
}

export const useUniverse = create<UniverseState>((set) => ({
  active: null,
  hovered: null,
  arrived: false,
  setActive: (active) => set({ active, hovered: null }),
  setHovered: (hovered) => set({ hovered }),
  setArrived: (arrived) => set({ arrived }),
}));
