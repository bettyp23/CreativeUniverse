"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ProjectType } from "@/lib/projects";
import { ARTIFACT_PALETTE, ARTIFACT_SPIN } from "./palette";
import { artifactGlow, artifactLine, artifactSurface } from "./materials";

interface Props {
  type: ProjectType;
  /** Any stable string (the project slug); varies node layouts and timing per project. */
  seed: string;
  reduced?: boolean;
}

/** Small deterministic random generator so each project keeps its own shape. */
function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/** AI: a translucent glowing prism with a bright spark inside. */
function Prism({ color }: { color: string }) {
  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.17, 0.17, 0.46, 3, 1)),
    [],
  );
  return (
    <group rotation={[0.25, 0, 0.12]}>
      <mesh material={artifactSurface(color)}>
        <cylinderGeometry args={[0.17, 0.17, 0.46, 3, 1]} />
      </mesh>
      <lineSegments geometry={edges} material={artifactLine(color)} />
      <mesh material={artifactGlow(color)}>
        <octahedronGeometry args={[0.045, 0]} />
      </mesh>
    </group>
  );
}

/** Software: a small structure of connected nodes and lines. */
function Nodes({ color, seed }: { color: string; seed: string }) {
  const { points, lines } = useMemo(() => {
    const rand = rng(seed);
    const pts: THREE.Vector3[] = [new THREE.Vector3(0, 0, 0)];
    for (let i = 0; i < 6; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = 0.17 + rand() * 0.1;
      pts.push(new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)));
    }
    const seg: number[] = [];
    const seen = new Set<string>();
    pts.forEach((p, i) => {
      // Join every node to its two nearest neighbours.
      pts
        .map((q, j) => ({ j, d: p.distanceTo(q) }))
        .filter(({ j }) => j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .forEach(({ j }) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (seen.has(key)) return;
          seen.add(key);
          seg.push(p.x, p.y, p.z, pts[j].x, pts[j].y, pts[j].z);
        });
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
    return { points: pts, lines: g };
  }, [seed]);

  return (
    <group>
      <lineSegments geometry={lines} material={artifactLine(color)} />
      {points.map((p, i) => (
        <mesh key={i} position={p} material={i === 0 ? artifactGlow(color) : artifactSurface(color)}>
          <sphereGeometry args={[i === 0 ? 0.05 : 0.038, 16, 16]} />
        </mesh>
      ))}
    </group>
  );
}

const ASSEMBLE = 8;
const HOLD = 6;
const CYCLE = ASSEMBLE * 2 + HOLD;

/** Prototype: a wireframe that slowly draws itself edge by edge, then unbuilds. */
function Wireframe({ color, seed, reduced }: { color: string; seed: string; reduced: boolean }) {
  const geometry = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.24, 0)), []);
  const total = geometry.getAttribute("position").count / 2;
  const offset = useMemo(() => rng(seed)() * CYCLE, [seed]);

  useFrame((state) => {
    if (reduced) {
      geometry.setDrawRange(0, Infinity);
      return;
    }
    const t = (state.clock.elapsedTime + offset) % CYCLE;
    const f = t < ASSEMBLE ? t / ASSEMBLE : t < ASSEMBLE + HOLD ? 1 : 1 - (t - ASSEMBLE - HOLD) / ASSEMBLE;
    // Never fully vanish, so the artifact stays findable.
    const edges = Math.max(3, Math.round(THREE.MathUtils.smoothstep(f, 0, 1) * total));
    geometry.setDrawRange(0, edges * 2);
  });

  return (
    <group>
      <lineSegments geometry={geometry} material={artifactLine(color)} />
      <mesh material={artifactGlow(color)}>
        <icosahedronGeometry args={[0.05, 0]} />
      </mesh>
    </group>
  );
}

/** Design: a small stack of glowing browser windows. */
function Panes({ color }: { color: string }) {
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.36, 0.25)), []);
  const bar = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute([-0.18, 0.08, 0, 0.18, 0.08, 0], 3));
    return g;
  }, []);
  const panes: [number, number, number][] = [
    [-0.07, -0.06, -0.12],
    [0, 0, 0],
    [0.07, 0.06, 0.12],
  ];
  return (
    <group rotation={[0.1, -0.35, 0]}>
      {panes.map((p, i) => (
        <group key={i} position={p}>
          <mesh material={artifactSurface(color)}>
            <planeGeometry args={[0.36, 0.25]} />
          </mesh>
          <lineSegments geometry={edges} material={artifactLine(color)} />
          <lineSegments geometry={bar} material={artifactLine(color)} />
          {i === panes.length - 1 &&
            [0, 1, 2].map((d) => (
              <mesh key={d} position={[-0.15 + d * 0.03, 0.1, 0.002]} material={artifactGlow(color)}>
                <circleGeometry args={[0.009, 10]} />
              </mesh>
            ))}
        </group>
      ))}
    </group>
  );
}

/** A project's 3D artifact. Shape follows the project type; all share one palette and material. */
export function Artifact({ type, seed, reduced = false }: Props) {
  const spin = useRef<THREE.Group>(null);
  const color = ARTIFACT_PALETTE[type];

  useFrame((_, dt) => {
    if (!reduced && spin.current) spin.current.rotation.y += dt * ARTIFACT_SPIN;
  });

  return (
    <group ref={spin}>
      {type === "ai" && <Prism color={color} />}
      {type === "software" && <Nodes color={color} seed={seed} />}
      {type === "prototype" && <Wireframe color={color} seed={seed} reduced={reduced} />}
      {type === "design" && <Panes color={color} />}
    </group>
  );
}
