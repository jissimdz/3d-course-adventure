
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { 
  CerebralCortex, 
  CorpusCallosum, 
  Thalamus, 
  Hypothalamus, 
  Cerebellum, 
  BrainStem 
} from './parts';

const BrainModelMesh: React.FC = () => {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  
  // Animation for smooth rotation
  useFrame((state) => {
    if (group.current) {
      // Apply subtle rotation for a "living" effect
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        hovered ? group.current.rotation.y : state.clock.getElapsedTime() * 0.05,
        0.01
      );
    }
  });

  return (
    <group ref={group}>
      {/* Cerebral cortex - Main part of the brain */}
      <CerebralCortex />
      
      {/* Corpus callosum */}
      <CorpusCallosum />
      
      {/* Thalamus */}
      <Thalamus />
      
      {/* Hypothalamus */}
      <Hypothalamus />
      
      {/* Cerebellum */}
      <Cerebellum />
      
      {/* Brain stem */}
      <BrainStem />
    </group>
  );
};

export default BrainModelMesh;
