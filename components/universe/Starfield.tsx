"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PALETTE = ["#ffffff", "#e9e6ff", "#9fb6ff", "#d9a8ff", "#ff9fc6", "#ffc59a"];

const vertex = /* glsl */ `
  attribute float aScale;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float twinkle = 0.65 + 0.35 * sin(uTime * (0.6 + aPhase) + aPhase * 12.0);
    gl_PointSize = uSize * aScale * uPixelRatio * (18.0 / -mv.z);
    vColor = aColor;
    vAlpha = twinkle;
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float glow = pow(core, 2.4);
    gl_FragColor = vec4(vColor, glow * vAlpha);
  }
`;

interface Props {
  count?: number;
  inner?: number;
  outer?: number;
  size?: number;
  /** Radians per second around the Y axis. */
  spin?: number;
  flat?: number;
}

/** Soft, twinkling particles scattered through a spherical shell. */
export function Starfield({
  count = 2600,
  inner = 6,
  outer = 40,
  size = 1.6,
  spin = 0.006,
  flat = 1,
}: Props) {
  const ref = useRef<THREE.Points>(null);
  const dpr = useThree((s) => s.viewport.dpr);

  const { geometry, material } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scale = new Float32Array(count);
    const phase = new Float32Array(count);
    const color = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = inner + Math.pow(Math.random(), 0.7) * (outer - inner);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) * flat;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      scale[i] = 0.3 + Math.pow(Math.random(), 3) * 1.7;
      phase[i] = Math.random();
      c.set(PALETTE[Math.random() < 0.6 ? 0 : 1 + Math.floor(Math.random() * 5)]);
      color.set([c.r, c.g, c.b], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
    const m = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: 1 },
        uSize: { value: size },
      },
    });
    return { geometry: g, material: m };
  }, [count, inner, outer, size, flat]);

  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uPixelRatio.value = dpr;
    if (ref.current) ref.current.rotation.y += delta * spin;
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}
