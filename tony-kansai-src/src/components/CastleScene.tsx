import { useRef, useMemo, Component } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

class WebGLErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}

function CastleModel() {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.18) * 0.12
    }
  })

  const stone = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1e1020', roughness: 0.85, metalness: 0.05,
  }), [])
  const wood = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0f0a14', roughness: 0.7, metalness: 0.0,
  }), [])
  const roof = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0a0813', roughness: 0.6, metalness: 0.1,
    emissive: '#120820', emissiveIntensity: 0.3,
  }), [])
  const gold = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#C49020', emissive: '#D4A847', emissiveIntensity: 0.8,
    roughness: 0.15, metalness: 0.9,
  }), [])
  const redAccent = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8B0000', emissive: '#E53030', emissiveIntensity: 0.5,
    roughness: 0.3, metalness: 0.2,
  }), [])

  // Eave helper: wide thin box with slight rotation for curved look
  const Eave = ({ y, width, depth }: { y: number; width: number; depth: number }) => (
    <group position={[0, y, 0]}>
      <mesh material={roof}>
        <boxGeometry args={[width, 0.14, depth]} />
      </mesh>
      {/* Corner upswept wings */}
      {([[-1, -1], [1, -1], [-1, 1], [1, 1]] as const).map(([sx, sz]) => (
        <mesh key={`${sx}${sz}`} material={roof}
          position={[sx * (width / 2 - 0.15), 0.1, sz * (depth / 2 - 0.15)]}
          rotation={[sz * -0.22, 0, sx * -0.22]}>
          <boxGeometry args={[0.6, 0.1, 0.6]} />
        </mesh>
      ))}
    </group>
  )

  const FinialPulse = () => {
    const meshRef = useRef<THREE.Mesh>(null)
    useFrame(({ clock }) => {
      if (meshRef.current) {
        const mat = meshRef.current.material as THREE.MeshStandardMaterial
        mat.emissiveIntensity = 0.7 + Math.sin(clock.elapsedTime * 2.4) * 0.4
      }
    })
    return (
      <mesh ref={meshRef} material={gold} position={[0, 0, 0]}>
        <sphereGeometry args={[0.14, 20, 20]} />
      </mesh>
    )
  }

  return (
    <Float speed={0.6} floatIntensity={0.2} rotationIntensity={0.0}>
      <group ref={ref} position={[0, -1.2, 0]}>

        {/* Ishigaki — stone base */}
        <mesh material={stone} position={[0, 0, 0]}>
          <boxGeometry args={[4.8, 0.7, 3.4]} />
        </mesh>
        <mesh material={stone} position={[0, 0.6, 0]}>
          <boxGeometry args={[4.2, 0.5, 3.0]} />
        </mesh>

        {/* Floor 1 */}
        <mesh material={wood} position={[0, 1.5, 0]}>
          <boxGeometry args={[3.6, 1.8, 2.6]} />
        </mesh>
        {/* Floor 1 red horizontal stripe */}
        <mesh material={redAccent} position={[0, 1.5, 0]}>
          <boxGeometry args={[3.62, 0.1, 2.62]} />
        </mesh>
        <Eave y={2.46} width={4.4} depth={3.3} />

        {/* Floor 2 */}
        <mesh material={wood} position={[0, 3.1, 0]}>
          <boxGeometry args={[2.7, 1.4, 2.0]} />
        </mesh>
        <mesh material={redAccent} position={[0, 3.1, 0]}>
          <boxGeometry args={[2.72, 0.08, 2.02]} />
        </mesh>
        <Eave y={3.85} width={3.4} depth={2.65} />

        {/* Floor 3 */}
        <mesh material={wood} position={[0, 4.55, 0]}>
          <boxGeometry args={[1.9, 1.2, 1.4]} />
        </mesh>
        <mesh material={redAccent} position={[0, 4.55, 0]}>
          <boxGeometry args={[1.92, 0.08, 1.42]} />
        </mesh>
        <Eave y={5.17} width={2.5} depth={2.0} />

        {/* Roof pyramid */}
        <mesh material={roof} position={[0, 6.0, 0]}>
          <coneGeometry args={[1.4, 1.5, 4]} />
        </mesh>

        {/* Gold decorative band under finial */}
        <mesh material={gold} position={[0, 6.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.035, 10, 30]} />
        </mesh>

        {/* Finial sphere with pulsing glow */}
        <group position={[0, 7.1, 0]}>
          <FinialPulse />
          <pointLight color="#D4A847" intensity={5} distance={4} />
        </group>

        {/* Corner guard towers (隅楼) */}
        {([-2.1, 2.1] as const).flatMap(x =>
          ([-1.3, 1.3] as const).map(z => (
            <group key={`t${x}${z}`} position={[x, 1.0, z]}>
              <mesh material={stone}>
                <cylinderGeometry args={[0.22, 0.26, 1.2, 12]} />
              </mesh>
              <mesh material={roof} position={[0, 0.75, 0]}>
                <coneGeometry args={[0.3, 0.5, 12]} />
              </mesh>
            </group>
          ))
        )}

        {/* Foundation glow */}
        <pointLight position={[0, -0.3, 0]} color="#E53030" intensity={2} distance={5} />
      </group>
    </Float>
  )
}

function GroundFog() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.18 + Math.sin(clock.elapsedTime * 0.6) * 0.05
    }
  })
  return (
    <mesh ref={ref} position={[0, -2.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[14, 10]} />
      <meshStandardMaterial
        color="#E53030"
        emissive="#E53030"
        emissiveIntensity={0.15}
        transparent
        opacity={0.18}
        depthWrite={false}
      />
    </mesh>
  )
}

export function CastleScene() {
  return (
    <WebGLErrorBoundary>
      <div style={{ width: '100%', height: 480 }}>
        <Canvas
          camera={{ position: [4, 2.5, 7], fov: 52 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.08} />
          <directionalLight position={[5, 8, 4]} color="#FFE4B0" intensity={0.7} />
          <pointLight position={[-4, 6, 2]} color="#E53030" intensity={5} distance={16} />
          <pointLight position={[ 3, 2, 5]} color="#D4A847" intensity={3} distance={12} />

          <Sparkles count={60} scale={[10, 8, 4]} position={[0, 2, 0]}
            size={1.0} speed={0.18} opacity={0.6}
            color="#D4A847" />

          <CastleModel />
          <GroundFog />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  )
}
