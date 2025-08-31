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

// Convert lat/lng to 3D coordinates on a sphere and offset above surface
function latLngToPosition(lat: number, lng: number, radius: number = 3): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = (radius * Math.sin(phi) * Math.sin(theta))
  const y = (radius * Math.cos(phi))
  
  // Calculate the normalized direction vector from center to surface
  const length = Math.sqrt(x * x + y * y + z * z)
  const dirX = x / length
  const dirY = y / length
  const dirZ = z / length
  
  // Offset the position above the surface by 0.3 units
  const offset = 0.3
  return [x + dirX * offset, y + dirY * offset, z + dirZ * offset]
}

const markers: MemoryMarker[] = [
  {
    id: 'paris',
    position: latLngToPosition(48.8566, 2.3522), // Paris, France
    icon: 'heart',
    color: '#ef4444',
    location: 'Paris, France',
    description: 'Our first trip together',
    animationDelay: 0
  },
  {
    id: 'tokyo',
    position: latLngToPosition(35.6762, 139.6503), // Tokyo, Japan
    icon: 'users',
    color: '#3b82f6',
    location: 'Tokyo, Japan',
    description: 'Friends adventure',
    animationDelay: 1
  },
  {
    id: 'newyork',
    position: latLngToPosition(40.7128, -74.0060), // New York, USA
    icon: 'mappin',
    color: '#8b5cf6',
    location: 'New York, USA',
    description: 'Business trip memories',
    animationDelay: 2
  },
  {
    id: 'sydney',
    position: latLngToPosition(-33.8688, 151.2093), // Sydney, Australia
    icon: 'heart',
    color: '#10b981',
    location: 'Sydney, Australia',
    description: 'Beach vacation',
    animationDelay: 3
  },
  {
    id: 'rio',
    position: latLngToPosition(-22.9068, -43.1729), // Rio de Janeiro, Brazil
    icon: 'users',
    color: '#f59e0b',
    location: 'Rio de Janeiro, Brazil',
    description: 'Carnival memories',
    animationDelay: 4
  }
]

function FloatingMarker({ marker }: { marker: MemoryMarker }) {
  const meshRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() + marker.animationDelay
      // Much more subtle and static animation
      meshRef.current.position.y = marker.position[1] + Math.sin(time * 1) * 0.05
      meshRef.current.rotation.y = time * 0.2
      // Remove the bouncy scale animation
      meshRef.current.scale.set(1, 1, 1)
    }
  })

  const getIcon = () => {
    switch (marker.icon) {
      case 'heart':
        return <Heart className="h-3 w-3 text-white" />
      case 'users':
        return <Users className="h-3 w-3 text-white" />
      case 'mappin':
        return <MapPin className="h-3 w-3 text-white" />
      default:
        return <MapPin className="h-3 w-3 text-white" />
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
      <Sphere args={[0.12, 16, 16]}>
        <meshStandardMaterial 
          color={marker.color} 
          emissive={marker.color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>
      
      {/* Smaller glowing ring around the marker */}
      <Sphere args={[0.16, 16, 16]}>
        <meshStandardMaterial 
          color={marker.color}
          transparent
          opacity={hovered ? 0.2 : 0.05}
          emissive={marker.color}
          emissiveIntensity={0.1}
        />
      </Sphere>
      
      <Html
        position={[0, 0.3, 0]}
        center
        distanceFactor={12}
        style={{
          pointerEvents: 'none',
          opacity: showTooltip ? 1 : 0,
          transition: 'opacity 0.3s ease',
          transform: showTooltip ? 'scale(1)' : 'scale(0.9)',
        }}
      >
        <div className="bg-white px-2 py-1 rounded-lg shadow-lg text-xs whitespace-nowrap border border-gray-200 bg-gradient-to-r from-white to-gray-50">
          <div className="font-semibold text-gray-900 text-xs">{marker.location}</div>
          <div className="text-gray-600 text-xs">{marker.description}</div>
        </div>
      </Html>

      <Html
        position={[0, 0, 0]}
        center
        distanceFactor={12}
        style={{
          pointerEvents: 'none',
        }}
      >
        <div className="flex items-center justify-center w-5 h-5">
          {getIcon()}
        </div>
      </Html>
    </group>
  )
}

function CartoonEarth() {
  const groupRef = useRef<Group>(null)
  const cloudsRef = useRef<Group>(null)
  
  // High-resolution Earth textures for better quality
  const earthTexture = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg')
  const bumpMap = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg')
  const cloudsTexture = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png')

  useFrame((state) => {
    if (groupRef.current) {
      // Slower, more gentle rotation like earth3dmap.com
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.03
      // Add a gentle wobble
      groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.01
    }
    
    if (cloudsRef.current) {
      // Clouds rotate slightly faster than the Earth
      cloudsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main Earth sphere with high-resolution textures */}
      <Sphere args={[3, 128, 128]}>
        <meshStandardMaterial 
          map={earthTexture}
          bumpMap={bumpMap}
          bumpScale={0.02}
          roughness={0.15}
          metalness={0.01}
          color="#E6F3FF" // Light blue tint for lighter oceans
        />
      </Sphere>

      {/* Subtle clouds layer */}
      <group ref={cloudsRef}>
        <Sphere args={[3.02, 128, 128]}>
          <meshStandardMaterial 
            map={cloudsTexture}
            color="#FFFFFF"
            transparent
            opacity={0.2}
            emissive="#FFFFFF"
            emissiveIntensity={0.02}
          />
        </Sphere>
      </group>

      {/* Atmospheric glow like earth3dmap.com */}
      <Sphere args={[3.15, 64, 64]}>
        <meshStandardMaterial 
          color="#87CEEB"
          transparent
          opacity={0.08}
          emissive="#87CEEB"
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
      {/* Enhanced lighting for dark background */}
      <ambientLight intensity={3} color="#FFFFFF" />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#FFFFFF" />
      
      <CartoonEarth />
      
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.2}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
        dampingFactor={0.05}
        enableDamping
        rotateSpeed={0.5}
      />
    </>
  )
}

export default function InteractiveMap() {
  return (
    <div className="w-full h-full relative">
      {/* Enhanced background gradient matching auth page design */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.15)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1)_0%,transparent_50%)]"></div>
      
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
