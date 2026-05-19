import { useRef, useMemo, Component, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

class WebGLErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(err: Error) { console.warn('[Scene3D] WebGL error:', err.message) }
  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}

function CameraRig() {
  const { camera } = useThree()
  const target = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 1.2
      target.current.y = -(e.clientY / window.innerHeight - 0.5) * 0.7
    }
    const onTouch = (e: TouchEvent) => {
      if (!e.touches[0]) return
      target.current.x = (e.touches[0].clientX / window.innerWidth - 0.5) * 1.2
      target.current.y = -(e.touches[0].clientY / window.innerHeight - 0.5) * 0.7
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])
  useFrame(() => {
    camera.position.x += (target.current.x - camera.position.x) * 0.035
    camera.position.y += (target.current.y - camera.position.y) * 0.035
    camera.lookAt(0, 0, 0)
  })
  return null
}

function ToriiGate() {
  const red = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#B01818', emissive: '#E53030', emissiveIntensity: 0.55,
    roughness: 0.3, metalness: 0.15,
  }), [])
  const gold = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#C49020', emissive: '#D4A847', emissiveIntensity: 0.4,
    roughness: 0.15, metalness: 0.9,
  }), [])
  const stone = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a0808', roughness: 0.9, metalness: 0.0,
  }), [])

  const ringGeo = useMemo(() => new THREE.TorusGeometry(0.17, 0.022, 12, 40), [])
  const pillarGeo = useMemo(() => new THREE.CylinderGeometry(0.11, 0.14, 4.6, 24), [])
  const baseGeo = useMemo(() => new THREE.BoxGeometry(0.46, 0.28, 0.46), [])

  return (
    <Float speed={0.5} floatIntensity={0.18} rotationIntensity={0.04}>
      <group scale={0.74}>
        {/* Pillars */}
        <mesh geometry={pillarGeo} material={red} position={[-1.2, 0, 0]} />
        <mesh geometry={pillarGeo} material={red} position={[ 1.2, 0, 0]} />

        {/* Gold rings on pillars */}
        {([-0.9, 0.6] as const).flatMap(y =>
          ([-1.2, 1.2] as const).map(x => (
            <mesh key={`r${x}${y}`} geometry={ringGeo} material={gold}
              position={[x, y, 0]} rotation={[Math.PI / 2, 0, 0]} />
          ))
        )}

        {/* Shimagi (sub-cap) */}
        <mesh material={red} position={[0, 2.15, 0]}>
          <boxGeometry args={[2.86, 0.16, 0.36]} />
        </mesh>

        {/* Kasagi (top curved beam body) */}
        <mesh material={red} position={[0, 2.38, 0]}>
          <boxGeometry args={[3.1, 0.22, 0.32]} />
        </mesh>
        {/* Kasagi upswept wings */}
        <mesh material={red} position={[-1.52, 2.48, 0]} rotation={[0, 0,  0.18]}>
          <boxGeometry args={[0.48, 0.16, 0.32]} />
        </mesh>
        <mesh material={red} position={[ 1.52, 2.48, 0]} rotation={[0, 0, -0.18]}>
          <boxGeometry args={[0.48, 0.16, 0.32]} />
        </mesh>

        {/* Nuki (lower crossbeam) */}
        <mesh material={red} position={[0, 1.12, 0]}>
          <boxGeometry args={[2.54, 0.17, 0.28]} />
        </mesh>

        {/* Base stones */}
        <mesh geometry={baseGeo} material={stone} position={[-1.2, -2.44, 0]} />
        <mesh geometry={baseGeo} material={stone} position={[ 1.2, -2.44, 0]} />

        {/* Internal glow */}
        <pointLight position={[0, 1.2, 0.4]} color="#E53030" intensity={6} distance={5} />
        <pointLight position={[0, 2.4, 0.3]} color="#D4A847" intensity={3} distance={4} />
      </group>
    </Float>
  )
}

function SakuraSparkles() {
  return (
    <Sparkles
      count={160}
      scale={[16, 12, 5]}
      position={[0, 0.5, -1.5]}
      size={1.2}
      speed={0.22}
      opacity={0.75}
      color="#FFB7C5"
    />
  )
}

function GoldDust() {
  const count = 220
  const pos = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      a[i * 3]     = (Math.random() - 0.5) * 18
      a[i * 3 + 1] = (Math.random() - 0.5) * 14
      a[i * 3 + 2] = (Math.random() - 0.5) * 7 - 3
    }
    return a
  }, [])
  const ref = useRef<THREE.Points>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.012
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#D4A847" size={0.022} sizeAttenuation transparent opacity={0.45} />
    </points>
  )
}

export function Scene3D() {
  return (
    <WebGLErrorBoundary>
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 58 }}
        style={{ background: 'transparent' }}
        className="absolute inset-0 pointer-events-none"
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={0.12} />
        <directionalLight position={[4, 6, 4]} color="#FFE4B0" intensity={0.9} />
        <pointLight position={[-5, 3, 2]} color="#E53030" intensity={4} distance={14} />
        <pointLight position={[ 5, -2, 3]} color="#D4A847" intensity={2.5} distance={12} />

        <Stars radius={110} depth={55} count={2800} factor={3.8} fade speed={0.35} saturation={0.1} />
        <SakuraSparkles />
        <GoldDust />
        <ToriiGate />
        <CameraRig />
      </Canvas>
    </WebGLErrorBoundary>
  )
}
