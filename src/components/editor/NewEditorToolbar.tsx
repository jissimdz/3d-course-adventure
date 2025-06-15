
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Circle as CircleIcon, Type, MousePointer2, Pencil, Trash2 } from "lucide-react";

interface NewEditorToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: 'select' | 'icon' | 'text' | 'circle' | 'line') => void;
  onExport: () => void;
  onClear: () => void;
  onAddCircle: () => void;
  onAddText: () => void;
}

const NewEditorToolbar: React.FC<NewEditorToolbarProps> = ({
  selectedTool,
  onToolSelect,
  onExport,
  onClear,
  onAddCircle,
  onAddText
}) => {
  return (
    <div className="mb-4 flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
      <Button
        onClick={() => onToolSelect('select')}
        variant={selectedTool === 'select' ? 'default' : 'outline'}
        className="flex items-center gap-2"
      >
        <MousePointer2 size={16} />
        Sélectionner
      </Button>

      <Button
        onClick={() => {
          onToolSelect('circle');
          onAddCircle();
        }}
        variant={selectedTool === 'circle' ? 'default' : 'outline'}
        className="flex items-center gap-2"
      >
        <CircleIcon size={16} />
        Cercle
      </Button>

      <Button
        onClick={() => {
          onToolSelect('text');
          onAddText();
        }}
        variant={selectedTool === 'text' ? 'default' : 'outline'}
        className="flex items-center gap-2"
      >
        <Type size={16} />
        Texte
      </Button>

      <Button
        onClick={() => onToolSelect('line')}
        variant={selectedTool === 'line' ? 'default' : 'outline'}
        className="flex items-center gap-2"
      >
        <Pencil size={16} />
        Ligne
      </Button>

      <div className="ml-auto flex gap-2">
        <Button
          onClick={onClear}
          variant="outline"
          className="flex items-center gap-2 text-red-600 hover:text-red-700"
        >
          <Trash2 size={16} />
          Effacer tout
        </Button>

        <Button
          onClick={onExport}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Exporter PNG
        </Button>
      </div>
    </div>
  );
};

export default NewEditorToolbar;
