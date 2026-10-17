import type { ProjectType } from "@/lib/projects";

/** One palette for every artifact, matching the colours of the three worlds. */
export const ARTIFACT_PALETTE: Record<ProjectType, string> = {
  ai: "#8f80e8",
  software: "#5b8fe8",
  prototype: "#d39268",
  design: "#4fbfa8",
};

/** Speed of every artifact's idle rotation, in radians per second. */
export const ARTIFACT_SPIN = 0.25;
