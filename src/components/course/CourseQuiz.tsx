
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { QuizSeries } from "./types/quizTypes";
import QuizHeader from "./quiz/QuizHeader";
import QuizLauncher from "./quiz/QuizLauncher";
import { loadQuizSeries, createDefaultSeries } from "./quiz/QuizStorage";
import { useQuiz } from "./CourseQuizContext";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Log for debugging
  useEffect(() => {
    console.log(`CourseQuiz component rendered with courseId: ${courseId}`);
    console.log(`Context courseId: ${contextCourseId}`);
  }, [courseId, contextCourseId]);

  // Initialize quiz series with default or saved data
  useEffect(() => {
    try {
      setIsLoading(true);
      const loadedSeries = loadQuizSeries(courseId);
      
      if (loadedSeries.length > 0) {
        setQuizSeries(loadedSeries);
        console.log("Quiz series loaded:", loadedSeries);
      } else {
        // Initialize with default series
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
  }, [courseId, questions, textQuestions]);

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
        
        <p className="mb-4">Testez vos connaissances avec notre quiz interactif sur la neuroanatomie. Ce quiz comporte des questions à choix multiples avec des images et du texte.</p>
        
        <div className="flex flex-wrap gap-3">
          <Button 
            className="w-full bg-brand-blue hover:bg-brand-blue/90"
            onClick={handleStartQuiz}
            disabled={isLoading || quizSeries.length === 0}
          >
            <Book className="h-4 w-4 mr-2" />
            Commencer le Quiz de {courseId}
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
