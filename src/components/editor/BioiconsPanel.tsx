
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Folder, Search } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Default bioicon examples kept as fallback
const BIOICON_EXAMPLES = ["https://bioicons.com/icons/cell.svg", "https://bioicons.com/icons/virus.svg", "https://bioicons.com/icons/dna.svg", "https://bioicons.com/icons/bacteria.svg", "https://bioicons.com/icons/protein.svg", "/lovable-uploads/80207e3b-3c5f-4d89-bd3c-bc2a15a56e50.png"];

// Interface for the icon library data
interface IconData {
  name: string;
  data: string;
}

interface IconFolders {
  [key: string]: IconData[];
}

interface BioiconsPanelProps {
  onAddBioicon: (iconUrl: string) => void;
  isLoading: boolean;
}

// Nom de la base de données
const DB_NAME = 'iconLibraryDB';
const STORE_NAME = 'iconStore';

const BioiconsPanel: React.FC<BioiconsPanelProps> = ({
  onAddBioicon,
  isLoading
}) => {
  const [iconLibrary, setIconLibrary] = useState<IconFolders>({});
  const [isLibraryLoading, setIsLibraryLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  
  // Ouvrir/Initialiser la base de données IndexedDB
  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      
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
      setIsLibraryLoading(true);
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('iconLibrary');
      
      request.onsuccess = () => {
        if (request.result) {
          setIconLibrary(request.result.data);
        }
        setIsLibraryLoading(false);
      };
      
      request.onerror = () => {
        console.error("Erreur lors du chargement de la bibliothèque d'icônes");
        setIsLibraryLoading(false);
      };
    } catch (e) {
      console.error("Erreur lors du chargement depuis IndexedDB:", e);
      setIsLibraryLoading(false);
    }
  };

  // Charger la bibliothèque d'icônes au démarrage du composant
  useEffect(() => {
    loadFromIndexedDB();
  }, []);

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Icônes scientifiques</h2>
      
      {isLibraryLoading ? (
        <div className="flex justify-center py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {/* Dropdown menus for each folder */}
          {Object.keys(iconLibrary).length > 0 ? (
            Object.keys(iconLibrary).map((folderName) => (
              <DropdownMenu key={folderName}>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="flex items-center gap-2" disabled={isLoading}>
                    <Folder size={16} />
                    {folderName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 max-h-80 overflow-y-auto">
                  {iconLibrary[folderName].map((icon, index) => (
                    <DropdownMenuItem 
                      key={`${folderName}-${index}`}
                      onClick={() => onAddBioicon(icon.data)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className="w-6 h-6 flex items-center justify-center">
                        <img 
                          src={icon.data} 
                          alt={icon.name} 
                          className="w-5 h-5 object-contain"
                        />
                      </div>
                      <span className="text-sm truncate">{icon.name}</span>
                    </DropdownMenuItem>
                  ))}
                  
                  {iconLibrary[folderName].length === 0 && (
                    <div className="text-sm text-gray-500 text-center py-2">
                      Dossier vide
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ))
          ) : (
            // Fallback buttons if no folders exist
            BIOICON_EXAMPLES.slice(0, 5).map((iconUrl, index) => (
              <Button 
                key={index} 
                onClick={() => onAddBioicon(iconUrl)} 
                variant="secondary" 
                className="flex items-center gap-2" 
                disabled={isLoading}
              >
                <ImageIcon size={16} />
                Icon {index + 1}
              </Button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export { BIOICON_EXAMPLES };
export default BioiconsPanel;
