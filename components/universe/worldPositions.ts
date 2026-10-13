import * as THREE from "three";
import type { SectionId } from "@/lib/sections";

/** Live world-space position of each world (they bob gently over time). */
export const worldPositions: Partial<Record<SectionId, THREE.Vector3>> = {};
