"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { isPortrait, positionFor, sections } from "@/lib/sections";

/**
 * A faint network of stars joined by hairlines, clustered around the core and
 * the three worlds so the scene reads as one connected constellation.
 */
export function Constellation({ count = 90, maxDist = 1.9 }) {
  const group = useRef<THREE.Group>(null);
  const portrait = useThree((st) => isPortrait(st.size.width, st.size.height));

  const { points, lines } = useMemo(() => {
    const anchors = [new THREE.Vector3(0, 0, 0), ...sections.map((s) => new THREE.Vector3(...positionFor(s, portrait)))];
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const a = anchors[i % anchors.length];
      const spread = i % anchors.length === 0 ? 4.2 : 2.2;
      pts.push(
        new THREE.Vector3(
          a.x + (Math.random() - 0.5) * spread * 2,
          a.y + (Math.random() - 0.5) * spread * 1.4,
          a.z + (Math.random() - 0.5) * spread * 1.6,
        ),
      );
    }
    const seg: number[] = [];
    for (let i = 0; i < pts.length; i++) {
      let links = 0;
      for (let j = i + 1; j < pts.length && links < 2; j++) {
        if (pts[i].distanceTo(pts[j]) < maxDist) {
          seg.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
          links++;
        }
      }
    }
    // Long faint threads from the core out to each world.
    for (const a of anchors.slice(1)) seg.push(0, 0, 0, a.x, a.y, a.z);

    const pg = new THREE.BufferGeometry().setFromPoints(pts);
    const lg = new THREE.BufferGeometry();
    lg.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
    return { points: pg, lines: lg };
  }, [count, maxDist, portrait]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.05) * 0.04;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial
          color="#9aa6ff"
          transparent
          opacity={0.13}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <points geometry={points}>
        <pointsMaterial
          color="#e9e6ff"
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
