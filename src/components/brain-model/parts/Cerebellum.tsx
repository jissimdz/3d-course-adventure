
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Cerebellum: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Texture for the cerebellar folds
  const displacementMap = useTexture("/lovable-uploads/1af0b071-3712-4c1b-a58f-030388c0260e.png", (texture) => {
    // Use the image as an intensity map for the texture
    const t = texture as THREE.Texture;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 3);
    return t;
  });
  
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
      position={[0, -0.5, -0.5]}
      rotation={[Math.PI / 6, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <sphereGeometry args={[0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial
        color="#d0a890"
        roughness={0.8}
        metalness={0.1}
        displacementMap={displacementMap}
        displacementScale={0.05}
        bumpMap={displacementMap}
        bumpScale={0.02}
      />
    </mesh>
  );
};

export default Cerebellum;
