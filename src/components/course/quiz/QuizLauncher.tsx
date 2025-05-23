
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { QuizSeries } from "../types/quizTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveQuizProgress, getQuizProgress } from "./QuizStorage";
import { toast } from "sonner";
import UnifiedQuizPlayer from "./UnifiedQuizPlayer";

interface QuizLauncherProps {
  quizSeries: QuizSeries[];
  currentSeriesId: string;
  onChangeSeriesId: (id: string) => void;
  courseId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuizLauncher: React.FC<QuizLauncherProps> = ({
  quizSeries,
  currentSeriesId,
  onChangeSeriesId,
  courseId,
  isOpen,
  onOpenChange
}) => {
  const [quizResult, setQuizResult] = useState<{score: number, total: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Find current selected series
  const currentSeries = quizSeries.find(series => series.id === currentSeriesId);
  
  // Debug logging
  useEffect(() => {
    console.log("QuizLauncher rendered", {
      isOpen,
      currentSeriesId,
      seriesCount: quizSeries.length,
      currentSeries: currentSeries ? {
        name: currentSeries.name,
        imageQuestions: currentSeries.imageQuestions.length,
        textQuestions: currentSeries.textQuestions.length
      } : 'none'
    });
    
    setIsLoading(false);
  }, [isOpen, currentSeriesId, quizSeries, currentSeries]);

  const handleComplete = (score: number, total: number) => {
    setQuizResult({ score, total });
    
    // Calculate percentage
    const percentage = Math.round((score / total) * 100);
    
    // Save progress
    try {
      saveQuizProgress(courseId, currentSeriesId, {
        score,
        total,
        percentage,
        completedAt: new Date().toISOString()
      });
      toast.success(`Quiz terminé! Score: ${score}/${total}`);
    } catch (error) {
      console.error("Error saving quiz progress:", error);
    }
  };
  
  const closeDialog = () => {
    onOpenChange(false);
    setQuizResult(null); // Reset result when closing
  };
  
  // Get existing progress data
  const progressData = currentSeriesId ? getQuizProgress(courseId, currentSeriesId) : null;

  // Determine if we have questions
  const hasQuestions = currentSeries && 
                      ((currentSeries.imageQuestions && currentSeries.imageQuestions.length > 0) ||
                       (currentSeries.textQuestions && currentSeries.textQuestions.length > 0));
  
  // Render loading state
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Chargement du quiz...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
  
  // Handle case where no series is available
  if (!currentSeries) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-brand-blue">Quiz non disponible</DialogTitle>
              <Button variant="ghost" size="icon" onClick={closeDialog}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription>
              Aucune série de quiz n'est disponible pour ce cours.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-brand-blue">Quiz: {courseId}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={closeDialog}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Répondez aux questions suivantes pour tester vos connaissances.
          </DialogDescription>
        </DialogHeader>
        
        {/* Selector for quiz series */}
        {quizSeries.length > 1 && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Série de quiz</label>
            <Select value={currentSeriesId} onValueChange={onChangeSeriesId}>
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
        )}
        
        {/* Show progress if available */}
        {progressData && !quizResult && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              Dernière tentative: {progressData.score} sur {progressData.total} ({progressData.percentage}%)
            </p>
            <p className="text-xs text-green-600">
              {new Date(progressData.completedAt).toLocaleString()}
            </p>
          </div>
        )}
        
        {/* Verify that we have questions */}
        {!hasQuestions ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Aucune question disponible pour ce quiz.</p>
          </div>
        ) : (
          <UnifiedQuizPlayer 
            imageQuestions={currentSeries.imageQuestions || []}
            textQuestions={currentSeries.textQuestions || []}
            onComplete={handleComplete}
            courseId={courseId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizLauncher;
