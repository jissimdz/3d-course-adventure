
import React, { useEffect, useRef, useState } from "react";
import { Canvas, loadSVGFromURL, Image as FabricImage, Circle } from 'fabric';
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Download,
  Circle as CircleIcon,
  Upload,
  Image as ImageIcon,
  Bug,
  Brain,
  Star,
  Heart,
  Sun,
  Cloud,
  Book,
  Eye,
  Pen,
} from "lucide-react";
import { toast } from "sonner";

// Tableau d'URLs d'icônes bioicons pour les exemples
const BIOICON_EXAMPLES = [
  "https://bioicons.com/icons/cell.svg",
  "https://bioicons.com/icons/virus.svg",
  "https://bioicons.com/icons/dna.svg",
  "https://bioicons.com/icons/bacteria.svg",
  "https://bioicons.com/icons/protein.svg",
  "/lovable-uploads/80207e3b-3c5f-4d89-bd3c-bc2a15a56e50.png",
];

// Sélection d'icônes Lucide autorisées pour insertion
const LUCIDE_ICONS = [
  { name: "Cerveau", icon: Brain },
  { name: "Étoile", icon: Star },
  { name: "Cœur", icon: Heart },
  { name: "Soleil", icon: Sun },
  { name: "Nuage", icon: Cloud },
  { name: "Livre", icon: Book },
  { name: "Œil", icon: Eye },
  { name: "Stylo", icon: Pen },
];

const EditorPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      const canvas = new Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
      });
      fabricCanvasRef.current = canvas;
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, []);

  const handleAddCircle = () => {
    if (fabricCanvasRef.current) {
      const circle = new Circle({
        radius: 50,
        fill: 'blue',
        left: 100,
        top: 100,
      });
      fabricCanvasRef.current.add(circle);
      fabricCanvasRef.current.renderAll();
    }
  };

  // Ajout d'icône Lucide sur le canvas
  const handleAddLucideIcon = async (IconComponent: React.FC<any>) => {
    if (!fabricCanvasRef.current) return;
    setIsLoading(true);

    // Render the icon as SVG markup string
    const svgMarkup = renderLucideIconToSVGString(IconComponent);

    // convert SVG markup to DataURL
    const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml" });
    const reader = new FileReader();
    reader.onload = function(e) {
      const dataUrl = e.target?.result as string;
      FabricImage.fromURL(dataUrl, (img) => {
        if (img && fabricCanvasRef.current) {
          img.set({
            left: 180,
            top: 140,
            scaleX: 2.2,
            scaleY: 2.2,
            borderColor: 'red',
            cornerColor: 'green',
            cornerSize: 12,
            transparentCorners: false,
            selectable: true,
          });
          img.on('selected', function() {
            toast('Icône Lucide sélectionnée');
          });
          fabricCanvasRef.current.add(img);
          fabricCanvasRef.current.renderAll();
          toast('Icône Lucide ajoutée');
        }
        setIsLoading(false);
      });
    };
    reader.readAsDataURL(svgBlob);
  };

  // Convertit un composant React Lucide en string SVG
  function renderLucideIconToSVGString(IconComponent: React.FC<any>) {
    // Les propriétés peuvent être adaptées selon vos besoins
    return `<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">${IconComponent({ color: "#1057db", size: 48 }).props.children}</svg>`;
  }

  const handleAddBioicon = (iconUrl: string) => {
    if (!fabricCanvasRef.current) return;
    setIsLoading(true);

    if (iconUrl.endsWith('.png') || iconUrl.endsWith('.jpg') || iconUrl.endsWith('.jpeg')) {
      // Utiliser FabricImage.fromURL correctement (sans 'objectCaching')
      FabricImage.fromURL(iconUrl, (img) => {
        if (img && fabricCanvasRef.current) {
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
          img.on('selected', function() {
            toast("Image sélectionnée");
          });
          fabricCanvasRef.current.add(img);
          fabricCanvasRef.current.renderAll();
          toast("Image ajoutée avec succès");
        }
        setIsLoading(false);
      });
    } else {
      // SVG depuis URL
      loadSVGFromURL(iconUrl).then(({ objects }) => {
        if (objects && objects.length && fabricCanvasRef.current) {
          // Ajouter chaque objet plutôt que createGroup (qui n'existe pas)
          const groupObjects = objects.map((obj) =>
            obj.set({ left: 150, top: 150, scaleX: 0.5, scaleY: 0.5, borderColor: 'red', cornerColor: 'green', cornerSize: 12, transparentCorners: false })
          );
          groupObjects.forEach((object) => {
            object.on?.('selected', function() {
              toast("Icône SVG sélectionnée");
            });
            fabricCanvasRef.current?.add(object);
          });
          fabricCanvasRef.current.renderAll();
          toast("Icône SVG ajoutée avec succès");
        }
        setIsLoading(false);
      }).catch(err => {
        toast.error("Erreur lors du chargement du SVG");
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
          loadSVGFromURL(dataUrl).then(({ objects }) => {
            if (objects && objects.length && fabricCanvasRef.current) {
              objects.forEach((object) => {
                object.set({
                  left: 150,
                  top: 150,
                  borderColor: 'red',
                  cornerColor: 'green',
                  cornerSize: 12,
                  transparentCorners: false,
                });
                object.on?.('selected', function() {
                  toast("SVG sélectionné");
                });
                fabricCanvasRef.current!.add(object);
              });
              fabricCanvasRef.current.renderAll();
              toast("SVG importé avec succès");
            }
            setIsLoading(false);
          }).catch(err => {
            toast.error("Erreur lors du chargement du SVG");
            setIsLoading(false);
          });
        } else {
          FabricImage.fromURL(dataUrl, (img) => {
            if (img && fabricCanvasRef.current) {
              img.set({
                left: 150,
                top: 150,
                borderColor: 'red',
                cornerColor: 'green',
                cornerSize: 12,
                transparentCorners: false,
              });
              img.on('selected', function() {
                toast("Image sélectionnée");
              });
              fabricCanvasRef.current.add(img);
              fabricCanvasRef.current.renderAll();
              toast("Image importée avec succès");
            }
            setIsLoading(false);
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleExport = () => {
    if (fabricCanvasRef.current) {
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: 'png',
        multiplier: 1,
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
            <CircleIcon size={16} />
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
                <ImageIcon size={16} />
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

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Icônes Lucide</h2>
          <div className="flex flex-wrap gap-2">
            {LUCIDE_ICONS.map(({ name, icon: IconComp }, idx) => (
              <Button
                key={name}
                className="flex items-center gap-2"
                variant="secondary"
                onClick={() => handleAddLucideIcon(IconComp)}
                disabled={isLoading}
              >
                <IconComp size={16} />
                {name}
              </Button>
            ))}
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

