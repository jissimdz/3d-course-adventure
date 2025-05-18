
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
import { useQuiz } from "./CourseQuizContext";

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
  const { courseId: contextCourseId } = useQuiz();
  const [isEditMode, setIsEditMode] = useState(false);
  const [quizSeries, setQuizSeries] = useState<QuizSeries[]>([]);
  const [currentSeriesId, setCurrentSeriesId] = useState<string>(seriesId);

  // Clé de stockage unique par cours
  const storageKey = `quizSeries_${courseId}`;

  // Log pour vérifier que le bon cours est utilisé
  useEffect(() => {
    console.log(`CourseQuiz component rendered with courseId: ${courseId}`);
    console.log(`Context courseId: ${contextCourseId}`);
  }, [courseId, contextCourseId]);

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
      name: `Quiz du cours ${courseId}`,
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

  // Si les questions sont vides, utiliser ces exemples comme fallback
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
              Commencer le Quiz de {courseId}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span>Quiz - {courseId}</span>
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
              </div>
              
              <TabsContent value="image">
                <ImageQuizPlayer 
                  questions={imageQuestions} 
                  courseId={courseId}
                />
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
