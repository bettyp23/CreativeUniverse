import * as THREE from "three";

const surfaces = new Map<string, THREE.MeshPhysicalMaterial>();
const lines = new Map<string, THREE.LineBasicMaterial>();
const glows = new Map<string, THREE.MeshBasicMaterial>();

/** The shared translucent, glowing surface every artifact is made from. */
export function artifactSurface(color: string) {
  let m = surfaces.get(color);
  if (!m) {
    m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color).multiplyScalar(0.35),
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.22,
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide,
      depthWrite: false,
      toneMapped: false,
    });
    surfaces.set(color, m);
  }
  return m;
}

/** Shared glowing line material for edges and connections. */
export function artifactLine(color: string) {
  let m = lines.get(color);
  if (!m) {
    m = new THREE.LineBasicMaterial({
      color: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.35),
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    lines.set(color, m);
  }
  return m;
}

/** Shared bright material for small points of light (nodes, sparks). */
export function artifactGlow(color: string) {
  let m = glows.get(color);
  if (!m) {
    m = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.45),
      toneMapped: false,
    });
    glows.set(color, m);
  }
  return m;
}
