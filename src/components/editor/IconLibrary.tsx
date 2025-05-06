
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Folder, Upload, Plus } from "lucide-react";
import { toast } from "sonner";

interface IconData {
  name: string;
  data: string;
}

interface IconLibraryProps {
  onAddIcon: (iconData: string) => void;
}

interface IconFolders {
  [key: string]: IconData[];
}

const IconLibrary: React.FC<IconLibraryProps> = ({ onAddIcon }) => {
  const [iconLibrary, setIconLibrary] = useState<IconFolders>({
    "Dossier par défaut": []
  });
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  
  // Load icon library from localStorage on component mount
  useEffect(() => {
    const savedLibrary = localStorage.getItem("iconLibrary");
    if (savedLibrary) {
      try {
        setIconLibrary(JSON.parse(savedLibrary));
      } catch (e) {
        console.error("Error loading icon library from localStorage:", e);
      }
    }
  }, []);
  
  // Save icon library to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("iconLibrary", JSON.stringify(iconLibrary));
  }, [iconLibrary]);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Default folder
    const defaultFolder = "Dossier par défaut";
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const iconData: IconData = {
            name: file.name,
            data: event.target.result.toString()
          };
          
          setIconLibrary(prev => ({
            ...prev,
            [defaultFolder]: [...(prev[defaultFolder] || []), iconData]
          }));
          
          toast.success(`Icône ${file.name} ajoutée à la bibliothèque`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const createNewFolder = () => {
    if (!newFolderName.trim()) {
      toast.error("Le nom du dossier ne peut pas être vide");
      return;
    }
    
    if (iconLibrary[newFolderName]) {
      toast.error("Un dossier avec ce nom existe déjà");
      return;
    }
    
    setIconLibrary(prev => ({
      ...prev,
      [newFolderName]: []
    }));
    
    setNewFolderName("");
    setShowNewFolderInput(false);
    toast.success(`Dossier "${newFolderName}" créé`);
  };

  const handleDragStart = (e: React.DragEvent, iconData: string) => {
    e.dataTransfer.setData("icon", iconData);
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 mb-4">
      <h3 className="text-lg font-medium mb-4">Bibliothèque d'icônes</h3>
      
      <div className="flex items-center gap-2 mb-4">
        <label className="cursor-pointer">
          <Input 
            type="file" 
            accept="image/*" 
            multiple 
            className="hidden" 
            onChange={handleIconUpload}
          />
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <span>
              <Upload size={16} />
              Importer des icônes
            </span>
          </Button>
        </label>
        
        {!showNewFolderInput ? (
          <Button 
            variant="outline" 
            onClick={() => setShowNewFolderInput(true)}
            className="flex items-center gap-2"
          >
            <Folder size={16} />
            Nouveau Dossier
          </Button>
        ) : (
          <div className="flex gap-2 items-center">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nom du dossier"
              className="w-40"
            />
            <Button size="sm" onClick={createNewFolder}>
              <Plus size={16} />
            </Button>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {Object.entries(iconLibrary).map(([folder, icons]) => (
          <div key={folder} className="border rounded-md p-2">
            <h4 className="font-medium mb-2">{folder}</h4>
            <div className="grid grid-cols-4 gap-2">
              {icons.map((icon, index) => (
                <div 
                  key={`${folder}-${index}`} 
                  className="border rounded p-1 cursor-move"
                  draggable
                  onDragStart={(e) => handleDragStart(e, icon.data)}
                  onClick={() => onAddIcon(icon.data)}
                >
                  <img 
                    src={icon.data} 
                    alt={icon.name}
                    className="w-full h-auto max-h-16 object-contain" 
                  />
                </div>
              ))}
              {icons.length === 0 && (
                <div className="text-gray-400 text-sm col-span-4 text-center py-2">
                  Dossier vide
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconLibrary;
