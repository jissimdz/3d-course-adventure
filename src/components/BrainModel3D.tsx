
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

function BrainModelMesh() {
  const group = useRef<THREE.Group>(null);
  
  // Animation for gentle rotation
  useFrame((state) => {
    if (group.current) {
      // Apply a subtle rotation for an "alive" feeling
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        state.clock.getElapsedTime() * 0.05,
        0.01
      );
    }
  });

  // Create a simple stylized brain using primitive shapes
  return (
    <group ref={group}>
      {/* Brain hemispheres */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[1.2, 32, 32, 0, Math.PI]} />
        <meshStandardMaterial 
          color="#e8a19c" 
          roughness={0.6} 
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Apply a mirror effect for the second hemisphere */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI]} castShadow>
        <sphereGeometry args={[1.2, 32, 32, 0, Math.PI]} />
        <meshStandardMaterial 
          color="#e8a19c" 
          roughness={0.6} 
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Brain folds texture using noise displacement */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[1.22, 32, 32]} />
        <meshStandardMaterial 
          color="#ce796e"
          roughness={0.8}
          metalness={0.2}
          wireframe={true}
          transparent={true}
          opacity={0.3}
        />
      </mesh>
      
      {/* Cerebellum */}
      <mesh position={[0, -0.7, -0.4]} castShadow>
        <sphereGeometry args={[0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#b86b62" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Brain stem */}
      <mesh position={[0, -1, -0.4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 0.7, 16]} />
        <meshStandardMaterial 
          color="#a45b54" 
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}

const BrainModel3D: React.FC<{ height?: string, autoRotate?: boolean }> = ({ 
  height = '400px',
  autoRotate = true 
}) => {
  return (
    <div style={{ height, width: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 2]}
        shadows
      >
        <color attach="background" args={['#ffffff']} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          config={{ mass: 1, tension: 170, friction: 26 }}
          snap={{ mass: 2, tension: 170, friction: 26 }}
        >
          <BrainModelMesh />
        </PresentationControls>
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 6}
        />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
};

export default BrainModel3D;
