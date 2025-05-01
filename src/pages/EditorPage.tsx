
import React, { useState } from "react";
import Layout from "@/components/Layout";
import Canvas from "@/components/editor/Canvas";
import EditorToolbar from "@/components/editor/EditorToolbar";
import BioiconsPanel from "@/components/editor/BioiconsPanel";
import CanvasContainer from "@/components/editor/CanvasContainer";

const EditorPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const canvas = Canvas({});

  const handleAddBioicon = (iconUrl: string) => {
    canvas.addImage(iconUrl, setIsLoading);
  };

  const handleFileUpload = (file: File) => {
    canvas.addUploadedFile(file, setIsLoading);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-brand-blue">Éditeur de Schémas</h1>

        <EditorToolbar
          onAddCircle={canvas.addCircle}
          onFileUpload={handleFileUpload}
          onExport={canvas.exportCanvas}
          isLoading={isLoading}
        />

        <BioiconsPanel 
          onAddBioicon={handleAddBioicon}
          isLoading={isLoading}
        />

        <CanvasContainer canvasRef={canvas.canvasRef} />
      </div>
    </Layout>
  );
};

export default EditorPage;
