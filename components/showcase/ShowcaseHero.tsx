"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import type { Project } from "@/lib/projects";
import { isPortrait } from "@/lib/sections";
import { prefersReducedMotion } from "@/lib/useNavigation";
import { Artifact } from "@/components/artifacts/Artifact";
import { ARTIFACT_PALETTE } from "@/components/artifacts/palette";
import { Starfield } from "@/components/universe/Starfield";
import { Halo } from "@/components/universe/Halo";

/**
 * Eases the camera in from further out, so arriving on the page feels like the
 * end of the flight. On wide screens the artifact sits right of the title;
 * on phones it sits above it.
 */
function ArrivalCamera({ reduced }: { reduced: boolean }) {
  const started = useRef(false);
  const look = useRef(new THREE.Vector3());
  useFrame(({ camera, pointer, size }, dt) => {
    const portrait = isPortrait(size.width, size.height);
    const lx = portrait ? 0 : -0.42;
    const ly = portrait ? -0.3 : -0.04;
    const dist = portrait ? 2.1 : 1.45;
    if (!started.current) {
      started.current = true;
      look.current.set(lx, ly, 0);
      if (!reduced) camera.position.set(lx, ly + 0.4, dist * 3.2);
    }
    const lambda = reduced ? 50 : 2.2;
    const tx = lx + (reduced ? 0 : pointer.x * 0.12);
    const ty = ly + 0.05 + (reduced ? 0 : pointer.y * 0.08);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, tx, lambda, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, ty, lambda, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, dist, lambda, dt);
    look.current.x = THREE.MathUtils.damp(look.current.x, lx, lambda, dt);
    look.current.y = THREE.MathUtils.damp(look.current.y, ly, lambda, dt);
    camera.lookAt(look.current);
  });
  return null;
}

/** The project's artifact, large, as the hero of its page. */
export default function ShowcaseHero({ project }: { project: Project }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(prefersReducedMotion()), []);
  const color = ARTIFACT_PALETTE[project.type];

  return (
    <Canvas
      className="showcase-canvas"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.05, 1.25], fov: 40, near: 0.05, far: 100 }}
      gl={{ antialias: false, alpha: false }}
      aria-hidden
    >
      <color attach="background" args={["#070812"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[1, 1, 2]} color={color} intensity={4} />
      <Starfield count={1400} inner={4} outer={30} size={1.2} />
      <Halo color={color} size={1.6} opacity={0.16} />
      <Artifact type={project.type} seed={project.slug} reduced={reduced} />
      <ArrivalCamera reduced={reduced} />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={0.4} luminanceThreshold={0.5} luminanceSmoothing={0.3} radius={0.6} />
        <Vignette offset={0.3} darkness={0.8} />
      </EffectComposer>
    </Canvas>
  );
}
