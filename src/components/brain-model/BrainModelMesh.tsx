
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

interface BrainModelMeshProps {
  activeParts?: string[];
}

const BrainModelMesh: React.FC<BrainModelMeshProps> = ({ activeParts = ['CerebralCortex', 'CorpusCallosum', 'Thalamus', 'Hypothalamus', 'Cerebellum', 'BrainStem'] }) => {
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
      {activeParts.includes('CerebralCortex') && <CerebralCortex />}
      
      {/* Corpus callosum */}
      {activeParts.includes('CorpusCallosum') && <CorpusCallosum />}
      
      {/* Thalamus */}
      {activeParts.includes('Thalamus') && <Thalamus />}
      
      {/* Hypothalamus */}
      {activeParts.includes('Hypothalamus') && <Hypothalamus />}
      
      {/* Cerebellum */}
      {activeParts.includes('Cerebellum') && <Cerebellum />}
      
      {/* Brain stem */}
      {activeParts.includes('BrainStem') && <BrainStem />}
    </group>
  );
};

export default BrainModelMesh;
