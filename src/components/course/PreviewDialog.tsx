import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Play, Video } from "lucide-react";
import { toast } from "sonner";
import { useQuiz } from "./CourseQuizContext";

interface PreviewSection {
  title: string;
  id: number;
  videoUrl?: string;
  googleDriveId?: string;
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
  const { handleQuizStart } = useQuiz();

  const handleStartQuiz = () => {
    if (selectedPreview) {
      // Close the dialog
      onOpenChange(false);
      // Always start quiz for neuroanatomy course (section 1) to use the correct questions
      handleQuizStart(1);
      toast.success(`Quiz de Neuroanatomie lancé`);
    }
  };

  // Déterminer quelle vidéo afficher: uploadée, Google Drive ou celle du cours
  const renderVideoContent = () => {
    if (uploadedVideo) {
      return (
        <video 
          width="100%" 
          height="100%" 
          src={uploadedVideo}
          title={`Aperçu de ${selectedPreview?.title}`}
          controls
          className="aspect-video"
        />
      );
    } else if (selectedPreview?.googleDriveId) {
      return (
        <iframe 
          src={`https://drive.google.com/file/d/${selectedPreview.googleDriveId}/preview`}
          width="100%" 
          height="100%"
          title={`Aperçu de ${selectedPreview?.title}`}
          allow="autoplay; fullscreen"
          frameBorder="0"
          className="aspect-video"
        />
      );
    } else if (selectedPreview?.videoUrl) {
      return (
        <video 
          width="100%" 
          height="100%" 
          src={selectedPreview.videoUrl}
          title={`Aperçu de ${selectedPreview?.title}`}
          controls
          className="aspect-video"
        />
      );
    } else {
      return (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          <p>Vidéo d'aperçu non disponible</p>
        </div>
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{selectedPreview?.title} - Aperçu du cours</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full">
          {renderVideoContent()}
        </div>
        <div className="mt-4">
          <p>Cet aperçu vous donne un bref aperçu du contenu de cette section du cours. Pour accéder au cours complet, veuillez vous inscrire.</p>
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-brand-blue text-white hover:bg-brand-blue/90"
              onClick={handleStartQuiz}
            >
              <Play className="h-4 w-4" />
              Commencer le Quiz de Neuroanatomie
            </Button>
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
