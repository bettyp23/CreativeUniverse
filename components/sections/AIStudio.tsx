import { projectsIn } from "@/lib/projects";
import { ProjectList } from "./ProjectList";

/**
 * Focused view for this world. Grow it freely: add filters, galleries or
 * anything else the world needs. Projects come from lib/projects.ts.
 */
export default function AIStudio() {
  return <ProjectList projects={projectsIn("ai")} />;
}
