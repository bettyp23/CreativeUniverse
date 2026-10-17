"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useState } from "react";
import { sections } from "@/lib/sections";
import { useUniverse } from "@/lib/store";
import { Starfield } from "./Starfield";
import { Constellation } from "./Constellation";
import { OrbitRings } from "./OrbitRings";
import { Core } from "./Core";
import { WorldNode } from "./WorldNode";
import { ProjectArtifacts } from "./ProjectArtifacts";
import { CameraRig } from "./CameraRig";
import { LabelProjector } from "./LabelProjector";

/** The full-screen 3D universe that sits behind the interface. */
export default function UniverseScene() {
  const [dpr, setDpr] = useState(1.5);
  const [fx, setFx] = useState(true);

  return (
    <Canvas
      className="universe-canvas"
      dpr={dpr}
      camera={{ position: [-2.3, 0.6, 11.5], fov: 42, near: 0.1, far: 200 }}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
      onPointerMissed={() => {
        useUniverse.getState().setHovered(null);
        useUniverse.getState().setHoveredProject(null);
      }}
      aria-hidden
    >
      <color attach="background" args={["#070812"]} />
      <fog attach="fog" args={["#070812", 18, 48]} />
      <PerformanceMonitor
        onDecline={() => {
          setDpr(1);
          setFx(false);
        }}
        onIncline={() => setDpr(1.5)}
      />
      <AdaptiveDpr pixelated={false} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[-4, 5, 6]} color="#dfe8ff" intensity={0.8} />
      <pointLight position={[0, 0, 0]} color="#4da3ff" intensity={8} distance={9} />
      <pointLight position={[-6, 4, 6]} color="#9fb8ff" intensity={14} distance={20} />

      <Suspense fallback={null}>
        <Starfield />
        <Starfield count={260} inner={1.5} outer={7} size={0.8} spin={-0.02} flat={0.55} />
        <Constellation />
        <OrbitRings />
        <Core />
        {sections.map((s) => (
          <WorldNode key={s.id} section={s} />
        ))}
        <ProjectArtifacts />
      </Suspense>

      <CameraRig />
      <LabelProjector />

      <EffectComposer enabled={fx} multisampling={0}>
        <Bloom mipmapBlur intensity={0.35} luminanceThreshold={0.55} luminanceSmoothing={0.3} radius={0.6} />
        <Vignette offset={0.25} darkness={0.7} />
      </EffectComposer>
    </Canvas>
  );
}
