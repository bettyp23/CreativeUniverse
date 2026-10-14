import type { ProjectType } from "@/lib/projects";

/** One palette for every artifact, matching the colours of the three worlds. */
export const ARTIFACT_PALETTE: Record<ProjectType, string> = {
  ai: "#c26bff",
  software: "#5b8cff",
  prototype: "#ff9a4d",
  design: "#2ee6c1",
};

/** Speed of every artifact's idle rotation, in radians per second. */
export const ARTIFACT_SPIN = 0.25;
