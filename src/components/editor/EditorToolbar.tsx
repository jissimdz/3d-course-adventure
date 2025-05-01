
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Circle as CircleIcon, Upload } from "lucide-react";

interface EditorToolbarProps {
  onAddCircle: () => void;
  onFileUpload: (file: File) => void;
  onExport: () => void;
  isLoading: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  onAddCircle, 
  onFileUpload, 
  onExport,
  isLoading 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Button 
        onClick={onAddCircle} 
        className="flex items-center gap-2"
        disabled={isLoading}
      >
        <CircleIcon size={16} />
        Ajouter un cercle
      </Button>

      <Button 
        onClick={handleOpenFileDialog} 
        variant="outline" 
        className="flex items-center gap-2"
        disabled={isLoading}
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
