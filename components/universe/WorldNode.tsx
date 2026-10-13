"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { isPortrait, positionFor, type Section } from "@/lib/sections";
import { useUniverse } from "@/lib/store";
import { goTo } from "@/lib/useNavigation";
import { Halo } from "./Halo";
import { worldPositions } from "./worldPositions";

/** The abstract object that represents each world. */
function Shape({ section, mats }: { section: Section; mats: THREE.MeshStandardMaterial[] }) {
  const spin = useRef<THREE.Group>(null);
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const c = useRef<THREE.Mesh>(null);
  const [m1, m2] = mats;

  const edges = useMemo(() => {
    if (section.shape === "crystal") return new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.78, 0));
    if (section.shape === "knot") return new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.95, 0));
    return new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(0.95, 0));
  }, [section.shape]);

  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.35;
    if (section.shape === "gyro") {
      if (a.current) a.current.rotation.x += dt * 0.9;
      if (b.current) b.current.rotation.y += dt * 0.7;
      if (c.current) c.current.rotation.z += dt * 0.5;
    } else if (section.shape === "knot") {
      if (a.current) a.current.rotation.x += dt * 0.25;
    } else {
      if (b.current) b.current.rotation.z += dt * 0.6;
    }
  });

  const wire = (
    <lineSegments geometry={edges} raycast={() => null}>
      <lineBasicMaterial color={section.accent} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
  );

  if (section.shape === "crystal") {
    // Dev Projects: a faceted crystal with orbiting fragments, like code blocks.
    return (
      <group ref={spin}>
        <mesh material={m1} scale={[0.75, 1.15, 0.75]}>
          <octahedronGeometry args={[0.6, 0]} />
        </mesh>
        <group scale={[1, 1.15, 1]}>{wire}</group>
        <group ref={b}>
          {[0, 1, 2, 3, 4].map((i) => {
            const ang = (i / 5) * Math.PI * 2;
            return (
              <mesh key={i} material={m2} position={[Math.cos(ang) * 1.05, Math.sin(ang * 2) * 0.25, Math.sin(ang) * 1.05]} rotation={[ang, ang, 0]}>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
              </mesh>
            );
          })}
        </group>
      </group>
    );
  }

  if (section.shape === "knot") {
    // AI Studio: a looping knot, like a thought folding back on itself.
    return (
      <group ref={spin}>
        <mesh ref={a} material={m1}>
          <torusKnotGeometry args={[0.52, 0.11, 200, 24, 2, 3]} />
        </mesh>
        <mesh material={m2}>
          <sphereGeometry args={[0.16, 24, 24]} />
        </mesh>
        <group scale={0.95}>{wire}</group>
      </group>
    );
  }

  // Innovation Lab: a gyroscope of nested rings around a spark.
  return (
    <group ref={spin}>
      <mesh ref={a} material={m1}>
        <torusGeometry args={[0.78, 0.025, 12, 96]} />
      </mesh>
      <mesh ref={b} material={m1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.025, 12, 96]} />
      </mesh>
      <mesh ref={c} material={m2} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.44, 0.03, 12, 96]} />
      </mesh>
      <mesh material={m2}>
        <icosahedronGeometry args={[0.18, 1]} />
      </mesh>
      <group scale={0.9}>{wire}</group>
    </group>
  );
}

export function WorldNode({ section }: { section: Section }) {
  const root = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const halo = useRef<THREE.ShaderMaterial>(null);
  const seed = useMemo(() => Math.random() * 10, []);
  const portrait = useThree((st) => isPortrait(st.size.width, st.size.height));
  const position = positionFor(section, portrait);

  const mats = useMemo(() => {
    const m1 = new THREE.MeshStandardMaterial({
      color: new THREE.Color(section.color).multiplyScalar(0.25),
      emissive: new THREE.Color(section.color),
      emissiveIntensity: 1.2,
      roughness: 0.25,
      metalness: 0.6,
      toneMapped: false,
    });
    const m2 = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      emissive: new THREE.Color(section.accent),
      emissiveIntensity: 1.6,
      toneMapped: false,
    });
    return [m1, m2];
  }, [section.color, section.accent]);

  useFrame((state, dt) => {
    const { hovered, active } = useUniverse.getState();
    const isHover = hovered === section.id;
    const isActive = active === section.id;
    const dim = active !== null && !isActive;
    const t = state.clock.elapsedTime;

    if (root.current) root.current.position.y = position[1] + Math.sin(t * 0.6 + seed) * 0.12;
    if (inner.current) {
      const target = isActive ? 1.1 : isHover ? 1.15 : 1;
      const s = THREE.MathUtils.damp(inner.current.scale.x, target, 6, dt);
      inner.current.scale.setScalar(s);
    }
    const em = isHover || isActive ? 1.35 : dim ? 0.35 : 0.95 + Math.sin(t * 1.4 + seed) * 0.12;
    mats[0].emissiveIntensity = THREE.MathUtils.damp(mats[0].emissiveIntensity, em, 5, dt);
    mats[1].emissiveIntensity = THREE.MathUtils.damp(mats[1].emissiveIntensity, em * 1.3, 5, dt);
    if (halo.current) {
      const target = isHover || isActive ? 0.75 : dim ? 0.12 : 0.38;
      const u = halo.current.uniforms.uOpacity;
      u.value = THREE.MathUtils.damp(u.value, target, 5, dt);
    }
    if (root.current) {
      const wp = (worldPositions[section.id] ??= new THREE.Vector3());
      root.current.getWorldPosition(wp);
    }
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (useUniverse.getState().active) return;
    useUniverse.getState().setHovered(section.id);
    document.body.style.cursor = "pointer";
  };
  const out = () => {
    if (useUniverse.getState().hovered === section.id) useUniverse.getState().setHovered(null);
    document.body.style.cursor = "";
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "";
    goTo(section.id);
  };

  return (
    <group ref={root} position={position}>
      <Halo ref={halo} color={section.color} size={3.6} opacity={0.38} />
      <pointLight color={section.color} intensity={6} distance={4} decay={2} />
      <group ref={inner}>
        <Shape section={section} mats={mats} />
      </group>
      {/* Generous invisible hit area so the world is easy to click or tap. */}
      <mesh onPointerOver={over} onPointerOut={out} onClick={click} visible={false}>
        <sphereGeometry args={[1.25, 16, 16]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}
