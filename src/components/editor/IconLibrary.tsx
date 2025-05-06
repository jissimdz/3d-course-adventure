
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

const MAX_ICONS_PER_FOLDER = 20;
const MAX_ICON_SIZE_KB = 100;

const IconLibrary: React.FC<IconLibraryProps> = ({ onAddIcon }) => {
  const [iconLibrary, setIconLibrary] = useState<IconFolders>({
    "Dossier par défaut": []
  });
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  
  // Load icon library from localStorage on component mount
  useEffect(() => {
    try {
      const savedLibrary = localStorage.getItem("iconLibrary");
      if (savedLibrary) {
        setIconLibrary(JSON.parse(savedLibrary));
      }
    } catch (e) {
      console.error("Error loading icon library from localStorage:", e);
      toast.error("Impossible de charger la bibliothèque d'icônes");
    }
  }, []);
  
  // Save icon library to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("iconLibrary", JSON.stringify(iconLibrary));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
      toast.error("Impossible de sauvegarder la bibliothèque d'icônes (espace de stockage insuffisant)");
    }
  }, [iconLibrary]);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Default folder
    const defaultFolder = "Dossier par défaut";
    
    // Check if we're already at max capacity for this folder
    const currentFolder = iconLibrary[defaultFolder] || [];
    if (currentFolder.length >= MAX_ICONS_PER_FOLDER) {
      toast.error(`Le dossier est plein (maximum ${MAX_ICONS_PER_FOLDER} icônes)`);
      return;
    }
    
    Array.from(files).slice(0, MAX_ICONS_PER_FOLDER - currentFolder.length).forEach(file => {
      // Check file size
      if (file.size > MAX_ICON_SIZE_KB * 1024) {
        toast.error(`L'icône ${file.name} dépasse la taille limite de ${MAX_ICON_SIZE_KB}KB`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const iconData: IconData = {
            name: file.name,
            data: event.target.result.toString()
          };
          
          try {
            setIconLibrary(prev => {
              const updatedLibrary = {
                ...prev,
                [defaultFolder]: [...(prev[defaultFolder] || []), iconData]
              };
              
              // Test if we can store this in localStorage
              const testStorage = JSON.stringify(updatedLibrary);
              return updatedLibrary;
            });
            
            toast.success(`Icône ${file.name} ajoutée à la bibliothèque`);
          } catch (e) {
            toast.error(`Impossible d'ajouter ${file.name} - espace de stockage insuffisant`);
          }
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
    
    try {
      setIconLibrary(prev => ({
        ...prev,
        [newFolderName]: []
      }));
      
      setNewFolderName("");
      setShowNewFolderInput(false);
      toast.success(`Dossier "${newFolderName}" créé`);
    } catch (e) {
      toast.error("Impossible de créer le dossier - espace de stockage insuffisant");
    }
  };
  
  const removeIcon = (folderName: string, iconIndex: number) => {
    try {
      setIconLibrary(prev => {
        const updatedFolder = [...prev[folderName]];
        updatedFolder.splice(iconIndex, 1);
        
        return {
          ...prev,
          [folderName]: updatedFolder
        };
      });
      toast.success("Icône supprimée");
    } catch (e) {
      toast.error("Impossible de supprimer l'icône");
    }
  };

  const handleDragStart = (e: React.DragEvent, iconData: string) => {
    e.dataTransfer.setData("icon", iconData);
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 mb-4">
      <h3 className="text-lg font-medium mb-4">Bibliothèque d'icônes</h3>
      <p className="text-xs text-gray-500 mb-2">
        Limite: {MAX_ICONS_PER_FOLDER} icônes par dossier, {MAX_ICON_SIZE_KB}KB par icône
      </p>
      
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
                  className="border rounded p-1 cursor-move relative group"
                  draggable
                  onDragStart={(e) => handleDragStart(e, icon.data)}
                  onClick={() => onAddIcon(icon.data)}
                >
                  <img 
                    src={icon.data} 
                    alt={icon.name}
                    className="w-full h-auto max-h-16 object-contain" 
                  />
                  <button 
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeIcon(folder, index);
                    }}
                  >
                    ×
                  </button>
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
