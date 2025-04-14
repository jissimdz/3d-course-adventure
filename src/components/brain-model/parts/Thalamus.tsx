
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Thalamus: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current && hovered) {
      meshRef.current.scale.setScalar(1.1);
    } else if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });
  
  return (
    <group>
      {/* Left thalamus */}
      <mesh
        ref={meshRef}
        position={[-0.2, -0.1, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#d8b894"
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
      
      {/* Right thalamus */}
      <mesh
        position={[0.2, -0.1, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#d8b894"
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
};

export default Thalamus;
