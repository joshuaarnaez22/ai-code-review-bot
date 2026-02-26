"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Stars, Float, Sparkles, MeshDistortMaterial, Line } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

// ─── Data ────────────────────────────────────────────────────────────────────

const NODES = [
  { color: "#ef4444", radius: 2.6, speed: 0.38, offset: 0,                y: 0.4  },
  { color: "#22c55e", radius: 2.0, speed: 0.55, offset: Math.PI * 0.5,    y: -0.3 },
  { color: "#3b82f6", radius: 3.1, speed: 0.28, offset: Math.PI,          y: 0.2  },
  { color: "#f97316", radius: 2.4, speed: 0.48, offset: Math.PI * 1.5,    y: -0.5 },
]

// ─── Core ─────────────────────────────────────────────────────────────────────

function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.12
  })

  return (
    <Float speed={1.2} floatIntensity={0.4} rotationIntensity={0.15}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.85, 64, 64]} />
        <MeshDistortMaterial
          color="#818cf8"
          emissive="#6366f1"
          emissiveIntensity={2.5}
          distort={0.35}
          speed={1.8}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>
      {/* soft halo */}
      <mesh>
        <sphereGeometry args={[1.15, 32, 32]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>
    </Float>
  )
}

// ─── Orbit rings ──────────────────────────────────────────────────────────────

function OrbitRing({ radius }: { radius: number }) {
  const points = useMemo<[number, number, number][]>(() => {
    return Array.from({ length: 129 }, (_, i) => {
      const a = (i / 128) * Math.PI * 2
      return [Math.cos(a) * radius, 0, Math.sin(a) * radius]
    })
  }, [radius])

  return <Line points={points} color="#818cf8" lineWidth={0.3} transparent opacity={0.08} />
}

// ─── Agent nodes ──────────────────────────────────────────────────────────────

function AgentNode({ color, radius, speed, offset, y }: typeof NODES[0]) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime() * speed + offset
    groupRef.current.position.set(
      Math.cos(t) * radius,
      y + Math.sin(t * 0.6) * 0.2,
      Math.sin(t) * radius
    )
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
          roughness={0}
          metalness={0}
        />
      </mesh>
      <pointLight color={color} intensity={0.8} distance={2} />
    </group>
  )
}

// ─── Floating connection lines ─────────────────────────────────────────────

function WebLines() {
  const lines = useMemo(() => {
    return Array.from({ length: 18 }, () => {
      const a1 = Math.random() * Math.PI * 2
      const a2 = Math.random() * Math.PI * 2
      const r1 = 0.9 + Math.random() * 2.4
      const r2 = 0.9 + Math.random() * 2.4
      return [
        [Math.cos(a1) * r1, (Math.random() - 0.5) * 1.8, Math.sin(a1) * r1],
        [Math.cos(a2) * r2, (Math.random() - 0.5) * 1.8, Math.sin(a2) * r2],
      ] as [number, number, number][]
    })
  }, [])

  return (
    <>
      {lines.map((pts, i) => (
        <Line key={i} points={pts} color="#6366f1" lineWidth={0.4} transparent opacity={0.12} />
      ))}
    </>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene() {
  const rootRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (rootRef.current) {
      rootRef.current.rotation.y = clock.getElapsedTime() * 0.04
    }
  })

  return (
    <>
      {/* Background */}
      <Stars radius={80} depth={50} count={2500} factor={2.5} fade speed={0.4} />

      {/* Sparkle dust */}
      <Sparkles
        count={60}
        scale={7}
        size={1.2}
        speed={0.3}
        opacity={0.5}
        color="#818cf8"
      />

      {/* Lights */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} color="#6366f1" intensity={3} distance={10} />
      <pointLight position={[4, 3, -2]} color="#8b5cf6" intensity={1.5} distance={8} />

      {/* Main group (slowly rotates) */}
      <group ref={rootRef}>
        <CoreSphere />
        <WebLines />
        {NODES.map((n, i) => (
          <OrbitRing key={i} radius={n.radius} />
        ))}
        {NODES.map((n, i) => (
          <AgentNode key={i} {...n} />
        ))}
      </group>

      {/* Bloom — this is what makes it look premium */}
      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function Hero3D() {
  return (
    <Canvas
      camera={{ position: [0, 2, 7], fov: 48 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      dpr={[1, 1.5]}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  )
}
