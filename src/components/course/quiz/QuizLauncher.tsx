
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
import { saveQuizProgress, getQuizProgress } from "./QuizStorage";
import { toast } from "sonner";
import QuizLauncherDialog from "./components/QuizLauncherDialog";
import QuizSeriesSelector from "./components/QuizSeriesSelector";
import QuizProgressDisplay from "./components/QuizProgressDisplay";
import QuizContent from "./components/QuizContent";

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
    <QuizLauncherDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      courseId={courseId}
    >
      <QuizSeriesSelector
        quizSeries={quizSeries}
        currentSeriesId={currentSeriesId}
        onChangeSeriesId={onChangeSeriesId}
      />
      
      <QuizProgressDisplay
        progressData={progressData}
        quizResult={quizResult}
      />
      
      <QuizContent
        currentSeries={currentSeries}
        courseId={courseId}
        onComplete={handleComplete}
      />
    </QuizLauncherDialog>
  );
};

export default QuizLauncher;
