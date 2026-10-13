"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { coreFragment, coreVertex } from "./shaders";
import { Halo } from "./Halo";
import { useUniverse } from "@/lib/store";

/** The glowing abstract heart of the universe. */
export function Core() {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.LineSegments>(null);
  const shell2 = useRef<THREE.LineSegments>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: coreVertex,
        fragmentShader: coreFragment,
        uniforms: {
          uTime: { value: 0 },
          uAmp: { value: 0.7 },
          uGlow: { value: 1 },
          uA: { value: new THREE.Color("#5b8cff") },
          uB: { value: new THREE.Color("#c26bff") },
          uC: { value: new THREE.Color("#ff5fa2") },
          uD: { value: new THREE.Color("#ffb27a") },
        },
      }),
    [],
  );

  const shellGeo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.75, 1)),
    [],
  );
  const shellGeo2 = useMemo(
    () => new THREE.EdgesGeometry(new THREE.OctahedronGeometry(2.25, 0)),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    material.uniforms.uTime.value = t;
    // Calm down the core while a world is in focus.
    const focused = useUniverse.getState().active !== null;
    const u = material.uniforms;
    u.uGlow.value = THREE.MathUtils.damp(u.uGlow.value, focused ? 0.55 : 1, 2, delta);
    if (group.current) group.current.rotation.y += delta * 0.08;
    if (shell.current) {
      shell.current.rotation.x += delta * 0.05;
      shell.current.rotation.z -= delta * 0.03;
    }
    if (shell2.current) {
      shell2.current.rotation.y -= delta * 0.04;
      shell2.current.rotation.x = Math.sin(t * 0.1) * 0.4;
    }
  });

  return (
    <group>
      <Halo color="#7a5cff" size={9} opacity={0.55} />
      <Halo color="#ff5fa2" size={4.5} opacity={0.25} />
      <group ref={group}>
        <mesh material={material} raycast={() => null}>
          <icosahedronGeometry args={[1.15, 48]} />
        </mesh>
      </group>
      <lineSegments ref={shell} geometry={shellGeo} raycast={() => null}>
        <lineBasicMaterial color="#b9a8ff" transparent opacity={0.16} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <lineSegments ref={shell2} geometry={shellGeo2} raycast={() => null}>
        <lineBasicMaterial color="#ff9fc6" transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
}
