
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { QuizSeries } from "./types/quizTypes";
import QuizEditor from "./quiz/QuizEditor";
import QuizHeader from "./quiz/QuizHeader";
import QuizLauncher from "./quiz/QuizLauncher";
import { loadQuizSeries, saveQuizSeries, createDefaultSeries } from "./quiz/QuizStorage";
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
  onEditClick,
  seriesId = "default",
  courseId
}) => {
  const { courseId: contextCourseId } = useQuiz();
  const [isEditMode, setIsEditMode] = useState(false);
  const [quizSeries, setQuizSeries] = useState<QuizSeries[]>([]);
  const [currentSeriesId, setCurrentSeriesId] = useState<string>(seriesId);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Log for debugging
  useEffect(() => {
    console.log(`CourseQuiz component rendered with courseId: ${courseId}`);
    console.log(`Context courseId: ${contextCourseId}`);
  }, [courseId, contextCourseId]);

  // Initialize quiz series with default or saved data
  useEffect(() => {
    const loadedSeries = loadQuizSeries(courseId);
    
    if (loadedSeries.length > 0) {
      setQuizSeries(loadedSeries);
    } else {
      // Initialize with default series
      const defaultSeries = createDefaultSeries(courseId, questions, textQuestions);
      setQuizSeries([defaultSeries]);
      saveQuizSeries(courseId, [defaultSeries]);
    }
  }, [courseId, questions, textQuestions]);

  // Save quiz series to localStorage on change
  useEffect(() => {
    if (quizSeries.length > 0) {
      saveQuizSeries(courseId, quizSeries);
    }
  }, [quizSeries, courseId]);

  const handleEditModeChange = () => {
    setIsEditMode(prev => !prev);
  };

  const handleFinishEditing = () => {
    setIsEditMode(false);
    try {
      const loadedSeries = loadQuizSeries(courseId);
      if (loadedSeries.length === quizSeries.length) {
        toast.success("Modifications enregistrées avec succès");
      }
    } catch (error) {
      console.error("Error checking saved data:", error);
    }
  };

  const handleStartQuiz = () => {
    setIsQuizOpen(true);
  };

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
          >
            <Book className="h-4 w-4 mr-2" />
            Commencer le Quiz de {courseId}
          </Button>
        </div>
      </div>

      <QuizHeader 
        courseId={courseId}
        onStartQuiz={handleStartQuiz}
        onEditModeChange={handleEditModeChange}
      />

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
        <QuizLauncher 
          quizSeries={quizSeries}
          currentSeriesId={currentSeriesId}
          onChangeSeriesId={setCurrentSeriesId}
          courseId={courseId}
          isOpen={isQuizOpen}
          onOpenChange={setIsQuizOpen}
        />
      )}
    </div>
  );
};

export default CourseQuiz;
