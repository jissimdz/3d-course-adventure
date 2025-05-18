
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageQuizPlayer from "./ImageQuizPlayer";
import TextQuizComponent from "../TextQuizComponent";
import { ImageQuestion, TextQuestion, QuizSeries } from "../types/quizTypes";

interface QuizLauncherProps {
  quizSeries: QuizSeries[];
  currentSeriesId: string;
  onChangeSeriesId: (id: string) => void;
  courseId: string;
}

const QuizLauncher: React.FC<QuizLauncherProps> = ({
  quizSeries,
  currentSeriesId,
  onChangeSeriesId,
  courseId
}) => {
  const [open, setOpen] = useState(false);
  
  // Get the current series
  const getCurrentSeriesQuestions = (): { imageQuestions: ImageQuestion[], textQuestions: TextQuestion[] } => {
    const currentSeries = quizSeries.find(series => series.id === currentSeriesId);
    if (currentSeries) {
      return {
        imageQuestions: currentSeries.imageQuestions,
        textQuestions: currentSeries.textQuestions
      };
    }
    return { imageQuestions: [], textQuestions: [] };
  };

  const { imageQuestions, textQuestions } = getCurrentSeriesQuestions();

  // Sample text questions as fallback
  const sampleTextQuestions: TextQuestion[] = [
    {
      id: 1,
      question: `Question spécifique au cours ${courseId}`,
      options: [
        { text: "Réponse correcte", isCorrect: true },
        { text: "Réponse incorrecte 1", isCorrect: false },
        { text: "Réponse incorrecte 2", isCorrect: false },
        { text: "Réponse incorrecte 3", isCorrect: false }
      ]
    }
  ];

  const handleStartQuiz = () => {
    setOpen(true);
  };

  return (
    <>
      <Button 
        className="w-full bg-brand-blue hover:bg-brand-blue/90"
        onClick={handleStartQuiz}
      >
        Commencer le Quiz de {courseId}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span>Quiz - {courseId}</span>
                {quizSeries.length > 0 && (
                  <Select value={currentSeriesId} onValueChange={onChangeSeriesId}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sélectionner une série" />
                    </SelectTrigger>
                    <SelectContent>
                      {quizSeries.map(series => (
                        <SelectItem key={series.id} value={series.id}>
                          {series.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="image">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="image">Quiz Images</TabsTrigger>
                <TabsTrigger value="text">Quiz Texte</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="image">
              <ImageQuizPlayer 
                questions={imageQuestions} 
                courseId={courseId}
              />
            </TabsContent>
            
            <TabsContent value="text">
              <TextQuizComponent 
                questions={textQuestions.length > 0 ? textQuestions : sampleTextQuestions} 
                autoAdvance={true}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuizLauncher;
