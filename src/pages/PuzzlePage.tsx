import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Image, Trash2, Plus, Settings, Upload } from "lucide-react";
import { toast } from "sonner";

interface PuzzlePiece {
  id: number;
  xPos: number;
  yPos: number;
  left: number;
  top: number;
}

interface PuzzleImage {
  id: string;
  url: string; 
  name: string;
}

// Images disponibles pour les puzzles - maintenant stockées dans localStorage
const getDefaultImages = (): PuzzleImage[] => [
  { 
    id: "default",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475", 
    name: "Circuit imprimé"
  },
  { 
    id: "ocean", 
    url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21", 
    name: "Vague océanique" 
  },
  { 
    id: "mountain", 
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", 
    name: "Paysage montagneux" 
  },
  { 
    id: "whale", 
    url: "https://images.unsplash.com/photo-1518877593221-1f28583780b4", 
    name: "Baleine à bosse" 
  },
];

// Configuration des niveaux de difficulté
const difficultyLevels = [
  { id: "easy", name: "Facile", grid: 3 }, // 3x3 = 9 pièces
  { id: "medium", name: "Moyen", grid: 4 }, // 4x4 = 16 pièces
  { id: "hard", name: "Difficile", grid: 5 }, // 5x5 = 25 pièces
  { id: "expert", name: "Expert", grid: 6 }, // 6x6 = 36 pièces
];

