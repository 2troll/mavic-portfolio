import { useRef, useMemo, Component } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

class WebGLErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}

function RotatingTorus() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.x = clock.elapsedTime * 0.18
    ref.current.rotation.y = clock.elapsedTime * 0.28
  })
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={ref} position={[2.2, 0.3, -1]}>
        <torusGeometry args={[1.6, 0.12, 16, 120]} />
        <meshStandardMaterial color="#E53030" emissive="#E53030" emissiveIntensity={0.6} wireframe />
      </mesh>
    </Float>
  )
}

function GlowSphere() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.1
    ref.current.rotation.z = clock.elapsedTime * 0.05
  })
  return (
    <Float speed={0.8} floatIntensity={0.8}>
      <mesh ref={ref} position={[-2.5, -0.5, -2]}>
        <sphereGeometry args={[0.9, 64, 64]} />
        <MeshDistortMaterial
          color="#FF6B35"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          emissive="#FF3300"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  )
}

function TorusKnot() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.12
    ref.current.rotation.x = clock.elapsedTime * 0.08
  })
  return (
    <Float speed={1.2} floatIntensity={0.5} rotationIntensity={0.2}>
      <mesh ref={ref} position={[0, -2.5, -3]}>
        <torusKnotGeometry args={[0.7, 0.22, 128, 32, 2, 3]} />
        <meshStandardMaterial color="#D4A847" metalness={0.9} roughness={0.1} emissive="#A07820" emissiveIntensity={0.3} />
      </mesh>
    </Float>
  )
}

function Particles() {
  const count = 120
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2
    }
    return arr
  }, [])
  const ref = useRef<THREE.Points>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.02
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#E53030" size={0.04} sizeAttenuation transparent opacity={0.6} />
    </points>
  )
}

export function Scene3D() {
  return (
    <WebGLErrorBoundary>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 65 }}
        style={{ background: 'transparent' }}
        className="absolute inset-0 pointer-events-none"
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} color="#E53030" intensity={3} />
        <pointLight position={[-5, -5, -5]} color="#FF6B35" intensity={2} />
        <pointLight position={[0, 5, 0]} color="#D4A847" intensity={1} />
        <Stars radius={80} depth={40} count={2000} factor={3} fade speed={0.5} />
        <RotatingTorus />
        <GlowSphere />
        <TorusKnot />
        <Particles />
      </Canvas>
    </WebGLErrorBoundary>
  )
}
