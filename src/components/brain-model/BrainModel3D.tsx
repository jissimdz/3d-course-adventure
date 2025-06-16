import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import BrainModelMesh from './BrainModelMesh';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { Settings, ZoomIn, ZoomOut, RotateCcw, Info, PanelRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BrainModel3DProps {
  height?: string;
}

const BrainModel3D: React.FC<BrainModel3DProps> = ({ height = "500px" }) => {
  const [activeParts, setActiveParts] = useState<string[]>(['CerebralCortex', 'CorpusCallosum', 'Thalamus', 'Hypothalamus', 'Cerebellum', 'BrainStem']);
  const [backgroundColor, setBackgroundColor] = useState<string>("#f1f5f9");
  const [autoRotate, setAutoRotate] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const controlsRef = useRef(null);
  const { toast } = useToast();

  const togglePart = (partName: string) => {
    if (activeParts.includes(partName)) {
      setActiveParts(activeParts.filter(name => name !== partName));
    } else {
      setActiveParts([...activeParts, partName]);
    }
    
    toast({
      title: `Partie ${activeParts.includes(partName) ? "masquée" : "affichée"}`,
      description: `La partie "${partName}" a été ${activeParts.includes(partName) ? "masquée" : "affichée"}.`,
      duration: 2000,
    });
  };

  const resetView = () => {
    if (controlsRef.current) {
      (controlsRef.current as any).reset();
      toast({
        title: "Vue réinitialisée",
        description: "La vue du modèle a été réinitialisée.",
        duration: 2000,
      });
    }
  };

  const zoomIn = () => {
    if (controlsRef.current) {
      (controlsRef.current as any).dollyIn(1.2);
      (controlsRef.current as any).update();
    }
  };

  const zoomOut = () => {
    if (controlsRef.current) {
      (controlsRef.current as any).dollyOut(1.2);
      (controlsRef.current as any).update();
    }
  };

  const partLabels: Record<string, string> = {
    CerebralCortex: "Cortex Cérébral",
    CorpusCallosum: "Corps Calleux",
    Thalamus: "Thalamus",
    Hypothalamus: "Hypothalamus",
    Cerebellum: "Cervelet",
    BrainStem: "Tronc Cérébral",
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-gray-200" style={{ height }}>
      {/* Contrôles */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
        <Menubar className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm">
          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" />
              <span>Options</span>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => setAutoRotate(!autoRotate)}>
                {autoRotate ? "Désactiver" : "Activer"} la rotation automatique
              </MenubarItem>
              <MenubarItem onClick={() => setShowInfo(!showInfo)}>
                {showInfo ? "Masquer" : "Afficher"} les informations
              </MenubarItem>
              <MenubarItem>
                Couleur de fond:
                <div className="flex gap-2 mt-2">
                  {["#f1f5f9", "#ffffff", "#000000", "#1e293b"].map((color) => (
                    <div
                      key={color}
                      className="w-6 h-6 rounded-full cursor-pointer border border-gray-300"
                      style={{ backgroundColor: color }}
                      onClick={() => setBackgroundColor(color)}
                    />
                  ))}
                </div>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        <div className="flex flex-col gap-1">
          <Button variant="outline" size="icon" className="w-8 h-8 bg-white/80 backdrop-blur-sm" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="w-8 h-8 bg-white/80 backdrop-blur-sm" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="w-8 h-8 bg-white/80 backdrop-blur-sm" onClick={resetView}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Basculer les parties du cerveau */}
      <div className="absolute top-2 right-2 z-10">
        <Menubar className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm">
          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer">
              <PanelRight className="h-4 w-4 mr-2" />
              <span>Parties du cerveau</span>
            </MenubarTrigger>
            <MenubarContent>
              {Object.entries(partLabels).map(([part, label]) => (
                <MenubarItem 
                  key={part} 
                  onClick={() => togglePart(part)}
                  className={!activeParts.includes(part) ? "opacity-50" : ""}
                >
                  <input 
                    type="checkbox" 
                    checked={activeParts.includes(part)} 
                    onChange={() => {}} 
                    className="mr-2"
                  />
                  {label}
                </MenubarItem>
              ))}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      {/* Panneau d'informations */}
      {showInfo && (
        <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-200 max-h-40 overflow-y-auto">
          <div className="flex items-start">
            <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-brand-blue" />
            <div>
              <h3 className="font-medium text-brand-blue">À propos du modèle du cerveau</h3>
              <p className="text-sm text-gray-600">
                Ce modèle 3D interactif du cerveau humain vous permet d'explorer les principales structures anatomiques. 
                Utilisez les contrôles pour faire pivoter, zoomer et afficher ou masquer des parties spécifiques pour mieux 
                comprendre les relations spatiales entre les différentes régions du cerveau.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Canvas Three.js */}
      <Canvas style={{ background: backgroundColor }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.8} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          <BrainModelMesh activeParts={activeParts} />
          <OrbitControls 
            ref={controlsRef} 
            autoRotate={autoRotate} 
            autoRotateSpeed={1.5} 
            enableDamping={true}
            dampingFactor={0.1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default BrainModel3D;
