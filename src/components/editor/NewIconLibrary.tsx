
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Plus } from "lucide-react";
import { toast } from "sonner";

interface NewIconLibraryProps {
  onAddIcon: (iconSrc: string) => void;
}

// Icônes par défaut (vous pouvez les remplacer par vos vraies icônes)
const defaultIcons = [
  "https://bioicons.com/icons/cell.svg",
  "https://bioicons.com/icons/virus.svg",
  "https://bioicons.com/icons/dna.svg",
  "https://bioicons.com/icons/bacteria.svg",
  "https://bioicons.com/icons/protein.svg",
  "/lovable-uploads/80207e3b-3c5f-4d89-bd3c-bc2a15a56e50.png"
];

const NewIconLibrary: React.FC<NewIconLibraryProps> = ({ onAddIcon }) => {
  const [customIcons, setCustomIcons] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const iconSrc = event.target.result.toString();
            setCustomIcons(prev => [...prev, iconSrc]);
            toast.success(`Icône ${file.name} ajoutée`);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const allIcons = [...defaultIcons, ...customIcons];

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium mb-4">Bibliothèque d'icônes</h3>
      
      <div className="mb-4">
        <label className="cursor-pointer">
          <Input 
            type="file" 
            accept="image/*" 
            multiple 
            className="hidden" 
            onChange={handleFileUpload}
          />
          <Button variant="outline" className="flex items-center gap-2 w-full" asChild>
            <span>
              <Upload size={16} />
              Importer des icônes
            </span>
          </Button>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
        {allIcons.map((iconSrc, index) => (
          <div 
            key={index}
            className="border rounded p-2 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => {
              onAddIcon(iconSrc);
              toast.success("Icône ajoutée au canvas");
            }}
          >
            <img 
              src={iconSrc} 
              alt={`Icon ${index + 1}`}
              className="w-full h-16 object-contain"
              onError={(e) => {
                console.error("Erreur de chargement d'icône:", iconSrc);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ))}
        
        {allIcons.length === 0 && (
          <div className="col-span-2 text-center text-gray-500 py-4">
            Aucune icône disponible. Importez des icônes pour commencer.
          </div>
        )}
      </div>
    </div>
  );
};

export default NewIconLibrary;
