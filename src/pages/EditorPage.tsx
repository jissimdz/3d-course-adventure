
import React, { useState, useRef } from "react";
import Layout from "@/components/Layout";
import Canvas from "@/components/editor/Canvas";
import EditorToolbar from "@/components/editor/EditorToolbar";
import BioiconsPanel from "@/components/editor/BioiconsPanel";
import CanvasContainer from "@/components/editor/CanvasContainer";
import IconLibrary from "@/components/editor/IconLibrary";

const EditorPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const canvas = Canvas({});

  const handleAddBioicon = (iconUrl: string) => {
    canvas.addImage(iconUrl, setIsLoading);
  };

  const handleFileUpload = (file: File) => {
    canvas.addUploadedFile(file, setIsLoading);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const iconData = e.dataTransfer.getData("icon");
    if (iconData) {
      canvas.addIconFromLibrary(iconData);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-brand-blue">Éditeur de Schémas</h1>

        <EditorToolbar
          onAddCircle={canvas.addCircle}
          onFileUpload={handleFileUpload}
          onExport={canvas.exportCanvas}
          onStartDrawLine={canvas.startDrawLine}
          onStopDrawLine={canvas.stopDrawLine}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 space-y-4">
            <IconLibrary onAddIcon={canvas.addIconFromLibrary} />
            <BioiconsPanel 
              onAddBioicon={handleAddBioicon}
              isLoading={isLoading}
            />
          </div>
          
          <div 
            className="md:col-span-3" 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <CanvasContainer canvasRef={canvas.canvasRef} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditorPage;
