
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, X, Puzzle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import TextQuizComponent from "./TextQuizComponent";
import QuizEditor from "./quiz/QuizEditor";
import ImageQuizPlayer from "./quiz/ImageQuizPlayer";
import { QuizSeries, ImageQuestion, TextQuestion } from "./types/quizTypes";

interface QuizSectionProps {
  questions?: ImageQuestion[];
  textQuestions?: TextQuestion[];
  onEditClick: () => void;
  seriesId?: string;
  courseId: string;
}

const CourseQuiz: React.FC<QuizSectionProps> = ({ 
  questions = [], 
  textQuestions = [],
  onEditClick,
  seriesId = "default",
  courseId
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [quizSeries, setQuizSeries] = useState<QuizSeries[]>([]);
  const [currentSeriesId, setCurrentSeriesId] = useState<string>(seriesId);

  // Clé de stockage unique par cours
  const storageKey = `quizSeries_${courseId}`;

  // Initialiser les séries de quiz avec les données par défaut ou sauvegardées
  useEffect(() => {
    try {
      console.log(`Loading quiz series for course: ${courseId}`);
      const savedSeries = localStorage.getItem(storageKey);
      
      if (savedSeries && savedSeries !== 'undefined') {
        const parsedSeries = JSON.parse(savedSeries);
        console.log(`Loaded ${parsedSeries.length} quiz series for course: ${courseId}`);
        setQuizSeries(parsedSeries);
        
        // Si aucune série n'existe, créer la série par défaut
        if (parsedSeries.length === 0) {
          createDefaultSeries();
        }
      } else {
        // Initialiser avec la série par défaut
        createDefaultSeries();
      }
    } catch (error) {
      console.error(`Error loading quiz series from localStorage for course ${courseId}:`, error);
      createDefaultSeries();
    }
  }, [courseId]);

  // Créer une série par défaut
  const createDefaultSeries = () => {
    const defaultSeries: QuizSeries = {
      id: "default",
      name: "Quiz par défaut",
      courseId: courseId,
      imageQuestions: questions,
      textQuestions: textQuestions
    };
    setQuizSeries([defaultSeries]);
    try {
      localStorage.setItem(storageKey, JSON.stringify([defaultSeries]));
      console.log(`Created default series for course: ${courseId}`);
    } catch (error) {
      console.error(`Error saving default quiz series for course ${courseId}:`, error);
    }
  };

  // Sauvegarder les séries dans localStorage à chaque modification
  useEffect(() => {
    if (quizSeries.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(quizSeries));
        console.log(`Saved ${quizSeries.length} quiz series for course: ${courseId}`);
      } catch (error) {
        console.error(`Error saving quiz series to localStorage for course ${courseId}:`, error);
      }
    }
  }, [quizSeries, courseId, storageKey]);

  // Obtenir les questions de la série actuelle
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

  const handleFinishEditing = () => {
    setIsEditMode(false);
    // Vérifier explicitement si les modifications ont été enregistrées
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.length === quizSeries.length) {
          toast.success("Modifications enregistrées avec succès");
        }
      }
    } catch (error) {
      console.error("Error checking saved data:", error);
    }
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
        <div className="flex gap-2">
          <Button
            onClick={() => setIsEditMode(true)}
            variant="outline"
            className="gap-2 text-brand-blue hover:bg-brand-blue/10"
          >
            <Edit2 className="h-4 w-4" />
            Éditer le Quiz
          </Button>
          <Button
            asChild
            variant="outline"
            className="gap-2 text-purple-500 hover:bg-purple-500/10 border-purple-500"
          >
            <Link to="/puzzle">
              <Puzzle className="h-4 w-4" />
              Configurer le Puzzle
            </Link>
          </Button>
        </div>
      </div>

      {isEditMode ? (
        <QuizEditor 
          quizSeries={quizSeries}
          setQuizSeries={setQuizSeries}
          currentSeriesId={currentSeriesId}
          setCurrentSeriesId={setCurrentSeriesId}
          onFinishEditing={handleFinishEditing}
          courseId={courseId}
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
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="image">Quiz Images</TabsTrigger>
                  <TabsTrigger value="text">Quiz Texte</TabsTrigger>
                </TabsList>
                <Button 
                  asChild
                  variant="outline"
                  className="flex-none border-purple-500 text-purple-500 hover:bg-purple-500/10"
                >
                  <Link to="/puzzle" className="flex items-center gap-2">
                    <Puzzle size={16} />
                    Puzzle
                  </Link>
                </Button>
              </div>
              
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
