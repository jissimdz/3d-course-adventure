
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Circle as CircleIcon, Upload, Pencil, Square, TextCursor } from "lucide-react";

interface EditorToolbarProps {
  onAddCircle: () => void;
  onFileUpload: (file: File) => void;
  onExport: () => void;
  onStartDrawLine: () => void;
  onStopDrawLine: () => void;
  onAddText: () => void;
  isLoading: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  onAddCircle, 
  onFileUpload, 
  onExport,
  onStartDrawLine,
  onStopDrawLine,
  onAddText,
  isLoading 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const toggleDrawingMode = () => {
    if (isDrawingMode) {
      onStopDrawLine();
      setIsDrawingMode(false);
    } else {
      onStartDrawLine();
      setIsDrawingMode(true);
    }
  };

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Button 
        onClick={onAddCircle} 
        className="flex items-center gap-2"
        disabled={isLoading || isDrawingMode}
      >
        <CircleIcon size={16} />
        Ajouter un cercle
      </Button>

      <Button 
        onClick={toggleDrawingMode} 
        className={`flex items-center gap-2 ${isDrawingMode ? 'bg-brand-blue text-white' : ''}`}
        disabled={isLoading}
        variant={isDrawingMode ? "default" : "outline"}
      >
        <Pencil size={16} />
        {isDrawingMode ? "Arrêter le tracé" : "Tracer une ligne"}
      </Button>

      <Button 
        onClick={onAddText} 
        variant="outline" 
        className="flex items-center gap-2"
        disabled={isLoading || isDrawingMode}
      >
        <TextCursor size={16} />
        Ajouter du texte
      </Button>

      <Button 
        onClick={handleOpenFileDialog} 
        variant="outline" 
        className="flex items-center gap-2"
        disabled={isLoading || isDrawingMode}
      >
        <Upload size={16} />
        Importer une image
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        accept=".svg,.png,.jpg,.jpeg"
        className="hidden"
        onChange={handleFileChange}
      />

      <Button 
        onClick={onExport} 
        variant="outline" 
        className="flex items-center gap-2"
        disabled={isLoading}
      >
        <Download size={16} />
        Exporter en PNG
      </Button>
    </div>
  );
};

export default EditorToolbar;
