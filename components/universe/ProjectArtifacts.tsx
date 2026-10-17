"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { isPortrait, sections, type SectionId } from "@/lib/sections";
import { projectsIn, type Project } from "@/lib/projects";
import { useUniverse } from "@/lib/store";
import { openProject, prefersReducedMotion } from "@/lib/useNavigation";
import { Artifact } from "@/components/artifacts/Artifact";
import { artifactPositions, worldPositions } from "./worldPositions";

/**
 * How each world arranges its artifacts in the universe view: fanned out in a
 * direction away from the core (radians, in the screen plane), or orbiting the
 * world like a carousel.
 */
const LAYOUT: Record<SectionId, number | "ring"> = { dev: 1.75, ai: 0.8, lab: -2.45, web: "ring" };
const SPREAD = 0.72;
const RING_SPEED = 0.06;

/** Where artifacts gather when their world is in focus, so they stay in frame beside the panel. */
const FOCUSED = {
  wide: { angle: -Math.PI / 2, radius: 1.45, spread: 0.62, z: 0.3 },
  portrait: { angle: -Math.PI / 2, radius: 0.95, spread: 0.95, z: 0.6 },
};

function fanOffset(angle: number, radius: number, spread: number, i: number, n: number, z: number) {
  const a = angle + (i - (n - 1) / 2) * spread;
  return new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius * 0.85, z);
}

interface Placement {
  project: Project;
  offset: THREE.Vector3;
  focusedOffset: THREE.Vector3;
  /** Set for artifacts that orbit their world instead of holding a fixed offset. */
  ring?: { phase: number; radius: number };
}

function ProjectArtifact({ project, offset, focusedOffset, ring, reduced }: Placement & { reduced: boolean }) {
  const root = useRef<THREE.Group>(null);
  const current = useMemo(() => offset.clone(), [offset]);
  const orbit = useMemo(() => new THREE.Vector3(), []);
  const scaler = useRef<THREE.Group>(null);
  const hovered = useUniverse((s) => s.hoveredProject === project.slug);

  useFrame((state, dt) => {
    const wp = worldPositions[project.section];
    if (!root.current || !wp) return;
    let target = useUniverse.getState().active === project.section ? focusedOffset : offset;
    if (ring && target === offset) {
      // A tilted orbit around the world, slowly turning unless motion is reduced.
      const a = ring.phase + (reduced ? 0 : state.clock.elapsedTime * RING_SPEED);
      orbit.set(Math.cos(a) * ring.radius, Math.sin(a) * ring.radius * 0.3, Math.sin(a) * ring.radius * 0.75);
      target = orbit;
    }
    const k = reduced ? 1 : 1 - Math.exp(-3 * dt);
    current.lerp(target, k);
    root.current.position.copy(wp).add(current);
    (artifactPositions[project.slug] ??= new THREE.Vector3()).copy(root.current.position);
    if (scaler.current) {
      const s = THREE.MathUtils.damp(scaler.current.scale.x, hovered ? 1.35 : 1, 8, dt);
      scaler.current.scale.setScalar(s);
    }
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (useUniverse.getState().focusProject) return;
    useUniverse.getState().setHoveredProject(project.slug);
    document.body.style.cursor = "pointer";
  };
  const out = () => {
    if (useUniverse.getState().hoveredProject === project.slug) useUniverse.getState().setHoveredProject(null);
    document.body.style.cursor = "";
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "";
    openProject(project.slug);
  };

  return (
    <group ref={root}>
      <group ref={scaler}>
        <Artifact type={project.type} seed={project.slug} reduced={reduced} />
      </group>
      {/* Invisible hit area, larger than the artifact so it's easy to hover and tap. */}
      <mesh onPointerOver={over} onPointerOut={out} onClick={click} visible={false}>
        <sphereGeometry args={[0.34, 12, 12]} />
        <meshBasicMaterial />
      </mesh>
      {hovered && (
        <Html center position={[0, 0.48, 0]} pointerEvents="none" zIndexRange={[25, 25]}>
          <span className="artifact-tip">{project.title}</span>
        </Html>
      )}
    </group>
  );
}

/** Every project's artifact, fanned out around the world it belongs to. */
export function ProjectArtifacts() {
  const portrait = useThree((st) => isPortrait(st.size.width, st.size.height));
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(prefersReducedMotion());
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const placed = useMemo<Placement[]>(() => {
    const radius = portrait ? 1.35 : 1.7;
    const f = portrait ? FOCUSED.portrait : FOCUSED.wide;
    return sections.flatMap((s) => {
      const list = projectsIn(s.id);
      const layout = LAYOUT[s.id];
      // Keep a busy world's focused fan from wrapping around it.
      const focusedSpread = Math.min(f.spread, 2.6 / Math.max(list.length - 1, 1));
      return list.map((project, i) => {
        const ring = layout === "ring" ? { phase: (i / list.length) * Math.PI * 2, radius: radius * (portrait ? 0.8 : 0.95) } : undefined;
        return {
          project,
          ring,
          offset: ring
            ? new THREE.Vector3(Math.cos(ring.phase) * ring.radius, 0, Math.sin(ring.phase) * ring.radius)
            : fanOffset(layout as number, radius, SPREAD, i, list.length, i % 2 ? 0.35 : -0.25),
          focusedOffset: fanOffset(f.angle, f.radius, focusedSpread, i, list.length, f.z),
        };
      });
    });
  }, [portrait]);

  return (
    <group>
      {placed.map((p) => (
        <ProjectArtifact key={p.project.slug} {...p} reduced={reduced} />
      ))}
    </group>
  );
}
