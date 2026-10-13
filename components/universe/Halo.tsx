"use client";

import { forwardRef, useMemo } from "react";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import { haloFragment, haloVertex } from "./shaders";

interface Props {
  color: string;
  size?: number;
  opacity?: number;
}

/** A camera-facing soft glow. Expose the material so callers can animate it. */
export const Halo = forwardRef<THREE.ShaderMaterial, Props>(function Halo(
  { color, size = 4, opacity = 0.5 },
  ref,
) {
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(color) }, uOpacity: { value: opacity } }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [color],
  );
  return (
    <Billboard>
      <mesh raycast={() => null}>
        <planeGeometry args={[size, size]} />
        <shaderMaterial
          ref={ref}
          vertexShader={haloVertex}
          fragmentShader={haloFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </Billboard>
  );
});
