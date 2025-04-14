
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BrainStem: React.FC = () => {
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
    <mesh
      ref={meshRef}
      position={[0, -0.8, -0.3]}
      rotation={[Math.PI / 3, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <cylinderGeometry args={[0.17, 0.3, 0.7, 16]} />
      <meshStandardMaterial
        color="#c4a492"
        roughness={0.7}
        metalness={0.2}
      />
    </mesh>
  );
};

export default BrainStem;
