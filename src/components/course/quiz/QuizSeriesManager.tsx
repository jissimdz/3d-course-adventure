
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { QuizSeries } from "../types/quizTypes";

interface QuizSeriesManagerProps {
  quizSeries: QuizSeries[];
  currentSeriesId: string;
  onChangeSeries: (id: string) => void;
  onAddSeries: (name: string) => void;
  onDeleteSeries: (id: string) => void;
  courseId: string;
}

const QuizSeriesManager: React.FC<QuizSeriesManagerProps> = ({
  quizSeries,
  currentSeriesId,
  onChangeSeries,
  onAddSeries,
  onDeleteSeries,
  courseId
}) => {
  const [newSeriesName, setNewSeriesName] = React.useState<string>("");

  const handleAddSeries = () => {
    if (!newSeriesName.trim()) {
      toast.error("Veuillez entrer un nom pour la nouvelle série");
      return;
    }
    
    onAddSeries(newSeriesName);
    setNewSeriesName("");
    
    // Mise à jour explicite du localStorage
    setTimeout(() => {
      try {
        const storageKey = `quizSeries_${courseId}`;
        const updatedSeries = localStorage.getItem(storageKey);
        if (updatedSeries) {
          console.log("Quiz series saved:", JSON.parse(updatedSeries));
          toast.success("Série sauvegardée avec succès");
        }
      } catch (error) {
        console.error("Error checking localStorage:", error);
      }
    }, 100);
  };

  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-medium mb-4">Séries de Quiz</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Série actuelle</label>
          <Select value={currentSeriesId} onValueChange={onChangeSeries}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une série" />
            </SelectTrigger>
            <SelectContent>
              {quizSeries.map(series => (
                <SelectItem key={series.id} value={series.id}>
                  {series.name} ({series.imageQuestions.length + series.textQuestions.length} questions)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Nouvelle série</label>
            <Input 
              placeholder="Nom de la nouvelle série"
              value={newSeriesName}
              onChange={(e) => setNewSeriesName(e.target.value)}
            />
          </div>
          <Button
            onClick={handleAddSeries}
            className="bg-brand-blue hover:bg-brand-blue/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>
      <div className="flex justify-end">
        {quizSeries.length > 1 && (
          <Button
            variant="outline"
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => {
              onDeleteSeries(currentSeriesId);
              // Afficher une confirmation de suppression
              toast.success("Série supprimée");
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer cette série
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizSeriesManager;
