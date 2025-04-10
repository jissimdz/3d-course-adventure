
import React from "react";
import { Check, Brain, Layers, Video, Rotate3d } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import BrainModel3D from "@/components/BrainModel3D";

interface CourseOverviewProps {
  isNeuroanatomyCourse: boolean;
  learningOutcomes: string[];
  onModelViewOpen: () => void;
}

const CourseOverview: React.FC<CourseOverviewProps> = ({
  isNeuroanatomyCourse,
  learningOutcomes,
  onModelViewOpen,
}) => {
  if (isNeuroanatomyCourse) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-brand-blue">
            À Propos de ce Cours
          </h2>
          <p className="mt-3 text-gray-700">
            Ce cours avancé d'exploration neuroanatomique vous fait plonger dans les mystères 
            complexes du cerveau humain et du système nerveux. À travers une technologie de 
            visualisation 3D de pointe, vous découvrirez les structures cérébrales, les voies 
            neuronales et les mécanismes fondamentaux qui gouvernent notre système nerveux.
          </p>
          
          <p className="mt-3 text-gray-700">
            Des modèles interactifs en trois dimensions vous permettront de naviguer à travers 
            les différentes couches du cerveau, d'explorer les régions anatomiques clés et de 
            comprendre comment les neurones communiquent entre eux. Chaque module combine des 
            explications théoriques avec des visualisations pratiques pour renforcer votre 
            compréhension.
          </p>
          
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="p-4 text-center">
              <Brain className="mx-auto mb-2 h-10 w-10 text-brand-blue" />
              <h3 className="text-lg font-medium">Modélisation 3D Avancée</h3>
              <p className="text-sm text-gray-600">Explorez chaque structure cérébrale en détail</p>
            </Card>
            
            <Card className="p-4 text-center">
              <Layers className="mx-auto mb-2 h-10 w-10 text-brand-blue" />
              <h3 className="text-lg font-medium">Anatomie en Couches</h3>
              <p className="text-sm text-gray-600">Naviguez à travers les différentes couches du système nerveux</p>
            </Card>
            
            <Card className="p-4 text-center">
              <Video className="mx-auto mb-2 h-10 w-10 text-brand-blue" />
              <h3 className="text-lg font-medium">Animations Interactives</h3>
              <p className="text-sm text-gray-600">Visualisez le fonctionnement des voies neuronales</p>
            </Card>
          </div>
          
          <div className="mt-8 rounded-lg border border-brand-blue/20 bg-brand-blue/5 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-brand-blue">Modélisation 3D Avancée</h3>
              <Badge variant="outline" className="border-brand-teal text-brand-teal">
                Nouveau
              </Badge>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-gray-700">
                  Découvrez notre technologie de modélisation 3D de pointe qui vous permet d'explorer 
                  en détail l'anatomie du cerveau humain. Manipulez, tournez et zoomez sur des modèles 
                  tridimensionnels précis pour une compréhension approfondie des structures cérébrales.
                </p>
                
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <Check className="h-5 w-5 shrink-0 text-green-500" />
                    <span>Visualisation haute résolution des structures cérébrales</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <Check className="h-5 w-5 shrink-0 text-green-500" />
                    <span>Exploration interactive avec zoom et rotation</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <Check className="h-5 w-5 shrink-0 text-green-500" />
                    <span>Étude anatomique précise avec annotations détaillées</span>
                  </li>
                </ul>
                
                <Button 
                  onClick={onModelViewOpen}
                  className="mt-6 flex items-center gap-2 bg-brand-blue text-white hover:bg-brand-blue/90"
                >
                  <Rotate3d className="h-4 w-4" />
                  Explorer le Modèle 3D
                </Button>
              </div>
              
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
                <div className="relative aspect-square">
                  <Suspense fallback={
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <p>Chargement du modèle 3D...</p>
                    </div>
                  }>
                    <BrainModel3D />
                  </Suspense>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button 
                      onClick={onModelViewOpen}
                      variant="ghost" 
                      className="rounded-full bg-white/90 p-2 text-brand-blue hover:bg-white"
                      size="icon"
                    >
                      <Rotate3d className="h-8 w-8" />
                    </Button>
                  </div>
                </div>
                <div className="p-3 text-center text-sm text-gray-700">
                  Modèle interactif du cerveau humain en 3D
                </div>
              </div>
            </div>
          </div>
        </div>

        <LearningOutcomes outcomes={learningOutcomes} />

        <div>
          <h2 className="text-2xl font-semibold text-brand-blue">
            Prérequis
          </h2>
          <ul className="mt-3 list-disc pl-5 text-gray-700">
            <li>Connaissances de base en anatomie humaine recommandées</li>
            <li>Un navigateur web moderne qui prend en charge les graphiques 3D avancés</li>
            <li>Intérêt pour les neurosciences et la structure du cerveau humain</li>
            <li>Aucune expérience préalable en neurologie n'est requise</li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-brand-blue">
            Public Cible
          </h2>
          <ul className="mt-3 list-disc pl-5 text-gray-700">
            <li>Étudiants en sciences biologiques et médicales, neurosciences ou disciplines connexes</li>
            <li>Professionnels de la santé souhaitant approfondir leurs connaissances en neuroanatomie</li>
            <li>Chercheurs dans le domaine des neurosciences</li>
            <li>Passionnés des sciences cognitives et du fonctionnement du cerveau</li>
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-brand-blue">
            À Propos de ce Cours
          </h2>
          <p className="mt-3 text-gray-700">
            Ce cours complet vous emmène dans un voyage à travers l'anatomie humaine, 
            en utilisant une technologie de visualisation 3D de pointe pour rendre les concepts complexes 
            faciles à comprendre. Que vous soyez étudiant en sciences biologiques et médicales, professionnel de la santé ou 
            simplement curieux de l'anatomie humaine, ce cours vous apportera des connaissances et 
            des perspectives précieuses.
          </p>
        </div>

        <LearningOutcomes outcomes={learningOutcomes} />

        <div>
          <h2 className="text-2xl font-semibold text-brand-blue">
            Prérequis
          </h2>
          <ul className="mt-3 list-disc pl-5 text-gray-700">
            <li>Aucune connaissance préalable requise - adapté aux débutants</li>
            <li>Un navigateur web moderne qui prend en charge les graphiques 3D</li>
            <li>Intérêt pour l'apprentissage de l'anatomie et de la physiologie humaines</li>
          </ul>
        </div>
      </div>
    );
  }
};

interface LearningOutcomesProps {
  outcomes: string[];
}

const LearningOutcomes: React.FC<LearningOutcomesProps> = ({ outcomes }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-brand-blue">
        Ce que Vous Apprendrez
      </h2>
      <ul className="mt-3 space-y-2">
        {outcomes.map((outcome, index) => (
          <li key={index} className="flex items-start gap-2 text-gray-700">
            <Check className="h-5 w-5 shrink-0 text-green-500" />
            <span>{outcome}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseOverview;
