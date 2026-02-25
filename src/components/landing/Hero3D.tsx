"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Stars, Float, MeshDistortMaterial, Trail, Line } from "@react-three/drei"
import * as THREE from "three"

const NODES = [
  { label: "Security", color: "#ef4444", radius: 2.8, speed: 0.4, offset: 0 },
  { label: "Tests", color: "#22c55e", radius: 2.2, speed: 0.6, offset: Math.PI / 2 },
  { label: "Style", color: "#3b82f6", radius: 3.4, speed: 0.3, offset: Math.PI },
  { label: "Performance", color: "#f97316", radius: 2.6, speed: 0.5, offset: (3 * Math.PI) / 2 },
]

function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.15
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.9, 64, 64]} />
        <MeshDistortMaterial
          color="#6366f1"
          emissive="#4338ca"
          emissiveIntensity={0.6}
          distort={0.4}
          speed={2}
          roughness={0}
          metalness={0.1}
        />
      </mesh>
      {/* Outer glow ring */}
      <mesh>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
    </Float>
  )
}

function OrbitRing({ radius }: { radius: number }) {
  const points = useMemo<[number, number, number][]>(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2
      pts.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius])
    }
    return pts
  }, [radius])

  return (
    <Line points={points} color="#ffffff" lineWidth={0.5} transparent opacity={0.06} />
  )
}

function AgentNode({
  color,
  radius,
  speed,
  offset,
}: {
  color: string
  radius: number
  speed: number
  offset: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(t) * radius
      groupRef.current.position.z = Math.sin(t) * radius
      groupRef.current.position.y = Math.sin(t * 0.7) * 0.3
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.2 + Math.sin(clock.getElapsedTime() * 3) * 0.3
    }
  })

  return (
    <group ref={groupRef}>
      <Trail width={0.6} length={6} color={color} attenuation={(t) => t * t} decay={1}>
        <mesh>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.5}
            roughness={0}
            metalness={0.5}
          />
        </mesh>
      </Trail>
      <pointLight ref={lightRef} color={color} intensity={1.2} distance={2.5} />
    </group>
  )
}

function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null)

  useFrame(({ clock }) => {
    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.08 + Math.sin(clock.getElapsedTime()) * 0.03
    }
  })

  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = []
    for (let i = 0; i < 30; i++) {
      const theta1 = Math.random() * Math.PI * 2
      const theta2 = Math.random() * Math.PI * 2
      const r1 = 1 + Math.random() * 3
      const r2 = 1 + Math.random() * 3
      points.push(
        new THREE.Vector3(Math.cos(theta1) * r1, (Math.random() - 0.5) * 2, Math.sin(theta1) * r1),
        new THREE.Vector3(Math.cos(theta2) * r2, (Math.random() - 0.5) * 2, Math.sin(theta2) * r2)
      )
    }
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [])

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#6366f1" transparent opacity={0.1} />
    </lineSegments>
  )
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05
    }
  })

  return (
    <>
      <Stars radius={80} depth={60} count={3000} factor={3} fade speed={0.5} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#6366f1" distance={8} />

      <group ref={groupRef}>
        <CoreSphere />
        <ConnectionLines />

        {NODES.map((node) => (
          <OrbitRing key={node.label} radius={node.radius} />
        ))}

        {NODES.map((node) => (
          <AgentNode
            key={node.label}
            color={node.color}
            radius={node.radius}
            speed={node.speed}
            offset={node.offset}
          />
        ))}
      </group>
    </>
  )
}

export function Hero3D() {
  return (
    <Canvas
      camera={{ position: [0, 2.5, 7], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  )
}
