'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Sphere, Html } from '@react-three/drei'
import { useRef, useState } from 'react'
import { Group, Vector3 } from 'three'
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
    position: [-2, 1, 0],
    icon: 'heart',
    color: '#ef4444',
    location: 'Paris, France',
    description: 'Our first trip together',
    animationDelay: 0
  },
  {
    id: 'tokyo',
    position: [3, 0.5, 1],
    icon: 'users',
    color: '#3b82f6',
    location: 'Tokyo, Japan',
    description: 'Friends adventure',
    animationDelay: 1
  },
  {
    id: 'newyork',
    position: [-1, -1, 2],
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
      meshRef.current.position.y = marker.position[1] + Math.sin(time * 2) * 0.1
      meshRef.current.rotation.y = time * 0.5
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
          emissiveIntensity={hovered ? 0.3 : 0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      
      <Html
        position={[0, 0.3, 0]}
        center
        distanceFactor={8}
        style={{
          pointerEvents: 'none',
          opacity: showTooltip ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap border border-gray-200">
          <div className="font-semibold text-gray-900">{marker.location}</div>
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

function WorldMap() {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Base world sphere */}
      <Sphere args={[3, 32, 32]}>
        <meshStandardMaterial 
          color="#e0f2fe"
          transparent
          opacity={0.3}
          wireframe
        />
      </Sphere>

      {/* Grid lines */}
      <group>
        {Array.from({ length: 10 }, (_, i) => (
          <group key={i}>
            <mesh position={[0, (i - 5) * 0.6, 0]}>
              <ringGeometry args={[2.5, 3, 32]} />
              <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} />
            </mesh>
          </group>
        ))}
      </group>

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
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
      
      <WorldMap />
      
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
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
      
      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-12 pointer-events-none">
        <div className="max-w-md">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6 shadow-2xl">
              <MapPin className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">
            Your Memories, <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Everywhere
            </span>
          </h2>
          
          <p className="text-lg text-white/90 mb-8 leading-relaxed drop-shadow-md">
            Join thousands of people who are already creating, sharing, and preserving 
            their most precious memories with Memora.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white/90 drop-shadow-sm">Interactive world maps</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-white/90 drop-shadow-sm">Share with loved ones</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-white/90 drop-shadow-sm">Beautiful memory galleries</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
