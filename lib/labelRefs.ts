import type { SectionId } from "./sections";

/**
 * DOM label elements for each world, registered by <NodeLabels/> and moved
 * every frame by <LabelProjector/> inside the 3D scene.
 */
export const labelRefs: Partial<Record<SectionId, HTMLElement | null>> = {};