const PuzzlePage: React.FC = () => {
  // État pour les pièces du puzzle
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const puzzleContainerRef = useRef<HTMLDivElement>(null);
  const draggedPieceRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  // États pour la configuration
  const [availableImages, setAvailableImages] = useState<PuzzleImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<PuzzleImage | null>(null);
  const [difficulty, setDifficulty] = useState(difficultyLevels[1]); // Moyen par défaut
  const [showNumbers, setShowNumbers] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageName, setNewImageName] = useState("");
  const [isAddingImage, setIsAddingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Charger les images depuis localStorage au chargement
  useEffect(() => {
    const savedImages = localStorage.getItem('puzzleImages');
    
    if (savedImages) {
      try {
        const parsedImages = JSON.parse(savedImages);
        setAvailableImages(parsedImages);
        
        // Définir la première image comme sélectionnée
        if (parsedImages.length > 0 && !selectedImage) {
          setSelectedImage(parsedImages[0]);
        }
      } catch (error) {
        console.error("Error loading images from localStorage:", error);
        const defaultImages = getDefaultImages();
        setAvailableImages(defaultImages);
        setSelectedImage(defaultImages[0]);
      }
    } else {
      // Utiliser les images par défaut
      const defaultImages = getDefaultImages();
      setAvailableImages(defaultImages);
      setSelectedImage(defaultImages[0]);
      
      // Enregistrer dans localStorage
      localStorage.setItem('puzzleImages', JSON.stringify(defaultImages));
    }
  }, []);

  // Sauvegarder les images dans localStorage quand elles changent
  useEffect(() => {
    if (availableImages.length > 0) {
      localStorage.setItem('puzzleImages', JSON.stringify(availableImages));
    }
  }, [availableImages]);

  useEffect(() => {
    if (selectedImage) {
      initPuzzle();
    }
  }, [selectedImage, difficulty]);

  const initPuzzle = () => {
    if (!selectedImage) return;
    
    const grid = difficulty.grid;
    const pieceCount = grid * grid;
    const pieceSize = 400 / grid; // La taille de chaque pièce (conteneur de 400px)
    const newPieces: PuzzlePiece[] = [];

    for (let i = 0; i < pieceCount; i++) {
      const xPos = (i % grid) * pieceSize;
      const yPos = Math.floor(i / grid) * pieceSize;
      
      newPieces.push({
        id: i,
        xPos,
        yPos,
        left: Math.random() * (400 - pieceSize),
        top: Math.random() * (400 - pieceSize)
      });
    }
    
    setPieces(newPieces);
    toast({
      title: "Puzzle initialisé",
      description: `${pieceCount} pièces - ${difficulty.name}`,
    });
  };

  const addNewImage = () => {
    if (!newImageUrl.trim() || !newImageName.trim()) {
      toast({
        title: "Erreur",
        description: "L'URL et le nom de l'image sont requis",
        variant: "destructive",
      });
      return;
    }
    
    const newId = `image-${Date.now()}`;
    const newImage: PuzzleImage = {
      id: newId,
      url: newImageUrl,
      name: newImageName
    };
    
    const updatedImages = [...availableImages, newImage];
    setAvailableImages(updatedImages);
    setSelectedImage(newImage);
    
    // Reset form
    setNewImageUrl("");
    setNewImageName("");
    setIsAddingImage(false);
    
    toast({
      title: "Image ajoutée",
      description: `"${newImageName}" a été ajouté à la bibliothèque`,
    });
  };

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image valide.",
        variant: "destructive",
      });
      return;
    }
    
    // Créer un nom par défaut basé sur le nom du fichier
    const fileName = file.name.split('.')[0] || "Image importée";
    
    // Créer une URL pour l'image
    const imageUrl = URL.createObjectURL(file);
    const newId = `image-${Date.now()}`;
    const newImage: PuzzleImage = {
      id: newId,
      url: imageUrl,
      name: fileName
    };
    
    const updatedImages = [...availableImages, newImage];
    setAvailableImages(updatedImages);
    setSelectedImage(newImage);
    
    toast({
      title: "Image ajoutée",
      description: `"${fileName}" a été ajouté à la bibliothèque`,
    });
    
    // Réinitialiser le champ de fichier pour permettre de sélectionner le même fichier à nouveau
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const deleteImage = (id: string) => {
    // Ne pas supprimer s'il ne reste qu'une seule image
    if (availableImages.length <= 1) {
      toast({
        title: "Impossible de supprimer",
        description: "Vous devez conserver au moins une image.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedImages = availableImages.filter(img => img.id !== id);
    setAvailableImages(updatedImages);
    
    // Si l'image supprimée était sélectionnée, sélectionner la première
    if (selectedImage && selectedImage.id === id) {
      setSelectedImage(updatedImages[0]);
    }
    
    toast({
      title: "Image supprimée",
      description: "L'image a été supprimée de la bibliothèque",
    });
  };

  const shufflePieces = () => {
    setPieces(pieces.map(piece => ({
      ...piece,
      left: Math.random() * (400 - (400 / difficulty.grid)),
      top: Math.random() * (400 - (400 / difficulty.grid))
    })));
    
    toast({
      title: "Pièces mélangées",
      description: "Bon courage !",
    });
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    draggedPieceRef.current = id;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (draggedPieceRef.current === null || !puzzleContainerRef.current) return;
    
    const containerRect = puzzleContainerRef.current.getBoundingClientRect();
    const newLeft = e.clientX - containerRect.left - (400 / difficulty.grid / 2);
    const newTop = e.clientY - containerRect.top - (400 / difficulty.grid / 2);
    
    setPieces(pieces.map(piece => 
      piece.id === draggedPieceRef.current
        ? { ...piece, left: newLeft, top: newTop }
        : piece
    ));
    
    draggedPieceRef.current = null;
  };

  const checkCompletion = () => {
    const pieceSize = 400 / difficulty.grid;
    let correctCount = 0;
    const threshold = pieceSize / 4; // Seuil de tolérance adapté à la taille des pièces
    
    pieces.forEach(piece => {
      // Calculer les positions cibles où la pièce devrait être
      const targetLeft = (piece.id % difficulty.grid) * pieceSize;
      const targetTop = Math.floor(piece.id / difficulty.grid) * pieceSize;
      
      // Vérifier si la pièce est proche de sa position cible
      if (
        Math.abs(piece.left - targetLeft) < threshold && 
        Math.abs(piece.top - targetTop) < threshold
      ) {
        correctCount++;
      }
    });
    
    if (correctCount === pieces.length) {
      toast({
        title: "Félicitations !",
        description: "Vous avez résolu le puzzle !",
        variant: "default",
      });
    } else {
      toast({
        title: "Continuez vos efforts !",
        description: `Vous avez ${correctCount}/${pieces.length} pièces correctement placées.`,
        variant: "default",
      });
    }
  };

  // Vérifiez si le puzzle est prêt (une image est sélectionnée)
  if (!selectedImage) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-brand-blue">
              Chargement du puzzle...
            </h1>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-brand-blue">
            Puzzle Scientifique
          </h1>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Configurer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Configuration du puzzle</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Sélection et gestion d'image */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Images</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-brand-blue"
                        onClick={() => setIsAddingImage(!isAddingImage)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        URL
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-brand-blue"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Importer
                      </Button>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={uploadImage}
                      />
                    </div>
                  </div>
                  
                  {isAddingImage && (
                    <div className="mb-4 p-3 border rounded-lg space-y-3 bg-gray-50">
                      <h4 className="font-medium text-sm">Ajouter une nouvelle image</h4>
                      <div>
                        <label className="text-sm text-gray-700">URL de l'image</label>
                        <input 
                          type="text" 
                          placeholder="https://example.com/image.jpg" 
                          className="w-full p-2 border rounded mt-1"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Utilisez une URL valide d'image (jpg, png, webp)
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-700">Nom de l'image</label>
                        <input 
                          type="text" 
                          placeholder="Mon image" 
                          className="w-full p-2 border rounded mt-1"
                          value={newImageName}
                          onChange={(e) => setNewImageName(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="bg-brand-blue"
                          onClick={addNewImage}
                        >
                          Ajouter
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsAddingImage(false)}
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    {availableImages.map((image) => (
                      <div 
                        key={image.id}
                        className={`relative aspect-square border rounded-lg overflow-hidden cursor-pointer ${
                          selectedImage.id === image.id ? 'ring-2 ring-brand-blue' : ''
                        }`}
                        onClick={() => setSelectedImage(image)}
                      >
                        <div 
                          className="absolute top-1 right-1 z-10 bg-white/90 rounded-full p-1 shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteImage(image.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </div>
                        
                        <img 
                          src={image.url} 
                          alt={image.name} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                          {image.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Niveau de difficulté */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Difficulté</h3>
                  <div className="flex flex-wrap gap-2">
                    {difficultyLevels.map((level) => (
                      <Button
                        key={level.id}
                        variant={difficulty.id === level.id ? "default" : "outline"}
                        className={difficulty.id === level.id ? "bg-brand-teal" : ""}
                        onClick={() => setDifficulty(level)}
                      >
                        {level.name} ({level.grid}×{level.grid})
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Options supplémentaires */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Options</h3>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="showNumbers" 
                      checked={showNumbers}
                      onChange={(e) => setShowNumbers(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="showNumbers">Afficher les numéros des pièces</label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <DialogClose asChild>
                  <Button variant="outline">Annuler</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={initPuzzle}>Appliquer</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h2 className="font-semibold text-xl mb-4">Image de référence</h2>
              <img 
                src={selectedImage.url} 
                alt="Image de référence" 
                className="w-full rounded-lg shadow-sm mb-4"
              />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Difficulté:</span>
                  <span className="font-medium">{difficulty.name} ({difficulty.grid}×{difficulty.grid})</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Nombre de pièces:</span>
                  <span className="font-medium">{difficulty.grid * difficulty.grid}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button onClick={shufflePieces} variant="default" className="w-full bg-brand-teal hover:bg-brand-teal/90">
                Mélanger les pièces
              </Button>
              <Button onClick={checkCompletion} variant="outline" className="w-full border-brand-blue text-brand-blue hover:bg-brand-blue/10">
                Vérifier
              </Button>
              <Button onClick={initPuzzle} variant="outline" className="w-full">
                Réinitialiser
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <div 
              ref={puzzleContainerRef}
              className="w-full max-w-[500px] h-[400px] border-2 border-gray-300 relative mx-auto rounded-lg bg-gray-50"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {pieces.map(piece => {
                const pieceSize = 400 / difficulty.grid;
                return (
                  <div
                    key={piece.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, piece.id)}
                    className="absolute cursor-move border border-white"
                    style={{
                      left: `${piece.left}px`,
                      top: `${piece.top}px`,
                      width: `${pieceSize}px`,
                      height: `${pieceSize}px`,
                      backgroundImage: `url(${selectedImage.url})`,
                      backgroundPosition: `-${piece.xPos}px -${piece.yPos}px`,
                      backgroundSize: `${difficulty.grid * 100}px ${difficulty.grid * 100}px`,
                    }}
                  >
                    {showNumbers && (
                      <span className="absolute top-1 left-1 bg-white/70 text-xs font-bold px-1 rounded">
                        {piece.id + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-center mt-4 text-sm text-gray-600">
              Faites glisser les pièces pour reconstituer l'image
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PuzzlePage;
