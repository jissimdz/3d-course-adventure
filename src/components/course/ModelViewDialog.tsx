import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BrainModel3D from "@/components/brain-model";

interface ModelViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ModelViewDialog: React.FC<ModelViewDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Modèle 3D du Cerveau Humain</DialogTitle>
        </DialogHeader>
        <div className="mt-2 rounded-lg bg-gray-50 p-4">
          <div className="aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            <Suspense fallback={
              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                <p>Chargement du modèle 3D...</p>
              </div>
            }>
              <BrainModel3D height="500px" />
            </Suspense>
          </div>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-brand-blue">Structures visibles</h3>
              <ul className="space-y-1 text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-3 w-3 rounded-full bg-red-400"></div>
                  <span>Cortex cérébral</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-3 w-3 rounded-full bg-orange-400"></div>
                  <span>Corps calleux</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-3 w-3 rounded-full bg-yellow-400"></div>
                  <span>Thalamus</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-3 w-3 rounded-full bg-green-400"></div>
                  <span>Hypothalamus</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-3 w-3 rounded-full bg-blue-400"></div>
                  <span>Tronc cérébral</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-3 w-3 rounded-full bg-indigo-400"></div>
                  <span>Cervelet</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-brand-blue">À propos de ce modèle</h3>
              <p className="text-gray-700">
                Ce modèle 3D interactif du cerveau humain vous permet d'explorer les principales structures anatomiques.
                Utilisez votre souris pour faire pivoter le modèle, zoomer et explorer les détails de chaque structure.
              </p>
              <p className="mt-2 text-gray-700">
                Dans le cours complet, vous aurez accès à des modèles encore plus détaillés avec des annotations
                interactives pour chaque région du cerveau.
              </p>
              <div className="mt-4">
                <p className="text-sm text-gray-500 italic">
                  Astuce: Cliquez et faites glisser pour faire pivoter. Utilisez la molette de défilement pour zoomer.
                </p>
              </div>
              <div className="mt-4">
                <Button 
                  className="bg-brand-blue hover:bg-brand-blue/90"
                  onClick={() => onOpenChange(false)}
                >
                  Retour au cours
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModelViewDialog;
