"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ── Interactive 3D Central Blob/Sphere ── */
function CentralCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    meshRef.current.rotation.y = t * 0.2;

    // Smooth lerp towards mouse position
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      mouseRef.current.x * 0.9,
      0.05
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      mouseRef.current.y * 0.6,
      0.05
    );
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 3]} />
        <MeshDistortMaterial
          color="#0f0f12"
          emissive="#FC6B2F"
          emissiveIntensity={0.15}
          roughness={0.2}
          metalness={0.8}
          distort={0.35}
          speed={2}
          wireframe
        />
      </mesh>
    </Float>
  );
}

/* ── Orbital Glass Rings ── */
function OrbitalRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.z = t * 0.05;
    groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.15;
  });

  return (
    <group ref={groupRef}>
      {/* Outer Ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3.2, 0.015, 16, 100]} />
        <meshBasicMaterial color="#FC6B2F" transparent opacity={0.3} />
      </mesh>
      {/* Inner Ring */}
      <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[2.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

/* ── Floating Particle Field ── */
function ParticleField({ count = 100 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 12;
      const speed = 0.2 + Math.random() * 0.5;
      const factor = 0.3 + Math.random() * 0.7;
      temp.push({ x, y, z, speed, factor, initialY: y });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + i) * 0.3,
        p.initialY + Math.cos(t * p.speed * 0.8 + i) * 0.4,
        p.z + Math.sin(t * p.speed * 0.5 + i) * 0.2
      );
      const s = p.factor * (0.015 + Math.sin(t * 2 + i) * 0.005);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#FC6B2F" transparent opacity={0.4} />
    </instancedMesh>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[12]" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#FC6B2F" />
        <pointLight position={[0, 0, 5]} intensity={0.5} color="#FC6B2F" />

        <CentralCore />
        <OrbitalRings />
        <ParticleField count={140} />
      </Canvas>
    </div>
  );
}
