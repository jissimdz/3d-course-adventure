
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PresentationControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Composant pour le modèle du cerveau
function BrainModelMesh() {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  
  // Animation pour une rotation douce
  useFrame((state) => {
    if (group.current) {
      // Appliquer une rotation subtile pour un effet "vivant"
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        hovered ? group.current.rotation.y : state.clock.getElapsedTime() * 0.05,
        0.01
      );
    }
  });

  return (
    <group ref={group}>
      {/* Cortex cérébral - Partie principale du cerveau */}
      <CerebralCortex />
      
      {/* Corps calleux */}
      <CorpusCallosum />
      
      {/* Thalamus */}
      <Thalamus />
      
      {/* Hypothalamus */}
      <Hypothalamus />
      
      {/* Cervelet */}
      <Cerebellum />
      
      {/* Tronc cérébral */}
      <BrainStem />
    </group>
  );
}

// Composant pour le cortex cérébral (partie principale du cerveau)
function CerebralCortex() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Texture pour les sillons et circonvolutions
  const displacementMap = useTexture("/lovable-uploads/1af0b071-3712-4c1b-a58f-030388c0260e.png", (texture) => {
    // Utiliser l'image comme carte d'intensité pour la texture
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
      {/* Hémisphère droit - Using sphereGeometry with phiStart/phiLength to create hemisphere */}
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
      
      {/* Hémisphère gauche - Using sphereGeometry with phiStart/phiLength to create hemisphere */}
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
      
      {/* Fissure interhémisphérique */}
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
}

// Composant pour le corps calleux
function CorpusCallosum() {
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
}

// Composant pour le thalamus
function Thalamus() {
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
      {/* Thalamus gauche */}
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
      
      {/* Thalamus droit */}
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
}

// Composant pour l'hypothalamus
function Hypothalamus() {
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
      position={[0, -0.3, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color="#d8a784"
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}

// Composant pour le cervelet
function Cerebellum() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Texture pour les plis du cervelet
  const displacementMap = useTexture("/lovable-uploads/1af0b071-3712-4c1b-a58f-030388c0260e.png", (texture) => {
    // Utiliser l'image comme carte d'intensité pour la texture
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
}

// Composant pour le tronc cérébral
function BrainStem() {
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
}

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
