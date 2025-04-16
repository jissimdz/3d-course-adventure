
import React, { useEffect, useRef, useState } from "react";
import * as fabric from 'fabric';
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Download, Circle, Upload, Image, Bug } from "lucide-react";
import { toast } from "sonner";

// Tableau d'URLs d'icônes bioicons pour les exemples
const BIOICON_EXAMPLES = [
  "https://bioicons.com/icons/cell.svg",
  "https://bioicons.com/icons/virus.svg",
  "https://bioicons.com/icons/dna.svg",
  "https://bioicons.com/icons/bacteria.svg",
  "https://bioicons.com/icons/protein.svg",
  "/lovable-uploads/80207e3b-3c5f-4d89-bd3c-bc2a15a56e50.png" // Drosophila image
];

const EditorPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      // Initialiser le canvas Fabric.js
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff'
      });
      
      fabricCanvasRef.current = canvas;
    }

    return () => {
      // Nettoyer le canvas lors du démontage du composant
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, []);

  const handleAddCircle = () => {
    if (fabricCanvasRef.current) {
      const circle = new fabric.Circle({
        radius: 50,
        fill: 'blue',
        left: 100,
        top: 100
      });
      fabricCanvasRef.current.add(circle);
      fabricCanvasRef.current.renderAll();
    }
  };

  const handleAddBioicon = (iconUrl: string) => {
    if (!fabricCanvasRef.current) return;
    
    setIsLoading(true);
    
    // Charger l'icône SVG depuis l'URL
    if (iconUrl.endsWith('.png')) {
      // Pour les images PNG
      fabric.Image.fromURL(iconUrl, (img) => {
        if (fabricCanvasRef.current) {
          img.set({
            left: 150,
            top: 150,
            scaleX: 0.5,
            scaleY: 0.5,
            hasControls: true,
            borderColor: 'red',
            cornerColor: 'green',
            cornerSize: 12,
            transparentCorners: false,
          });
          
          // Ajouter des événements interactifs
          img.on('selected', function() {
            console.log("Image sélectionnée !");
            toast("Image sélectionnée");
          });
          
          fabricCanvasRef.current.add(img);
          fabricCanvasRef.current.renderAll();
          setIsLoading(false);
          toast("Image ajoutée avec succès");
        }
      }, { crossOrigin: 'anonymous' });
    } else {
      // Pour les fichiers SVG
      fabric.loadSVGFromURL(iconUrl, function(objects, options) {
        if (fabricCanvasRef.current) {
          const svgGroup = fabric.util.groupSVGElements(objects, options);
          
          // Personnalisation de l'icône et la rendre interactive
          svgGroup.set({
            left: 150,
            top: 150,
            scaleX: 0.5,
            scaleY: 0.5,
            hasControls: true,
            borderColor: 'red',
            cornerColor: 'green',
            cornerSize: 12,
            transparentCorners: false,
          });
          
          // Ajouter des événements interactifs
          svgGroup.on('selected', function() {
            console.log("Icône SVG sélectionnée !");
            toast("Icône sélectionnée");
          });

          fabricCanvasRef.current.add(svgGroup);
          fabricCanvasRef.current.renderAll();
          toast("Icône SVG ajoutée avec succès");
        }
        setIsLoading(false);
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvasRef.current) return;

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = function(event) {
      if (event.target?.result && fabricCanvasRef.current) {
        const dataUrl = event.target.result.toString();
        
        if (file.type === 'image/svg+xml') {
          // Pour les fichiers SVG
          fabric.loadSVGFromURL(dataUrl, function(objects, options) {
            if (fabricCanvasRef.current) {
              const svgObject = fabric.util.groupSVGElements(objects, options);
              
              // Rendre le SVG importé interactif
              svgObject.set({
                left: 150,
                top: 150,
                borderColor: 'red',
                cornerColor: 'green',
                cornerSize: 12,
                transparentCorners: false,
              });
              
              // Ajouter des événements
              svgObject.on('selected', function() {
                console.log("SVG importé sélectionné !");
                toast("SVG sélectionné");
              });
              
              fabricCanvasRef.current.add(svgObject);
              fabricCanvasRef.current.renderAll();
              toast("SVG importé avec succès");
              setIsLoading(false);
            }
          });
        } else {
          // Pour les autres types d'images
          fabric.Image.fromURL(dataUrl, function(img) {
            if (fabricCanvasRef.current) {
              // Rendre l'image interactive
              img.set({
                left: 150,
                top: 150,
                borderColor: 'red',
                cornerColor: 'green',
                cornerSize: 12,
                transparentCorners: false,
              });
              
              img.on('selected', function() {
                console.log("Image importée sélectionnée !");
                toast("Image sélectionnée");
              });
              
              fabricCanvasRef.current.add(img);
              fabricCanvasRef.current.renderAll();
              toast("Image importée avec succès");
              setIsLoading(false);
            }
          });
        }
      }
    };
    
    reader.readAsDataURL(file);
  };

  const handleExport = () => {
    if (fabricCanvasRef.current) {
      // Correction du paramètre pour TypeScript
      const dataURL = fabricCanvasRef.current.toDataURL({ 
        format: 'png',
        multiplier: 1
      });
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'schema.png';
      link.click();
      toast("Schéma exporté en PNG");
    }
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-brand-blue">Éditeur de Schémas</h1>
        
        <div className="mb-4 flex flex-wrap gap-2">
          <Button onClick={handleAddCircle} className="flex items-center gap-2">
            <Circle size={16} />
            Ajouter un cercle
          </Button>
          
          <Button onClick={handleOpenFileDialog} variant="outline" className="flex items-center gap-2">
            <Upload size={16} />
            Importer un SVG
          </Button>
          
          <input 
            type="file" 
            ref={fileInputRef}
            accept=".svg,.png,.jpg,.jpeg" 
            className="hidden" 
            onChange={handleFileUpload}
          />
          
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Exporter en PNG
          </Button>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Bioicons</h2>
          <div className="flex flex-wrap gap-2">
            {BIOICON_EXAMPLES.slice(0, 5).map((iconUrl, index) => (
              <Button 
                key={index}
                onClick={() => handleAddBioicon(iconUrl)} 
                variant="secondary"
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <Image size={16} />
                Icon {index + 1}
              </Button>
            ))}
            
            <Button 
              onClick={() => handleAddBioicon(BIOICON_EXAMPLES[5])} 
              variant="secondary"
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Bug size={16} />
              Drosophile
            </Button>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 shadow-md">
          <canvas ref={canvasRef} id="fabric-canvas" />
        </div>
      </div>
    </Layout>
  );
};

export default EditorPage;
