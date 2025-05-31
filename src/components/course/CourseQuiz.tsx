import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { QuizSeries } from "./types/quizTypes";
import QuizHeader from "./quiz/QuizHeader";
import QuizLauncher from "./quiz/QuizLauncher";
import QuizEditor from "./quiz/QuizEditor";
import { loadQuizSeries, createDefaultSeries, saveQuizSeries } from "./quiz/QuizStorage";
import { useQuiz } from "./CourseQuizContext";
import { Button } from "@/components/ui/button";
import { Book, Edit } from "lucide-react";

interface CourseQuizProps {
  questions?: any[];
  textQuestions?: any[];
  onEditClick: () => void;
  seriesId?: string;
  courseId: string;
}

const CourseQuiz: React.FC<CourseQuizProps> = ({ 
  questions = [], 
  textQuestions = [],
  seriesId = "default",
  courseId
}) => {
  const { courseId: contextCourseId } = useQuiz();
  const [quizSeries, setQuizSeries] = useState<QuizSeries[]>([]);
  const [currentSeriesId, setCurrentSeriesId] = useState<string>(seriesId);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Log for debugging
  useEffect(() => {
    console.log(`CourseQuiz component rendered with courseId: ${courseId}`);
    console.log(`Context courseId: ${contextCourseId}`);
  }, [courseId, contextCourseId]);

  // Initialize quiz series - only load once when component mounts
  useEffect(() => {
    const initializeQuizSeries = () => {
      try {
        setIsLoading(true);
        console.log(`Initializing quiz series for course ${courseId}...`);
        
        // Charger les séries existantes
        const loadedSeries = loadQuizSeries(courseId);
        console.log(`Loaded series:`, loadedSeries);
        
        if (loadedSeries.length > 0) {
          setQuizSeries(loadedSeries);
          console.log("Quiz series loaded successfully:", loadedSeries);
        } else {
          // Créer une série par défaut seulement si aucune n'existe
          const defaultSeries = createDefaultSeries(courseId, questions, textQuestions);
          setQuizSeries([defaultSeries]);
          console.log("Default quiz series created:", defaultSeries);
        }
        
        setHasError(false);
      } catch (error) {
        console.error("Error loading quiz series:", error);
        setHasError(true);
        toast.error("Erreur lors du chargement du quiz");
      } finally {
        setIsLoading(false);
      }
    };

    initializeQuizSeries();
  }, [courseId]); // Seulement courseId comme dépendance

  const handleStartQuiz = () => {
    console.log("Starting quiz...");
    if (quizSeries.length === 0) {
      toast.error("Aucune série de quiz disponible");
      return;
    }
    
    // Make sure currentSeriesId exists
    const seriesExists = quizSeries.some(series => series.id === currentSeriesId);
    if (!seriesExists && quizSeries.length > 0) {
      setCurrentSeriesId(quizSeries[0].id);
    }
    
    setIsQuizOpen(true);
  };

  const handleEditQuiz = () => {
    setIsEditMode(true);
  };

  const handleFinishEditing = () => {
    setIsEditMode(false);
    // Recharger les séries après édition
    const updatedSeries = loadQuizSeries(courseId);
    setQuizSeries(updatedSeries);
    toast.success("Modifications sauvegardées");
  };

  const handleQuizSeriesUpdate = (updatedSeries: QuizSeries[]) => {
    setQuizSeries(updatedSeries);
    const success = saveQuizSeries(courseId, updatedSeries);
    if (success) {
      console.log("Quiz series updated and saved successfully");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p>Chargement du quiz...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">Erreur lors du chargement du quiz</p>
        <Button onClick={() => window.location.reload()}>Réessayer</Button>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <QuizEditor
        quizSeries={quizSeries}
        setQuizSeries={handleQuizSeriesUpdate}
        currentSeriesId={currentSeriesId}
        setCurrentSeriesId={setCurrentSeriesId}
        onFinishEditing={handleFinishEditing}
        courseId={courseId}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-medium mb-4 text-brand-blue">Quiz d'évaluation : {courseId}</h3>
        
        {/* Ajout de la vidéo */}
        <div className="mb-6 aspect-video w-full overflow-hidden rounded-md">
          <iframe 
            src="https://drive.google.com/file/d/1D192QjWoOHRerEDG6P3LSkABrZo-Ih-H/preview" 
            className="w-full h-full"
            title="Introduction à la neuroanatomie"
            allow="autoplay; fullscreen" 
            frameBorder="0"
          ></iframe>
        </div>
        
        <p className="mb-4">Testez vos connaissances avec notre quiz interactif sur la neuroanatomie. Ce quiz comporte des questions à choix multiples avec des images et du texte dans la même série.</p>
        
        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-brand-blue hover:bg-brand-blue/90"
            onClick={handleStartQuiz}
            disabled={isLoading || quizSeries.length === 0}
          >
            <Book className="h-4 w-4 mr-2" />
            Commencer le Quiz de {courseId}
          </Button>
          
          <Button 
            variant="outline"
            className="text-brand-blue border-brand-blue hover:bg-brand-blue/10"
            onClick={handleEditQuiz}
          >
            <Edit className="h-4 w-4 mr-2" />
            Éditer le Quiz
          </Button>
        </div>
      </div>

      <QuizHeader 
        courseId={courseId}
        onStartQuiz={handleStartQuiz}
      />

      <QuizLauncher 
        quizSeries={quizSeries}
        currentSeriesId={currentSeriesId}
        onChangeSeriesId={setCurrentSeriesId}
        courseId={courseId}
        isOpen={isQuizOpen}
        onOpenChange={setIsQuizOpen}
      />
    </div>
  );
};

export default CourseQuiz;
