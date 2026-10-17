"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { isPortrait, positionFor, type Section } from "@/lib/sections";
import { useUniverse } from "@/lib/store";
import { goTo } from "@/lib/useNavigation";
import { Halo } from "./Halo";
import { worldPositions } from "./worldPositions";

/** Evenly spread points on a sphere, for the AI Studio's point cloud. */
function fibonacciSphere(n: number, r: number) {
  const pts = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const a = golden * i;
    pts.set([Math.cos(a) * rad * r, y * r, Math.sin(a) * rad * r], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pts, 3));
  return g;
}

/**
 * The object that represents each world. All four share one material language,
 * dark frosted glass with fine edges in the world's colour, so they read as one set.
 */
function Shape({ section, mats }: { section: Section; mats: THREE.MeshStandardMaterial[] }) {
  const spin = useRef<THREE.Group>(null);
  const a = useRef<THREE.Group>(null);
  const [glass, light] = mats;

  const geo = useMemo(() => {
    if (section.shape === "crystal") return new THREE.EdgesGeometry(new THREE.BoxGeometry(0.62, 1.4, 0.16));
    if (section.shape === "knot") return fibonacciSphere(520, 0.72);
    if (section.shape === "panes") return new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.15, 0.78));
    return new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.82, 1));
  }, [section.shape]);

  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.18;
    if (!a.current) return;
    if (section.shape === "panes") a.current.rotation.x = 0.12 + Math.sin(performance.now() * 0.0005) * 0.06;
    else a.current.rotation.x += dt * 0.12;
  });

  const edgeMat = (opacity: number) => (
    <lineBasicMaterial color={section.accent} transparent opacity={opacity} depthWrite={false} />
  );

  if (section.shape === "crystal") {
    // Dev Projects: two glass monoliths, like slabs of engineered material.
    return (
      <group ref={spin} rotation={[0, 0, 0.08]}>
        <mesh material={glass}>
          <boxGeometry args={[0.62, 1.4, 0.16]} />
        </mesh>
        <lineSegments geometry={geo} raycast={() => null}>
          {edgeMat(0.6)}
        </lineSegments>
        <group position={[0.42, -0.18, -0.32]} scale={0.62} rotation={[0, 0.5, 0]}>
          <mesh material={glass}>
            <boxGeometry args={[0.62, 1.4, 0.16]} />
          </mesh>
          <lineSegments geometry={geo} raycast={() => null}>
            {edgeMat(0.35)}
          </lineSegments>
        </group>
      </group>
    );
  }

  if (section.shape === "knot") {
    // AI Studio: a fine point cloud around a small glass core, like a model's latent space.
    return (
      <group ref={spin}>
        <group ref={a}>
          <points geometry={geo} raycast={() => null}>
            <pointsMaterial color={section.accent} size={0.022} sizeAttenuation transparent opacity={0.8} depthWrite={false} />
          </points>
        </group>
        <mesh material={glass}>
          <sphereGeometry args={[0.3, 48, 48]} />
        </mesh>
        <mesh rotation={[1.25, 0.2, 0]} raycast={() => null}>
          <torusGeometry args={[0.98, 0.004, 6, 160]} />
          <meshBasicMaterial color={section.accent} transparent opacity={0.45} />
        </mesh>
      </group>
    );
  }

  if (section.shape === "panes") {
    // Web Gallery: a fanned stack of browser windows, like pages in a portfolio.
    const panes: [number, number, number][] = [
      [-0.24, -0.18, -0.36],
      [0, 0, 0],
      [0.24, 0.18, 0.36],
    ];
    return (
      <group ref={spin}>
        <group ref={a} rotation={[0.12, -0.45, 0.04]} scale={0.82}>
          {panes.map((p, i) => {
            const front = i === panes.length - 1;
            return (
              <group key={i} position={p}>
                <mesh material={glass}>
                  <boxGeometry args={[1.15, 0.78, 0.02]} />
                </mesh>
                <lineSegments geometry={geo} position={[0, 0, 0.012]} raycast={() => null}>
                  {edgeMat(front ? 0.6 : 0.3)}
                </lineSegments>
                {front && (
                  <>
                    <mesh position={[0, 0.27, 0.015]} material={light}>
                      <boxGeometry args={[1.05, 0.006, 0.004]} />
                    </mesh>
                    {[0, 1, 2].map((d) => (
                      <mesh key={d} position={[-0.47 + d * 0.06, 0.33, 0.015]} material={light}>
                        <sphereGeometry args={[0.016, 12, 12]} />
                      </mesh>
                    ))}
                  </>
                )}
              </group>
            );
          })}
        </group>
      </group>
    );
  }

  // Innovation Lab: a wire lattice around a turning glass seed.
  return (
    <group ref={spin}>
      <lineSegments geometry={geo} raycast={() => null}>
        {edgeMat(0.5)}
      </lineSegments>
      <group ref={a}>
        <mesh material={glass}>
          <octahedronGeometry args={[0.34, 0]} />
        </mesh>
      </group>
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

  const mats = useMemo<THREE.MeshStandardMaterial[]>(() => {
    // Dark frosted glass, faintly lit from within by the world's colour.
    const m1 = new THREE.MeshPhysicalMaterial({
      color: "#121a33",
      emissive: new THREE.Color(section.color),
      emissiveIntensity: 0.16,
      roughness: 0.35,
      metalness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.3,
      transparent: true,
      opacity: 0.88,
    });
    const m2 = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      emissive: new THREE.Color(section.accent),
      emissiveIntensity: 0.7,
    });
    return [m1, m2];
  }, [section.color, section.accent]);

  useFrame((state, dt) => {
    const { hovered, active } = useUniverse.getState();
    const isHover = hovered === section.id;
    const isActive = active === section.id;
    const dim = active !== null && !isActive;
    const t = state.clock.elapsedTime;

    if (root.current) root.current.position.y = position[1] + Math.sin(t * 0.5 + seed) * 0.06;
    if (inner.current) {
      const target = isActive ? 1.1 : isHover ? 1.15 : 1;
      const s = THREE.MathUtils.damp(inner.current.scale.x, target, 6, dt);
      inner.current.scale.setScalar(s);
    }
    const em = isHover || isActive ? 0.42 : dim ? 0.06 : 0.16;
    mats[0].emissiveIntensity = THREE.MathUtils.damp(mats[0].emissiveIntensity, em, 5, dt);
    mats[1].emissiveIntensity = THREE.MathUtils.damp(mats[1].emissiveIntensity, em * 4.5, 5, dt);
    if (halo.current) {
      const target = isHover || isActive ? 0.28 : dim ? 0.04 : 0.1;
      const u = halo.current.uniforms.uOpacity;
      u.value = THREE.MathUtils.damp(u.value, target, 5, dt);
    }
    if (root.current) {
      const wp = (worldPositions[section.id] ??= new THREE.Vector3());
      root.current.getWorldPosition(wp);
    }
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    // While any world is open, let pointer events pass through to the artifacts behind this hit area.
    if (useUniverse.getState().active) return;
    e.stopPropagation();
    useUniverse.getState().setHovered(section.id);
    document.body.style.cursor = "pointer";
  };
  const out = () => {
    if (useUniverse.getState().hovered === section.id) useUniverse.getState().setHovered(null);
    document.body.style.cursor = "";
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    if (useUniverse.getState().active === section.id) return;
    e.stopPropagation();
    document.body.style.cursor = "";
    goTo(section.id);
  };

  return (
    <group ref={root} position={position}>
      <Halo ref={halo} color={section.color} size={2.6} opacity={0.1} />
      <pointLight color={section.color} intensity={2.5} distance={4} decay={2} />
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
