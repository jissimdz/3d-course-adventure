
import React, { useState } from "react";
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
  
  // Find current selected series
  const currentSeries = quizSeries.find(series => series.id === currentSeriesId) || quizSeries[0];
  
  const handleComplete = (score: number, total: number) => {
    setQuizResult({ score, total });
    
    // Calculate percentage
    const percentage = Math.round((score / total) * 100);
    
    // Save progress
    saveQuizProgress(courseId, currentSeriesId, {
      score,
      total,
      percentage,
      completedAt: new Date().toISOString()
    });
  };
  
  const closeDialog = () => {
    onOpenChange(false);
    setQuizResult(null); // Reset result when closing
  };
  
  // Get existing progress data
  const progressData = getQuizProgress(courseId, currentSeriesId);
  
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
        
        {/* Only show tabs if both question types exist */}
        {currentSeries && currentSeries.imageQuestions.length > 0 && currentSeries.textQuestions.length > 0 ? (
          <Tabs defaultValue="image" value={quizType} onValueChange={setQuizType}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="image">Quiz avec Images</TabsTrigger>
              <TabsTrigger value="text">Quiz Textuel</TabsTrigger>
            </TabsList>
            
            <TabsContent value="image">
              <ImageQuizPlayer 
                questions={currentSeries.imageQuestions} 
                onComplete={handleComplete}
                courseId={courseId}
              />
            </TabsContent>
            
            <TabsContent value="text">
              <TextQuizPlayer 
                questions={currentSeries.textQuestions} 
                onComplete={handleComplete}
                courseId={courseId}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <>
            {/* If only one question type is available, show it directly */}
            {currentSeries && currentSeries.imageQuestions.length > 0 && (
              <ImageQuizPlayer 
                questions={currentSeries.imageQuestions} 
                onComplete={handleComplete}
                courseId={courseId}
              />
            )}
            
            {currentSeries && currentSeries.textQuestions.length > 0 && (
              <TextQuizPlayer 
                questions={currentSeries.textQuestions} 
                onComplete={handleComplete}
                courseId={courseId}
              />
            )}
            
            {/* If no questions are available */}
            {currentSeries && 
             currentSeries.imageQuestions.length === 0 && 
             currentSeries.textQuestions.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500">Aucune question disponible pour ce quiz.</p>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizLauncher;
