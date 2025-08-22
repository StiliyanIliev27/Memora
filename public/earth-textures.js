// Earth texture URLs from NASA and other sources
export const earthTextures = {
  // Primary NASA Blue Marble textures
  earth: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
  bump: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
  clouds: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png',
  
  // Alternative high-quality Earth textures
  earthAlt: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg',
  
  // Fallback textures (simpler but still realistic)
  earthFallback: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_1024.jpg',
  bumpFallback: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_1024.jpg',
  cloudsFallback: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_512.png'
}

// Function to get texture with fallback
export function getTextureWithFallback(primary, fallback) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(primary)
    img.onerror = () => resolve(fallback)
    img.src = primary
  })
}
