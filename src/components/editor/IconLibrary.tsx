
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Folder, Upload, Plus } from "lucide-react";
import { toast } from "sonner";

interface IconData {
  name: string;
  data: string;
}

interface IconFolders {
  [key: string]: IconData[];
}

interface IconLibraryProps {
  onAddIcon: (iconData: string) => void;
}

// Constantes pour les limites
const MAX_ICONS_PER_FOLDER = 50; // Augmenté à 50 icônes
const MAX_ICON_SIZE_KB = 200;    // Augmenté à 200KB

// Nom de la base de données
const DB_NAME = 'iconLibraryDB';
const STORE_NAME = 'iconStore';
const DB_VERSION = 1;

const IconLibrary: React.FC<IconLibraryProps> = ({ onAddIcon }) => {
  const [iconLibrary, setIconLibrary] = useState<IconFolders>({
    "Dossier par défaut": []
  });
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Ouvrir/Initialiser la base de données IndexedDB
  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = (event) => {
        reject("Erreur lors de l'ouverture de la base de données");
      };
      
      request.onsuccess = (event) => {
        const db = request.result;
        resolve(db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  };
  
  // Charger les données depuis IndexedDB
  const loadFromIndexedDB = async () => {
    try {
      setIsLoading(true);
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('iconLibrary');
      
      request.onsuccess = () => {
        if (request.result) {
          setIconLibrary(request.result.data);
        }
        setIsLoading(false);
      };
      
      request.onerror = () => {
        toast.error("Erreur lors du chargement de la bibliothèque d'icônes");
        setIsLoading(false);
      };
    } catch (e) {
      console.error("Erreur lors du chargement depuis IndexedDB:", e);
      setIsLoading(false);
      toast.error("Impossible de charger la bibliothèque d'icônes");
    }
  };
  
  // Sauvegarder les données dans IndexedDB
  const saveToIndexedDB = async (data: IconFolders) => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const saveData = {
        id: 'iconLibrary',
        data: data
      };
      
      const request = store.put(saveData);
      
      request.onsuccess = () => {
        // Sauvegarde réussie
      };
      
      request.onerror = () => {
        toast.error("Erreur lors de la sauvegarde de la bibliothèque");
      };
    } catch (e) {
      console.error("Erreur lors de la sauvegarde dans IndexedDB:", e);
      toast.error("Impossible de sauvegarder la bibliothèque d'icônes");
    }
  };
  
  // Charger la bibliothèque d'icônes au démarrage du composant
  useEffect(() => {
    loadFromIndexedDB();
  }, []);
  
  // Sauvegarder la bibliothèque d'icônes lorsqu'elle change
  useEffect(() => {
    if (!isLoading) {
      saveToIndexedDB(iconLibrary);
    }
  }, [iconLibrary, isLoading]);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Dossier par défaut
    const defaultFolder = "Dossier par défaut";
    
    // Vérifier si on est déjà à capacité maximale pour ce dossier
    const currentFolder = iconLibrary[defaultFolder] || [];
    if (currentFolder.length >= MAX_ICONS_PER_FOLDER) {
      toast.error(`Le dossier est plein (maximum ${MAX_ICONS_PER_FOLDER} icônes)`);
      return;
    }
    
    Array.from(files).slice(0, MAX_ICONS_PER_FOLDER - currentFolder.length).forEach(file => {
      // Vérifier la taille du fichier
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
          
          setIconLibrary(prev => {
            const updatedLibrary = {
              ...prev,
              [defaultFolder]: [...(prev[defaultFolder] || []), iconData]
            };
            return updatedLibrary;
          });
          
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
  
  const removeIcon = (folderName: string, iconIndex: number) => {
    setIconLibrary(prev => {
      const updatedFolder = [...prev[folderName]];
      updatedFolder.splice(iconIndex, 1);
      
      return {
        ...prev,
        [folderName]: updatedFolder
      };
    });
    toast.success("Icône supprimée");
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
      
      {isLoading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default IconLibrary;
