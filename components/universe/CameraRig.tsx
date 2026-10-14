"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { isPortrait, positionFor, sectionById } from "@/lib/sections";
import { useUniverse } from "@/lib/store";
import { prefersReducedMotion } from "@/lib/useNavigation";
import { artifactPositions } from "./worldPositions";

/**
 * Glides the camera between the universe view and each world.
 * Positions are framed so the 3D object sits beside the text panel:
 * to the right on wide screens, above it on tall (phone) screens.
 */
export function CameraRig() {
  const { camera, size, pointer } = useThree();
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const pos = useMemo(() => new THREE.Vector3(), []);
  const tgt = useMemo(() => new THREE.Vector3(), []);
  const reduced = useRef(false);
  const intro = useRef(0);

  useEffect(() => {
    // Reveal the interface even if the fly-in runs slowly on a weak device.
    const t = setTimeout(() => useUniverse.getState().setArrived(true), 2600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    reduced.current = prefersReducedMotion();
    // Start far out for the opening fly-in.
    if (!reduced.current) camera.position.set(-6, 5, 30);
  }, [camera]);

  useFrame((state, dt) => {
    const { active, arrived, setArrived, focusProject } = useUniverse.getState();
    const portrait = isPortrait(size.width, size.height);
    const artifact = focusProject ? artifactPositions[focusProject] : undefined;

    if (artifact) {
      // Fly in close to a project's artifact just before its page opens.
      tgt.copy(artifact);
      pos.set(tgt.x + 0.15, tgt.y + 0.12, tgt.z + 1.5);
    } else if (active) {
      const p = positionFor(sectionById(active), portrait);
      if (portrait) {
        tgt.set(p[0], p[1] - 1.45, p[2]);
        pos.set(tgt.x, tgt.y + 0.3, tgt.z + 6.8);
      } else {
        tgt.set(p[0] - 1.6, p[1] - 0.05, p[2]);
        pos.set(tgt.x + 0.4, tgt.y + 0.4, tgt.z + 5.4);
      }
    } else if (portrait) {
      tgt.set(0, 1.75, 0);
      pos.set(0, 2.0, 14);
    } else {
      // Universe view: shift the frame so the core sits right of the hero text.
      tgt.set(-2.3, 0.0, 0);
      pos.set(-2.3, 0.45, 11.8);
      // Gentle parallax that follows the pointer.
      if (!reduced.current && arrived) {
        pos.x += pointer.x * 0.6;
        pos.y += pointer.y * 0.35;
      }
    }

    // Slower, more cinematic easing for the opening and for zoom-ins.
    let lambda = artifact ? 3.2 : active ? 2.1 : 1.8;
    if (!arrived) {
      intro.current += dt;
      lambda = 0.9 + Math.min(intro.current, 3) * 0.3;
      if (camera.position.distanceTo(pos) < 0.4 || reduced.current) setArrived(true);
    }
    if (reduced.current) lambda = 12;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, pos.x, lambda, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pos.y, lambda, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, pos.z, lambda, dt);
    look.current.x = THREE.MathUtils.damp(look.current.x, tgt.x, lambda * 1.15, dt);
    look.current.y = THREE.MathUtils.damp(look.current.y, tgt.y, lambda * 1.15, dt);
    look.current.z = THREE.MathUtils.damp(look.current.z, tgt.z, lambda * 1.15, dt);
    camera.lookAt(look.current);
  });

  return null;
}
