'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Sphere, Html, useTexture } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import { Group, Vector3, RepeatWrapping } from 'three'
import { Heart, Users, MapPin } from 'lucide-react'

interface MemoryMarker {
  id: string
  position: [number, number, number]
  icon: 'heart' | 'users' | 'mappin'
  color: string
  location: string
  description: string
  animationDelay: number
}

const markers: MemoryMarker[] = [
  {
    id: 'paris',
    position: [2.5, 1.2, 1.5],
    icon: 'heart',
    color: '#ef4444',
    location: 'Paris, France',
    description: 'Our first trip together',
    animationDelay: 0
  },
  {
    id: 'tokyo',
    position: [2.8, 0.8, -1.2],
    icon: 'users',
    color: '#3b82f6',
    location: 'Tokyo, Japan',
    description: 'Friends adventure',
    animationDelay: 1
  },
  {
    id: 'newyork',
    position: [-2.2, 1.5, -1.8],
    icon: 'mappin',
    color: '#8b5cf6',
    location: 'New York, USA',
    description: 'Business trip memories',
    animationDelay: 2
  }
]

function FloatingMarker({ marker }: { marker: MemoryMarker }) {
  const meshRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() + marker.animationDelay
      // More bouncy and playful animation
      meshRef.current.position.y = marker.position[1] + Math.sin(time * 3) * 0.2
      meshRef.current.rotation.y = time * 0.8
      meshRef.current.rotation.z = Math.sin(time * 2) * 0.1
      // Add a gentle scale animation
      const scale = 1 + Math.sin(time * 4) * 0.1
      meshRef.current.scale.set(scale, scale, scale)
    }
  })

  const getIcon = () => {
    switch (marker.icon) {
      case 'heart':
        return <Heart className="h-4 w-4 text-white" />
      case 'users':
        return <Users className="h-4 w-4 text-white" />
      case 'mappin':
        return <MapPin className="h-4 w-4 text-white" />
      default:
        return <MapPin className="h-4 w-4 text-white" />
    }
  }

  return (
    <group
      ref={meshRef}
      position={marker.position}
      onPointerOver={() => {
        setHovered(true)
        setShowTooltip(true)
      }}
      onPointerOut={() => {
        setHovered(false)
        setShowTooltip(false)
      }}
    >
      <Sphere args={[0.15, 16, 16]}>
        <meshStandardMaterial 
          color={marker.color} 
          emissive={marker.color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>
      
      {/* Add a glowing ring around the marker */}
      <Sphere args={[0.2, 16, 16]}>
        <meshStandardMaterial 
          color={marker.color}
          transparent
          opacity={hovered ? 0.3 : 0.1}
          emissive={marker.color}
          emissiveIntensity={0.2}
        />
      </Sphere>
      
      <Html
        position={[0, 0.4, 0]}
        center
        distanceFactor={8}
        style={{
          pointerEvents: 'none',
          opacity: showTooltip ? 1 : 0,
          transition: 'opacity 0.3s ease',
          transform: showTooltip ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        <div className="bg-white px-3 py-2 rounded-xl shadow-xl text-sm whitespace-nowrap border-2 border-gray-200 bg-gradient-to-r from-white to-gray-50">
          <div className="font-bold text-gray-900">{marker.location}</div>
          <div className="text-gray-600">{marker.description}</div>
        </div>
      </Html>

      <Html
        position={[0, 0, 0]}
        center
        distanceFactor={8}
        style={{
          pointerEvents: 'none',
        }}
      >
        <div className="flex items-center justify-center w-6 h-6">
          {getIcon()}
        </div>
      </Html>
    </group>
  )
}

function CartoonEarth() {
  const groupRef = useRef<Group>(null)
  const cloudsRef = useRef<Group>(null)
  
  // Cartoon-style Earth textures with vibrant colors
  const earthTexture = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg')
  const cloudsTexture = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png')

  useFrame((state) => {
    if (groupRef.current) {
      // Slower, more gentle rotation
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
      // Add a gentle wobble
      groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.02
    }
    
    if (cloudsRef.current) {
      // Clouds rotate slightly faster than the Earth
      cloudsRef.current.rotation.y = state.clock.getElapsedTime() * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main Earth sphere with natural NASA colors */}
      <Sphere args={[3, 64, 64]}>
        <meshStandardMaterial 
          map={earthTexture}
          roughness={0.2}
          metalness={0.05}
        />
      </Sphere>

      {/* Very subtle clouds layer - almost invisible */}
      <group ref={cloudsRef}>
        <Sphere args={[3.02, 64, 64]}>
          <meshStandardMaterial 
            map={cloudsTexture}
            color="#FFFFFF"
            transparent
            opacity={0.15} // Much more subtle clouds
            emissive="#FFFFFF"
            emissiveIntensity={0.05}
          />
        </Sphere>
      </group>

      {/* Add a subtle glow around the Earth */}
      <Sphere args={[3.1, 32, 32]}>
        <meshStandardMaterial 
          color="#4A90E2"
          transparent
          opacity={0.05}
          emissive="#4A90E2"
          emissiveIntensity={0.05}
        />
      </Sphere>

      {/* Memory markers */}
      {markers.map((marker) => (
        <FloatingMarker key={marker.id} marker={marker} />
      ))}
    </group>
  )
}

function Scene() {
  const { camera } = useThree()

  // Set up camera position
  camera.position.set(0, 0, 8)

  return (
    <>
      {/* Natural lighting for Earth */}
      <ambientLight intensity={0.8} color="#FFFFFF" />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#FFFFFF" />
      <pointLight position={[-10, -10, -5]} intensity={0.4} color="#4A90E2" />
      
      <CartoonEarth />
      
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
        dampingFactor={0.1}
        enableDamping
      />
    </>
  )
}

export default function InteractiveMap() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
