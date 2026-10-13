"use client";

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { isPortrait, sections } from "@/lib/sections";
import { labelRefs } from "@/lib/labelRefs";
import { worldPositions } from "./worldPositions";

/** Projects each world's 3D position to the screen and moves its DOM label there. */
export function LabelProjector() {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    for (const s of sections) {
      const el = labelRefs[s.id];
      const wp = worldPositions[s.id];
      if (!el || !wp) continue;
      v.copy(wp);
      v.y -= isPortrait(size.width, size.height) ? 1.05 : 1.3;
      v.project(camera);
      const behind = v.z > 1;
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, 0)`;
      el.style.visibility = behind ? "hidden" : "";
    }
  });

  return null;
}
