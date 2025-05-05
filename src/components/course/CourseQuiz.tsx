
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import TextQuizComponent from "./TextQuizComponent";
import QuizEditor from "./quiz/QuizEditor";
import ImageQuizPlayer from "./quiz/ImageQuizPlayer";
import { QuizSeries, ImageQuestion, TextQuestion } from "./types/quizTypes";

interface QuizSectionProps {
  questions?: ImageQuestion[];
  textQuestions?: TextQuestion[];
  onEditClick: () => void;
  seriesId?: string;
}

const CourseQuiz: React.FC<QuizSectionProps> = ({ 
  questions = [], 
  textQuestions = [],
  onEditClick,
  seriesId = "default"
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [quizSeries, setQuizSeries] = useState<QuizSeries[]>([]);
  const [currentSeriesId, setCurrentSeriesId] = useState<string>(seriesId);

  // Initialize quiz series with default or saved data
  useEffect(() => {
    try {
      const savedSeries = localStorage.getItem('quizSeries');
      if (savedSeries && savedSeries !== 'undefined') {
        const parsedSeries = JSON.parse(savedSeries);
        setQuizSeries(parsedSeries);
        
        // If no series exists, create the default series
        if (parsedSeries.length === 0) {
          const defaultSeries: QuizSeries = {
            id: "default",
            name: "Quiz par défaut",
            imageQuestions: questions,
            textQuestions: textQuestions
          };
          setQuizSeries([defaultSeries]);
          localStorage.setItem('quizSeries', JSON.stringify([defaultSeries]));
        }
      } else {
        // Initialize with the default series
        const defaultSeries: QuizSeries = {
          id: "default",
          name: "Quiz par défaut",
          imageQuestions: questions,
          textQuestions: textQuestions
        };
        setQuizSeries([defaultSeries]);
        localStorage.setItem('quizSeries', JSON.stringify([defaultSeries]));
      }
    } catch (error) {
      console.error("Error loading quiz series from localStorage:", error);
    }
  }, []);

  // Save series to localStorage whenever they change
  useEffect(() => {
    if (quizSeries.length > 0) {
      try {
        localStorage.setItem('quizSeries', JSON.stringify(quizSeries));
      } catch (error) {
        console.error("Error saving quiz series to localStorage:", error);
      }
    }
  }, [quizSeries]);

  // Get current series questions
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

  const { imageQuestions, textQuestions: currentTextQuestions } = getCurrentSeriesQuestions();

  const handleChangeSeries = (id: string) => {
    setCurrentSeriesId(id);
  };

  const sampleTextQuestions: TextQuestion[] = [
    {
      id: 1,
      question: "Quelle est la capitale de la France ?",
      options: [
        { text: "Paris", isCorrect: true },
        { text: "Lyon", isCorrect: false },
        { text: "Marseille", isCorrect: false },
        { text: "Bordeaux", isCorrect: false }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-brand-blue">Quiz d'Évaluation</h2>
          <p className="mt-2 text-gray-600">Testez vos connaissances avec ce quiz interactif.</p>
        </div>
        <Button
          onClick={() => setIsEditMode(true)}
          variant="outline"
          className="gap-2 text-brand-blue hover:bg-brand-blue/10"
        >
          <Edit2 className="h-4 w-4" />
          Éditer le Quiz
        </Button>
      </div>

      {isEditMode ? (
        <QuizEditor 
          quizSeries={quizSeries}
          setQuizSeries={setQuizSeries}
          currentSeriesId={currentSeriesId}
          setCurrentSeriesId={setCurrentSeriesId}
          onFinishEditing={() => setIsEditMode(false)}
        />
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-brand-blue hover:bg-brand-blue/90">
              Commencer le Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span>Quiz sur les méninges</span>
                  {quizSeries.length > 0 && (
                    <Select value={currentSeriesId} onValueChange={handleChangeSeries}>
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
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="image">
              <TabsList className="mb-4">
                <TabsTrigger value="image">Quiz Images</TabsTrigger>
                <TabsTrigger value="text">Quiz Texte</TabsTrigger>
              </TabsList>
              
              <TabsContent value="image">
                <ImageQuizPlayer questions={imageQuestions} />
              </TabsContent>
              
              <TabsContent value="text">
                <TextQuizComponent 
                  questions={currentTextQuestions.length > 0 ? currentTextQuestions : sampleTextQuestions} 
                  autoAdvance={true}
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CourseQuiz;
