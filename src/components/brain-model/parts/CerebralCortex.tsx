
import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const CerebralCortex: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Texture for the sulci and gyri
  const displacementMap = useTexture("/lovable-uploads/1af0b071-3712-4c1b-a58f-030388c0260e.png", (texture) => {
    // Use the image as an intensity map for the texture
    const t = texture as THREE.Texture;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 2);
    return t;
  });
  
  useFrame(() => {
    if (meshRef.current) {
      if (hovered) {
        meshRef.current.scale.setScalar(1.03);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group>
      {/* Right hemisphere - Using sphereGeometry with phiStart/phiLength to create hemisphere */}
      <mesh
        ref={meshRef}
        position={[0.2, 0.3, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#e8a19c"
          roughness={0.7}
          metalness={0.1}
          displacementMap={displacementMap}
          displacementScale={0.1}
          bumpMap={displacementMap}
          bumpScale={0.05}
        />
      </mesh>
      
      {/* Left hemisphere - Using sphereGeometry with phiStart/phiLength to create hemisphere */}
      <mesh
        position={[-0.2, 0.3, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#e8a19c"
          roughness={0.7}
          metalness={0.1}
          displacementMap={displacementMap}
          displacementScale={0.1}
          bumpMap={displacementMap}
          bumpScale={0.05}
        />
      </mesh>
      
      {/* Interhemispheric fissure */}
      <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[1.2, 0.7]} />
        <meshStandardMaterial
          color="#c97a72"
          roughness={0.8}
          metalness={0.2}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};

export default CerebralCortex;
