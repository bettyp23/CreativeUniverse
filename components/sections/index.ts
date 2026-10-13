import type { ComponentType } from "react";
import type { SectionId } from "@/lib/sections";
import DevProjects from "./DevProjects";
import AIStudio from "./AIStudio";
import InnovationLab from "./InnovationLab";

/** Maps each world to the component that renders its focused content. */
export const sectionViews: Record<SectionId, ComponentType> = {
  dev: DevProjects,
  ai: AIStudio,
  lab: InnovationLab,
};
