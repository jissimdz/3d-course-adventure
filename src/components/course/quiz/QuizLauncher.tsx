
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ImageQuizPlayer from "./ImageQuizPlayer";
import TextQuizPlayer from "./TextQuizPlayer";
import { QuizSeries } from "../types/quizTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveQuizProgress, getQuizProgress } from "./QuizStorage";
import { toast } from "sonner";

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
  const [quizType, setQuizType] = useState<string>("image");
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
  
  // Determine which quiz type to show by default
  useEffect(() => {
    if (currentSeries) {
      if (currentSeries.imageQuestions && currentSeries.imageQuestions.length > 0) {
        setQuizType("image");
      } else if (currentSeries.textQuestions && currentSeries.textQuestions.length > 0) {
        setQuizType("text");
      }
    }
  }, [currentSeries]);

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

  // Determine if we have questions of each type
  const hasImageQuestions = currentSeries && 
                           currentSeries.imageQuestions && 
                           currentSeries.imageQuestions.length > 0;
                           
  const hasTextQuestions = currentSeries && 
                          currentSeries.textQuestions && 
                          currentSeries.textQuestions.length > 0;
  
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
        {!hasImageQuestions && !hasTextQuestions ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Aucune question disponible pour ce quiz.</p>
          </div>
        ) : (
          <>
            {/* Only show tabs if both question types exist */}
            {hasImageQuestions && hasTextQuestions ? (
              <Tabs defaultValue={quizType} value={quizType} onValueChange={setQuizType}>
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="image" disabled={!hasImageQuestions}>
                    Quiz avec Images
                  </TabsTrigger>
                  <TabsTrigger value="text" disabled={!hasTextQuestions}>
                    Quiz Textuel
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="image">
                  {hasImageQuestions && (
                    <ImageQuizPlayer 
                      questions={currentSeries.imageQuestions} 
                      onComplete={handleComplete}
                      courseId={courseId}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="text">
                  {hasTextQuestions && (
                    <TextQuizPlayer 
                      questions={currentSeries.textQuestions} 
                      onComplete={handleComplete}
                      courseId={courseId}
                    />
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div>
                {/* Render appropriate quiz player based on available questions */}
                {hasImageQuestions && quizType === "image" && (
                  <ImageQuizPlayer 
                    questions={currentSeries.imageQuestions} 
                    onComplete={handleComplete}
                    courseId={courseId}
                  />
                )}
                
                {hasTextQuestions && quizType === "text" && (
                  <TextQuizPlayer 
                    questions={currentSeries.textQuestions} 
                    onComplete={handleComplete}
                    courseId={courseId}
                  />
                )}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizLauncher;
