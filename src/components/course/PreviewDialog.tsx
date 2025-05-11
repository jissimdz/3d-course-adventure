
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Video } from "lucide-react";
import { toast } from "sonner";

interface PreviewSection {
  title: string;
  id: number;
  videoUrl?: string;
}

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPreview: PreviewSection | null;
}

const PreviewDialog: React.FC<PreviewDialogProps> = ({
  open,
  onOpenChange,
  selectedPreview,
}) => {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier si le fichier est une vidéo
    if (!file.type.startsWith('video/')) {
      toast.error('Le fichier doit être une vidéo');
      return;
    }

    // Vérifier la taille du fichier (limite à 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('La vidéo est trop volumineuse (limite 100MB)');
      return;
    }

    setIsUploading(true);

    // Créer une URL pour la vidéo uploadée
    const videoUrl = URL.createObjectURL(file);
    // Simuler le délai d'upload
    setTimeout(() => {
      setUploadedVideo(videoUrl);
      setIsUploading(false);
      toast.success('Vidéo téléchargée avec succès!');
      
      // En production, vous utiliseriez ici une API pour uploader la vidéo
      console.log('Vidéo uploadée:', file.name);
    }, 1000);
  };

  // Déterminer quelle vidéo afficher: uploadée ou celle du cours
  const displayVideoUrl = uploadedVideo || selectedPreview?.videoUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{selectedPreview?.title} - Aperçu du cours</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full">
          {displayVideoUrl ? (
            <video 
              width="100%" 
              height="100%" 
              src={displayVideoUrl}
              title={`Aperçu de ${selectedPreview?.title}`}
              controls
              className="aspect-video"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <p>Vidéo d'aperçu non disponible</p>
            </div>
          )}
        </div>
        <div className="mt-4">
          <p>Cet aperçu vous donne un bref aperçu du contenu de cette section du cours. Pour accéder au cours complet, veuillez vous inscrire.</p>
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => document.getElementById('video-upload')?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4" />
              {isUploading ? "Téléchargement..." : "Uploader une vidéo"}
            </Button>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <Button className="bg-brand-blue hover:bg-brand-blue/90">
            S'inscrire au cours
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
