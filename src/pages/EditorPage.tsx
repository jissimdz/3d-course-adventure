
import React, { useEffect, useRef } from "react";
import * as fabric from 'fabric';
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Download, Circle } from "lucide-react";

const EditorPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

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

  const handleExport = () => {
    if (fabricCanvasRef.current) {
      const dataURL = fabricCanvasRef.current.toDataURL({ format: 'png' });
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'schema.png';
      link.click();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-brand-blue">Éditeur de Schémas</h1>
        
        <div className="mb-4 flex gap-2">
          <Button onClick={handleAddCircle} className="flex items-center gap-2">
            <Circle size={16} />
            Ajouter un cercle
          </Button>
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Exporter en PNG
          </Button>
        </div>
        
        <div className="rounded-lg border border-gray-200 shadow-md">
          <canvas ref={canvasRef} id="fabric-canvas" />
        </div>
      </div>
    </Layout>
  );
};

export default EditorPage;
