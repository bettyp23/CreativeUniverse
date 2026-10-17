"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { coreFragment, coreVertex } from "./shaders";
import { Halo } from "./Halo";
import { useUniverse } from "@/lib/store";

/** The heart of the universe: a dark glass sphere with a slow blue rim of light. */
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
          uAmp: { value: 0.05 },
          uGlow: { value: 0.7 },
          uA: { value: new THREE.Color("#18264a") },
          uB: { value: new THREE.Color("#22345f") },
          uC: { value: new THREE.Color("#2a2a5c") },
          uD: { value: new THREE.Color("#8fc2ff") },
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
    u.uGlow.value = THREE.MathUtils.damp(u.uGlow.value, focused ? 0.4 : 0.7, 2, delta);
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
      <Halo color="#3d6fd9" size={7} opacity={0.16} />
      <group ref={group}>
        <mesh material={material} raycast={() => null}>
          <icosahedronGeometry args={[1.15, 48]} />
        </mesh>
      </group>
      <lineSegments ref={shell} geometry={shellGeo} raycast={() => null}>
        <lineBasicMaterial color="#9fb8ff" transparent opacity={0.07} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <lineSegments ref={shell2} geometry={shellGeo2} raycast={() => null}>
        <lineBasicMaterial color="#9fb8ff" transparent opacity={0.035} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
}
