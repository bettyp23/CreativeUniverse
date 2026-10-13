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
  dashed?: boolean;
}

const RINGS: Ring[] = [
  { radius: [3.4, 2.9], tilt: [1.2, 0.15, 0.25], color: "#5b8cff", opacity: 0.35, speed: 0.04 },
  { radius: [4.4, 3.6], tilt: [1.35, -0.3, -0.4], color: "#c26bff", opacity: 0.28, speed: -0.03, dashed: true },
  { radius: [2.3, 2.1], tilt: [0.5, 0.6, 0.1], color: "#ff5fa2", opacity: 0.3, speed: 0.07 },
  { radius: [5.6, 4.6], tilt: [1.45, 0.2, 0.55], color: "#ff9a4d", opacity: 0.16, speed: 0.02 },
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
  const bead = useMemo(() => Math.random() * Math.PI * 2, []);
  const beadRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * ring.speed;
    if (beadRef.current) {
      const a = bead + performance.now() * 0.0002 * Math.sign(ring.speed + 0.0001);
      beadRef.current.position.set(Math.cos(a) * ring.radius[0], Math.sin(a) * ring.radius[1], 0);
    }
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
          dashed={ring.dashed}
          dashSize={0.18}
          gapSize={0.14}
          depthWrite={false}
          toneMapped={false}
        />
        {/* A small travelling light on each orbit */}
        <mesh ref={beadRef}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color={ring.color} toneMapped={false} />
        </mesh>
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
