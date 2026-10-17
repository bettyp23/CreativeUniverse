"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

interface Ring {
  radius: [number, number];
  tilt: [number, number, number];
  color: string;
  opacity: number;
  speed: number;
}

const RINGS: Ring[] = [
  { radius: [3.4, 2.9], tilt: [1.2, 0.15, 0.25], color: "#8fb2ff", opacity: 0.1, speed: 0.03 },
  { radius: [5.6, 4.6], tilt: [1.45, 0.2, 0.55], color: "#8fb2ff", opacity: 0.06, speed: 0.015 },
];

function ellipse([rx, ry]: [number, number], segments = 160) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * rx, Math.sin(a) * ry, 0));
  }
  return pts;
}

function OrbitRing({ ring }: { ring: Ring }) {
  const ref = useRef<THREE.Group>(null);
  const points = useMemo(() => ellipse(ring.radius), [ring.radius]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * ring.speed;
  });

  return (
    <group rotation={ring.tilt}>
      <group ref={ref}>
        <Line
          points={points}
          color={ring.color}
          lineWidth={1}
          transparent
          opacity={ring.opacity}
          depthWrite={false}
          toneMapped={false}
        />
      </group>
    </group>
  );
}

export function OrbitRings() {
  return (
    <group>
      {RINGS.map((r, i) => (
        <OrbitRing key={i} ring={r} />
      ))}
    </group>
  );
}
