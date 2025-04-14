
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PresentationControls } from '@react-three/drei';
import BrainModelMesh from './BrainModelMesh';

interface BrainModel3DProps {
  height?: string;
  autoRotate?: boolean;
  highlightPart?: string;
}

const BrainModel3D: React.FC<BrainModel3DProps> = ({ 
  height = '400px',
  autoRotate = true,
  highlightPart
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
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 3, Math.PI / 3]}
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
