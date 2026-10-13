import { sectionById } from "@/lib/sections";
import { WorkList } from "./WorkList";

/**
 * Focused view for this world. Grow it freely: add filters, galleries,
 * case-study links or a full page route later.
 */
export default function AIStudio() {
  const section = sectionById("ai");
  return <WorkList items={section.items} />;
}
