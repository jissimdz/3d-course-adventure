
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{selectedPreview?.title} - Aperçu du cours</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full">
          {selectedPreview?.videoUrl ? (
            <iframe 
              width="100%" 
              height="100%" 
              src={selectedPreview.videoUrl}
              title={`Aperçu de ${selectedPreview.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
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
        <div className="mt-4 flex justify-end">
          <Button className="bg-brand-blue hover:bg-brand-blue/90">
            S'inscrire au cours
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
