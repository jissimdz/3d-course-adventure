
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CorpusCallosum: React.FC = () => {
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
      position={[0, 0, 0]}
      rotation={[0.3, 0, Math.PI / 2]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <torusGeometry args={[0.5, 0.1, 16, 100, Math.PI]} />
      <meshStandardMaterial
        color="#e0c9a6"
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  );
};

export default CorpusCallosum;
